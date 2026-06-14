import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionMethod } from './admission-method.entity';
import { AdmissionMethodsController } from './admission-methods.controller';
import { AdmissionMethodsService } from './admission-methods.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdmissionMethod]), AuthModule],
  controllers: [AdmissionMethodsController],
  providers: [AdmissionMethodsService],
  exports: [AdmissionMethodsService],
})
export class AdmissionMethodsModule {}
