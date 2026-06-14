import type { AdmissionTier } from './recommendation.response';
export declare function classifyAdmissionTier(scoreDiff: number | null): AdmissionTier | null;
export declare const RECOMMEND_MAX_RESULTS = 15;
export declare const RECOMMEND_MAX_MAJORS_PER_UNIVERSITY = 3;
export declare function applyUniversityDiversityCap<T extends {
    universityId: number | null;
}>(results: T[], maxResults?: number, maxPerUniversity?: number): {
    items: T[];
    capped: boolean;
};
