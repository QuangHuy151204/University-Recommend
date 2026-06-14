import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { User } from '../users/user.entity';
import { AuthToken, AuthTokenType } from './auth-token.entity';
import {
  RegisterDto,
  LoginDto,
  AdminLoginDto,
  VerifyEmailDto,
  ResendVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './auth.dto';
import { UserRole } from '../users/user.entity';
import { AdminConfigService } from '../admin/admin-config.service';
import { MailService } from '../mail/mail.service';

const CODE_TTL_MS = 15 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(AuthToken)
    private readonly tokenRepo: Repository<AuthToken>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly adminConfig: AdminConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.name.trim(),
      email,
      password_hash: passwordHash,
      email_verified: false,
    });
    await this.userRepo.save(user);

    await this.issueAndSendCode(user, AuthTokenType.EMAIL_VERIFY);

    return {
      message:
        'Đăng ký thành công. Vui lòng kiểm tra email và nhập mã xác nhận 6 chữ số.',
      email: user.email,
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
    }
    if (user.email_verified) {
      return this.generateToken(user);
    }

    const valid = await this.consumeCode(
      user.id,
      AuthTokenType.EMAIL_VERIFY,
      dto.code,
    );
    if (!valid) {
      throw new BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
    }

    user.email_verified = true;
    await this.userRepo.save(user);

    return this.generateToken(user);
  }

  async resendVerification(dto: ResendVerificationDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      return { message: 'Nếu email tồn tại, mã xác nhận đã được gửi lại.' };
    }
    if (user.email_verified) {
      throw new BadRequestException('Email đã được xác nhận');
    }

    await this.issueAndSendCode(user, AuthTokenType.EMAIL_VERIFY);

    return { message: 'Nếu email tồn tại, mã xác nhận đã được gửi lại.' };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!user.email_verified) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Vui lòng xác nhận email trước khi đăng nhập.',
        error: 'EMAIL_NOT_VERIFIED',
        email: user.email,
      });
    }

    return this.generateToken(user);
  }

  async adminLogin(dto: AdminLoginDto) {
    const username = dto.username.trim();
    const emailCandidate = username.toLowerCase();

    let user =
      (await this.userRepo.findOne({
        where: { email: emailCandidate, role: UserRole.ADMIN },
      })) ??
      (await this.userRepo
        .createQueryBuilder('u')
        .where('u.role = :role', { role: UserRole.ADMIN })
        .andWhere('LOWER(u.name) = LOWER(:name)', { name: username })
        .getOne());

    if (
      !user &&
      username.toLowerCase() === this.adminConfig.username.toLowerCase()
    ) {
      user = await this.userRepo.findOne({
        where: { email: this.adminConfig.email },
      });
    }

    if (!user || user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    if (!user.email_verified) {
      user.email_verified = true;
      await this.userRepo.save(user);
    }

    return this.generateToken(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email } });
    if (user) {
      await this.issueAndSendCode(user, AuthTokenType.PASSWORD_RESET);
    }

    return {
      message:
        'Nếu email tồn tại trong hệ thống, mã đặt lại mật khẩu đã được gửi.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
    }

    const valid = await this.consumeCode(
      user.id,
      AuthTokenType.PASSWORD_RESET,
      dto.code,
    );
    if (!valid) {
      throw new BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
    }

    user.password_hash = await bcrypt.hash(dto.new_password, 10);
    await this.userRepo.save(user);

    return { message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập.' };
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        email_verified: user.email_verified,
      },
    };
  }

  private generateCode(): string {
    return String(randomInt(100000, 1000000));
  }

  private async issueAndSendCode(
    user: User,
    type: AuthTokenType,
  ): Promise<void> {
    await this.tokenRepo.delete({ user_id: user.id, type });
    await this.tokenRepo.delete({
      expires_at: LessThan(new Date()),
    });

    const code = this.generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + CODE_TTL_MS);

    await this.tokenRepo.save(
      this.tokenRepo.create({
        user_id: user.id,
        type,
        code_hash: codeHash,
        expires_at: expiresAt,
      }),
    );

    if (type === AuthTokenType.EMAIL_VERIFY) {
      await this.mailService.sendVerificationCode(user.email, user.name, code);
    } else {
      await this.mailService.sendPasswordResetCode(user.email, user.name, code);
    }
  }

  private async consumeCode(
    userId: number,
    type: AuthTokenType,
    code: string,
  ): Promise<boolean> {
    const row = await this.tokenRepo.findOne({
      where: { user_id: userId, type },
      order: { created_at: 'DESC' },
    });
    if (!row || row.expires_at < new Date()) {
      if (row) await this.tokenRepo.delete({ id: row.id });
      return false;
    }

    const match = await bcrypt.compare(code, row.code_hash);
    await this.tokenRepo.delete({ id: row.id });
    return match;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}
