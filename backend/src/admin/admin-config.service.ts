import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminConfigService {
  readonly seedEnabled: boolean;
  readonly username: string;
  readonly email: string;
  readonly password: string | null;

  constructor(private readonly configService: ConfigService) {
    this.seedEnabled =
      this.configService.get('ADMIN_SEED_ENABLED', 'true') === 'true';
    this.username = this.configService.get('ADMIN_USERNAME', 'Admin').trim();
    this.email = this.configService
      .get('ADMIN_EMAIL', 'admin@system.local')
      .trim()
      .toLowerCase();
    const pwd = this.configService.get<string>('ADMIN_PASSWORD', '')?.trim();
    this.password = pwd || null;
  }

  get canSeed(): boolean {
    return this.seedEnabled && !!this.password;
  }
}
