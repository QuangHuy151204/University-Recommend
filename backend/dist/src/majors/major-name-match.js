"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.majorNameMatchesSelection = majorNameMatchesSelection;
exports.majorsRelatedForUniversityFilter = majorsRelatedForUniversityFilter;
exports.filterMajorIdsBySelectionName = filterMajorIdsBySelectionName;
const major_normalization_1 = require("./major-normalization");
const UNIVERSITY_FILTER_SIBLING_CLUSTERS = [
    [
        'cong nghe thong tin',
        'he thong thong tin',
        'khoa hoc may tinh',
        'ky thuat phan mem',
        'cong nghe phan mem',
        'mang may tinh',
        'ky thuat may tinh',
        'an toan thong tin',
        'tri tue nhan tao',
        'khoa hoc du lieu',
    ],
    [
        'quan tri kinh doanh',
        'quan tri kinh te',
        'kinh te quoc te',
        'kinh te dau tu',
        'kinh te',
        'marketing',
        'thuong mai dien tu',
    ],
    [
        'tai chinh ngan hang',
        'tai chinh',
        'ngan hang',
        'ke toan',
        'ke toan kiem toan',
    ],
    ['y khoa', 'y duoc', 'duoc', 'dieu duong', 'rang ham mat', 'y hoc co so'],
];
function normalizedMajorIncludesKeyword(name, keyword) {
    return (0, major_normalization_1.canonicalMajorName)(name).includes(keyword);
}
function inSameSiblingCluster(a, b) {
    for (const cluster of UNIVERSITY_FILTER_SIBLING_CLUSTERS) {
        const inA = cluster.some((kw) => normalizedMajorIncludesKeyword(a, kw));
        const inB = cluster.some((kw) => normalizedMajorIncludesKeyword(b, kw));
        if (inA && inB)
            return true;
    }
    return false;
}
function majorNameMatchesSelection(programMajorName, selectedMajorName) {
    const program = (0, major_normalization_1.canonicalMajorName)(programMajorName);
    const selected = (0, major_normalization_1.canonicalMajorName)(selectedMajorName);
    if (!selected)
        return true;
    if (!program)
        return false;
    if (program === selected)
        return true;
    if (program.startsWith(`${selected} `))
        return true;
    if (program.endsWith(` ${selected}`))
        return true;
    if (program.includes(` ${selected} `))
        return true;
    if (selected.length >= 12 && program.includes(selected))
        return true;
    if (program.length >= 12 && selected.includes(program))
        return true;
    return false;
}
function majorsRelatedForUniversityFilter(programMajorName, selectedMajorName) {
    if (majorNameMatchesSelection(programMajorName, selectedMajorName)) {
        return true;
    }
    return inSameSiblingCluster(programMajorName, selectedMajorName);
}
function filterMajorIdsBySelectionName(majors, selectedMajorName) {
    return majors
        .filter((m) => majorsRelatedForUniversityFilter(m.name, selectedMajorName))
        .map((m) => m.id);
}
//# sourceMappingURL=major-name-match.js.map