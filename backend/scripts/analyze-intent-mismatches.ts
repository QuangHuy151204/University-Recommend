import { classifyIntentRuleOnly } from '../src/chatbot/chatbot-intent-rules';
import { parseCorpusContextNote } from '../src/chatbot/chat-session-context';
import { INTENT_EXAMPLES } from '../src/chatbot/intent-corpus.generated';

const mismatches: Array<{
  q: string;
  expected: string;
  got: string;
  follow: boolean;
}> = [];

for (const ex of INTENT_EXAMPLES) {
  const session = ex.is_follow_up
    ? parseCorpusContextNote(ex.context_note)
    : null;
  const got = classifyIntentRuleOnly(ex.q, session);
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
const byPair: Record<string, number> = {};
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
  console.log(
    `[${m.expected} -> ${m.got}${m.follow ? ' F' : ''}] ${m.q.slice(0, 90)}`,
  );
}
