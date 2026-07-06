/** Trường ưu tiên hiển thị đầu danh sách (đồ án USTH). */
export const PREFERRED_UNIVERSITY_SHORT_NAME = 'USTH';

export function isPreferredUniversity(
    shortName: string | null | undefined,
    preferShortName: string = PREFERRED_UNIVERSITY_SHORT_NAME,
): boolean {
    return (
        (shortName ?? '').trim().toUpperCase() === preferShortName.toUpperCase()
    );
}

/** Giữ thứ tự tương đối trong từng nhóm; đẩy trường ưu tiên lên đầu. */
export function pinPreferredUniversityFirst<
    T extends { short_name?: string | null },
>(
    items: readonly T[],
    preferShortName: string = PREFERRED_UNIVERSITY_SHORT_NAME,
): T[] {
    const preferred: T[] = [];
    const rest: T[] = [];
    for (const item of items) {
        if (isPreferredUniversity(item.short_name, preferShortName)) {
            preferred.push(item);
        } else {
            rest.push(item);
        }
    }
    return [...preferred, ...rest];
}
