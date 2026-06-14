import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  private getFromAddress(): string {
    const from = this.config.get<string>('SMTP_FROM');
    const name = this.config.get<string>(
      'MAIL_FROM_NAME',
      'University Recommend',
    );
    if (from?.includes('<')) return from;
    return from ? `"${name}" <${from}>` : `"${name}" <noreply@localhost>`;
  }

  private ensureTransporter(): Transporter | null {
    if (this.transporter) return this.transporter;

    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (!host) return null;

    const port = parseInt(this.config.get<string>('SMTP_PORT', '587'), 10);
    const secure = this.config.get<string>('SMTP_SECURE', 'false') === 'true';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user ? { user, pass } : undefined,
    });

    return this.transporter;
  }

  async sendVerificationCode(
    email: string,
    name: string,
    code: string,
  ): Promise<void> {
    const subject = 'Mã xác nhận tài khoản — University Recommend';
    const text = [
      `Xin chào ${name},`,
      '',
      'Cảm ơn bạn đã đăng ký University Recommend.',
      `Mã xác nhận email của bạn: ${code}`,
      'Mã có hiệu lực 15 phút.',
      '',
      'Nếu bạn không đăng ký, hãy bỏ qua email này.',
    ].join('\n');

    await this.sendMail(email, subject, text, code, 'verify');
  }

  async sendPasswordResetCode(
    email: string,
    name: string,
    code: string,
  ): Promise<void> {
    const subject = 'Mã đặt lại mật khẩu — University Recommend';
    const text = [
      `Xin chào ${name},`,
      '',
      'Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu.',
      `Mã xác nhận: ${code}`,
      'Mã có hiệu lực 15 phút.',
      '',
      'Nếu bạn không yêu cầu, hãy bỏ qua email này.',
    ].join('\n');

    await this.sendMail(email, subject, text, code, 'reset');
  }

  private async sendMail(
    to: string,
    subject: string,
    text: string,
    code: string,
    kind: 'verify' | 'reset',
  ): Promise<void> {
    const devLog = this.config.get<string>('MAIL_DEV_LOG', 'true') === 'true';
    const transporter = this.ensureTransporter();

    if (!transporter) {
      if (devLog) {
        this.logger.warn(
          `[MAIL_DEV] SMTP chưa cấu hình — ${kind} → ${to}: mã ${code}`,
        );
      }
      return;
    }

    try {
      await transporter.sendMail({
        from: this.getFromAddress(),
        to,
        subject,
        text,
      });
      this.logger.log(`Đã gửi email ${kind} tới ${to}`);
    } catch (err) {
      this.logger.error(`Gửi email thất bại (${to})`, err);
      if (devLog) {
        this.logger.warn(`[MAIL_DEV] fallback mã ${kind}: ${code}`);
      } else {
        throw err;
      }
    }
  }
}
