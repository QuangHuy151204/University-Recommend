import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MajorsController } from './majors.controller';
import { MajorsService } from './majors.service';
import { Major } from './major.entity';
import { UniversityMajor } from './university-major.entity';
import { MajorGroup } from './major-group.entity';
import { MajorGroupAssignment } from './major-group-assignment.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Major,
      UniversityMajor,
      MajorGroup,
      MajorGroupAssignment,
    ]),
    AuthModule,
  ],
  controllers: [MajorsController],
  providers: [MajorsService],
  exports: [MajorsService],
})
export class MajorsModule {}
