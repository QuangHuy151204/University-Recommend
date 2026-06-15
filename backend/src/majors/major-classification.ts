import {
  KHAC_GROUP_ID,
  KHAC_GROUP_NAME,
  MAJOR_GROUP_BY_ID,
} from './major-groups-catalog';

export type MajorClassification = {
  group_ids: string[];
  group_names: string[];
  primary_group_id: string;
  primary_group_name: string;
  tags: string[];
};

type DisambiguationRule = {
  /** Chuỗi đã normalize — khớp prefix hoặc contains theo match */
  patterns: string[];
  match?: 'contains' | 'startsWith' | 'exact';
  exclusive: boolean;
  group_ids: string[];
  tags: string[];
};

type DomainRule = {
  group_id: string;
  patterns: string[];
  tags: string[];
};

/** Ưu tiên cao nhất — phân tách rõ IT security vs law enforcement/military. */
const DISAMBIGUATION_RULES: DisambiguationRule[] = [
  {
    patterns: [
      'nghiep vu canh sat',
      'nghom nganh nghiep vu canh sat',
      'nghiep vu an ninh',
      'nganh nghiep vu an ninh',
      'bien phong',
      'nganh bien phong',
      'canh sat',
      'quan su',
      'khong quan',
      'hai quan',
      'tham muu',
      'quoc phong va an ninh',
      'giao duc quoc phong',
      'quan tri an ninh phi truyen thong',
      'quan tri va an ninh',
    ],
    exclusive: true,
    group_ids: ['an-ninh-quoc-phong'],
    tags: [
      'police',
      'military',
      'law enforcement',
      'border guard',
      'national security',
      'cảnh sát',
      'quân sự',
      'biên phòng',
      'an ninh nhà nước',
    ],
  },
  {
    patterns: [
      'an ninh mang va phong chong toi pham cong nghe cao',
      'an ninh mang va phong chong toi pham',
    ],
    exclusive: true,
    group_ids: ['an-ninh-quoc-phong'],
    tags: [
      'cybercrime',
      'law enforcement',
      'digital forensics',
      'phòng chống tội phạm',
      'an ninh mạng công an',
    ],
  },
  {
    patterns: [
      'an toan thong tin',
      'an toan du lieu',
      'an toan khong gian so',
      'cyber security',
      'bao mat thong tin',
      'kiem thu bao mat',
      'an toan du lieu va an ninh mang',
    ],
    exclusive: true,
    group_ids: ['cong-nghe-thong-tin'],
    tags: [
      'cybersecurity',
      'security',
      'network security',
      'hacking',
      'data protection',
      'an toàn mạng',
      'bảo mật',
    ],
  },
  {
    patterns: ['an ninh mang'],
    match: 'exact',
    exclusive: true,
    group_ids: ['cong-nghe-thong-tin'],
    tags: ['cybersecurity', 'network security', 'an ninh mạng', 'IT security'],
  },
  {
    patterns: [
      'an toan thuc pham',
      'dam bao chat luong va an toan thuc pham',
      'chat luong va an toan thuc pham',
    ],
    exclusive: true,
    group_ids: ['ky-thuat-cong-nghiep'],
    tags: [
      'food safety',
      'quality assurance',
      'an toàn thực phẩm',
      'HACCP',
      'kiểm định thực phẩm',
    ],
  },
  {
    patterns: ['an toan giao thong', 'ky thuat an toan giao thong'],
    exclusive: true,
    group_ids: ['ky-thuat-cong-nghiep'],
    tags: [
      'traffic safety',
      'transport engineering',
      'an toàn giao thông',
      'giao thông',
    ],
  },
  {
    patterns: [
      've sinh lao dong',
      'bao ho lao dong',
      'an toan ve sinh lao dong',
      'an toan lao dong',
    ],
    exclusive: true,
    group_ids: ['y-duoc-suc-khoe'],
    tags: [
      'occupational health',
      'workplace safety',
      'vệ sinh lao động',
      'bảo hộ lao động',
      'sức khỏe nghề nghiệp',
    ],
  },
  {
    patterns: ['quan ly thong tin'],
    exclusive: true,
    group_ids: ['cong-nghe-thong-tin'],
    tags: ['information management', 'quản lý thông tin', 'data management'],
  },
  {
    patterns: ['quan ly thi truong', 'pohe'],
    exclusive: true,
    group_ids: ['kinh-te-kinh-doanh', 'marketing-truyen-thong'],
    tags: ['market management', 'quản lý thị trường', 'marketing'],
  },
  {
    patterns: ['quan ly benh vien'],
    exclusive: true,
    group_ids: ['y-duoc-suc-khoe'],
    tags: ['hospital management', 'quản lý bệnh viện', 'healthcare admin'],
  },
  {
    patterns: ['quan ly bien'],
    exclusive: true,
    group_ids: ['ky-thuat-cong-nghiep'],
    tags: ['marine management', 'quản lý biển', 'ocean'],
  },
  {
    patterns: [
      'bat dong san',
      'quan ly phat trien do thi va bat dong san',
      'quan ly phat trien do thi',
    ],
    exclusive: true,
    group_ids: ['kinh-te-kinh-doanh', 'quan-ly-hanh-chinh'],
    tags: ['real estate', 'bất động sản', 'đô thị', 'urban development'],
  },
  {
    patterns: [
      'quan ly tai nguyen rung',
      'quan ly tai nguyen khoang san',
      'quan ly tai nguyen nuoc',
      'quan ly tai nguyen thien nhien',
      'kiem lam',
    ],
    exclusive: true,
    group_ids: ['nong-nghiep', 'ky-thuat-cong-nghiep'],
    tags: [
      'natural resources',
      'quản lý tài nguyên',
      'lâm nghiệp',
      'môi trường',
    ],
  },
];

/** Quy tắc domain — khớp pattern rõ ràng, không dùng semantic similarity. */
const DOMAIN_RULES: DomainRule[] = [
  {
    group_id: 'khoa-hoc-vu-tru-hang-khong',
    patterns: [
      'khoa hoc vu tru',
      'hang khong vu tru',
      'cong nghe ve tinh',
      'khoa hoc va cong nghe ve tinh',
      've tinh',
    ],
    tags: ['aerospace', 'satellite', 'space science', 'vũ trụ', 'vệ tinh'],
  },
  {
    group_id: 'cong-nghe-thong-tin',
    patterns: [
      'cong nghe thong tin',
      'cntt',
      'khoa hoc may tinh',
      'tri tue nhan tao',
      'khoa hoc du lieu',
      'phan mem',
      'mang may tinh',
      'he thong thong tin',
      'cong nghe phan mem',
      'cong nghe so',
      'ky thuat phan mem',
      'ky thuat may tinh',
      'dien tu vien thong',
      'dien tu - vien thong',
      'lap trinh',
      'game',
      'do hoa game',
      'iot',
      'he thong nhung',
      'bao mat',
      'pentest',
      'forensic it',
    ],
    tags: [
      'programming',
      'software',
      'computer',
      'IT',
      'developer',
      'lập trình',
      'phần mềm',
      'máy tính',
      'cybersecurity',
      'security',
      'bảo mật',
    ],
  },
  {
    group_id: 'hoa-hoc-sinh-hoc',
    patterns: [
      'hoa hoc',
      'sinh hoc',
      'cong nghe sinh',
      'sinh hoc ung dung',
      'dien tu sinh hoc',
      'vat ly',
      'toan ung dung',
      'toan hoc',
      'toan tin',
      'khoa hoc tu nhien',
      'cong nghe nano',
    ],
    tags: ['chemistry', 'biology', 'physics', 'math', 'khoa học tự nhiên'],
  },
  {
    group_id: 'nong-nghiep',
    patterns: [
      'nong nghiep',
      'chan nuoi',
      'thuy san',
      'lam nghiep',
      'nong lam',
      'bao ve thuc vat',
      'khoa hoc cay trong',
      'thu y',
      'che bien lam san',
      'cong nghe go',
      'lam san',
    ],
    tags: ['agriculture', 'fishery', 'forestry', 'nông nghiệp', 'thủy sản'],
  },
  {
    group_id: 'kinh-te-kinh-doanh',
    patterns: [
      'kinh te',
      'quan tri kinh doanh',
      'quan tri doanh nghiep',
      'qt doanh nghiep',
      'qtkd',
      'tai chinh',
      'ngan hang',
      'ke toan',
      'kiem toan',
      'thuong mai',
      'kinh doanh',
      'logistics',
      'chuoi cung ung',
      'ngoai thuong',
      'quan tri nhan luc',
      'quan ly nhan su',
      'kinh te doi ngoai',
      'kinh te quoc te',
      'tai chinh ngan hang',
      'bao hiem',
      'dinh phi',
      'actuary',
      'quan tri rui ro',
      'tham dinh gia',
      'thue va quan tri thue',
      'khoi nghiep',
      'quan he lao dong',
      'quan tri chat luong',
      'quan tri dieu hanh',
      'doi moi va phat trien toan cau',
      'bgdi',
      'quan ly nang luong',
    ],
    tags: [
      'business',
      'finance',
      'accounting',
      'economics',
      'kinh doanh',
      'kế toán',
      'tài chính',
    ],
  },
  {
    group_id: 'marketing-truyen-thong',
    patterns: [
      'marketing',
      'truyen thong',
      'quan he cong chung',
      'bao chi',
      'noi dung so',
      'quang cao',
      'thuong hieu',
      'thong tin truyen thong',
      'da phuong tien',
      'xuat ban',
      'bien tap xuat ban',
    ],
    tags: ['marketing', 'media', 'journalism', 'PR', 'truyền thông', 'báo chí'],
  },
  {
    group_id: 'ngon-ngu-xa-hoi',
    patterns: [
      'ngon ngu',
      'dong phuong hoc',
      'viet nam hoc',
      'xa hoi',
      'tam ly',
      'tam li',
      'quoc te hoc',
      'quan he quoc te',
      'van hoa',
      'van hoc',
      'lich su',
      'luat',
      'luat hoc',
      'tieng anh',
      'tieng trung',
      'tieng nhat',
      'tieng han',
      'tieng phap',
      'xa hoi hoc',
      'nhan van',
      'nhan hoc',
      'bao tang',
      'luu tru',
      'van thu',
      'dia ly tu nhien',
      'dia chat',
      'dia tin hoc',
      'thong tin thu vien',
      'quan tri thu vien',
      'han nom',
      'triet hoc',
      'ton giao hoc',
      'dong nam a hoc',
      'han quoc hoc',
      'han quoc',
      'hoa ky hoc',
      'hoa ky',
      'nhat ban hoc',
      'nhat ban',
      'trung quoc hoc',
      'gioi va phat trien',
      'qhs',
    ],
    tags: ['language', 'law', 'psychology', 'sociology', 'ngôn ngữ', 'luật'],
  },
  {
    group_id: 'kien-truc-thiet-ke',
    patterns: [
      'kien truc',
      'thiet ke',
      'my thuat',
      'noi that',
      'do hoa',
      'thoi trang',
      'dieu khac',
      'da quy',
      'dien anh',
      'nghe thuat dai chung',
      'hoi hoa',
      'nhiep anh nghe thuat',
      'gom',
      'to chuc hoat dong nghe thuat',
    ],
    tags: [
      'architecture',
      'design',
      'art',
      'kiến trúc',
      'thiết kế',
      'mỹ thuật',
    ],
  },
  {
    group_id: 'ky-thuat-cong-nghiep',
    patterns: [
      'ky thuat',
      'co khi',
      'dien tu',
      'tu dong hoa',
      'xay dung',
      'cong trinh',
      'vat lieu',
      'o to',
      'hang khong',
      'moi truong',
      'khi tuong',
      'ky thuat xay dung',
      'ky thuat co dien',
      'ky thuat co khi',
      'quan ly xay dung',
      'cong nghe ky thuat',
      'cnkt',
      'co dien tu',
      'ban dan',
      'vi mach',
      'che tao may',
      'cau duong',
      'duong sat',
      'det may',
      'cong nghe may',
      'thuc pham',
      'che bien thuc pham',
      'dieu khien tu dong',
      'nang luong tai tao',
      'phong chay chua chay',
      'thuy van hoc',
      'khai thac van tai',
      'quy hoach',
      'hai duong hoc',
      'giao thong',
      'bien doi khi hau',
      'phat trien ben vung',
    ],
    tags: [
      'engineering',
      'mechanical',
      'civil',
      'kỹ thuật',
      'cơ khí',
      'xây dựng',
    ],
  },
  {
    group_id: 'y-duoc-suc-khoe',
    patterns: [
      'y khoa',
      'y da khoa',
      'bac si',
      'duoc',
      'dieu duong',
      'rang ham mat',
      'xet nghiem',
      'y te',
      'phuc hoi chuc nang',
      'suc khoe',
      'duoc hoc',
      'y hoc co truyen',
      'ky thuat y hoc',
      'hinh anh y hoc',
      'suc khoe cong dong',
      'dinh duong',
      'ho sinh',
      'khuc xa nhan khoa',
      'y hoc du phong',
      'lam sinh',
    ],
    tags: ['medicine', 'pharmacy', 'nursing', 'healthcare', 'y khoa', 'dược'],
  },
  {
    group_id: 'giao-duc-su-pham',
    patterns: [
      'su pham',
      'giao duc',
      'mam non',
      'tieu hoc',
      'sp cong nghe',
      'sp dia ly',
      'sp ngu van',
      'sp tieng phap',
      'sp tin hoc',
      'sp toan',
      'thanh nhac',
      'piano',
      'thu vien va thiet bi truong hoc',
      'thu vien',
    ],
    tags: ['education', 'teaching', 'sư phạm', 'giáo dục'],
  },
  {
    group_id: 'du-lich-dich-vu',
    patterns: [
      'du lich',
      'khach san',
      'nha hang',
      'lu hanh',
      'dich vu',
      'su kien',
    ],
    tags: ['tourism', 'hospitality', 'hotel', 'du lịch', 'khách sạn'],
  },
  {
    group_id: 'the-duc-the-thao',
    patterns: ['the duc', 'the thao', 'huong dan the duc', 'quan ly the thao'],
    tags: ['sports', 'fitness', 'thể thao', 'thể dục'],
  },
  {
    group_id: 'quan-ly-hanh-chinh',
    patterns: [
      'quan ly nha nuoc',
      'hanh chinh',
      'chinh tri',
      'quan ly cong',
      'quan li cong',
      'quan ly du an',
      'ouan ly du an',
      'ouan ly cong',
      'quan tri do thi',
      'quan ly dat dai',
      'nghien cuu phat trien',
      'quan tri tai nguyen',
      'quan tri van phong',
      'thu ky van phong',
      'thanh thieu nien',
      'cong tac thanh nien',
    ],
    tags: [
      'public administration',
      'government',
      'policy',
      'hành chính',
      'quản lý công',
    ],
  },
];

const LEGACY_FIELD_GROUP_MAP: Record<string, string> = {
  cntt: 'cong-nghe-thong-tin',
  'cong nghe thong tin': 'cong-nghe-thong-tin',
  'cong nghe': 'cong-nghe-thong-tin',
  'kinh te': 'kinh-te-kinh-doanh',
  'kinh te - kinh doanh': 'kinh-te-kinh-doanh',
  'ky thuat': 'ky-thuat-cong-nghiep',
  'ky thuat - cong nghiep': 'ky-thuat-cong-nghiep',
  'marketing - truyen thong': 'marketing-truyen-thong',
  'truyen thong': 'marketing-truyen-thong',
  'ngon ngu - xa hoi': 'ngon-ngu-xa-hoi',
  'ngon ngu': 'ngon-ngu-xa-hoi',
  'xa hoi': 'ngon-ngu-xa-hoi',
  'y duoc': 'y-duoc-suc-khoe',
  'y duoc - suc khoe': 'y-duoc-suc-khoe',
  'du lich - dich vu': 'du-lich-dich-vu',
  'dich vu': 'du-lich-dich-vu',
  'giao duc - su pham': 'giao-duc-su-pham',
  'kien truc - thiet ke': 'kien-truc-thiet-ke',
  'hoa hoc - sinh hoc': 'hoa-hoc-sinh-hoc',
  'quan ly - hanh chinh': 'quan-ly-hanh-chinh',
  'an toan thong tin': 'cong-nghe-thong-tin',
  'an ninh - quoc phong': 'an-ninh-quoc-phong',
  'khoa hoc vu tru - hang khong': 'khoa-hoc-vu-tru-hang-khong',
};

const STOPWORDS = new Set([
  'nganh',
  'chuyen',
  'chuong',
  'trinh',
  'chat',
  'luong',
  'cao',
  'tien',
  'tien',
  'mot',
  'so',
  'hoc',
  'phan',
  'bang',
  'tieng',
  'anh',
  'thi',
  'sinh',
  'nam',
  'nu',
  'vung',
  'mien',
  'bac',
  'nam',
  'truong',
  'dai',
  'hoc',
  'ct',
  'mas',
  'qhs',
]);

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

function patternMatches(
  normalizedSource: string,
  pattern: string,
  match: DisambiguationRule['match'] = 'contains',
): boolean {
  if (match === 'exact') return normalizedSource === pattern;
  if (match === 'startsWith') return normalizedSource.startsWith(pattern);
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (pattern.length <= 3) {
    return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, 'u').test(
      normalizedSource,
    );
  }
  return normalizedSource.includes(pattern);
}

function nameTokens(name: string): string[] {
  return normalizeText(name)
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function groupNameForId(groupId: string): string {
  if (groupId === KHAC_GROUP_ID) return KHAC_GROUP_NAME;
  return MAJOR_GROUP_BY_ID.get(groupId)?.group_name ?? KHAC_GROUP_NAME;
}

function dedupeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of tags) {
    const key = tag.toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(tag.trim());
  }
  return out.slice(0, 20);
}

export function classifyMajor(
  majorName: string,
  rawFieldGroup?: string | null,
): MajorClassification {
  const normalizedName = normalizeText(majorName);
  const orderedIds: string[] = [];
  const tags: string[] = [];

  const addGroup = (groupId: string): void => {
    if (!orderedIds.includes(groupId)) orderedIds.push(groupId);
  };

  for (const rule of DISAMBIGUATION_RULES) {
    const matched = rule.patterns.some((p) =>
      patternMatches(normalizedName, p, rule.match ?? 'contains'),
    );
    if (!matched) continue;
    for (const gid of rule.group_ids) addGroup(gid);
    tags.push(...rule.tags);
    if (rule.exclusive) {
      return finalizeClassification(orderedIds, tags, majorName);
    }
  }

  if (/^qhs\d*/.test(normalizedName.replace(/\s+/g, ''))) {
    addGroup('ngon-ngu-xa-hoi');
  }

  for (const rule of DOMAIN_RULES) {
    const matched = rule.patterns.some((p) =>
      patternMatches(normalizedName, p, 'contains'),
    );
    if (matched) {
      addGroup(rule.group_id);
      tags.push(...rule.tags);
    }
  }

  if (orderedIds.length === 0 && rawFieldGroup?.trim()) {
    const legacyKey = normalizeText(rawFieldGroup);
    const mapped = LEGACY_FIELD_GROUP_MAP[legacyKey];
    if (mapped) addGroup(mapped);
  }

  if (orderedIds.length === 0) {
    orderedIds.push(KHAC_GROUP_ID);
  }

  return finalizeClassification(orderedIds, tags, majorName);
}

function finalizeClassification(
  orderedIds: string[],
  ruleTags: string[],
  majorName: string,
): MajorClassification {
  const nameDerived = nameTokens(majorName).slice(0, 8);
  const allTags = dedupeTags([...ruleTags, ...nameDerived]);

  const primaryId = orderedIds[0] ?? KHAC_GROUP_ID;
  const groupNames = orderedIds.map(groupNameForId);

  return {
    group_ids: orderedIds,
    group_names: groupNames,
    primary_group_id: primaryId,
    primary_group_name: groupNameForId(primaryId),
    tags: allTags,
  };
}

export function majorBelongsToGroup(
  majorName: string,
  rawFieldGroup: string | null | undefined,
  groupIdOrSlug: string,
  storedGroupIds?: string[] | null,
): boolean {
  const normalizedSlug = groupIdOrSlug.toLowerCase().trim();
  if (storedGroupIds?.length) {
    return storedGroupIds.includes(normalizedSlug);
  }
  const classification = classifyMajor(majorName, rawFieldGroup);
  return classification.group_ids.includes(normalizedSlug);
}
