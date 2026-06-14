import { CHATBOT_E2E_CASES } from './chatbot-e2e-cases';
import { parseCorpusContextNote } from './chat-session-context';
import { resolveIntentPipeline } from './chatbot-intent-pipeline';
import type { ChatIntent } from './chatbot.types';

describe('chatbot intent pipeline (guardrails)', () => {
  it('resolves cutoff query when Ollama says recommendation_by_score', () => {
    const q =
      'Điểm chuẩn ngành CNTT Đại học Bách khoa Hà Nội năm 2024 là bao nhiêu?';
    const result = resolveIntentPipeline(q, 'recommendation_by_score', 0.85);
    expect(result.intent).toBe('ask_cutoff_score');
  });

  it('keeps Ollama when rule and model agree on greeting', () => {
    const result = resolveIntentPipeline('Xin chào bot', 'greeting', 0.9);
    expect(result.intent).toBe('greeting');
    expect(result.source).toBe('ollama');
  });

  it('falls back to rule when Ollama confidence is low', () => {
    const q = 'Em 25 điểm khối B01 học CNTT nên chọn trường nào';
    const result = resolveIntentPipeline(q, 'search_major', 0.3);
    expect(result.intent).toBe('recommendation_by_score');
    expect(result.source).toBe('rule');
  });

  it.each(CHATBOT_E2E_CASES.filter((c) => c.ollama_conflict))(
    'pipeline yields $intent for $id despite ollama_conflict',
    ({ q, intent, ollama_conflict }) => {
      const result = resolveIntentPipeline(
        q,
        ollama_conflict as ChatIntent,
        0.85,
      );
      expect(result.intent).toBe(intent);
    },
  );

  const ollamaMismatchFixes: Array<{
    q: string;
    intent: ChatIntent;
    ollama: ChatIntent;
    context_note?: string;
  }> = [
    {
      q: 'An toàn thông tin khác gì CNTT vậy ạ?',
      intent: 'search_major',
      ollama: 'compare_universities',
    },
    {
      q: 'Em muốn tìm hiểu ngành Y đa khoa, học xong sẽ học những gì?',
      intent: 'search_major',
      ollama: 'ask_career',
    },
    {
      q: 'Ngành Quản lý đất đai học những gì?',
      intent: 'search_major',
      ollama: 'ask_career',
    },
    {
      q: 'Phenikaa miễn giảm học phí thế nào?',
      intent: 'ask_scholarship',
      ollama: 'ask_tuition_fee',
    },
    {
      q: 'Nộp hồ sơ học bổng khi nào?',
      intent: 'ask_scholarship',
      ollama: 'ask_admission_method',
      context_note: 'Turn trước người dùng hỏi học bổng USTH.',
    },
  ];

  it.each(ollamaMismatchFixes)(
    'pipeline fixes Ollama mismatch: $q',
    ({ q, intent, ollama, context_note }) => {
      const session = context_note
        ? parseCorpusContextNote(context_note)
        : undefined;
      const result = resolveIntentPipeline(q, ollama, 0.85, session);
      expect(result.intent).toBe(intent);
    },
  );
});
