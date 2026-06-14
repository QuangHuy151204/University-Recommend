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
  looksLikeScholarshipQuery,
  looksLikeScoreRecommendation,
  looksLikeTuitionBillingQuery,
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
const SUBJECT_WORD_TOKENS = new Set([
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
  { intent: 'ask_cutoff_score', test: looksLikeCutoffScoreQuery },
  { intent: 'recommendation_by_score', test: looksLikeScoreRecommendation },
  { intent: 'search_university', test: asksUniversityOrPrograms },
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
    if (!ok && university_name.length < 6) {
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

/** Câu trả lời "chưa có điểm chuẩn" — không rewrite để tránh LLM bịa số. */
export function isCutoffMissingAnswer(answer: string): boolean {
  if (!answer?.trim()) return false;
  return (
    answer.includes('Mình chưa có điểm chuẩn') ||
    answer.includes('chưa có điểm chuẩn')
  );
}
