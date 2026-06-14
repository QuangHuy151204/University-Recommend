"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityMajorsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const university_majors_controller_1 = require("./university-majors.controller");
const university_majors_service_1 = require("./university-majors.service");
const university_major_entity_1 = require("../majors/university-major.entity");
const university_entity_1 = require("../universities/university.entity");
const major_entity_1 = require("../majors/major.entity");
const auth_module_1 = require("../auth/auth.module");
let UniversityMajorsModule = class UniversityMajorsModule {
};
exports.UniversityMajorsModule = UniversityMajorsModule;
exports.UniversityMajorsModule = UniversityMajorsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([university_major_entity_1.UniversityMajor, university_entity_1.University, major_entity_1.Major]),
            auth_module_1.AuthModule,
        ],
        controllers: [university_majors_controller_1.UniversityMajorsController],
        providers: [university_majors_service_1.UniversityMajorsService],
        exports: [university_majors_service_1.UniversityMajorsService],
    })
], UniversityMajorsModule);
//# sourceMappingURL=university-majors.module.js.map