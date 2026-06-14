import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Cho phép frontend (Next.js) gọi API — gồm 127.0.0.1 (tránh lỗi CORS khi không dùng localhost)
  const corsOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    ...(process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? []),
  ].filter(Boolean);
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Tự động validate DTO với class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Prefix tất cả API với /api
  app.setGlobalPrefix('api');

  // ─── Swagger UI ───────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('University Recommend API')
    .setDescription('API docs cho hệ thống gợi ý trường đại học')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Truy cập tại: http://localhost:3001/api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  // ─────────────────────────────────────────────────────────────────────────

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend đang chạy tại: http://localhost:${port}/api`);
  console.log(`📚 Swagger UI:           http://localhost:${port}/api/docs`);
}
void bootstrap();
