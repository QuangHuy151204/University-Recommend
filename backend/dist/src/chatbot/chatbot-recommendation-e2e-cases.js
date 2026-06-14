"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHATBOT_RECOMMENDATION_E2E_CASES = void 0;
exports.CHATBOT_RECOMMENDATION_E2E_CASES = [
    {
        id: 'rec-25-supham-toan',
        q: 'Tôi được 25 điểm muốn học ngành sư phạm toán thì nên học trường gì',
        intent: 'recommendation_by_score',
        expectedInterestPhrase: 'Sư phạm Toán học',
        expectedScore: 25,
        expectedSubjectGroup: null,
        ollama_major_conflict: 'Kế toán',
    },
    {
        id: 'rec-24-a00-cntt',
        q: 'Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào?',
        intent: 'recommendation_by_score',
        expectedInterestPhrase: 'Công nghệ thông tin',
        expectedScore: 24,
        expectedSubjectGroup: 'A00',
        ollama_major_conflict: 'CNTT',
    },
    {
        id: 'rec-25-b01-cntt',
        q: 'Em 25 điểm khối B01 học CNTT nên chọn trường nào',
        intent: 'recommendation_by_score',
        expectedInterestPhrase: 'Công nghệ thông tin',
        expectedScore: 25,
        expectedSubjectGroup: 'B01',
    },
    {
        id: 'rec-19-du-lich',
        q: 'Em 19 điểm học bạ muốn tìm trường ở Hà Nội có ngành Du lịch',
        intent: 'recommendation_by_score',
        expectedInterestPhrase: 'Du lịch',
        expectedScore: 19,
        expectedSubjectGroup: null,
        ollama_major_conflict: 'Du lịch',
    },
];
//# sourceMappingURL=chatbot-recommendation-e2e-cases.js.map