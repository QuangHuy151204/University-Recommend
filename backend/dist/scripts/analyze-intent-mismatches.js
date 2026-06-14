"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chatbot_intent_rules_1 = require("../src/chatbot/chatbot-intent-rules");
const chat_session_context_1 = require("../src/chatbot/chat-session-context");
const intent_corpus_generated_1 = require("../src/chatbot/intent-corpus.generated");
const mismatches = [];
for (const ex of intent_corpus_generated_1.INTENT_EXAMPLES) {
    const session = ex.is_follow_up
        ? (0, chat_session_context_1.parseCorpusContextNote)(ex.context_note)
        : null;
    const got = (0, chatbot_intent_rules_1.classifyIntentRuleOnly)(ex.q, session);
    if (got !== ex.intent) {
        mismatches.push({
            q: ex.q,
            expected: ex.intent,
            got,
            follow: ex.is_follow_up,
        });
    }
}
console.log('Total mismatches:', mismatches.length);
const byPair = {};
for (const m of mismatches) {
    const k = `${m.expected} -> ${m.got}`;
    byPair[k] = (byPair[k] ?? 0) + 1;
}
console.log('\nTop confusion pairs:');
for (const [k, v] of Object.entries(byPair)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)) {
    console.log(v, k);
}
console.log('\nAll mismatches:');
for (const m of mismatches) {
    console.log(`[${m.expected} -> ${m.got}${m.follow ? ' F' : ''}] ${m.q.slice(0, 90)}`);
}
//# sourceMappingURL=analyze-intent-mismatches.js.map