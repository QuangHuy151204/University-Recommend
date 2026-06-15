/**
 * 50 kịch bản tra cứu — 4 trường: khối, ngành, điểm, phường.
 * Hai case liên tiếp không trùng bất kỳ trường nào.
 * Usage: npm run test:university-filter-50
 */
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import dataSource from '../src/data-source';
import { DATA_SCOPE_LOCATION } from '../src/common/data-scope';
import { CUTOFF_FILTER_YEARS } from '../src/common/subject-combination';
import { University } from '../src/universities/university.entity';
import { Major } from '../src/majors/major.entity';
import { UniversitiesService } from '../src/universities/universities.service';
import {
  evaluateUniversityFilter,
  type FilterDataset,
} from '../src/universities/university-filter-evaluator';
import type { QueryUniversityDto } from '../src/universities/university.dto';

dotenv.config({ path: resolve(__dirname, '../.env') });

type LoadedDataset = FilterDataset & {
  wards: string[];
  majorsWithData: Array<{ id: number; name: string }>;
};

type ScenarioCase = {
  subject_combination: string;
  major_id: number;
  major_name: string;
  min_score: number;
  ward: string;
};

export type FourFieldCase = {
  id: number;
  subject_combination: string;
  major_id: number;
  major_name: string;
  min_score: number;
  ward: string;
  expected_count: number;
  api_count: number;
  api_ms: number;
  match: boolean;
};

const COMBOS = [
  'A00',
  'A01',
  'A02',
  'B00',
  'B01',
  'C00',
  'C01',
  'D01',
  'D03',
  'D07',
] as const;

/** 50 mức điểm khác nhau (17.0 → 41.5, bước 0.5). */
function buildScores(): number[] {
  const scores: number[] = [];
  for (let i = 0; i < 50; i++) {
    scores.push(Math.round((17 + i * 0.5) * 100) / 100);
  }
  return scores;
}

async function loadDataset(): Promise<LoadedDataset> {
  const scope = `%${DATA_SCOPE_LOCATION}%`;
  const years = [...CUTOFF_FILTER_YEARS];
  const [universities, universityMajors, cutoffs, catalog, wardRows] =
    await Promise.all([
      dataSource.query(
        `SELECT id, name, short_name, location, type, tuition_fee_min, ward
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
      dataSource.query(`SELECT id, name FROM majors ORDER BY name`),
      dataSource.query(
        `SELECT DISTINCT ward FROM universities
         WHERE ward IS NOT NULL AND TRIM(ward) <> '' AND location ILIKE $1
         ORDER BY ward`,
        [scope],
      ),
    ]);

  const majorIdsWithCutoff = new Set(
    cutoffs.map((c: { university_major_id: number }) => c.university_major_id),
  );
  const umMajorById = new Map(
    universityMajors.map((um: { id: number; major_id: number }) => [
      um.id,
      um.major_id,
    ]),
  );
  const majorsWithData = catalog.filter((m: { id: number }) => {
    for (const [umId, majorId] of umMajorById) {
      if (majorId === m.id && majorIdsWithCutoff.has(umId)) return true;
    }
    return false;
  });

  const wards = [
    '',
    ...wardRows.map((r: { ward: string }) => r.ward),
  ];

  return {
    universities,
    universityMajors,
    cutoffs,
    catalog,
    wards,
    majorsWithData,
  };
}

function differsFrom(a: ScenarioCase, b: ScenarioCase): boolean {
  return (
    a.subject_combination !== b.subject_combination &&
    a.major_id !== b.major_id &&
    a.min_score !== b.min_score &&
    (a.ward ?? '') !== (b.ward ?? '')
  );
}

/** Greedily build 50 cases — consecutive pairs differ in all 4 fields. */
export function buildFiftyOrthogonalCases(
  majors: Array<{ id: number; name: string }>,
  wards: string[],
): ScenarioCase[] {
  const scores = buildScores();
  const cases: ScenarioCase[] = [];

  let comboIdx = 0;
  let majorIdx = 0;
  let scoreIdx = 0;
  let wardIdx = 0;

  const pickNext = <T,>(pool: T[], idx: number, prev: T | undefined): T => {
    const len = pool.length;
    for (let attempt = 0; attempt < len; attempt++) {
      const candidate = pool[(idx + attempt) % len];
      if (candidate !== prev) return candidate;
    }
    return pool[idx % len];
  };

  let prevCombo: string | undefined;
  let prevMajorId: number | undefined;
  let prevScore: number | undefined;
  let prevWard: string | undefined;

  while (cases.length < 50) {
    const combo = pickNext([...COMBOS], comboIdx, prevCombo);
    comboIdx = (COMBOS.indexOf(combo as (typeof COMBOS)[number]) + 1) % COMBOS.length;

    const major = pickNext(
      majors,
      majorIdx,
      majors.find((m) => m.id === prevMajorId),
    );
    majorIdx = (majors.indexOf(major) + 1) % majors.length;

    const score = pickNext(scores, scoreIdx, prevScore);
    scoreIdx = (scores.indexOf(score) + 1) % scores.length;

    const ward = pickNext(wards, wardIdx, prevWard);
    wardIdx = (wards.indexOf(ward) + 1) % wards.length;

    const candidate = {
      subject_combination: combo,
      major_id: major.id,
      major_name: major.name,
      min_score: score,
      ward,
    };

    if (cases.length > 0) {
      const last = cases[cases.length - 1];
      if (!differsFrom(candidate, last)) {
        wardIdx++;
        continue;
      }
    }

    cases.push(candidate);
    prevCombo = combo;
    prevMajorId = major.id;
    prevScore = score;
    prevWard = ward;
  }

  return cases;
}

async function main() {
  await dataSource.initialize();
  const dataset = await loadDataset();
  const majorsPool = dataset.majorsWithData;

  if (majorsPool.length < 50) {
    console.warn(
      `Chỉ có ${majorsPool.length} ngành có cutoff — dùng lại vòng lặp nhưng vẫn đảm bảo case liên tiếp khác nhau.`,
    );
  }

  const scenarios = buildFiftyOrthogonalCases(
    majorsPool.length >= 50 ? majorsPool.slice(0, 50) : majorsPool,
    dataset.wards,
  );

  // Validate consecutive orthogonality
  for (let i = 1; i < scenarios.length; i++) {
    if (!differsFrom(scenarios[i], scenarios[i - 1])) {
      throw new Error(`Case ${i} và ${i + 1} trùng trường`);
    }
  }

  const service = new UniversitiesService(
    dataSource.getRepository(University),
    dataSource.getRepository(Major),
  );

  const results: FourFieldCase[] = [];
  let apiMismatches = 0;

  console.log('ID | Khối | Điểm | Phường | Ngành | Kỳ vọng | API | ms | OK');
  console.log('-'.repeat(100));

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const query: QueryUniversityDto = {
      subject_combination: s.subject_combination,
      min_score: s.min_score,
      major_id: s.major_id,
      ward: s.ward || undefined,
    };
    const expected = evaluateUniversityFilter(dataset, query);
    const t0 = Date.now();
    const api = await service.findAll({ ...query, page: 1, limit: 5000 });
    const ms = Date.now() - t0;
    const match = expected.size === api.total;
    if (!match) apiMismatches++;

    const row: FourFieldCase = {
      id: i + 1,
      subject_combination: s.subject_combination,
      major_id: s.major_id,
      major_name: s.major_name,
      min_score: s.min_score,
      ward: s.ward,
      expected_count: expected.size,
      api_count: api.total,
      api_ms: ms,
      match,
    };
    results.push(row);

    const wardLabel = s.ward || '(tất cả)';
    const ok = match ? '✓' : '✗';
    console.log(
      `${String(i + 1).padStart(2)} | ${s.subject_combination} | ${String(s.min_score).padStart(5)} | ${wardLabel.slice(0, 12).padEnd(12)} | ${s.major_name.slice(0, 22).padEnd(22)} | ${String(expected.size).padStart(7)} | ${String(api.total).padStart(3)} | ${String(ms).padStart(4)} | ${ok}`,
    );
  }

  const avgMs =
    results.reduce((sum, r) => sum + r.api_ms, 0) / results.length;
  const maxMs = Math.max(...results.map((r) => r.api_ms));
  const withResults = results.filter((r) => r.expected_count > 0).length;
  const zeroResults = results.filter((r) => r.expected_count === 0).length;

  console.log('\n=== Tổng kết 50 case ===');
  console.log(`API khớp ground-truth: ${50 - apiMismatches}/50`);
  console.log(`Có kết quả (>0 trường): ${withResults}`);
  console.log(`0 kết quả (hợp lệ — điểm/ngành quá khó): ${zeroResults}`);
  console.log(`Thời gian API trung bình: ${Math.round(avgMs)}ms, max: ${maxMs}ms`);

  if (apiMismatches > 0) {
    console.log('\n--- Lệch API ---');
    for (const r of results.filter((x) => !x.match)) {
      console.log(
        `#${r.id} ${r.subject_combination}+${r.major_name}+<=${r.min_score}+${r.ward || 'all'}: expected ${r.expected_count}, api ${r.api_count}`,
      );
    }
    await dataSource.destroy();
    process.exit(1);
  }

  await dataSource.destroy();
}

main().catch(async (e) => {
  console.error(e);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
