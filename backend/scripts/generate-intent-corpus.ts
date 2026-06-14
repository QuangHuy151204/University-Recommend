/**
 * Reads repo-root intent.txt (JSONL) and writes intent-corpus.generated.ts
 * Run: npm run generate:intent-corpus  (from backend/)
 */
import * as fs from 'fs';
import * as path from 'path';

type CorpusRow = {
  id: number;
  question: string;
  intent: string;
  entities: Record<string, string | number | null>;
  is_follow_up: boolean;
  context_note: string | null;
  difficulty: string;
  tags: string[];
};

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const INPUT = path.join(REPO_ROOT, 'intent.txt');
const OUTPUT = path.resolve(
  __dirname,
  '..',
  'src',
  'chatbot',
  'intent-corpus.generated.ts',
);

const VALID_INTENTS = [
  'recommendation_by_score',
  'ask_cutoff_score',
  'search_university',
  'search_major',
  'ask_tuition_fee',
  'ask_location',
  'compare_universities',
  'ask_career',
  'ask_admission_method',
  'ask_scholarship',
  'ask_facilities',
  'greeting',
  'help',
  'unknown',
] as const;

function confidenceFromDifficulty(
  difficulty: string,
  isFollowUp: boolean,
): number {
  if (isFollowUp) return 0.86;
  switch (difficulty) {
    case 'easy':
      return 0.95;
    case 'medium':
      return 0.9;
    case 'hard':
      return 0.84;
    default:
      return 0.88;
  }
}

function parseJsonl(filePath: string): CorpusRow[] {
  const text = fs.readFileSync(filePath, 'utf8');
  const rows: CorpusRow[] = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    rows.push(JSON.parse(trimmed) as CorpusRow);
  }
  return rows;
}

function main(): void {
  if (!fs.existsSync(INPUT)) {
    console.error(`Missing ${INPUT}`);
    process.exit(1);
  }

  const rows = parseJsonl(INPUT);
  const unknownIntents = new Set(
    rows.map((r) => r.intent).filter((i) => !VALID_INTENTS.includes(i as any)),
  );
  if (unknownIntents.size > 0) {
    console.error('Unknown intents in corpus:', [...unknownIntents]);
    process.exit(1);
  }

  const combined = rows.map((r) => ({
    q: r.question,
    intent: r.intent,
    confidence: confidenceFromDifficulty(r.difficulty, r.is_follow_up),
    entities: r.entities,
    is_follow_up: r.is_follow_up,
    context_note: r.context_note,
  }));

  const intentExamples = rows.map((r) => ({
    q: r.question,
    intent: r.intent,
    is_follow_up: r.is_follow_up,
    context_note: r.context_note,
  }));

  const entityExamples = rows
    .filter((r) =>
      Object.values(r.entities).some((v) => v !== null && v !== undefined),
    )
    .map((r) => ({
      q: r.question,
      a: r.entities,
      is_follow_up: r.is_follow_up,
      context_note: r.context_note,
    }));

  const header = `/* eslint-disable */
/** AUTO-GENERATED from intent.txt — do not edit. Run: npm run generate:intent-corpus */
export const CORPUS_ROW_COUNT = ${rows.length};

export const INTENT_EXAMPLES: Array<{
  q: string;
  intent: string;
  is_follow_up: boolean;
  context_note: string | null;
}> = ${JSON.stringify(intentExamples, null, 2)};

export const ENTITY_EXAMPLES: Array<{
  q: string;
  a: Record<string, string | number | null>;
  is_follow_up: boolean;
  context_note: string | null;
}> = ${JSON.stringify(entityExamples, null, 2)};

export const COMBINED_EXAMPLES: Array<{
  q: string;
  intent: string;
  confidence: number;
  entities: Record<string, string | number | null>;
  is_follow_up: boolean;
  context_note: string | null;
}> = ${JSON.stringify(combined, null, 2)};
`;

  fs.writeFileSync(OUTPUT, header, 'utf8');
  console.log(
    `Wrote ${OUTPUT} (${rows.length} rows, ${intentExamples.length} intent, ${entityExamples.length} entity, ${combined.length} combined)`,
  );
}

main();
