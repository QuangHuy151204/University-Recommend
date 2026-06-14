/**
 * E2E intent benchmark: 18 câu cố định + pipeline guardrail (như ChatbotService).
 * Run: npm run benchmark:ollama-e2e
 * Requires Ollama running + OLLAMA_ENABLED=true in backend/.env
 */
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { CHATBOT_E2E_CASES } from '../src/chatbot/chatbot-e2e-cases';
import { CHATBOT_FOLLOW_UP_E2E_CASES } from '../src/chatbot/chatbot-follow-up-e2e-cases';
import { parseCorpusContextNote } from '../src/chatbot/chat-session-context';
import {
  INTENT_CONFIDENCE_THRESHOLD,
  resolveIntentPipeline,
} from '../src/chatbot/chatbot-intent-pipeline';
import { selectPromptExamples } from '../src/chatbot/intent-corpus';
import { CHAT_INTENTS, type ChatIntent } from '../src/chatbot/chatbot.types';
import { OllamaService } from '../src/ollama/ollama.service';

dotenv.config();

const PROMPT_EXAMPLES = {
  intentExamples: selectPromptExamples().intentExamples.slice(0, 8),
};
const CLASSIFY_TIMEOUT_MS = Number(process.env.BENCHMARK_TIMEOUT_MS || '45000');
const MIN_PIPELINE_ACCURACY = Number(process.env.E2E_MIN_ACCURACY || '0.85');

const INTENT_ALIASES: Record<string, ChatIntent> = {
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

const INTENT_DESCRIPTIONS: Record<ChatIntent, string> = {
  recommendation_by_score:
    'User states THEIR exam score and wants school/major suggestions.',
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

async function main(): Promise<void> {
  const ollama = new OllamaService(new ConfigService());
  if (!ollama.isEnabled()) {
    console.error('OLLAMA_ENABLED is false — set true in backend/.env');
    process.exit(1);
  }
  const ping = await ollama.ping();
  if (!ping) {
    console.error(
      `Ollama not reachable at ${ollama.getBaseUrl()} — start Ollama and ollama pull ${ollama.getModel()}`,
    );
    process.exit(1);
  }

  type Row = {
    id: string;
    q: string;
    expected: ChatIntent;
    pipeline: ChatIntent;
    source: 'ollama' | 'rule';
    ollamaRaw: ChatIntent | null;
    ruleIntent: ChatIntent;
    guardrailSaved: boolean;
  };

  const rows: Row[] = [];
  console.log(
    `E2E intent benchmark: ${CHATBOT_E2E_CASES.length} cases (model=${ollama.getModel()}, threshold=${INTENT_CONFIDENCE_THRESHOLD})…`,
  );

  let idx = 0;
  for (const ex of CHATBOT_E2E_CASES) {
    idx++;
    const result = await ollama.classifyIntent(ex.q, CHAT_INTENTS, {
      examples: PROMPT_EXAMPLES.intentExamples,
      intentAliases: INTENT_ALIASES,
      intentDescriptions: INTENT_DESCRIPTIONS,
      timeoutMs: CLASSIFY_TIMEOUT_MS,
    });

    const pipeline = resolveIntentPipeline(
      ex.q,
      result?.intent ?? null,
      result?.confidence ?? null,
    );

    const guardrailSaved =
      pipeline.source === 'rule' &&
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
    console.log(
      `  ${mark} [${idx}/${CHATBOT_E2E_CASES.length}] ${ex.id} → ${pipeline.intent} (${pipeline.source})`,
    );
  }

  const correct = rows.filter((r) => r.pipeline === r.expected).length;
  const accuracy = correct / rows.length;
  const guardrailSaves = rows.filter((r) => r.guardrailSaved).length;
  const ollamaWrongRuleFixed = rows.filter(
    (r) =>
      r.ollamaRaw !== null &&
      r.ollamaRaw !== r.expected &&
      r.pipeline === r.expected &&
      r.ruleIntent === r.expected,
  ).length;

  console.log('\n=== E2E intent (fixed cases + guardrails) ===');
  console.log(
    `Pipeline accuracy: ${(accuracy * 100).toFixed(1)}% (${correct}/${rows.length})`,
  );
  console.log(`Guardrail overrides that fixed intent: ${guardrailSaves}`);
  console.log(`Rule-only would have saved: ${ollamaWrongRuleFixed}`);

  const failures = rows.filter((r) => r.pipeline !== r.expected);
  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const f of failures) {
      console.log(
        `  [${f.id}] expected=${f.expected} got=${f.pipeline} (ollama=${f.ollamaRaw ?? '—'}, rule=${f.ruleIntent}, src=${f.source})`,
      );
      console.log(`    Q: ${f.q}`);
    }
  }

  if (accuracy < MIN_PIPELINE_ACCURACY) {
    console.error(
      `\nBelow minimum ${(MIN_PIPELINE_ACCURACY * 100).toFixed(0)}% — tune guardrails or corpus.`,
    );
    process.exit(1);
  }

  type FollowRow = Row & { sessionNote: string };
  const followRows: FollowRow[] = [];
  console.log(
    `\nFollow-up session-switch: ${CHATBOT_FOLLOW_UP_E2E_CASES.length} cases…`,
  );

  let fIdx = 0;
  for (const ex of CHATBOT_FOLLOW_UP_E2E_CASES) {
    fIdx++;
    const session = parseCorpusContextNote(ex.context_note);
    const result = await ollama.classifyIntent(ex.q, CHAT_INTENTS, {
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

    const pipeline = resolveIntentPipeline(
      ex.q,
      result?.intent ?? null,
      result?.confidence ?? null,
      session,
    );

    followRows.push({
      id: ex.id,
      q: ex.q,
      expected: ex.intent,
      pipeline: pipeline.intent,
      source: pipeline.source,
      ollamaRaw: result?.intent ?? null,
      ruleIntent: pipeline.ruleIntent,
      guardrailSaved:
        pipeline.source === 'rule' &&
        result !== null &&
        result.intent !== ex.intent &&
        pipeline.intent === ex.intent,
      sessionNote: ex.context_note.slice(0, 60),
    });

    const mark = pipeline.intent === ex.intent ? '✓' : '✗';
    console.log(
      `  ${mark} [${fIdx}/${CHATBOT_FOLLOW_UP_E2E_CASES.length}] ${ex.id} → ${pipeline.intent} (${pipeline.source})`,
    );
  }

  const followCorrect = followRows.filter(
    (r) => r.pipeline === r.expected,
  ).length;
  const followAccuracy = followCorrect / followRows.length;
  console.log('\n=== Follow-up session-switch (guardrails + session) ===');
  console.log(
    `Pipeline accuracy: ${(followAccuracy * 100).toFixed(1)}% (${followCorrect}/${followRows.length})`,
  );

  const followFailures = followRows.filter((r) => r.pipeline !== r.expected);
  if (followFailures.length > 0) {
    console.log('\nFollow-up failures:');
    for (const f of followFailures) {
      console.log(
        `  [${f.id}] expected=${f.expected} got=${f.pipeline} (ollama=${f.ollamaRaw ?? '—'}, rule=${f.ruleIntent})`,
      );
      console.log(`    Q: ${f.q}`);
      console.log(`    Session: ${f.sessionNote}…`);
    }
  }

  const minFollow = Number(process.env.E2E_FOLLOW_MIN_ACCURACY || '0.8');
  if (followAccuracy < minFollow) {
    console.error(
      `\nFollow-up below minimum ${(minFollow * 100).toFixed(0)}%.`,
    );
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
