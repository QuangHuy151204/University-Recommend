"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const path_1 = require("path");
const subject_combination_1 = require("../src/common/subject-combination");
const major_name_match_1 = require("../src/majors/major-name-match");
dotenv.config({ path: (0, path_1.resolve)(__dirname, '../.env') });
function pgComboMatch(columnExpr, paramIndex) {
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
    const c = new pg_1.Client({
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        user: process.env.DB_USERNAME ?? 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME ?? 'university_recommend',
    });
    await c.connect();
    const years = [...subject_combination_1.CUTOFF_FILTER_YEARS];
    const majorRow = await c.query(`SELECT id, name FROM majors WHERE id = $1`, [
        majorId,
    ]);
    const selectedName = majorRow.rows[0]?.name ?? `id=${majorId}`;
    const catalog = await c.query(`SELECT id, name FROM majors`);
    const majorIds = (0, major_name_match_1.filterMajorIdsBySelectionName)(catalog.rows, selectedName);
    const anyYearSql = (ids) => `
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
    const params = (ids) => [ids, years, minScore, combo];
    const oldNarrow = await c.query(anyYearSql(majorIds), params([majorId]));
    const oldExpanded = await c.query(anyYearSql(majorIds), params(majorIds));
    const newRes = await c.query(latestYearSql(), params(majorIds));
    const oldIds = new Set(oldExpanded.rows.map((r) => r.id));
    const newIds = new Set(newRes.rows.map((r) => r.id));
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
            const u = oldExpanded.rows.find((r) => r.id === id);
            console.log(`  - ${u?.short_name ?? id}`);
        }
    }
    console.log(`Added (major expansion): ${added.length}`);
    if (added.length > 0) {
        for (const id of added.slice(0, 8)) {
            const u = newRes.rows.find((r) => r.id === id);
            console.log(`  + ${u?.short_name ?? id}`);
        }
    }
    await c.end();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=validate-university-filter.js.map