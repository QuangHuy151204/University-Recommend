export interface CutoffFilterRow {
    year: number;
    subject_combination: string | null | undefined;
    score: number;
}
export type CutoffFilterInput = {
    subject_combination?: string;
    min_score?: number;
};
export declare function referenceYearForScoreFilter(rows: CutoffFilterRow[], combo: string | undefined, years?: readonly number[]): number | null;
export declare function rowsForCombo(rows: CutoffFilterRow[], combo: string | undefined, years?: readonly number[]): CutoffFilterRow[];
export declare function universityMajorPassesCutoffFilter(rows: CutoffFilterRow[], input: CutoffFilterInput, years?: readonly number[]): boolean;
export declare function latestCutoffYearSql(universityMajorAlias: string, cutoffAlias: string, comboParamName: string | null): string;
