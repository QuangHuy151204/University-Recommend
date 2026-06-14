import {
  extractExplicitUniversityFromMessage,
  extractParentheticalAcronym,
} from './chatbot-intent-rules';

function normalizeMatchText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const MESSAGE_UNIVERSITY_ACRONYMS = [
  'USTH',
  'HUST',
  'NEU',
  'FTU',
  'PTIT',
  'HAUI',
  'FPT',
  'HNUE',
  'VNU',
  'HMU',
  'HUSTECH',
  'UET',
] as const;

const MESSAGE_UNIVERSITY_NICKNAMES = [
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
] as const;

/** Tách danh sách trường từ entity `university_name` (vd. "USTH, HUST"). */
export function parseUniversityNameList(
  value: string | null | undefined,
): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/[,;]|(?:\s+và\s+)|(?:\s+với\s+)/i)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
}

/**
 * Trích mọi mã / biệt danh trường xuất hiện trong câu (thứ tự xuất hiện).
 * Dùng cho intent compare và handler so sánh đa trường.
 */
export function extractUniversitiesFromMessage(msg: string): string[] {
  const found: string[] = [];
  const push = (name: string) => {
    const key = normalizeMatchText(name);
    if (!found.some((f) => normalizeMatchText(f) === key)) {
      found.push(name);
    }
  };

  const paren = extractParentheticalAcronym(msg);
  if (paren) push(paren);

  const upper = msg.toUpperCase();
  for (const code of MESSAGE_UNIVERSITY_ACRONYMS) {
    const re = new RegExp(
      `\\b${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      'i',
    );
    if (re.test(upper)) push(code);
  }

  const normalized = normalizeMatchText(msg);
  const nickSorted = [...MESSAGE_UNIVERSITY_NICKNAMES].sort(
    (a, b) => b.length - a.length,
  );
  for (const nick of nickSorted) {
    if (normalized.includes(normalizeMatchText(nick))) push(nick);
  }

  const explicit = extractExplicitUniversityFromMessage(msg);
  if (explicit) push(explicit);

  return found;
}

/** Gộp trường từ câu + entity (không trùng). */
export function collectUniversityNames(
  msg: string,
  universityNameEntity: string | null | undefined,
): string[] {
  const names: string[] = [];
  const push = (name: string) => {
    const key = normalizeMatchText(name);
    if (!names.some((n) => normalizeMatchText(n) === key)) names.push(name);
  };

  for (const n of extractUniversitiesFromMessage(msg)) push(n);
  for (const n of parseUniversityNameList(universityNameEntity)) push(n);

  return names;
}
