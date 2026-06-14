"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAJOR_SEARCH_ALIASES = void 0;
exports.extractMajorFragment = extractMajorFragment;
exports.resolveMajorSearchTerm = resolveMajorSearchTerm;
exports.pickMajorInterestPhrase = pickMajorInterestPhrase;
exports.MAJOR_SEARCH_ALIASES = {
    cntt: 'Công nghệ thông tin',
    it: 'Công nghệ thông tin',
    ai: 'Trí tuệ nhân tạo',
    'tri tue nhan tao': 'Trí tuệ nhân tạo',
    'vu tru': 'Khoa học Vũ trụ',
    'khoa hoc vu tru': 'Khoa học Vũ trụ',
    've tinh': 'Vệ tinh',
    marketing: 'Marketing',
    luat: 'Luật',
    'ke toan': 'Kế toán',
    'co khi': 'Cơ khí',
    'tai chinh ngan hang': 'Tài chính ngân hàng',
    'bao chi': 'Báo chí',
    'ngoai thuong': 'Ngoại thương',
    'quan tri kinh doanh': 'Quản trị kinh doanh',
    'an toan thong tin': 'An toàn thông tin',
    'du lich': 'Du lịch',
    logistics: 'Logistics',
    'hang khong': 'Hàng không',
    'hang khong vu tru': 'Hàng không',
    'y da khoa': 'Y đa khoa',
    'dien tu': 'Điện tử',
    'kien truc': 'Kiến trúc',
    'su pham toan': 'Sư phạm Toán học',
    'sư phạm toán': 'Sư phạm Toán học',
};
function normalizeMatchText(input) {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}
function extractMajorFragment(msg) {
    const normalized = normalizeMatchText(msg);
    const match = normalized.match(/(?:ngành|nganh|chuyên ngành|chuyen nganh)\s+(.+?)(?:\s+(?:trường|truong|cua|cu|ủa|ở|o|tại|tai|năm|nam|lấy|lay|bao|theo|thì|thi|à|a|ạ|\?)|$)/u);
    if (!match)
        return null;
    const fragment = match[1]
        .replace(/\b(ha noi|hà nội|o ha noi|ở hà nội)\b/gu, '')
        .replace(/\s+(cua|cu|ủa)\s+.+$/u, '')
        .trim();
    return fragment.length >= 3 ? fragment : null;
}
function resolveAliasFromNormalizedText(normalized) {
    for (const [alias, term] of Object.entries(exports.MAJOR_SEARCH_ALIASES)) {
        const normAlias = normalizeMatchText(alias);
        if (normAlias.length >= 2 && normalized.includes(normAlias)) {
            return term;
        }
    }
    return null;
}
function resolveMajorSearchTerm(msg) {
    const normalized = normalizeMatchText(msg);
    const fromAlias = resolveAliasFromNormalizedText(normalized);
    if (fromAlias)
        return fromAlias;
    return extractMajorFragment(msg);
}
function pickMajorInterestPhrase(msg, entityMajor) {
    const fromMessage = resolveMajorSearchTerm(msg);
    if (fromMessage)
        return fromMessage;
    const fragment = extractMajorFragment(msg);
    if (fragment) {
        const fromFragmentAlias = resolveAliasFromNormalizedText(normalizeMatchText(fragment));
        if (fromFragmentAlias)
            return fromFragmentAlias;
        return fragment;
    }
    const entity = entityMajor?.trim();
    if (entity) {
        const fromEntityAlias = resolveAliasFromNormalizedText(normalizeMatchText(entity));
        if (fromEntityAlias)
            return fromEntityAlias;
        return entity;
    }
    return '';
}
//# sourceMappingURL=major-search.js.map