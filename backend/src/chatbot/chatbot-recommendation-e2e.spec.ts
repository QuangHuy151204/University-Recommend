import { CHATBOT_RECOMMENDATION_E2E_CASES } from './chatbot-recommendation-e2e-cases';
import { classifyIntentRuleOnly } from './chatbot-intent-rules';
import { pickMajorInterestPhrase } from './major-search';
import { resolveIntentPipeline } from './chatbot-intent-pipeline';
import {
  sanitizeExtractedEntities,
  validateEntitiesAgainstDb,
} from './chatbot-guardrails';
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

describe('chatbot recommendation E2E (score + major)', () => {
  it.each(CHATBOT_RECOMMENDATION_E2E_CASES)(
    '$id — rule intent',
    ({ q, intent }) => {
      expect(classifyIntentRuleOnly(q)).toBe(intent);
    },
  );

  it.each(CHATBOT_RECOMMENDATION_E2E_CASES)(
    '$id — interest phrase for recommendations',
    ({ q, expectedInterestPhrase, ollama_major_conflict }) => {
      const phrase = pickMajorInterestPhrase(q, ollama_major_conflict ?? null);
      expect(phrase).toBe(expectedInterestPhrase);
    },
  );

  it.each(
    CHATBOT_RECOMMENDATION_E2E_CASES.filter((c) => c.ollama_major_conflict),
  )(
    '$id — pipeline keeps recommendation intent despite Ollama entity noise',
    ({ q, intent, ollama_major_conflict }) => {
      const pipeline = resolveIntentPipeline(q, 'search_major', 0.9);
      expect(pipeline.intent).toBe(intent);
      const phrase = pickMajorInterestPhrase(q, ollama_major_conflict);
      expect(phrase.length).toBeGreaterThan(2);
    },
  );

  it('drops ambiguous major entity "toán" via DB validation', async () => {
    const msg = 'Em 25 điểm học ngành sư phạm toán nên chọn trường nào';
    const entities: ChatEntities = {
      ...EMPTY_ENTITIES,
      score: 25,
      major: 'toán',
    };
    const sanitized = sanitizeExtractedEntities(entities, msg);
    const validated = await validateEntitiesAgainstDb(sanitized, msg, {
      universityExists: async () => true,
      majorExists: async () => true,
    });
    expect(validated.major).toBeNull();
    expect(pickMajorInterestPhrase(msg, validated.major)).toBe(
      'Sư phạm Toán học',
    );
  });
});
