/** Đồ án chỉ hỗ trợ trường đại học tại Hà Nội. */
export const DATA_SCOPE_LOCATION = 'Hà Nội';

export function isHanoiLocation(location: string | null | undefined): boolean {
  if (!location?.trim()) return false;
  const lower = location.toLowerCase();
  return (
    lower.includes('hà nội') ||
    lower.includes('ha noi') ||
    lower.includes('hanoi')
  );
}
