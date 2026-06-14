export declare function majorNameMatchesSelection(programMajorName: string, selectedMajorName: string): boolean;
export declare function majorsRelatedForUniversityFilter(programMajorName: string, selectedMajorName: string): boolean;
export declare function filterMajorIdsBySelectionName(majors: Array<{
    id: number;
    name: string;
}>, selectedMajorName: string): number[];
