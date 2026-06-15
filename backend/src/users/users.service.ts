import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { StudentProfile } from './student-profile.entity';
import { UpdateProfileDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(StudentProfile)
    private readonly profileRepo: Repository<StudentProfile>,
  ) {}

  // Lấy thông tin user + profile
  async getMe(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit password from API response
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  // Cập nhật hoặc tạo mới student profile
  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    let profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
    });

    const scopedDto: UpdateProfileDto = { ...dto };

    if (profile) {
      Object.assign(profile, scopedDto);
    } else {
      profile = this.profileRepo.create({ ...scopedDto, user });
    }

    await this.profileRepo.save(profile);
    return this.getMe(userId);
  }

  // Lấy danh sách tất cả user (Admin)
  async findAll() {
    const users = await this.userRepo.find({
      select: ['id', 'name', 'email', 'role', 'created_at'],
      order: { created_at: 'DESC' },
    });
    return users;
  }

  // Xóa user (Admin)
  async deleteUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    await this.userRepo.delete(userId);
    return { message: `Đã xóa người dùng id ${userId}` };
  }
}
