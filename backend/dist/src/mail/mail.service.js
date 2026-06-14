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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    config;
    logger = new common_1.Logger(MailService_1.name);
    transporter = null;
    constructor(config) {
        this.config = config;
    }
    getFromAddress() {
        const from = this.config.get('SMTP_FROM');
        const name = this.config.get('MAIL_FROM_NAME', 'University Recommend');
        if (from?.includes('<'))
            return from;
        return from ? `"${name}" <${from}>` : `"${name}" <noreply@localhost>`;
    }
    ensureTransporter() {
        if (this.transporter)
            return this.transporter;
        const host = this.config.get('SMTP_HOST');
        const user = this.config.get('SMTP_USER');
        const pass = this.config.get('SMTP_PASS');
        if (!host)
            return null;
        const port = parseInt(this.config.get('SMTP_PORT', '587'), 10);
        const secure = this.config.get('SMTP_SECURE', 'false') === 'true';
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: user ? { user, pass } : undefined,
        });
        return this.transporter;
    }
    async sendVerificationCode(email, name, code) {
        const subject = 'Mã xác nhận tài khoản — University Recommend';
        const text = [
            `Xin chào ${name},`,
            '',
            'Cảm ơn bạn đã đăng ký University Recommend.',
            `Mã xác nhận email của bạn: ${code}`,
            'Mã có hiệu lực 15 phút.',
            '',
            'Nếu bạn không đăng ký, hãy bỏ qua email này.',
        ].join('\n');
        await this.sendMail(email, subject, text, code, 'verify');
    }
    async sendPasswordResetCode(email, name, code) {
        const subject = 'Mã đặt lại mật khẩu — University Recommend';
        const text = [
            `Xin chào ${name},`,
            '',
            'Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu.',
            `Mã xác nhận: ${code}`,
            'Mã có hiệu lực 15 phút.',
            '',
            'Nếu bạn không yêu cầu, hãy bỏ qua email này.',
        ].join('\n');
        await this.sendMail(email, subject, text, code, 'reset');
    }
    async sendMail(to, subject, text, code, kind) {
        const devLog = this.config.get('MAIL_DEV_LOG', 'true') === 'true';
        const transporter = this.ensureTransporter();
        if (!transporter) {
            if (devLog) {
                this.logger.warn(`[MAIL_DEV] SMTP chưa cấu hình — ${kind} → ${to}: mã ${code}`);
            }
            return;
        }
        try {
            await transporter.sendMail({
                from: this.getFromAddress(),
                to,
                subject,
                text,
            });
            this.logger.log(`Đã gửi email ${kind} tới ${to}`);
        }
        catch (err) {
            this.logger.error(`Gửi email thất bại (${to})`, err);
            if (devLog) {
                this.logger.warn(`[MAIL_DEV] fallback mã ${kind}: ${code}`);
            }
            else {
                throw err;
            }
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map