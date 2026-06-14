"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceYearForScoreFilter = referenceYearForScoreFilter;
exports.rowsForCombo = rowsForCombo;
exports.universityMajorPassesCutoffFilter = universityMajorPassesCutoffFilter;
exports.latestCutoffYearSql = latestCutoffYearSql;
const subject_combination_1 = require("../common/subject-combination");
function referenceYearForScoreFilter(rows, combo, years = subject_combination_1.CUTOFF_FILTER_YEARS) {
    const pool = rowsForCombo(rows, combo, years);
    if (pool.length === 0)
        return null;
    return Math.max(...pool.map((r) => r.year));
}
function rowsForCombo(rows, combo, years = subject_combination_1.CUTOFF_FILTER_YEARS) {
    const inYears = rows.filter((r) => years.includes(r.year));
    const trimmed = combo?.trim();
    if (!trimmed)
        return inYears;
    return inYears.filter((r) => (0, subject_combination_1.cutoffMatchesSubjectCombination)(r.subject_combination, trimmed));
}
function universityMajorPassesCutoffFilter(rows, input, years = subject_combination_1.CUTOFF_FILTER_YEARS) {
    const combo = input.subject_combination?.trim();
    const hasScore = input.min_score != null &&
        Number.isFinite(input.min_score) &&
        input.min_score > 0;
    if (!combo && !hasScore)
        return true;
    const matching = rowsForCombo(rows, combo, years);
    if (matching.length === 0)
        return false;
    if (!hasScore)
        return true;
    const refYear = referenceYearForScoreFilter(rows, combo, years);
    if (refYear == null)
        return false;
    return matching
        .filter((r) => r.year === refYear)
        .some((r) => r.score <= input.min_score);
}
function latestCutoffYearSql(universityMajorAlias, cutoffAlias, comboParamName) {
    const innerAlias = `${cutoffAlias}2`;
    const comboClause = comboParamName
        ? `AND ${(0, subject_combination_1.subjectCombinationSqlMatch)(`${innerAlias}.subject_combination`, comboParamName)}`
        : '';
    return `${cutoffAlias}.year = (
    SELECT MAX(${innerAlias}.year)
    FROM cutoff_scores ${innerAlias}
    WHERE ${innerAlias}.university_major_id = ${universityMajorAlias}.id
    AND ${innerAlias}.year IN (:...cutoffYears)
    ${comboClause}
  )`;
}
//# sourceMappingURL=university-cutoff-filter.js.map