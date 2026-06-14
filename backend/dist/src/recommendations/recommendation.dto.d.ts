export declare class RecommendRequestDto {
    expected_score: number;
    subject_combination: string;
    interests: string;
    preferred_location?: string;
    budget_range?: 'low' | 'medium' | 'high';
    budget_max_yearly?: number;
    career_goal?: string;
    method_code?: string;
}
