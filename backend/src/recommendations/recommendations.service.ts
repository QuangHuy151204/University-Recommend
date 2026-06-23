import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from './recommendation.entity';
import { RecommendRequestDto } from './recommendation.dto';
import {
  RecommendEmptyReason,
  RecommendFiltersApplied,
  RecommendResponse,
  RecommendationResultItem,
} from './recommendation.response';
import {
  applyUniversityDiversityCap,
  classifyAdmissionTier,
  RECOMMEND_MAX_MAJORS_PER_UNIVERSITY,
  RECOMMEND_MAX_RESULTS,
} from './recommendation-tier';
import { UniversityMajor } from '../majors/university-major.entity';
import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
import { AdmissionMethodsService } from '../admission-methods/admission-methods.service';
import { isHanoiLocation } from '../common/data-scope';
import { isAnyWardPreference, wardsMatch } from '../common/ward';
import { relationStub } from '../common/typeorm-relations';
import { User } from '../users/user.entity';
import { majorMatchesInterestTerms } from '../majors/major-interest-match';
import { expandInterestPhrases } from './interest-synonyms';
import { analyzeCutoffTrend, formatScoreTrendReason } from './score-trend';

/** Sở thích placeholder — không dùng để khớp tên ngành. */
const PLACEHOLDER_INTERESTS = new Set([
  'không rõ',
  'khong ro',
  'không',
  'khong',
  'n/a',
  'na',
  'unknown',
  'bất kỳ',
  'bat ky',
  'chưa rõ',
  'chua ro',
]);

const DEFAULT_METHOD_CODE = 'THPT';
const MIN_MATCH_SCORE = 30;

type ScoredResult = {
  universityMajor: UniversityMajor;
  matchScore: number;
  reason: string[];
  admissionTier: ReturnType<typeof classifyAdmissionTier>;
  scoreDiff: number | null;
  referenceCutoff: number | null;
};

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendRepo: Repository<Recommendation>,
    @InjectRepository(UniversityMajor)
    private readonly uniMajorRepo: Repository<UniversityMajor>,
    @InjectRepository(CutoffScore)
    private readonly cutoffRepo: Repository<CutoffScore>,
    private readonly admissionMethodsService: AdmissionMethodsService,
  ) {}

  /**
   * Thuật toán gợi ý trường/ngành dựa trên:
   * - Phù hợp điểm số: 35%
   * - Phù hợp sở thích/ngành: 30%
   * - Phù hợp khu vực: 15%
   * - Phù hợp tài chính: 10%
   * - Phù hợp nghề nghiệp: 10%
   */
  async recommend(
    dto: RecommendRequestDto,
    userId?: number,
  ): Promise<RecommendResponse> {
    const effectiveMethodCode = dto.method_code?.trim() || DEFAULT_METHOD_CODE;
    const preferredWard = dto.preferred_location?.trim() || undefined;
    const effectiveDto: RecommendRequestDto = {
      ...dto,
      method_code: effectiveMethodCode,
      preferred_location: preferredWard,
    };

    const methodLabel =
      await this.admissionMethodsService.resolveLabel(effectiveMethodCode);
    const methodFilterActive = Boolean(effectiveMethodCode || methodLabel);

    const uniMajors = (
      await this.uniMajorRepo.find({
        relations: [
          'university',
          'major',
          'major.groupAssignments',
          'major.groupAssignments.group',
          'cutoffScores',
        ],
      })
    ).filter((um) => isHanoiLocation(um.university?.location));

    const rawInterests = dto.interests?.trim().toLowerCase() || '';
    const interestsActive =
      rawInterests && !this.isPlaceholderInterest(rawInterests);
    const rawPhrases = interestsActive
      ? rawInterests
          .split(/[,;]+/)
          .map((p) => p.trim())
          .filter((p) => p.length >= 2 && !this.isPlaceholderInterest(p))
      : [];
    if (
      interestsActive &&
      rawPhrases.length === 0 &&
      rawInterests.length >= 2
    ) {
      rawPhrases.push(rawInterests);
    }
    const interestPhrases =
      rawPhrases.length > 0 ? expandInterestPhrases(rawPhrases) : [];

    const filtersApplied: RecommendFiltersApplied = {
      subject_combination: dto.subject_combination?.trim() || null,
      method_code: effectiveMethodCode,
      method_label: methodLabel,
      interests: rawPhrases.length > 0 ? rawPhrases : null,
      preferred_location: preferredWard ?? null,
      budget_range: dto.budget_range ?? null,
      budget_max_yearly: dto.budget_max_yearly ?? null,
    };

    if (uniMajors.length === 0) {
      return this.emptyResponse(0, filtersApplied, 'no_data');
    }

    let filteredMajors = uniMajors;
    if (interestPhrases.length > 0) {
      const matching = uniMajors.filter(
        (um) =>
          majorMatchesInterestTerms(
            um.major?.name || '',
            um.major?.tags || [],
            um.major?.career_orientation || null,
            interestPhrases,
          ).matched,
      );
      if (matching.length > 0) {
        filteredMajors = matching;
      } else {
        return this.emptyResponse(
          uniMajors.length,
          filtersApplied,
          'no_interest_match',
        );
      }
    }

    const userCombo = dto.subject_combination?.trim();
    if (userCombo) {
      const withCombo = filteredMajors.filter((um) =>
        this.majorAcceptsCombination(um.cutoffScores, userCombo),
      );
      if (withCombo.length > 0) {
        filteredMajors = withCombo;
      } else {
        return this.emptyResponse(
          filteredMajors.length,
          filtersApplied,
          'no_subject_combination',
        );
      }
    }

    const results: ScoredResult[] = [];
    for (const um of filteredMajors) {
      const referenceCutoff = this.getLatestCutoff(
        um.cutoffScores,
        dto.subject_combination,
        methodLabel,
        effectiveMethodCode,
      );
      const scoreDiff =
        referenceCutoff !== null ? dto.expected_score - referenceCutoff : null;
      const { score, reason } = this.calculateMatchScore(
        um,
        effectiveDto,
        methodLabel,
        methodFilterActive,
        referenceCutoff,
      );
      if (score > MIN_MATCH_SCORE) {
        results.push({
          universityMajor: um,
          matchScore: score,
          reason,
          admissionTier: classifyAdmissionTier(scoreDiff),
          scoreDiff,
          referenceCutoff,
        });
      }
    }

    results.sort((a, b) => b.matchScore - a.matchScore);
    const dedupedResults = this.dedupeEquivalentResults(results);

    if (dedupedResults.length === 0) {
      return this.emptyResponse(
        filteredMajors.length,
        filtersApplied,
        'no_score_match',
      );
    }

    const { items: diversified, capped } = applyUniversityDiversityCap(
      dedupedResults.map((r) => ({
        ...r,
        universityId: r.universityMajor.university?.id ?? null,
      })),
      RECOMMEND_MAX_RESULTS,
      RECOMMEND_MAX_MAJORS_PER_UNIVERSITY,
    );
    const topResults = diversified;

    if (userId && topResults.length > 0) {
      const toSave = diversified.slice(0, 10);
      await this.recommendRepo.delete({ user: { id: userId } });

      for (const r of toSave) {
        const rec = this.recommendRepo.create({
          user: relationStub<User>(userId),
          universityMajor: relationStub<UniversityMajor>(r.universityMajor.id),
          match_score: r.matchScore,
          reason: r.reason.join('; '),
        });
        await this.recommendRepo.save(rec);
      }
    }

    return {
      results: topResults.map((r) =>
        this.toResultItem(r, effectiveDto, methodLabel),
      ),
      meta: {
        totalCandidates: filteredMajors.length,
        filtersApplied,
        emptyReason: null,
        diversified: capped,
      },
    };
  }

  private emptyResponse(
    totalCandidates: number,
    filtersApplied: RecommendFiltersApplied,
    emptyReason: RecommendEmptyReason,
  ): RecommendResponse {
    return {
      results: [],
      meta: {
        totalCandidates,
        filtersApplied,
        emptyReason,
        diversified: false,
      },
    };
  }

  private mapMajorGroups(
    major: UniversityMajor['major'],
  ): RecommendationResultItem['major']['groups'] {
    const assignments = major?.groupAssignments ?? [];
    return assignments
      .map((a) => ({
        group_id: a.group_id,
        group_name: a.group?.group_name ?? a.group_id,
        is_primary: a.is_primary,
      }))
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary));
  }

  private toResultItem(
    r: ScoredResult,
    dto: RecommendRequestDto,
    methodLabel: string | null,
  ): RecommendationResultItem {
    return {
      id: r.universityMajor.id,
      university: {
        id: r.universityMajor.university?.id,
        name: r.universityMajor.university?.name,
        short_name: r.universityMajor.university?.short_name,
        location: r.universityMajor.university?.location,
        type: r.universityMajor.university?.type,
        tuition_fee_min: r.universityMajor.university?.tuition_fee_min,
        tuition_fee_max: r.universityMajor.university?.tuition_fee_max,
        website: r.universityMajor.university?.website,
      },
      major: {
        id: r.universityMajor.major?.id,
        name: r.universityMajor.major?.name,
        code: r.universityMajor.major?.code,
        field_group: r.universityMajor.major?.field_group,
        tags: r.universityMajor.major?.tags ?? [],
        groups: this.mapMajorGroups(r.universityMajor.major),
      },
      tuition_fee: r.universityMajor.tuition_fee,
      cutoffScores: this.pickDisplayCutoffs(
        r.universityMajor.cutoffScores,
        dto,
        methodLabel,
      ),
      matchScore: Math.round(r.matchScore),
      admissionTier: r.admissionTier,
      scoreDiff: r.scoreDiff,
      referenceCutoff: r.referenceCutoff,
      reason: r.reason,
    };
  }

  /**
   * Loại trùng khi cùng trường + cùng tên ngành (không phân biệt hoa/thường/dấu).
   * Trường hợp DB còn bản ghi lịch sử (vd "Khoa học dữ liệu" vs "Khoa học Dữ liệu")
   * chỉ giữ item có điểm cao hơn.
   */
  private dedupeEquivalentResults(results: ScoredResult[]): ScoredResult[] {
    const seen = new Set<string>();
    const deduped: ScoredResult[] = [];

    for (const item of results) {
      const uniId = item.universityMajor.university?.id ?? -1;
      const majorName = item.universityMajor.major?.name ?? '';
      const key = `${uniId}|${this.normalizeComparableText(majorName)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(item);
    }

    return deduped;
  }

  private normalizeComparableText(input: string): string {
    return input
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private calculateMatchScore(
    um: UniversityMajor,
    dto: RecommendRequestDto,
    methodLabel: string | null,
    methodFilterActive: boolean,
    latestCutoff: number | null,
  ): { score: number; reason: string[] } {
    let score = 0;
    const reason: string[] = [];
    const methodSuffix = methodLabel ? ` (${methodLabel})` : '';

    // === 1. Phù hợp điểm số (35%) ===
    if (latestCutoff !== null) {
      const diff = dto.expected_score - latestCutoff;
      let scorePoints = 0;
      if (diff >= 0 && diff <= 2) {
        scorePoints = 35;
        reason.push(
          `Điểm dự kiến phù hợp (chuẩn ${latestCutoff}${methodSuffix})`,
        );
      } else if (diff > 2 && diff <= 5) {
        scorePoints = 28;
        reason.push(
          `Điểm dự kiến cao hơn điểm chuẩn (${latestCutoff}${methodSuffix})`,
        );
      } else if (diff > 5) {
        scorePoints = 20;
        reason.push(
          `Điểm dự kiến cao hơn điểm chuẩn khá nhiều (${latestCutoff}${methodSuffix})`,
        );
      } else if (diff < 0 && diff >= -1) {
        scorePoints = 15;
        reason.push(
          `Điểm dự kiến hơi thấp hơn điểm chuẩn (${latestCutoff}${methodSuffix}), cần cố gắng thêm`,
        );
      } else {
        scorePoints = 0;
      }
      score += scorePoints;

      const trend = analyzeCutoffTrend(
        um.cutoffScores,
        dto.subject_combination,
      );
      if (trend) {
        reason.push(formatScoreTrendReason(trend));
        if (trend.direction === 'rising') score -= 2;
        else if (trend.direction === 'falling') score += 2;
      }
    } else if (methodFilterActive) {
      score += 0;
      if (methodLabel) {
        reason.push(
          `Chưa có điểm chuẩn phương thức ${methodLabel} cho ngành này`,
        );
      }
    } else {
      score += 18;
    }

    // === 2. Phù hợp sở thích/ngành (30%) ===
    const rawInterests = dto.interests?.trim().toLowerCase() || '';
    const majorName = um.major?.name || '';
    const careerOrientation = um.major?.career_orientation || null;
    const majorTags = um.major?.tags || [];

    let interestScore = 0;
    let interestMatched = false;

    if (rawInterests && !this.isPlaceholderInterest(rawInterests)) {
      const rawPhrases = rawInterests
        .split(/[,;]+/)
        .map((p) => p.trim())
        .filter((p) => p.length >= 2 && !this.isPlaceholderInterest(p));

      if (
        rawPhrases.length === 0 &&
        rawInterests.length >= 2 &&
        !this.isPlaceholderInterest(rawInterests)
      ) {
        rawPhrases.push(rawInterests);
      }

      const interestPhrases = expandInterestPhrases(rawPhrases);
      const match = majorMatchesInterestTerms(
        majorName,
        majorTags,
        careerOrientation,
        interestPhrases,
      );
      if (match.matched) {
        interestScore = match.score;
        interestMatched = true;
        if (match.reason) reason.push(match.reason);
      }
    }

    if (
      rawInterests &&
      !this.isPlaceholderInterest(rawInterests) &&
      !interestMatched
    ) {
      interestScore = -10;
    }

    score += interestScore;

    // === 3. Phù hợp khu vực / phường (15%) ===
    if (
      dto.preferred_location &&
      !isAnyWardPreference(dto.preferred_location)
    ) {
      const universityWard = um.university?.ward || null;
      if (wardsMatch(universityWard, dto.preferred_location)) {
        score += 15;
        reason.push(`Trường tại ${universityWard} đúng khu vực bạn chọn`);
      } else {
        score += 5;
      }
    } else {
      score += 10;
    }

    // === 4. Phù hợp tài chính (10%) ===
    const numericBudgetActive =
      typeof dto.budget_max_yearly === 'number' && dto.budget_max_yearly >= 0;
    if ((dto.budget_range || numericBudgetActive) && um.university) {
      const tuitionMin = um.university.tuition_fee_min || 0;
      const tuitionMax = um.university.tuition_fee_max || 999999999;
      const avgTuition = (tuitionMin + tuitionMax) / 2;

      const budgetMap = {
        low: 15_000_000,
        medium: 30_000_000,
        high: 999_000_000,
      };
      const maxBudget = numericBudgetActive
        ? dto.budget_max_yearly!
        : budgetMap[dto.budget_range!];

      if (avgTuition <= maxBudget) {
        score += 10;
        reason.push(
          numericBudgetActive
            ? `Học phí phù hợp ngân sách tối đa (${Math.round(maxBudget / 1_000_000)} triệu/năm)`
            : `Học phí phù hợp với khả năng tài chính`,
        );
      } else {
        score += 2;
      }
    } else {
      score += 7;
    }

    // === 5. Phù hợp nghề nghiệp mong muốn (10%) ===
    if (dto.career_goal) {
      const careerGoalWords = dto.career_goal
        .toLowerCase()
        .split(/[,\s]+/)
        .filter(Boolean);
      const orientation = (um.major?.career_orientation || '').toLowerCase();
      const hasMatch = careerGoalWords.some((w) => orientation.includes(w));
      if (hasMatch) {
        score += 10;
        reason.push(
          `Ngành ${um.major?.name} mở ra nghề nghiệp phù hợp mục tiêu`,
        );
      } else {
        score += 4;
      }
    } else {
      score += 6;
    }

    return { score: Math.min(score, 100), reason };
  }

  private cutoffMatchesMethod(
    cutoff: CutoffScore,
    methodLabel: string | null,
    methodCode?: string,
  ): boolean {
    const stored = (cutoff.admission_method ?? '').toLowerCase();
    if (!stored) return false;
    if (methodLabel && stored.includes(methodLabel.toLowerCase())) {
      return true;
    }
    const code = methodCode?.trim().toLowerCase();
    return Boolean(code && stored.includes(code));
  }

  private filterCutoffsByMethod(
    cutoffScores: CutoffScore[] | undefined,
    methodLabel: string | null,
    methodCode?: string,
  ): CutoffScore[] {
    if (!methodLabel && !methodCode?.trim()) {
      return cutoffScores ?? [];
    }
    return (cutoffScores ?? []).filter((c) =>
      this.cutoffMatchesMethod(c, methodLabel, methodCode),
    );
  }

  private pickDisplayCutoffs(
    cutoffScores: CutoffScore[] | undefined,
    dto: RecommendRequestDto,
    methodLabel: string | null,
  ): CutoffScore[] | undefined {
    const filtered = this.filterCutoffsByMethod(
      cutoffScores,
      methodLabel,
      dto.method_code,
    );
    const pool = filtered.length > 0 ? filtered : (cutoffScores ?? []);
    const combo = dto.subject_combination?.trim();
    const byCombo = combo
      ? pool.filter((c) => this.cutoffHasSubjectCombination(c, combo))
      : [];
    const displayPool = byCombo.length > 0 ? byCombo : pool;
    return [...displayPool].sort((a, b) => b.year - a.year).slice(0, 3);
  }

  private getLatestCutoff(
    cutoffScores: CutoffScore[],
    subjectCombination: string,
    methodLabel: string | null,
    methodCode?: string,
  ): number | null {
    const pool = this.filterCutoffsByMethod(
      cutoffScores,
      methodLabel,
      methodCode,
    );
    if (!pool.length) return null;

    const sameCombo = pool
      .filter(
        (c) =>
          c.subject_combination?.toLowerCase() ===
          subjectCombination?.toLowerCase(),
      )
      .sort((a, b) => b.year - a.year);

    if (sameCombo.length > 0) return sameCombo[0].score;

    return null;
  }

  private isPlaceholderInterest(value: string): boolean {
    const n = value.trim().toLowerCase();
    return PLACEHOLDER_INTERESTS.has(n);
  }

  private normalizeCombo(code: string): string {
    return code.trim().toUpperCase();
  }

  private cutoffHasSubjectCombination(
    cutoff: CutoffScore,
    subjectCombination: string,
  ): boolean {
    const want = this.normalizeCombo(subjectCombination);
    if (!want) return true;
    const stored = (cutoff.subject_combination ?? '').trim();
    if (!stored) return false;
    if (this.normalizeCombo(stored) === want) return true;
    return stored
      .split(/[,;/]+/)
      .map((s) => this.normalizeCombo(s))
      .some((c) => c === want);
  }

  private majorAcceptsCombination(
    cutoffScores: CutoffScore[] | undefined,
    subjectCombination: string,
  ): boolean {
    return (cutoffScores ?? []).some((c) =>
      this.cutoffHasSubjectCombination(c, subjectCombination),
    );
  }

  async getMyRecommendations(userId: number) {
    return this.recommendRepo.find({
      where: { user: { id: userId } },
      relations: [
        'universityMajor',
        'universityMajor.university',
        'universityMajor.major',
      ],
      order: { match_score: 'DESC' },
    });
  }
}
