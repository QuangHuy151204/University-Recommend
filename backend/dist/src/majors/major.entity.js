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
exports.Major = void 0;
const typeorm_1 = require("typeorm");
const university_major_entity_1 = require("./university-major.entity");
const major_group_assignment_entity_1 = require("./major-group-assignment.entity");
let Major = class Major {
    id;
    name;
    code;
    description;
    career_orientation;
    required_skills;
    field_group;
    tags;
    universityMajors;
    groupAssignments;
    created_at;
    updated_at;
};
exports.Major = Major;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Major.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Major.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Major.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Major.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Major.prototype, "career_orientation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Major.prototype, "required_skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Major.prototype, "field_group", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: '{}' }),
    __metadata("design:type", Array)
], Major.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => university_major_entity_1.UniversityMajor, (um) => um.major),
    __metadata("design:type", Array)
], Major.prototype, "universityMajors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => major_group_assignment_entity_1.MajorGroupAssignment, (a) => a.major),
    __metadata("design:type", Array)
], Major.prototype, "groupAssignments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Major.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Major.prototype, "updated_at", void 0);
exports.Major = Major = __decorate([
    (0, typeorm_1.Entity)('majors')
], Major);
//# sourceMappingURL=major.entity.js.map