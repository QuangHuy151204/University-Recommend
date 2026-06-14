import dataSource from '../src/data-source';
import { University } from '../src/universities/university.entity';
import { filterMajorIdsBySelectionName } from '../src/majors/major-name-match';
import {
  CUTOFF_FILTER_YEARS,
  subjectCombinationSqlMatch,
} from '../src/common/subject-combination';
import { latestCutoffYearSql } from '../src/universities/university-cutoff-filter';

async function main() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(University);
  const catalog = await dataSource.query(`SELECT id, name FROM majors`);
  const majorIds = filterMajorIdsBySelectionName(catalog, 'Công nghệ Thông tin');
  const combo = 'A01';
  const minScore = 27;
  const cutoffYears = [...CUTOFF_FILTER_YEARS];

  const sub = repo
    .createQueryBuilder('su')
    .select('su.id')
    .innerJoin('su.universityMajors', 'sum')
    .andWhere('sum.major_id IN (:...majorIds)', { majorIds })
    .innerJoin('sum.cutoffScores', 'scs')
    .andWhere('scs.year IN (:...cutoffYears)', { cutoffYears })
    .andWhere(subjectCombinationSqlMatch('scs.subject_combination', 'combo'), {
      combo,
    })
    .andWhere(latestCutoffYearSql('sum', 'scs', 'combo'))
    .andWhere('scs.score <= :minScore', { minScore });

  const qb = repo
    .createQueryBuilder('u')
    .andWhere('u.location ILIKE :scope', { scope: '%Hà Nội%' })
    .andWhere(`u.id IN (${sub.getQuery()})`);

  for (const [key, value] of Object.entries(sub.getParameters())) {
    qb.setParameter(key, value);
  }
  qb.setParameter('scope', '%Hà Nội%');

  const sql = qb.getQuery();
  const params = qb.getParameters();
  console.log('SQL:\n', sql);
  console.log('\nParams keys:', Object.keys(params));

  const rows = await qb.getMany();
  const shorts = rows.map((u) => u.short_name).sort();
  console.log('\nCount:', rows.length);
  console.log('Has EAUT:', shorts.includes('EAUT'));
  console.log('Has UTM:', shorts.includes('UTM'));

  const eautUm = await dataSource.query(
    `SELECT um.id FROM university_majors um
     JOIN universities u ON u.id = um.university_id
     JOIN majors m ON m.id = um.major_id
     WHERE u.short_name = 'EAUT' AND m.name = 'Công nghệ Thông tin'`,
  );
  const umId = eautUm.rows[0]?.id ?? eautUm[0]?.id;
  console.log('\nEAUT CNTT um.id:', umId);

  if (umId) {
    const raw = await dataSource.query(
      `SELECT cs.year, cs.subject_combination, cs.score,
        (SELECT MAX(scs2.year) FROM cutoff_scores scs2
         WHERE scs2.university_major_id = $1
         AND scs2.year IN (2023,2024,2025)
         AND (UPPER(TRIM(scs2.subject_combination)) = 'A01'
           OR EXISTS (SELECT 1 FROM regexp_split_to_table(COALESCE(scs2.subject_combination,''), '[,;/]+') p(part)
             WHERE UPPER(TRIM(p.part)) = 'A01'))) AS max_year
       FROM cutoff_scores cs
       WHERE cs.university_major_id = $1 AND cs.year IN (2023,2024,2025)`,
      [umId],
    );
    console.log('EAUT cutoffs:', raw);
  }

  await dataSource.destroy();
}

main().catch(async (e) => {
  console.error(e);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
