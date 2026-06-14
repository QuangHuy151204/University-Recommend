import { Repository } from 'typeorm';
import { User } from './user.entity';
import { StudentProfile } from './student-profile.entity';
import { UpdateProfileDto } from './users.dto';
export declare class UsersService {
    private readonly userRepo;
    private readonly profileRepo;
    constructor(userRepo: Repository<User>, profileRepo: Repository<StudentProfile>);
    getMe(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: import("./user.entity").UserRole;
        email_verified: boolean;
        profile: StudentProfile;
        created_at: Date;
        updated_at: Date;
    }>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: import("./user.entity").UserRole;
        email_verified: boolean;
        profile: StudentProfile;
        created_at: Date;
        updated_at: Date;
    }>;
    findAll(): Promise<User[]>;
    deleteUser(userId: number): Promise<{
        message: string;
    }>;
}
