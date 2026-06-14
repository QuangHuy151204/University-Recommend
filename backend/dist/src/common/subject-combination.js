"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUTOFF_FILTER_YEARS = void 0;
exports.normalizeSubjectCombination = normalizeSubjectCombination;
exports.splitSubjectCombination = splitSubjectCombination;
exports.cutoffMatchesSubjectCombination = cutoffMatchesSubjectCombination;
exports.subjectCombinationSqlMatch = subjectCombinationSqlMatch;
function normalizeSubjectCombination(code) {
    return code.trim().toUpperCase();
}
function splitSubjectCombination(stored) {
    const raw = (stored ?? '').trim();
    if (!raw)
        return [];
    return raw
        .split(/[,;/]+/)
        .map((s) => normalizeSubjectCombination(s))
        .filter(Boolean);
}
function cutoffMatchesSubjectCombination(stored, want) {
    const target = normalizeSubjectCombination(want);
    if (!target)
        return true;
    const trimmed = (stored ?? '').trim();
    if (!trimmed)
        return false;
    if (normalizeSubjectCombination(trimmed) === target)
        return true;
    return splitSubjectCombination(trimmed).some((part) => part === target);
}
function subjectCombinationSqlMatch(columnExpr, paramName) {
    return `(
    UPPER(TRIM(${columnExpr})) = UPPER(:${paramName})
    OR EXISTS (
      SELECT 1
      FROM regexp_split_to_table(COALESCE(${columnExpr}, ''), '[,;/]+') AS _sc_part(part)
      WHERE UPPER(TRIM(_sc_part.part)) = UPPER(:${paramName})
    )
  )`;
}
exports.CUTOFF_FILTER_YEARS = [2023, 2024, 2025];
//# sourceMappingURL=subject-combination.js.map