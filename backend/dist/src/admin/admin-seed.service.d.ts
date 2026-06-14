import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AdminConfigService } from './admin-config.service';
export declare class AdminSeedService implements OnModuleInit {
    private readonly userRepo;
    private readonly adminConfig;
    private readonly logger;
    constructor(userRepo: Repository<User>, adminConfig: AdminConfigService);
    onModuleInit(): Promise<void>;
    private ensureDefaultAdmin;
}
