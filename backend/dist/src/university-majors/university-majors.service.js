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
exports.UniversityMajorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const university_major_entity_1 = require("../majors/university-major.entity");
const university_entity_1 = require("../universities/university.entity");
const major_entity_1 = require("../majors/major.entity");
let UniversityMajorsService = class UniversityMajorsService {
    repo;
    universityRepo;
    majorRepo;
    constructor(repo, universityRepo, majorRepo) {
        this.repo = repo;
        this.universityRepo = universityRepo;
        this.majorRepo = majorRepo;
    }
    async create(dto) {
        const university = await this.universityRepo.findOne({
            where: { id: dto.university_id },
        });
        if (!university) {
            throw new common_1.NotFoundException(`Không tìm thấy trường id ${dto.university_id}`);
        }
        const major = await this.majorRepo.findOne({ where: { id: dto.major_id } });
        if (!major) {
            throw new common_1.NotFoundException(`Không tìm thấy ngành id ${dto.major_id}`);
        }
        const existed = await this.repo
            .createQueryBuilder('um')
            .where('um.university_id = :uId', { uId: dto.university_id })
            .andWhere('um.major_id = :mId', { mId: dto.major_id })
            .andWhere(dto.training_program
            ? 'um.training_program = :tp'
            : 'um.training_program IS NULL', dto.training_program ? { tp: dto.training_program } : {})
            .getOne();
        if (existed) {
            throw new common_1.ConflictException(`Cặp (university_id=${dto.university_id}, major_id=${dto.major_id}, training_program=${dto.training_program ?? 'NULL'}) đã tồn tại (id=${existed.id})`);
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
    async findAll(query) {
        const { university_id, major_id, training_program, page = 1, limit = 20, } = query;
        const qb = this.repo
            .createQueryBuilder('um')
            .leftJoinAndSelect('um.university', 'u')
            .leftJoinAndSelect('um.major', 'm');
        if (university_id)
            qb.andWhere('u.id = :university_id', { university_id });
        if (major_id)
            qb.andWhere('m.id = :major_id', { major_id });
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
    async findOne(id) {
        const entity = await this.repo.findOne({
            where: { id },
            relations: ['university', 'major', 'cutoffScores'],
        });
        if (!entity) {
            throw new common_1.NotFoundException(`Không tìm thấy university-major id ${id}`);
        }
        return entity;
    }
    async update(id, dto) {
        const entity = await this.findOne(id);
        if (dto.university_id && dto.university_id !== entity.university.id) {
            const university = await this.universityRepo.findOne({
                where: { id: dto.university_id },
            });
            if (!university) {
                throw new common_1.NotFoundException(`Không tìm thấy trường id ${dto.university_id}`);
            }
            entity.university = university;
        }
        if (dto.major_id && dto.major_id !== entity.major.id) {
            const major = await this.majorRepo.findOne({
                where: { id: dto.major_id },
            });
            if (!major) {
                throw new common_1.NotFoundException(`Không tìm thấy ngành id ${dto.major_id}`);
            }
            entity.major = major;
        }
        if (dto.training_program !== undefined)
            entity.training_program = dto.training_program;
        if (dto.duration !== undefined)
            entity.duration = dto.duration;
        if (dto.tuition_fee !== undefined)
            entity.tuition_fee = dto.tuition_fee;
        if (dto.quota !== undefined)
            entity.quota = dto.quota;
        if (dto.admission_methods !== undefined)
            entity.admission_methods = dto.admission_methods;
        return this.repo.save(entity);
    }
    async remove(id) {
        const entity = await this.findOne(id);
        if (entity.cutoffScores && entity.cutoffScores.length > 0) {
            throw new common_1.BadRequestException(`Không thể xóa university-major id ${id}: còn ${entity.cutoffScores.length} điểm chuẩn liên kết. Hãy xóa cutoff_scores trước.`);
        }
        await this.repo.delete(id);
        return { message: `Đã xóa university-major id ${id}` };
    }
};
exports.UniversityMajorsService = UniversityMajorsService;
exports.UniversityMajorsService = UniversityMajorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(university_major_entity_1.UniversityMajor)),
    __param(1, (0, typeorm_1.InjectRepository)(university_entity_1.University)),
    __param(2, (0, typeorm_1.InjectRepository)(major_entity_1.Major)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UniversityMajorsService);
//# sourceMappingURL=university-majors.service.js.map