import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ChatSession } from './chat-session.entity';
import { ChatMessage } from './chat-message.entity';
import { University } from '../universities/university.entity';
import { Major } from '../majors/major.entity';
import { UniversityMajor } from '../majors/university-major.entity';
import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
import { OllamaModule } from '../ollama/ollama.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { AdmissionMethodsModule } from '../admission-methods/admission-methods.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ChatSession,
      ChatMessage,
      University,
      Major,
      UniversityMajor,
      CutoffScore,
    ]),
    OllamaModule,
    RecommendationsModule,
    AdmissionMethodsModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
