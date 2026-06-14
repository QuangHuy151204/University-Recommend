import type { CutoffScore } from '../cutoff-scores/cutoff-score.entity';

/** Mức độ khả năng trúng tuyển so với điểm chuẩn gần nhất. */
export type AdmissionTier = 'safety' | 'match' | 'reach';

export type RecommendEmptyReason =
  | 'no_subject_combination'
  | 'no_score_match'
  | 'no_interest_match'
  | 'no_data';

export interface RecommendFiltersApplied {
  subject_combination: string | null;
  method_code: string;
  method_label: string | null;
  interests: string[] | null;
  preferred_location: string | null;
  budget_range: string | null;
  budget_max_yearly: number | null;
}

export interface RecommendationResultItem {
  id: number;
  university: {
    id: number;
    name: string;
    short_name: string | null;
    location: string | null;
    type: string;
    tuition_fee_min: number | null;
    tuition_fee_max: number | null;
    website: string | null;
  };
  major: {
    id: number;
    name: string;
    code: string | null;
    field_group: string | null;
    tags: string[];
    groups: Array<{
      group_id: string;
      group_name: string;
      is_primary: boolean;
    }>;
  };
  tuition_fee: number | null;
  cutoffScores?: CutoffScore[];
  matchScore: number;
  admissionTier: AdmissionTier | null;
  scoreDiff: number | null;
  referenceCutoff: number | null;
  reason: string[];
}

export interface RecommendResponseMeta {
  totalCandidates: number;
  filtersApplied: RecommendFiltersApplied;
  emptyReason: RecommendEmptyReason | null;
  diversified: boolean;
}

export interface RecommendResponse {
  results: RecommendationResultItem[];
  meta: RecommendResponseMeta;
}
