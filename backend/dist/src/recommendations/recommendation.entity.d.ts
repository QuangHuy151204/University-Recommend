import { User } from '../users/user.entity';
import { UniversityMajor } from '../majors/university-major.entity';
export declare class Recommendation {
    id: number;
    user: User;
    universityMajor: UniversityMajor;
    match_score: number;
    reason: string;
    created_at: Date;
}
