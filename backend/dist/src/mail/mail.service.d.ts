import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    private getFromAddress;
    private ensureTransporter;
    sendVerificationCode(email: string, name: string, code: string): Promise<void>;
    sendPasswordResetCode(email: string, name: string, code: string): Promise<void>;
    private sendMail;
}
