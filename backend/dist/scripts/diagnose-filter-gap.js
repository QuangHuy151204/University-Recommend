"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("../src/data-source"));
const university_filter_evaluator_1 = require("../src/universities/university-filter-evaluator");
const university_cutoff_filter_1 = require("../src/universities/university-cutoff-filter");
const major_name_match_1 = require("../src/majors/major-name-match");
const university_filter_scenarios_1 = require("./university-filter-scenarios");
const universities_service_1 = require("../src/universities/universities.service");
const university_entity_1 = require("../src/universities/university.entity");
const major_entity_1 = require("../src/majors/major.entity");
async function main() {
    await data_source_1.default.initialize();
    const scope = '%Hà Nội%';
    const [universities, universityMajors, cutoffs, catalog] = await Promise.all([
        data_source_1.default.query(`SELECT id, name, short_name, location, type, tuition_fee_min FROM universities WHERE location ILIKE $1`, [scope]),
        data_source_1.default.query(`SELECT um.id, um.university_id, um.major_id FROM university_majors um JOIN universities u ON u.id = um.university_id WHERE u.location ILIKE $1`, [scope]),
        data_source_1.default.query(`SELECT cs.university_major_id, cs.year, cs.subject_combination, cs.score FROM cutoff_scores cs JOIN university_majors um ON um.id = cs.university_major_id JOIN universities u ON u.id = um.university_id WHERE u.location ILIKE $1 AND cs.year = ANY($2::int[])`, [scope, [2023, 2024, 2025]]),
        data_source_1.default.query(`SELECT id, name FROM majors`),
    ]);
    const dataset = { universities, universityMajors, cutoffs, catalog };
    const service = new universities_service_1.UniversitiesService(data_source_1.default.getRepository(university_entity_1.University), data_source_1.default.getRepository(major_entity_1.Major));
    const query = {
        subject_combination: 'A01',
        min_score: 27,
        major_id: (0, university_filter_scenarios_1.resolveMajorIdFromCatalog)(catalog, 'Công nghệ Thông tin'),
    };
    const expected = (0, university_filter_evaluator_1.evaluateUniversityFilter)(dataset, query);
    const api = await service.findAll({ ...query, page: 1, limit: 5000 });
    const apiIds = new Set(api.data.map((u) => u.id));
    const missing = [...expected].filter((id) => !apiIds.has(id));
    console.log('Query:', query);
    console.log('Expected:', expected.size, 'API total:', api.total, 'API data:', api.data.length);
    console.log('Missing from API:', missing.length);
    console.log('EAUT in API:', api.data.some((u) => u.short_name === 'EAUT'));
    const cnttMajorIds = new Set(catalog
        .filter((m) => m.name.toLowerCase().includes('công nghệ thông tin') ||
        m.name.toLowerCase().includes('hệ thống thông tin'))
        .map((m) => m.id));
    const expandedIds = (0, major_name_match_1.filterMajorIdsBySelectionName)(catalog, 'Công nghệ Thông tin');
    console.log('Expanded major ids:', expandedIds.length);
    for (const uniId of missing) {
        const uni = universities.find((u) => u.id === uniId);
        console.log(`\n--- ${uni?.short_name} (id ${uniId}) ---`);
        const ums = universityMajors.filter((um) => um.university_id === uniId);
        for (const um of ums) {
            const major = catalog.find((m) => m.id === um.major_id);
            const rows = cutoffs.filter((c) => c.university_major_id === um.id);
            const passes = (0, university_cutoff_filter_1.universityMajorPassesCutoffFilter)(rows, {
                subject_combination: 'A01',
                min_score: 27,
            });
            const inExpanded = expandedIds.includes(um.major_id);
            if (!inExpanded)
                continue;
            console.log(`  major: ${major?.name} | inExpanded=${inExpanded} | passes=${passes}`);
            for (const r of rows
                .filter((c) => (c.subject_combination ?? '').toUpperCase().includes('A01'))
                .sort((a, b) => b.year - a.year)
                .slice(0, 6)) {
                console.log(`    ${r.year} ${r.subject_combination} = ${r.score}`);
            }
        }
    }
    await data_source_1.default.destroy();
}
main().catch(async (e) => {
    console.error(e);
    if (data_source_1.default.isInitialized)
        await data_source_1.default.destroy();
    process.exit(1);
});
//# sourceMappingURL=diagnose-filter-gap.js.map