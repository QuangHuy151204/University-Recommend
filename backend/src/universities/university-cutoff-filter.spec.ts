import {
  latestCutoffYearSql,
  referenceYearForScoreFilter,
  rowsForCombo,
  universityMajorPassesCutoffFilter,
} from './university-cutoff-filter';
import type { CutoffFilterRow } from './university-cutoff-filter';

function row(year: number, score: number, combo = 'A01'): CutoffFilterRow {
  return { year, score, subject_combination: combo };
}

describe('latestCutoffYearSql', () => {
  it('uses inner alias scs2 for combo match in subquery', () => {
    const sql = latestCutoffYearSql('sum', 'scs', 'combo');
    expect(sql).toContain('scs2.subject_combination');
    expect(sql).not.toMatch(
      /FROM cutoff_scores scs2[\s\S]*"scs"\."subject_combination"/,
    );
  });
});

describe('university-cutoff-filter', () => {
  describe('rowsForCombo', () => {
    it('keeps only years 2023–2025', () => {
      const rows = [row(2022, 20), row(2023, 21), row(2026, 30)];
      expect(rowsForCombo(rows, undefined)).toHaveLength(1);
      expect(rowsForCombo(rows, undefined)[0].year).toBe(2023);
    });

    it('filters by subject combination including compound stored values', () => {
      const rows = [
        { year: 2025, score: 24, subject_combination: 'D01/D03' },
        { year: 2025, score: 22, subject_combination: 'A00' },
      ];
      expect(rowsForCombo(rows, 'D01')).toHaveLength(1);
      expect(rowsForCombo(rows, 'A00')).toHaveLength(1);
      expect(rowsForCombo(rows, 'B01')).toHaveLength(0);
    });
  });

  describe('referenceYearForScoreFilter', () => {
    it('returns latest year among matching combo rows', () => {
      const rows = [
        row(2023, 20, 'A01'),
        row(2024, 22, 'A01'),
        row(2025, 25, 'A01'),
      ];
      expect(referenceYearForScoreFilter(rows, 'A01')).toBe(2025);
    });

    it('ignores other combos when combo is set', () => {
      const rows = [row(2023, 20, 'A01'), row(2025, 28, 'B01')];
      expect(referenceYearForScoreFilter(rows, 'A01')).toBe(2023);
    });
  });

  describe('universityMajorPassesCutoffFilter', () => {
    it('passes when any year matches combo without score filter', () => {
      const rows = [row(2023, 27, 'A01'), row(2025, 29, 'A01')];
      expect(
        universityMajorPassesCutoffFilter(rows, {
          subject_combination: 'A01',
        }),
      ).toBe(true);
    });

    it('rejects old-year-only low score when latest year exceeds min_score', () => {
      const rows = [
        row(2023, 22, 'A01'),
        row(2024, 24, 'A01'),
        row(2025, 28, 'A01'),
      ];
      expect(
        universityMajorPassesCutoffFilter(rows, {
          subject_combination: 'A01',
          min_score: 25,
        }),
      ).toBe(false);
    });

    it('passes when latest year score is within min_score', () => {
      const rows = [
        row(2023, 22, 'A01'),
        row(2024, 24, 'A01'),
        row(2025, 24.5, 'A01'),
      ];
      expect(
        universityMajorPassesCutoffFilter(rows, {
          subject_combination: 'A01',
          min_score: 25,
        }),
      ).toBe(true);
    });

    it('uses latest year across combos when only min_score is set', () => {
      const rows = [row(2023, 20, 'A00'), row(2025, 26, 'B01')];
      expect(universityMajorPassesCutoffFilter(rows, { min_score: 27 })).toBe(
        true,
      );
      expect(universityMajorPassesCutoffFilter(rows, { min_score: 25 })).toBe(
        false,
      );
    });

    it('requires same row: combo + score on latest year', () => {
      const rows = [row(2025, 30, 'A00'), row(2025, 22, 'B01')];
      expect(
        universityMajorPassesCutoffFilter(rows, {
          subject_combination: 'A00',
          min_score: 25,
        }),
      ).toBe(false);
      expect(
        universityMajorPassesCutoffFilter(rows, {
          subject_combination: 'B01',
          min_score: 25,
        }),
      ).toBe(true);
    });

    it('rejects when combo never offered in filter years', () => {
      const rows = [row(2025, 20, 'C02')];
      expect(
        universityMajorPassesCutoffFilter(rows, {
          subject_combination: 'A01',
          min_score: 30,
        }),
      ).toBe(false);
    });

    it('passes score-only when latest year cutoff is low enough', () => {
      const rows = [
        row(2023, 28, 'A01'),
        row(2024, 27, 'B01'),
        row(2025, 23, 'C02'),
      ];
      expect(universityMajorPassesCutoffFilter(rows, { min_score: 24 })).toBe(
        true,
      );
    });
  });
});

describe('university filter integration scenarios', () => {
  it('CNTT A01 27đ: trường chỉ đạt ở 2023 không lọt', () => {
    const cnttCutoffs = [
      row(2023, 26.5, 'A01'),
      row(2024, 27.2, 'A01'),
      row(2025, 28.1, 'A01'),
    ];
    expect(
      universityMajorPassesCutoffFilter(cnttCutoffs, {
        subject_combination: 'A01',
        min_score: 27,
      }),
    ).toBe(false);
  });

  it('CNTT A01 27đ: trường điểm 2025 = 26.75 lọt', () => {
    const cnttCutoffs = [row(2023, 28, 'A01'), row(2025, 26.75, 'A01')];
    expect(
      universityMajorPassesCutoffFilter(cnttCutoffs, {
        subject_combination: 'A01',
        min_score: 27,
      }),
    ).toBe(true);
  });

  it('multi-university simulation: only schools with latest-year eligibility pass', () => {
    const schools = [
      {
        name: 'OldLowOnly',
        rows: [row(2023, 20, 'B01'), row(2025, 27, 'B01')],
      },
      {
        name: 'LatestOk',
        rows: [row(2023, 26, 'B01'), row(2025, 24, 'B01')],
      },
      {
        name: 'NoB01',
        rows: [row(2025, 20, 'A00')],
      },
    ];

    const passed = schools.filter((s) =>
      universityMajorPassesCutoffFilter(s.rows, {
        subject_combination: 'B01',
        min_score: 25,
      }),
    );

    expect(passed.map((s) => s.name)).toEqual(['LatestOk']);
  });
});
