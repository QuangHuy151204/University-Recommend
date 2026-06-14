"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("../src/data-source"));
const university_entity_1 = require("../src/universities/university.entity");
const major_name_match_1 = require("../src/majors/major-name-match");
const subject_combination_1 = require("../src/common/subject-combination");
const university_cutoff_filter_1 = require("../src/universities/university-cutoff-filter");
async function main() {
    await data_source_1.default.initialize();
    const repo = data_source_1.default.getRepository(university_entity_1.University);
    const catalog = await data_source_1.default.query(`SELECT id, name FROM majors`);
    const majorIds = (0, major_name_match_1.filterMajorIdsBySelectionName)(catalog, 'Công nghệ Thông tin');
    const combo = 'A01';
    const minScore = 27;
    const cutoffYears = [...subject_combination_1.CUTOFF_FILTER_YEARS];
    const sub = repo
        .createQueryBuilder('su')
        .select('su.id')
        .innerJoin('su.universityMajors', 'sum')
        .andWhere('sum.major_id IN (:...majorIds)', { majorIds })
        .innerJoin('sum.cutoffScores', 'scs')
        .andWhere('scs.year IN (:...cutoffYears)', { cutoffYears })
        .andWhere((0, subject_combination_1.subjectCombinationSqlMatch)('scs.subject_combination', 'combo'), {
        combo,
    })
        .andWhere((0, university_cutoff_filter_1.latestCutoffYearSql)('sum', 'scs', 'combo'))
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
    const eautUm = await data_source_1.default.query(`SELECT um.id FROM university_majors um
     JOIN universities u ON u.id = um.university_id
     JOIN majors m ON m.id = um.major_id
     WHERE u.short_name = 'EAUT' AND m.name = 'Công nghệ Thông tin'`);
    const umId = eautUm.rows[0]?.id ?? eautUm[0]?.id;
    console.log('\nEAUT CNTT um.id:', umId);
    if (umId) {
        const raw = await data_source_1.default.query(`SELECT cs.year, cs.subject_combination, cs.score,
        (SELECT MAX(scs2.year) FROM cutoff_scores scs2
         WHERE scs2.university_major_id = $1
         AND scs2.year IN (2023,2024,2025)
         AND (UPPER(TRIM(scs2.subject_combination)) = 'A01'
           OR EXISTS (SELECT 1 FROM regexp_split_to_table(COALESCE(scs2.subject_combination,''), '[,;/]+') p(part)
             WHERE UPPER(TRIM(p.part)) = 'A01'))) AS max_year
       FROM cutoff_scores cs
       WHERE cs.university_major_id = $1 AND cs.year IN (2023,2024,2025)`, [umId]);
        console.log('EAUT cutoffs:', raw);
    }
    await data_source_1.default.destroy();
}
main().catch(async (e) => {
    console.error(e);
    if (data_source_1.default.isInitialized)
        await data_source_1.default.destroy();
    process.exit(1);
});
//# sourceMappingURL=diagnose-filter-sql.js.map