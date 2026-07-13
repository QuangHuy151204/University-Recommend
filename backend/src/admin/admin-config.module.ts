// @file: NestJS module that registers admin dashboard and system statistics controllers, services, and entities.
import { Module } from '@nestjs/common';
import { AdminConfigService } from './admin-config.service';

@Module({
  providers: [AdminConfigService],
  exports: [AdminConfigService],
})
export class AdminConfigModule {}
