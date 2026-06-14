import type { CutoffScore } from '../cutoff-scores/cutoff-score.entity';

export type ScoreTrendDirection =
  | 'rising'
  | 'falling'
  | 'stable'
  | 'insufficient';

export type ScoreTrendResult = {
  direction: ScoreTrendDirection;
  fromYear: number;
  toYear: number;
  fromScore: number;
  toScore: number;
  delta: number;
};

const TREND_THRESHOLD = 0.5;
const TREND_YEARS = [2023, 2024, 2025] as const;

function normalizeCombo(code: string): string {
  return code.trim().toUpperCase();
}

function cutoffMatchesCombo(
  cutoff: CutoffScore,
  subjectCombination?: string,
): boolean {
  const want = subjectCombination?.trim();
  if (!want) return true;
  const stored = (cutoff.subject_combination ?? '').trim();
  if (!stored) return false;
  const normalized = normalizeCombo(stored);
  const target = normalizeCombo(want);
  if (normalized === target) return true;
  return stored
    .split(/[,;/]+/)
    .map((s) => normalizeCombo(s))
    .some((c) => c === target);
}

/**
 * Phân tích xu hướng điểm chuẩn 2023–2025 (cùng tổ hợp nếu có).
 * Cần ≥2 năm trong khoảng để kết luận.
 */
export function analyzeCutoffTrend(
  cutoffScores: CutoffScore[] | undefined,
  subjectCombination?: string,
): ScoreTrendResult | null {
  const byYear = new Map<number, number>();

  for (const c of cutoffScores ?? []) {
    if (!TREND_YEARS.includes(c.year as (typeof TREND_YEARS)[number])) continue;
    if (!cutoffMatchesCombo(c, subjectCombination)) continue;
    const existing = byYear.get(c.year);
    if (existing === undefined || c.score > existing) {
      byYear.set(c.year, c.score);
    }
  }

  const years = [...byYear.keys()].sort((a, b) => a - b);
  if (years.length < 2) return null;

  const fromYear = years[0];
  const toYear = years[years.length - 1];
  const fromScore = byYear.get(fromYear)!;
  const toScore = byYear.get(toYear)!;
  const delta = Math.round((toScore - fromScore) * 100) / 100;

  let direction: ScoreTrendDirection = 'stable';
  if (delta > TREND_THRESHOLD) direction = 'rising';
  else if (delta < -TREND_THRESHOLD) direction = 'falling';

  return { direction, fromYear, toYear, fromScore, toScore, delta };
}

/** Câu giải thích xu hướng cho mảng reason của gợi ý. */
export function formatScoreTrendReason(trend: ScoreTrendResult): string {
  const abs = Math.abs(trend.delta);
  if (trend.direction === 'rising') {
    return `Điểm chuẩn ${trend.fromYear}→${trend.toYear} tăng ${abs} điểm (${trend.fromScore}→${trend.toScore}) — nên dự phòng thêm`;
  }
  if (trend.direction === 'falling') {
    return `Điểm chuẩn ${trend.fromYear}→${trend.toYear} giảm ${abs} điểm (${trend.fromScore}→${trend.toScore}) — cơ hội tốt hơn`;
  }
  return `Điểm chuẩn ${trend.fromYear}→${trend.toYear} ổn định quanh ${trend.toScore} điểm`;
}
