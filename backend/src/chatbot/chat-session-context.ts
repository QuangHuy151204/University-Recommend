import {
  extractExplicitUniversityFromMessage,
  extractYearFromMessage,
} from './chatbot-intent-rules';
import type { ChatEntities, ChatIntent } from './chatbot.types';
import { extractMajorFragment, resolveMajorSearchTerm } from './major-search';

/** Trạng thái phiên — kế thừa entity/intent giữa các turn follow-up. */
export interface ChatSessionContext {
  last_intent: ChatIntent | null;
  last_university: string | null;
  last_major: string | null;
  last_score: number | null;
  last_subject_group: string | null;
  last_method_code: string | null;
  last_location: string | null;
  last_year: number | null;
  /** Short names từ lượt so sánh gần nhất — dùng follow-up học phí. */
  last_compared_universities: string[] | null;
}

function normalizeUniKey(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function emptySessionContext(): ChatSessionContext {
  return {
    last_intent: null,
    last_university: null,
    last_major: null,
    last_score: null,
    last_subject_group: null,
    last_method_code: null,
    last_location: null,
    last_year: null,
    last_compared_universities: null,
  };
}

export function parseSessionContext(
  raw: Record<string, unknown> | null | undefined,
): ChatSessionContext {
  const base = emptySessionContext();
  if (!raw || typeof raw !== 'object') return base;

  const intent = raw.last_intent;
  if (typeof intent === 'string') {
    base.last_intent = intent as ChatIntent;
  }

  const str = (key: keyof ChatSessionContext): string | null => {
    const v = raw[key];
    return typeof v === 'string' && v.trim() ? v.trim() : null;
  };

  base.last_university = str('last_university');
  base.last_major = str('last_major');
  base.last_subject_group = str('last_subject_group');
  base.last_method_code = str('last_method_code');
  base.last_location = str('last_location');

  const score = raw.last_score;
  if (
    typeof score === 'number' &&
    Number.isFinite(score) &&
    score >= 0 &&
    score <= 30
  ) {
    base.last_score = score;
  }

  const year = raw.last_year;
  if (
    typeof year === 'number' &&
    Number.isInteger(year) &&
    year >= 2020 &&
    year <= 2030
  ) {
    base.last_year = year;
  }

  const compared = raw.last_compared_universities;
  if (Array.isArray(compared)) {
    const names = compared
      .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
      .map((v) => v.trim())
      .slice(0, 4);
    base.last_compared_universities = names.length > 0 ? names : null;
  }

  return base;
}

/**
 * Lấp entity null từ session carry-over.
 * Khi `msg` có tên trường/ngành mới (vd. "ngành hàng không của USTH") → ghi đè session,
 * tránh lặp dữ liệu turn trước (HUST + AI).
 */
export function mergeEntitiesWithSession(
  entities: ChatEntities,
  session: ChatSessionContext,
  msg?: string,
): ChatEntities {
  const merged: ChatEntities = {
    score: entities.score ?? session.last_score,
    subject_group: entities.subject_group ?? session.last_subject_group,
    major: entities.major ?? session.last_major,
    location: entities.location ?? session.last_location,
    university_name: entities.university_name ?? session.last_university,
    year: entities.year ?? session.last_year,
    method_code: entities.method_code ?? session.last_method_code,
  };

  if (!msg?.trim()) return merged;

  const explicitUni = extractExplicitUniversityFromMessage(msg);
  const explicitYear = extractYearFromMessage(msg);
  if (explicitUni) {
    const switched =
      session.last_university &&
      normalizeUniKey(explicitUni) !== normalizeUniKey(session.last_university);
    merged.university_name = explicitUni;
    if (switched && explicitYear === null) {
      merged.year = null;
    }
  }

  const explicitMajor =
    resolveMajorSearchTerm(msg) ?? extractMajorFragment(msg);
  if (explicitMajor) {
    const switchedMajor =
      session.last_major &&
      normalizeUniKey(explicitMajor) !== normalizeUniKey(session.last_major);
    merged.major = explicitMajor;
    if (switchedMajor && explicitYear === null && !explicitUni) {
      merged.year = null;
    }
  }

  if (explicitYear !== null) {
    merged.year = explicitYear;
  }

  return merged;
}

/** Gợi ý structured cho Ollama classify/extract (tương đương context_note trong intent.txt). */
export function buildSessionContextHint(session: ChatSessionContext): string {
  const parts: string[] = [];
  if (session.last_university) {
    parts.push(`Turn trước người dùng đang hỏi về ${session.last_university}.`);
  }
  if (session.last_major) {
    parts.push(`Ngành đang thảo luận: ${session.last_major}.`);
  }
  if (session.last_score != null) {
    parts.push(`Điểm đã nêu trước đó: ${session.last_score}.`);
  }
  if (session.last_subject_group) {
    parts.push(`Tổ hợp đã nêu: ${session.last_subject_group}.`);
  }
  if (session.last_method_code) {
    parts.push(`Phương thức xét tuyển đã nêu: ${session.last_method_code}.`);
  }
  if (session.last_year != null) {
    parts.push(`Năm tuyển sinh đang thảo luận: ${session.last_year}.`);
  }
  if (session.last_compared_universities?.length) {
    parts.push(
      `Các trường vừa so sánh: ${session.last_compared_universities.join(', ')}.`,
    );
  }
  if (parts.length === 0) return '';
  return `Ngữ cảnh phiên (carry-over):\n${parts.join('\n')}`;
}

/** Cập nhật session sau mỗi turn — chỉ ghi field có giá trị mới. */
export function updateSessionContext(
  prev: ChatSessionContext,
  intent: ChatIntent,
  entities: ChatEntities,
  comparedUniversities?: string[] | null,
): ChatSessionContext {
  const next: ChatSessionContext = { ...prev, last_intent: intent };

  if (entities.university_name) next.last_university = entities.university_name;
  if (entities.major) next.last_major = entities.major;
  if (entities.score != null) next.last_score = entities.score;
  if (entities.subject_group) next.last_subject_group = entities.subject_group;
  if (entities.method_code) next.last_method_code = entities.method_code;
  if (entities.location) next.last_location = entities.location;
  if (entities.year != null) next.last_year = entities.year;

  if (intent === 'compare_universities' && comparedUniversities?.length) {
    next.last_compared_universities = comparedUniversities.slice(0, 4);
  }

  return next;
}

export function sessionContextToRecord(
  ctx: ChatSessionContext,
): Record<string, unknown> {
  return { ...ctx };
}

/** Chuyển context_note trong intent.txt → session carry-over cho regression / tests. */
export function parseCorpusContextNote(
  note: string | null | undefined,
): ChatSessionContext {
  const base = emptySessionContext();
  if (!note?.trim()) return base;

  const lower = note.toLowerCase();

  const intentRules: Array<[string[], ChatIntent]> = [
    [['điểm chuẩn', 'diem chuan'], 'ask_cutoff_score'],
    [
      [
        'học bổng',
        'hoc bong',
        'miễn giảm',
        'mien giam',
        'điều kiện học bổng',
        'dieu kien hoc bong',
      ],
      'ask_scholarship',
    ],
    [['so sánh', 'so sanh', 'so sanh neu va ftu'], 'compare_universities'],
    [['học phí', 'hoc phi'], 'ask_tuition_fee'],
    [
      [
        'phương thức',
        'phuong thuc',
        'xét tuyển',
        'xet tuyen',
        'học bạ',
        'hoc ba',
      ],
      'ask_admission_method',
    ],
    [['việc làm', 'viec lam'], 'ask_career'],
    [
      ['gợi ý', 'goi y', 'khả năng', 'kha nang', 'điểm', 'diem', 'an toàn hơn'],
      'recommendation_by_score',
    ],
    [
      [
        'ngành',
        'nganh',
        'đào tạo',
        'dao tao',
        'trường đào tạo',
        'truong dao tao',
      ],
      'search_major',
    ],
    [
      [
        'danh sách trường',
        'trường công lập',
        'trường ở',
        'trường tư',
        'khu vực',
      ],
      'ask_location',
    ],
    [
      ['chương trình', 'chuong trinh', 'thông tin', 'thong tin', 'ngành của'],
      'search_university',
    ],
  ];

  for (const [keywords, intent] of intentRules) {
    if (keywords.some((kw) => lower.includes(kw))) {
      base.last_intent = intent;
      break;
    }
  }

  const scoreMatch = note.match(/(\d+(?:[.,]\d+)?)\s*điểm/i);
  if (scoreMatch) {
    base.last_score = parseFloat(scoreMatch[1].replace(',', '.'));
  }

  const subjMatch =
    note.match(/\b([ABCD]\d{2})\b/i) ?? note.match(/khối\s+([ABCD]\d{2})/i);
  if (subjMatch) {
    base.last_subject_group = subjMatch[1].toUpperCase();
  }

  const majorMatch = note.match(
    /ngành\s+([^,.]+?)(?:\s+năm|\s+tại|\s+ở|\.|$)/i,
  );
  if (majorMatch) {
    base.last_major = majorMatch[1].trim();
  }

  const uniPatterns = [
    /(?:về|tại|hỏi|xem|chọn)\s+(Đại học[^.]+)/i,
    /(?:về|tại|hỏi)\s+(Học viện[^.]+)/i,
    /(?:về|tại)\s+(NEU|FTU|USTH|HUST|PTIT|HAUI|FPT[^.]*)/i,
    /(Bách Khoa|Thăng Long|Phenikaa|Thương mại|Ngân hàng|Y Hà Nội|Luật Hà Nội)/i,
  ];
  for (const pattern of uniPatterns) {
    const match = note.match(pattern);
    if (match) {
      base.last_university = match[1].trim();
      break;
    }
  }

  if (lower.includes('hà nội') || lower.includes('ha noi')) {
    base.last_location = 'Hà Nội';
  }

  const yearMatch = note.match(/năm\s+(20\d{2})/i);
  if (yearMatch) {
    base.last_year = parseInt(yearMatch[1], 10);
  }

  const compareMatch = note.match(
    /so s[aá]nh\s+(.+?)\s+v(?:à|oi)\s+(.+?)(?:\s+về|\s+ve|\s+ngành|\s+nganh|\.|$)/i,
  );
  if (compareMatch) {
    const names = [compareMatch[1].trim(), compareMatch[2].trim()].filter(
      Boolean,
    );
    if (names.length >= 2) {
      base.last_compared_universities = names;
      base.last_intent = 'compare_universities';
    }
  }

  return base;
}
