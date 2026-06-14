"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptySessionContext = emptySessionContext;
exports.parseSessionContext = parseSessionContext;
exports.mergeEntitiesWithSession = mergeEntitiesWithSession;
exports.buildSessionContextHint = buildSessionContextHint;
exports.updateSessionContext = updateSessionContext;
exports.sessionContextToRecord = sessionContextToRecord;
exports.parseCorpusContextNote = parseCorpusContextNote;
const chatbot_intent_rules_1 = require("./chatbot-intent-rules");
const major_search_1 = require("./major-search");
function normalizeUniKey(value) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}
function emptySessionContext() {
    return {
        last_intent: null,
        last_university: null,
        last_major: null,
        last_score: null,
        last_subject_group: null,
        last_method_code: null,
        last_location: null,
        last_year: null,
        last_compared_universities: null,
    };
}
function parseSessionContext(raw) {
    const base = emptySessionContext();
    if (!raw || typeof raw !== 'object')
        return base;
    const intent = raw.last_intent;
    if (typeof intent === 'string') {
        base.last_intent = intent;
    }
    const str = (key) => {
        const v = raw[key];
        return typeof v === 'string' && v.trim() ? v.trim() : null;
    };
    base.last_university = str('last_university');
    base.last_major = str('last_major');
    base.last_subject_group = str('last_subject_group');
    base.last_method_code = str('last_method_code');
    base.last_location = str('last_location');
    const score = raw.last_score;
    if (typeof score === 'number' &&
        Number.isFinite(score) &&
        score >= 0 &&
        score <= 30) {
        base.last_score = score;
    }
    const year = raw.last_year;
    if (typeof year === 'number' &&
        Number.isInteger(year) &&
        year >= 2020 &&
        year <= 2030) {
        base.last_year = year;
    }
    const compared = raw.last_compared_universities;
    if (Array.isArray(compared)) {
        const names = compared
            .filter((v) => typeof v === 'string' && v.trim().length > 0)
            .map((v) => v.trim())
            .slice(0, 4);
        base.last_compared_universities = names.length > 0 ? names : null;
    }
    return base;
}
function mergeEntitiesWithSession(entities, session, msg) {
    const merged = {
        score: entities.score ?? session.last_score,
        subject_group: entities.subject_group ?? session.last_subject_group,
        major: entities.major ?? session.last_major,
        location: entities.location ?? session.last_location,
        university_name: entities.university_name ?? session.last_university,
        year: entities.year ?? session.last_year,
        method_code: entities.method_code ?? session.last_method_code,
    };
    if (!msg?.trim())
        return merged;
    const explicitUni = (0, chatbot_intent_rules_1.extractExplicitUniversityFromMessage)(msg);
    const explicitYear = (0, chatbot_intent_rules_1.extractYearFromMessage)(msg);
    if (explicitUni) {
        const switched = session.last_university &&
            normalizeUniKey(explicitUni) !== normalizeUniKey(session.last_university);
        merged.university_name = explicitUni;
        if (switched && explicitYear === null) {
            merged.year = null;
        }
    }
    const explicitMajor = (0, major_search_1.resolveMajorSearchTerm)(msg) ?? (0, major_search_1.extractMajorFragment)(msg);
    if (explicitMajor) {
        const switchedMajor = session.last_major &&
            normalizeUniKey(explicitMajor) !== normalizeUniKey(session.last_major);
        merged.major = explicitMajor;
        if (switchedMajor && explicitYear === null && !explicitUni) {
            merged.year = null;
        }
    }
    if (explicitYear !== null) {
        merged.year = explicitYear;
    }
    return merged;
}
function buildSessionContextHint(session) {
    const parts = [];
    if (session.last_university) {
        parts.push(`Turn trước người dùng đang hỏi về ${session.last_university}.`);
    }
    if (session.last_major) {
        parts.push(`Ngành đang thảo luận: ${session.last_major}.`);
    }
    if (session.last_score != null) {
        parts.push(`Điểm đã nêu trước đó: ${session.last_score}.`);
    }
    if (session.last_subject_group) {
        parts.push(`Tổ hợp đã nêu: ${session.last_subject_group}.`);
    }
    if (session.last_method_code) {
        parts.push(`Phương thức xét tuyển đã nêu: ${session.last_method_code}.`);
    }
    if (session.last_year != null) {
        parts.push(`Năm tuyển sinh đang thảo luận: ${session.last_year}.`);
    }
    if (session.last_compared_universities?.length) {
        parts.push(`Các trường vừa so sánh: ${session.last_compared_universities.join(', ')}.`);
    }
    if (parts.length === 0)
        return '';
    return `Ngữ cảnh phiên (carry-over):\n${parts.join('\n')}`;
}
function updateSessionContext(prev, intent, entities, comparedUniversities) {
    const next = { ...prev, last_intent: intent };
    if (entities.university_name)
        next.last_university = entities.university_name;
    if (entities.major)
        next.last_major = entities.major;
    if (entities.score != null)
        next.last_score = entities.score;
    if (entities.subject_group)
        next.last_subject_group = entities.subject_group;
    if (entities.method_code)
        next.last_method_code = entities.method_code;
    if (entities.location)
        next.last_location = entities.location;
    if (entities.year != null)
        next.last_year = entities.year;
    if (intent === 'compare_universities' && comparedUniversities?.length) {
        next.last_compared_universities = comparedUniversities.slice(0, 4);
    }
    return next;
}
function sessionContextToRecord(ctx) {
    return { ...ctx };
}
function parseCorpusContextNote(note) {
    const base = emptySessionContext();
    if (!note?.trim())
        return base;
    const lower = note.toLowerCase();
    const intentRules = [
        [['điểm chuẩn', 'diem chuan'], 'ask_cutoff_score'],
        [
            [
                'học bổng',
                'hoc bong',
                'miễn giảm',
                'mien giam',
                'điều kiện học bổng',
                'dieu kien hoc bong',
            ],
            'ask_scholarship',
        ],
        [['so sánh', 'so sanh', 'so sanh neu va ftu'], 'compare_universities'],
        [['học phí', 'hoc phi'], 'ask_tuition_fee'],
        [
            [
                'phương thức',
                'phuong thuc',
                'xét tuyển',
                'xet tuyen',
                'học bạ',
                'hoc ba',
            ],
            'ask_admission_method',
        ],
        [['việc làm', 'viec lam'], 'ask_career'],
        [
            ['gợi ý', 'goi y', 'khả năng', 'kha nang', 'điểm', 'diem', 'an toàn hơn'],
            'recommendation_by_score',
        ],
        [
            [
                'ngành',
                'nganh',
                'đào tạo',
                'dao tao',
                'trường đào tạo',
                'truong dao tao',
            ],
            'search_major',
        ],
        [
            [
                'danh sách trường',
                'trường công lập',
                'trường ở',
                'trường tư',
                'khu vực',
            ],
            'ask_location',
        ],
        [
            ['chương trình', 'chuong trinh', 'thông tin', 'thong tin', 'ngành của'],
            'search_university',
        ],
    ];
    for (const [keywords, intent] of intentRules) {
        if (keywords.some((kw) => lower.includes(kw))) {
            base.last_intent = intent;
            break;
        }
    }
    const scoreMatch = note.match(/(\d+(?:[.,]\d+)?)\s*điểm/i);
    if (scoreMatch) {
        base.last_score = parseFloat(scoreMatch[1].replace(',', '.'));
    }
    const subjMatch = note.match(/\b([ABCD]\d{2})\b/i) ?? note.match(/khối\s+([ABCD]\d{2})/i);
    if (subjMatch) {
        base.last_subject_group = subjMatch[1].toUpperCase();
    }
    const majorMatch = note.match(/ngành\s+([^,.]+?)(?:\s+năm|\s+tại|\s+ở|\.|$)/i);
    if (majorMatch) {
        base.last_major = majorMatch[1].trim();
    }
    const uniPatterns = [
        /(?:về|tại|hỏi|xem|chọn)\s+(Đại học[^.]+)/i,
        /(?:về|tại|hỏi)\s+(Học viện[^.]+)/i,
        /(?:về|tại)\s+(NEU|FTU|USTH|HUST|PTIT|HAUI|FPT[^.]*)/i,
        /(Bách Khoa|Thăng Long|Phenikaa|Thương mại|Ngân hàng|Y Hà Nội|Luật Hà Nội)/i,
    ];
    for (const pattern of uniPatterns) {
        const match = note.match(pattern);
        if (match) {
            base.last_university = match[1].trim();
            break;
        }
    }
    if (lower.includes('hà nội') || lower.includes('ha noi')) {
        base.last_location = 'Hà Nội';
    }
    const yearMatch = note.match(/năm\s+(20\d{2})/i);
    if (yearMatch) {
        base.last_year = parseInt(yearMatch[1], 10);
    }
    const compareMatch = note.match(/so s[aá]nh\s+(.+?)\s+v(?:à|oi)\s+(.+?)(?:\s+về|\s+ve|\s+ngành|\s+nganh|\.|$)/i);
    if (compareMatch) {
        const names = [compareMatch[1].trim(), compareMatch[2].trim()].filter(Boolean);
        if (names.length >= 2) {
            base.last_compared_universities = names;
            base.last_intent = 'compare_universities';
        }
    }
    return base;
}
//# sourceMappingURL=chat-session-context.js.map