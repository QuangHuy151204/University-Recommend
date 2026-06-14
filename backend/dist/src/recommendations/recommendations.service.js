"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const recommendation_entity_1 = require("./recommendation.entity");
const recommendation_tier_1 = require("./recommendation-tier");
const university_major_entity_1 = require("../majors/university-major.entity");
const cutoff_score_entity_1 = require("../cutoff-scores/cutoff-score.entity");
const admission_methods_service_1 = require("../admission-methods/admission-methods.service");
const data_scope_1 = require("../common/data-scope");
const typeorm_relations_1 = require("../common/typeorm-relations");
const major_interest_match_1 = require("../majors/major-interest-match");
const interest_synonyms_1 = require("./interest-synonyms");
const score_trend_1 = require("./score-trend");
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
let RecommendationsService = class RecommendationsService {
    recommendRepo;
    uniMajorRepo;
    cutoffRepo;
    admissionMethodsService;
    constructor(recommendRepo, uniMajorRepo, cutoffRepo, admissionMethodsService) {
        this.recommendRepo = recommendRepo;
        this.uniMajorRepo = uniMajorRepo;
        this.cutoffRepo = cutoffRepo;
        this.admissionMethodsService = admissionMethodsService;
    }
    async recommend(dto, userId) {
        const effectiveMethodCode = dto.method_code?.trim() || DEFAULT_METHOD_CODE;
        const effectiveDto = {
            ...dto,
            method_code: effectiveMethodCode,
            preferred_location: data_scope_1.DATA_SCOPE_LOCATION,
        };
        const methodLabel = await this.admissionMethodsService.resolveLabel(effectiveMethodCode);
        const methodFilterActive = Boolean(effectiveMethodCode || methodLabel);
        const uniMajors = (await this.uniMajorRepo.find({
            relations: [
                'university',
                'major',
                'major.groupAssignments',
                'major.groupAssignments.group',
                'cutoffScores',
            ],
        })).filter((um) => (0, data_scope_1.isHanoiLocation)(um.university?.location));
        const rawInterests = dto.interests?.trim().toLowerCase() || '';
        const interestsActive = rawInterests && !this.isPlaceholderInterest(rawInterests);
        const rawPhrases = interestsActive
            ? rawInterests
                .split(/[,;]+/)
                .map((p) => p.trim())
                .filter((p) => p.length >= 2 && !this.isPlaceholderInterest(p))
            : [];
        if (interestsActive &&
            rawPhrases.length === 0 &&
            rawInterests.length >= 2) {
            rawPhrases.push(rawInterests);
        }
        const interestPhrases = rawPhrases.length > 0 ? (0, interest_synonyms_1.expandInterestPhrases)(rawPhrases) : [];
        const filtersApplied = {
            subject_combination: dto.subject_combination?.trim() || null,
            method_code: effectiveMethodCode,
            method_label: methodLabel,
            interests: rawPhrases.length > 0 ? rawPhrases : null,
            preferred_location: data_scope_1.DATA_SCOPE_LOCATION,
            budget_range: dto.budget_range ?? null,
            budget_max_yearly: dto.budget_max_yearly ?? null,
        };
        if (uniMajors.length === 0) {
            return this.emptyResponse(0, filtersApplied, 'no_data');
        }
        let filteredMajors = uniMajors;
        if (interestPhrases.length > 0) {
            const matching = uniMajors.filter((um) => (0, major_interest_match_1.majorMatchesInterestTerms)(um.major?.name || '', um.major?.tags || [], um.major?.career_orientation || null, interestPhrases).matched);
            if (matching.length > 0) {
                filteredMajors = matching;
            }
            else {
                return this.emptyResponse(uniMajors.length, filtersApplied, 'no_interest_match');
            }
        }
        const userCombo = dto.subject_combination?.trim();
        if (userCombo) {
            const withCombo = filteredMajors.filter((um) => this.majorAcceptsCombination(um.cutoffScores, userCombo));
            if (withCombo.length > 0) {
                filteredMajors = withCombo;
            }
            else {
                return this.emptyResponse(filteredMajors.length, filtersApplied, 'no_subject_combination');
            }
        }
        const results = [];
        for (const um of filteredMajors) {
            const referenceCutoff = this.getLatestCutoff(um.cutoffScores, dto.subject_combination, methodLabel, effectiveMethodCode);
            const scoreDiff = referenceCutoff !== null ? dto.expected_score - referenceCutoff : null;
            const { score, reason } = this.calculateMatchScore(um, effectiveDto, methodLabel, methodFilterActive, referenceCutoff);
            if (score > MIN_MATCH_SCORE) {
                results.push({
                    universityMajor: um,
                    matchScore: score,
                    reason,
                    admissionTier: (0, recommendation_tier_1.classifyAdmissionTier)(scoreDiff),
                    scoreDiff,
                    referenceCutoff,
                });
            }
        }
        results.sort((a, b) => b.matchScore - a.matchScore);
        const dedupedResults = this.dedupeEquivalentResults(results);
        if (dedupedResults.length === 0) {
            return this.emptyResponse(filteredMajors.length, filtersApplied, 'no_score_match');
        }
        const { items: diversified, capped } = (0, recommendation_tier_1.applyUniversityDiversityCap)(dedupedResults.map((r) => ({
            ...r,
            universityId: r.universityMajor.university?.id ?? null,
        })), recommendation_tier_1.RECOMMEND_MAX_RESULTS, recommendation_tier_1.RECOMMEND_MAX_MAJORS_PER_UNIVERSITY);
        const topResults = diversified;
        if (userId && topResults.length > 0) {
            const toSave = diversified.slice(0, 10);
            await this.recommendRepo.delete({ user: { id: userId } });
            for (const r of toSave) {
                const rec = this.recommendRepo.create({
                    user: (0, typeorm_relations_1.relationStub)(userId),
                    universityMajor: (0, typeorm_relations_1.relationStub)(r.universityMajor.id),
                    match_score: r.matchScore,
                    reason: r.reason.join('; '),
                });
                await this.recommendRepo.save(rec);
            }
        }
        return {
            results: topResults.map((r) => this.toResultItem(r, effectiveDto, methodLabel)),
            meta: {
                totalCandidates: filteredMajors.length,
                filtersApplied,
                emptyReason: null,
                diversified: capped,
            },
        };
    }
    emptyResponse(totalCandidates, filtersApplied, emptyReason) {
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
    mapMajorGroups(major) {
        const assignments = major?.groupAssignments ?? [];
        return assignments
            .map((a) => ({
            group_id: a.group_id,
            group_name: a.group?.group_name ?? a.group_id,
            is_primary: a.is_primary,
        }))
            .sort((a, b) => Number(b.is_primary) - Number(a.is_primary));
    }
    toResultItem(r, dto, methodLabel) {
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
            cutoffScores: this.pickDisplayCutoffs(r.universityMajor.cutoffScores, dto, methodLabel),
            matchScore: Math.round(r.matchScore),
            admissionTier: r.admissionTier,
            scoreDiff: r.scoreDiff,
            referenceCutoff: r.referenceCutoff,
            reason: r.reason,
        };
    }
    dedupeEquivalentResults(results) {
        const seen = new Set();
        const deduped = [];
        for (const item of results) {
            const uniId = item.universityMajor.university?.id ?? -1;
            const majorName = item.universityMajor.major?.name ?? '';
            const key = `${uniId}|${this.normalizeComparableText(majorName)}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            deduped.push(item);
        }
        return deduped;
    }
    normalizeComparableText(input) {
        return input
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{M}/gu, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    calculateMatchScore(um, dto, methodLabel, methodFilterActive, latestCutoff) {
        let score = 0;
        const reason = [];
        const methodSuffix = methodLabel ? ` (${methodLabel})` : '';
        if (latestCutoff !== null) {
            const diff = dto.expected_score - latestCutoff;
            let scorePoints = 0;
            if (diff >= 0 && diff <= 2) {
                scorePoints = 35;
                reason.push(`Điểm dự kiến phù hợp (chuẩn ${latestCutoff}${methodSuffix})`);
            }
            else if (diff > 2 && diff <= 5) {
                scorePoints = 28;
                reason.push(`Điểm dự kiến cao hơn điểm chuẩn (${latestCutoff}${methodSuffix})`);
            }
            else if (diff > 5) {
                scorePoints = 20;
                reason.push(`Điểm dự kiến cao hơn điểm chuẩn khá nhiều (${latestCutoff}${methodSuffix})`);
            }
            else if (diff < 0 && diff >= -1) {
                scorePoints = 15;
                reason.push(`Điểm dự kiến hơi thấp hơn điểm chuẩn (${latestCutoff}${methodSuffix}), cần cố gắng thêm`);
            }
            else {
                scorePoints = 0;
            }
            score += scorePoints;
            const trend = (0, score_trend_1.analyzeCutoffTrend)(um.cutoffScores, dto.subject_combination);
            if (trend) {
                reason.push((0, score_trend_1.formatScoreTrendReason)(trend));
                if (trend.direction === 'rising')
                    score -= 2;
                else if (trend.direction === 'falling')
                    score += 2;
            }
        }
        else if (methodFilterActive) {
            score += 0;
            if (methodLabel) {
                reason.push(`Chưa có điểm chuẩn phương thức ${methodLabel} cho ngành này`);
            }
        }
        else {
            score += 18;
        }
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
            if (rawPhrases.length === 0 &&
                rawInterests.length >= 2 &&
                !this.isPlaceholderInterest(rawInterests)) {
                rawPhrases.push(rawInterests);
            }
            const interestPhrases = (0, interest_synonyms_1.expandInterestPhrases)(rawPhrases);
            const match = (0, major_interest_match_1.majorMatchesInterestTerms)(majorName, majorTags, careerOrientation, interestPhrases);
            if (match.matched) {
                interestScore = match.score;
                interestMatched = true;
                if (match.reason)
                    reason.push(match.reason);
            }
        }
        if (rawInterests &&
            !this.isPlaceholderInterest(rawInterests) &&
            !interestMatched) {
            interestScore = -10;
        }
        score += interestScore;
        if (dto.preferred_location) {
            const location = (um.university?.location || '').toLowerCase();
            const preferred = dto.preferred_location.toLowerCase();
            if (preferred === 'bất kỳ' || preferred === 'bat ky') {
                score += 15;
            }
            else if (location.includes(preferred)) {
                score += 15;
                reason.push(`Trường tại ${um.university?.location} đúng khu vực bạn muốn`);
            }
            else {
                score += 5;
            }
        }
        else {
            score += 10;
        }
        const numericBudgetActive = typeof dto.budget_max_yearly === 'number' && dto.budget_max_yearly >= 0;
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
                ? dto.budget_max_yearly
                : budgetMap[dto.budget_range];
            if (avgTuition <= maxBudget) {
                score += 15;
                reason.push(numericBudgetActive
                    ? `Học phí phù hợp ngân sách tối đa (${Math.round(maxBudget / 1_000_000)} triệu/năm)`
                    : `Học phí phù hợp với khả năng tài chính`);
            }
            else {
                score += 3;
            }
        }
        else {
            score += 10;
        }
        if (dto.career_goal) {
            const careerGoalWords = dto.career_goal
                .toLowerCase()
                .split(/[,\s]+/)
                .filter(Boolean);
            const orientation = (um.major?.career_orientation || '').toLowerCase();
            const hasMatch = careerGoalWords.some((w) => orientation.includes(w));
            if (hasMatch) {
                score += 5;
                reason.push(`Ngành ${um.major?.name} mở ra nghề nghiệp phù hợp mục tiêu`);
            }
            else {
                score += 2;
            }
        }
        else {
            score += 3;
        }
        return { score: Math.min(score, 100), reason };
    }
    cutoffMatchesMethod(cutoff, methodLabel, methodCode) {
        const stored = (cutoff.admission_method ?? '').toLowerCase();
        if (!stored)
            return false;
        if (methodLabel && stored.includes(methodLabel.toLowerCase())) {
            return true;
        }
        const code = methodCode?.trim().toLowerCase();
        return Boolean(code && stored.includes(code));
    }
    filterCutoffsByMethod(cutoffScores, methodLabel, methodCode) {
        if (!methodLabel && !methodCode?.trim()) {
            return cutoffScores ?? [];
        }
        return (cutoffScores ?? []).filter((c) => this.cutoffMatchesMethod(c, methodLabel, methodCode));
    }
    pickDisplayCutoffs(cutoffScores, dto, methodLabel) {
        const filtered = this.filterCutoffsByMethod(cutoffScores, methodLabel, dto.method_code);
        const pool = filtered.length > 0 ? filtered : (cutoffScores ?? []);
        const combo = dto.subject_combination?.trim();
        const byCombo = combo
            ? pool.filter((c) => this.cutoffHasSubjectCombination(c, combo))
            : [];
        const displayPool = byCombo.length > 0 ? byCombo : pool;
        return [...displayPool].sort((a, b) => b.year - a.year).slice(0, 3);
    }
    getLatestCutoff(cutoffScores, subjectCombination, methodLabel, methodCode) {
        const pool = this.filterCutoffsByMethod(cutoffScores, methodLabel, methodCode);
        if (!pool.length)
            return null;
        const sameCombo = pool
            .filter((c) => c.subject_combination?.toLowerCase() ===
            subjectCombination?.toLowerCase())
            .sort((a, b) => b.year - a.year);
        if (sameCombo.length > 0)
            return sameCombo[0].score;
        return null;
    }
    isPlaceholderInterest(value) {
        const n = value.trim().toLowerCase();
        return PLACEHOLDER_INTERESTS.has(n);
    }
    normalizeCombo(code) {
        return code.trim().toUpperCase();
    }
    cutoffHasSubjectCombination(cutoff, subjectCombination) {
        const want = this.normalizeCombo(subjectCombination);
        if (!want)
            return true;
        const stored = (cutoff.subject_combination ?? '').trim();
        if (!stored)
            return false;
        if (this.normalizeCombo(stored) === want)
            return true;
        return stored
            .split(/[,;/]+/)
            .map((s) => this.normalizeCombo(s))
            .some((c) => c === want);
    }
    majorAcceptsCombination(cutoffScores, subjectCombination) {
        return (cutoffScores ?? []).some((c) => this.cutoffHasSubjectCombination(c, subjectCombination));
    }
    async getMyRecommendations(userId) {
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
};
exports.RecommendationsService = RecommendationsService;
exports.RecommendationsService = RecommendationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(recommendation_entity_1.Recommendation)),
    __param(1, (0, typeorm_1.InjectRepository)(university_major_entity_1.UniversityMajor)),
    __param(2, (0, typeorm_1.InjectRepository)(cutoff_score_entity_1.CutoffScore)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        admission_methods_service_1.AdmissionMethodsService])
], RecommendationsService);
//# sourceMappingURL=recommendations.service.js.map