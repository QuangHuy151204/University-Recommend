import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CutoffScoresController } from './cutoff-scores.controller';
import { CutoffScoresService } from './cutoff-scores.service';
import { CutoffScore } from './cutoff-score.entity';
import { AdmissionMethodsModule } from '../admission-methods/admission-methods.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CutoffScore]),
    AdmissionMethodsModule,
    AuthModule,
  ],
  controllers: [CutoffScoresController],
  providers: [CutoffScoresService],
  exports: [CutoffScoresService],
})
export class CutoffScoresModule {}
