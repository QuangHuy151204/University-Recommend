import { Module } from '@nestjs/common';
import { AdminConfigService } from './admin-config.service';

@Module({
  providers: [AdminConfigService],
  exports: [AdminConfigService],
})
export class AdminConfigModule {}
