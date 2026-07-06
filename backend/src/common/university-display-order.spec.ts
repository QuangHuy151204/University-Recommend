import {
  isPreferredUniversity,
  pinPreferredUniversityFirst,
} from './university-display-order';

describe('pinPreferredUniversityFirst', () => {
  it('puts USTH before other universities', () => {
    const input = [
      { short_name: 'HUST', name: 'Bách khoa' },
      { short_name: 'USTH', name: 'Khoa học và Công nghệ' },
      { short_name: 'NEU', name: 'Kinh tế Quốc dân' },
    ];
    expect(pinPreferredUniversityFirst(input).map((u) => u.short_name)).toEqual(
      ['USTH', 'HUST', 'NEU'],
    );
  });

  it('preserves relative order among non-preferred schools', () => {
    const input = [
      { short_name: 'NEU', name: 'NEU' },
      { short_name: 'HUST', name: 'HUST' },
    ];
    expect(pinPreferredUniversityFirst(input).map((u) => u.short_name)).toEqual(
      ['NEU', 'HUST'],
    );
  });
});

describe('isPreferredUniversity', () => {
  it('matches USTH case-insensitively', () => {
    expect(isPreferredUniversity('usth')).toBe(true);
    expect(isPreferredUniversity('HUST')).toBe(false);
  });
});
