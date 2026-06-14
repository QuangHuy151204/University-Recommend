import { classifyIntentRuleOnly } from './chatbot-intent-rules';
import { parseCorpusContextNote } from './chat-session-context';
import { CORPUS_ROW_COUNT, INTENT_EXAMPLES } from './intent-corpus.generated';
import type { ChatIntent } from './chatbot.types';

/** Non-follow-up: rule fallback phải khớp nhãn corpus (Ollama off). */
const MIN_RULE_ACCURACY_STANDALONE = 0.75;

/** Follow-up cần session carry-over từ context_note. */
const MIN_RULE_ACCURACY_FOLLOW_UP = 0.7;

describe('chatbot intent regression (rule-only)', () => {
  it(`corpus has ${CORPUS_ROW_COUNT} labeled examples`, () => {
    expect(INTENT_EXAMPLES).toHaveLength(CORPUS_ROW_COUNT);
  });

  it('standalone questions meet minimum rule accuracy', () => {
    const standalone = INTENT_EXAMPLES.filter((ex) => !ex.is_follow_up);
    const mismatches: Array<{ q: string; expected: string; got: string }> = [];

    for (const ex of standalone) {
      const got = classifyIntentRuleOnly(ex.q);
      if (got !== ex.intent) {
        mismatches.push({
          q: ex.q,
          expected: ex.intent,
          got,
        });
      }
    }

    const accuracy =
      (standalone.length - mismatches.length) / standalone.length;
    if (accuracy < MIN_RULE_ACCURACY_STANDALONE && mismatches.length > 0) {
      const sample = mismatches
        .slice(0, 8)
        .map((m) => `  [${m.expected} → ${m.got}] ${m.q.slice(0, 72)}…`)
        .join('\n');
      console.warn(
        `Rule accuracy ${(accuracy * 100).toFixed(1)}% (${standalone.length - mismatches.length}/${standalone.length})\n${sample}`,
      );
    }
    expect(accuracy).toBeGreaterThanOrEqual(MIN_RULE_ACCURACY_STANDALONE);
  });

  it('follow-up questions meet minimum rule accuracy with session context', () => {
    const followUps = INTENT_EXAMPLES.filter((ex) => ex.is_follow_up);
    expect(followUps.length).toBeGreaterThan(0);

    const mismatches: Array<{ q: string; expected: string; got: string }> = [];
    let correct = 0;
    for (const ex of followUps) {
      const session = parseCorpusContextNote(ex.context_note);
      const got = classifyIntentRuleOnly(ex.q, session);
      if (got === ex.intent) {
        correct++;
      } else {
        mismatches.push({
          q: ex.q,
          expected: ex.intent,
          got,
        });
      }
    }
    const accuracy = correct / followUps.length;
    if (accuracy < MIN_RULE_ACCURACY_FOLLOW_UP && mismatches.length > 0) {
      const sample = mismatches
        .slice(0, 8)
        .map((m) => `  [${m.expected} → ${m.got}] ${m.q.slice(0, 72)}…`)
        .join('\n');
      console.warn(
        `Follow-up rule accuracy ${(accuracy * 100).toFixed(1)}% (${correct}/${followUps.length})\n${sample}`,
      );
    }
    expect(accuracy).toBeGreaterThanOrEqual(MIN_RULE_ACCURACY_FOLLOW_UP);
  });

  describe('critical intents must not regress', () => {
    const cases: Array<{ q: string; intent: ChatIntent }> = [
      {
        q: 'Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào ạ?',
        intent: 'recommendation_by_score',
      },
      {
        q: 'Điểm chuẩn ngành CNTT Đại học Bách khoa Hà Nội năm 2024 là bao nhiêu?',
        intent: 'ask_cutoff_score',
      },
      {
        q: 'Học phí trường Đại học Kinh tế Quốc dân khoảng bao nhiêu một năm?',
        intent: 'ask_tuition_fee',
      },
      {
        q: 'So sánh Đại học Bách khoa và Đại học Công nghệ về điểm chuẩn CNTT',
        intent: 'compare_universities',
      },
      {
        q: 'Đại học Bách khoa Hà Nội đào tạo những ngành nào?',
        intent: 'search_university',
      },
      {
        q: 'Xin chào bot',
        intent: 'greeting',
      },
      {
        q: 'Đại học Thủ đô Hà Nội có những ngành sư phạm nào?',
        intent: 'search_university',
      },
      {
        q: 'Em 24 điểm có đủ không?',
        intent: 'recommendation_by_score',
      },
      {
        q: 'Học phí Đại học Thủ đô Hà Nội khoảng bao nhiêu một năm?',
        intent: 'ask_tuition_fee',
      },
      {
        q: 'cho tôi học phí của trường đại học Khoa học và công nghệ Hà Nội (USTH)',
        intent: 'ask_tuition_fee',
      },
      {
        q: 'USTH có những chương trình đào tạo gì?',
        intent: 'search_university',
      },
      {
        q: 'có những ngành gì trong trường',
        intent: 'search_university',
      },
      {
        q: 'NEU xét tuyển những phương thức nào?',
        intent: 'ask_admission_method',
      },
      {
        q: 'Có học bổng 100% tại NEU không?',
        intent: 'ask_scholarship',
      },
      {
        q: 'NEU có ký túc xá không?',
        intent: 'ask_facilities',
      },
      {
        q: 'Ngành CNTT có những trường nào ở Hà Nội đào tạo?',
        intent: 'search_major',
      },
      {
        q: 'Ngành Khoa học Vũ trụ trường nào dạy?',
        intent: 'search_major',
      },
      {
        q: 'thang điểm vào HUST ngành CNTT năm 2024',
        intent: 'ask_cutoff_score',
      },
      {
        q: 'Ở TP.HCM có trường nào học CNTT tốt?',
        intent: 'unknown',
      },
      {
        q: 'Dữ liệu điểm chuẩn trên app lấy từ đâu vậy?',
        intent: 'help',
      },
      {
        q: 'So sánh Bách Khoa, NEU và FTU về điểm chuẩn CNTT năm 2024',
        intent: 'compare_universities',
      },
      {
        q: 'Học phí và điểm chuẩn Bách Khoa với Phenikaa khác nhau thế nào?',
        intent: 'compare_universities',
      },
      {
        q: 'App chỉ tra cứu được Hà Nội thôi à?',
        intent: 'help',
      },
    ];

    it.each(cases)('$intent ← $q', ({ q, intent }) => {
      expect(classifyIntentRuleOnly(q)).toBe(intent);
    });
  });
});
