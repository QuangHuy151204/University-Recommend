"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUARDRAIL_INTENT_ALIASES = void 0;
exports.shouldPreferRuleOverOllamaIntent = shouldPreferRuleOverOllamaIntent;
exports.isLikelyFalseUniversityName = isLikelyFalseUniversityName;
exports.sanitizeExtractedEntities = sanitizeExtractedEntities;
exports.validateEntitiesAgainstDb = validateEntitiesAgainstDb;
exports.isCutoffMissingAnswer = isCutoffMissingAnswer;
const major_interest_match_1 = require("../majors/major-interest-match");
const chatbot_intent_rules_1 = require("./chatbot-intent-rules");
function looksLikeTuitionFeeQuery(msg) {
    return ((0, chatbot_intent_rules_1.looksLikeTuitionBillingQuery)(msg) ||
        (0, chatbot_intent_rules_1.containsText)(msg, [
            'hoc phi',
            'học phí',
            'tien hoc',
            'tiền học',
            'chi phi hoc',
            'chi phí học',
        ]));
}
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
exports.GUARDRAIL_INTENT_ALIASES = {
    search_location: 'ask_location',
    find_location: 'ask_location',
    location_search: 'ask_location',
    ask_location_list: 'ask_location',
};
const RULE_DECISIVE_SIGNALS = [
    { intent: 'greeting', test: chatbot_intent_rules_1.looksLikeGreeting },
    { intent: 'ask_cutoff_score', test: chatbot_intent_rules_1.looksLikeCutoffScoreQuery },
    { intent: 'recommendation_by_score', test: chatbot_intent_rules_1.looksLikeScoreRecommendation },
    { intent: 'search_university', test: chatbot_intent_rules_1.asksUniversityOrPrograms },
    { intent: 'ask_tuition_fee', test: looksLikeTuitionFeeQuery },
    { intent: 'compare_universities', test: chatbot_intent_rules_1.looksLikeCompareUniversities },
    { intent: 'ask_admission_method', test: chatbot_intent_rules_1.looksLikeAdmissionMethod },
    { intent: 'ask_facilities', test: chatbot_intent_rules_1.looksLikeFacilitiesQuery },
    { intent: 'ask_location', test: chatbot_intent_rules_1.looksLikeLocationListQuery },
    { intent: 'search_major', test: chatbot_intent_rules_1.asksWhichSchoolsTeachMajor },
    { intent: 'ask_scholarship', test: chatbot_intent_rules_1.looksLikeScholarshipQuery },
    { intent: 'unknown', test: chatbot_intent_rules_1.looksLikeUnknownFullScholarshipQuery },
];
function shouldPreferRuleOverOllamaIntent(ruleIntent, ollamaIntent, msg) {
    if (ruleIntent === ollamaIntent)
        return false;
    const lower = msg.toLowerCase().trim();
    for (const { intent, test } of RULE_DECISIVE_SIGNALS) {
        if (ruleIntent === intent && test(lower))
            return true;
    }
    return false;
}
function isLikelyFalseUniversityName(name, msg) {
    const upper = name.trim().toUpperCase();
    if (!upper)
        return true;
    if (SUBJECT_WORD_TOKENS.has(upper))
        return true;
    if (upper.length <= 3 && SUBJECT_WORD_TOKENS.has(upper))
        return true;
    if (/\b[abcd]\d{2}\b/i.test(msg) && SUBJECT_WORD_TOKENS.has(upper)) {
        return true;
    }
    const lowerMsg = msg.toLowerCase();
    if (upper.length <= 4 &&
        (lowerMsg.includes('khối') ||
            lowerMsg.includes('khoi') ||
            lowerMsg.includes('tổ hợp') ||
            lowerMsg.includes('to hop'))) {
        return SUBJECT_WORD_TOKENS.has(upper);
    }
    return false;
}
function sanitizeExtractedEntities(entities, msg) {
    let university_name = entities.university_name;
    if (university_name && isLikelyFalseUniversityName(university_name, msg)) {
        university_name = null;
    }
    return { ...entities, university_name };
}
async function validateEntitiesAgainstDb(entities, msg, db) {
    const sanitized = sanitizeExtractedEntities(entities, msg);
    let { university_name, major } = sanitized;
    if (university_name) {
        const ok = await db.universityExists(university_name);
        if (!ok && university_name.length < 6) {
            university_name = null;
        }
    }
    if (major) {
        const normMajor = (0, major_interest_match_1.normalizeMajorMatchText)(major);
        const tokens = normMajor.split(/\s+/).filter((t) => t.length >= 2);
        const ambiguousSingle = tokens.length === 1 && SUBJECT_WORD_TOKENS.has(tokens[0].toUpperCase());
        if (ambiguousSingle) {
            major = null;
        }
        else {
            const ok = await db.majorExists(major);
            if (!ok && major.length < 5) {
                major = null;
            }
        }
    }
    return { ...sanitized, university_name, major };
}
function isCutoffMissingAnswer(answer) {
    if (!answer?.trim())
        return false;
    return (answer.includes('Mình chưa có điểm chuẩn') ||
        answer.includes('chưa có điểm chuẩn'));
}
//# sourceMappingURL=chatbot-guardrails.js.map