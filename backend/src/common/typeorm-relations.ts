/** Stub quan hệ TypeORM khi chỉ cần foreign key id. */
export function relationById<T extends { id: number }>(
  id: number,
): Pick<T, 'id'> {
  return { id };
}

/** Gán quan hệ ManyToOne khi entity yêu cầu full type (chỉ ghi FK). */
export function relationStub<T extends { id: number }>(id: number): T {
  return { id } as T;
}
