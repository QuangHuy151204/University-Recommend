/**
 * 50 kịch bản tra cứu PHỔ BIẾN (nhiều trường thỏa điều kiện).
 * Kiểm tra: (1) trường trả về đúng điều kiện, (2) không thiếu trường hợp lệ.
 * Usage: npm run test:university-filter-50-popular
 */
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import dataSource from '../src/data-source';
import { DATA_SCOPE_LOCATION } from '../src/common/data-scope';
import { CUTOFF_FILTER_YEARS } from '../src/common/subject-combination';
import { University } from '../src/universities/university.entity';
import { Major } from '../src/majors/major.entity';
import { UniversitiesService } from '../src/universities/universities.service';
import type { QueryUniversityDto } from '../src/universities/university.dto';
import {
  evaluateUniversityFilter,
  resolveMajorIdsForFilter,
  type FilterDataset,
  type UniversityFilterQuery,
} from '../src/universities/university-filter-evaluator';
import {
  universityMajorPassesCutoffFilter,
  type CutoffFilterRow,
} from '../src/universities/university-cutoff-filter';
import { resolveMajorIdFromCatalog } from './university-filter-scenarios';

dotenv.config({ path: resolve(__dirname, '../.env') });

type LoadedDataset = FilterDataset & {
  wards: string[];
};

type PopularCase = {
  id: string;
  label: string;
  query: UniversityFilterQuery;
};

type CaseResult = {
  case: PopularCase;
  expected: number;
  api: number;
  missing: string[];
  extra: string[];
  invalidInApi: string[];
  ms: number;
  ok: boolean;
};

async function loadDataset(): Promise<LoadedDataset> {
  const scope = `%${DATA_SCOPE_LOCATION}%`;
  const years = [...CUTOFF_FILTER_YEARS];
  const [universities, universityMajors, cutoffs, catalog, wardRows] =
    await Promise.all([
      dataSource.query(
        `SELECT id, name, short_name, location, ward, type, tuition_fee_min
         FROM universities WHERE location ILIKE $1`,
        [scope],
      ),
      dataSource.query(
        `SELECT um.id, um.university_id, um.major_id
         FROM university_majors um
         JOIN universities u ON u.id = um.university_id
         WHERE u.location ILIKE $1`,
        [scope],
      ),
      dataSource.query(
        `SELECT cs.university_major_id, cs.year, cs.subject_combination, cs.score
         FROM cutoff_scores cs
         JOIN university_majors um ON um.id = cs.university_major_id
         JOIN universities u ON u.id = um.university_id
         WHERE u.location ILIKE $1 AND cs.year = ANY($2::int[])`,
        [scope, years],
      ),
      dataSource.query(`SELECT id, name FROM majors`),
      dataSource.query(
        `SELECT ward, COUNT(*)::int AS cnt
         FROM universities
         WHERE ward IS NOT NULL AND TRIM(ward) <> '' AND location ILIKE $1
         GROUP BY ward ORDER BY cnt DESC`,
        [scope],
      ),
    ]);

  return {
    universities,
    universityMajors,
    cutoffs,
    catalog,
    wards: wardRows.map((r: { ward: string }) => r.ward),
  };
}

function idToLabel(ids: number[], dataset: FilterDataset): string[] {
  const byId = new Map(dataset.universities.map((u) => [u.id, u.short_name]));
  return ids.map((id) => byId.get(id) ?? `#${id}`);
}

function reverseValidateResults(
  dataset: FilterDataset,
  query: UniversityFilterQuery,
  ids: Set<number>,
): string[] {
  const majorIds = resolveMajorIdsForFilter(dataset.catalog, query.major_id);
  const cutoffInput = {
    subject_combination: query.subject_combination,
    min_score: query.min_score,
  };

  const cutoffsByUm = new Map<number, CutoffFilterRow[]>();
  for (const c of dataset.cutoffs) {
    const list = cutoffsByUm.get(c.university_major_id) ?? [];
    list.push({
      year: c.year,
      subject_combination: c.subject_combination,
      score: c.score,
    });
    cutoffsByUm.set(c.university_major_id, list);
  }

  const umsByUni = new Map<number, typeof dataset.universityMajors>();
  for (const um of dataset.universityMajors) {
    const list = umsByUni.get(um.university_id) ?? [];
    list.push(um);
    umsByUni.set(um.university_id, list);
  }

  const invalid: string[] = [];
  for (const uniId of ids) {
    const uni = dataset.universities.find((u) => u.id === uniId);
    if (query.ward?.trim()) {
      const want = query.ward.trim().toLowerCase();
      const have = (uni?.ward ?? '').trim().toLowerCase();
      if (!have.includes(want)) {
        invalid.push(`${uni?.short_name ?? uniId} (sai phường)`);
        continue;
      }
    }
    const ums = umsByUni.get(uniId) ?? [];
    const ok = ums.some((um) => {
      if (majorIds?.length && !majorIds.includes(um.major_id)) return false;
      return universityMajorPassesCutoffFilter(
        cutoffsByUm.get(um.id) ?? [],
        cutoffInput,
      );
    });
    if (!ok) invalid.push(uni?.short_name ?? `#${uniId}`);
  }
  return invalid;
}

/** Xếp hạng tổ hợp / ngành / điểm theo số trường thỏa (để chọn case phổ biến). */
function rankPopularDimensions(dataset: FilterDataset) {
  const combos = ['A00', 'A01', 'A02', 'B00', 'B01', 'C00', 'C01', 'D01', 'D03', 'D07'];
  const scores = [22, 23, 24, 25, 26, 27, 28, 29, 30];
  const majorNames = [
    'Công nghệ Thông tin',
    'Hệ thống thông tin',
    'Kế toán',
    'Quản trị Kinh doanh',
    'Luật',
    'Marketing',
    'Y khoa',
    'Kỹ thuật Xây dựng',
    'Ngôn ngữ Anh',
    'Tài chính - Ngân hàng',
  ];

  const comboRank = combos
    .map((c) => ({
      combo: c,
      count: evaluateUniversityFilter(dataset, { subject_combination: c }).size,
    }))
    .sort((a, b) => b.count - a.count);

  const scoreRank = scores
    .map((s) => ({
      score: s,
      count: evaluateUniversityFilter(dataset, { min_score: s }).size,
    }))
    .sort((a, b) => b.count - a.count);

  const majorRank = majorNames
    .map((name) => {
      const id = resolveMajorIdFromCatalog(dataset.catalog, name);
      if (!id) return null;
      return {
        name,
        id,
        count: evaluateUniversityFilter(dataset, { major_id: id }).size,
      };
    })
    .filter((x): x is { name: string; id: number; count: number } => x != null)
    .sort((a, b) => b.count - a.count);

  return { comboRank, scoreRank, majorRank };
}

/** 50 case phổ biến: ưu tiên tổ hợp/ngành/điểm có nhiều trường. */
export function buildFiftyPopularCases(
  dataset: FilterDataset,
  wards: string[],
): PopularCase[] {
  const { comboRank, scoreRank, majorRank } = rankPopularDimensions(dataset);
  const topCombos = comboRank.slice(0, 6).map((x) => x.combo);
  const topScores = scoreRank.slice(0, 6).map((x) => x.score);
  const topMajors = majorRank.slice(0, 8);
  const topWards = wards.slice(0, 10);

  const cases: PopularCase[] = [];
  const seen = new Set<string>();

  const add = (id: string, label: string, query: UniversityFilterQuery) => {
    const key = JSON.stringify(query);
    if (seen.has(key)) return;
    const count = evaluateUniversityFilter(dataset, query).size;
    if (count < 3) return;
    seen.add(key);
    cases.push({ id, label, query });
  };

  // 1–8: chỉ tổ hợp phổ biến
  for (const { combo, count } of comboRank.slice(0, 8)) {
    add(`pop-combo-${combo.toLowerCase()}`, `${combo} (${count} trường)`, {
      subject_combination: combo,
    });
  }

  // 9–14: chỉ điểm phổ biến
  for (const { score, count } of scoreRank.slice(0, 6)) {
    add(`pop-score-${score}`, `≤${score} (${count} trường)`, { min_score: score });
  }

  // 15–22: chỉ ngành phổ biến
  for (const { name, id, count } of majorRank.slice(0, 8)) {
    add(`pop-major-${id}`, `${name} (${count} trường)`, { major_id: id });
  }

  // 23–34: tổ hợp + điểm (top × top)
  for (const combo of topCombos) {
    for (const score of topScores.slice(0, 2)) {
      add(`pop-${combo}-${score}`, `${combo} + ≤${score}`, {
        subject_combination: combo,
        min_score: score,
      });
    }
  }

  // 35–46: tổ hợp + ngành + điểm
  for (const combo of topCombos.slice(0, 4)) {
    for (const { name, id } of topMajors.slice(0, 3)) {
      for (const score of [26, 27, 28]) {
        add(`pop-${combo}-m${id}-s${score}`, `${combo} + ${name} + ≤${score}`, {
          subject_combination: combo,
          major_id: id,
          min_score: score,
        });
      }
    }
  }

  // 47–56: thêm phường (top ward + bộ lọc phổ biến)
  for (const ward of topWards.slice(0, 6)) {
    add(`pop-ward-${ward.slice(0, 12)}-a01-27`, `${ward} + A01 + ≤27`, {
      subject_combination: 'A01',
      min_score: 27,
      ward,
    });
    add(`pop-ward-${ward.slice(0, 12)}-cntt`, `${ward} + CNTT`, {
      major_id: resolveMajorIdFromCatalog(dataset.catalog, 'Công nghệ Thông tin'),
      ward,
    });
  }

  // 57+: học phí + phổ biến
  add('pop-tuition-20m-a01-26', 'Học phí ≤20tr + A01 + ≤26', {
    max_tuition: 20_000_000,
    subject_combination: 'A01',
    min_score: 26,
  });
  add('pop-tuition-25m-d01-27', 'Học phí ≤25tr + D01 + ≤27', {
    max_tuition: 25_000_000,
    subject_combination: 'D01',
    min_score: 27,
  });
  for (const { id, name } of topMajors.slice(0, 4)) {
    add(`pop-tuition-30m-m${id}`, `Học phí ≤30tr + ${name}`, {
      max_tuition: 30_000_000,
      major_id: id,
    });
  }

  // Sắp theo số trường kỳ vọng giảm dần, lấy 50 case đầu (đảm bảo phổ biến)
  return cases
    .map((c) => ({
      c,
      n: evaluateUniversityFilter(dataset, c.query).size,
    }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 50)
    .map((x, i) => ({
      ...x.c,
      id: `pop-${String(i + 1).padStart(2, '0')}`,
      label: `[${x.n} trường] ${x.c.label}`,
    }));
}

async function main() {
  await dataSource.initialize();
  const dataset = await loadDataset();
  const service = new UniversitiesService(
    dataSource.getRepository(University),
    dataSource.getRepository(Major),
  );

  const cases = buildFiftyPopularCases(dataset, dataset.wards);
  if (cases.length < 50) {
    console.warn(`Chỉ tạo được ${cases.length} case phổ biến (≥3 trường).`);
  }

  console.log(`Dataset: ${dataset.universities.length} trường HN\n`);
  console.log(
    'ID   | Kỳ vọng | API | Thiếu | Thừa | Sai | ms  | Mô tả',
  );
  console.log('-'.repeat(95));

  const results: CaseResult[] = [];
  let pass = 0;

  for (const c of cases) {
    const expectedSet = evaluateUniversityFilter(dataset, c.query);
    const t0 = Date.now();
    const apiRes = await service.findAll({
      ...(c.query as QueryUniversityDto),
      page: 1,
      limit: 5000,
    });
    const ms = Date.now() - t0;
    const actualSet = new Set(apiRes.data.map((u) => u.id));

    const missing = [...expectedSet].filter((id) => !actualSet.has(id));
    const extra = [...actualSet].filter((id) => !expectedSet.has(id));
    const invalidInApi = reverseValidateResults(dataset, c.query, actualSet);

    const ok =
      missing.length === 0 &&
      extra.length === 0 &&
      invalidInApi.length === 0;

    if (ok) pass++;

    results.push({
      case: c,
      expected: expectedSet.size,
      api: actualSet.size,
      missing: idToLabel(missing, dataset),
      extra: idToLabel(extra, dataset),
      invalidInApi,
      ms,
      ok,
    });

    const flag = ok ? '✓' : '✗';
    console.log(
      `${c.id} | ${String(expectedSet.size).padStart(7)} | ${String(actualSet.size).padStart(3)} | ${String(missing.length).padStart(5)} | ${String(extra.length).padStart(4)} | ${String(invalidInApi.length).padStart(3)} | ${String(ms).padStart(3)} | ${flag} ${c.label.slice(0, 40)}`,
    );
  }

  const withResults = results.filter((r) => r.expected > 0);
  const avgMs =
    results.reduce((s, r) => s + r.ms, 0) / Math.max(results.length, 1);

  console.log('\n=== Tổng kết ===');
  console.log(`Pass (đúng + đủ): ${pass}/${results.length}`);
  console.log(`Case có ≥1 trường: ${withResults.length}/${results.length}`);
  console.log(
    `Tổng trường kỳ vọng (cộng): ${results.reduce((s, r) => s + r.expected, 0)}`,
  );
  console.log(`Thời gian API trung bình: ${Math.round(avgMs)}ms`);

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.log('\n--- Chi tiết lỗi ---');
    for (const f of failed) {
      console.log(`\n${f.case.id}: ${f.case.label}`);
      if (f.missing.length) {
        console.log(`  THIẾU (${f.missing.length}): ${f.missing.join(', ')}`);
      }
      if (f.extra.length) {
        console.log(`  THỪA (${f.extra.length}): ${f.extra.join(', ')}`);
      }
      if (f.invalidInApi.length) {
        console.log(`  SAI ĐIỀU KIỆN: ${f.invalidInApi.join(', ')}`);
      }
    }
    await dataSource.destroy();
    process.exit(1);
  }

  await dataSource.destroy();
  console.log('\nKết luận: API trả đúng và đủ trường cho tất cả case phổ biến.');
}

main().catch(async (e) => {
  console.error(e);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
