import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { AdminConfigService } from './admin-config.service';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly adminConfig: AdminConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureDefaultAdmin();
  }

  private async ensureDefaultAdmin(): Promise<void> {
    if (!this.adminConfig.canSeed) {
      if (this.adminConfig.seedEnabled && !this.adminConfig.password) {
        this.logger.warn(
          'Bỏ qua seed admin: chưa đặt ADMIN_PASSWORD trong .env',
        );
      }
      return;
    }

    const { username, email, password } = this.adminConfig;
    let user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      user = await this.userRepo.findOne({
        where: { name: username, role: UserRole.ADMIN },
      });
    }

    const passwordHash = await bcrypt.hash(password!, 10);

    if (!user) {
      user = this.userRepo.create({
        name: username,
        email,
        password_hash: passwordHash,
        role: UserRole.ADMIN,
        email_verified: true,
      });
      await this.userRepo.save(user);
      this.logger.log(
        `Đã tạo tài khoản admin: username "${username}", email ${email}`,
      );
      return;
    }

    let changed = false;
    if (user.role !== UserRole.ADMIN) {
      user.role = UserRole.ADMIN;
      changed = true;
    }
    if (!user.email_verified) {
      user.email_verified = true;
      changed = true;
    }
    if (user.name !== username) {
      user.name = username;
      changed = true;
    }
    if (user.email !== email) {
      user.email = email;
      changed = true;
    }

    const passwordOk = await bcrypt.compare(password!, user.password_hash);
    if (!passwordOk) {
      user.password_hash = passwordHash;
      changed = true;
    }

    if (changed) {
      await this.userRepo.save(user);
      this.logger.log('Đã đồng bộ tài khoản admin từ biến môi trường');
    }
  }
}
