"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissionMethodsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admission_method_entity_1 = require("./admission-method.entity");
const admission_methods_controller_1 = require("./admission-methods.controller");
const admission_methods_service_1 = require("./admission-methods.service");
const auth_module_1 = require("../auth/auth.module");
let AdmissionMethodsModule = class AdmissionMethodsModule {
};
exports.AdmissionMethodsModule = AdmissionMethodsModule;
exports.AdmissionMethodsModule = AdmissionMethodsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([admission_method_entity_1.AdmissionMethod]), auth_module_1.AuthModule],
        controllers: [admission_methods_controller_1.AdmissionMethodsController],
        providers: [admission_methods_service_1.AdmissionMethodsService],
        exports: [admission_methods_service_1.AdmissionMethodsService],
    })
], AdmissionMethodsModule);
//# sourceMappingURL=admission-methods.module.js.map