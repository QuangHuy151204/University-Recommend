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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path_1 = require("path");
const data_source_1 = __importDefault(require("../src/data-source"));
const data_scope_1 = require("../src/common/data-scope");
const subject_combination_1 = require("../src/common/subject-combination");
const major_entity_1 = require("../src/majors/major.entity");
const university_entity_1 = require("../src/universities/university.entity");
const universities_service_1 = require("../src/universities/universities.service");
const university_filter_evaluator_1 = require("../src/universities/university-filter-evaluator");
const university_cutoff_filter_1 = require("../src/universities/university-cutoff-filter");
const university_filter_scenarios_1 = require("./university-filter-scenarios");
dotenv.config({ path: (0, path_1.resolve)(__dirname, '../.env') });
const API_CONCURRENCY = 1;
async function loadDataset(ds) {
    const scope = `%${data_scope_1.DATA_SCOPE_LOCATION}%`;
    const years = [...subject_combination_1.CUTOFF_FILTER_YEARS];
    const [universities, universityMajors, cutoffs, catalog] = await Promise.all([
        ds.query(`SELECT id, name, short_name, location, type, tuition_fee_min
       FROM universities WHERE location ILIKE $1`, [scope]),
        ds.query(`SELECT um.id, um.university_id, um.major_id
       FROM university_majors um
       JOIN universities u ON u.id = um.university_id
       WHERE u.location ILIKE $1`, [scope]),
        ds.query(`SELECT cs.university_major_id, cs.year, cs.subject_combination, cs.score
       FROM cutoff_scores cs
       JOIN university_majors um ON um.id = cs.university_major_id
       JOIN universities u ON u.id = um.university_id
       WHERE u.location ILIKE $1 AND cs.year = ANY($2::int[])`, [scope, years]),
        ds.query(`SELECT id, name FROM majors`),
    ]);
    return { universities, universityMajors, cutoffs, catalog };
}
function idToLabel(ids, dataset) {
    const byId = new Map(dataset.universities.map((u) => [u.id, u.short_name]));
    return ids.map((id) => byId.get(id) ?? `#${id}`);
}
function reverseValidateResults(dataset, query, ids) {
    const majorIds = (0, university_filter_evaluator_1.resolveMajorIdsForFilter)(dataset.catalog, query.major_id);
    const cutoffInput = {
        subject_combination: query.subject_combination,
        min_score: query.min_score,
    };
    const cutoffsByUm = new Map();
    for (const c of dataset.cutoffs) {
        const list = cutoffsByUm.get(c.university_major_id) ?? [];
        list.push({
            year: c.year,
            subject_combination: c.subject_combination,
            score: c.score,
        });
        cutoffsByUm.set(c.university_major_id, list);
    }
    const umsByUni = new Map();
    for (const um of dataset.universityMajors) {
        const list = umsByUni.get(um.university_id) ?? [];
        list.push(um);
        umsByUni.set(um.university_id, list);
    }
    const invalid = [];
    for (const uniId of ids) {
        const ums = umsByUni.get(uniId) ?? [];
        const ok = ums.some((um) => {
            if (majorIds?.length && !majorIds.includes(um.major_id))
                return false;
            return (0, university_cutoff_filter_1.universityMajorPassesCutoffFilter)(cutoffsByUm.get(um.id) ?? [], cutoffInput);
        });
        if (!ok) {
            const uni = dataset.universities.find((u) => u.id === uniId);
            invalid.push(uni?.short_name ?? `#${uniId}`);
        }
    }
    return invalid;
}
async function queryApiService(service, query) {
    const result = await service.findAll({
        ...query,
        page: 1,
        limit: 5000,
    });
    return new Set(result.data.map((u) => u.id));
}
async function runInBatches(items, concurrency, fn) {
    const results = [];
    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchResults = await Promise.all(batch.map(fn));
        results.push(...batchResults);
    }
    return results;
}
async function main() {
    if (!data_source_1.default.isInitialized)
        await data_source_1.default.initialize();
    const uniRepo = data_source_1.default.getRepository(university_entity_1.University);
    const majorRepo = data_source_1.default.getRepository(major_entity_1.Major);
    const service = new universities_service_1.UniversitiesService(uniRepo, majorRepo);
    const dataset = await loadDataset(data_source_1.default);
    const scenarios = (0, university_filter_scenarios_1.buildUniversityFilterScenarios)(dataset.catalog);
    const apiScenarios = scenarios.filter((s) => university_filter_scenarios_1.API_SPOT_CHECK_IDS.includes(s.id));
    console.log(`Dataset: ${dataset.universities.length} trường HN, ${dataset.cutoffs.length} cutoff, ${dataset.catalog.length} ngành catalog`);
    console.log(`Kịch bản: ${scenarios.length}\n`);
    const failures = [];
    let memoryPass = 0;
    console.log('--- Phase 1: Ground-truth + kiểm tra ngược ---');
    for (const scenario of scenarios) {
        const expected = (0, university_filter_evaluator_1.evaluateUniversityFilter)(dataset, scenario.query);
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
    console.log(`--- Phase 2: API spot-check (${apiScenarios.length}/${scenarios.length} kịch bản đại diện) ---`);
    const apiResults = await runInBatches(apiScenarios, API_CONCURRENCY, async (scenario) => {
        const expected = (0, university_filter_evaluator_1.evaluateUniversityFilter)(dataset, scenario.query);
        const actual = await queryApiService(service, scenario.query);
        return { scenario, expected, actual };
    });
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
            if (f.missing.length)
                console.log(`  Thiếu: ${f.missing.join(', ')}`);
            if (f.extra.length)
                console.log(`  Thừa: ${f.extra.join(', ')}`);
        }
        await data_source_1.default.destroy();
        process.exit(1);
    }
    await data_source_1.default.destroy();
    console.log(`\nKết luận: ${scenarios.length} kịch bản ground-truth pass; API spot-check khớp.`);
}
main().catch(async (e) => {
    console.error(e);
    if (data_source_1.default.isInitialized)
        await data_source_1.default.destroy();
    process.exit(1);
});
//# sourceMappingURL=run-university-filter-audit.js.map