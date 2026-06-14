import { User } from './user.entity';
export declare class StudentProfile {
    id: number;
    user: User;
    expected_score: number;
    subject_combination: string;
    interests: string;
    preferred_location: string;
    budget_range: string;
    budget_max_yearly: number | null;
    career_goal: string;
    preferred_method_code: string | null;
    created_at: Date;
    updated_at: Date;
}
