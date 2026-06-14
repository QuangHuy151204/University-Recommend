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
exports.MajorGroupAssignment = void 0;
const typeorm_1 = require("typeorm");
const major_entity_1 = require("./major.entity");
const major_group_entity_1 = require("./major-group.entity");
let MajorGroupAssignment = class MajorGroupAssignment {
    id;
    major_id;
    group_id;
    is_primary;
    major;
    group;
    created_at;
};
exports.MajorGroupAssignment = MajorGroupAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MajorGroupAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MajorGroupAssignment.prototype, "major_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64 }),
    __metadata("design:type", String)
], MajorGroupAssignment.prototype, "group_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MajorGroupAssignment.prototype, "is_primary", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => major_entity_1.Major, (m) => m.groupAssignments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'major_id' }),
    __metadata("design:type", major_entity_1.Major)
], MajorGroupAssignment.prototype, "major", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => major_group_entity_1.MajorGroup, (g) => g.assignments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", major_group_entity_1.MajorGroup)
], MajorGroupAssignment.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MajorGroupAssignment.prototype, "created_at", void 0);
exports.MajorGroupAssignment = MajorGroupAssignment = __decorate([
    (0, typeorm_1.Entity)('major_group_assignments'),
    (0, typeorm_1.Unique)(['major_id', 'group_id'])
], MajorGroupAssignment);
//# sourceMappingURL=major-group-assignment.entity.js.map