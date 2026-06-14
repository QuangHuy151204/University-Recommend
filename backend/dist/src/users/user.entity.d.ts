import { StudentProfile } from './student-profile.entity';
export declare enum UserRole {
    STUDENT = "student",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    email_verified: boolean;
    profile: StudentProfile;
    created_at: Date;
    updated_at: Date;
}
