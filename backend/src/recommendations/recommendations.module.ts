import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { Recommendation } from './recommendation.entity';
import { UniversityMajor } from '../majors/university-major.entity';
import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
import { AdmissionMethodsModule } from '../admission-methods/admission-methods.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recommendation, UniversityMajor, CutoffScore]),
    AdmissionMethodsModule,
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
