import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { University } from './university.entity';
import { Major } from '../majors/major.entity';
import { filterMajorIdsBySelectionName } from '../majors/major-name-match';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
  QueryUniversityDto,
} from './university.dto';
import { DATA_SCOPE_LOCATION } from '../common/data-scope';
import { applyUniversityDisplayOrder } from '../common/university-display-order';
import {
  CUTOFF_FILTER_YEARS,
  subjectCombinationSqlMatch,
} from '../common/subject-combination';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepo: Repository<University>,
    @InjectRepository(Major)
    private readonly majorRepo: Repository<Major>,
  ) {}

  // Tạo trường mới (Admin)
  async create(dto: CreateUniversityDto): Promise<University> {
    const university = this.universityRepo.create(dto);
    return this.universityRepo.save(university);
  }

  // Danh sách trường + tìm kiếm + lọc + phân trang
  async findAll(query: QueryUniversityDto) {
    const {
      search,
      location,
      ward,
      type,
      max_tuition,
      subject_combination,
      min_score,
      major_id,
      page = 1,
      limit = 10,
      prefer_short_name,
    } = query;

    const qb = this.universityRepo.createQueryBuilder('u');

    qb.andWhere('u.location ILIKE :scopeLocation', {
      scopeLocation: `%${DATA_SCOPE_LOCATION}%`,
    });

    if (search) {
      qb.andWhere('(u.name ILIKE :search OR u.short_name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (location) {
      qb.andWhere('u.location ILIKE :location', { location: `%${location}%` });
    }

    if (ward) {
      qb.andWhere('u.ward ILIKE :ward', { ward: `%${ward}%` });
    }

    if (type) {
      qb.andWhere('u.type = :type', { type });
    }

    if (max_tuition) {
      qb.andWhere('u.tuition_fee_min <= :max_tuition', { max_tuition });
    }

    const majorIds = await this.resolveMajorIdsForFilter(major_id);
    this.applyCutoffFilters(qb, subject_combination, min_score, majorIds);

    const total = await qb.getCount();
    const pageQb = qb.skip((page - 1) * limit).take(limit);
    if (prefer_short_name?.trim()) {
      applyUniversityDisplayOrder(pageQb, 'u', prefer_short_name.trim());
    } else {
      pageQb.orderBy('u.name', 'ASC');
    }
    const data = await pageQb.getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Chi tiết 1 trường
  async findOne(id: number): Promise<University> {
    const university = await this.universityRepo.findOne({
      where: { id },
      relations: [
        'universityMajors',
        'universityMajors.major',
        'universityMajors.cutoffScores',
      ],
    });

    if (!university)
      throw new NotFoundException(`Không tìm thấy trường với id ${id}`);
    return university;
  }

  // Cập nhật thông tin trường (Admin)
  async update(id: number, dto: UpdateUniversityDto): Promise<University> {
    const university = await this.findOne(id);
    Object.assign(university, dto);
    return this.universityRepo.save(university);
  }

  // Xóa trường (Admin)
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.universityRepo.delete(id);
    return { message: `Đã xóa trường id ${id}` };
  }

  /** Danh sách phường có trường — dùng dropdown gợi ý / hồ sơ */
  async listWards(): Promise<{ data: string[] }> {
    const rows = await this.universityRepo
      .createQueryBuilder('u')
      .select('DISTINCT u.ward', 'ward')
      .where('u.ward IS NOT NULL')
      .andWhere("TRIM(u.ward) <> ''")
      .andWhere('u.location ILIKE :scopeLocation', {
        scopeLocation: `%${DATA_SCOPE_LOCATION}%`,
      })
      .orderBy('u.ward', 'ASC')
      .getRawMany<{ ward: string }>();

    return { data: rows.map((r) => r.ward) };
  }

  /** Mở rộng major_id đã chọn sang các biến thể tên ngành trong catalog. */
  private async resolveMajorIdsForFilter(
    major_id?: number,
  ): Promise<number[] | undefined> {
    if (major_id == null || !Number.isInteger(major_id) || major_id <= 0) {
      return undefined;
    }
    const selected = await this.majorRepo.findOne({
      where: { id: major_id },
      select: ['id', 'name'],
    });
    if (!selected) return [major_id];

    const catalog = await this.majorRepo.find({ select: ['id', 'name'] });
    const ids = filterMajorIdsBySelectionName(catalog, selected.name);
    return ids.length > 0 ? ids : [major_id];
  }

  /** Lọc trường có điểm chuẩn 2023–2025 khớp tổ hợp / mức điểm người dùng nhập. */
  private applyCutoffFilters(
    qb: SelectQueryBuilder<University>,
    subject_combination?: string,
    min_score?: number,
    majorIds?: number[],
  ): void {
    const combo = subject_combination?.trim();
    const hasScore =
      min_score != null && Number.isFinite(min_score) && min_score > 0;
    const hasMajor = majorIds != null && majorIds.length > 0;
    if (!combo && !hasScore && !hasMajor) return;

    const cutoffYears = [...CUTOFF_FILTER_YEARS];
    const sub = this.universityRepo
      .createQueryBuilder('su')
      .select('su.id')
      .innerJoin('su.universityMajors', 'sum');

    if (hasMajor) {
      sub.andWhere('sum.major_id IN (:...majorIds)', { majorIds });
    }

    if (combo || hasScore) {
      if (hasScore) {
        const latestSub = this.universityRepo.manager
          .createQueryBuilder()
          .select('csly.university_major_id', 'university_major_id')
          .addSelect('MAX(csly.year)', 'max_year')
          .from('cutoff_scores', 'csly')
          .where('csly.year IN (:...cutoffYears)', { cutoffYears });

        if (combo) {
          latestSub.andWhere(
            subjectCombinationSqlMatch('csly.subject_combination', 'combo'),
            { combo },
          );
        }

        latestSub.groupBy('csly.university_major_id');

        sub.innerJoin(
          `(${latestSub.getQuery()})`,
          'lc',
          'lc.university_major_id = sum.id',
        );
        sub.innerJoin(
          'cutoff_scores',
          'scs',
          'scs.university_major_id = sum.id AND scs.year = lc.max_year',
        );
        if (combo) {
          sub.andWhere(
            subjectCombinationSqlMatch('scs.subject_combination', 'combo'),
          );
        }
        sub.andWhere('scs.score <= :minScore', { minScore: min_score });
        for (const [key, value] of Object.entries(latestSub.getParameters())) {
          sub.setParameter(key, value);
        }
      } else {
        sub.innerJoin('sum.cutoffScores', 'scs');
        sub.andWhere('scs.year IN (:...cutoffYears)', { cutoffYears });
        sub.andWhere(
          subjectCombinationSqlMatch('scs.subject_combination', 'combo'),
          { combo },
        );
      }
    }

    qb.andWhere(`u.id IN (${sub.getQuery()})`);
    for (const [key, value] of Object.entries(sub.getParameters())) {
      qb.setParameter(key, value);
    }
  }
}
