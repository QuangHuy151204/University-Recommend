import { CHATBOT_FOLLOW_UP_E2E_CASES } from './chatbot-follow-up-e2e-cases';
import { collectUniversityNames } from './university-extract';
import {
  mergeEntitiesWithSession,
  parseCorpusContextNote,
  updateSessionContext,
} from './chat-session-context';
import { resolveIntentPipeline } from './chatbot-intent-pipeline';
import { classifyIntentRuleOnly } from './chatbot-intent-rules';
import { INTENT_HANDLER_MATRIX } from './intent-corpus';
import type { ChatEntities } from './chatbot.types';

const EMPTY_ENTITIES: ChatEntities = {
  score: null,
  subject_group: null,
  major: null,
  location: null,
  university_name: null,
  year: null,
  method_code: null,
};

/** Mô phỏng pipeline rule-only (Ollama off) + merge session cho turn 2. */
function resolveFollowUpTurn(caseDef: (typeof CHATBOT_FOLLOW_UP_E2E_CASES)[0]) {
  const session = parseCorpusContextNote(caseDef.context_note);
  const pipeline = resolveIntentPipeline(caseDef.q, null, null, session);
  const ruleIntent = classifyIntentRuleOnly(caseDef.q, session);
  const merged = mergeEntitiesWithSession(EMPTY_ENTITIES, session, caseDef.q);
  const handler = INTENT_HANDLER_MATRIX[pipeline.intent].handler;
  return { session, pipeline, ruleIntent, merged, handler };
}

describe('chatbot follow-up E2E (session switch university/major)', () => {
  it.each(CHATBOT_FOLLOW_UP_E2E_CASES)('$id — intent + handler', (caseDef) => {
    const { pipeline, ruleIntent, handler } = resolveFollowUpTurn(caseDef);

    expect(ruleIntent).toBe(caseDef.intent);
    expect(pipeline.intent).toBe(caseDef.intent);
    expect(pipeline.source).toBe('rule');
    expect(handler).toBe(caseDef.handler);
  });

  it.each(CHATBOT_FOLLOW_UP_E2E_CASES)(
    '$id — merged entities override session carry-over',
    (caseDef) => {
      const { merged } = resolveFollowUpTurn(caseDef);
      const expected = caseDef.entities;

      if (expected.university_name) {
        expect(merged.university_name).toBe(expected.university_name);
      }
      if (expected.major) {
        const norm = (s: string) =>
          s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
        const got = norm(merged.major ?? '');
        const want = norm(expected.major);
        expect(got === want || got.includes(want) || want.includes(got)).toBe(
          true,
        );
      }
      if (expected.year != null) {
        expect(merged.year).toBe(expected.year);
      }
      if (expected.score != null) {
        expect(merged.score).toBe(expected.score);
      }
      if (expected.subject_group) {
        expect(merged.subject_group).toBe(expected.subject_group);
      }
    },
  );

  it('compare follow-up extracts multiple universities from message', () => {
    const caseDef = CHATBOT_FOLLOW_UP_E2E_CASES.find(
      (c) => c.id === 'switch-compare-usth-hust',
    )!;
    const names = collectUniversityNames(caseDef.q, null);
    expect(names).toEqual(expect.arrayContaining(['USTH', 'HUST']));
  });

  it('multi-turn session: turn 1 HUST+AI → turn 2 USTH+Hàng không clears stale university', () => {
    const turn1Entities: ChatEntities = {
      ...EMPTY_ENTITIES,
      university_name: 'HUST',
      major: 'Trí tuệ nhân tạo',
      year: 2024,
    };
    const session = updateSessionContext(
      parseCorpusContextNote(null),
      'ask_cutoff_score',
      turn1Entities,
    );

    const turn2 = 'điểm chuẩn ngành hàng không của USTH thì sao';
    const merged = mergeEntitiesWithSession(EMPTY_ENTITIES, session, turn2);

    expect(merged.university_name).toBe('USTH');
    expect(merged.major).toBe('Hàng không');
    expect(merged.year).toBeNull();
  });
});
