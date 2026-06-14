/** Chuyển giá trị scalar sang string an toàn (tránh `[object Object]`). */
export function scalarToString(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return '';
}

export function parseFloatFromUnknown(v: unknown): number {
  if (typeof v === 'number') return v;
  return parseFloat(scalarToString(v));
}

export function parseIntFromUnknown(v: unknown): number {
  if (typeof v === 'number') return v;
  return parseInt(scalarToString(v), 10);
}
