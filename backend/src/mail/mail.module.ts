// @file: NestJS module that registers email verification and password-reset delivery controllers, services, and entities.
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
