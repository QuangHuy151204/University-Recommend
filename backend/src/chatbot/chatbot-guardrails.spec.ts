import { CHATBOT_E2E_CASES } from './chatbot-e2e-cases';
import { classifyIntentRuleOnly } from './chatbot-intent-rules';
import {
  GUARDRAIL_INTENT_ALIASES,
  isCutoffMissingAnswer,
  isLikelyFalseUniversityName,
  sanitizeExtractedEntities,
  shouldPreferRuleOverOllamaIntent,
} from './chatbot-guardrails';
import { isStructuredDbAnswer, shouldSkipOllamaRewrite } from './intent-corpus';
import type { ChatEntities, ChatIntent } from './chatbot.types';

describe('chatbot guardrails', () => {
  describe('shouldPreferRuleOverOllamaIntent', () => {
    const cases: Array<{
      q: string;
      ollama: ChatIntent;
      expectRuleWins: boolean;
    }> = [
      {
        q: 'Điểm chuẩn ngành CNTT Đại học Bách khoa Hà Nội năm 2024 là bao nhiêu?',
        ollama: 'recommendation_by_score',
        expectRuleWins: true,
      },
      {
        q: 'Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào?',
        ollama: 'search_major',
        expectRuleWins: true,
      },
      {
        q: 'Đại học Bách khoa Hà Nội đào tạo những ngành nào?',
        ollama: 'search_major',
        expectRuleWins: true,
      },
      {
        q: 'Học phí trường Đại học Kinh tế Quốc dân khoảng bao nhiêu một năm?',
        ollama: 'search_university',
        expectRuleWins: true,
      },
      {
        q: 'So sánh Đại học Bách khoa và Đại học Công nghệ về điểm chuẩn CNTT',
        ollama: 'ask_cutoff_score',
        expectRuleWins: true,
      },
      {
        q: 'NEU xét tuyển những phương thức nào?',
        ollama: 'ask_cutoff_score',
        expectRuleWins: true,
      },
      {
        q: 'Các trường ở Hà Nội đào tạo ngành CNTT',
        ollama: 'search_major',
        expectRuleWins: true,
      },
      {
        q: 'Xin chào bot',
        ollama: 'help',
        expectRuleWins: true,
      },
      {
        q: 'Bot ơi giúp em với',
        ollama: 'help',
        expectRuleWins: true,
      },
      {
        q: 'Em 19 điểm học bạ muốn tìm trường ở Hà Nội có ngành Du lịch',
        ollama: 'search_university',
        expectRuleWins: true,
      },
      {
        q: 'An toàn thông tin khác gì CNTT vậy ạ?',
        ollama: 'compare_universities',
        expectRuleWins: true,
      },
      {
        q: 'Ngành Quản lý đất đai học những gì?',
        ollama: 'ask_career',
        expectRuleWins: true,
      },
      {
        q: 'Phenikaa miễn giảm học phí thế nào?',
        ollama: 'ask_tuition_fee',
        expectRuleWins: true,
      },
      {
        q: 'Có học bổng toàn phần ở FPT không?',
        ollama: 'ask_scholarship',
        expectRuleWins: true,
      },
    ];

    it.each(cases)(
      'rule wins=$expectRuleWins when ollama=$ollama',
      ({ q, ollama, expectRuleWins }) => {
        const rule = classifyIntentRuleOnly(q);
        expect(shouldPreferRuleOverOllamaIntent(rule, ollama, q)).toBe(
          expectRuleWins,
        );
      },
    );
  });

  describe('entity sanitization', () => {
    it('drops ANH false positive from subject combination context', () => {
      const msg = 'Em 24 điểm khối A01 muốn học CNTT';
      const entities: ChatEntities = {
        score: 24,
        subject_group: 'A01',
        major: 'CNTT',
        location: 'Hà Nội',
        university_name: 'ANH',
        year: null,
        method_code: null,
      };
      expect(isLikelyFalseUniversityName('ANH', msg)).toBe(true);
      const sanitized = sanitizeExtractedEntities(entities, msg);
      expect(sanitized.university_name).toBeNull();
    });

    it('keeps valid university short name', () => {
      const msg = 'Điểm chuẩn NEU năm 2024';
      const entities: ChatEntities = {
        score: null,
        subject_group: null,
        major: null,
        location: null,
        university_name: 'NEU',
        year: 2024,
        method_code: null,
      };
      expect(isLikelyFalseUniversityName('NEU', msg)).toBe(false);
      expect(sanitizeExtractedEntities(entities, msg).university_name).toBe(
        'NEU',
      );
    });
  });

  describe('skip Ollama rewrite', () => {
    it('skips rewrite for cutoff missing-data answers', () => {
      const answer =
        'Mình chưa có điểm chuẩn cho Đại học X (năm 2024) trong dữ liệu hiện tại.';
      expect(isCutoffMissingAnswer(answer)).toBe(true);
      expect(isStructuredDbAnswer(answer)).toBe(true);
      expect(shouldSkipOllamaRewrite(answer, 'ask_cutoff_score')).toBe(true);
    });

    it('skips rewrite for structured cutoff list with scores', () => {
      const answer =
        'Điểm chuẩn Bách Khoa năm 2024:\n• Năm 2024 — tổ hợp A00: 27.5 điểm (THPT Quốc gia)';
      expect(shouldSkipOllamaRewrite(answer, 'ask_cutoff_score')).toBe(true);
    });
  });

  describe('intent aliases', () => {
    it('maps search_location to ask_location', () => {
      expect(GUARDRAIL_INTENT_ALIASES.search_location).toBe('ask_location');
    });
  });

  describe('fixed E2E intent cases (guardrail regression)', () => {
    it.each(CHATBOT_E2E_CASES)('$id → $intent', ({ q, intent }) => {
      expect(classifyIntentRuleOnly(q)).toBe(intent);
    });
  });
});
