"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MajorsService = exports.CreateMajorDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const major_entity_1 = require("./major.entity");
const university_major_entity_1 = require("./university-major.entity");
const major_group_entity_1 = require("./major-group.entity");
const major_group_assignment_entity_1 = require("./major-group-assignment.entity");
const class_validator_1 = require("class-validator");
const major_normalization_1 = require("./major-normalization");
const major_groups_catalog_1 = require("./major-groups-catalog");
class CreateMajorDto {
    name;
    code;
    description;
    career_orientation;
    required_skills;
    field_group;
}
exports.CreateMajorDto = CreateMajorDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMajorDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMajorDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMajorDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMajorDto.prototype, "career_orientation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMajorDto.prototype, "required_skills", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMajorDto.prototype, "field_group", void 0);
let MajorsService = class MajorsService {
    majorRepo;
    uniMajorRepo;
    groupRepo;
    assignmentRepo;
    constructor(majorRepo, uniMajorRepo, groupRepo, assignmentRepo) {
        this.majorRepo = majorRepo;
        this.uniMajorRepo = uniMajorRepo;
        this.groupRepo = groupRepo;
        this.assignmentRepo = assignmentRepo;
    }
    async applyClassification(major) {
        const classification = (0, major_normalization_1.classifyMajor)(major.name, major.field_group);
        major.field_group = classification.primary_group_name;
        major.tags = classification.tags;
        await this.majorRepo.save(major);
        await this.assignmentRepo.delete({ major_id: major.id });
        const assignments = classification.group_ids
            .filter((gid) => gid !== major_groups_catalog_1.KHAC_GROUP_ID)
            .map((groupId, index) => this.assignmentRepo.create({
            major_id: major.id,
            group_id: groupId,
            is_primary: index === 0,
        }));
        if (assignments.length > 0) {
            await this.assignmentRepo.save(assignments);
        }
        return major;
    }
    enrichMajor(major) {
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
    async create(dto) {
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
            .getRawMany();
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
            data.push({ name: 'Khác', slug: major_groups_catalog_1.KHAC_GROUP_ID, count: khacCount });
        }
        data.sort((a, b) => {
            if (a.slug === major_groups_catalog_1.KHAC_GROUP_ID)
                return 1;
            if (b.slug === major_groups_catalog_1.KHAC_GROUP_ID)
                return -1;
            return a.name.localeCompare(b.name, 'vi');
        });
        return { data, total: data.length };
    }
    async findAll(query = {}) {
        const { search, page = 1, limit = 20, group } = query;
        const groupSlug = group ? (0, major_normalization_1.normalizeGroupSlug)(group) : null;
        if (groupSlug) {
            const groupName = (0, major_normalization_1.resolveGroupSlug)(groupSlug);
            const qb = this.majorRepo
                .createQueryBuilder('m')
                .leftJoinAndSelect('m.groupAssignments', 'ga')
                .leftJoinAndSelect('ga.group', 'g');
            if (groupSlug === major_groups_catalog_1.KHAC_GROUP_ID) {
                qb.leftJoin('m.groupAssignments', 'ga_filter').where('ga_filter.id IS NULL');
            }
            else {
                qb.innerJoin('m.groupAssignments', 'ga_filter').where('ga_filter.group_id = :groupSlug', { groupSlug });
            }
            if (search) {
                qb.andWhere('(m.name ILIKE :search OR m.field_group ILIKE :search OR :search = ANY(m.tags))', { search: `%${search}%` });
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
                    ? { group: { name: groupName, slug: (0, major_normalization_1.groupToSlug)(groupName) } }
                    : {}),
            };
        }
        const qb = this.majorRepo
            .createQueryBuilder('m')
            .leftJoinAndSelect('m.groupAssignments', 'ga')
            .leftJoinAndSelect('ga.group', 'g');
        if (search) {
            qb.where('(m.name ILIKE :search OR m.field_group ILIKE :search OR :search = ANY(m.tags))', { search: `%${search}%` });
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Không tìm thấy ngành với id ${id}`);
        return this.enrichMajor(major);
    }
    async update(id, dto) {
        const major = await this.majorRepo.findOne({ where: { id } });
        if (!major)
            throw new common_1.NotFoundException(`Không tìm thấy ngành với id ${id}`);
        Object.assign(major, dto);
        await this.applyClassification(major);
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.majorRepo.delete(id);
        return { message: `Đã xóa ngành id ${id}` };
    }
    async findByTagTerms(terms, limit = 20) {
        const normalized = terms
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length >= 2);
        if (normalized.length === 0)
            return [];
        const qb = this.majorRepo.createQueryBuilder('m');
        normalized.forEach((term, i) => {
            const param = `tag${i}`;
            const clause = `(m.name ILIKE :${param} OR :${param} = ANY(m.tags))`;
            if (i === 0)
                qb.where(clause, { [param]: `%${term}%` });
            else
                qb.orWhere(clause, { [param]: `%${term}%` });
        });
        return qb.orderBy('m.name', 'ASC').take(limit).getMany();
    }
};
exports.MajorsService = MajorsService;
exports.MajorsService = MajorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(major_entity_1.Major)),
    __param(1, (0, typeorm_1.InjectRepository)(university_major_entity_1.UniversityMajor)),
    __param(2, (0, typeorm_1.InjectRepository)(major_group_entity_1.MajorGroup)),
    __param(3, (0, typeorm_1.InjectRepository)(major_group_assignment_entity_1.MajorGroupAssignment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MajorsService);
//# sourceMappingURL=majors.service.js.map