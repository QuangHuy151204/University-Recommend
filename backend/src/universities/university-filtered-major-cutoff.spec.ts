import {
  buildFilteredMajorCutoffMap,
  pickFilteredMajorCutoffScore,
} from './university-filtered-major-cutoff';

describe('pickFilteredMajorCutoffScore', () => {
  it('returns 2025 score for matching subject combination', () => {
    const result = pickFilteredMajorCutoffScore(
      [
        { year: 2023, subject_combination: 'A00', score: 22 },
        { year: 2025, subject_combination: 'A00', score: 24.5 },
        { year: 2025, subject_combination: 'B01', score: 26 },
      ],
      'A00',
    );
    expect(result).toEqual({ year: 2025, score: 24.5 });
  });

  it('uses minimum score when multiple rows share the latest year', () => {
    const result = pickFilteredMajorCutoffScore(
      [
        { year: 2025, subject_combination: 'A00', score: 25 },
        { year: 2025, subject_combination: 'B01', score: 23.5 },
      ],
      undefined,
    );
    expect(result).toEqual({ year: 2025, score: 23.5 });
  });

  it('falls back to 2024 when 2025 is missing', () => {
    const result = pickFilteredMajorCutoffScore(
      [
        { year: 2023, subject_combination: 'A00', score: 20 },
        { year: 2024, subject_combination: 'A00', score: 21.5 },
      ],
      'A00',
    );
    expect(result).toEqual({ year: 2024, score: 21.5 });
  });

  it('returns null when no cutoff rows', () => {
    expect(pickFilteredMajorCutoffScore([], 'A00')).toBeNull();
  });
});

describe('buildFilteredMajorCutoffMap', () => {
  it('maps university id to major cutoff', () => {
    const map = buildFilteredMajorCutoffMap(
      [
        {
          university_id: 1,
          major_name: 'Công nghệ thông tin',
          year: 2025,
          subject_combination: 'B01',
          score: 24,
        },
        {
          university_id: 2,
          major_name: 'Công nghệ thông tin',
          year: 2025,
          subject_combination: 'B01',
          score: 26,
        },
      ],
      'B01',
    );
    expect(map.get(1)).toEqual({
      majorName: 'Công nghệ thông tin',
      score: 24,
      year: 2025,
    });
    expect(map.get(2)?.score).toBe(26);
  });
});
