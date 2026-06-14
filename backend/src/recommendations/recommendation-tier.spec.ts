import {
  applyUniversityDiversityCap,
  classifyAdmissionTier,
  RECOMMEND_MAX_MAJORS_PER_UNIVERSITY,
} from './recommendation-tier';

describe('recommendation tier and diversity cap', () => {
  it('classifyAdmissionTier maps score diff to safety/match/reach', () => {
    expect(classifyAdmissionTier(null)).toBeNull();
    expect(classifyAdmissionTier(0)).toBe('safety');
    expect(classifyAdmissionTier(2.5)).toBe('safety');
    expect(classifyAdmissionTier(-0.5)).toBe('match');
    expect(classifyAdmissionTier(-1)).toBe('match');
    expect(classifyAdmissionTier(-1.5)).toBe('reach');
  });

  it('applyUniversityDiversityCap limits majors per university', () => {
    const rows = [
      { id: 1, universityId: 10 },
      { id: 2, universityId: 10 },
      { id: 3, universityId: 10 },
      { id: 4, universityId: 10 },
      { id: 5, universityId: 20 },
    ];

    const { items, capped } = applyUniversityDiversityCap(rows, 15, 2);

    expect(items).toHaveLength(3);
    expect(items.filter((r) => r.universityId === 10)).toHaveLength(2);
    expect(capped).toBe(true);
    expect(RECOMMEND_MAX_MAJORS_PER_UNIVERSITY).toBe(3);
  });
});
