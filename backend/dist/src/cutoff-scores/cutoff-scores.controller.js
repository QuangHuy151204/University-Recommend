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
exports.CutoffScoresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cutoff_scores_service_1 = require("./cutoff-scores.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
const cutoff_admin_dto_1 = require("./cutoff-admin.dto");
let CutoffScoresController = class CutoffScoresController {
    service;
    constructor(service) {
        this.service = service;
    }
    listSubjectCombinations(search) {
        return this.service.listSubjectCombinations(search);
    }
    findAllAdmin(query) {
        return this.service.findAllAdmin(query);
    }
    findByUniversity(id, year, admission_method, method_code) {
        return this.service.findByUniversity(id, {
            year: year ? Number(year) : undefined,
            admission_method,
            method_code,
        });
    }
    findByMajor(id, year, admission_method, method_code) {
        return this.service.findByMajor(id, {
            year: year ? Number(year) : undefined,
            admission_method,
            method_code,
        });
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.CutoffScoresController = CutoffScoresController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Danh sách tổ hợp môn có trong điểm chuẩn (2023–2025)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Lọc theo mã (A, B, 01, C02, …)',
    }),
    (0, common_1.Get)('subject-combinations'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CutoffScoresController.prototype, "listSubjectCombinations", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Danh sách điểm chuẩn có phân trang (Admin)',
    }),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Get)('admin-list'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cutoff_admin_dto_1.QueryCutoffAdminDto]),
    __metadata("design:returntype", void 0)
], CutoffScoresController.prototype, "findAllAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Lấy điểm chuẩn theo trường' }),
    (0, swagger_1.ApiQuery)({
        name: 'year',
        required: false,
        description: 'Năm tuyển sinh (VD: 2024)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'admission_method',
        required: false,
        description: 'Lọc theo nhãn phương thức (chuỗi lưu trong DB)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'method_code',
        required: false,
        description: 'Lọc theo mã PT (THPT, HOC_BA, DGNL…) — resolve qua admission_methods',
    }),
    (0, common_1.Get)('university/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('admission_method')),
    __param(3, (0, common_1.Query)('method_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], CutoffScoresController.prototype, "findByUniversity", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Lấy điểm chuẩn theo ngành' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'admission_method', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'method_code', required: false }),
    (0, common_1.Get)('major/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('admission_method')),
    __param(3, (0, common_1.Query)('method_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], CutoffScoresController.prototype, "findByMajor", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Thêm điểm chuẩn mới (Admin)' }),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cutoff_scores_service_1.CreateCutoffScoreDto]),
    __metadata("design:returntype", void 0)
], CutoffScoresController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật điểm chuẩn (Admin)' }),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, cutoff_scores_service_1.UpdateCutoffScoreDto]),
    __metadata("design:returntype", void 0)
], CutoffScoresController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Xóa điểm chuẩn (Admin)' }),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CutoffScoresController.prototype, "remove", null);
exports.CutoffScoresController = CutoffScoresController = __decorate([
    (0, swagger_1.ApiTags)('Điểm chuẩn'),
    (0, common_1.Controller)('cutoff-scores'),
    __metadata("design:paramtypes", [cutoff_scores_service_1.CutoffScoresService])
], CutoffScoresController);
//# sourceMappingURL=cutoff-scores.controller.js.map