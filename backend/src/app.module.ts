import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UniversitiesModule } from './universities/universities.module';
import { MajorsModule } from './majors/majors.module';
import { UniversityMajorsModule } from './university-majors/university-majors.module';
import { CutoffScoresModule } from './cutoff-scores/cutoff-scores.module';
import { UsersModule } from './users/users.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { AdmissionMethodsModule } from './admission-methods/admission-methods.module';
import { AdminModule } from './admin/admin.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: parseInt(configService.get('THROTTLE_TTL_MS', '60000'), 10),
          limit: parseInt(configService.get('THROTTLE_LIMIT', '120'), 10),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '5432')),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME', 'university_recommend'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        // synchronize: true có thể DROP cột/đổi kiểu ngầm → chỉ bật tạm qua DB_SYNCHRONIZE=true
        synchronize: configService.get('DB_SYNCHRONIZE', 'false') === 'true',
        migrationsRun:
          configService.get('DB_MIGRATIONS_RUN', 'true') === 'true',
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UniversitiesModule,
    MajorsModule,
    UniversityMajorsModule,
    CutoffScoresModule,
    UsersModule,
    RecommendationsModule,
    ChatbotModule,
    AdmissionMethodsModule,
    AdminModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
