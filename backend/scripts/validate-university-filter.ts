/**
 * So sánh kết quả lọc tra cứu trên DB thật (chạy local).
 * Usage: npx ts-node -r tsconfig-paths/register scripts/validate-university-filter.ts [combo] [minScore] [majorId]
 */
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { CUTOFF_FILTER_YEARS } from '../src/common/subject-combination';
import { filterMajorIdsBySelectionName } from '../src/majors/major-name-match';

dotenv.config({ path: resolve(__dirname, '../.env') });

function pgComboMatch(columnExpr: string, paramIndex: number): string {
  const p = `$${paramIndex}`;
  return `(
    UPPER(TRIM(${columnExpr})) = UPPER(${p})
    OR EXISTS (
      SELECT 1
      FROM regexp_split_to_table(COALESCE(${columnExpr}, ''), '[,;/]+') AS _sc_part(part)
      WHERE UPPER(TRIM(_sc_part.part)) = UPPER(${p})
    )
  )`;
}

const COMBO_MATCH = pgComboMatch('scs.subject_combination', 4);

async function main() {
  const combo = process.argv[2] ?? 'A01';
  const minScore = Number(process.argv[3] ?? 27);
  const majorId = Number(process.argv[4] ?? 234);

  const c = new Client({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'university_recommend',
  });
  await c.connect();

  const years = [...CUTOFF_FILTER_YEARS];
  const majorRow = await c.query(`SELECT id, name FROM majors WHERE id = $1`, [
    majorId,
  ]);
  const selectedName = majorRow.rows[0]?.name ?? `id=${majorId}`;
  const catalog = await c.query(`SELECT id, name FROM majors`);
  const majorIds = filterMajorIdsBySelectionName(
    catalog.rows as Array<{ id: number; name: string }>,
    selectedName,
  );

  const anyYearSql = (ids: number[]) => `
    SELECT DISTINCT u.id, u.short_name
    FROM universities u
    JOIN university_majors um ON um.university_id = u.id
    JOIN cutoff_scores scs ON scs.university_major_id = um.id
    WHERE u.location ILIKE '%Hà Nội%'
      AND um.major_id = ANY($1::int[])
      AND scs.year = ANY($2::int[])
      AND scs.score <= $3
      AND ${COMBO_MATCH}
    ORDER BY u.short_name
  `;

  const latestYearClause = `
    scs.year = (
      SELECT MAX(scs2.year)
      FROM cutoff_scores scs2
      WHERE scs2.university_major_id = um.id
      AND scs2.year = ANY($2::int[])
      AND ${pgComboMatch('scs2.subject_combination', 4)}
    )`;
  const latestYearSql = () => `
    SELECT DISTINCT u.id, u.short_name
    FROM universities u
    JOIN university_majors um ON um.university_id = u.id
    JOIN cutoff_scores scs ON scs.university_major_id = um.id
    WHERE u.location ILIKE '%Hà Nội%'
      AND um.major_id = ANY($1::int[])
      AND scs.year = ANY($2::int[])
      AND ${latestYearClause}
      AND scs.score <= $3
      AND ${COMBO_MATCH}
    ORDER BY u.short_name
  `;

  const params = (ids: number[]) => [ids, years, minScore, combo];
  const oldNarrow = await c.query(anyYearSql(majorIds), params([majorId]));
  const oldExpanded = await c.query(anyYearSql(majorIds), params(majorIds));
  const newRes = await c.query(latestYearSql(), params(majorIds));

  const oldIds = new Set(
    oldExpanded.rows.map((r: { id: number }) => r.id),
  );
  const newIds = new Set(newRes.rows.map((r: { id: number }) => r.id));
  const dropped = [...oldIds].filter((id) => !newIds.has(id));
  const added = [...newIds].filter((id) => !oldIds.has(id));

  console.log(`Filter: ${combo} + <=${minScore} + "${selectedName}"`);
  console.log(`Major IDs expanded: ${majorIds.length}`);
  console.log(`Before (single major_id, any year): ${oldNarrow.rowCount}`);
  console.log(`Before (expanded majors, any year): ${oldExpanded.rowCount}`);
  console.log(`After (expanded majors, latest year): ${newRes.rowCount}`);
  console.log(`Dropped (false positives from old years): ${dropped.length}`);
  if (dropped.length > 0) {
    for (const id of dropped.slice(0, 8)) {
      const u = oldExpanded.rows.find((r: { id: number }) => r.id === id);
      console.log(`  - ${u?.short_name ?? id}`);
    }
  }
  console.log(`Added (major expansion): ${added.length}`);
  if (added.length > 0) {
    for (const id of added.slice(0, 8)) {
      const u = newRes.rows.find((r: { id: number }) => r.id === id);
      console.log(`  + ${u?.short_name ?? id}`);
    }
  }

  await c.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
