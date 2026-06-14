import { User } from '../users/user.entity';
import { University } from '../universities/university.entity';
import { UniversityMajor } from '../majors/university-major.entity';
export declare class UserFavorite {
    id: number;
    user_id: number;
    university_id: number;
    university_major_id: number | null;
    user: User;
    university: University;
    universityMajor: UniversityMajor | null;
    created_at: Date;
}
