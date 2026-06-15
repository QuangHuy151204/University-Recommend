/**
 * Audit ~52 kịch bản lọc tra cứu trên snapshot DB thật.
 * Phase 1: ground-truth in-memory (đầy đủ trên toàn bộ dữ liệu HN).
 * Phase 2: đối chiếu UniversitiesService (song song, batch).
 * Usage: npm run test:university-filter-audit
 */
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import dataSource from '../src/data-source';
import { DATA_SCOPE_LOCATION } from '../src/common/data-scope';
import { CUTOFF_FILTER_YEARS } from '../src/common/subject-combination';
import { Major } from '../src/majors/major.entity';
import { University } from '../src/universities/university.entity';
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
import {
  API_SPOT_CHECK_IDS,
  buildUniversityFilterScenarios,
  type FilterScenario,
} from './university-filter-scenarios';

dotenv.config({ path: resolve(__dirname, '../.env') });

const API_CONCURRENCY = 1;

type AuditFailure = {
  scenario: FilterScenario;
  missing: string[];
  extra: string[];
  phase: 'memory-recheck' | 'api';
};

async function loadDataset(ds: typeof dataSource): Promise<FilterDataset> {
  const scope = `%${DATA_SCOPE_LOCATION}%`;
  const years = [...CUTOFF_FILTER_YEARS];

  const [universities, universityMajors, cutoffs, catalog] = await Promise.all([
    ds.query(
      `SELECT id, name, short_name, location, ward, type, tuition_fee_min
       FROM universities WHERE location ILIKE $1`,
      [scope],
    ),
    ds.query(
      `SELECT um.id, um.university_id, um.major_id
       FROM university_majors um
       JOIN universities u ON u.id = um.university_id
       WHERE u.location ILIKE $1`,
      [scope],
    ),
    ds.query(
      `SELECT cs.university_major_id, cs.year, cs.subject_combination, cs.score
       FROM cutoff_scores cs
       JOIN university_majors um ON um.id = cs.university_major_id
       JOIN universities u ON u.id = um.university_id
       WHERE u.location ILIKE $1 AND cs.year = ANY($2::int[])`,
      [scope, years],
    ),
    ds.query(`SELECT id, name FROM majors`),
  ]);

  return { universities, universityMajors, cutoffs, catalog };
}

function idToLabel(ids: number[], dataset: FilterDataset): string[] {
  const byId = new Map(dataset.universities.map((u) => [u.id, u.short_name]));
  return ids.map((id) => byId.get(id) ?? `#${id}`);
}

/** Kiểm tra ngược: mỗi trường trả về phải có ≥1 ngành thật sự thỏa điều kiện. */
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
    const ums = umsByUni.get(uniId) ?? [];
    const ok = ums.some((um) => {
      if (majorIds?.length && !majorIds.includes(um.major_id)) return false;
      return universityMajorPassesCutoffFilter(
        cutoffsByUm.get(um.id) ?? [],
        cutoffInput,
      );
    });
    if (!ok) {
      const uni = dataset.universities.find((u) => u.id === uniId);
      invalid.push(uni?.short_name ?? `#${uniId}`);
    }
  }
  return invalid;
}

async function queryApiService(
  service: UniversitiesService,
  query: UniversityFilterQuery,
): Promise<Set<number>> {
  const result = await service.findAll({
    ...(query as QueryUniversityDto),
    page: 1,
    limit: 5000,
  });
  return new Set(result.data.map((u) => u.id));
}

async function runInBatches<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

async function main() {
  if (!dataSource.isInitialized) await dataSource.initialize();

  const uniRepo = dataSource.getRepository(University);
  const majorRepo = dataSource.getRepository(Major);
  const service = new UniversitiesService(uniRepo, majorRepo);

  const dataset = await loadDataset(dataSource);
  const scenarios = buildUniversityFilterScenarios(dataset.catalog);
  const apiScenarios = scenarios.filter((s) =>
    (API_SPOT_CHECK_IDS as readonly string[]).includes(s.id),
  );

  console.log(
    `Dataset: ${dataset.universities.length} trường HN, ${dataset.cutoffs.length} cutoff, ${dataset.catalog.length} ngành catalog`,
  );
  console.log(`Kịch bản: ${scenarios.length}\n`);

  const failures: AuditFailure[] = [];
  let memoryPass = 0;

  console.log('--- Phase 1: Ground-truth + kiểm tra ngược ---');
  for (const scenario of scenarios) {
    const expected = evaluateUniversityFilter(dataset, scenario.query);
    const invalid = reverseValidateResults(dataset, scenario.query, expected);
    if (invalid.length > 0) {
      failures.push({
        scenario,
        missing: [],
        extra: invalid,
        phase: 'memory-recheck',
      });
      console.log(`✗ ${scenario.id}: ${invalid.length} trường không thỏa điều kiện`);
      continue;
    }
    memoryPass++;
    console.log(`✓ ${scenario.id}: ${expected.size} trường (hợp lệ)`);
  }

  console.log(`\nPhase 1: ${memoryPass}/${scenarios.length} pass\n`);
  console.log(
    `--- Phase 2: API spot-check (${apiScenarios.length}/${scenarios.length} kịch bản đại diện) ---`,
  );

  const apiResults = await runInBatches(
    apiScenarios,
    API_CONCURRENCY,
    async (scenario) => {
      const expected = evaluateUniversityFilter(dataset, scenario.query);
      const actual = await queryApiService(service, scenario.query);
      return { scenario, expected, actual };
    },
  );

  let apiPass = 0;
  for (const { scenario, expected, actual } of apiResults) {
    const missing = [...expected].filter((id) => !actual.has(id));
    const extra = [...actual].filter((id) => !expected.has(id));

    if (missing.length === 0 && extra.length === 0) {
      apiPass++;
      console.log(`✓ ${scenario.id}: API khớp (${expected.size} trường)`);
      continue;
    }

    failures.push({
      scenario,
      missing: idToLabel(missing, dataset),
      extra: idToLabel(extra, dataset),
      phase: 'api',
    });
    console.log(`✗ ${scenario.id}: API lệch (truth ${expected.size}, api ${actual.size})`);
    if (missing.length) {
      console.log(`    THIẾU: ${idToLabel(missing, dataset).slice(0, 5).join(', ')}`);
    }
    if (extra.length) {
      console.log(`    THỪA: ${idToLabel(extra, dataset).slice(0, 5).join(', ')}`);
    }
  }

  console.log('\n=== Tổng kết ===');
  console.log(`Phase 1 (logic + đầy đủ): ${memoryPass}/${scenarios.length}`);
  console.log(`Phase 2 (API spot-check): ${apiPass}/${apiScenarios.length}`);
  console.log(`Tổng lỗi: ${failures.length}`);

  if (failures.length > 0) {
    console.log('\n--- Chi tiết ---');
    for (const f of failures) {
      console.log(`\n[${f.phase}] ${f.scenario.id} — ${f.scenario.label}`);
      if (f.missing.length) console.log(`  Thiếu: ${f.missing.join(', ')}`);
      if (f.extra.length) console.log(`  Thừa: ${f.extra.join(', ')}`);
    }
    await dataSource.destroy();
    process.exit(1);
  }

  await dataSource.destroy();
  console.log(
    `\nKết luận: ${scenarios.length} kịch bản ground-truth pass; API spot-check khớp.`,
  );
}

main().catch(async (e) => {
  console.error(e);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
