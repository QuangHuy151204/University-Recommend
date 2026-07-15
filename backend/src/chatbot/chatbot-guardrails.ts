// @file: Anti-hallucination checks: prefer rules over bad LLM intents and validate entities.
import type { ChatIntent } from './chatbot.types';
import type { ChatEntities } from './chatbot.types';
import { normalizeMajorMatchText } from '../majors/major-interest-match';
import {
  asksUniversityOrPrograms,
  containsText,
  looksLikeAdmissionMethod,
  looksLikeCompareUniversities,
  looksLikeCutoffScoreQuery,
  looksLikeFacilitiesQuery,
  looksLikeGreeting,
  looksLikeLocationListQuery,
  looksLikeOffTopicOrSecurityQuery,
  looksLikeScholarshipQuery,
  looksLikeScoreRecommendation,
  looksLikeSubjectiveTuitionQuery,
  looksLikeTuitionBillingQuery,
  looksLikeUniversityAliasQuestion,
  looksLikeUniversityInfoQuery,
  looksLikeCareerQuery,
  looksLikeUnknownFullScholarshipQuery,
  asksWhichSchoolsTeachMajor,
} from './chatbot-intent-rules';

function looksLikeTuitionFeeQuery(msg: string): boolean {
  return (
    looksLikeTuitionBillingQuery(msg) ||
    containsText(msg, [
      'hoc phi',
      'học phí',
      'tien hoc',
      'tiền học',
      'chi phi hoc',
      'chi phí học',
    ])
  );
}

/** Từ môn học hay bị Ollama nhầm thành university_name (vd. "Anh" trong khối A01). */
export const SUBJECT_WORD_TOKENS = new Set([
  'ANH',
  'LY',
  'HOA',
  'TOAN',
  'VAN',
  'SU',
  'DIA',
  'SINH',
  'GDCD',
  'MON',
]);

/** Intent LLM hay trả sai tên → enum hợp lệ (bổ sung cho chatbot.service). */
export const GUARDRAIL_INTENT_ALIASES: Record<string, ChatIntent> = {
  search_location: 'ask_location',
  find_location: 'ask_location',
  location_search: 'ask_location',
  ask_location_list: 'ask_location',
};

type RuleSignal = {
  intent: ChatIntent;
  test: (msg: string) => boolean;
};

/** Rule có tín hiệu rõ → ưu tiên hơn Ollama khi hai bên mâu thuẫn. */
const RULE_DECISIVE_SIGNALS: RuleSignal[] = [
  { intent: 'greeting', test: looksLikeGreeting },
  { intent: 'unknown', test: looksLikeOffTopicOrSecurityQuery },
  { intent: 'ask_cutoff_score', test: looksLikeCutoffScoreQuery },
  { intent: 'recommendation_by_score', test: looksLikeScoreRecommendation },
  {
    intent: 'recommendation_by_score',
    test: looksLikeSubjectiveTuitionQuery,
  },
  { intent: 'search_university', test: asksUniversityOrPrograms },
  { intent: 'search_university', test: looksLikeUniversityAliasQuestion },
  { intent: 'search_university', test: looksLikeUniversityInfoQuery },
  { intent: 'ask_career', test: looksLikeCareerQuery },
  { intent: 'ask_tuition_fee', test: looksLikeTuitionFeeQuery },
  { intent: 'compare_universities', test: looksLikeCompareUniversities },
  { intent: 'ask_admission_method', test: looksLikeAdmissionMethod },
  { intent: 'ask_facilities', test: looksLikeFacilitiesQuery },
  { intent: 'ask_location', test: looksLikeLocationListQuery },
  { intent: 'search_major', test: asksWhichSchoolsTeachMajor },
  { intent: 'ask_scholarship', test: looksLikeScholarshipQuery },
  { intent: 'unknown', test: looksLikeUnknownFullScholarshipQuery },
];

/**
 * Khi rule và Ollama khác intent, rule thắng nếu có tín hiệu từ khóa rõ ràng
 * (vd. "điểm chuẩn" → ask_cutoff_score, không để LLM ghi đè thành recommendation).
 */
export function shouldPreferRuleOverOllamaIntent(
  ruleIntent: ChatIntent,
  ollamaIntent: ChatIntent,
  msg: string,
): boolean {
  if (ruleIntent === ollamaIntent) return false;

  const lower = msg.toLowerCase().trim();
  for (const { intent, test } of RULE_DECISIVE_SIGNALS) {
    if (ruleIntent === intent && test(lower)) return true;
  }
  return false;
}

/** university_name quá ngắn hoặc là tên môn → bỏ trước khi query DB. */
export function isLikelyFalseUniversityName(
  name: string,
  msg: string,
): boolean {
  const upper = name.trim().toUpperCase();
  if (!upper) return true;
  if (SUBJECT_WORD_TOKENS.has(upper)) return true;
  if (upper.length <= 3 && SUBJECT_WORD_TOKENS.has(upper)) return true;
  if (/\b[abcd]\d{2}\b/i.test(msg) && SUBJECT_WORD_TOKENS.has(upper)) {
    return true;
  }
  const lowerMsg = msg.toLowerCase();
  if (
    upper.length <= 4 &&
    (lowerMsg.includes('khối') ||
      lowerMsg.includes('khoi') ||
      lowerMsg.includes('tổ hợp') ||
      lowerMsg.includes('to hop'))
  ) {
    return SUBJECT_WORD_TOKENS.has(upper);
  }
  return false;
}

/** Làm sạch entity sync — caller có thể validate thêm với DB. */
export function sanitizeExtractedEntities(
  entities: ChatEntities,
  msg: string,
): ChatEntities {
  let university_name = entities.university_name;
  if (university_name && isLikelyFalseUniversityName(university_name, msg)) {
    university_name = null;
  }

  return { ...entities, university_name };
}

export interface EntityDbValidator {
  universityExists(name: string): Promise<boolean>;
  majorExists(term: string): Promise<boolean>;
}

/** Xác thực entity với PostgreSQL — bỏ giá trị không khớp bản ghi. */
export async function validateEntitiesAgainstDb(
  entities: ChatEntities,
  msg: string,
  db: EntityDbValidator,
): Promise<ChatEntities> {
  const sanitized = sanitizeExtractedEntities(entities, msg);
  let { university_name, major } = sanitized;

  if (university_name) {
    const ok = await db.universityExists(university_name);
    // Bỏ tên không resolve được (kể cả chuỗi dài) — tránh override session bằng rác Ollama.
    if (!ok) {
      university_name = null;
    }
  }

  if (major) {
    const normMajor = normalizeMajorMatchText(major);
    const tokens = normMajor.split(/\s+/).filter((t) => t.length >= 2);
    const ambiguousSingle =
      tokens.length === 1 && SUBJECT_WORD_TOKENS.has(tokens[0].toUpperCase());
    if (ambiguousSingle) {
      major = null;
    } else {
      const ok = await db.majorExists(major);
      if (!ok && major.length < 5) {
        major = null;
      }
    }
  }

  return { ...sanitized, university_name, major };
}

/**
 * Out-of-scope city/location names that MUST NOT appear in Ollama rewrites.
 */
const REWRITE_BANNED_LOCATIONS = [
  'TP.HCM',
  'TP HCM',
  'TPHCM',
  'Sài Gòn',
  'Saigon',
  'Sai Gon',
  'Hồ Chí Minh',
  'Ho Chi Minh',
  'Đà Nẵng',
  'Da Nang',
  'Cần Thơ',
  'Can Tho',
  'Huế',
  'Hải Phòng',
  'Hai Phong',
];

const REWRITE_BANNED_FOREIGN_UNIS = [
  'Harvard',
  'MIT',
  'Stanford',
  'Oxford',
  'Cambridge',
  'Yale',
  'Princeton',
  'Columbia',
  'Berkeley',
  'Caltech',
];

/**
 * Kiểm tra bản rewrite Ollama có giữ số liệu/tên quan trọng từ câu trả lời DB.
 * Trả false → caller nên fallback rule-based để tránh hallucination.
 */
export function isOllamaRewriteFaithful(
  ruleAnswer: string,
  llmAnswer: string,
): boolean {
  if (!llmAnswer?.trim()) return false;
  const rule = ruleAnswer.trim();
  const llm = llmAnswer.trim();
  if (!rule) return true;

  // ── Refuse rewrite if rule answer is a refusal/scope/no-data message ──
  if (isRefusalOrScopeMessage(rule)) {
    if (!containsRefusalSignal(llm)) return false;
  }

  // ── Reject if rewrite adds banned locations not in the rule answer ──
  for (const loc of REWRITE_BANNED_LOCATIONS) {
    if (
      llm.toLowerCase().includes(loc.toLowerCase()) &&
      !rule.toLowerCase().includes(loc.toLowerCase())
    ) {
      return false;
    }
  }

  // ── Reject if rewrite adds foreign university names not in the rule answer ──
  for (const uni of REWRITE_BANNED_FOREIGN_UNIS) {
    if (
      llm.toLowerCase().includes(uni.toLowerCase()) &&
      !rule.toLowerCase().includes(uni.toLowerCase())
    ) {
      return false;
    }
  }

  // ── Check significant numbers are preserved ──
  const significantNumbers = [
    ...new Set(
      (rule.match(/\d+(?:[.,]\d+)?/g) ?? []).filter((n) => {
        const v = parseFloat(n.replace(',', '.'));
        return (
          Number.isFinite(v) && (v >= 10 || n.includes('.') || n.includes(','))
        );
      }),
    ),
  ];
  for (const n of significantNumbers) {
    const alt = n.includes(',') ? n.replace(',', '.') : n;
    if (!llm.includes(n) && !llm.includes(alt)) {
      return false;
    }
  }

  // ── Check university acronyms are preserved ──
  const uniTokens = rule.match(/\b[A-Z]{2,10}\b/g) ?? [];
  for (const token of [...new Set(uniTokens)]) {
    if (token.length >= 3 && rule.includes(token) && !llm.includes(token)) {
      return false;
    }
  }

  // ── Check "no data" messages are preserved ──
  if (
    (rule.includes('Mình chưa có') || rule.includes('chưa có điểm chuẩn')) &&
    !llm.includes('chưa có')
  ) {
    return false;
  }

  // ── Check bullet point lists are not truncated ──
  const ruleBullets = (rule.match(/^[•\d][^\n]+/gm) ?? []).length;
  const llmBullets = (llm.match(/^[•\d][^\n]+/gm) ?? []).length;
  if (ruleBullets >= 3 && llmBullets < Math.ceil(ruleBullets * 0.6)) {
    return false;
  }

  // ── Reject if rewrite adds score numbers not in rule answer ──
  const llmNumbers = new Set(
    (llm.match(/\d+(?:[.,]\d+)?/g) ?? [])
      .map((n) => parseFloat(n.replace(',', '.')))
      .filter((v) => Number.isFinite(v) && v >= 10 && v <= 30),
  );
  const ruleNumbers = new Set(
    (rule.match(/\d+(?:[.,]\d+)?/g) ?? [])
      .map((n) => parseFloat(n.replace(',', '.')))
      .filter((v) => Number.isFinite(v) && v >= 10 && v <= 30),
  );
  for (const n of llmNumbers) {
    if (!ruleNumbers.has(n)) return false;
  }

  return true;
}

function isRefusalOrScopeMessage(answer: string): boolean {
  const lower = answer.toLowerCase();
  return (
    lower.includes('không thể tự nghĩ') ||
    lower.includes('không thể bịa') ||
    lower.includes('chưa có dữ liệu') ||
    lower.includes('ngoài khu vực hà nội') ||
    lower.includes('không nằm trong dữ liệu') ||
    lower.includes('chủ yếu hỗ trợ') ||
    lower.includes('hiện tại hệ thống') ||
    lower.includes('chưa hỗ trợ')
  );
}

function containsRefusalSignal(answer: string): boolean {
  const lower = answer.toLowerCase();
  return (
    lower.includes('không thể') ||
    lower.includes('chưa có') ||
    lower.includes('không có dữ liệu') ||
    lower.includes('hà nội') ||
    lower.includes('không hỗ trợ')
  );
}

/** Câu trả lời "chưa có điểm chuẩn" — không rewrite để tránh LLM bịa số. */
export function isCutoffMissingAnswer(answer: string): boolean {
  if (!answer?.trim()) return false;
  return (
    answer.includes('Mình chưa có điểm chuẩn') ||
    answer.includes('chưa có điểm chuẩn')
  );
}
