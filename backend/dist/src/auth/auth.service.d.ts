import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { AuthToken } from './auth-token.entity';
import { RegisterDto, LoginDto, AdminLoginDto, VerifyEmailDto, ResendVerificationDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import { UserRole } from '../users/user.entity';
import { AdminConfigService } from '../admin/admin-config.service';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly userRepo;
    private readonly tokenRepo;
    private readonly jwtService;
    private readonly mailService;
    private readonly adminConfig;
    constructor(userRepo: Repository<User>, tokenRepo: Repository<AuthToken>, jwtService: JwtService, mailService: MailService, adminConfig: AdminConfigService);
    register(dto: RegisterDto): Promise<{
        message: string;
        email: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: UserRole;
            email_verified: boolean;
        };
    }>;
    resendVerification(dto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: UserRole;
            email_verified: boolean;
        };
    }>;
    adminLogin(dto: AdminLoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: UserRole;
            email_verified: boolean;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private generateToken;
    private generateCode;
    private issueAndSendCode;
    private consumeCode;
    findById(id: number): Promise<User | null>;
}
