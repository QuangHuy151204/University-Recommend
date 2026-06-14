"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsText = containsText;
exports.extractScoreFromMessage = extractScoreFromMessage;
exports.extractParentheticalAcronym = extractParentheticalAcronym;
exports.extractYearFromMessage = extractYearFromMessage;
exports.extractExplicitUniversityFromMessage = extractExplicitUniversityFromMessage;
exports.asksMajorsInSchoolContext = asksMajorsInSchoolContext;
exports.asksUniversityOrPrograms = asksUniversityOrPrograms;
exports.asksUniversityPrograms = asksUniversityPrograms;
exports.looksLikeCutoffScoreQuery = looksLikeCutoffScoreQuery;
exports.asksWhichSchoolsTeachMajor = asksWhichSchoolsTeachMajor;
exports.isShortFollowUp = isShortFollowUp;
exports.resolveFollowUpIntent = resolveFollowUpIntent;
exports.looksLikeScoreRecommendation = looksLikeScoreRecommendation;
exports.looksLikeAdmissionMethod = looksLikeAdmissionMethod;
exports.looksLikeFacilitiesQuery = looksLikeFacilitiesQuery;
exports.looksLikeTuitionBillingQuery = looksLikeTuitionBillingQuery;
exports.looksLikeOutOfScopeLocationQuery = looksLikeOutOfScopeLocationQuery;
exports.looksLikeLocationListQuery = looksLikeLocationListQuery;
exports.asksUniversityHasMajor = asksUniversityHasMajor;
exports.looksLikeGreeting = looksLikeGreeting;
exports.looksLikeHelpQuery = looksLikeHelpQuery;
exports.looksLikeCompareUniversities = looksLikeCompareUniversities;
exports.looksLikeUnknownFullScholarshipQuery = looksLikeUnknownFullScholarshipQuery;
exports.looksLikeScholarshipQuery = looksLikeScholarshipQuery;
exports.looksLikeCareerQuery = looksLikeCareerQuery;
exports.ruleBasedClassify = ruleBasedClassify;
exports.correctRuleIntent = correctRuleIntent;
exports.looksLikeCompareTuitionFollowUp = looksLikeCompareTuitionFollowUp;
exports.classifyIntentRuleOnly = classifyIntentRuleOnly;
function normalizeMatchText(input) {
    return input
        .toLowerCase()
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}
function containsText(text, keywords) {
    const normalized = normalizeMatchText(text);
    return keywords.some((kw) => {
        const k = normalizeMatchText(kw);
        if (k.length <= 3) {
            const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$|[!?.,])`, 'u').test(normalized);
        }
        return normalized.includes(k);
    });
}
function extractScoreFromMessage(msg) {
    const stripped = msg.replace(/\b[ABCD]\d{2}\b/gi, ' ');
    const matches = stripped.matchAll(/(\d+(?:[.,]\d+)?)/g);
    for (const m of matches) {
        const n = parseFloat(m[1].replace(',', '.'));
        if (!isNaN(n) && n >= 0 && n <= 30)
            return n;
    }
    return null;
}
function extractParentheticalAcronym(msg) {
    const m = msg.match(/\(([A-Za-z][A-Za-z0-9.-]{1,20})\)/);
    return m ? m[1].trim().toUpperCase() : null;
}
const MESSAGE_UNIVERSITY_ACRONYMS = [
    'USTH',
    'HUST',
    'NEU',
    'FTU',
    'PTIT',
    'HAUI',
    'FPT',
    'HNUE',
    'VNU',
    'HMU',
    'HUSTECH',
    'UET',
];
const MESSAGE_UNIVERSITY_NICKNAMES = [
    'Bách Khoa Hà Nội',
    'Bách Khoa',
    'Kinh tế Quốc dân',
    'Ngoại thương',
    'Học viện Bưu chính',
    'Học viện Ngân hàng',
    'Thương mại',
    'Thăng Long',
    'Phenikaa',
    'Ngân hàng',
    'Luật Hà Nội',
    'Y Hà Nội',
    'Y dược',
];
function extractYearFromMessage(msg) {
    const m = msg.match(/\b(20[2-3]\d)\b/);
    if (!m)
        return null;
    const n = parseInt(m[1], 10);
    return n >= 2020 && n <= 2030 ? n : null;
}
function extractExplicitUniversityFromMessage(msg) {
    const paren = extractParentheticalAcronym(msg);
    if (paren)
        return paren;
    const upper = msg.toUpperCase();
    let best = null;
    for (const code of MESSAGE_UNIVERSITY_ACRONYMS) {
        const re = new RegExp(`\\b${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (re.test(upper)) {
            if (!best || code.length > best.length)
                best = code;
        }
    }
    if (best)
        return best;
    const normalized = normalizeMatchText(msg);
    for (const nick of MESSAGE_UNIVERSITY_NICKNAMES) {
        const key = normalizeMatchText(nick);
        if (normalized.includes(key))
            return nick;
    }
    return null;
}
function asksMajorsInSchoolContext(msg) {
    return (containsText(msg, [
        'trong truong',
        'trong trường',
        'o truong',
        'ở trường',
        'cua truong',
        'của trường',
        'truong nay',
        'trường này',
        'truong do',
        'trường đó',
        'truong ay',
        'trường ấy',
    ]) &&
        containsText(msg, [
            'nganh',
            'ngành',
            'chuong trinh',
            'chương trình',
            'dao tao',
            'đào tạo',
        ]));
}
function asksUniversityOrPrograms(msg) {
    return asksUniversityPrograms(msg) || asksMajorsInSchoolContext(msg);
}
function asksUniversityPrograms(msg) {
    if (containsText(msg, [
        'chua biet hoc nganh',
        'chưa biết học ngành',
        'chua chon nganh',
        'chưa chọn ngành',
    ])) {
        return false;
    }
    return containsText(msg, [
        'chương trình',
        'chuong trinh',
        'ngành đào tạo',
        'nganh dao tao',
        'đào tạo những',
        'dao tao nhung',
        'đào tạo ngành',
        'dao tao nganh',
        'học những ngành',
        'hoc nhung nganh',
        'có những ngành',
        'co nhung nganh',
        'có ngành',
        'co nganh',
        'các ngành',
        'cac nganh',
        'những ngành',
        'nhung nganh',
        'liệt kê ngành',
        'liet ke nganh',
        'ngành gì',
        'nganh gi',
        'chương trình gì',
        'chuong trinh gi',
        'chương trình nào',
        'chuong trinh nao',
    ]);
}
function looksLikeCutoffScoreQuery(msg) {
    if (containsText(msg, [
        'điểm chuẩn',
        'diem chuan',
        'điểm đầu vào',
        'diem dau vao',
        'cutoff',
    ])) {
        return true;
    }
    if (containsText(msg, [
        'thang diem vao',
        'thang điểm vào',
        'diem vao',
        'điểm vào',
        'nguong diem',
        'ngưỡng điểm',
        'muc diem vao',
        'mức điểm vào',
        'muc diem dau vao',
        'mức điểm đầu vào',
        'diem san tuyen',
        'điểm sàn tuyển',
        'diem danh gia nang luc',
        'điểm đánh giá năng lực',
        'diem dgnl',
        'điểm dgnl',
    ])) {
        return true;
    }
    if (containsText(msg, [
        'bao nhieu diem',
        'bao nhiêu điểm',
        'lay bao nhieu diem',
        'lấy bao nhiêu điểm',
        'may diem',
        'mấy điểm',
    ]) &&
        containsText(msg, [
            'nganh',
            'ngành',
            'truong',
            'trường',
            'dai hoc',
            'đại học',
            'chuan',
            'chuẩn',
            'vao',
            'vào',
            'dau vao',
            'đầu vào',
        ])) {
        return true;
    }
    if (containsText(msg, [
        'lay bao nhieu',
        'lấy bao nhiêu',
        'nam truoc',
        'năm trước',
    ]) &&
        containsText(msg, [
            'nganh',
            'ngành',
            'truong',
            'trường',
            'nganh do',
            'ngành đó',
        ])) {
        return true;
    }
    if (containsText(msg, ['khoi', 'khối', 'to hop', 'tổ hợp']) &&
        containsText(msg, ['xet duoc', 'xét được', 'duoc khong', 'được không']) &&
        extractScoreFromMessage(msg) === null) {
        return true;
    }
    if (containsText(msg, ['nganh nay', 'ngành này']) &&
        containsText(msg, ['dieu kien', 'điều kiện']) &&
        containsText(msg, ['hoc ba', 'học bạ', 'xet hoc ba', 'xét học bạ'])) {
        return true;
    }
    return false;
}
const MAJOR_FIELD_CUES = [
    'ngành',
    'nganh',
    'chuyên ngành',
    'chuyen nganh',
    'major',
    'ngành học',
    'nganh hoc',
    'cntt',
    'marketing',
    'logistics',
    'luat',
    'luật',
    'tai chinh',
    'tài chính',
    'kien truc',
    'kiến trúc',
    'su pham',
    'sư phạm',
    'du lich',
    'du lịch',
    'dieu duong',
    'điều dưỡng',
    'duoc',
    'dược',
    'an toan',
    'an toàn',
    'tri tue nhan tao',
    'trí tuệ nhân tạo',
];
function asksWhichSchoolsTeachMajor(msg) {
    if (looksLikeOutOfScopeLocationQuery(msg)) {
        return false;
    }
    if (containsText(msg, [
        'cac truong',
        'các trường',
        'la truong nao',
        'là trường nào',
    ]) &&
        containsText(msg, ['co nganh', 'có ngành']) &&
        containsText(msg, [
            'ha noi',
            'hà nội',
            'o ha noi',
            'ở hà nội',
            'tai ha noi',
            'tại hà nội',
        ])) {
        return false;
    }
    function asksSchoolListForMajor(text) {
        return containsText(text, [
            'trường nào',
            'truong nao',
            'có trường nào',
            'co truong nao',
            'các trường nào',
            'cac truong nao',
            'những trường nào',
            'nhung truong nao',
            'những trường đại học nào',
            'nhung truong dai hoc nao',
            'các trường đại học nào',
            'cac truong dai hoc nao',
            'trường nào dạy',
            'truong nao day',
            'trường nào đào tạo',
            'truong nao dao tao',
            'trường nào có',
            'truong nao co',
            'học ở đâu',
            'hoc o dau',
            'học ở trường nào',
            'hoc o truong nao',
            'nên học ở đâu',
            'nen hoc o dau',
            'đào tạo ở',
            'dao tao o',
        ]);
    }
    if (containsText(msg, [
        'nhom nganh',
        'nhóm ngành',
        'gồm những ngành',
        'gom nhung nganh',
    ])) {
        return true;
    }
    if (containsText(msg, ['khoi', 'khối', 'to hop', 'tổ hợp']) &&
        containsText(msg, [
            'nganh nao',
            'ngành nào',
            'nhung nganh',
            'những ngành',
            'co the hoc',
            'có thể học',
        ]) &&
        (asksSchoolListForMajor(msg) ||
            /^(?:khoi|khối)\b/u.test(normalizeMatchText(msg)))) {
        return true;
    }
    if (containsText(msg, [' voi ', ' với ', ' va ', ' và ']) &&
        containsText(msg, [
            'hon',
            'hơn',
            'nen chon',
            'nên chọn',
            'phu hop hon',
            'phù hợp hơn',
            'so sanh',
            'so sánh',
            'hay hon',
            'hay hơn',
            'de chiu hon',
            'dễ chịu hơn',
        ])) {
        return false;
    }
    if (asksUniversityPrograms(msg) && !asksSchoolListForMajor(msg)) {
        return false;
    }
    if (containsText(msg, [
        'de hon',
        'dễ hơn',
        're hon',
        'rẻ hơn',
        'nen chon',
        'nên chọn',
    ]) &&
        containsText(msg, ['truong nao', 'trường nào', 'co truong', 'có trường']) &&
        !containsText(msg, ['dao tao', 'đào tạo', 'day', 'dạy'])) {
        return false;
    }
    const hasMajorCue = containsText(msg, MAJOR_FIELD_CUES);
    const asksSchoolList = asksSchoolListForMajor(msg);
    if (hasMajorCue && asksSchoolList)
        return true;
    if (containsText(msg, [
        'hoc nhung gi',
        'học những gì',
        'khac gi',
        'khác gì',
        'tim hieu nganh',
        'tìm hiểu ngành',
    ]) &&
        (hasMajorCue ||
            containsText(msg, [
                'cntt',
                'marketing',
                'luat',
                'luật',
                'an toan',
                'an toàn',
                'nganh',
                'ngành',
            ]))) {
        return true;
    }
    if (hasMajorCue &&
        containsText(msg, ['dạy', 'day', 'đào tạo', 'dao tao']) &&
        containsText(msg, ['trường nào', 'truong nao', 'ở đâu', 'o dau'])) {
        return true;
    }
    if (containsText(msg, ['trường nào', 'truong nao', 'có trường', 'co truong']) &&
        containsText(msg, ['ngành', 'nganh']) &&
        containsText(msg, ['có', 'co', 'dạy', 'day', 'đào tạo', 'dao tao'])) {
        return true;
    }
    return false;
}
function isShortFollowUp(msg) {
    const trimmed = msg.trim();
    if (trimmed.length > 48)
        return false;
    return containsText(trimmed, [
        'co chac',
        'có chắc',
        'chac khong',
        'chắc không',
        'chac khong a',
        'chắc không ạ',
        'that khong',
        'thật không',
        'dung khong',
        'đúng không',
        'co khong',
        'có không',
        'co du khong',
        'có đủ không',
        'du khong',
        'đủ không',
        'the a',
        'thế à',
        'the sao',
        'thế sao',
        'y nghia la sao',
        'ý nghĩa là sao',
        'giai thich them',
        'giải thích thêm',
        'noi ro hon',
        'nói rõ hơn',
        'con gi nua',
        'còn gì nữa',
    ]);
}
function resolveFollowUpIntent(intent, msg, session) {
    if (!session.last_intent)
        return intent;
    if (isShortFollowUp(msg) && intent === 'unknown') {
        return session.last_intent;
    }
    if (extractScoreFromMessage(msg) !== null &&
        containsText(msg, [
            'du vao',
            'đủ vào',
            'du khong',
            'đủ không',
            'vao duoc',
            'vào được',
        ])) {
        return 'recommendation_by_score';
    }
    if (session.last_intent === 'recommendation_by_score' &&
        containsText(msg, [
            'de hon',
            'dễ hơn',
            'an toan hon',
            'an toàn hơn',
            'co truong',
            'có trường',
        ]) &&
        containsText(msg, ['truong nao', 'trường nào', 'khong', 'không'])) {
        return 'recommendation_by_score';
    }
    if ((asksWhichSchoolsTeachMajor(msg) ||
        (containsText(msg, ['truong nao', 'trường nào']) &&
            containsText(msg, ['nganh nay', 'ngành này', 'nganh do', 'ngành đó']) &&
            containsText(msg, ['co', 'có']))) &&
        !containsText(msg, [
            'lay bao nhieu',
            'lấy bao nhiêu',
            'diem chuan',
            'điểm chuẩn',
        ])) {
        return 'search_major';
    }
    if ((session.last_intent === 'ask_admission_method' ||
        containsText(msg, ['xet theo', 'xét theo', 'xet tuyen', 'xét tuyển'])) &&
        containsText(msg, ['khoi', 'khối', 'to hop', 'tổ hợp']) &&
        containsText(msg, ['nganh do', 'ngành đó', 'nganh nay', 'ngành này'])) {
        return 'ask_admission_method';
    }
    if (containsText(msg, ['the con', 'thế còn', 'con nganh', 'còn ngành']) &&
        containsText(msg, ['thi sao', 'thì sao']) &&
        containsText(msg, ['nganh', 'ngành']) &&
        !containsText(msg, ['hoc phi', 'học phí'])) {
        return 'search_university';
    }
    if (session.last_intent === 'ask_cutoff_score' &&
        containsText(msg, [
            'thế còn',
            'the con',
            'còn năm',
            'con nam',
            'năm 20',
            'nam 20',
        ])) {
        return 'ask_cutoff_score';
    }
    if (containsText(msg, [
        'con truong',
        'còn trường',
        'dao tao nua',
        'đào tạo nữa',
        'truong nao nua',
        'trường nào nữa',
    ]) &&
        (session.last_intent === 'search_major' ||
            session.last_major != null ||
            containsText(msg, ['dao tao', 'đào tạo']))) {
        return 'search_major';
    }
    if (session.last_intent === 'ask_location' &&
        containsText(msg, [
            'còn trường',
            'con truong',
            'còn ở',
            'con o',
            'khu vực',
            'khu vuc',
            'nữa không',
            'nua khong',
            'còn trường tư',
            'con truong tu',
        ]) &&
        !containsText(msg, ['dao tao', 'đào tạo'])) {
        return 'ask_location';
    }
    if (session.last_intent === 'recommendation_by_score' &&
        containsText(msg, [
            'thế nếu',
            'the neu',
            'thế sao',
            'the sao',
            'muốn học',
            'muon hoc',
            'còn ngành',
            'con nganh',
            'còn trường',
            'con truong',
            'khong du',
            'không đủ',
            'de hon',
            'dễ hơn',
            'ưu tiên',
            'uu tien',
            'dễ đỗ',
            'de do',
            'an toàn hơn',
            'an toan hon',
            'với điểm đó',
            'voi diem do',
            'chọn trường',
            'chon truong',
            'hoc phi thap',
            'học phí thấp',
        ]) &&
        (intent === 'unknown' ||
            intent === 'search_major' ||
            intent === 'search_university' ||
            intent === 'ask_location' ||
            intent === 'compare_universities')) {
        return 'recommendation_by_score';
    }
    if (session.last_intent === 'ask_tuition_fee' &&
        containsText(msg, [
            'thế còn',
            'the con',
            'còn năm',
            'con nam',
            'học phí',
            'hoc phi',
        ])) {
        return 'ask_tuition_fee';
    }
    if (session.last_intent === 'compare_universities' &&
        looksLikeCompareTuitionFollowUp(msg, session)) {
        return 'compare_universities';
    }
    if ((session.last_intent === 'compare_universities' ||
        (session.last_intent === 'ask_tuition_fee' &&
            containsText(msg, ['re hon', 'rẻ hơn', 'tot hon', 'tốt hơn']))) &&
        (containsText(msg, [
            'thế còn',
            'the con',
            'còn so',
            'con so',
            'còn học phí',
            'con hoc phi',
            'dễ đỗ',
            'de do',
            'cái nào',
            'cai nao',
            're hon',
            'rẻ hơn',
            'uy tin hon',
            'uy tín hơn',
            'cao hon',
            'cao hơn',
            'truong nao',
            'trường nào',
        ]) ||
            (containsText(msg, ['re hon', 'rẻ hơn', 'tot hon', 'tốt hơn']) &&
                msg.trim().length <= 32))) {
        return 'compare_universities';
    }
    if (session.last_intent === 'ask_admission_method' &&
        containsText(msg, [
            'the con',
            'thế còn',
            'hoc ba',
            'học bạ',
            'dgnl',
            'phuong thuc',
            'phương thức',
            'pt nay',
            'pt này',
            'ap dung',
            'áp dụng',
            'dieu kien',
            'điều kiện',
            'diem trung binh',
            'điểm trung bình',
            'thi mon',
            'thi môn',
            'nam 202',
        ]) &&
        !(containsText(msg, ['nganh nay', 'ngành này', 'nganh do', 'ngành đó']) &&
            containsText(msg, ['dieu kien', 'điều kiện', 'xet duoc', 'xét được']))) {
        return 'ask_admission_method';
    }
    if (session.last_intent === 'ask_scholarship' &&
        containsText(msg, [
            'du dieu kien',
            'đủ điều kiện',
            'giay to',
            'giấy tờ',
            'mien giam',
            'miễn giảm',
            'hoc phi',
            'học phí',
            'xin',
            'chuan bi',
            'chuẩn bị',
            'de xin',
            'để xin',
        ])) {
        return 'ask_scholarship';
    }
    if (isShortFollowUp(msg) &&
        session.last_intent === 'ask_scholarship' &&
        containsText(msg, [
            'xin',
            'duoc khong',
            'được không',
            'co khong',
            'có không',
        ])) {
        return 'ask_scholarship';
    }
    if (session.last_intent === 'ask_career' &&
        containsText(msg, [
            'luong',
            'lương',
            'thu nhap',
            'thu nhập',
            'khoang bao nhieu',
            'khoảng bao nhiêu',
        ])) {
        return 'ask_career';
    }
    if (session.last_intent === 'ask_facilities' &&
        containsText(msg, [
            'truong do',
            'trường đó',
            'truong nay',
            'trường này',
            'co khong',
            'có không',
            'ho tro',
            'hỗ trợ',
            'thue phong',
            'thuê phòng',
        ])) {
        return 'ask_facilities';
    }
    if (session.last_intent === 'search_university' &&
        containsText(msg, ['truong do', 'trường đó', 'truong nay', 'trường này']) &&
        containsText(msg, [
            'quan',
            'quận',
            'khu vuc',
            'khu vực',
            'dia chi',
            'địa chỉ',
            'o dau',
            'ở đâu',
            'nam o',
            'nằm ở',
        ])) {
        return 'search_university';
    }
    if (session.last_intent === 'search_university' &&
        containsText(msg, [
            'thong tin',
            'thông tin',
            'xem thong tin',
            'xem thông tin',
            'cho em xem',
            'ky tuc xa',
            'ký túc xá',
            'ktx',
            'co so vat chat',
            'cơ sở vật chất',
        ]) &&
        containsText(msg, [
            'truong do',
            'trường đó',
            'truong nay',
            'trường này',
            'co khong',
            'có không',
        ])) {
        return 'search_university';
    }
    if (session.last_intent === 'search_university' &&
        containsText(msg, ['the con', 'thế còn', 'con nganh', 'còn ngành']) &&
        containsText(msg, ['nganh', 'ngành', 'thi sao', 'thì sao'])) {
        return 'search_university';
    }
    if ((session.last_intent === 'ask_tuition_fee' ||
        session.last_intent === 'search_university' ||
        session.last_intent === 'search_major' ||
        session.last_intent === 'compare_universities') &&
        containsText(msg, ['hoc phi', 'học phí']) &&
        (containsText(msg, [
            'truong do',
            'trường đó',
            'truong nay',
            'trường này',
            'nganh',
            'ngành',
            'cntt',
            'the nao',
            'thế nào',
            'the con',
            'thế còn',
            'thi sao',
            'thì sao',
            'bao nhieu',
            'bao nhiêu',
        ]) ||
            session.last_intent === 'ask_tuition_fee')) {
        return 'ask_tuition_fee';
    }
    if ((session.last_intent === 'ask_cutoff_score' ||
        session.last_intent === 'search_major' ||
        session.last_major != null) &&
        containsText(msg, [
            'còn năm',
            'con nam',
            'năm trước',
            'nam truoc',
            'lay bao nhieu',
            'lấy bao nhiêu',
            'bao nhieu diem',
            'bao nhiêu điểm',
            'học bạ',
            'hoc ba',
            'phương thức',
            'phuong thuc',
            'điểm 20',
            'diem 20',
            'khối',
            'khoi',
            'xét được',
            'xet duoc',
            'điều kiện',
            'dieu kien',
            'nganh do',
            'ngành đó',
            'nganh nay',
            'ngành này',
        ]) &&
        (intent === 'unknown' ||
            intent === 'ask_admission_method' ||
            intent === 'recommendation_by_score' ||
            intent === 'search_major') &&
        !(session.last_intent === 'recommendation_by_score' &&
            containsText(msg, ['du vao', 'đủ vào', 'du khong', 'đủ không']) &&
            extractScoreFromMessage(msg) !== null)) {
        return 'ask_cutoff_score';
    }
    if (session.last_intent === 'search_university' &&
        containsText(msg, [
            'danh sach nganh',
            'danh sách ngành',
            'con nganh',
            'còn ngành',
            'chuong trinh',
            'chương trình',
        ])) {
        return 'search_university';
    }
    if (session.last_intent === 'search_major' &&
        containsText(msg, [
            'con truong',
            'còn trường',
            'truong nao nua',
            'trường nào nữa',
            'con truong nao',
            'còn trường nào',
        ])) {
        return 'search_major';
    }
    return intent;
}
function looksLikeScoreRecommendation(msg) {
    if (looksLikeCutoffScoreQuery(msg)) {
        return false;
    }
    if (containsText(msg, ['khoi', 'khối', 'to hop', 'tổ hợp']) &&
        containsText(msg, ['xet duoc', 'xét được']) &&
        extractScoreFromMessage(msg) === null) {
        return false;
    }
    const hasNumericScore = extractScoreFromMessage(msg) !== null;
    const hasScorePhrase = /(?:được|đạt|em|mình|tôi|cho em).{0,40}\d+(?:[.,]\d+)?\s*điểm/i.test(msg) ||
        /\d+(?:[.,]\d+)?\s*điểm/i.test(msg);
    const wantsAdvice = containsText(msg, [
        'nên chọn',
        'nen chon',
        'nên học',
        'nen hoc',
        'nên đăng ký',
        'nen dang ky',
        'gợi ý',
        'goi y',
        'tư vấn',
        'tu van',
        'xét được',
        'xet duoc',
        'đủ điều kiện',
        'du dieu kien',
        'học trường nào',
        'hoc truong nao',
        'chọn trường',
        'chon truong',
        'phù hợp',
        'phu hop',
        'muốn học',
        'muon hoc',
        'thích ngành',
        'thich nganh',
        'đậu được',
        'dau duoc',
        'trúng tuyển',
        'trung tuyen',
        'cơ hội',
        'co hoi',
        'muốn tìm',
        'muon tim',
        'muốn vào',
        'muon vao',
        'có đủ',
        'co du',
        'đủ vào',
        'du vao',
        'đủ không',
        'du khong',
        'co truong nao',
        'có trường nào',
        'nhan khong',
        'nhận không',
        'vao duoc',
        'vào được',
        'truong cong lap',
        'trường công lập',
        'de hon',
        'dễ hơn',
        'khong du hust',
        'không đủ hust',
        'con truong nao',
        'còn trường nào',
    ]);
    if ((hasNumericScore || hasScorePhrase) &&
        containsText(msg, [
            'co truong',
            'có trường',
            'truong nao',
            'trường nào',
            'truong cong lap',
            'trường công lập',
        ])) {
        return true;
    }
    return (hasNumericScore || hasScorePhrase) && wantsAdvice;
}
function looksLikeAdmissionMethod(msg) {
    if (extractScoreFromMessage(msg) !== null &&
        containsText(msg, [
            'nen dang ky',
            'nên đăng ký',
            'nen chon',
            'nên chọn',
            'goi y',
            'gợi ý',
            'tu van',
            'tư vấn',
        ])) {
        return false;
    }
    if (looksLikeCutoffScoreQuery(msg)) {
        return false;
    }
    return containsText(msg, [
        'danh gia nang luc',
        'đánh giá năng lực',
        'xet ket hop',
        'xét kết hợp',
        'tuyen sinh',
        'tuyển sinh',
        'pt gi',
        'pt gì',
        'bang phuong thuc',
        'bằng phương thức',
        'xet theo',
        'xét theo',
        'thpt hay hoc ba',
        'thpt hay học bạ',
        'phương thức xét tuyển',
        'phuong thuc xet tuyen',
        'pt xét tuyển',
        'pt xet tuyen',
        'xét tuyển bằng',
        'xet tuyen bang',
        'xét tuyển theo',
        'xet tuyen theo',
        'tuyển sinh theo',
        'tuyen sinh theo',
        'xét tuyển thẳng',
        'xet tuyen thang',
        'xét thẳng',
        'xet thang',
        'hình thức xét tuyển',
        'hinh thuc xet tuyen',
        'nộp hồ sơ',
        'nop ho so',
        'dgnl là gì',
        'dgnl la gi',
        'học bạ khác gì',
        'hoc ba khac gi',
        'có xét học bạ',
        'co xet hoc ba',
        'có xét dgnl',
        'co xet dgnl',
        'xét học bạ',
        'xet hoc ba',
        'xét dgnl',
        'xet dgnl',
        'xét thpt',
        'xet thpt',
        'phương thức nào',
        'phuong thuc nao',
        'hình thức nào',
        'hinh thuc nao',
        'xet tuyen ket hop',
        'xét tuyển kết hợp',
        'xet ket hop',
        'xét kết hợp',
        'dgnl thi',
        'dgnl thì',
        'pt nay',
        'pt này',
        'phuong thuc do',
        'phương thức đó',
        'phuong thuc nay',
        'phương thức này',
        'hoc ba can',
        'học bạ cần',
        'ap dung cho nganh',
        'áp dụng cho ngành',
        'ap dung nam',
        'áp dụng năm',
    ]);
}
function containsBoundedPhrase(text, phrase) {
    const normalized = normalizeMatchText(text);
    const p = normalizeMatchText(phrase);
    const escaped = p
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\s+/g, '\\s+');
    return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$|[!?.,])`, 'u').test(normalized);
}
function looksLikeFacilitiesQuery(msg) {
    const bounded = ['noi tru', 'nội trú', 'ky tuc xa', 'ký túc xá'];
    if (bounded.some((p) => containsBoundedPhrase(msg, p))) {
        return true;
    }
    return containsText(msg, [
        'ktx',
        'co so vat chat',
        'cơ sở vật chất',
        'phong lab',
        'phòng lab',
        'thu vien',
        'thư viện',
        'campus',
        'benh vien thuc hanh',
        'bệnh viện thực hành',
        'san the thao',
        'sân thể thao',
        'ho boi',
        'hồ bơi',
        'cang tin',
        'căng tin',
        'xe buyt',
        'xe buýt',
        'co so chinh',
        'cơ sở chính',
        'phong hoc',
        'phòng học',
        'may chieu',
        'máy chiếu',
        'wifi',
        'ho tro tim nha',
        'hỗ trợ tìm nhà',
        'thue phong',
        'thuê phòng',
    ]);
}
function looksLikeTuitionBillingQuery(msg) {
    return (containsText(msg, ['hoc phi', 'học phí', 'tinh hoc phi', 'tính học phí']) &&
        containsText(msg, [
            'theo nam',
            'theo năm',
            'theo tin chi',
            'theo tín chỉ',
            'tin chi hay',
            'tín chỉ hay',
        ]));
}
function looksLikeOutOfScopeLocationQuery(msg) {
    const outOfScope = containsText(msg, [
        'tp.hcm',
        'tp hcm',
        'tphcm',
        'sai gon',
        'sài gòn',
        'saigon',
        'ho chi minh',
        'hồ chí minh',
        'da nang',
        'đà nẵng',
        'can tho',
        'cần thơ',
        'hue',
        'huế',
        'nha trang',
        'nuoc ngoai',
        'nước ngoài',
        'du hoc',
        'du học',
        'hai phong',
        'hải phòng',
        'vung tau',
        'vũng tàu',
        'binh duong',
        'bình dương',
        'dong nai',
        'đồng nai',
    ]);
    if (!outOfScope)
        return false;
    return containsText(msg, [
        'truong',
        'trường',
        'dai hoc',
        'đại học',
        'hoc ',
        'học ',
        'tim truong',
        'tìm trường',
        'nganh',
        'ngành',
        'phu hop',
        'phù hợp',
        'nen chon',
        'nên chọn',
        'tot',
        'tốt',
        'manh',
        'mạnh',
    ]);
}
function looksLikeLocationListQuery(msg) {
    if (looksLikeOutOfScopeLocationQuery(msg))
        return false;
    if (looksLikeFacilitiesQuery(msg)) {
        return false;
    }
    if (containsText(msg, ['hoc phi', 'học phí']) &&
        !containsText(msg, [
            'hoc phi thap',
            'học phí thấp',
            'truong tu nao',
            'trường tư nào',
            'truong nao hoc phi',
            'trường nào học phí',
        ])) {
        return false;
    }
    if (containsText(msg, [
        'cua truong',
        'của trường',
        'thong tin ve',
        'thông tin về',
        'gioi thieu',
        'giới thiệu',
        'cho em thong tin',
        'cho em xem thong tin',
        'xem thong tin',
    ])) {
        return false;
    }
    if (containsText(msg, [
        'bao nhieu',
        'bao nhiêu',
        'khoang bao nhieu',
        'khoảng bao nhiêu',
    ]) &&
        !containsText(msg, [
            'truong',
            'trường',
            'dai hoc',
            'đại học',
            'truong cong lap',
            'trường công lập',
            'truong tu',
            'trường tư',
        ])) {
        return false;
    }
    if (containsText(msg, [
        'cac truong',
        'các trường',
        'la truong nao',
        'là trường nào',
    ]) &&
        containsText(msg, [
            'ha noi',
            'hà nội',
            'o ha noi',
            'ở hà nội',
            'tai ha noi',
            'tại hà nội',
        ]) &&
        containsText(msg, ['co nganh', 'có ngành']) &&
        !asksUniversityOrPrograms(msg)) {
        return true;
    }
    const hasLocation = containsText(msg, [
        'ha noi',
        'hà nội',
        'thu do',
        'thủ đô',
        'mien bac',
        'miền bắc',
        'quận',
        'quan',
        'khu vực',
        'khu vuc',
        'noi bai',
        'nội bài',
        'cầu giấy',
        'cau giay',
    ]);
    const hasSchool = containsText(msg, [
        'truong',
        'trường',
        'dai hoc',
        'đại học',
    ]);
    const listCue = containsText(msg, [
        'danh sach',
        'danh sách',
        'liet ke',
        'liệt kê',
        'gom nhung',
        'gồm những',
        'co nhung truong',
        'có những trường',
        'nhung truong nao',
        'những trường nào',
        'truong nao o',
        'trường nào ở',
        'bao nhieu truong',
        'bao nhiêu trường',
        'co bao nhieu truong',
        'có bao nhiêu trường',
        'tim truong',
        'tìm trường',
        'truong cong lap',
        'trường công lập',
        'truong tu',
        'trường tư',
        'theo quan',
        'theo quận',
        'thuoc bo',
        'thuộc bộ',
        'gan san bay',
        'gần sân bay',
        'hoc phi thap',
        'học phí thấp',
        'gan nha',
        'gần nhà',
        'chua biet hoc nganh',
        'chưa biết học ngành',
        'o ha noi co',
        'ở hà nội có',
        'tai ha noi',
        'tại hà nội',
        'co nganh',
        'có ngành',
        'la truong nao',
        'là trường nào',
    ]);
    if (asksUniversityOrPrograms(msg) &&
        containsText(msg, [
            'nhung nganh',
            'những ngành',
            'nganh nao',
            'ngành nào',
            'co nganh',
            'có ngành',
        ]) &&
        !containsText(msg, ['la truong nao', 'là trường nào'])) {
        return false;
    }
    if (asksWhichSchoolsTeachMajor(msg))
        return false;
    if (extractScoreFromMessage(msg) !== null &&
        containsText(msg, ['diem', 'điểm', 'duoc', 'được', 'em ', 'mình ', 'con '])) {
        return false;
    }
    if (!hasSchool && !listCue)
        return false;
    if (asksUniversityOrPrograms(msg) && !listCue)
        return false;
    if (asksUniversityHasMajor(msg))
        return false;
    return (listCue ||
        (hasLocation &&
            hasSchool &&
            containsText(msg, [
                'co nhung',
                'có những',
                'nhung truong',
                'những trường',
                'cac truong',
                'các trường',
                'truong dai hoc',
                'trường đại học',
                'o ha noi',
                'ở hà nội',
                'tai ha noi',
                'tại hà nội',
            ])));
}
function asksUniversityHasMajor(msg) {
    if (containsText(msg, [
        'cac truong',
        'các trường',
        'la truong nao',
        'là trường nào',
    ]) &&
        containsText(msg, [
            'ha noi',
            'hà nội',
            'o ha noi',
            'ở hà nội',
            'tai ha noi',
            'tại hà nội',
        ]) &&
        containsText(msg, ['co nganh', 'có ngành'])) {
        return false;
    }
    const hasProgramCue = containsText(msg, [
        'co dao tao',
        'có đào tạo',
        'co nganh',
        'có ngành',
        'co chuong trinh',
        'có chương trình',
        'dao tao nganh',
        'đào tạo ngành',
    ]);
    const asksYesNo = containsText(msg, ['khong', 'không', '?']);
    return hasProgramCue && asksYesNo;
}
function looksLikeGreeting(msg) {
    if (containsText(msg, [
        'xin chao',
        'xin chào',
        'hello',
        'chao bot',
        'chào bot',
        'chao ban',
        'chào bạn',
        'moi vao app',
        'mới vào app',
    ])) {
        return true;
    }
    if (/^(?:chào|chao)\b/u.test(msg.trim()))
        return true;
    return containsText(msg, ['bot oi', 'bot ơi', 'giup em voi', 'giúp em với']);
}
function looksLikeHelpQuery(msg) {
    return containsText(msg, [
        'cach dung',
        'cách dùng',
        'dung app',
        'dùng app',
        'chatbot',
        'lam sao de',
        'làm sao để',
        'phai hoi nhu nao',
        'phải hỏi như nào',
        'can hoi gi',
        'cần hỏi gì',
        'muon biet cach',
        'muốn biết cách',
        'huong dan',
        'hướng dẫn',
        'lam gi duoc',
        'làm gì được',
        'tu van chon nganh',
        'tư vấn chọn ngành',
        'goi y truong theo diem',
        'gợi ý trường theo điểm',
        'du lieu tu dau',
        'dữ liệu từ đâu',
        'pham vi',
        'phạm vi',
        'chi ho tro',
        'chỉ hỗ trợ',
        'ngoai ha noi',
        'ngoài hà nội',
        'app nay lam gi',
        'app này làm gì',
        'he thong lam gi',
        'hệ thống làm gì',
        'lay tu dau',
        'lấy từ đâu',
        'du lieu tren app',
        'dữ liệu trên app',
        'chi tra cuu',
        'chỉ tra cứu',
        'tra cuu duoc',
        'tra cứu được',
    ]);
}
function looksLikeCompareUniversities(msg) {
    if (looksLikeTuitionBillingQuery(msg)) {
        return false;
    }
    if (looksLikeCareerQuery(msg) &&
        containsText(msg, ['truong nao', 'trường nào', 'co dao tao', 'có đào tạo'])) {
        return false;
    }
    if (containsText(msg, [
        'hoc gi',
        'học gì',
        'hoc nhung gi',
        'học những gì',
        'la gi',
        'là gì',
        'nghe nghiep',
        'nghề nghiệp',
    ])) {
        return false;
    }
    if (containsText(msg, [
        'truong nao',
        'trường nào',
        'co dao tao',
        'có đào tạo',
    ]) &&
        containsText(msg, ['nganh', 'ngành', 'dao tao', 'đào tạo']) &&
        !containsText(msg, [
            ' voi ',
            ' với ',
            ' va ',
            ' và ',
            ' hay ',
            'so sanh',
            'so sánh',
            'nen chon',
            'nên chọn',
            'phu hop hon',
            'phù hợp hơn',
        ])) {
        return false;
    }
    if (containsText(msg, [
        're hon',
        'rẻ hơn',
        'tot hon',
        'tốt hơn',
        'phu hop hon',
        'phù hợp hơn',
        'de hon',
        'dễ hơn',
        'hay hon',
        'hay hơn',
        'manh hon',
        'mạnh hơn',
    ]) &&
        containsText(msg, ['truong nao', 'trường nào', 'nen chon', 'nên chọn'])) {
        return true;
    }
    if (extractScoreFromMessage(msg) !== null &&
        containsText(msg, [
            'nen chon',
            'nên chọn',
            'nen hoc',
            'nên học',
            'nen dang ky',
            'nên đăng ký',
            'phân vân',
            'phan van',
        ])) {
        return false;
    }
    if (containsText(msg, ['hoc phi', 'học phí', 'diem chuan', 'điểm chuẩn']) &&
        containsText(msg, [
            ' voi ',
            ' với ',
            ' hay ',
            'so sanh',
            'so sánh',
            'khac nhau',
            'khác nhau',
            're hon',
            'rẻ hơn',
            'thap hon',
            'thấp hơn',
            'tot hon',
            'tốt hơn',
        ])) {
        return true;
    }
    if (containsText(msg, [
        'so sanh',
        'so sánh',
        'khac nhau',
        'khác nhau',
        'tot hon',
        'tốt hơn',
        'hay hon',
        'hay hơn',
        'manh hon',
        'mạnh hơn',
        'de chiu hon',
        'dễ chịu hơn',
    ])) {
        return true;
    }
    const hasVersus = containsText(msg, [
        ' voi ',
        ' với ',
        ' va ',
        ' và ',
        ' hay ',
    ]);
    const hasChoose = containsText(msg, [
        'nen chon',
        'nên chọn',
        'phu hop hon',
        'phù hợp hơn',
        'hop hon',
        'hợp hơn',
        'manh ve',
        'mạnh về',
        'truong nao',
        'trường nào',
        'nen hoc',
        'nên học',
    ]);
    return hasVersus && hasChoose;
}
function looksLikeUnknownFullScholarshipQuery(msg) {
    return (containsText(msg, ['hoc bong', 'học bổng']) &&
        containsText(msg, ['toan phan', 'toàn phần']) &&
        containsText(msg, [' co ', 'có ', 'khong', 'không']));
}
function looksLikeScholarshipQuery(msg) {
    const lower = msg.toLowerCase();
    if (looksLikeUnknownFullScholarshipQuery(lower)) {
        return false;
    }
    if (containsText(lower, ['hoc bong', 'học bổng', 'mien giam', 'miễn giảm']) &&
        containsText(lower, ['khac nhau', 'khác nhau'])) {
        return true;
    }
    if (containsText(lower, ['hoc bong', 'học bổng']) &&
        containsText(lower, ['toan phan', 'toàn phần']) &&
        containsText(lower, [' co ', 'có ', 'khong', 'không'])) {
        return false;
    }
    return containsText(lower, [
        'hoc bong',
        'học bổng',
        'hoc bổng',
        'miễn giảm',
        'mien giam',
        'tài trợ',
        'tai tro',
        'hỗ trợ tài chính',
        'ho tro tai chinh',
        'vay vốn sinh viên',
        'vay von sinh vien',
        'xin học bổng',
        'xin hoc bong',
        'nop ho so hoc bong',
        'nộp hồ sơ học bổng',
    ]);
}
function looksLikeCareerQuery(msg) {
    return containsText(msg, [
        'viec lam',
        'việc làm',
        'nghe nghiep',
        'nghề nghiệp',
        'lam nghe gi',
        'làm nghề gì',
        'lam vi tri',
        'làm vị trí',
        'sau nay',
        'sau này',
        'ra truong',
        'ra trường',
        'xin viec',
        'xin việc',
        'de xin viec',
        'dễ xin việc',
        'co the lam',
        'có thể làm',
        'lam trong doanh nghiep',
        'làm trong doanh nghiệp',
    ]);
}
function ruleBasedClassify(msg) {
    const lower = msg.toLowerCase();
    if (looksLikeGreeting(lower)) {
        return 'greeting';
    }
    if (looksLikeHelpQuery(lower)) {
        return 'help';
    }
    if (looksLikeOutOfScopeLocationQuery(lower)) {
        return 'unknown';
    }
    if (looksLikeUnknownFullScholarshipQuery(lower)) {
        return 'unknown';
    }
    if (looksLikeScholarshipQuery(lower)) {
        return 'ask_scholarship';
    }
    if (looksLikeTuitionBillingQuery(lower)) {
        return 'ask_tuition_fee';
    }
    if (looksLikeCompareUniversities(lower) ||
        (containsText(lower, [
            'cai nao',
            'cái nào',
            'cao hon',
            'cao hơn',
            're hon',
            'rẻ hơn',
        ]) &&
            containsText(lower, [' voi ', ' với ', ' va ', ' và ', ' hay ']))) {
        return 'compare_universities';
    }
    if (looksLikeCutoffScoreQuery(lower)) {
        return 'ask_cutoff_score';
    }
    if (looksLikeAdmissionMethod(lower)) {
        return 'ask_admission_method';
    }
    if (looksLikeScoreRecommendation(lower)) {
        return 'recommendation_by_score';
    }
    if (looksLikeLocationListQuery(lower)) {
        return 'ask_location';
    }
    if (asksWhichSchoolsTeachMajor(lower)) {
        return 'search_major';
    }
    if (looksLikeFacilitiesQuery(lower)) {
        return 'ask_facilities';
    }
    if (asksUniversityHasMajor(lower)) {
        return 'search_university';
    }
    if (asksUniversityOrPrograms(lower)) {
        return 'search_university';
    }
    if (containsText(lower, [
        'the con',
        'thế còn',
        'con nganh',
        'còn ngành',
        'con chuong trinh',
        'còn chương trình',
    ]) &&
        containsText(lower, ['nganh', 'ngành', 'chuong trinh', 'chương trình'])) {
        return 'search_university';
    }
    if (looksLikeCareerQuery(lower)) {
        return 'ask_career';
    }
    if (containsText(lower, ['học phí', 'hoc phi', 'tiền học', 'chi phí', 'fees'])) {
        return 'ask_tuition_fee';
    }
    if (containsText(lower, [
        'thong tin',
        'thông tin',
        'gioi thieu',
        'giới thiệu',
        've truong',
        'về trường',
        'xem thong tin',
        'xem thông tin',
        'cho em xem',
    ]) &&
        containsText(lower, [
            'truong',
            'đại học',
            'dai hoc',
            'hoc vien',
            'học viện',
        ])) {
        return 'search_university';
    }
    if (containsText(lower, ['trường', 'truong', 'đại học', 'dai hoc']) &&
        !asksWhichSchoolsTeachMajor(lower) &&
        !looksLikeLocationListQuery(lower)) {
        return 'search_university';
    }
    if (containsText(lower, [
        'hà nội',
        'ha noi',
        'thu do',
        'thủ đô',
        'miền bắc',
        'mien bac',
        'ở đâu',
        'o dau',
    ]) &&
        containsText(lower, ['trường', 'truong', 'đại học', 'dai hoc']) &&
        !looksLikeOutOfScopeLocationQuery(lower)) {
        return 'ask_location';
    }
    if (containsText(lower, ['ngành', 'nganh', 'chuyên ngành', 'major'])) {
        return 'search_major';
    }
    if (containsText(lower, [
        'điểm',
        'diem',
        'điểm số',
        'bao nhiêu điểm',
        'khối a',
        'khoi a',
    ])) {
        return 'recommendation_by_score';
    }
    if (containsText(lower, ['giúp', 'hỗ trợ', 'làm gì', 'có thể'])) {
        return 'help';
    }
    return 'unknown';
}
function correctRuleIntent(intent, msg) {
    const lower = msg.toLowerCase();
    if (looksLikeOutOfScopeLocationQuery(lower)) {
        return 'unknown';
    }
    if (looksLikeHelpQuery(lower)) {
        return 'help';
    }
    if (looksLikeGreeting(lower) &&
        (intent === 'help' ||
            intent === 'ask_admission_method' ||
            intent === 'unknown')) {
        return 'greeting';
    }
    if (looksLikeLocationListQuery(lower)) {
        if (intent === 'search_university' ||
            intent === 'search_major' ||
            intent === 'ask_facilities' ||
            intent === 'unknown') {
            return 'ask_location';
        }
        return intent;
    }
    if (looksLikeUnknownFullScholarshipQuery(lower)) {
        return 'unknown';
    }
    if (looksLikeScholarshipQuery(lower)) {
        if (intent === 'ask_tuition_fee' ||
            intent === 'ask_admission_method' ||
            intent === 'search_university' ||
            intent === 'unknown') {
            return 'ask_scholarship';
        }
        return intent;
    }
    if (asksWhichSchoolsTeachMajor(lower)) {
        if (intent === 'search_university' ||
            intent === 'ask_location' ||
            intent === 'compare_universities' ||
            intent === 'ask_career' ||
            intent === 'unknown') {
            return 'search_major';
        }
        return intent;
    }
    if (looksLikeCutoffScoreQuery(lower)) {
        if (intent === 'search_major' ||
            intent === 'search_university' ||
            intent === 'recommendation_by_score') {
            return 'ask_cutoff_score';
        }
        return intent;
    }
    if (asksUniversityHasMajor(lower)) {
        if (intent === 'search_major' ||
            intent === 'ask_location' ||
            intent === 'unknown') {
            return 'search_university';
        }
        return intent;
    }
    if (asksUniversityOrPrograms(lower)) {
        if (looksLikeLocationListQuery(lower)) {
            return 'ask_location';
        }
        if (intent === 'search_major' ||
            intent === 'ask_location' ||
            intent === 'ask_tuition_fee' ||
            intent === 'unknown') {
            return 'search_university';
        }
        return intent;
    }
    if (looksLikeTuitionBillingQuery(lower)) {
        if (intent === 'compare_universities' ||
            intent === 'search_university' ||
            intent === 'unknown') {
            return 'ask_tuition_fee';
        }
        return intent;
    }
    if (looksLikeCompareUniversities(lower)) {
        if (intent === 'search_university' ||
            intent === 'search_major' ||
            intent === 'recommendation_by_score' ||
            intent === 'unknown') {
            return 'compare_universities';
        }
        return intent;
    }
    if (looksLikeCareerQuery(lower)) {
        if (intent === 'search_major' ||
            intent === 'search_university' ||
            intent === 'unknown') {
            return 'ask_career';
        }
        return intent;
    }
    if (looksLikeHelpQuery(lower)) {
        if (intent === 'ask_cutoff_score' ||
            intent === 'search_university' ||
            intent === 'search_major' ||
            intent === 'unknown') {
            return 'help';
        }
        return intent;
    }
    if (looksLikeGreeting(lower) && intent === 'unknown') {
        return 'greeting';
    }
    if (looksLikeOutOfScopeLocationQuery(lower)) {
        return 'unknown';
    }
    if (!looksLikeScoreRecommendation(lower))
        return intent;
    if (intent === 'search_major' ||
        intent === 'search_university' ||
        intent === 'unknown') {
        return 'recommendation_by_score';
    }
    return intent;
}
function looksLikeCompareTuitionFollowUp(msg, session) {
    const compared = session.last_compared_universities;
    if (!compared || compared.length < 2)
        return false;
    if (!containsText(msg, [
        'hoc phi',
        'học phí',
        'chi phi',
        'chi phí',
        'tien hoc',
        'tiền học',
    ])) {
        return false;
    }
    if (session.last_intent === 'compare_universities')
        return true;
    return containsText(msg, [
        're hon',
        'rẻ hơn',
        'chenh lech',
        'chênh lệch',
        'truong nao',
        'trường nào',
        'hai truong',
        'hai trường',
        'truong do',
        'trường đó',
        'the nao',
        'thế nào',
        'con hoc phi',
        'còn học phí',
        'thi sao',
        'thì sao',
        'bao nhieu',
        'bao nhiêu',
    ]);
}
function classifyIntentRuleOnly(msg, session = null) {
    const normalized = msg.toLowerCase().trim();
    if (session && looksLikeCompareTuitionFollowUp(normalized, session)) {
        return 'compare_universities';
    }
    const base = correctRuleIntent(ruleBasedClassify(normalized), normalized);
    if (!session)
        return base;
    return resolveFollowUpIntent(base, normalized, session);
}
//# sourceMappingURL=chatbot-intent-rules.js.map