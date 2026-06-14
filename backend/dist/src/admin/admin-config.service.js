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
exports.AdminConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AdminConfigService = class AdminConfigService {
    configService;
    seedEnabled;
    username;
    email;
    password;
    constructor(configService) {
        this.configService = configService;
        this.seedEnabled =
            this.configService.get('ADMIN_SEED_ENABLED', 'true') === 'true';
        this.username = this.configService.get('ADMIN_USERNAME', 'Admin').trim();
        this.email = this.configService
            .get('ADMIN_EMAIL', 'admin@system.local')
            .trim()
            .toLowerCase();
        const pwd = this.configService.get('ADMIN_PASSWORD', '')?.trim();
        this.password = pwd || null;
    }
    get canSeed() {
        return this.seedEnabled && !!this.password;
    }
};
exports.AdminConfigService = AdminConfigService;
exports.AdminConfigService = AdminConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AdminConfigService);
//# sourceMappingURL=admin-config.service.js.map