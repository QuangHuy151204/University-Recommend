import { CUTOFF_FILTER_YEARS } from '../common/subject-combination';
export type UniversityFilterQuery = {
    search?: string;
    location?: string;
    type?: string;
    max_tuition?: number;
    subject_combination?: string;
    min_score?: number;
    major_id?: number;
};
export type CatalogMajor = {
    id: number;
    name: string;
};
export type UniversitySnapshot = {
    id: number;
    name: string;
    short_name: string;
    location: string;
    type: string | null;
    tuition_fee_min: number | null;
};
export type UniversityMajorSnapshot = {
    id: number;
    university_id: number;
    major_id: number;
};
export type CutoffSnapshot = {
    university_major_id: number;
    year: number;
    subject_combination: string | null;
    score: number;
};
export type FilterDataset = {
    universities: UniversitySnapshot[];
    universityMajors: UniversityMajorSnapshot[];
    cutoffs: CutoffSnapshot[];
    catalog: CatalogMajor[];
};
export declare function resolveMajorIdsForFilter(catalog: CatalogMajor[], major_id?: number): number[] | undefined;
export declare function evaluateUniversityFilter(dataset: FilterDataset, query: UniversityFilterQuery): Set<number>;
export { CUTOFF_FILTER_YEARS };
