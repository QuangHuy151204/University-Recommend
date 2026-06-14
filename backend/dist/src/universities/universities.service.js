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
exports.UniversitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const university_entity_1 = require("./university.entity");
const major_entity_1 = require("../majors/major.entity");
const major_name_match_1 = require("../majors/major-name-match");
const data_scope_1 = require("../common/data-scope");
const subject_combination_1 = require("../common/subject-combination");
const university_cutoff_filter_1 = require("./university-cutoff-filter");
let UniversitiesService = class UniversitiesService {
    universityRepo;
    majorRepo;
    constructor(universityRepo, majorRepo) {
        this.universityRepo = universityRepo;
        this.majorRepo = majorRepo;
    }
    async create(dto) {
        const university = this.universityRepo.create(dto);
        return this.universityRepo.save(university);
    }
    async findAll(query) {
        const { search, location, type, max_tuition, subject_combination, min_score, major_id, page = 1, limit = 10, } = query;
        const qb = this.universityRepo.createQueryBuilder('u');
        qb.andWhere('u.location ILIKE :scopeLocation', {
            scopeLocation: `%${data_scope_1.DATA_SCOPE_LOCATION}%`,
        });
        if (search) {
            qb.andWhere('(u.name ILIKE :search OR u.short_name ILIKE :search)', {
                search: `%${search}%`,
            });
        }
        if (location) {
            qb.andWhere('u.location ILIKE :location', { location: `%${location}%` });
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
        const data = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('u.name', 'ASC')
            .getMany();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const university = await this.universityRepo.findOne({
            where: { id },
            relations: [
                'universityMajors',
                'universityMajors.major',
                'universityMajors.cutoffScores',
            ],
        });
        if (!university)
            throw new common_1.NotFoundException(`Không tìm thấy trường với id ${id}`);
        return university;
    }
    async update(id, dto) {
        const university = await this.findOne(id);
        Object.assign(university, dto);
        return this.universityRepo.save(university);
    }
    async remove(id) {
        await this.findOne(id);
        await this.universityRepo.delete(id);
        return { message: `Đã xóa trường id ${id}` };
    }
    async resolveMajorIdsForFilter(major_id) {
        if (major_id == null || !Number.isInteger(major_id) || major_id <= 0) {
            return undefined;
        }
        const selected = await this.majorRepo.findOne({
            where: { id: major_id },
            select: ['id', 'name'],
        });
        if (!selected)
            return [major_id];
        const catalog = await this.majorRepo.find({ select: ['id', 'name'] });
        const ids = (0, major_name_match_1.filterMajorIdsBySelectionName)(catalog, selected.name);
        return ids.length > 0 ? ids : [major_id];
    }
    applyCutoffFilters(qb, subject_combination, min_score, majorIds) {
        const combo = subject_combination?.trim();
        const hasScore = min_score != null && Number.isFinite(min_score) && min_score > 0;
        const hasMajor = majorIds != null && majorIds.length > 0;
        if (!combo && !hasScore && !hasMajor)
            return;
        const cutoffYears = [...subject_combination_1.CUTOFF_FILTER_YEARS];
        const sub = this.universityRepo
            .createQueryBuilder('su')
            .select('su.id')
            .innerJoin('su.universityMajors', 'sum');
        if (hasMajor) {
            sub.andWhere('sum.major_id IN (:...majorIds)', { majorIds });
        }
        if (combo || hasScore) {
            sub.innerJoin('sum.cutoffScores', 'scs');
            sub.andWhere('scs.year IN (:...cutoffYears)', { cutoffYears });
            if (combo) {
                sub.andWhere((0, subject_combination_1.subjectCombinationSqlMatch)('scs.subject_combination', 'combo'), { combo });
            }
            if (hasScore) {
                sub.andWhere((0, university_cutoff_filter_1.latestCutoffYearSql)('sum', 'scs', combo ? 'combo' : null));
                sub.andWhere('scs.score <= :minScore', { minScore: min_score });
            }
        }
        qb.andWhere(`u.id IN (${sub.getQuery()})`);
        for (const [key, value] of Object.entries(sub.getParameters())) {
            qb.setParameter(key, value);
        }
    }
};
exports.UniversitiesService = UniversitiesService;
exports.UniversitiesService = UniversitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(university_entity_1.University)),
    __param(1, (0, typeorm_1.InjectRepository)(major_entity_1.Major)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UniversitiesService);
//# sourceMappingURL=universities.service.js.map