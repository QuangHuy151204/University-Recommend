import { isAnyWardPreference, normalizeWardName, wardsMatch } from './ward';

describe('ward', () => {
  it('normalizes Phường prefix and accents', () => {
    expect(normalizeWardName('Phường Thanh Xuân')).toBe('thanh xuan');
    expect(normalizeWardName('Thanh Xuân')).toBe('thanh xuan');
  });

  it('matches ward names with different prefixes', () => {
    expect(wardsMatch('Phường Cầu Giấy', 'Cầu Giấy')).toBe(true);
    expect(wardsMatch('Phường Cầu Giấy', 'Phường Hoàng Mai')).toBe(false);
  });

  it('treats empty and bat ky as any ward', () => {
    expect(isAnyWardPreference('')).toBe(true);
    expect(isAnyWardPreference('Bất kỳ')).toBe(true);
    expect(isAnyWardPreference('Phường Láng')).toBe(false);
  });
});
