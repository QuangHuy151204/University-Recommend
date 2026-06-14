/** Chuẩn hoá mã tổ hợp môn (A00, D01, …). */
export function normalizeSubjectCombination(code: string): string {
  return code.trim().toUpperCase();
}

/** Tách chuỗi DB có thể chứa nhiều mã: "D01/D03", "A00, A01". */
export function splitSubjectCombination(stored: string): string[] {
  const raw = (stored ?? '').trim();
  if (!raw) return [];
  return raw
    .split(/[,;/]+/)
    .map((s) => normalizeSubjectCombination(s))
    .filter(Boolean);
}

/** Khớp tổ hợp người dùng với giá trị lưu trong cutoff_scores. */
export function cutoffMatchesSubjectCombination(
  stored: string | null | undefined,
  want: string,
): boolean {
  const target = normalizeSubjectCombination(want);
  if (!target) return true;
  const trimmed = (stored ?? '').trim();
  if (!trimmed) return false;
  if (normalizeSubjectCombination(trimmed) === target) return true;
  return splitSubjectCombination(trimmed).some((part) => part === target);
}

/**
 * SQL PostgreSQL: cột subject_combination khớp mã `:param` (exact hoặc trong list nhiều mã).
 * @param columnExpr e.g. `scs.subject_combination`
 * @param paramName e.g. `combo`
 */
export function subjectCombinationSqlMatch(
  columnExpr: string,
  paramName: string,
): string {
  return `(
    UPPER(TRIM(${columnExpr})) = UPPER(:${paramName})
    OR EXISTS (
      SELECT 1
      FROM regexp_split_to_table(COALESCE(${columnExpr}, ''), '[,;/]+') AS _sc_part(part)
      WHERE UPPER(TRIM(_sc_part.part)) = UPPER(:${paramName})
    )
  )`;
}

/** Năm điểm chuẩn dùng cho tra cứu / lọc trường Hà Nội. */
export const CUTOFF_FILTER_YEARS = [2023, 2024, 2025] as const;
