/** Chuẩn hoá tên phường để so khớp (không phân biệt hoa thường, bỏ tiền tố "Phường"). */
export function normalizeWardName(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^phuong\s+/i, '')
    .replace(/\s+/g, ' ');
}

export function wardsMatch(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  const na = normalizeWardName(a);
  const nb = normalizeWardName(b);
  if (!na || !nb) return false;
  return na === nb;
}

export const ANY_WARD_LABEL = 'Bất kỳ';

export function isAnyWardPreference(value: string | null | undefined): boolean {
  if (!value?.trim()) return true;
  const n = normalizeWardName(value);
  return n === 'bat ky' || n === 'khong ro' || n === 'khong';
}
