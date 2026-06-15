import {
  CUTOFF_FILTER_YEARS,
  cutoffMatchesSubjectCombination,
  subjectCombinationSqlMatch,
} from '../common/subject-combination';

export interface CutoffFilterRow {
  year: number;
  subject_combination: string | null | undefined;
  score: number;
}

export type CutoffFilterInput = {
  subject_combination?: string;
  min_score?: number;
};

/** Năm tham chiếu khi lọc theo điểm: luôn lấy năm mới nhất trong phạm vi dữ liệu. */
export function referenceYearForScoreFilter(
  rows: CutoffFilterRow[],
  combo: string | undefined,
  years: readonly number[] = CUTOFF_FILTER_YEARS,
): number | null {
  const pool = rowsForCombo(rows, combo, years);
  if (pool.length === 0) return null;
  return Math.max(...pool.map((r) => r.year));
}

/** Các dòng cutoff thuộc năm trong phạm vi và (tuỳ chọn) khớp tổ hợp. */
export function rowsForCombo(
  rows: CutoffFilterRow[],
  combo: string | undefined,
  years: readonly number[] = CUTOFF_FILTER_YEARS,
): CutoffFilterRow[] {
  const inYears = rows.filter((r) => years.includes(r.year));
  const trimmed = combo?.trim();
  if (!trimmed) return inYears;
  return inYears.filter((r) =>
    cutoffMatchesSubjectCombination(r.subject_combination, trimmed),
  );
}

/**
 * Trường–ngành thỏa bộ lọc điểm chuẩn khi MỌI điều kiện áp dụng trên cùng một dòng cutoff.
 * Khi có min_score: chỉ xét điểm năm mới nhất (trong 2023–2025) cho tổ hợp đã chọn (nếu có).
 */
export function universityMajorPassesCutoffFilter(
  rows: CutoffFilterRow[],
  input: CutoffFilterInput,
  years: readonly number[] = CUTOFF_FILTER_YEARS,
): boolean {
  const combo = input.subject_combination?.trim();
  const hasScore =
    input.min_score != null &&
    Number.isFinite(input.min_score) &&
    input.min_score > 0;

  if (!combo && !hasScore) return true;

  const matching = rowsForCombo(rows, combo, years);
  if (matching.length === 0) return false;

  if (!hasScore) return true;

  const refYear = referenceYearForScoreFilter(rows, combo, years);
  if (refYear == null) return false;

  return matching
    .filter((r) => r.year === refYear)
    .some((r) => r.score <= input.min_score!);
}

/**
 * SQL: ràng buộc scs là dòng năm mới nhất (trong cutoffYears) cho university_major,
 * có thể giới hạn theo tổ hợp khi combo được truyền.
 * @deprecated Prefer {@link latestCutoffYearJoinSql} — correlated subquery is slow on large datasets.
 */
export function latestCutoffYearSql(
  universityMajorAlias: string,
  cutoffAlias: string,
  comboParamName: string | null,
): string {
  const innerAlias = `${cutoffAlias}2`;
  const comboClause = comboParamName
    ? `AND ${subjectCombinationSqlMatch(`${innerAlias}.subject_combination`, comboParamName)}`
    : '';
  return `${cutoffAlias}.year = (
    SELECT MAX(${innerAlias}.year)
    FROM cutoff_scores ${innerAlias}
    WHERE ${innerAlias}.university_major_id = ${universityMajorAlias}.id
    AND ${innerAlias}.year IN (:...cutoffYears)
    ${comboClause}
  )`;
}

/**
 * SQL fragments: JOIN năm mới nhất theo university_major (GROUP BY thay vì correlated subquery).
 * Trả về alias bảng trung gian `lc` và alias cutoff `scs` đã join sẵn.
 */
export function latestCutoffYearJoinSql(
  universityMajorAlias: string,
  comboParamName: string | null,
): { latestAlias: string; cutoffAlias: string; joinSql: string } {
  const latestAlias = 'lc';
  const cutoffAlias = 'scs';
  const comboInner = comboParamName
    ? `AND ${subjectCombinationSqlMatch('csly.subject_combination', comboParamName)}`
    : '';
  const joinSql = `INNER JOIN (
    SELECT csly.university_major_id, MAX(csly.year) AS max_year
    FROM cutoff_scores csly
    WHERE csly.year IN (:...cutoffYears)
    ${comboInner}
    GROUP BY csly.university_major_id
  ) ${latestAlias} ON ${latestAlias}.university_major_id = ${universityMajorAlias}.id
  INNER JOIN cutoff_scores ${cutoffAlias}
    ON ${cutoffAlias}.university_major_id = ${universityMajorAlias}.id
    AND ${cutoffAlias}.year = ${latestAlias}.max_year`;
  return { latestAlias, cutoffAlias, joinSql };
}
