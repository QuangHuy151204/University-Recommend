import {
  evaluateUniversityFilter,
  type FilterDataset,
} from './university-filter-evaluator';

function buildMiniDataset(): FilterDataset {
  return {
    universities: [
      {
        id: 1,
        name: 'Trường Alpha',
        short_name: 'ALPHA',
        location: 'Hà Nội',
        type: 'public',
        tuition_fee_min: 10_000_000,
      },
      {
        id: 2,
        name: 'Trường Beta',
        short_name: 'BETA',
        location: 'Hà Nội',
        type: 'private',
        tuition_fee_min: 35_000_000,
      },
      {
        id: 3,
        name: 'Trường Gamma',
        short_name: 'GAMMA',
        location: 'Hà Nội',
        type: 'public',
        tuition_fee_min: 12_000_000,
      },
    ],
    catalog: [
      { id: 10, name: 'Công nghệ Thông tin' },
      { id: 11, name: 'Hệ thống thông tin' },
      { id: 20, name: 'Kế toán' },
    ],
    universityMajors: [
      { id: 101, university_id: 1, major_id: 10 },
      { id: 102, university_id: 2, major_id: 11 },
      { id: 103, university_id: 3, major_id: 20 },
    ],
    cutoffs: [
      {
        university_major_id: 101,
        year: 2023,
        subject_combination: 'A01',
        score: 22,
      },
      {
        university_major_id: 101,
        year: 2025,
        subject_combination: 'A01',
        score: 27,
      },
      {
        university_major_id: 102,
        year: 2025,
        subject_combination: 'A01',
        score: 25,
      },
      {
        university_major_id: 103,
        year: 2025,
        subject_combination: 'A01',
        score: 23,
      },
      {
        university_major_id: 103,
        year: 2025,
        subject_combination: 'B01',
        score: 21,
      },
    ],
  };
}

describe('evaluateUniversityFilter (synthetic)', () => {
  const ds = buildMiniDataset();

  it('returns all Hanoi universities when no cutoff filter', () => {
    const ids = evaluateUniversityFilter(ds, {});
    expect([...ids].sort()).toEqual([1, 2, 3]);
  });

  it('combo only: any year in range', () => {
    const ids = evaluateUniversityFilter(ds, { subject_combination: 'B01' });
    expect([...ids]).toEqual([3]);
  });

  it('score only: latest year across combos', () => {
    expect([...evaluateUniversityFilter(ds, { min_score: 26 })].sort()).toEqual(
      [2, 3],
    );
    expect([...evaluateUniversityFilter(ds, { min_score: 28 })].sort()).toEqual(
      [1, 2, 3],
    );
  });

  it('combo+score: rejects alpha (2025 A01=27) for min 25', () => {
    const ids = evaluateUniversityFilter(ds, {
      subject_combination: 'A01',
      min_score: 25,
    });
    expect([...ids].sort()).toEqual([2, 3]);
  });

  it('CNTT major includes HTTT sibling at beta', () => {
    const ids = evaluateUniversityFilter(ds, {
      subject_combination: 'A01',
      min_score: 26,
      major_id: 10,
    });
    expect([...ids]).toEqual([2]);
  });

  it('Kế toán does not include CNTT programs', () => {
    const ids = evaluateUniversityFilter(ds, {
      subject_combination: 'A01',
      major_id: 20,
    });
    expect([...ids]).toEqual([3]);
  });

  it('major only: includes school even without cutoff rows', () => {
    const noCutoffDs: FilterDataset = {
      ...ds,
      universities: [
        ...ds.universities,
        {
          id: 4,
          name: 'Trường Delta',
          short_name: 'DELTA',
          location: 'Hà Nội',
          type: 'private',
          tuition_fee_min: 20_000_000,
        },
      ],
      universityMajors: [
        ...ds.universityMajors,
        { id: 104, university_id: 4, major_id: 10 },
      ],
    };
    const ids = evaluateUniversityFilter(noCutoffDs, { major_id: 10 });
    expect(ids.has(4)).toBe(true);
  });

  it('tuition cap filters expensive private school', () => {
    const ids = evaluateUniversityFilter(ds, {
      subject_combination: 'A01',
      min_score: 24,
      max_tuition: 15_000_000,
    });
    expect([...ids]).toEqual([3]);
  });
});
