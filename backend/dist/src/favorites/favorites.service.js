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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_favorite_entity_1 = require("./user-favorite.entity");
const university_entity_1 = require("../universities/university.entity");
const university_major_entity_1 = require("../majors/university-major.entity");
const typeorm_relations_1 = require("../common/typeorm-relations");
let FavoritesService = class FavoritesService {
    favoriteRepo;
    universityRepo;
    uniMajorRepo;
    constructor(favoriteRepo, universityRepo, uniMajorRepo) {
        this.favoriteRepo = favoriteRepo;
        this.universityRepo = universityRepo;
        this.uniMajorRepo = uniMajorRepo;
    }
    async listForUser(userId) {
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
    async add(userId, dto) {
        if (dto.university_major_id) {
            return this.addProgram(userId, dto.university_major_id);
        }
        if (dto.university_id) {
            return this.addUniversity(userId, dto.university_id);
        }
        throw new common_1.BadRequestException('Cần university_id (trường) hoặc university_major_id (ngành tại trường)');
    }
    async addUniversity(userId, universityId) {
        const university = await this.universityRepo.findOne({
            where: { id: universityId },
        });
        if (!university) {
            throw new common_1.NotFoundException('Không tìm thấy trường đại học');
        }
        const existed = await this.favoriteRepo.findOne({
            where: {
                user_id: userId,
                university_id: universityId,
                university_major_id: (0, typeorm_2.IsNull)(),
            },
        });
        if (existed) {
            throw new common_1.ConflictException('Trường này đã có trong danh sách yêu thích');
        }
        const row = this.favoriteRepo.create({
            user_id: userId,
            university_id: universityId,
            university_major_id: null,
            user: (0, typeorm_relations_1.relationStub)(userId),
            university,
        });
        await this.favoriteRepo.save(row);
        return {
            id: row.id,
            university_id: universityId,
            university_major_id: null,
            favorite_type: 'university',
            university,
            university_major: null,
        };
    }
    async addProgram(userId, universityMajorId) {
        const link = await this.uniMajorRepo.findOne({
            where: { id: universityMajorId },
            relations: ['major', 'university'],
        });
        if (!link?.university) {
            throw new common_1.NotFoundException('Không tìm thấy chương trình đào tạo');
        }
        const existed = await this.favoriteRepo.findOne({
            where: { user_id: userId, university_major_id: universityMajorId },
        });
        if (existed) {
            throw new common_1.ConflictException('Ngành này đã có trong danh sách yêu thích');
        }
        const row = this.favoriteRepo.create({
            user_id: userId,
            university_id: link.university.id,
            university_major_id: universityMajorId,
            user: (0, typeorm_relations_1.relationStub)(userId),
            university: link.university,
            universityMajor: link,
        });
        await this.favoriteRepo.save(row);
        return {
            id: row.id,
            university_id: link.university.id,
            university_major_id: universityMajorId,
            favorite_type: 'program',
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
    async remove(userId, favoriteId) {
        const row = await this.favoriteRepo.findOne({
            where: { id: favoriteId, user_id: userId },
        });
        if (!row) {
            throw new common_1.NotFoundException('Không tìm thấy mục yêu thích');
        }
        await this.favoriteRepo.delete(row.id);
        return { message: 'Đã xóa khỏi yêu thích' };
    }
    async removeByUniversity(userId, universityId) {
        const row = await this.favoriteRepo.findOne({
            where: {
                user_id: userId,
                university_id: universityId,
                university_major_id: (0, typeorm_2.IsNull)(),
            },
        });
        if (!row) {
            throw new common_1.NotFoundException('Trường chưa có trong yêu thích');
        }
        await this.favoriteRepo.delete(row.id);
        return { message: 'Đã xóa khỏi yêu thích' };
    }
    async removeByUniversityMajor(userId, universityMajorId) {
        const row = await this.favoriteRepo.findOne({
            where: { user_id: userId, university_major_id: universityMajorId },
        });
        if (!row) {
            throw new common_1.NotFoundException('Ngành chưa có trong yêu thích');
        }
        await this.favoriteRepo.delete(row.id);
        return { message: 'Đã xóa khỏi yêu thích' };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_favorite_entity_1.UserFavorite)),
    __param(1, (0, typeorm_1.InjectRepository)(university_entity_1.University)),
    __param(2, (0, typeorm_1.InjectRepository)(university_major_entity_1.UniversityMajor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map