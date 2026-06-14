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
exports.UniversityMajor = void 0;
const typeorm_1 = require("typeorm");
const university_entity_1 = require("../universities/university.entity");
const major_entity_1 = require("./major.entity");
const cutoff_score_entity_1 = require("../cutoff-scores/cutoff-score.entity");
let UniversityMajor = class UniversityMajor {
    id;
    university;
    major;
    training_program;
    duration;
    tuition_fee;
    quota;
    admission_methods;
    cutoffScores;
    created_at;
};
exports.UniversityMajor = UniversityMajor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UniversityMajor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => university_entity_1.University, (u) => u.universityMajors, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'university_id' }),
    __metadata("design:type", university_entity_1.University)
], UniversityMajor.prototype, "university", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => major_entity_1.Major, (m) => m.universityMajors, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'major_id' }),
    __metadata("design:type", major_entity_1.Major)
], UniversityMajor.prototype, "major", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UniversityMajor.prototype, "training_program", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UniversityMajor.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UniversityMajor.prototype, "tuition_fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UniversityMajor.prototype, "quota", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UniversityMajor.prototype, "admission_methods", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cutoff_score_entity_1.CutoffScore, (cs) => cs.universityMajor),
    __metadata("design:type", Array)
], UniversityMajor.prototype, "cutoffScores", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UniversityMajor.prototype, "created_at", void 0);
exports.UniversityMajor = UniversityMajor = __decorate([
    (0, typeorm_1.Entity)('university_majors')
], UniversityMajor);
//# sourceMappingURL=university-major.entity.js.map