"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const dotenv = __importStar(require("dotenv"));
const chatbot_intent_rules_1 = require("../src/chatbot/chatbot-intent-rules");
const chat_session_context_1 = require("../src/chatbot/chat-session-context");
const chatbot_intent_pipeline_1 = require("../src/chatbot/chatbot-intent-pipeline");
const intent_corpus_1 = require("../src/chatbot/intent-corpus");
const intent_corpus_generated_1 = require("../src/chatbot/intent-corpus.generated");
const chatbot_types_1 = require("../src/chatbot/chatbot.types");
const ollama_service_1 = require("../src/ollama/ollama.service");
dotenv.config();
const INTENT_CONFIDENCE_THRESHOLD = 0.5;
const PROMPT_EXAMPLES = (0, intent_corpus_1.selectPromptExamples)();
const CLASSIFY_TIMEOUT_MS = Number(process.env.BENCHMARK_TIMEOUT_MS || '45000');
const INTENT_ALIASES = {
    ask_major: 'search_major',
    find_major: 'search_major',
    recommendation: 'recommendation_by_score',
    ask_university: 'search_university',
    cutoff: 'ask_cutoff_score',
    tuition: 'ask_tuition_fee',
    compare: 'compare_universities',
    compare_university: 'compare_universities',
    university_compare: 'compare_universities',
    tuition_comparison: 'compare_universities',
    career: 'ask_career',
    general_advice: 'help',
    location: 'ask_location',
    search_location: 'ask_location',
    ask_location: 'ask_location',
    admission_method: 'ask_admission_method',
    scholarship: 'ask_scholarship',
    facilities: 'ask_facilities',
};
async function classifyWithOllama(ollama, question, contextNote) {
    const session = (0, chat_session_context_1.parseCorpusContextNote)(contextNote);
    const context = contextNote ? `Session hint: ${contextNote}` : '';
    const result = await ollama.classifyIntent(question, chatbot_types_1.CHAT_INTENTS, {
        context,
        examples: PROMPT_EXAMPLES.intentExamples,
        intentAliases: INTENT_ALIASES,
        intentDescriptions: intent_corpus_1.INTENT_CLASSIFY_DESCRIPTIONS,
        timeoutMs: CLASSIFY_TIMEOUT_MS,
    });
    if (!result ||
        result.confidence < INTENT_CONFIDENCE_THRESHOLD ||
        result.intent === 'unknown') {
        return null;
    }
    const pipeline = (0, chatbot_intent_pipeline_1.resolveIntentPipeline)(question.toLowerCase().trim(), result.intent, result.confidence, session);
    return pipeline.intent;
}
function accuracy(correct, total) {
    return total === 0 ? 1 : correct / total;
}
async function main() {
    const ollama = new ollama_service_1.OllamaService(new config_1.ConfigService());
    if (!ollama.isEnabled()) {
        console.error('OLLAMA_ENABLED is false — set true in backend/.env');
        process.exit(1);
    }
    const ping = await ollama.ping();
    if (!ping) {
        console.error(`Ollama not reachable at ${ollama.getBaseUrl()} — start Ollama and ollama pull ${ollama.getModel()}`);
        process.exit(1);
    }
    const limit = Number(process.env.BENCHMARK_LIMIT || '0');
    const corpus = limit > 0 ? intent_corpus_generated_1.INTENT_EXAMPLES.slice(0, limit) : intent_corpus_generated_1.INTENT_EXAMPLES;
    const rows = [];
    console.log(`Benchmarking ${corpus.length}/${intent_corpus_generated_1.INTENT_EXAMPLES.length} corpus rows (model=${ollama.getModel()})…`);
    let idx = 0;
    for (const ex of corpus) {
        idx++;
        const session = ex.is_follow_up
            ? (0, chat_session_context_1.parseCorpusContextNote)(ex.context_note)
            : null;
        const rule = (0, chatbot_intent_rules_1.classifyIntentRuleOnly)(ex.q, session);
        const ollamaIntent = await classifyWithOllama(ollama, ex.q, ex.context_note);
        if (idx % 10 === 0 || idx === corpus.length) {
            console.log(`  … ${idx}/${corpus.length}`);
        }
        rows.push({
            q: ex.q,
            expected: ex.intent,
            rule,
            ollama: ollamaIntent,
        });
    }
    const ruleCorrect = rows.filter((r) => r.rule === r.expected).length;
    const ollamaAccepted = rows.filter((r) => r.ollama !== null);
    const ollamaCorrect = rows.filter((r) => r.ollama !== null && r.ollama === r.expected).length;
    const ollamaFallbackRuleCorrect = rows.filter((r) => (r.ollama ?? r.rule) === r.expected).length;
    const standaloneRows = rows.filter((_, i) => !corpus[i].is_follow_up);
    const followRows = rows.filter((_, i) => corpus[i].is_follow_up);
    const printBlock = (label, subset, getPred) => {
        const ok = subset.filter((r) => getPred(r) === r.expected).length;
        console.log(`  ${label}: ${((ok / subset.length) * 100).toFixed(1)}% (${ok}/${subset.length})`);
    };
    console.log('\n=== Intent benchmark (corpus) ===');
    console.log(`Rule-only: ${(accuracy(ruleCorrect, rows.length) * 100).toFixed(1)}% (${ruleCorrect}/${rows.length})`);
    console.log(`Ollama accepted: ${ollamaAccepted.length}/${rows.length} (${((ollamaAccepted.length / rows.length) * 100).toFixed(1)}%)`);
    console.log(`Ollama when accepted: ${(accuracy(ollamaCorrect, ollamaAccepted.length) * 100).toFixed(1)}% (${ollamaCorrect}/${ollamaAccepted.length})`);
    console.log(`Pipeline (Ollama else rule): ${(accuracy(ollamaFallbackRuleCorrect, rows.length) * 100).toFixed(1)}% (${ollamaFallbackRuleCorrect}/${rows.length})`);
    console.log('\nBy slice:');
    printBlock('Standalone — rule', standaloneRows, (r) => r.rule);
    printBlock('Standalone — ollama|rule', standaloneRows, (r) => r.ollama ?? r.rule);
    printBlock('Follow-up — rule', followRows, (r) => r.rule);
    printBlock('Follow-up — ollama|rule', followRows, (r) => r.ollama ?? r.rule);
    const ruleWins = rows.filter((r) => r.ollama !== null && r.ollama !== r.expected && r.rule === r.expected);
    const ollamaWins = rows.filter((r) => r.ollama === r.expected && r.rule !== r.expected);
    console.log(`\nRule better than Ollama: ${ruleWins.length} cases`);
    console.log(`Ollama better than rule: ${ollamaWins.length} cases`);
    const mismatches = rows
        .filter((r) => (r.ollama ?? r.rule) !== r.expected)
        .slice(0, 10);
    if (mismatches.length > 0) {
        console.log('\nSample pipeline mismatches:');
        for (const m of mismatches) {
            console.log(`  [${m.expected} → ${m.ollama ?? m.rule}${m.ollama ? ' (ollama)' : ' (rule)'}] ${m.q.slice(0, 72)}`);
        }
    }
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=benchmark-ollama-intent.js.map