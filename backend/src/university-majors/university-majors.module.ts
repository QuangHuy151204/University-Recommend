import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityMajorsController } from './university-majors.controller';
import { UniversityMajorsService } from './university-majors.service';
import { UniversityMajor } from '../majors/university-major.entity';
import { University } from '../universities/university.entity';
import { Major } from '../majors/major.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UniversityMajor, University, Major]),
    AuthModule,
  ],
  controllers: [UniversityMajorsController],
  providers: [UniversityMajorsService],
  exports: [UniversityMajorsService],
})
export class UniversityMajorsModule {}
