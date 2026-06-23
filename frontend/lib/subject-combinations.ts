/** Nhãn môn cho các khối THPT phổ biến (hiển thị UI). */
import type { Locale } from '@/lib/i18n/translations';

export const SUBJECT_COMBINATION_LABELS: Record<string, string> = {
    A00: 'Toán, Lý, Hóa',
    A01: 'Toán, Lý, Anh',
    A02: 'Toán, Lý, Sinh',
    A03: 'Toán, Lý, Văn',
    B00: 'Toán, Hóa, Sinh',
    B01: 'Toán, Sinh, Anh',
    B03: 'Toán, Hóa, Văn',
    C00: 'Văn, Sử, Địa',
    C01: 'Văn, Toán, Lý',
    C02: 'Văn, Sử, GDCD',
    C03: 'Văn, Sử, KHTN',
    C04: 'Văn, Toán, Hóa',
    D01: 'Toán, Văn, Anh',
    D07: 'Toán, Hóa, Anh',
    D09: 'Toán, Sử, Anh',
    D10: 'Toán, Địa, Anh',
    D14: 'Văn, Sử, GDCD',
    D15: 'Văn, Sử, Anh',
};

export const SUBJECT_COMBINATION_LABELS_EN: Record<string, string> = {
    A00: 'Math, Physics, Chemistry',
    A01: 'Math, Physics, English',
    A02: 'Math, Physics, Biology',
    A03: 'Math, Physics, Literature',
    B00: 'Math, Chemistry, Biology',
    B01: 'Math, Biology, English',
    B03: 'Math, Chemistry, Literature',
    C00: 'Literature, History, Geography',
    C01: 'Literature, Math, Physics',
    C02: 'Literature, History, Civics',
    C03: 'Literature, History, Science',
    C04: 'Literature, Math, Chemistry',
    D01: 'Math, Literature, English',
    D07: 'Math, Chemistry, English',
    D09: 'Math, History, English',
    D10: 'Math, Geography, English',
    D14: 'Literature, History, Civics',
    D15: 'Literature, History, English',
};

export function subjectCombinationLabel(
    code: string,
    locale: Locale = 'vi',
): string | null {
    const map =
        locale === 'en'
            ? SUBJECT_COMBINATION_LABELS_EN
            : SUBJECT_COMBINATION_LABELS;
    return map[code.toUpperCase()] ?? null;
}

export function filterCombinationOptions<
    T extends { code: string },
>(query: string, items: T[]): T[] {
    const q = query.trim().toUpperCase();
    if (!q) return items;
    return items.filter((item) => item.code.toUpperCase().includes(q));
}
