import { ConfigService } from '@nestjs/config';
export declare class AdminConfigService {
    private readonly configService;
    readonly seedEnabled: boolean;
    readonly username: string;
    readonly email: string;
    readonly password: string | null;
    constructor(configService: ConfigService);
    get canSeed(): boolean;
}
