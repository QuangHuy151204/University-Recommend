"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AdminSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/user.entity");
const admin_config_service_1 = require("./admin-config.service");
let AdminSeedService = AdminSeedService_1 = class AdminSeedService {
    userRepo;
    adminConfig;
    logger = new common_1.Logger(AdminSeedService_1.name);
    constructor(userRepo, adminConfig) {
        this.userRepo = userRepo;
        this.adminConfig = adminConfig;
    }
    async onModuleInit() {
        await this.ensureDefaultAdmin();
    }
    async ensureDefaultAdmin() {
        if (!this.adminConfig.canSeed) {
            if (this.adminConfig.seedEnabled && !this.adminConfig.password) {
                this.logger.warn('Bỏ qua seed admin: chưa đặt ADMIN_PASSWORD trong .env');
            }
            return;
        }
        const { username, email, password } = this.adminConfig;
        let user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            user = await this.userRepo.findOne({
                where: { name: username, role: user_entity_1.UserRole.ADMIN },
            });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        if (!user) {
            user = this.userRepo.create({
                name: username,
                email,
                password_hash: passwordHash,
                role: user_entity_1.UserRole.ADMIN,
                email_verified: true,
            });
            await this.userRepo.save(user);
            this.logger.log(`Đã tạo tài khoản admin: username "${username}", email ${email}`);
            return;
        }
        let changed = false;
        if (user.role !== user_entity_1.UserRole.ADMIN) {
            user.role = user_entity_1.UserRole.ADMIN;
            changed = true;
        }
        if (!user.email_verified) {
            user.email_verified = true;
            changed = true;
        }
        if (user.name !== username) {
            user.name = username;
            changed = true;
        }
        if (user.email !== email) {
            user.email = email;
            changed = true;
        }
        const passwordOk = await bcrypt.compare(password, user.password_hash);
        if (!passwordOk) {
            user.password_hash = passwordHash;
            changed = true;
        }
        if (changed) {
            await this.userRepo.save(user);
            this.logger.log('Đã đồng bộ tài khoản admin từ biến môi trường');
        }
    }
};
exports.AdminSeedService = AdminSeedService;
exports.AdminSeedService = AdminSeedService = AdminSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        admin_config_service_1.AdminConfigService])
], AdminSeedService);
//# sourceMappingURL=admin-seed.service.js.map