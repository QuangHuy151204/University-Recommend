"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickLongerText = pickLongerText;
exports.pickMajorKeeper = pickMajorKeeper;
exports.pickUniversityMajorKeeper = pickUniversityMajorKeeper;
exports.groupMajorsByCanonicalName = groupMajorsByCanonicalName;
exports.findDuplicateMajorGroups = findDuplicateMajorGroups;
exports.groupUniversityMajorsByPair = groupUniversityMajorsByPair;
exports.findDuplicateUniversityMajorGroups = findDuplicateUniversityMajorGroups;
exports.cutoffDedupeKey = cutoffDedupeKey;
exports.countCutoffDuplicates = countCutoffDuplicates;
const major_normalization_1 = require("./major-normalization");
function pickLongerText(a, b) {
    if (!a)
        return b;
    if (!b)
        return a;
    return b.trim().length > a.trim().length ? b : a;
}
function pickMajorKeeper(candidates) {
    const sorted = [...candidates].sort((a, b) => {
        if (b.links !== a.links)
            return b.links - a.links;
        const aCode = a.code?.trim() ? 1 : 0;
        const bCode = b.code?.trim() ? 1 : 0;
        if (bCode !== aCode)
            return bCode - aCode;
        return a.id - b.id;
    });
    return sorted[0];
}
function pickUniversityMajorKeeper(candidates) {
    const sorted = [...candidates].sort((a, b) => {
        if (b.cutoff_count !== a.cutoff_count)
            return b.cutoff_count - a.cutoff_count;
        return a.id - b.id;
    });
    return sorted[0];
}
function groupMajorsByCanonicalName(majors) {
    const byCanonical = new Map();
    for (const m of majors) {
        const key = (0, major_normalization_1.canonicalMajorName)(m.name);
        const bucket = byCanonical.get(key) ?? [];
        bucket.push(m);
        byCanonical.set(key, bucket);
    }
    return byCanonical;
}
function findDuplicateMajorGroups(majors) {
    const byCanonical = groupMajorsByCanonicalName(majors);
    return [...byCanonical.entries()]
        .filter(([, arr]) => arr.length > 1)
        .map(([canonical, group]) => ({ canonical, group }));
}
function groupUniversityMajorsByPair(rows) {
    const umByKey = new Map();
    for (const um of rows) {
        const key = `${um.university_id}|${um.major_id}`;
        const list = umByKey.get(key) ?? [];
        list.push(um);
        umByKey.set(key, list);
    }
    return umByKey;
}
function findDuplicateUniversityMajorGroups(rows) {
    const umByKey = groupUniversityMajorsByPair(rows);
    return [...umByKey.entries()]
        .filter(([, group]) => group.length > 1)
        .map(([key, group]) => ({ key, group }));
}
function normalizeDedupePart(value) {
    return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ');
}
function cutoffDedupeKey(row) {
    return `${row.year}|${normalizeDedupePart(row.admission_method ?? '')}|${normalizeDedupePart(row.subject_combination ?? '').toUpperCase()}`;
}
function countCutoffDuplicates(rows) {
    const seen = new Set();
    let dupes = 0;
    for (const c of rows) {
        const key = cutoffDedupeKey(c);
        if (seen.has(key))
            dupes++;
        else
            seen.add(key);
    }
    return dupes;
}
//# sourceMappingURL=duplicate-cleanup.js.map