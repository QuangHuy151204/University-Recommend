/** Nhãn môn cho các khối THPT phổ biến (hiển thị UI). */
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

export function subjectCombinationLabel(code: string): string | null {
    return SUBJECT_COMBINATION_LABELS[code.toUpperCase()] ?? null;
}

export function filterCombinationOptions<
    T extends { code: string },
>(query: string, items: T[]): T[] {
    const q = query.trim().toUpperCase();
    if (!q) return items;
    return items.filter((item) => item.code.toUpperCase().includes(q));
}
