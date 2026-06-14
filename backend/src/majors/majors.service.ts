import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Major } from './major.entity';
import { UniversityMajor } from './university-major.entity';
import { MajorGroup } from './major-group.entity';
import { MajorGroupAssignment } from './major-group-assignment.entity';
import { IsString, IsOptional } from 'class-validator';
import { QueryMajorDto } from './major.dto';
import {
  classifyMajor,
  groupToSlug,
  normalizeGroupSlug,
  resolveGroupSlug,
} from './major-normalization';
import { KHAC_GROUP_ID } from './major-groups-catalog';

export class CreateMajorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  career_orientation?: string;

  @IsOptional()
  @IsString()
  required_skills?: string;

  @IsOptional()
  @IsString()
  field_group?: string;
}

export type MajorWithGroups = Major & {
  groups: Array<{ group_id: string; group_name: string; is_primary: boolean }>;
};

@Injectable()
export class MajorsService {
  constructor(
    @InjectRepository(Major)
    private readonly majorRepo: Repository<Major>,
    @InjectRepository(UniversityMajor)
    private readonly uniMajorRepo: Repository<UniversityMajor>,
    @InjectRepository(MajorGroup)
    private readonly groupRepo: Repository<MajorGroup>,
    @InjectRepository(MajorGroupAssignment)
    private readonly assignmentRepo: Repository<MajorGroupAssignment>,
  ) {}

  private async applyClassification(major: Major): Promise<Major> {
    const classification = classifyMajor(major.name, major.field_group);
    major.field_group = classification.primary_group_name;
    major.tags = classification.tags;

    await this.majorRepo.save(major);
    await this.assignmentRepo.delete({ major_id: major.id });

    const assignments = classification.group_ids
      .filter((gid) => gid !== KHAC_GROUP_ID)
      .map((groupId, index) =>
        this.assignmentRepo.create({
          major_id: major.id,
          group_id: groupId,
          is_primary: index === 0,
        }),
      );

    if (assignments.length > 0) {
      await this.assignmentRepo.save(assignments);
    }

    return major;
  }

  private enrichMajor(major: Major): MajorWithGroups {
    const assignments = major.groupAssignments ?? [];
    const groups = assignments
      .map((a) => ({
        group_id: a.group_id,
        group_name: a.group?.group_name ?? a.group_id,
        is_primary: a.is_primary,
      }))
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary));

    return { ...major, groups };
  }

  async create(dto: CreateMajorDto): Promise<MajorWithGroups> {
    const major = this.majorRepo.create({
      ...dto,
      tags: [],
    });
    const saved = await this.majorRepo.save(major);
    const classified = await this.applyClassification(saved);
    return this.findOne(classified.id);
  }

  async findGroups() {
    const rows = await this.assignmentRepo
      .createQueryBuilder('a')
      .innerJoin('a.group', 'g')
      .select('g.group_id', 'group_id')
      .addSelect('g.group_name', 'group_name')
      .addSelect('COUNT(DISTINCT a.major_id)', 'count')
      .groupBy('g.group_id')
      .addGroupBy('g.group_name')
      .orderBy('g.group_name', 'ASC')
      .getRawMany<{ group_id: string; group_name: string; count: string }>();

    const khacCount = await this.majorRepo
      .createQueryBuilder('m')
      .leftJoin('m.groupAssignments', 'a')
      .where('a.id IS NULL')
      .getCount();

    const data = rows.map((r) => ({
      name: r.group_name,
      slug: r.group_id,
      count: parseInt(r.count, 10),
    }));

    if (khacCount > 0) {
      data.push({ name: 'Khác', slug: KHAC_GROUP_ID, count: khacCount });
    }

    data.sort((a, b) => {
      if (a.slug === KHAC_GROUP_ID) return 1;
      if (b.slug === KHAC_GROUP_ID) return -1;
      return a.name.localeCompare(b.name, 'vi');
    });

    return { data, total: data.length };
  }

  async findAll(query: QueryMajorDto = {}) {
    const { search, page = 1, limit = 20, group } = query;
    const groupSlug = group ? normalizeGroupSlug(group) : null;

    if (groupSlug) {
      const groupName = resolveGroupSlug(groupSlug);
      const qb = this.majorRepo
        .createQueryBuilder('m')
        .leftJoinAndSelect('m.groupAssignments', 'ga')
        .leftJoinAndSelect('ga.group', 'g');

      if (groupSlug === KHAC_GROUP_ID) {
        qb.leftJoin('m.groupAssignments', 'ga_filter').where(
          'ga_filter.id IS NULL',
        );
      } else {
        qb.innerJoin('m.groupAssignments', 'ga_filter').where(
          'ga_filter.group_id = :groupSlug',
          { groupSlug },
        );
      }

      if (search) {
        qb.andWhere(
          '(m.name ILIKE :search OR m.field_group ILIKE :search OR :search = ANY(m.tags))',
          { search: `%${search}%` },
        );
      }

      qb.orderBy('m.name', 'ASC');
      const all = await qb.getMany();
      const total = all.length;
      const data = all
        .slice((page - 1) * limit, page * limit)
        .map((m) => this.enrichMajor(m));

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        ...(groupName
          ? { group: { name: groupName, slug: groupToSlug(groupName) } }
          : {}),
      };
    }

    const qb = this.majorRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.groupAssignments', 'ga')
      .leftJoinAndSelect('ga.group', 'g');

    if (search) {
      qb.where(
        '(m.name ILIKE :search OR m.field_group ILIKE :search OR :search = ANY(m.tags))',
        { search: `%${search}%` },
      );
    }

    const total = await qb.getCount();
    const rows = await qb
      .orderBy('m.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: rows.map((m) => this.enrichMajor(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(id: number): Promise<MajorWithGroups> {
    const major = await this.majorRepo.findOne({
      where: { id },
      relations: [
        'universityMajors',
        'universityMajors.university',
        'groupAssignments',
        'groupAssignments.group',
      ],
    });
    if (!major)
      throw new NotFoundException(`Không tìm thấy ngành với id ${id}`);
    return this.enrichMajor(major);
  }

  async update(
    id: number,
    dto: Partial<CreateMajorDto>,
  ): Promise<MajorWithGroups> {
    const major = await this.majorRepo.findOne({ where: { id } });
    if (!major)
      throw new NotFoundException(`Không tìm thấy ngành với id ${id}`);
    Object.assign(major, dto);
    await this.applyClassification(major);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.majorRepo.delete(id);
    return { message: `Đã xóa ngành id ${id}` };
  }

  /** Tra cứu theo tags — dùng cho chatbot / recommendation. */
  async findByTagTerms(terms: string[], limit = 20): Promise<Major[]> {
    const normalized = terms
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length >= 2);
    if (normalized.length === 0) return [];

    const qb = this.majorRepo.createQueryBuilder('m');
    normalized.forEach((term, i) => {
      const param = `tag${i}`;
      const clause = `(m.name ILIKE :${param} OR :${param} = ANY(m.tags))`;
      if (i === 0) qb.where(clause, { [param]: `%${term}%` });
      else qb.orWhere(clause, { [param]: `%${term}%` });
    });

    return qb.orderBy('m.name', 'ASC').take(limit).getMany();
  }
}
