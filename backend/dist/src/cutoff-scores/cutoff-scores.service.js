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
exports.CutoffScoresService = exports.UpdateCutoffScoreDto = exports.CreateCutoffScoreDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cutoff_score_entity_1 = require("./cutoff-score.entity");
const admission_methods_service_1 = require("../admission-methods/admission-methods.service");
const class_validator_1 = require("class-validator");
const subject_combination_1 = require("../common/subject-combination");
class CreateCutoffScoreDto {
    university_major_id;
    year;
    score;
    admission_method;
    subject_combination;
    note;
}
exports.CreateCutoffScoreDto = CreateCutoffScoreDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCutoffScoreDto.prototype, "university_major_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2015),
    (0, class_validator_1.Max)(2030),
    __metadata("design:type", Number)
], CreateCutoffScoreDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], CreateCutoffScoreDto.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCutoffScoreDto.prototype, "admission_method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCutoffScoreDto.prototype, "subject_combination", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCutoffScoreDto.prototype, "note", void 0);
class UpdateCutoffScoreDto {
    year;
    score;
    admission_method;
    subject_combination;
    note;
}
exports.UpdateCutoffScoreDto = UpdateCutoffScoreDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2015),
    (0, class_validator_1.Max)(2030),
    __metadata("design:type", Number)
], UpdateCutoffScoreDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], UpdateCutoffScoreDto.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCutoffScoreDto.prototype, "admission_method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCutoffScoreDto.prototype, "subject_combination", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCutoffScoreDto.prototype, "note", void 0);
let CutoffScoresService = class CutoffScoresService {
    cutoffRepo;
    admissionMethodsService;
    constructor(cutoffRepo, admissionMethodsService) {
        this.cutoffRepo = cutoffRepo;
        this.admissionMethodsService = admissionMethodsService;
    }
    async create(dto) {
        const score = this.cutoffRepo.create({
            year: dto.year,
            score: dto.score,
            admission_method: dto.admission_method,
            subject_combination: dto.subject_combination,
            note: dto.note,
            universityMajor: {
                id: dto.university_major_id,
            },
        });
        return this.cutoffRepo.save(score);
    }
    async update(id, dto) {
        const row = await this.cutoffRepo.findOne({ where: { id } });
        if (!row) {
            throw new common_1.NotFoundException(`Không tìm thấy điểm chuẩn id ${id}`);
        }
        if (dto.year !== undefined)
            row.year = dto.year;
        if (dto.score !== undefined)
            row.score = dto.score;
        if (dto.admission_method !== undefined)
            row.admission_method = dto.admission_method;
        if (dto.subject_combination !== undefined) {
            row.subject_combination = dto.subject_combination;
        }
        if (dto.note !== undefined)
            row.note = dto.note;
        return this.cutoffRepo.save(row);
    }
    async remove(id) {
        const row = await this.cutoffRepo.findOne({ where: { id } });
        if (!row) {
            throw new common_1.NotFoundException(`Không tìm thấy điểm chuẩn id ${id}`);
        }
        await this.cutoffRepo.delete(id);
        return { message: `Đã xóa điểm chuẩn id ${id}` };
    }
    async applyMethodFilter(qb, filters) {
        if (!filters)
            return;
        const label = await this.admissionMethodsService.resolveLabel(filters.method_code, filters.admission_method);
        if (!label)
            return;
        qb.andWhere('cs.admission_method ILIKE :methodLabel', {
            methodLabel: `%${label}%`,
        });
    }
    async findByUniversity(universityId, filters) {
        const qb = this.cutoffRepo
            .createQueryBuilder('cs')
            .leftJoinAndSelect('cs.universityMajor', 'um')
            .leftJoinAndSelect('um.university', 'u')
            .leftJoinAndSelect('um.major', 'm')
            .where('u.id = :universityId', { universityId });
        if (filters?.year)
            qb.andWhere('cs.year = :year', { year: filters.year });
        await this.applyMethodFilter(qb, filters);
        return qb.orderBy('cs.year', 'DESC').getMany();
    }
    async findByMajor(majorId, filters) {
        const qb = this.cutoffRepo
            .createQueryBuilder('cs')
            .leftJoinAndSelect('cs.universityMajor', 'um')
            .leftJoinAndSelect('um.university', 'u')
            .leftJoinAndSelect('um.major', 'm')
            .where('m.id = :majorId', { majorId });
        if (filters?.year)
            qb.andWhere('cs.year = :year', { year: filters.year });
        await this.applyMethodFilter(qb, filters);
        return qb.orderBy('cs.score', 'DESC').getMany();
    }
    async findAllAdmin(query) {
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
    async listSubjectCombinations(search) {
        const years = [...subject_combination_1.CUTOFF_FILTER_YEARS];
        const rows = await this.cutoffRepo
            .createQueryBuilder('cs')
            .select('cs.subject_combination', 'raw')
            .addSelect('COUNT(*)', 'cnt')
            .where('cs.year IN (:...years)', { years })
            .andWhere('cs.subject_combination IS NOT NULL')
            .andWhere("TRIM(cs.subject_combination) <> ''")
            .groupBy('cs.subject_combination')
            .getRawMany();
        const counts = new Map();
        for (const row of rows) {
            const parts = (0, subject_combination_1.splitSubjectCombination)(row.raw);
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
};
exports.CutoffScoresService = CutoffScoresService;
exports.CutoffScoresService = CutoffScoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cutoff_score_entity_1.CutoffScore)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        admission_methods_service_1.AdmissionMethodsService])
], CutoffScoresService);
//# sourceMappingURL=cutoff-scores.service.js.map