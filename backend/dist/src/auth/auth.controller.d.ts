import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AdminLoginDto, VerifyEmailDto, ResendVerificationDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        email: string;
    }>;
    verifyEmail(dto: VerifyEmailDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: import("../users/user.entity").UserRole;
            email_verified: boolean;
        };
    }>;
    resendVerification(dto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: import("../users/user.entity").UserRole;
            email_verified: boolean;
        };
    }>;
    adminLogin(dto: AdminLoginDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: import("../users/user.entity").UserRole;
            email_verified: boolean;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    private setAccessCookie;
    private accessCookieOptions;
}
