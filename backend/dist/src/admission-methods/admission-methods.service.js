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
exports.AdmissionMethodsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admission_method_entity_1 = require("./admission-method.entity");
let AdmissionMethodsService = class AdmissionMethodsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll() {
        return this.repo.find({ order: { method_name: 'ASC' } });
    }
    async create(dto) {
        const code = dto.method_code.trim();
        const existed = await this.repo.findOne({ where: { method_code: code } });
        if (existed) {
            throw new common_1.ConflictException(`Mã phương thức "${code}" đã tồn tại`);
        }
        const row = this.repo.create({
            method_code: code,
            method_name: dto.method_name.trim(),
            description: dto.description?.trim() || undefined,
        });
        return this.repo.save(row);
    }
    async update(id, dto) {
        const row = await this.repo.findOne({ where: { id } });
        if (!row) {
            throw new common_1.NotFoundException(`Không tìm thấy phương thức id ${id}`);
        }
        if (dto.method_code !== undefined) {
            const code = dto.method_code.trim();
            const dup = await this.repo.findOne({ where: { method_code: code } });
            if (dup && dup.id !== id) {
                throw new common_1.ConflictException(`Mã phương thức "${code}" đã tồn tại`);
            }
            row.method_code = code;
        }
        if (dto.method_name !== undefined)
            row.method_name = dto.method_name.trim();
        if (dto.description !== undefined) {
            row.description = dto.description?.trim() || '';
        }
        return this.repo.save(row);
    }
    async remove(id) {
        const row = await this.repo.findOne({ where: { id } });
        if (!row) {
            throw new common_1.NotFoundException(`Không tìm thấy phương thức id ${id}`);
        }
        await this.repo.delete(id);
        return { message: `Đã xóa phương thức id ${id}` };
    }
    async resolveLabel(methodCode, admissionMethod) {
        if (methodCode?.trim()) {
            const row = await this.repo.findOne({
                where: { method_code: methodCode.trim() },
            });
            if (row)
                return row.method_name;
            return methodCode.trim();
        }
        if (admissionMethod?.trim())
            return admissionMethod.trim();
        return null;
    }
};
exports.AdmissionMethodsService = AdmissionMethodsService;
exports.AdmissionMethodsService = AdmissionMethodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admission_method_entity_1.AdmissionMethod)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdmissionMethodsService);
//# sourceMappingURL=admission-methods.service.js.map