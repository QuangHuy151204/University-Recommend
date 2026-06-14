import {
  cutoffMatchesSubjectCombination,
  normalizeSubjectCombination,
  splitSubjectCombination,
} from './subject-combination';

describe('subject-combination', () => {
  it('splits compound stored values', () => {
    expect(splitSubjectCombination('D01/D03')).toEqual(['D01', 'D03']);
    expect(splitSubjectCombination('A00, A01')).toEqual(['A00', 'A01']);
  });

  it('matches exact and compound codes', () => {
    expect(cutoffMatchesSubjectCombination('C02', 'C02')).toBe(true);
    expect(cutoffMatchesSubjectCombination('D01/D03', 'D01')).toBe(true);
    expect(cutoffMatchesSubjectCombination('A00', 'C02')).toBe(false);
  });

  it('normalizes case', () => {
    expect(normalizeSubjectCombination(' a01 ')).toBe('A01');
    expect(cutoffMatchesSubjectCombination('a01', 'A01')).toBe(true);
  });
});
