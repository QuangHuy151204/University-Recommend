import { canonicalMajorName } from './major-normalization';
import {
  countCutoffDuplicates,
  cutoffDedupeKey,
  findDuplicateMajorGroups,
  findDuplicateUniversityMajorGroups,
  groupMajorsByCanonicalName,
  pickLongerText,
  pickMajorKeeper,
  pickUniversityMajorKeeper,
} from './duplicate-cleanup';

describe('duplicate cleanup utilities', () => {
  it('canonicalMajorName merges accent/case variants', () => {
    const a = canonicalMajorName('Công nghệ thông tin');
    const b = canonicalMajorName('CONG NGHE THONG TIN');
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('findDuplicateMajorGroups detects same canonical name', () => {
    const groups = findDuplicateMajorGroups([
      { id: 1, name: 'Kế toán', code: '7340301', field_group: null },
      { id: 2, name: 'Ke toan', code: null, field_group: null },
      { id: 3, name: 'Marketing', code: null, field_group: null },
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].group).toHaveLength(2);
  });

  it('pickMajorKeeper prefers more university_majors links', () => {
    const keeper = pickMajorKeeper([
      { id: 10, name: 'CNTT', code: '7480101', field_group: null, links: 2 },
      { id: 20, name: 'cntt', code: null, field_group: null, links: 15 },
    ]);
    expect(keeper.id).toBe(20);
  });

  it('pickUniversityMajorKeeper prefers more cutoff rows', () => {
    const keeper = pickUniversityMajorKeeper([
      {
        id: 1,
        university_id: 1,
        major_id: 1,
        training_program: null,
        duration: null,
        tuition_fee: null,
        quota: null,
        admission_methods: null,
        cutoff_count: 3,
      },
      {
        id: 2,
        university_id: 1,
        major_id: 1,
        training_program: 'Chất lượng cao',
        duration: 4,
        tuition_fee: null,
        quota: null,
        admission_methods: null,
        cutoff_count: 40,
      },
    ]);
    expect(keeper.id).toBe(2);
  });

  it('findDuplicateUniversityMajorGroups groups by university+major pair', () => {
    const dupes = findDuplicateUniversityMajorGroups([
      {
        id: 1,
        university_id: 5,
        major_id: 9,
        training_program: null,
        duration: null,
        tuition_fee: null,
        quota: null,
        admission_methods: null,
      },
      {
        id: 2,
        university_id: 5,
        major_id: 9,
        training_program: 'CLC',
        duration: null,
        tuition_fee: null,
        quota: null,
        admission_methods: null,
      },
      {
        id: 3,
        university_id: 5,
        major_id: 10,
        training_program: null,
        duration: null,
        tuition_fee: null,
        quota: null,
        admission_methods: null,
      },
    ]);
    expect(dupes).toHaveLength(1);
    expect(dupes[0].key).toBe('5|9');
  });

  it('cutoffDedupeKey and countCutoffDuplicates', () => {
    const rows = [
      {
        id: 1,
        year: 2024,
        admission_method: 'Học bạ',
        subject_combination: 'A00',
      },
      {
        id: 2,
        year: 2024,
        admission_method: 'hoc ba',
        subject_combination: 'a00',
      },
      {
        id: 3,
        year: 2023,
        admission_method: 'Học bạ',
        subject_combination: 'A00',
      },
    ];
    expect(cutoffDedupeKey(rows[0])).toBe(cutoffDedupeKey(rows[1]));
    expect(countCutoffDuplicates(rows)).toBe(1);
  });

  it('pickLongerText keeps richer text', () => {
    expect(pickLongerText('a', 'longer program name')).toBe(
      'longer program name',
    );
  });

  it('groupMajorsByCanonicalName has no duplicate keys', () => {
    const map = groupMajorsByCanonicalName([
      { id: 1, name: 'A', code: null, field_group: null },
      { id: 2, name: 'a', code: null, field_group: null },
    ]);
    expect(map.size).toBe(1);
    expect([...map.values()][0]).toHaveLength(2);
  });
});
