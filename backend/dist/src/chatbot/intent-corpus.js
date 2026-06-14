"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT_COMBINED_EDGE_CASES = exports.PROMPT_EDGE_CASE_EXAMPLES = exports.INTENT_HANDLER_MATRIX = exports.COMBINED_EXAMPLES = exports.ENTITY_EXAMPLES = exports.INTENT_EXAMPLES = exports.INTENT_CLASSIFY_DESCRIPTIONS = exports.CORPUS_ROW_COUNT = exports.DB_MAJOR_LIST_PREFIX = void 0;
exports.isStructuredDbAnswer = isStructuredDbAnswer;
exports.shouldSkipOllamaRewrite = shouldSkipOllamaRewrite;
exports.selectPromptExamples = selectPromptExamples;
exports.corpusEntitiesToChatEntities = corpusEntitiesToChatEntities;
const chatbot_copy_1 = require("./chatbot-copy");
Object.defineProperty(exports, "DB_MAJOR_LIST_PREFIX", { enumerable: true, get: function () { return chatbot_copy_1.DB_MAJOR_LIST_PREFIX; } });
const chatbot_types_1 = require("./chatbot.types");
const intent_corpus_generated_1 = require("./intent-corpus.generated");
Object.defineProperty(exports, "CORPUS_ROW_COUNT", { enumerable: true, get: function () { return intent_corpus_generated_1.CORPUS_ROW_COUNT; } });
exports.INTENT_CLASSIFY_DESCRIPTIONS = {
    recommendation_by_score: 'User states THEIR exam score (or follow-up after prior score context) and wants school/major advice: "nên chọn trường nào", "tìm trường", "có đủ vào", "có trường nào", "ưu tiên học phí thấp thì chọn trường nào". NOT official cutoff lookup.',
    ask_cutoff_score: 'Official published cutoff scores ("điểm chuẩn", "điểm đầu vào", "lấy bao nhiêu điểm"). NOT "em X điểm có đủ vào trường Y không".',
    search_university: 'Info about a specific university, its programs, OR follow-up about "trường đó" (quận, địa chỉ, ngành) after that school was discussed.',
    search_major: 'Major/field in general — which schools teach it, curriculum ("ngành X học những gì"), or major vs major ("CNTT khác gì An toàn thông tin") — NOT comparing universities and NOT the user giving their score for personalized advice.',
    ask_tuition_fee: 'Tuition of a SPECIFIC school/major ("học phí NEU", "học phí trường đó"). NOT "trường tư nào học phí thấp ở Hà Nội" (that is ask_location).',
    ask_location: 'List/find universities in Hanoi by area or type — including "trường tư nào học phí thấp". Dataset is Hanoi-only.',
    compare_universities: 'Compare two or more schools/majors side by side.',
    ask_career: 'Jobs/career after graduation for a major.',
    ask_admission_method: 'Admission methods and how to apply (THPT, học bạ, DGNL) — NOT cutoff score numbers.',
    ask_scholarship: 'Scholarships, tuition waivers ("miễn giảm học phí"), or how to apply ("nộp hồ sơ học bổng") at a school — NOT generic tuition lookup without scholarship context.',
    ask_facilities: 'Dormitory/KTX, campus, labs, library ("ký túc xá", "cơ sở vật chất").',
    greeting: 'Hello/chào opening — including "Chào bot, em cần tư vấn tuyển sinh" or "Bot ơi giúp em với" before a specific question.',
    help: 'What the bot/app can do, how to use it — NOT admission advice itself.',
    unknown: 'Out of scope: other cities, exam prep, unanswerable claims (e.g. học bổng toàn phần FPT).',
};
exports.INTENT_EXAMPLES = intent_corpus_generated_1.INTENT_EXAMPLES;
exports.ENTITY_EXAMPLES = intent_corpus_generated_1.ENTITY_EXAMPLES;
exports.COMBINED_EXAMPLES = intent_corpus_generated_1.COMBINED_EXAMPLES;
exports.INTENT_HANDLER_MATRIX = {
    recommendation_by_score: {
        handler: 'handleScoreQuery',
        needsEntities: true,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: true,
    },
    ask_cutoff_score: {
        handler: 'handleCutoffQuery',
        needsEntities: true,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: true,
    },
    search_university: {
        handler: 'handleUniversityQuery',
        needsEntities: true,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: true,
    },
    search_major: {
        handler: 'handleMajorQuery',
        needsEntities: true,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: true,
    },
    ask_tuition_fee: {
        handler: 'handleTuitionQuery',
        needsEntities: true,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: true,
    },
    ask_location: {
        handler: 'handleLocationQuery',
        needsEntities: true,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: true,
    },
    compare_universities: {
        handler: 'handleCompareQuery',
        needsEntities: true,
        skipOllamaRewrite: true,
        skipRewriteWhenStructured: false,
    },
    ask_career: {
        handler: 'handleCareerQuery',
        needsEntities: true,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: false,
    },
    ask_admission_method: {
        handler: 'handleAdmissionMethodQuery',
        needsEntities: true,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: true,
    },
    ask_scholarship: {
        handler: 'handleScholarshipQuery',
        needsEntities: true,
        skipOllamaRewrite: true,
        skipRewriteWhenStructured: false,
    },
    ask_facilities: {
        handler: 'handleFacilitiesQuery',
        needsEntities: true,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: true,
    },
    greeting: {
        handler: 'getGreeting',
        needsEntities: false,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: false,
    },
    help: {
        handler: 'getHelp',
        needsEntities: false,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: false,
    },
    unknown: {
        handler: 'getDefaultAnswer',
        needsEntities: false,
        skipOllamaRewrite: false,
        skipRewriteWhenStructured: false,
    },
};
const STRUCTURED_DB_MARKERS = [
    chatbot_copy_1.DB_MAJOR_LIST_PREFIX,
    'Điểm chuẩn',
    'Dựa trên',
    'một số gợi ý phù hợp',
    'Học phí',
    'Các trường đào tạo',
    'chương trình trong dữ liệu',
    'Danh sách ngành',
    'triệu/năm',
    'độ phù hợp',
    'điểm chuẩn 202',
    'Mình chưa có điểm chuẩn',
    'chưa có điểm chuẩn',
];
function isStructuredDbAnswer(ruleAnswer) {
    if (!ruleAnswer?.trim())
        return false;
    if (STRUCTURED_DB_MARKERS.some((m) => ruleAnswer.includes(m)))
        return true;
    if (/^\d+\.\s+/m.test(ruleAnswer))
        return true;
    if (/^•\s+/m.test(ruleAnswer))
        return true;
    if (/\d+(?:[.,]\d+)?\s*điểm/i.test(ruleAnswer))
        return true;
    return false;
}
function shouldSkipOllamaRewrite(ruleAnswer, intent) {
    const cfg = exports.INTENT_HANDLER_MATRIX[intent];
    if (cfg.skipOllamaRewrite)
        return true;
    if (cfg.skipRewriteWhenStructured && isStructuredDbAnswer(ruleAnswer)) {
        return true;
    }
    return false;
}
const PROMPT_COMBINED_PER_INTENT = 2;
const PROMPT_ENTITY_CAP = 12;
exports.PROMPT_EDGE_CASE_EXAMPLES = [
    {
        q: 'Em 19 điểm học bạ muốn tìm trường ở Hà Nội có ngành Du lịch',
        intent: 'recommendation_by_score',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Tôi được 25 điểm muốn học ngành sư phạm toán thì nên học trường gì',
        intent: 'recommendation_by_score',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Nếu ưu tiên học phí thấp thì chọn trường nào?',
        intent: 'recommendation_by_score',
        is_follow_up: true,
        context_note: 'User vừa nêu điểm và ngành mong muốn, đang cần gợi ý trường phù hợp ở Hà Nội',
    },
    {
        q: 'Em được 24 điểm thì có đủ vào Đại học Thủ đô Hà Nội không?',
        intent: 'recommendation_by_score',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Em 18 điểm khối C00 có trường công lập nào ở Hà Nội không?',
        intent: 'recommendation_by_score',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Chào bot, em cần tư vấn tuyển sinh',
        intent: 'greeting',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Bot ơi giúp em với',
        intent: 'greeting',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Chào em, tôi muốn hỏi thông tin tuyển sinh cho con',
        intent: 'greeting',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Ở Hà Nội trường tư nào học phí thấp?',
        intent: 'ask_location',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Có học bổng toàn phần ở FPT không?',
        intent: 'unknown',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Trường đó ở quận nào?',
        intent: 'search_university',
        is_follow_up: true,
        context_note: 'Turn trước người dùng hỏi thông tin về một trường cụ thể ở Hà Nội.',
    },
    {
        q: 'An toàn thông tin khác gì CNTT vậy ạ?',
        intent: 'search_major',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Ngành Quản lý đất đai học những gì?',
        intent: 'search_major',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Em muốn tìm hiểu ngành Y đa khoa, học xong sẽ học những gì?',
        intent: 'search_major',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Phenikaa miễn giảm học phí thế nào?',
        intent: 'ask_scholarship',
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Nộp hồ sơ học bổng khi nào?',
        intent: 'ask_scholarship',
        is_follow_up: true,
        context_note: 'Turn trước người dùng hỏi học bổng USTH.',
    },
];
exports.PROMPT_COMBINED_EDGE_CASES = [
    {
        q: 'Tôi được 25 điểm muốn học ngành sư phạm toán thì nên học trường gì',
        intent: 'recommendation_by_score',
        confidence: 0.95,
        entities: {
            score: 25,
            subject_group: null,
            major: 'Sư phạm Toán học',
            location: null,
            university_name: null,
            year: null,
            method_code: null,
        },
        is_follow_up: false,
        context_note: null,
    },
    {
        q: 'Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào?',
        intent: 'recommendation_by_score',
        confidence: 0.95,
        entities: {
            score: 24,
            subject_group: 'A00',
            major: 'Công nghệ thông tin',
            location: 'Hà Nội',
            university_name: null,
            year: null,
            method_code: null,
        },
        is_follow_up: false,
        context_note: null,
    },
];
function selectPromptExamples() {
    const byIntent = new Map();
    for (const intent of chatbot_types_1.CHAT_INTENTS) {
        byIntent.set(intent, []);
    }
    for (const ex of exports.COMBINED_EXAMPLES) {
        const list = byIntent.get(ex.intent);
        if (list && list.length < PROMPT_COMBINED_PER_INTENT) {
            list.push(ex);
        }
    }
    const combinedExamples = chatbot_types_1.CHAT_INTENTS.flatMap((i) => byIntent.get(i) ?? []);
    const followUpCombined = exports.COMBINED_EXAMPLES.filter((ex) => ex.is_follow_up && !!ex.context_note).slice(0, chatbot_types_1.CHAT_INTENTS.length);
    const mergedCombined = dedupeCombined([
        ...exports.PROMPT_COMBINED_EDGE_CASES,
        ...combinedExamples,
        ...followUpCombined,
    ]);
    const intentExamples = dedupeIntentExamples([
        ...exports.PROMPT_EDGE_CASE_EXAMPLES,
        ...mergedCombined.map((ex) => ({
            q: ex.q,
            intent: ex.intent,
            is_follow_up: ex.is_follow_up,
            context_note: ex.context_note,
        })),
    ]);
    const entityExamples = exports.ENTITY_EXAMPLES.filter((ex) => Object.values(ex.a).some((v) => v !== null && v !== undefined))
        .sort((a, b) => Number(b.is_follow_up) - Number(a.is_follow_up))
        .slice(0, PROMPT_ENTITY_CAP);
    return {
        intentExamples,
        entityExamples,
        combinedExamples: mergedCombined,
    };
}
function dedupeCombined(rows) {
    const seen = new Set();
    const out = [];
    for (const row of rows) {
        const key = `${row.intent}|${row.q}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        out.push(row);
    }
    return out;
}
function dedupeIntentExamples(rows) {
    const seen = new Set();
    const out = [];
    for (const row of rows) {
        const key = `${row.intent}|${row.q}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        out.push(row);
    }
    return out;
}
function corpusEntitiesToChatEntities(raw) {
    return {
        score: typeof raw.score === 'number' ? raw.score : null,
        subject_group: typeof raw.subject_group === 'string' ? raw.subject_group : null,
        major: typeof raw.major === 'string' ? raw.major : null,
        location: typeof raw.location === 'string' ? raw.location : null,
        university_name: typeof raw.university_name === 'string' ? raw.university_name : null,
        year: typeof raw.year === 'number' ? raw.year : null,
        method_code: typeof raw.method_code === 'string' ? raw.method_code : null,
    };
}
//# sourceMappingURL=intent-corpus.js.map