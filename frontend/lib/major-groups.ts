/** Chuẩn hóa slug nhóm ngành — gộp dấu gạch ngang liên tiếp (vd. hoa-hoc---sinh-hoc). */
const GROUP_SLUG_ALIASES: Record<string, string> = {
    'cong-nghe': 'cong-nghe-thong-tin',
    'an-toan-thong-tin': 'cong-nghe-thong-tin',
    'kinh-te': 'kinh-te-kinh-doanh',
    'ky-thuat': 'ky-thuat-cong-nghiep',
    'y-duoc': 'y-duoc-suc-khoe',
    'y-te': 'y-duoc-suc-khoe',
};

export function normalizeGroupSlug(slug: string): string {
    const base = slug
        .toLowerCase()
        .trim()
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return GROUP_SLUG_ALIASES[base] ?? base;
}
