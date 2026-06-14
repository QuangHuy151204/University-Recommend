import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CutoffScore } from './cutoff-score.entity';
import { AdmissionMethodsService } from '../admission-methods/admission-methods.service';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import {
  CUTOFF_FILTER_YEARS,
  splitSubjectCombination,
} from '../common/subject-combination';
import { QueryCutoffAdminDto } from './cutoff-admin.dto';

export class CreateCutoffScoreDto {
  @IsNumber()
  university_major_id: number;

  @IsNumber()
  @Min(2015)
  @Max(2030)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(30)
  score: number;

  @IsOptional()
  @IsString()
  admission_method?: string;

  @IsOptional()
  @IsString()
  subject_combination?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateCutoffScoreDto {
  @IsOptional()
  @IsNumber()
  @Min(2015)
  @Max(2030)
  year?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(30)
  score?: number;

  @IsOptional()
  @IsString()
  admission_method?: string;

  @IsOptional()
  @IsString()
  subject_combination?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export interface CutoffQueryFilters {
  year?: number;
  admission_method?: string;
  method_code?: string;
}

@Injectable()
export class CutoffScoresService {
  constructor(
    @InjectRepository(CutoffScore)
    private readonly cutoffRepo: Repository<CutoffScore>,
    private readonly admissionMethodsService: AdmissionMethodsService,
  ) {}

  async create(dto: CreateCutoffScoreDto): Promise<CutoffScore> {
    const score = this.cutoffRepo.create({
      year: dto.year,
      score: dto.score,
      admission_method: dto.admission_method,
      subject_combination: dto.subject_combination,
      note: dto.note,
      universityMajor: {
        id: dto.university_major_id,
      } as CutoffScore['universityMajor'],
    });
    return this.cutoffRepo.save(score);
  }

  async update(id: number, dto: UpdateCutoffScoreDto): Promise<CutoffScore> {
    const row = await this.cutoffRepo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Không tìm thấy điểm chuẩn id ${id}`);
    }
    if (dto.year !== undefined) row.year = dto.year;
    if (dto.score !== undefined) row.score = dto.score;
    if (dto.admission_method !== undefined)
      row.admission_method = dto.admission_method;
    if (dto.subject_combination !== undefined) {
      row.subject_combination = dto.subject_combination;
    }
    if (dto.note !== undefined) row.note = dto.note;
    return this.cutoffRepo.save(row);
  }

  async remove(id: number): Promise<{ message: string }> {
    const row = await this.cutoffRepo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Không tìm thấy điểm chuẩn id ${id}`);
    }
    await this.cutoffRepo.delete(id);
    return { message: `Đã xóa điểm chuẩn id ${id}` };
  }

  private async applyMethodFilter(
    qb: SelectQueryBuilder<CutoffScore>,
    filters?: CutoffQueryFilters,
  ): Promise<void> {
    if (!filters) return;

    const label = await this.admissionMethodsService.resolveLabel(
      filters.method_code,
      filters.admission_method,
    );
    if (!label) return;

    qb.andWhere('cs.admission_method ILIKE :methodLabel', {
      methodLabel: `%${label}%`,
    });
  }

  async findByUniversity(
    universityId: number,
    filters?: CutoffQueryFilters,
  ): Promise<CutoffScore[]> {
    const qb = this.cutoffRepo
      .createQueryBuilder('cs')
      .leftJoinAndSelect('cs.universityMajor', 'um')
      .leftJoinAndSelect('um.university', 'u')
      .leftJoinAndSelect('um.major', 'm')
      .where('u.id = :universityId', { universityId });

    if (filters?.year) qb.andWhere('cs.year = :year', { year: filters.year });
    await this.applyMethodFilter(qb, filters);

    return qb.orderBy('cs.year', 'DESC').getMany();
  }

  async findByMajor(
    majorId: number,
    filters?: CutoffQueryFilters,
  ): Promise<CutoffScore[]> {
    const qb = this.cutoffRepo
      .createQueryBuilder('cs')
      .leftJoinAndSelect('cs.universityMajor', 'um')
      .leftJoinAndSelect('um.university', 'u')
      .leftJoinAndSelect('um.major', 'm')
      .where('m.id = :majorId', { majorId });

    if (filters?.year) qb.andWhere('cs.year = :year', { year: filters.year });
    await this.applyMethodFilter(qb, filters);

    return qb.orderBy('cs.score', 'DESC').getMany();
  }

  /**
   * Danh sách tổ hợp môn distinct từ cutoff_scores (2023–2025) — dùng cho bộ lọc FE.
   * Tách các giá trị ghép (D01/D03, A00, A01) thành từng mã.
   */
  async findAllAdmin(query: QueryCutoffAdminDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.cutoffRepo
      .createQueryBuilder('cs')
      .leftJoinAndSelect('cs.universityMajor', 'um')
      .leftJoinAndSelect('um.university', 'u')
      .leftJoinAndSelect('um.major', 'm');

    if (query.university_id) {
      qb.andWhere('u.id = :universityId', {
        universityId: query.university_id,
      });
    }
    if (query.year) {
      qb.andWhere('cs.year = :year', { year: query.year });
    }
    await this.applyMethodFilter(qb, {
      method_code: query.method_code,
      admission_method: query.admission_method,
    });

    const total = await qb.getCount();
    const data = await qb
      .orderBy('cs.year', 'DESC')
      .addOrderBy('u.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async listSubjectCombinations(
    search?: string,
  ): Promise<Array<{ code: string; count: number }>> {
    const years = [...CUTOFF_FILTER_YEARS];
    const rows = await this.cutoffRepo
      .createQueryBuilder('cs')
      .select('cs.subject_combination', 'raw')
      .addSelect('COUNT(*)', 'cnt')
      .where('cs.year IN (:...years)', { years })
      .andWhere('cs.subject_combination IS NOT NULL')
      .andWhere("TRIM(cs.subject_combination) <> ''")
      .groupBy('cs.subject_combination')
      .getRawMany<{ raw: string; cnt: string }>();

    const counts = new Map<string, number>();
    for (const row of rows) {
      const parts = splitSubjectCombination(row.raw);
      const n = Number(row.cnt) || 0;
      for (const part of parts) {
        counts.set(part, (counts.get(part) ?? 0) + n);
      }
    }

    let codes = [...counts.entries()]
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));

    const q = search?.trim().toUpperCase();
    if (q) {
      codes = codes.filter((c) => c.code.includes(q));
    }

    return codes;
  }
}
