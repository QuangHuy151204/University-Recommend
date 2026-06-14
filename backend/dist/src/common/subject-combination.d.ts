export declare function normalizeSubjectCombination(code: string): string;
export declare function splitSubjectCombination(stored: string): string[];
export declare function cutoffMatchesSubjectCombination(stored: string | null | undefined, want: string): boolean;
export declare function subjectCombinationSqlMatch(columnExpr: string, paramName: string): string;
export declare const CUTOFF_FILTER_YEARS: readonly [2023, 2024, 2025];
