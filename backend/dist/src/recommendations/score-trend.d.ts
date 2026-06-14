import type { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
export type ScoreTrendDirection = 'rising' | 'falling' | 'stable' | 'insufficient';
export type ScoreTrendResult = {
    direction: ScoreTrendDirection;
    fromYear: number;
    toYear: number;
    fromScore: number;
    toScore: number;
    delta: number;
};
export declare function analyzeCutoffTrend(cutoffScores: CutoffScore[] | undefined, subjectCombination?: string): ScoreTrendResult | null;
export declare function formatScoreTrendReason(trend: ScoreTrendResult): string;
