// @file: Sort order for pinning preferred universities in lists and chat answers.
import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/** Trường ưu tiên hiển thị đầu danh sách (đồ án USTH). */
export const DEFAULT_PREFERRED_UNIVERSITY_SHORT_NAME = 'USTH';

export function isPreferredUniversity(
  shortName: string | null | undefined,
  preferShortName: string = DEFAULT_PREFERRED_UNIVERSITY_SHORT_NAME,
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
  preferShortName: string = DEFAULT_PREFERRED_UNIVERSITY_SHORT_NAME,
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

/**
 * Sắp xếp trường: `preferShortName` trước, sau đó theo tên A→Z.
 * Dùng cho danh sách admin / dropdown.
 */
export function applyUniversityDisplayOrder<Entity extends ObjectLiteral>(
  qb: SelectQueryBuilder<Entity>,
  universityAlias: string,
  preferShortName: string = DEFAULT_PREFERRED_UNIVERSITY_SHORT_NAME,
  options?: { append?: boolean },
): SelectQueryBuilder<Entity> {
  const param = 'preferUniversityShortName';
  const sortAlias = 'university_display_sort';
  qb.addSelect(
    `CASE WHEN ${universityAlias}.short_name = :${param} THEN 0 ELSE 1 END`,
    sortAlias,
  );
  if (options?.append) {
    qb.addOrderBy(sortAlias, 'ASC');
  } else {
    qb.orderBy(sortAlias, 'ASC');
  }
  return qb
    .addOrderBy(`${universityAlias}.name`, 'ASC')
    .setParameter(param, preferShortName);
}
