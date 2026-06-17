import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/** Trường ưu tiên hiển thị đầu trong admin (đồ án USTH). */
export const DEFAULT_PREFERRED_UNIVERSITY_SHORT_NAME = 'USTH';

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
