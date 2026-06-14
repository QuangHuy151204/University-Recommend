export declare function majorTagSearchWhere(alias?: string): string;
export declare function normalizeMajorMatchText(input: string): string;
export declare function majorMatchesInterestTerms(majorName: string, tags: string[] | null | undefined, _careerOrientation: string | null | undefined, terms: string[]): {
    matched: boolean;
    score: number;
    reason?: string;
};
