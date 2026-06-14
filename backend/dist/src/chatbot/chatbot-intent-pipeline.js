"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTENT_CONFIDENCE_THRESHOLD = void 0;
exports.resolveIntentPipeline = resolveIntentPipeline;
const chatbot_intent_rules_1 = require("./chatbot-intent-rules");
const chatbot_guardrails_1 = require("./chatbot-guardrails");
const chat_session_context_1 = require("./chat-session-context");
exports.INTENT_CONFIDENCE_THRESHOLD = 0.5;
function resolveIntentPipeline(msg, ollamaIntent, ollamaConfidence, sessionContext = (0, chat_session_context_1.emptySessionContext)()) {
    const ruleIntent = (0, chatbot_intent_rules_1.classifyIntentRuleOnly)(msg, sessionContext);
    const ollamaAccepted = ollamaIntent !== null &&
        ollamaIntent !== 'unknown' &&
        (ollamaConfidence ?? 0) >= exports.INTENT_CONFIDENCE_THRESHOLD;
    if (!ollamaAccepted || ollamaIntent === null) {
        return {
            intent: ruleIntent,
            source: 'rule',
            ruleIntent,
            ollamaIntent,
            ollamaAccepted: false,
            confidence: ollamaConfidence ?? undefined,
        };
    }
    let intent = (0, chatbot_intent_rules_1.correctRuleIntent)(ollamaIntent, msg);
    intent = (0, chatbot_intent_rules_1.resolveFollowUpIntent)(intent, msg, sessionContext);
    if ((0, chatbot_guardrails_1.shouldPreferRuleOverOllamaIntent)(ruleIntent, intent, msg)) {
        intent = (0, chatbot_intent_rules_1.resolveFollowUpIntent)((0, chatbot_intent_rules_1.correctRuleIntent)(ruleIntent, msg), msg, sessionContext);
        return {
            intent,
            source: 'rule',
            ruleIntent,
            ollamaIntent,
            ollamaAccepted: true,
            confidence: ollamaConfidence ?? undefined,
        };
    }
    return {
        intent,
        source: 'ollama',
        ruleIntent,
        ollamaIntent,
        ollamaAccepted: true,
        confidence: ollamaConfidence ?? undefined,
    };
}
//# sourceMappingURL=chatbot-intent-pipeline.js.map