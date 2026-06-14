import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminSeedService } from './admin-seed.service';
import { AdminConfigModule } from './admin-config.module';
import { University } from '../universities/university.entity';
import { Major } from '../majors/major.entity';
import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([University, Major, CutoffScore, User]),
    AdminConfigModule,
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminSeedService],
})
export class AdminModule {}
