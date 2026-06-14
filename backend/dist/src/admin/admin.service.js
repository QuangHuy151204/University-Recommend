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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const university_entity_1 = require("../universities/university.entity");
const major_entity_1 = require("../majors/major.entity");
const cutoff_score_entity_1 = require("../cutoff-scores/cutoff-score.entity");
const user_entity_1 = require("../users/user.entity");
let AdminService = class AdminService {
    universityRepo;
    majorRepo;
    cutoffRepo;
    userRepo;
    constructor(universityRepo, majorRepo, cutoffRepo, userRepo) {
        this.universityRepo = universityRepo;
        this.majorRepo = majorRepo;
        this.cutoffRepo = cutoffRepo;
        this.userRepo = userRepo;
    }
    async getStats() {
        const [universities, majors, cutoff_scores, users] = await Promise.all([
            this.universityRepo.count(),
            this.majorRepo.count(),
            this.cutoffRepo.count(),
            this.userRepo.count(),
        ]);
        return { universities, majors, cutoff_scores, users };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(university_entity_1.University)),
    __param(1, (0, typeorm_1.InjectRepository)(major_entity_1.Major)),
    __param(2, (0, typeorm_1.InjectRepository)(cutoff_score_entity_1.CutoffScore)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map