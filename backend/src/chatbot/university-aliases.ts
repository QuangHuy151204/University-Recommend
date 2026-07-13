// @file: Normalizes common university abbreviations and alternate spellings.
/** Mã VNU con — dài trước để "VNU-UET" không bị khớp nhầm "VNU". */
export const COMPOUND_UNIVERSITY_CODES = [
  'VNU-USSH',
  'VNU-ULIS',
  'VNU-UET',
  'VNU-UEB',
  'VNU-UED',
  'VNU-UMP',
  'VNU-HUS',
  'VNU-VJU',
  'VNU-UL',
] as const;

/** Mã trường đơn (không phải tiền tố VNU-). */
export const SIMPLE_UNIVERSITY_ACRONYMS = [
  'HUSTECH',
  'USTH',
  'HUST',
  'HNUE',
  'PTIT',
  'HAUI',
  'PHENA',
  'USSH',
  'ULIS',
  'BKHN',
  'NEU',
  'FTU',
  'FPT',
  'HMU',
  'TLU',
  'UET',
  'HUS',
  'UMP',
  'UED',
  'UEB',
  'VJU',
  'BKA',
  'VNU',
] as const;

/** Viết tắt lỏng → `short_name` trong DB. */
export const UNIVERSITY_SHORT_NAME_ALIASES: Record<string, string> = {
  UET: 'VNU-UET',
  HUS: 'VNU-HUS',
  USSH: 'VNU-USSH',
  UMP: 'VNU-UMP',
  UED: 'VNU-UED',
  UEB: 'VNU-UEB',
  ULIS: 'VNU-ULIS',
  VJU: 'VNU-VJU',
  UL: 'VNU-UL',
  BKA: 'HUST',
  BKHN: 'HUST',
  BK: 'HUST',
  PHENIKAA: 'PHENA',
};

export const MESSAGE_UNIVERSITY_NICKNAMES = [
  'Bách Khoa Hà Nội',
  'Bách Khoa',
  'Kinh tế Quốc dân',
  'Ngoại thương',
  'Học viện Bưu chính',
  'Học viện Ngân hàng',
  'Thương mại',
  'Thăng Long',
  'Phenikaa',
  'Ngân hàng',
  'Luật Hà Nội',
  'Y Hà Nội',
  'Y dược',
  'Đại học Công nghệ',
  'Dai hoc Cong nghe',
] as const;

function normalizeMatchText(input: string): string {
  return input
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Chuẩn hóa token trước khi tra `short_name` — tránh VNU-UET → VNU → HUS. */
export function normalizeUniversitySearchToken(token: string): string {
  const trimmed = token.trim();
  if (!trimmed) return trimmed;

  const upper = trimmed.toUpperCase();
  const compound = upper.match(/\bVNU-[A-Z]{2,5}\b/);
  if (compound) return compound[0];

  if (
    COMPOUND_UNIVERSITY_CODES.includes(
      upper as (typeof COMPOUND_UNIVERSITY_CODES)[number],
    )
  ) {
    return upper;
  }

  const alias = UNIVERSITY_SHORT_NAME_ALIASES[upper];
  if (alias) return alias;

  return trimmed;
}

/** Một mã / biệt danh trường nổi bật nhất trong câu (ưu tiên VNU-UET hơn VNU). */
export function extractPrimaryUniversityToken(msg: string): string | null {
  const upper = msg.toUpperCase();

  for (const code of COMPOUND_UNIVERSITY_CODES) {
    const re = new RegExp(
      `\\b${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      'i',
    );
    if (re.test(upper)) return code;
  }

  const compoundInline = upper.match(/\bVNU-[A-Z]{2,5}\b/);
  if (compoundInline) return compoundInline[0];

  let best: string | null = null;
  for (const code of SIMPLE_UNIVERSITY_ACRONYMS) {
    if (code === 'VNU') continue;
    const re = new RegExp(
      `\\b${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      'i',
    );
    if (re.test(upper) && (!best || code.length > best.length)) {
      best = code;
    }
  }
  if (best) return normalizeUniversitySearchToken(best);

  const normalized = normalizeMatchText(msg);
  const nickSorted = [...MESSAGE_UNIVERSITY_NICKNAMES].sort(
    (a, b) => b.length - a.length,
  );
  for (const nick of nickSorted) {
    if (normalized.includes(normalizeMatchText(nick))) return nick;
  }

  if (/\bVNU\b/i.test(upper)) return 'VNU';

  return null;
}

/** Mọi mã / biệt danh trường trong câu (không trùng, theo thứ tự xuất hiện). */
export function collectUniversityTokensFromMessage(msg: string): string[] {
  const found: string[] = [];
  const push = (name: string) => {
    const key = normalizeMatchText(name);
    if (!found.some((f) => normalizeMatchText(f) === key)) {
      found.push(name);
    }
  };

  const upper = msg.toUpperCase();
  for (const code of COMPOUND_UNIVERSITY_CODES) {
    const re = new RegExp(
      `\\b${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      'i',
    );
    if (re.test(upper)) push(code);
  }

  const inlineCompound = upper.match(/\bVNU-[A-Z]{2,5}\b/g);
  if (inlineCompound) {
    for (const code of inlineCompound) push(code);
  }

  for (const code of SIMPLE_UNIVERSITY_ACRONYMS) {
    if (code === 'VNU') continue;
    const re = new RegExp(
      `\\b${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      'i',
    );
    if (re.test(upper)) push(normalizeUniversitySearchToken(code));
  }

  const normalized = normalizeMatchText(msg);
  const nickSorted = [...MESSAGE_UNIVERSITY_NICKNAMES].sort(
    (a, b) => b.length - a.length,
  );
  for (const nick of nickSorted) {
    if (normalized.includes(normalizeMatchText(nick))) push(nick);
  }

  return found;
}
