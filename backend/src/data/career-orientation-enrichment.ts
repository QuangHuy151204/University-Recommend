import { canonicalFieldGroup } from '../majors/major-normalization';

/** Nhóm ngành ưu tiên bổ sung career_orientation (theo yêu cầu đồ án). */
export const ENRICH_FIELD_GROUPS = [
  'Công nghệ thông tin',
  'Kinh tế - Kinh doanh',
  'Y dược - Sức khỏe',
] as const;

export type EnrichFieldGroup = (typeof ENRICH_FIELD_GROUPS)[number];

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Bỏ hậu tố chương trình (CLC, tiên tiến, quốc tế, …) để kế thừa mô tả ngành gốc. */
export function stripProgramSuffix(name: string): string {
  return name
    .replace(/\s*[\(\-–—].*$/, '')
    .replace(/\s+(CLC|clc|chất lượng cao|tiên tiến|quốc tế|POHE|pohe)\b.*$/i, '')
    .trim();
}

export const FIELD_GROUP_CAREER_DEFAULTS: Record<EnrichFieldGroup, string> = {
  'Công nghệ thông tin':
    'Kỹ sư/lập trình viên phần mềm; chuyên viên phân tích hệ thống; quản trị mạng và hạ tầng; kiểm thử phần mềm; DevOps/SRE; chuyên viên dữ liệu và AI ứng dụng',
  'Kinh tế - Kinh doanh':
    'Chuyên viên/phân tích tài chính; kế toán–kiểm toán; nhân viên ngân hàng; chuyên viên kinh doanh và thương mại; nhà phân tích đầu tư; quản lý doanh nghiệp và khởi nghiệp',
  'Y dược - Sức khỏe':
    'Bác sĩ lâm sàng; dược sĩ; điều dưỡng viên; kỹ thuật viên y tế; nhân viên y tế công cộng; nghiên cứu viên y sinh (tùy chuyên ngành)',
};

type PatternRule = {
  id: string;
  test: (norm: string) => boolean;
  text: string;
  group?: EnrichFieldGroup;
};

/** Ghi đè theo cụm từ trong tên ngành — ưu tiên hơn mặc định nhóm. */
export const MAJOR_CAREER_PATTERN_RULES: PatternRule[] = [
  {
    id: 'cntt-core',
    group: 'Công nghệ thông tin',
    test: (n) =>
      n.includes('cong nghe thong tin') ||
      n === 'cntt' ||
      n.includes('ky thuat phan mem') ||
      n.includes('khoa hoc may tinh'),
    text: 'Kỹ sư phần mềm; lập trình viên full-stack/mobile; kiểm thử phần mềm; quản lý dự án CNTT',
  },
  {
    id: 'he-thong-thong-tin',
    group: 'Công nghệ thông tin',
    test: (n) => n.includes('he thong thong tin'),
    text: 'Chuyên viên phân tích nghiệp vụ; quản trị hệ thống; tư vấn giải pháp ERP/CRM; chuyên viên dữ liệu doanh nghiệp',
  },
  {
    id: 'an-toan-thong-tin',
    group: 'Công nghệ thông tin',
    test: (n) =>
      n.includes('an toan thong tin') ||
      n.includes('an ninh mang') ||
      n.includes('cyber security') ||
      n.includes('an toan du lieu'),
    text: 'Chuyên viên an ninh mạng; kiểm thử bảo mật; quản trị bảo mật hệ thống; SOC analyst; tư vấn an toàn thông tin',
  },
  {
    id: 'tri-tue-nhan-tao',
    group: 'Công nghệ thông tin',
    test: (n) =>
      n.includes('tri tue nhan tao') ||
      n.includes('machine learning') ||
      n.includes('deep learning') ||
      n.includes('khoa hoc du lieu'),
    text: 'Kỹ sư AI/ML; nhà khoa học dữ liệu; chuyên viên phân tích dữ liệu lớn; nghiên cứu viên AI ứng dụng',
  },
  {
    id: 'bac-si',
    group: 'Y dược - Sức khỏe',
    test: (n) => n.includes('bac si') || n.includes('y khoa') || n.includes('y hoc'),
    text: 'Bác sĩ đa khoa/chuyên khoa (sau đào tạo chuyên sâu); bác sĩ nội trú; cán bộ y tế cơ sở; nghiên cứu lâm sàng',
  },
  {
    id: 'duoc',
    group: 'Y dược - Sức khỏe',
    test: (n) => n.includes('duoc') && !n.includes('duoc lieu'),
    text: 'Dược sĩ lâm sàng; dược sĩ công nghiệp; chuyên viên kiểm nghiệm dược; tư vấn sử dụng thuốc an toàn',
  },
  {
    id: 'dieu-duong',
    group: 'Y dược - Sức khỏe',
    test: (n) => n.includes('dieu duong') || n.includes('ho sinh'),
    text: 'Điều dưỡng viên bệnh viện; điều dưỡng cộng đồng; hộ sinh; quản lý điều dưỡng',
  },
  {
    id: 'nha-khoa',
    group: 'Y dược - Sức khỏe',
    test: (n) => n.includes('nha khoa') || n.includes('rang ham mat'),
    text: 'Bác sĩ/nha sĩ; kỹ thuật viên nha khoa; quản lý phòng khám nha',
  },
  {
    id: 'ke-toan',
    group: 'Kinh tế - Kinh doanh',
    test: (n) => n.includes('ke toan'),
    text: 'Kế toán viên; kiểm toán viên; chuyên viên tài chính doanh nghiệp; thuế và kế toán quản trị',
  },
  {
    id: 'tai-chinh-ngan-hang',
    group: 'Kinh tế - Kinh doanh',
    test: (n) =>
      n.includes('tai chinh') ||
      n.includes('ngan hang') ||
      n.includes('bao hiem'),
    text: 'Chuyên viên phân tích tài chính; nhân viên tín dụng ngân hàng; quản lý rủi ro; môi giới chứng khoán',
  },
  {
    id: 'quan-tri-kinh-doanh',
    group: 'Kinh tế - Kinh doanh',
    test: (n) =>
      n.includes('quan tri kinh doanh') ||
      n.includes('kinh doanh') ||
      n.includes('thuong mai'),
    text: 'Chuyên viên kinh doanh; quản lý bán hàng; điều hành doanh nghiệp SME; khởi nghiệp',
  },
  {
    id: 'marketing',
    group: 'Kinh tế - Kinh doanh',
    test: (n) => n.includes('marketing') || n.includes('truyen thong'),
    text: 'Chuyên viên marketing; digital marketing; truyền thông thương hiệu; quản lý chiến dịch',
  },
  {
    id: 'kinh-te',
    group: 'Kinh tế - Kinh doanh',
    test: (n) => n.includes('kinh te') && !n.includes('cong nghe'),
    text: 'Nhà phân tích kinh tế; chuyên viên chính sách; nghiên cứu thị trường; tư vấn kinh tế vĩ mô–vi mô',
  },
  {
    id: 'logistics',
    group: 'Kinh tế - Kinh doanh',
    test: (n) => n.includes('logistics') || n.includes('van tai'),
    text: 'Chuyên viên logistics; quản lý chuỗi cung ứng; điều phối vận tải; kho bãi và phân phối',
  },
];

export type MajorRowInput = {
  name: string;
  fieldGroup?: string | null;
  career_orientation?: string | null;
};

export type EnrichResult = {
  career_orientation: string;
  source: 'existing' | 'inherit' | 'pattern' | 'field_group';
  ruleId?: string;
};

function isEnrichTargetGroup(group: string): group is EnrichFieldGroup {
  return (ENRICH_FIELD_GROUPS as readonly string[]).includes(group);
}

function matchPattern(norm: string, group: EnrichFieldGroup): PatternRule | null {
  for (const rule of MAJOR_CAREER_PATTERN_RULES) {
    if (rule.group && rule.group !== group) continue;
    if (rule.test(norm)) return rule;
  }
  return null;
}

function inheritFromFilled(
  name: string,
  filledMap: Map<string, string>,
): string | null {
  const norm = normalizeText(name);
  const base = normalizeText(stripProgramSuffix(name));

  if (filledMap.has(norm)) return filledMap.get(norm)!;
  if (filledMap.has(base)) return filledMap.get(base)!;

  let best: { key: string; value: string } | null = null;
  for (const [key, value] of filledMap) {
    if (norm.startsWith(key) || key.startsWith(norm) || base.startsWith(key)) {
      if (!best || key.length > best.key.length) {
        best = { key, value };
      }
    }
  }
  return best?.value ?? null;
}

/**
 * Gợi ý career_orientation cho một ngành (không ghi đè nếu đã có dữ liệu).
 */
export function resolveCareerOrientation(
  row: MajorRowInput,
  filledMap: Map<string, string>,
): EnrichResult | null {
  const existing = row.career_orientation?.trim();
  if (existing) {
    return { career_orientation: existing, source: 'existing' };
  }

  const group = canonicalFieldGroup(row.name, row.fieldGroup ?? null);
  if (!isEnrichTargetGroup(group)) return null;

  const inherited = inheritFromFilled(row.name, filledMap);
  if (inherited) {
    return { career_orientation: inherited, source: 'inherit' };
  }

  const norm = normalizeText(row.name);
  const pattern = matchPattern(norm, group);
  if (pattern) {
    return {
      career_orientation: pattern.text,
      source: 'pattern',
      ruleId: pattern.id,
    };
  }

  return {
    career_orientation: FIELD_GROUP_CAREER_DEFAULTS[group],
    source: 'field_group',
  };
}

export function buildFilledOrientationMap(
  rows: MajorRowInput[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    const co = row.career_orientation?.trim();
    if (!co) continue;
    map.set(normalizeText(row.name), co);
    map.set(normalizeText(stripProgramSuffix(row.name)), co);
  }
  return map;
}
