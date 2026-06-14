/**
 * Benchmark Ollama intent classify vs rule-only on intent.txt corpus.
 * Run: npm run benchmark:ollama-intent
 * Requires Ollama running + OLLAMA_ENABLED=true in .env
 */
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { classifyIntentRuleOnly } from '../src/chatbot/chatbot-intent-rules';
import { parseCorpusContextNote } from '../src/chatbot/chat-session-context';
import { resolveIntentPipeline } from '../src/chatbot/chatbot-intent-pipeline';
import {
  INTENT_CLASSIFY_DESCRIPTIONS,
  selectPromptExamples,
} from '../src/chatbot/intent-corpus';
import { INTENT_EXAMPLES } from '../src/chatbot/intent-corpus.generated';
import { CHAT_INTENTS, type ChatIntent } from '../src/chatbot/chatbot.types';
import { OllamaService } from '../src/ollama/ollama.service';

dotenv.config();

const INTENT_CONFIDENCE_THRESHOLD = 0.5;
/** Full prompt subset (edge cases + per-intent examples) — khớp production. */
const PROMPT_EXAMPLES = selectPromptExamples();
const CLASSIFY_TIMEOUT_MS = Number(process.env.BENCHMARK_TIMEOUT_MS || '45000');

const INTENT_ALIASES: Record<string, ChatIntent> = {
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

async function classifyWithOllama(
  ollama: OllamaService,
  question: string,
  contextNote: string | null,
): Promise<ChatIntent | null> {
  const session = parseCorpusContextNote(contextNote);
  const context = contextNote ? `Session hint: ${contextNote}` : '';
  const result = await ollama.classifyIntent(question, CHAT_INTENTS, {
    context,
    examples: PROMPT_EXAMPLES.intentExamples,
    intentAliases: INTENT_ALIASES,
    intentDescriptions: INTENT_CLASSIFY_DESCRIPTIONS,
    timeoutMs: CLASSIFY_TIMEOUT_MS,
  });
  if (
    !result ||
    result.confidence < INTENT_CONFIDENCE_THRESHOLD ||
    result.intent === 'unknown'
  ) {
    return null;
  }
  const pipeline = resolveIntentPipeline(
    question.toLowerCase().trim(),
    result.intent,
    result.confidence,
    session,
  );
  return pipeline.intent;
}

function accuracy(correct: number, total: number): number {
  return total === 0 ? 1 : correct / total;
}

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

  const limit = Number(process.env.BENCHMARK_LIMIT || '0');
  const corpus =
    limit > 0 ? INTENT_EXAMPLES.slice(0, limit) : INTENT_EXAMPLES;

  type Row = { q: string; expected: ChatIntent; rule: ChatIntent; ollama: ChatIntent | null };
  const rows: Row[] = [];

  console.log(
    `Benchmarking ${corpus.length}/${INTENT_EXAMPLES.length} corpus rows (model=${ollama.getModel()})…`,
  );

  let idx = 0;
  for (const ex of corpus) {
    idx++;
    const session = ex.is_follow_up
      ? parseCorpusContextNote(ex.context_note)
      : null;
    const rule = classifyIntentRuleOnly(ex.q, session);
    const ollamaIntent = await classifyWithOllama(
      ollama,
      ex.q,
      ex.context_note,
    );
    if (idx % 10 === 0 || idx === corpus.length) {
      console.log(`  … ${idx}/${corpus.length}`);
    }
    rows.push({
      q: ex.q,
      expected: ex.intent as ChatIntent,
      rule,
      ollama: ollamaIntent,
    });
  }

  const ruleCorrect = rows.filter((r) => r.rule === r.expected).length;
  const ollamaAccepted = rows.filter((r) => r.ollama !== null);
  const ollamaCorrect = rows.filter(
    (r) => r.ollama !== null && r.ollama === r.expected,
  ).length;
  const ollamaFallbackRuleCorrect = rows.filter(
    (r) => (r.ollama ?? r.rule) === r.expected,
  ).length;

  const standaloneRows = rows.filter((_, i) => !corpus[i].is_follow_up);
  const followRows = rows.filter((_, i) => corpus[i].is_follow_up);

  const printBlock = (
    label: string,
    subset: Row[],
    getPred: (r: Row) => ChatIntent,
  ) => {
    const ok = subset.filter((r) => getPred(r) === r.expected).length;
    console.log(
      `  ${label}: ${((ok / subset.length) * 100).toFixed(1)}% (${ok}/${subset.length})`,
    );
  };

  console.log('\n=== Intent benchmark (corpus) ===');
  console.log(
    `Rule-only: ${(accuracy(ruleCorrect, rows.length) * 100).toFixed(1)}% (${ruleCorrect}/${rows.length})`,
  );
  console.log(
    `Ollama accepted: ${ollamaAccepted.length}/${rows.length} (${((ollamaAccepted.length / rows.length) * 100).toFixed(1)}%)`,
  );
  console.log(
    `Ollama when accepted: ${(accuracy(ollamaCorrect, ollamaAccepted.length) * 100).toFixed(1)}% (${ollamaCorrect}/${ollamaAccepted.length})`,
  );
  console.log(
    `Pipeline (Ollama else rule): ${(accuracy(ollamaFallbackRuleCorrect, rows.length) * 100).toFixed(1)}% (${ollamaFallbackRuleCorrect}/${rows.length})`,
  );

  console.log('\nBy slice:');
  printBlock('Standalone — rule', standaloneRows, (r) => r.rule);
  printBlock('Standalone — ollama|rule', standaloneRows, (r) => r.ollama ?? r.rule);
  printBlock('Follow-up — rule', followRows, (r) => r.rule);
  printBlock('Follow-up — ollama|rule', followRows, (r) => r.ollama ?? r.rule);

  const ruleWins = rows.filter(
    (r) => r.ollama !== null && r.ollama !== r.expected && r.rule === r.expected,
  );
  const ollamaWins = rows.filter(
    (r) => r.ollama === r.expected && r.rule !== r.expected,
  );
  console.log(`\nRule better than Ollama: ${ruleWins.length} cases`);
  console.log(`Ollama better than rule: ${ollamaWins.length} cases`);

  const mismatches = rows
    .filter((r) => (r.ollama ?? r.rule) !== r.expected)
    .slice(0, 10);
  if (mismatches.length > 0) {
    console.log('\nSample pipeline mismatches:');
    for (const m of mismatches) {
      console.log(
        `  [${m.expected} → ${m.ollama ?? m.rule}${m.ollama ? ' (ollama)' : ' (rule)'}] ${m.q.slice(0, 72)}`,
      );
    }
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
