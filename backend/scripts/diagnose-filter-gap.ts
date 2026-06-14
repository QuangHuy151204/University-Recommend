import dataSource from '../src/data-source';
import { evaluateUniversityFilter } from '../src/universities/university-filter-evaluator';
import { universityMajorPassesCutoffFilter } from '../src/universities/university-cutoff-filter';
import { filterMajorIdsBySelectionName } from '../src/majors/major-name-match';
import { resolveMajorIdFromCatalog } from './university-filter-scenarios';
import { UniversitiesService } from '../src/universities/universities.service';
import { University } from '../src/universities/university.entity';
import { Major } from '../src/majors/major.entity';

async function main() {
  await dataSource.initialize();
  const scope = '%Hà Nội%';
  const [universities, universityMajors, cutoffs, catalog] = await Promise.all([
    dataSource.query(
      `SELECT id, name, short_name, location, type, tuition_fee_min FROM universities WHERE location ILIKE $1`,
      [scope],
    ),
    dataSource.query(
      `SELECT um.id, um.university_id, um.major_id FROM university_majors um JOIN universities u ON u.id = um.university_id WHERE u.location ILIKE $1`,
      [scope],
    ),
    dataSource.query(
      `SELECT cs.university_major_id, cs.year, cs.subject_combination, cs.score FROM cutoff_scores cs JOIN university_majors um ON um.id = cs.university_major_id JOIN universities u ON u.id = um.university_id WHERE u.location ILIKE $1 AND cs.year = ANY($2::int[])`,
      [scope, [2023, 2024, 2025]],
    ),
    dataSource.query(`SELECT id, name FROM majors`),
  ]);
  const dataset = { universities, universityMajors, cutoffs, catalog };

  const service = new UniversitiesService(
    dataSource.getRepository(University),
    dataSource.getRepository(Major),
  );

  const query = {
    subject_combination: 'A01',
    min_score: 27,
    major_id: resolveMajorIdFromCatalog(catalog, 'Công nghệ Thông tin'),
  };

  const expected = evaluateUniversityFilter(dataset, query);
  const api = await service.findAll({ ...query, page: 1, limit: 5000 });
  const apiIds = new Set(api.data.map((u) => u.id));
  const missing = [...expected].filter((id) => !apiIds.has(id));

  console.log('Query:', query);
  console.log('Expected:', expected.size, 'API total:', api.total, 'API data:', api.data.length);
  console.log('Missing from API:', missing.length);
  console.log('EAUT in API:', api.data.some((u) => u.short_name === 'EAUT'));

  const cnttMajorIds = new Set(
    catalog
      .filter((m: { name: string }) =>
        m.name.toLowerCase().includes('công nghệ thông tin') ||
        m.name.toLowerCase().includes('hệ thống thông tin'),
      )
      .map((m: { id: number }) => m.id),
  );

  const expandedIds = filterMajorIdsBySelectionName(
    catalog,
    'Công nghệ Thông tin',
  );
  console.log('Expanded major ids:', expandedIds.length);

  for (const uniId of missing) {
    const uni = universities.find((u: { id: number }) => u.id === uniId);
    console.log(`\n--- ${uni?.short_name} (id ${uniId}) ---`);
    const ums = universityMajors.filter(
      (um: { university_id: number }) => um.university_id === uniId,
    );
    for (const um of ums) {
      const major = catalog.find((m: { id: number }) => m.id === um.major_id);
      const rows = cutoffs.filter(
        (c: { university_major_id: number }) => c.university_major_id === um.id,
      );
      const passes = universityMajorPassesCutoffFilter(rows, {
        subject_combination: 'A01',
        min_score: 27,
      });
      const inExpanded = expandedIds.includes(um.major_id);
      if (!inExpanded) continue;
      console.log(
        `  major: ${major?.name} | inExpanded=${inExpanded} | passes=${passes}`,
      );
      for (const r of rows
        .filter((c: { subject_combination: string | null }) =>
          (c.subject_combination ?? '').toUpperCase().includes('A01'),
        )
        .sort(
          (a: { year: number }, b: { year: number }) => b.year - a.year,
        )
        .slice(0, 6)) {
        console.log(
          `    ${r.year} ${r.subject_combination} = ${r.score}`,
        );
      }
    }
  }

  await dataSource.destroy();
}

main().catch(async (e) => {
  console.error(e);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
