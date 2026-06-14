"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandInterestPhrases = expandInterestPhrases;
const INTEREST_SYNONYM_MAP = {
    'lap trinh': [
        'công nghệ thông tin',
        'cntt',
        'an toàn thông tin',
        'khoa học máy tính',
    ],
    'lap trinh may tinh': ['công nghệ thông tin'],
    'cong nghe thong tin': ['công nghệ thông tin'],
    cntt: ['công nghệ thông tin'],
    it: ['công nghệ thông tin'],
    'phan mem': ['công nghệ thông tin'],
    'phần mềm': ['công nghệ thông tin'],
    ai: ['trí tuệ nhân tạo', 'công nghệ thông tin'],
    'tri tue nhan tao': ['trí tuệ nhân tạo'],
    'trí tuệ nhân tạo': ['trí tuệ nhân tạo'],
    'machine learning': ['trí tuệ nhân tạo', 'khoa học dữ liệu'],
    data: ['khoa học dữ liệu'],
    'du lieu': ['khoa học dữ liệu'],
    'dữ liệu': ['khoa học dữ liệu'],
    'kinh doanh': ['quản trị kinh doanh', 'marketing'],
    marketing: ['marketing'],
    'tai chinh': ['tài chính ngân hàng', 'kế toán'],
    'tài chính': ['tài chính ngân hàng', 'kế toán'],
    'ke toan': ['kế toán'],
    'kế toán': ['kế toán'],
    luat: ['luật'],
    luật: ['luật'],
    'y khoa': ['y đa khoa', 'dược'],
    'y duoc': ['y đa khoa', 'dược'],
    'du lich': ['du lịch'],
    'du lịch': ['du lịch'],
    logistics: ['logistics'],
    'co khi': ['cơ khí'],
    'cơ khí': ['cơ khí'],
    'xay dung': ['xây dựng', 'kiến trúc'],
    'kiến trúc': ['kiến trúc'],
    'ngoai ngu': ['ngôn ngữ anh', 'ngôn ngữ'],
    'tieng anh': ['ngôn ngữ anh'],
    'bao chi': ['báo chí', 'truyền thông'],
    'truyền thông': ['truyền thông', 'báo chí'],
    'an toan thong tin': ['an toàn thông tin', 'cybersecurity', 'bảo mật'],
    'quan he quoc te': ['quan hệ quốc tế', 'quốc tế', 'ngoại giao'],
    'bat dong san': ['bất động sản', 'real estate'],
    'nhat ban': ['nhật bản học', 'nhật bản', 'tiếng nhật'],
    'han quoc': ['hàn quốc học', 'hàn quốc', 'tiếng hàn'],
    'trung quoc': ['trung quốc học', 'tiếng trung'],
    'lam nghiep': ['lâm nghiệp', 'nông nghiệp', 'chế biến lâm sản'],
    'benh vien': ['quản lý bệnh viện', 'y tế', 'y dược'],
    'hang khong': ['hàng không'],
    'hàng không': ['hàng không'],
    'su pham toan': ['sư phạm toán học'],
    'sư phạm toán': ['sư phạm toán học'],
    'su pham': ['sư phạm'],
    'sư phạm': ['sư phạm'],
};
function normalizeInterestKey(input) {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}
function expandInterestPhrases(phrases) {
    const expanded = new Set();
    for (const phrase of phrases) {
        const trimmed = phrase.trim().toLowerCase();
        if (trimmed.length < 2)
            continue;
        expanded.add(trimmed);
        const key = normalizeInterestKey(trimmed);
        expanded.add(key);
        const synonyms = INTEREST_SYNONYM_MAP[key];
        if (synonyms) {
            for (const s of synonyms) {
                expanded.add(s.toLowerCase());
            }
        }
    }
    return [...expanded];
}
//# sourceMappingURL=interest-synonyms.js.map