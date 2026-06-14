"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHATBOT_E2E_CASES = void 0;
exports.CHATBOT_E2E_CASES = [
    {
        id: 'cutoff-bk-cntt',
        q: 'Điểm chuẩn Bách Khoa CNTT 2024',
        intent: 'ask_cutoff_score',
        ollama_conflict: 'recommendation_by_score',
    },
    {
        id: 'recommend-25-b01-cntt',
        q: 'Em 25 điểm khối B01 học CNTT nên chọn trường nào',
        intent: 'recommendation_by_score',
        ollama_conflict: 'search_major',
    },
    {
        id: 'uni-majors-hust',
        q: 'HUST có những ngành gì',
        intent: 'search_university',
    },
    {
        id: 'tuition-ftu',
        q: 'Học phí FTU bao nhiêu',
        intent: 'ask_tuition_fee',
        ollama_conflict: 'search_university',
    },
    {
        id: 'location-hanoi',
        q: 'Các trường đại học ở Hà Nội',
        intent: 'ask_location',
    },
    {
        id: 'career-cntt',
        q: 'Ngành CNTT ra trường làm gì',
        intent: 'ask_career',
    },
    {
        id: 'facilities-neu',
        q: 'NEU có KTX không',
        intent: 'ask_facilities',
        ollama_conflict: 'ask_cutoff_score',
    },
    {
        id: 'admission-bk',
        q: 'Bách Khoa xét tuyển bằng học bạ không',
        intent: 'ask_admission_method',
        ollama_conflict: 'ask_cutoff_score',
    },
    {
        id: 'compare-neu-ftu',
        q: 'So sánh NEU và FTU',
        intent: 'compare_universities',
        ollama_conflict: 'ask_cutoff_score',
    },
    {
        id: 'search-major-cntt-hanoi',
        q: 'Ngành CNTT có trường nào ở Hà Nội',
        intent: 'search_major',
        ollama_conflict: 'search_university',
    },
    {
        id: 'cutoff-neu-2024',
        q: 'Điểm chuẩn ngành CNTT Đại học Bách khoa Hà Nội năm 2024 là bao nhiêu?',
        intent: 'ask_cutoff_score',
        ollama_conflict: 'recommendation_by_score',
    },
    {
        id: 'recommend-25-supham-toan',
        q: 'Tôi được 25 điểm muốn học ngành sư phạm toán thì nên học trường gì',
        intent: 'recommendation_by_score',
        ollama_conflict: 'search_major',
    },
    {
        id: 'recommend-24-a00-cntt',
        q: 'Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào?',
        intent: 'recommendation_by_score',
        ollama_conflict: 'search_major',
    },
    {
        id: 'uni-programs-bk',
        q: 'Đại học Bách khoa Hà Nội đào tạo những ngành nào?',
        intent: 'search_university',
        ollama_conflict: 'search_major',
    },
    {
        id: 'tuition-neu-year',
        q: 'Học phí trường Đại học Kinh tế Quốc dân khoảng bao nhiêu một năm?',
        intent: 'ask_tuition_fee',
        ollama_conflict: 'search_university',
    },
    {
        id: 'compare-bk-uet',
        q: 'So sánh Đại học Bách khoa và Đại học Công nghệ về điểm chuẩn CNTT',
        intent: 'compare_universities',
        ollama_conflict: 'ask_cutoff_score',
    },
    {
        id: 'admission-neu',
        q: 'NEU xét tuyển những phương thức nào?',
        intent: 'ask_admission_method',
        ollama_conflict: 'ask_cutoff_score',
    },
    {
        id: 'greeting',
        q: 'Xin chào bot',
        intent: 'greeting',
    },
    {
        id: 'greeting-advice',
        q: 'Chào bot, em cần tư vấn tuyển sinh',
        intent: 'greeting',
        ollama_conflict: 'help',
    },
    {
        id: 'recommend-find-school',
        q: 'Em 19 điểm học bạ muốn tìm trường ở Hà Nội có ngành Du lịch',
        intent: 'recommendation_by_score',
        ollama_conflict: 'search_university',
    },
    {
        id: 'location-low-tuition',
        q: 'Ở Hà Nội trường tư nào học phí thấp?',
        intent: 'ask_location',
        ollama_conflict: 'ask_tuition_fee',
    },
    {
        id: 'help',
        q: 'Bạn có thể giúp gì cho em?',
        intent: 'help',
    },
];
//# sourceMappingURL=chatbot-e2e-cases.js.map