"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const subject_combination_1 = require("../src/common/subject-combination");
const COMBO_MATCH_SQL = `(
  UPPER(TRIM(cs.subject_combination)) = UPPER($4)
  OR EXISTS (
    SELECT 1
    FROM regexp_split_to_table(COALESCE(cs.subject_combination, ''), '[,;/]+') AS _sc_part(part)
    WHERE UPPER(TRIM(_sc_part.part)) = UPPER($4)
  )
)`;
async function main() {
    const combo = process.argv[2] ?? 'A01';
    const minScore = Number(process.argv[3] ?? 27);
    const majorId = Number(process.argv[4] ?? 234);
    const c = new pg_1.Client({
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        user: process.env.DB_USERNAME ?? 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME ?? 'university_recommend',
    });
    await c.connect();
    const years = [...subject_combination_1.CUTOFF_FILTER_YEARS];
    const current = await c.query(`
    SELECT DISTINCT u.id, u.short_name, u.name
    FROM universities u
    JOIN university_majors um ON um.university_id = u.id
    JOIN cutoff_scores cs ON cs.university_major_id = um.id
    WHERE u.location ILIKE '%Hà Nội%'
      AND um.major_id = $1
      AND cs.year = ANY($2::int[])
      AND cs.score <= $3
      AND ${COMBO_MATCH_SQL}
    ORDER BY u.name
    `, [majorId, years, minScore, combo]);
    const majorRow = await c.query(`SELECT name FROM majors WHERE id = $1`, [
        majorId,
    ]);
    const majorName = majorRow.rows[0]?.name ?? `id=${majorId}`;
    console.log(`Filter: ${combo} + <=${minScore} + major "${majorName}" (${majorId})`);
    console.log(`Current logic: ${current.rowCount} universities`);
    const fuzzy = await c.query(`
    SELECT DISTINCT u.id, u.short_name, m.id AS major_id, m.name AS major_name
    FROM universities u
    JOIN university_majors um ON um.university_id = u.id
    JOIN majors m ON m.id = um.major_id
    JOIN cutoff_scores cs ON cs.university_major_id = um.id
    WHERE u.location ILIKE '%Hà Nội%'
      AND m.name ILIKE $1
      AND cs.year = ANY($2::int[])
      AND cs.score <= $3
      AND ${COMBO_MATCH_SQL}
    ORDER BY u.id, m.name
    `, [`%${majorName}%`, years, minScore, combo]);
    const apiIds = new Set(current.rows.map((r) => r.id));
    const missingByName = new Map();
    for (const row of fuzzy.rows) {
        const id = row.id;
        if (apiIds.has(id))
            continue;
        const entry = missingByName.get(id) ?? {
            short_name: row.short_name,
            majors: [],
        };
        entry.majors.push(`${row.major_name} (#${row.major_id})`);
        missingByName.set(id, entry);
    }
    console.log(`\nSame major NAME pattern but different major_id: ${missingByName.size}`);
    for (const [id, info] of missingByName) {
        console.log(`  - [${id}] ${info.short_name}: ${info.majors.join('; ')}`);
    }
    const hust = await c.query(`SELECT id, short_name FROM universities WHERE short_name = 'HUST' LIMIT 1`);
    if (hust.rows[0]) {
        const hid = hust.rows[0].id;
        const inApi = apiIds.has(hid);
        const hq = await c.query(`
      SELECT m.id, m.name, cs.year, cs.subject_combination, cs.score
      FROM university_majors um
      JOIN majors m ON m.id = um.major_id
      JOIN cutoff_scores cs ON cs.university_major_id = um.id
      WHERE um.university_id = $1
        AND m.name ILIKE '%công nghệ thông tin%'
        AND cs.year = ANY($2::int[])
      ORDER BY m.name, cs.year DESC, cs.score
      `, [hid, years]);
        console.log(`\nHUST in API results: ${inApi}`);
        console.log(`HUST CNTT-related cutoffs (${hq.rowCount} rows):`);
        for (const r of hq.rows.slice(0, 20)) {
            console.log(`  m#${r.id} ${r.name} | ${r.year} ${r.subject_combination} = ${r.score}`);
        }
    }
    const { canonicalMajorName } = await import('../src/majors/major-normalization');
    const canon = canonicalMajorName(majorName);
    const byCanon = await c.query(`
    SELECT DISTINCT u.id, u.short_name, m.id AS major_id, m.name AS major_name
    FROM universities u
    JOIN university_majors um ON um.university_id = u.id
    JOIN majors m ON m.id = um.major_id
    JOIN cutoff_scores cs ON cs.university_major_id = um.id
    WHERE u.location ILIKE '%Hà Nội%'
      AND cs.year = ANY($1::int[])
      AND cs.score <= $2
      AND ${COMBO_MATCH_SQL}
    ORDER BY u.id
    `, [years, minScore, combo]);
    const canonMatches = byCanon.rows.filter((r) => canonicalMajorName(r.major_name) === canon);
    const canonIds = new Set(canonMatches.map((r) => r.id));
    const missingCanon = [...canonIds].filter((id) => !apiIds.has(id));
    console.log(`\nCanonical name "${canon}": ${canonIds.size} universities`);
    console.log(`Missing vs major_id-only filter: ${missingCanon.length}`);
    for (const id of missingCanon) {
        const rows = canonMatches.filter((r) => r.id === id);
        console.log(`  - [${id}] ${rows[0]?.short_name}: ${rows.map((r) => r.major_name).join(' | ')}`);
    }
    await c.end();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=diagnose-university-filter.js.map