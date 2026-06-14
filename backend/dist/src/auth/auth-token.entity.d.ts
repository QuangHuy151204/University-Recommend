import { User } from '../users/user.entity';
export declare enum AuthTokenType {
    EMAIL_VERIFY = "email_verify",
    PASSWORD_RESET = "password_reset"
}
export declare class AuthToken {
    id: number;
    user_id: number;
    user: User;
    type: AuthTokenType;
    code_hash: string;
    expires_at: Date;
    created_at: Date;
}
