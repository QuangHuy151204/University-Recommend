import { UniversityMajor } from '../majors/university-major.entity';
import { RecommendRequestDto } from './recommendation.dto';
import type { AdmissionTier } from './recommendation.response';
export declare const CANONICAL_RECOMMEND_REQUEST: RecommendRequestDto;
export type ExpectedRankingRow = {
    short_name: string;
    majorKeyword: string;
    matchScore: number;
    admissionTier: AdmissionTier;
    referenceCutoff: number;
};
export declare const CANONICAL_SUPHAM_TOAN_REQUEST: RecommendRequestDto;
export declare const EXPECTED_A00_SUPHAM_TOAN_25_RANKING: ExpectedRankingRow[];
export declare const EXPECTED_B01_CNTT_25_RANKING: ExpectedRankingRow[];
export declare function buildA00SuphamToanRegressionFixture(): UniversityMajor[];
export declare function buildB01CnttRegressionFixture(): UniversityMajor[];
