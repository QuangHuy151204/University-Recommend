"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.majorBelongsToGroup = exports.classifyMajor = exports.MAJOR_GROUP_BY_ID = exports.MAJOR_GROUPS = void 0;
exports.normalizeGroupSlug = normalizeGroupSlug;
exports.groupToSlug = groupToSlug;
exports.resolveGroupSlug = resolveGroupSlug;
exports.canonicalFieldGroup = canonicalFieldGroup;
exports.majorMatchesGroupSlug = majorMatchesGroupSlug;
exports.canonicalMajorName = canonicalMajorName;
exports.resolveMajorGroups = resolveMajorGroups;
exports.resolveMajorTags = resolveMajorTags;
const major_classification_1 = require("./major-classification");
const major_groups_catalog_1 = require("./major-groups-catalog");
var major_groups_catalog_2 = require("./major-groups-catalog");
Object.defineProperty(exports, "MAJOR_GROUPS", { enumerable: true, get: function () { return major_groups_catalog_2.MAJOR_GROUPS; } });
Object.defineProperty(exports, "MAJOR_GROUP_BY_ID", { enumerable: true, get: function () { return major_groups_catalog_2.MAJOR_GROUP_BY_ID; } });
var major_classification_2 = require("./major-classification");
Object.defineProperty(exports, "classifyMajor", { enumerable: true, get: function () { return major_classification_2.classifyMajor; } });
Object.defineProperty(exports, "majorBelongsToGroup", { enumerable: true, get: function () { return major_classification_2.majorBelongsToGroup; } });
function normalizeText(input) {
    return input
        .toLowerCase()
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
const GROUP_SLUG_ALIASES = {
    'cong-nghe': 'cong-nghe-thong-tin',
    'kinh-te': 'kinh-te-kinh-doanh',
    'ky-thuat': 'ky-thuat-cong-nghiep',
    'y-duoc': 'y-duoc-suc-khoe',
    'y-te': 'y-duoc-suc-khoe',
};
function normalizeGroupSlug(slug) {
    const base = slug
        .toLowerCase()
        .trim()
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return GROUP_SLUG_ALIASES[base] ?? base;
}
function groupToSlug(groupName) {
    return normalizeGroupSlug(normalizeText(groupName).replace(/\s+/g, '-'));
}
function resolveGroupSlug(slug) {
    const normalizedSlug = normalizeGroupSlug(slug);
    for (const group of major_groups_catalog_1.MAJOR_GROUPS) {
        if (group.group_id === normalizedSlug)
            return group.group_name;
        if (groupToSlug(group.group_name) === normalizedSlug)
            return group.group_name;
    }
    if (normalizedSlug === 'khac')
        return major_groups_catalog_1.KHAC_GROUP_NAME;
    return null;
}
function canonicalFieldGroup(majorName, rawFieldGroup) {
    return (0, major_classification_1.classifyMajor)(majorName, rawFieldGroup).primary_group_name;
}
function majorMatchesGroupSlug(majorName, rawFieldGroup, slug, storedGroupIds) {
    const normalizedSlug = normalizeGroupSlug(slug);
    if (storedGroupIds?.length) {
        return storedGroupIds.includes(normalizedSlug);
    }
    const classification = (0, major_classification_1.classifyMajor)(majorName, rawFieldGroup);
    if (classification.group_ids.includes(normalizedSlug))
        return true;
    return classification.group_names.some((name) => groupToSlug(name) === normalizedSlug);
}
function canonicalMajorName(name) {
    return normalizeText(name);
}
function resolveMajorGroups(majorName, rawFieldGroup) {
    return (0, major_classification_1.classifyMajor)(majorName, rawFieldGroup).group_names;
}
function resolveMajorTags(majorName, rawFieldGroup) {
    return (0, major_classification_1.classifyMajor)(majorName, rawFieldGroup).tags;
}
//# sourceMappingURL=major-normalization.js.map