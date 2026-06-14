"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECOMMEND_MAX_MAJORS_PER_UNIVERSITY = exports.RECOMMEND_MAX_RESULTS = void 0;
exports.classifyAdmissionTier = classifyAdmissionTier;
exports.applyUniversityDiversityCap = applyUniversityDiversityCap;
function classifyAdmissionTier(scoreDiff) {
    if (scoreDiff === null)
        return null;
    if (scoreDiff >= 0)
        return 'safety';
    if (scoreDiff >= -1)
        return 'match';
    return 'reach';
}
exports.RECOMMEND_MAX_RESULTS = 15;
exports.RECOMMEND_MAX_MAJORS_PER_UNIVERSITY = 3;
function applyUniversityDiversityCap(results, maxResults = exports.RECOMMEND_MAX_RESULTS, maxPerUniversity = exports.RECOMMEND_MAX_MAJORS_PER_UNIVERSITY) {
    const perUniversity = new Map();
    const picked = [];
    let capped = false;
    for (const item of results) {
        const uniId = item.universityId;
        if (uniId == null) {
            picked.push(item);
            if (picked.length >= maxResults)
                break;
            continue;
        }
        const count = perUniversity.get(uniId) ?? 0;
        if (count >= maxPerUniversity) {
            capped = true;
            continue;
        }
        perUniversity.set(uniId, count + 1);
        picked.push(item);
        if (picked.length >= maxResults)
            break;
    }
    if (results.length > picked.length) {
        capped = true;
    }
    return { items: picked, capped };
}
//# sourceMappingURL=recommendation-tier.js.map