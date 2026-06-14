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
exports.UserFavorite = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const university_entity_1 = require("../universities/university.entity");
const university_major_entity_1 = require("../majors/university-major.entity");
let UserFavorite = class UserFavorite {
    id;
    user_id;
    university_id;
    university_major_id;
    user;
    university;
    universityMajor;
    created_at;
};
exports.UserFavorite = UserFavorite;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserFavorite.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserFavorite.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserFavorite.prototype, "university_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], UserFavorite.prototype, "university_major_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserFavorite.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => university_entity_1.University, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'university_id' }),
    __metadata("design:type", university_entity_1.University)
], UserFavorite.prototype, "university", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => university_major_entity_1.UniversityMajor, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'university_major_id' }),
    __metadata("design:type", Object)
], UserFavorite.prototype, "universityMajor", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserFavorite.prototype, "created_at", void 0);
exports.UserFavorite = UserFavorite = __decorate([
    (0, typeorm_1.Entity)('user_favorites')
], UserFavorite);
//# sourceMappingURL=user-favorite.entity.js.map