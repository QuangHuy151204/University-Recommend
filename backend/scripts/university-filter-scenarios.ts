import type { UniversityFilterQuery } from '../src/universities/university-filter-evaluator';
import { canonicalMajorName } from '../src/majors/major-normalization';

export type FilterScenario = {
  id: string;
  label: string;
  query: UniversityFilterQuery;
};

/** Kịch bản đại diện để đối chiếu UniversitiesService (SQL) — mỗi chiều lọc ≥1 case. */
export const API_SPOT_CHECK_IDS = [
  'combo-a01',
  'score-27',
  'major-cntt',
  'major-httt',
  'major-luat',
  'a01-cntt-27',
  'a01-cntt-24',
  'b01-cntt-25',
  'a00-cntt-26',
  'a01-httt-27',
  'd01-luat-24',
  'a01-ykhoa-28',
  'tuition-15m-a01-25',
  'tuition-25m-a01-cntt-26',
  'a01-26',
  'b01-27',
  'c00-marketing',
  'a01-cntt-22',
] as const;

export function resolveMajorIdFromCatalog(
  catalog: Array<{ id: number; name: string }>,
  name: string,
): number | undefined {
  const exact = catalog.find((m) => m.name === name);
  if (exact) return exact.id;
  const canon = canonicalMajorName(name);
  const byCanon = catalog.find((m) => canonicalMajorName(m.name) === canon);
  if (byCanon) return byCanon.id;
  const partial = catalog.find(
    (m) =>
      canonicalMajorName(m.name).includes(canon) ||
      canon.includes(canonicalMajorName(m.name)),
  );
  return partial?.id;
}

/** ~56 kịch bản người dùng thường chọn trên /universities */
export function buildUniversityFilterScenarios(
  catalog: Array<{ id: number; name: string }>,
): FilterScenario[] {
  const m = (name: string) => resolveMajorIdFromCatalog(catalog, name);

  const withMajor = (
    id: string,
    label: string,
    query: Omit<UniversityFilterQuery, 'major_id'> & { major?: string },
  ): FilterScenario | null => {
    const { major, ...rest } = query;
    if (!major) return { id, label, query: rest };
    const major_id = m(major);
    if (major_id == null) return null;
    return { id, label, query: { ...rest, major_id } };
  };

  const scenarios: Array<FilterScenario | null> = [
    // --- Chỉ tổ hợp (8) ---
    { id: 'combo-a00', label: 'Tổ hợp A00', query: { subject_combination: 'A00' } },
    { id: 'combo-a01', label: 'Tổ hợp A01', query: { subject_combination: 'A01' } },
    { id: 'combo-a02', label: 'Tổ hợp A02', query: { subject_combination: 'A02' } },
    { id: 'combo-b00', label: 'Tổ hợp B00', query: { subject_combination: 'B00' } },
    { id: 'combo-b01', label: 'Tổ hợp B01', query: { subject_combination: 'B01' } },
    { id: 'combo-c00', label: 'Tổ hợp C00', query: { subject_combination: 'C00' } },
    { id: 'combo-d01', label: 'Tổ hợp D01', query: { subject_combination: 'D01' } },
    { id: 'combo-d07', label: 'Tổ hợp D07', query: { subject_combination: 'D07' } },

    // --- Chỉ điểm (6) ---
    { id: 'score-22', label: 'Điểm ≤22', query: { min_score: 22 } },
    { id: 'score-24', label: 'Điểm ≤24', query: { min_score: 24 } },
    { id: 'score-25', label: 'Điểm ≤25', query: { min_score: 25 } },
    { id: 'score-26', label: 'Điểm ≤26', query: { min_score: 26 } },
    { id: 'score-27', label: 'Điểm ≤27', query: { min_score: 27 } },
    { id: 'score-28', label: 'Điểm ≤28', query: { min_score: 28 } },

    // --- Chỉ ngành (8) ---
    withMajor('major-cntt', 'Ngành Công nghệ Thông tin', { major: 'Công nghệ Thông tin' }),
    withMajor('major-httt', 'Ngành Hệ thống thông tin', { major: 'Hệ thống thông tin' }),
    withMajor('major-ketoan', 'Ngành Kế toán', { major: 'Kế toán' }),
    withMajor('major-qtkd', 'Ngành Quản trị Kinh doanh', { major: 'Quản trị Kinh doanh' }),
    withMajor('major-ykhoa', 'Ngành Y khoa', { major: 'Y khoa' }),
    withMajor('major-luat', 'Ngành Luật', { major: 'Luật' }),
    withMajor('major-marketing', 'Ngành Marketing', { major: 'Marketing' }),
    withMajor('major-xaydung', 'Ngành Kỹ thuật Xây dựng', { major: 'Kỹ thuật Xây dựng' }),

    // --- Tổ hợp + điểm (12) ---
    { id: 'a01-22', label: 'A01 + ≤22', query: { subject_combination: 'A01', min_score: 22 } },
    { id: 'a01-24', label: 'A01 + ≤24', query: { subject_combination: 'A01', min_score: 24 } },
    { id: 'a01-26', label: 'A01 + ≤26', query: { subject_combination: 'A01', min_score: 26 } },
    { id: 'a01-27', label: 'A01 + ≤27', query: { subject_combination: 'A01', min_score: 27 } },
    { id: 'a01-28', label: 'A01 + ≤28', query: { subject_combination: 'A01', min_score: 28 } },
    { id: 'b01-24', label: 'B01 + ≤24', query: { subject_combination: 'B01', min_score: 24 } },
    { id: 'b01-25', label: 'B01 + ≤25', query: { subject_combination: 'B01', min_score: 25 } },
    { id: 'b01-27', label: 'B01 + ≤27', query: { subject_combination: 'B01', min_score: 27 } },
    { id: 'a00-26', label: 'A00 + ≤26', query: { subject_combination: 'A00', min_score: 26 } },
    { id: 'a00-28', label: 'A00 + ≤28', query: { subject_combination: 'A00', min_score: 28 } },
    { id: 'd01-24', label: 'D01 + ≤24', query: { subject_combination: 'D01', min_score: 24 } },
    { id: 'd01-26', label: 'D01 + ≤26', query: { subject_combination: 'D01', min_score: 26 } },

    // --- Tổ hợp + ngành (8) ---
    withMajor('a01-cntt', 'A01 + CNTT', {
      subject_combination: 'A01',
      major: 'Công nghệ Thông tin',
    }),
    withMajor('b01-cntt', 'B01 + CNTT', {
      subject_combination: 'B01',
      major: 'Công nghệ Thông tin',
    }),
    withMajor('a00-cntt', 'A00 + CNTT', {
      subject_combination: 'A00',
      major: 'Công nghệ Thông tin',
    }),
    withMajor('a01-ketoan', 'A01 + Kế toán', {
      subject_combination: 'A01',
      major: 'Kế toán',
    }),
    withMajor('b01-qtkd', 'B01 + QTKD', {
      subject_combination: 'B01',
      major: 'Quản trị Kinh doanh',
    }),
    withMajor('a01-ykhoa', 'A01 + Y khoa', {
      subject_combination: 'A01',
      major: 'Y khoa',
    }),
    withMajor('d01-luat', 'D01 + Luật', {
      subject_combination: 'D01',
      major: 'Luật',
    }),
    withMajor('c00-marketing', 'C00 + Marketing', {
      subject_combination: 'C00',
      major: 'Marketing',
    }),

    // --- Tổ hợp + ngành + điểm (10) ---
    withMajor('a01-cntt-27', 'A01 + CNTT + ≤27', {
      subject_combination: 'A01',
      min_score: 27,
      major: 'Công nghệ Thông tin',
    }),
    withMajor('a01-cntt-24', 'A01 + CNTT + ≤24', {
      subject_combination: 'A01',
      min_score: 24,
      major: 'Công nghệ Thông tin',
    }),
    withMajor('b01-cntt-25', 'B01 + CNTT + ≤25', {
      subject_combination: 'B01',
      min_score: 25,
      major: 'Công nghệ Thông tin',
    }),
    withMajor('a00-cntt-26', 'A00 + CNTT + ≤26', {
      subject_combination: 'A00',
      min_score: 26,
      major: 'Công nghệ Thông tin',
    }),
    withMajor('a01-httt-27', 'A01 + HTTT + ≤27', {
      subject_combination: 'A01',
      min_score: 27,
      major: 'Hệ thống thông tin',
    }),
    withMajor('a01-ketoan-24', 'A01 + Kế toán + ≤24', {
      subject_combination: 'A01',
      min_score: 24,
      major: 'Kế toán',
    }),
    withMajor('b01-qtkd-26', 'B01 + QTKD + ≤26', {
      subject_combination: 'B01',
      min_score: 26,
      major: 'Quản trị Kinh doanh',
    }),
    withMajor('a01-ykhoa-28', 'A01 + Y khoa + ≤28', {
      subject_combination: 'A01',
      min_score: 28,
      major: 'Y khoa',
    }),
    withMajor('d01-luat-24', 'D01 + Luật + ≤24', {
      subject_combination: 'D01',
      min_score: 24,
      major: 'Luật',
    }),
    withMajor('a01-cntt-22', 'A01 + CNTT + ≤22', {
      subject_combination: 'A01',
      min_score: 22,
      major: 'Công nghệ Thông tin',
    }),

    // --- Học phí + bộ lọc điểm (4) ---
    {
      id: 'tuition-15m-a01-25',
      label: 'Học phí ≤15tr + A01 + ≤25',
      query: { max_tuition: 15_000_000, subject_combination: 'A01', min_score: 25 },
    },
    withMajor('tuition-30m-b01-cntt', 'Học phí ≤30tr + B01 + CNTT', {
      max_tuition: 30_000_000,
      subject_combination: 'B01',
      major: 'Công nghệ Thông tin',
    }),
    {
      id: 'tuition-20m-score-24',
      label: 'Học phí ≤20tr + ≤24',
      query: { max_tuition: 20_000_000, min_score: 24 },
    },
    withMajor('tuition-25m-a01-cntt-26', 'Học phí ≤25tr + A01 + CNTT + ≤26', {
      max_tuition: 25_000_000,
      subject_combination: 'A01',
      min_score: 26,
      major: 'Công nghệ Thông tin',
    }),
  ];

  return scenarios.filter((s): s is FilterScenario => s != null);
}
