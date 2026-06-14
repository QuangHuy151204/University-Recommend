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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const user_entity_1 = require("../users/user.entity");
const auth_token_entity_1 = require("./auth-token.entity");
const user_entity_2 = require("../users/user.entity");
const admin_config_service_1 = require("../admin/admin-config.service");
const mail_service_1 = require("../mail/mail.service");
const CODE_TTL_MS = 15 * 60 * 1000;
let AuthService = class AuthService {
    userRepo;
    tokenRepo;
    jwtService;
    mailService;
    adminConfig;
    constructor(userRepo, tokenRepo, jwtService, mailService, adminConfig) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.adminConfig = adminConfig;
    }
    async register(dto) {
        const email = dto.email.trim().toLowerCase();
        const existing = await this.userRepo.findOne({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Email đã được sử dụng');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            name: dto.name.trim(),
            email,
            password_hash: passwordHash,
            email_verified: false,
        });
        await this.userRepo.save(user);
        await this.issueAndSendCode(user, auth_token_entity_1.AuthTokenType.EMAIL_VERIFY);
        return {
            message: 'Đăng ký thành công. Vui lòng kiểm tra email và nhập mã xác nhận 6 chữ số.',
            email: user.email,
        };
    }
    async verifyEmail(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
        }
        if (user.email_verified) {
            return this.generateToken(user);
        }
        const valid = await this.consumeCode(user.id, auth_token_entity_1.AuthTokenType.EMAIL_VERIFY, dto.code);
        if (!valid) {
            throw new common_1.BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
        }
        user.email_verified = true;
        await this.userRepo.save(user);
        return this.generateToken(user);
    }
    async resendVerification(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            return { message: 'Nếu email tồn tại, mã xác nhận đã được gửi lại.' };
        }
        if (user.email_verified) {
            throw new common_1.BadRequestException('Email đã được xác nhận');
        }
        await this.issueAndSendCode(user, auth_token_entity_1.AuthTokenType.EMAIL_VERIFY);
        return { message: 'Nếu email tồn tại, mã xác nhận đã được gửi lại.' };
    }
    async login(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password_hash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        if (!user.email_verified) {
            throw new common_1.ForbiddenException({
                statusCode: 403,
                message: 'Vui lòng xác nhận email trước khi đăng nhập.',
                error: 'EMAIL_NOT_VERIFIED',
                email: user.email,
            });
        }
        return this.generateToken(user);
    }
    async adminLogin(dto) {
        const username = dto.username.trim();
        const emailCandidate = username.toLowerCase();
        let user = (await this.userRepo.findOne({
            where: { email: emailCandidate, role: user_entity_2.UserRole.ADMIN },
        })) ??
            (await this.userRepo
                .createQueryBuilder('u')
                .where('u.role = :role', { role: user_entity_2.UserRole.ADMIN })
                .andWhere('LOWER(u.name) = LOWER(:name)', { name: username })
                .getOne());
        if (!user &&
            username.toLowerCase() === this.adminConfig.username.toLowerCase()) {
            user = await this.userRepo.findOne({
                where: { email: this.adminConfig.email },
            });
        }
        if (!user || user.role !== user_entity_2.UserRole.ADMIN) {
            throw new common_1.UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password_hash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
        }
        if (!user.email_verified) {
            user.email_verified = true;
            await this.userRepo.save(user);
        }
        return this.generateToken(user);
    }
    async forgotPassword(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.userRepo.findOne({ where: { email } });
        if (user) {
            await this.issueAndSendCode(user, auth_token_entity_1.AuthTokenType.PASSWORD_RESET);
        }
        return {
            message: 'Nếu email tồn tại trong hệ thống, mã đặt lại mật khẩu đã được gửi.',
        };
    }
    async resetPassword(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
        }
        const valid = await this.consumeCode(user.id, auth_token_entity_1.AuthTokenType.PASSWORD_RESET, dto.code);
        if (!valid) {
            throw new common_1.BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
        }
        user.password_hash = await bcrypt.hash(dto.new_password, 10);
        await this.userRepo.save(user);
        return { message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập.' };
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                email_verified: user.email_verified,
            },
        };
    }
    generateCode() {
        return String((0, crypto_1.randomInt)(100000, 1000000));
    }
    async issueAndSendCode(user, type) {
        await this.tokenRepo.delete({ user_id: user.id, type });
        await this.tokenRepo.delete({
            expires_at: (0, typeorm_2.LessThan)(new Date()),
        });
        const code = this.generateCode();
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + CODE_TTL_MS);
        await this.tokenRepo.save(this.tokenRepo.create({
            user_id: user.id,
            type,
            code_hash: codeHash,
            expires_at: expiresAt,
        }));
        if (type === auth_token_entity_1.AuthTokenType.EMAIL_VERIFY) {
            await this.mailService.sendVerificationCode(user.email, user.name, code);
        }
        else {
            await this.mailService.sendPasswordResetCode(user.email, user.name, code);
        }
    }
    async consumeCode(userId, type, code) {
        const row = await this.tokenRepo.findOne({
            where: { user_id: userId, type },
            order: { created_at: 'DESC' },
        });
        if (!row || row.expires_at < new Date()) {
            if (row)
                await this.tokenRepo.delete({ id: row.id });
            return false;
        }
        const match = await bcrypt.compare(code, row.code_hash);
        await this.tokenRepo.delete({ id: row.id });
        return match;
    }
    async findById(id) {
        return this.userRepo.findOne({ where: { id } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(auth_token_entity_1.AuthToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        mail_service_1.MailService,
        admin_config_service_1.AdminConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map