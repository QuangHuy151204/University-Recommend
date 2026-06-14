import { UsersService } from './users.service';
import { UpdateProfileDto } from './users.dto';
import { UserRole } from './user.entity';
import type { AuthenticatedRequest } from '../auth/jwt-user.types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: AuthenticatedRequest): Promise<{
        id: number;
        name: string;
        email: string;
        role: UserRole;
        email_verified: boolean;
        profile: import("./student-profile.entity").StudentProfile;
        created_at: Date;
        updated_at: Date;
    }>;
    updateProfile(req: AuthenticatedRequest, dto: UpdateProfileDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: UserRole;
        email_verified: boolean;
        profile: import("./student-profile.entity").StudentProfile;
        created_at: Date;
        updated_at: Date;
    }>;
    findAll(): Promise<import("./user.entity").User[]>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
}
