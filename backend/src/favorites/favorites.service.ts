import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserFavorite } from './user-favorite.entity';
import { University } from '../universities/university.entity';
import { UniversityMajor } from '../majors/university-major.entity';
import { relationStub } from '../common/typeorm-relations';
import { User } from '../users/user.entity';
import { AddFavoriteDto } from './favorites.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(UserFavorite)
    private readonly favoriteRepo: Repository<UserFavorite>,
    @InjectRepository(University)
    private readonly universityRepo: Repository<University>,
    @InjectRepository(UniversityMajor)
    private readonly uniMajorRepo: Repository<UniversityMajor>,
  ) {}

  async listForUser(userId: number) {
    const rows = await this.favoriteRepo.find({
      where: { user_id: userId },
      relations: [
        'university',
        'universityMajor',
        'universityMajor.major',
        'universityMajor.university',
      ],
      order: { created_at: 'DESC' },
    });
    return rows.map((row) => ({
      id: row.id,
      university_id: row.university_id,
      university_major_id: row.university_major_id,
      favorite_type: row.university_major_id ? 'program' : 'university',
      created_at: row.created_at,
      university: row.university,
      university_major: row.universityMajor
        ? {
            id: row.universityMajor.id,
            training_program: row.universityMajor.training_program,
            duration: row.universityMajor.duration,
            tuition_fee: row.universityMajor.tuition_fee,
            major: row.universityMajor.major,
            university: row.universityMajor.university ?? row.university,
          }
        : null,
    }));
  }

  async add(userId: number, dto: AddFavoriteDto) {
    if (dto.university_major_id) {
      return this.addProgram(userId, dto.university_major_id);
    }
    if (dto.university_id) {
      return this.addUniversity(userId, dto.university_id);
    }
    throw new BadRequestException(
      'Cần university_id (trường) hoặc university_major_id (ngành tại trường)',
    );
  }

  private async addUniversity(userId: number, universityId: number) {
    const university = await this.universityRepo.findOne({
      where: { id: universityId },
    });
    if (!university) {
      throw new NotFoundException('Không tìm thấy trường đại học');
    }

    const existed = await this.favoriteRepo.findOne({
      where: {
        user_id: userId,
        university_id: universityId,
        university_major_id: IsNull(),
      },
    });
    if (existed) {
      throw new ConflictException('Trường này đã có trong danh sách yêu thích');
    }

    const row = this.favoriteRepo.create({
      user_id: userId,
      university_id: universityId,
      university_major_id: null,
      user: relationStub<User>(userId),
      university,
    });
    await this.favoriteRepo.save(row);
    return {
      id: row.id,
      university_id: universityId,
      university_major_id: null,
      favorite_type: 'university' as const,
      university,
      university_major: null,
    };
  }

  private async addProgram(userId: number, universityMajorId: number) {
    const link = await this.uniMajorRepo.findOne({
      where: { id: universityMajorId },
      relations: ['major', 'university'],
    });
    if (!link?.university) {
      throw new NotFoundException('Không tìm thấy chương trình đào tạo');
    }

    const existed = await this.favoriteRepo.findOne({
      where: { user_id: userId, university_major_id: universityMajorId },
    });
    if (existed) {
      throw new ConflictException('Ngành này đã có trong danh sách yêu thích');
    }

    const row = this.favoriteRepo.create({
      user_id: userId,
      university_id: link.university.id,
      university_major_id: universityMajorId,
      user: relationStub<User>(userId),
      university: link.university,
      universityMajor: link,
    });
    await this.favoriteRepo.save(row);
    return {
      id: row.id,
      university_id: link.university.id,
      university_major_id: universityMajorId,
      favorite_type: 'program' as const,
      university: link.university,
      university_major: {
        id: link.id,
        training_program: link.training_program,
        duration: link.duration,
        tuition_fee: link.tuition_fee,
        major: link.major,
        university: link.university,
      },
    };
  }

  async remove(userId: number, favoriteId: number) {
    const row = await this.favoriteRepo.findOne({
      where: { id: favoriteId, user_id: userId },
    });
    if (!row) {
      throw new NotFoundException('Không tìm thấy mục yêu thích');
    }
    await this.favoriteRepo.delete(row.id);
    return { message: 'Đã xóa khỏi yêu thích' };
  }

  async removeByUniversity(userId: number, universityId: number) {
    const row = await this.favoriteRepo.findOne({
      where: {
        user_id: userId,
        university_id: universityId,
        university_major_id: IsNull(),
      },
    });
    if (!row) {
      throw new NotFoundException('Trường chưa có trong yêu thích');
    }
    await this.favoriteRepo.delete(row.id);
    return { message: 'Đã xóa khỏi yêu thích' };
  }

  async removeByUniversityMajor(userId: number, universityMajorId: number) {
    const row = await this.favoriteRepo.findOne({
      where: { user_id: userId, university_major_id: universityMajorId },
    });
    if (!row) {
      throw new NotFoundException('Ngành chưa có trong yêu thích');
    }
    await this.favoriteRepo.delete(row.id);
    return { message: 'Đã xóa khỏi yêu thích' };
  }
}
