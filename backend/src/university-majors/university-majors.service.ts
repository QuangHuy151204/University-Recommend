import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UniversityMajor } from '../majors/university-major.entity';
import { University } from '../universities/university.entity';
import { Major } from '../majors/major.entity';
import {
  CreateUniversityMajorDto,
  UpdateUniversityMajorDto,
  QueryUniversityMajorDto,
} from './university-major.dto';

@Injectable()
export class UniversityMajorsService {
  constructor(
    @InjectRepository(UniversityMajor)
    private readonly repo: Repository<UniversityMajor>,
    @InjectRepository(University)
    private readonly universityRepo: Repository<University>,
    @InjectRepository(Major)
    private readonly majorRepo: Repository<Major>,
  ) {}

  async create(dto: CreateUniversityMajorDto): Promise<UniversityMajor> {
    const university = await this.universityRepo.findOne({
      where: { id: dto.university_id },
    });
    if (!university) {
      throw new NotFoundException(
        `Không tìm thấy trường id ${dto.university_id}`,
      );
    }

    const major = await this.majorRepo.findOne({ where: { id: dto.major_id } });
    if (!major) {
      throw new NotFoundException(`Không tìm thấy ngành id ${dto.major_id}`);
    }

    // Chống trùng cặp (university, major, training_program)
    const existed = await this.repo
      .createQueryBuilder('um')
      .where('um.university_id = :uId', { uId: dto.university_id })
      .andWhere('um.major_id = :mId', { mId: dto.major_id })
      .andWhere(
        dto.training_program
          ? 'um.training_program = :tp'
          : 'um.training_program IS NULL',
        dto.training_program ? { tp: dto.training_program } : {},
      )
      .getOne();
    if (existed) {
      throw new ConflictException(
        `Cặp (university_id=${dto.university_id}, major_id=${dto.major_id}, training_program=${dto.training_program ?? 'NULL'}) đã tồn tại (id=${existed.id})`,
      );
    }

    const entity = this.repo.create({
      university,
      major,
      training_program: dto.training_program,
      duration: dto.duration,
      tuition_fee: dto.tuition_fee,
      quota: dto.quota,
      admission_methods: dto.admission_methods,
    });
    return this.repo.save(entity);
  }

  async findAll(query: QueryUniversityMajorDto) {
    const {
      university_id,
      major_id,
      training_program,
      page = 1,
      limit = 20,
    } = query;

    const qb = this.repo
      .createQueryBuilder('um')
      .leftJoinAndSelect('um.university', 'u')
      .leftJoinAndSelect('um.major', 'm');

    if (university_id) qb.andWhere('u.id = :university_id', { university_id });
    if (major_id) qb.andWhere('m.id = :major_id', { major_id });
    if (training_program) {
      qb.andWhere('um.training_program ILIKE :tp', {
        tp: `%${training_program}%`,
      });
    }

    const total = await qb.getCount();
    const data = await qb
      .orderBy('u.name', 'ASC')
      .addOrderBy('m.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<UniversityMajor> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['university', 'major', 'cutoffScores'],
    });
    if (!entity) {
      throw new NotFoundException(`Không tìm thấy university-major id ${id}`);
    }
    return entity;
  }

  async update(
    id: number,
    dto: UpdateUniversityMajorDto,
  ): Promise<UniversityMajor> {
    const entity = await this.findOne(id);

    if (dto.university_id && dto.university_id !== entity.university.id) {
      const university = await this.universityRepo.findOne({
        where: { id: dto.university_id },
      });
      if (!university) {
        throw new NotFoundException(
          `Không tìm thấy trường id ${dto.university_id}`,
        );
      }
      entity.university = university;
    }

    if (dto.major_id && dto.major_id !== entity.major.id) {
      const major = await this.majorRepo.findOne({
        where: { id: dto.major_id },
      });
      if (!major) {
        throw new NotFoundException(`Không tìm thấy ngành id ${dto.major_id}`);
      }
      entity.major = major;
    }

    if (dto.training_program !== undefined)
      entity.training_program = dto.training_program;
    if (dto.duration !== undefined) entity.duration = dto.duration;
    if (dto.tuition_fee !== undefined) entity.tuition_fee = dto.tuition_fee;
    if (dto.quota !== undefined) entity.quota = dto.quota;
    if (dto.admission_methods !== undefined)
      entity.admission_methods = dto.admission_methods;

    return this.repo.save(entity);
  }

  async remove(id: number): Promise<{ message: string }> {
    const entity = await this.findOne(id);
    if (entity.cutoffScores && entity.cutoffScores.length > 0) {
      throw new BadRequestException(
        `Không thể xóa university-major id ${id}: còn ${entity.cutoffScores.length} điểm chuẩn liên kết. Hãy xóa cutoff_scores trước.`,
      );
    }
    await this.repo.delete(id);
    return { message: `Đã xóa university-major id ${id}` };
  }
}
