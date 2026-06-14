import { canonicalMajorName } from './major-normalization';

/**
 * Cụm ngành gần nghĩa cho tra cứu — chỉ mở rộng trong cùng cụm (tránh token "thông" quá rộng).
 */
const UNIVERSITY_FILTER_SIBLING_CLUSTERS: readonly (readonly string[])[] = [
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

function normalizedMajorIncludesKeyword(
  name: string,
  keyword: string,
): boolean {
  return canonicalMajorName(name).includes(keyword);
}

function inSameSiblingCluster(a: string, b: string): boolean {
  for (const cluster of UNIVERSITY_FILTER_SIBLING_CLUSTERS) {
    const inA = cluster.some((kw) => normalizedMajorIncludesKeyword(a, kw));
    const inB = cluster.some((kw) => normalizedMajorIncludesKeyword(b, kw));
    if (inA && inB) return true;
  }
  return false;
}

/**
 * Khớp tên ngành đào tạo tại trường với ngành người dùng chọn trong catalog.
 * Cho phép biến thể: "Công nghệ Thông tin (Việt-Pháp)", "… - Truyền thông", v.v.
 */
export function majorNameMatchesSelection(
  programMajorName: string,
  selectedMajorName: string,
): boolean {
  const program = canonicalMajorName(programMajorName);
  const selected = canonicalMajorName(selectedMajorName);
  if (!selected) return true;
  if (!program) return false;
  if (program === selected) return true;
  if (program.startsWith(`${selected} `)) return true;
  if (program.endsWith(` ${selected}`)) return true;
  if (program.includes(` ${selected} `)) return true;
  // Tên dài (≥ 12 ký tự chuẩn hoá) — cho phép khớp con, vd. "Hệ thống thông tin (CNTT)"
  if (selected.length >= 12 && program.includes(selected)) return true;
  if (program.length >= 12 && selected.includes(program)) return true;
  return false;
}

/**
 * Khớp ngành cho bộ lọc tra cứu: tên biến thể + cùng cụm ngành gần nghĩa (vd. CNTT ↔ HTTT).
 */
export function majorsRelatedForUniversityFilter(
  programMajorName: string,
  selectedMajorName: string,
): boolean {
  if (majorNameMatchesSelection(programMajorName, selectedMajorName)) {
    return true;
  }
  return inSameSiblingCluster(programMajorName, selectedMajorName);
}

export function filterMajorIdsBySelectionName(
  majors: Array<{ id: number; name: string }>,
  selectedMajorName: string,
): number[] {
  return majors
    .filter((m) => majorsRelatedForUniversityFilter(m.name, selectedMajorName))
    .map((m) => m.id);
}
