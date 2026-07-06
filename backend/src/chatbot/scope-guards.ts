/**
 * Layer 0 pre-classification guards.
 *
 * These run BEFORE normal intent classification and handler logic.
 * If a guard matches, the chatbot returns a safe response immediately
 * without entering any intent handler (recommendation, cutoff, compare, etc.).
 *
 * Guards covered:
 * 1. scope_info — user asks if system covers outside Hanoi
 * 2. out_of_scope_location — user requests data for non-Hanoi city
 * 3. adversarial_or_invent — user asks bot to fabricate data
 * 4. foreign_university_factual — user asks cutoff/tuition for foreign school
 */
import { containsText } from './chatbot-intent-rules';
import { CHAT_SCOPE_HANOI } from './chatbot-copy';

// ─── Scope Info ────────────────────────────────────────────────────────────────

const SCOPE_QUESTION_PATTERNS: string[][] = [
  ['ngoai ha noi', 'ngoài hà nội'],
  ['ngoai hn', 'ngoài hn'],
  ['co ho tro', 'có hỗ trợ'],
  ['ho tro vung', 'hỗ trợ vùng'],
  ['ho tro mien', 'hỗ trợ miền'],
  ['pham vi', 'phạm vi'],
];

function isScopeInfoQuestion(msg: string): boolean {
  if (
    containsText(msg, ['ngoai ha noi', 'ngoài hà nội']) &&
    containsText(msg, [
      'ho tro',
      'hỗ trợ',
      'co khong',
      'có không',
      'duoc khong',
      'được không',
      'pham vi',
      'phạm vi',
      'co du lieu',
      'có dữ liệu',
      'co thong tin',
      'có thông tin',
    ])
  ) {
    return true;
  }
  if (
    containsText(msg, ['pham vi', 'phạm vi']) &&
    containsText(msg, [
      'he thong',
      'hệ thống',
      'du lieu',
      'dữ liệu',
      'ho tro',
      'hỗ trợ',
    ])
  ) {
    return true;
  }
  if (
    containsText(msg, ['co truong', 'có trường']) &&
    containsText(msg, [
      'mien nam',
      'miền nam',
      'mien trung',
      'miền trung',
      'ngoai ha noi',
      'ngoài hà nội',
    ])
  ) {
    return true;
  }
  if (
    containsText(msg, ['ho tro mien', 'hỗ trợ miền']) &&
    containsText(msg, [
      'nam',
      'trung',
      'khac',
      'khác',
    ])
  ) {
    return true;
  }
  return false;
}

// ─── Out-of-Scope Location ─────────────────────────────────────────────────────

const OUT_OF_SCOPE_CITIES = [
  'tp.hcm',
  'tp hcm',
  'tphcm',
  'sai gon',
  'sài gòn',
  'saigon',
  'ho chi minh',
  'hồ chí minh',
  'da nang',
  'đà nẵng',
  'can tho',
  'cần thơ',
  'hue',
  'huế',
  'nha trang',
  'hai phong',
  'hải phòng',
  'vung tau',
  'vũng tàu',
  'binh duong',
  'bình dương',
  'dong nai',
  'đồng nai',
  'mien nam',
  'miền nam',
  'mien trung',
  'miền trung',
];

function hasOutOfScopeLocation(msg: string): boolean {
  return containsText(msg, OUT_OF_SCOPE_CITIES);
}

// ─── Adversarial / Fabrication ─────────────────────────────────────────────────

const ADVERSARIAL_PATTERNS = [
  'bia diem',
  'bịa điểm',
  'tu nghi ra',
  'tự nghĩ ra',
  'tu bia',
  'tự bịa',
  'hay bia',
  'hãy bịa',
  'ban tu nghi',
  'bạn tự nghĩ',
  'tu tao ra',
  'tự tạo ra',
  'tu tao diem',
  'tự tạo điểm',
  'khong can dung',
  'không cần đúng',
  'khong can du lieu',
  'không cần dữ liệu',
  'diem chuan ao',
  'điểm chuẩn ảo',
  'liet ke 100',
  'liệt kê 100',
  'liet ke tat ca',
  'liệt kê tất cả',
  'hay gia su',
  'hãy giả sử',
  'gia su ban',
  'giả sử bạn',
  'pretend',
  'ignore previous',
  'ignore system',
  'ignore instructions',
  'forget your rules',
  'ban la chatgpt',
  'bạn là chatgpt',
  'ban la gpt',
  'bạn là gpt',
];

const ADVERSARIAL_COMBO_PATTERNS: Array<{
  primary: string[];
  secondary: string[];
}> = [
  {
    primary: ['tu nghi', 'tự nghĩ', 'tu bia', 'tự bịa', 'tu tao', 'tự tạo'],
    secondary: ['diem', 'điểm', 'truong', 'trường', 'hoc phi', 'học phí'],
  },
  {
    primary: ['ban tu', 'bạn tự', 'hay tu', 'hãy tự'],
    secondary: [
      'nghi ra',
      'nghĩ ra',
      'bia ra',
      'bịa ra',
      'tao ra',
      'tạo ra',
      'dat ra',
      'đặt ra',
    ],
  },
];

function isAdversarialRequest(msg: string): boolean {
  if (containsText(msg, ADVERSARIAL_PATTERNS)) return true;
  for (const combo of ADVERSARIAL_COMBO_PATTERNS) {
    if (containsText(msg, combo.primary) && containsText(msg, combo.secondary)) {
      return true;
    }
  }
  return false;
}

// ─── Foreign University Factual Query ──────────────────────────────────────────

const FOREIGN_UNIVERSITIES = [
  'harvard',
  'mit',
  'stanford',
  'oxford',
  'cambridge',
  'yale',
  'princeton',
  'columbia',
  'berkeley',
  'caltech',
];

const FACTUAL_QUERY_CUES = [
  'diem chuan',
  'điểm chuẩn',
  'hoc phi',
  'học phí',
  'tuyen sinh',
  'tuyển sinh',
  'xet tuyen',
  'xét tuyển',
  'dao tao',
  'đào tạo',
  'bao nhieu diem',
  'bao nhiêu điểm',
];

function isForeignUniversityFactualQuery(msg: string): boolean {
  if (!containsText(msg, FOREIGN_UNIVERSITIES)) return false;
  if (containsText(msg, FACTUAL_QUERY_CUES)) return true;
  if (containsText(msg, ['recommend', 'goi y', 'gợi ý', 'nen hoc', 'nên học'])) {
    return true;
  }
  return false;
}

// ─── Responses ─────────────────────────────────────────────────────────────────

const SCOPE_INFO_RESPONSE =
  `Hiện tại hệ thống chủ yếu hỗ trợ dữ liệu các trường đại học ở Hà Nội ` +
  `(điểm chuẩn 2023–2025, học phí, ngành đào tạo, phương thức xét tuyển). ` +
  `Mình chưa có dữ liệu trường ngoài khu vực Hà Nội. ` +
  `Bạn có thể hỏi về các trường ở Hà Nội nhé!`;

const OUT_OF_SCOPE_RESPONSE =
  `${CHAT_SCOPE_HANOI} Hiện tại mình chưa có dữ liệu trường/ngành ngoài khu vực Hà Nội. ` +
  `Bạn có thể hỏi về các trường đại học ở Hà Nội nhé!`;

const ADVERSARIAL_RESPONSE =
  `Mình không thể tự nghĩ ra hay bịa dữ liệu. Mình chỉ trả lời dựa trên dữ liệu hiện có ` +
  `trong hệ thống (điểm chuẩn, học phí, ngành đào tạo các trường ở Hà Nội). ` +
  `Bạn hỏi cụ thể về một trường hoặc ngành nhé!`;

const FOREIGN_UNIVERSITY_RESPONSE =
  `Trường này không nằm trong dữ liệu của mình. ${CHAT_SCOPE_HANOI} ` +
  `Bạn thử hỏi về trường khác ở Hà Nội, ví dụ: "Điểm chuẩn Bách Khoa CNTT 2024" ` +
  `hoặc "Học phí USTH".`;

// ─── Public API ────────────────────────────────────────────────────────────────

export type PreGuardResult = {
  answer: string;
  guardType:
    | 'scope_info'
    | 'out_of_scope_location'
    | 'adversarial'
    | 'foreign_university';
} | null;

/**
 * Run Layer 0 pre-classification guards.
 * Returns a safe response if a guard fires, or null to continue normal processing.
 */
export function runPreClassificationGuards(normalizedMsg: string): PreGuardResult {
  if (isScopeInfoQuestion(normalizedMsg)) {
    return { answer: SCOPE_INFO_RESPONSE, guardType: 'scope_info' };
  }

  if (isAdversarialRequest(normalizedMsg)) {
    return { answer: ADVERSARIAL_RESPONSE, guardType: 'adversarial' };
  }

  if (isForeignUniversityFactualQuery(normalizedMsg)) {
    return { answer: FOREIGN_UNIVERSITY_RESPONSE, guardType: 'foreign_university' };
  }

  if (hasOutOfScopeLocation(normalizedMsg)) {
    return { answer: OUT_OF_SCOPE_RESPONSE, guardType: 'out_of_scope_location' };
  }

  return null;
}

export {
  isScopeInfoQuestion,
  hasOutOfScopeLocation,
  isAdversarialRequest,
  isForeignUniversityFactualQuery,
  OUT_OF_SCOPE_CITIES,
  FOREIGN_UNIVERSITIES,
};
