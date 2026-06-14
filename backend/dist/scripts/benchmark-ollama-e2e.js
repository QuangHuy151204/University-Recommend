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
const chatbot_e2e_cases_1 = require("../src/chatbot/chatbot-e2e-cases");
const chatbot_follow_up_e2e_cases_1 = require("../src/chatbot/chatbot-follow-up-e2e-cases");
const chat_session_context_1 = require("../src/chatbot/chat-session-context");
const chatbot_intent_pipeline_1 = require("../src/chatbot/chatbot-intent-pipeline");
const intent_corpus_1 = require("../src/chatbot/intent-corpus");
const chatbot_types_1 = require("../src/chatbot/chatbot.types");
const ollama_service_1 = require("../src/ollama/ollama.service");
dotenv.config();
const PROMPT_EXAMPLES = {
    intentExamples: (0, intent_corpus_1.selectPromptExamples)().intentExamples.slice(0, 8),
};
const CLASSIFY_TIMEOUT_MS = Number(process.env.BENCHMARK_TIMEOUT_MS || '45000');
const MIN_PIPELINE_ACCURACY = Number(process.env.E2E_MIN_ACCURACY || '0.85');
const INTENT_ALIASES = {
    ask_major: 'search_major',
    find_major: 'search_major',
    recommendation: 'recommendation_by_score',
    ask_university: 'search_university',
    cutoff: 'ask_cutoff_score',
    tuition: 'ask_tuition_fee',
    compare: 'compare_universities',
    career: 'ask_career',
    general_advice: 'help',
    location: 'ask_location',
    search_location: 'ask_location',
    admission_method: 'ask_admission_method',
    scholarship: 'ask_scholarship',
    facilities: 'ask_facilities',
};
const INTENT_DESCRIPTIONS = {
    recommendation_by_score: 'User states THEIR exam score and wants school/major suggestions.',
    ask_cutoff_score: 'Official admission cutoff scores lookup.',
    search_university: 'Info about a specific university or its programs.',
    search_major: 'Major/field in general — which schools teach it.',
    ask_tuition_fee: 'Tuition fees.',
    ask_location: 'Universities in a region (dataset is Hanoi-only).',
    compare_universities: 'Compare two or more schools/majors.',
    ask_career: 'Jobs/career after graduation.',
    ask_admission_method: 'Admission methods and how to apply.',
    ask_scholarship: 'Scholarships and financial aid.',
    ask_facilities: 'Dormitory, campus, labs, library.',
    greeting: 'Hello / hi only.',
    help: 'What the bot can do.',
    unknown: 'Out of scope or does not fit.',
};
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
    const rows = [];
    console.log(`E2E intent benchmark: ${chatbot_e2e_cases_1.CHATBOT_E2E_CASES.length} cases (model=${ollama.getModel()}, threshold=${chatbot_intent_pipeline_1.INTENT_CONFIDENCE_THRESHOLD})…`);
    let idx = 0;
    for (const ex of chatbot_e2e_cases_1.CHATBOT_E2E_CASES) {
        idx++;
        const result = await ollama.classifyIntent(ex.q, chatbot_types_1.CHAT_INTENTS, {
            examples: PROMPT_EXAMPLES.intentExamples,
            intentAliases: INTENT_ALIASES,
            intentDescriptions: INTENT_DESCRIPTIONS,
            timeoutMs: CLASSIFY_TIMEOUT_MS,
        });
        const pipeline = (0, chatbot_intent_pipeline_1.resolveIntentPipeline)(ex.q, result?.intent ?? null, result?.confidence ?? null);
        const guardrailSaved = pipeline.source === 'rule' &&
            result !== null &&
            result.intent !== ex.intent &&
            pipeline.intent === ex.intent;
        rows.push({
            id: ex.id,
            q: ex.q,
            expected: ex.intent,
            pipeline: pipeline.intent,
            source: pipeline.source,
            ollamaRaw: result?.intent ?? null,
            ruleIntent: pipeline.ruleIntent,
            guardrailSaved,
        });
        const mark = pipeline.intent === ex.intent ? '✓' : '✗';
        console.log(`  ${mark} [${idx}/${chatbot_e2e_cases_1.CHATBOT_E2E_CASES.length}] ${ex.id} → ${pipeline.intent} (${pipeline.source})`);
    }
    const correct = rows.filter((r) => r.pipeline === r.expected).length;
    const accuracy = correct / rows.length;
    const guardrailSaves = rows.filter((r) => r.guardrailSaved).length;
    const ollamaWrongRuleFixed = rows.filter((r) => r.ollamaRaw !== null &&
        r.ollamaRaw !== r.expected &&
        r.pipeline === r.expected &&
        r.ruleIntent === r.expected).length;
    console.log('\n=== E2E intent (fixed cases + guardrails) ===');
    console.log(`Pipeline accuracy: ${(accuracy * 100).toFixed(1)}% (${correct}/${rows.length})`);
    console.log(`Guardrail overrides that fixed intent: ${guardrailSaves}`);
    console.log(`Rule-only would have saved: ${ollamaWrongRuleFixed}`);
    const failures = rows.filter((r) => r.pipeline !== r.expected);
    if (failures.length > 0) {
        console.log('\nFailures:');
        for (const f of failures) {
            console.log(`  [${f.id}] expected=${f.expected} got=${f.pipeline} (ollama=${f.ollamaRaw ?? '—'}, rule=${f.ruleIntent}, src=${f.source})`);
            console.log(`    Q: ${f.q}`);
        }
    }
    if (accuracy < MIN_PIPELINE_ACCURACY) {
        console.error(`\nBelow minimum ${(MIN_PIPELINE_ACCURACY * 100).toFixed(0)}% — tune guardrails or corpus.`);
        process.exit(1);
    }
    const followRows = [];
    console.log(`\nFollow-up session-switch: ${chatbot_follow_up_e2e_cases_1.CHATBOT_FOLLOW_UP_E2E_CASES.length} cases…`);
    let fIdx = 0;
    for (const ex of chatbot_follow_up_e2e_cases_1.CHATBOT_FOLLOW_UP_E2E_CASES) {
        fIdx++;
        const session = (0, chat_session_context_1.parseCorpusContextNote)(ex.context_note);
        const result = await ollama.classifyIntent(ex.q, chatbot_types_1.CHAT_INTENTS, {
            examples: PROMPT_EXAMPLES.intentExamples,
            intentAliases: INTENT_ALIASES,
            intentDescriptions: INTENT_DESCRIPTIONS,
            context: [
                session.last_university
                    ? `Turn trước: ${session.last_university}`
                    : '',
                session.last_major ? `Ngành: ${session.last_major}` : '',
            ]
                .filter(Boolean)
                .join('\n'),
            timeoutMs: CLASSIFY_TIMEOUT_MS,
        });
        const pipeline = (0, chatbot_intent_pipeline_1.resolveIntentPipeline)(ex.q, result?.intent ?? null, result?.confidence ?? null, session);
        followRows.push({
            id: ex.id,
            q: ex.q,
            expected: ex.intent,
            pipeline: pipeline.intent,
            source: pipeline.source,
            ollamaRaw: result?.intent ?? null,
            ruleIntent: pipeline.ruleIntent,
            guardrailSaved: pipeline.source === 'rule' &&
                result !== null &&
                result.intent !== ex.intent &&
                pipeline.intent === ex.intent,
            sessionNote: ex.context_note.slice(0, 60),
        });
        const mark = pipeline.intent === ex.intent ? '✓' : '✗';
        console.log(`  ${mark} [${fIdx}/${chatbot_follow_up_e2e_cases_1.CHATBOT_FOLLOW_UP_E2E_CASES.length}] ${ex.id} → ${pipeline.intent} (${pipeline.source})`);
    }
    const followCorrect = followRows.filter((r) => r.pipeline === r.expected).length;
    const followAccuracy = followCorrect / followRows.length;
    console.log('\n=== Follow-up session-switch (guardrails + session) ===');
    console.log(`Pipeline accuracy: ${(followAccuracy * 100).toFixed(1)}% (${followCorrect}/${followRows.length})`);
    const followFailures = followRows.filter((r) => r.pipeline !== r.expected);
    if (followFailures.length > 0) {
        console.log('\nFollow-up failures:');
        for (const f of followFailures) {
            console.log(`  [${f.id}] expected=${f.expected} got=${f.pipeline} (ollama=${f.ollamaRaw ?? '—'}, rule=${f.ruleIntent})`);
            console.log(`    Q: ${f.q}`);
            console.log(`    Session: ${f.sessionNote}…`);
        }
    }
    const minFollow = Number(process.env.E2E_FOLLOW_MIN_ACCURACY || '0.8');
    if (followAccuracy < minFollow) {
        console.error(`\nFollow-up below minimum ${(minFollow * 100).toFixed(0)}%.`);
        process.exit(1);
    }
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=benchmark-ollama-e2e.js.map