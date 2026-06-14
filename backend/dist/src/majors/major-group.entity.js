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
exports.MajorGroup = void 0;
const typeorm_1 = require("typeorm");
const major_group_assignment_entity_1 = require("./major-group-assignment.entity");
let MajorGroup = class MajorGroup {
    group_id;
    group_name;
    description;
    assignments;
    created_at;
    updated_at;
};
exports.MajorGroup = MajorGroup;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ length: 64 }),
    __metadata("design:type", String)
], MajorGroup.prototype, "group_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128 }),
    __metadata("design:type", String)
], MajorGroup.prototype, "group_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MajorGroup.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => major_group_assignment_entity_1.MajorGroupAssignment, (a) => a.group),
    __metadata("design:type", Array)
], MajorGroup.prototype, "assignments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MajorGroup.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MajorGroup.prototype, "updated_at", void 0);
exports.MajorGroup = MajorGroup = __decorate([
    (0, typeorm_1.Entity)('major_groups')
], MajorGroup);
//# sourceMappingURL=major-group.entity.js.map