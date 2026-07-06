import {
  buildFilledOrientationMap,
  resolveCareerOrientation,
  stripProgramSuffix,
} from './career-orientation-enrichment';

describe('career-orientation-enrichment', () => {
  it('stripProgramSuffix removes program qualifiers', () => {
    expect(stripProgramSuffix('An toàn thông tin - Chất lượng cao')).toBe(
      'An toàn thông tin',
    );
  });

  it('inherits orientation from filled base major', () => {
    const rows = [
      {
        name: 'An toàn thông tin',
        fieldGroup: 'Công nghệ thông tin',
        career_orientation: 'Chuyên viên an ninh mạng',
      },
      {
        name: 'An toàn thông tin - Chất lượng cao',
        fieldGroup: 'Công nghệ thông tin',
        career_orientation: null,
      },
    ];
    const map = buildFilledOrientationMap(rows);
    const result = resolveCareerOrientation(rows[1], map);
    expect(result?.source).toBe('inherit');
    expect(result?.career_orientation).toContain('an ninh mạng');
  });

  it('fills Bác sĩ đa khoa via Y pattern', () => {
    const map = buildFilledOrientationMap([]);
    const result = resolveCareerOrientation(
      { name: 'Bác sĩ đa khoa', fieldGroup: 'Y dược - Sức khỏe' },
      map,
    );
    expect(result?.source).toBe('pattern');
    expect(result?.career_orientation).toMatch(/Bác sĩ/i);
  });

  it('fills Kế toán via kinh tế pattern', () => {
    const map = buildFilledOrientationMap([]);
    const result = resolveCareerOrientation(
      { name: 'Kế toán doanh nghiệp', fieldGroup: 'Kinh tế - Kinh doanh' },
      map,
    );
    expect(result?.source).toBe('pattern');
    expect(result?.career_orientation).toMatch(/Kế toán/i);
  });

  it('skips majors outside target field groups', () => {
    const map = buildFilledOrientationMap([]);
    const result = resolveCareerOrientation(
      { name: 'Văn học', fieldGroup: 'Ngôn ngữ - Xã hội' },
      map,
    );
    expect(result).toBeNull();
  });
});
