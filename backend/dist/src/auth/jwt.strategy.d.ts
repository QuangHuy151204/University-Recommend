import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: {
        sub: number;
        email: string;
        role: string;
    }): Promise<{
        userId: number;
        email: string;
        role: string;
    }>;
}
export {};
