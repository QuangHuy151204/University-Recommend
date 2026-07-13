// @file: Builds per-major cutoff summaries for a university detail view.
import { CUTOFF_FILTER_YEARS } from '../common/subject-combination';
import {
  referenceYearForScoreFilter,
  rowsForCombo,
  type CutoffFilterRow,
} from './university-cutoff-filter';

export type FilteredMajorCutoffRow = CutoffFilterRow & {
  university_id: number;
  major_name: string;
};

export type FilteredMajorCutoff = {
  majorName: string;
  score: number;
  year: number;
};

/**
 * Chọn điểm chuẩn hiển thị trên thẻ trường khi lọc theo ngành.
 * Ưu tiên năm mới nhất (2025), cùng tổ hợp nếu user đã chọn; nhiều dòng → lấy điểm thấp nhất.
 */
export function pickFilteredMajorCutoffScore(
  rows: CutoffFilterRow[],
  subjectCombination?: string,
): { score: number; year: number } | null {
  const matching = rowsForCombo(rows, subjectCombination, CUTOFF_FILTER_YEARS);
  if (matching.length === 0) return null;

  const refYear = referenceYearForScoreFilter(
    matching,
    subjectCombination,
    CUTOFF_FILTER_YEARS,
  );
  if (refYear == null) return null;

  const yearRows = matching.filter((r) => r.year === refYear);
  if (yearRows.length === 0) return null;

  return {
    year: refYear,
    score: Math.min(...yearRows.map((r) => r.score)),
  };
}

/** Gom cutoff theo trường từ các dòng university_major + cutoff. */
export function buildFilteredMajorCutoffMap(
  rows: FilteredMajorCutoffRow[],
  subjectCombination?: string,
): Map<number, FilteredMajorCutoff> {
  const byUniversity = new Map<number, FilteredMajorCutoffRow[]>();
  for (const row of rows) {
    const list = byUniversity.get(row.university_id) ?? [];
    list.push(row);
    byUniversity.set(row.university_id, list);
  }

  const result = new Map<number, FilteredMajorCutoff>();
  for (const [universityId, uniRows] of byUniversity) {
    const cutoffRows: CutoffFilterRow[] = uniRows.map((r) => ({
      year: r.year,
      subject_combination: r.subject_combination,
      score: r.score,
    }));
    const picked = pickFilteredMajorCutoffScore(cutoffRows, subjectCombination);
    if (!picked) continue;

    result.set(universityId, {
      majorName: uniRows[0].major_name,
      score: picked.score,
      year: picked.year,
    });
  }

  return result;
}
