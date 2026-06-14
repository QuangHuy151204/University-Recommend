export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AdminLoginDto {
    username: string;
    password: string;
}
export declare class VerifyEmailDto {
    email: string;
    code: string;
}
export declare class ResendVerificationDto {
    email: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    code: string;
    new_password: string;
}
