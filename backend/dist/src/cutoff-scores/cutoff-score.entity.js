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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CutoffScore = void 0;
const typeorm_1 = require("typeorm");
const university_major_entity_1 = require("../majors/university-major.entity");
let CutoffScore = class CutoffScore {
    id;
    universityMajor;
    year;
    score;
    admission_method;
    subject_combination;
    note;
    created_at;
};
exports.CutoffScore = CutoffScore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CutoffScore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => university_major_entity_1.UniversityMajor, (um) => um.cutoffScores, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'university_major_id' }),
    __metadata("design:type", university_major_entity_1.UniversityMajor)
], CutoffScore.prototype, "universityMajor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CutoffScore.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], CutoffScore.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CutoffScore.prototype, "admission_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CutoffScore.prototype, "subject_combination", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CutoffScore.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CutoffScore.prototype, "created_at", void 0);
exports.CutoffScore = CutoffScore = __decorate([
    (0, typeorm_1.Entity)('cutoff_scores')
], CutoffScore);
//# sourceMappingURL=cutoff-score.entity.js.map