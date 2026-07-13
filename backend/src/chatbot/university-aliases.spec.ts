// @file: Automated tests for university aliases.
import {
  collectUniversityTokensFromMessage,
  normalizeUniversitySearchToken,
} from './university-aliases';

describe('university-aliases', () => {
  it('normalizeUniversitySearchToken maps UET to VNU-UET', () => {
    expect(normalizeUniversitySearchToken('UET')).toBe('VNU-UET');
    expect(normalizeUniversitySearchToken('VNU-UET')).toBe('VNU-UET');
    expect(normalizeUniversitySearchToken('BKA')).toBe('HUST');
  });

  it('collectUniversityTokensFromMessage finds compound before simple codes', () => {
    expect(
      collectUniversityTokensFromMessage('Điểm chuẩn VNU-UET 2025'),
    ).toEqual(['VNU-UET']);
    expect(
      collectUniversityTokensFromMessage('So sánh HUST và PTIT về CNTT'),
    ).toEqual(expect.arrayContaining(['HUST', 'PTIT']));
  });
});
