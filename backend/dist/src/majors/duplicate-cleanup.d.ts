export type MajorCleanupRow = {
    id: number;
    name: string;
    code: string | null;
    field_group: string | null;
    links?: number;
};
export type UniversityMajorCleanupRow = {
    id: number;
    university_id: number;
    major_id: number;
    training_program: string | null;
    duration: number | null;
    tuition_fee: number | null;
    quota: number | null;
    admission_methods: string | null;
    cutoff_count?: number;
};
export declare function pickLongerText(a: string | null, b: string | null): string | null;
export declare function pickMajorKeeper(candidates: Array<MajorCleanupRow & {
    links: number;
}>): MajorCleanupRow;
export declare function pickUniversityMajorKeeper(candidates: Array<UniversityMajorCleanupRow & {
    cutoff_count: number;
}>): UniversityMajorCleanupRow;
export declare function groupMajorsByCanonicalName(majors: MajorCleanupRow[]): Map<string, MajorCleanupRow[]>;
export declare function findDuplicateMajorGroups(majors: MajorCleanupRow[]): Array<{
    canonical: string;
    group: MajorCleanupRow[];
}>;
export declare function groupUniversityMajorsByPair(rows: UniversityMajorCleanupRow[]): Map<string, UniversityMajorCleanupRow[]>;
export declare function findDuplicateUniversityMajorGroups(rows: UniversityMajorCleanupRow[]): Array<{
    key: string;
    group: UniversityMajorCleanupRow[];
}>;
export declare function cutoffDedupeKey(row: {
    year: number;
    admission_method: string | null;
    subject_combination: string | null;
}): string;
export declare function countCutoffDuplicates(rows: Array<{
    id: number;
    year: number;
    admission_method: string | null;
    subject_combination: string | null;
}>): number;
