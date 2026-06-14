"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUTOFF_FILTER_YEARS = void 0;
exports.resolveMajorIdsForFilter = resolveMajorIdsForFilter;
exports.evaluateUniversityFilter = evaluateUniversityFilter;
const data_scope_1 = require("../common/data-scope");
const subject_combination_1 = require("../common/subject-combination");
Object.defineProperty(exports, "CUTOFF_FILTER_YEARS", { enumerable: true, get: function () { return subject_combination_1.CUTOFF_FILTER_YEARS; } });
const major_name_match_1 = require("../majors/major-name-match");
const university_cutoff_filter_1 = require("./university-cutoff-filter");
function resolveMajorIdsForFilter(catalog, major_id) {
    if (major_id == null || !Number.isInteger(major_id) || major_id <= 0) {
        return undefined;
    }
    const selected = catalog.find((m) => m.id === major_id);
    if (!selected)
        return [major_id];
    const ids = (0, major_name_match_1.filterMajorIdsBySelectionName)(catalog, selected.name);
    return ids.length > 0 ? ids : [major_id];
}
function hasActiveCutoffFilters(query) {
    const combo = query.subject_combination?.trim();
    const hasScore = query.min_score != null &&
        Number.isFinite(query.min_score) &&
        query.min_score > 0;
    const hasMajor = query.major_id != null &&
        Number.isInteger(query.major_id) &&
        query.major_id > 0;
    return Boolean(combo || hasScore || hasMajor);
}
function universityPassesBaseFilters(uni, query) {
    if (!uni.location?.includes(data_scope_1.DATA_SCOPE_LOCATION))
        return false;
    if (query.search?.trim()) {
        const s = query.search.trim().toLowerCase();
        const hit = uni.name.toLowerCase().includes(s) ||
            uni.short_name.toLowerCase().includes(s);
        if (!hit)
            return false;
    }
    if (query.location?.trim()) {
        if (!uni.location.toLowerCase().includes(query.location.trim().toLowerCase())) {
            return false;
        }
    }
    if (query.type && uni.type !== query.type)
        return false;
    if (query.max_tuition != null && Number.isFinite(query.max_tuition)) {
        if (uni.tuition_fee_min == null ||
            uni.tuition_fee_min > query.max_tuition) {
            return false;
        }
    }
    return true;
}
function universityMajorPassesFilter(um, cutoffs, majorIds, cutoffInput) {
    if (majorIds != null &&
        majorIds.length > 0 &&
        !majorIds.includes(um.major_id)) {
        return false;
    }
    if (!cutoffInput.subject_combination?.trim() &&
        (cutoffInput.min_score == null ||
            !Number.isFinite(cutoffInput.min_score) ||
            cutoffInput.min_score <= 0)) {
        return true;
    }
    return (0, university_cutoff_filter_1.universityMajorPassesCutoffFilter)(cutoffs, cutoffInput);
}
function evaluateUniversityFilter(dataset, query) {
    const majorIds = resolveMajorIdsForFilter(dataset.catalog, query.major_id);
    const cutoffInput = {
        subject_combination: query.subject_combination,
        min_score: query.min_score,
    };
    const needsCutoffJoin = hasActiveCutoffFilters(query);
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
    const umsByUniversity = new Map();
    for (const um of dataset.universityMajors) {
        const list = umsByUniversity.get(um.university_id) ?? [];
        list.push(um);
        umsByUniversity.set(um.university_id, list);
    }
    const matched = new Set();
    for (const uni of dataset.universities) {
        if (!universityPassesBaseFilters(uni, query))
            continue;
        const ums = umsByUniversity.get(uni.id) ?? [];
        if (!needsCutoffJoin) {
            matched.add(uni.id);
            continue;
        }
        const qualifying = ums.some((um) => universityMajorPassesFilter(um, cutoffsByUm.get(um.id) ?? [], majorIds, cutoffInput));
        if (qualifying)
            matched.add(uni.id);
    }
    return matched;
}
//# sourceMappingURL=university-filter-evaluator.js.map