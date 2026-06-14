import type { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
import { analyzeCutoffTrend, formatScoreTrendReason } from './score-trend';

function cutoff(year: number, score: number, combo = 'B01'): CutoffScore {
  return {
    year,
    score,
    subject_combination: combo,
  } as CutoffScore;
}

describe('score-trend', () => {
  it('detects rising trend 2023→2025', () => {
    const trend = analyzeCutoffTrend(
      [cutoff(2023, 22), cutoff(2024, 23), cutoff(2025, 24.5)],
      'B01',
    );
    expect(trend?.direction).toBe('rising');
    expect(trend?.delta).toBe(2.5);
    expect(formatScoreTrendReason(trend!)).toContain('tăng');
  });

  it('detects falling trend', () => {
    const trend = analyzeCutoffTrend(
      [cutoff(2023, 26), cutoff(2024, 25), cutoff(2025, 24)],
      'B01',
    );
    expect(trend?.direction).toBe('falling');
    expect(formatScoreTrendReason(trend!)).toContain('giảm');
  });

  it('returns null with fewer than 2 years', () => {
    expect(analyzeCutoffTrend([cutoff(2025, 24)], 'B01')).toBeNull();
  });

  it('filters by subject combination', () => {
    const trend = analyzeCutoffTrend(
      [
        cutoff(2023, 22, 'B01'),
        cutoff(2024, 20, 'A00'),
        cutoff(2025, 24, 'B01'),
      ],
      'B01',
    );
    expect(trend?.fromYear).toBe(2023);
    expect(trend?.toYear).toBe(2025);
    expect(trend?.direction).toBe('rising');
  });
});
