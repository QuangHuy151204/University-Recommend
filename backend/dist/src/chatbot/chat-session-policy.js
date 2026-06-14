"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_CHAT_SESSIONS_PER_USER = void 0;
exports.sessionUserId = sessionUserId;
exports.assertSessionAccess = assertSessionAccess;
const common_1 = require("@nestjs/common");
exports.MAX_CHAT_SESSIONS_PER_USER = 5;
function sessionUserId(session) {
    const raw = session.user;
    return typeof raw?.id === 'number' ? raw.id : null;
}
function assertSessionAccess(session, userId) {
    const ownerId = sessionUserId(session);
    if (ownerId != null) {
        if (!userId) {
            throw new common_1.ForbiddenException('Cuộc hội thoại này thuộc tài khoản đã đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        }
        if (ownerId !== userId) {
            throw new common_1.ForbiddenException('Không thể truy cập cuộc hội thoại của người dùng khác.');
        }
    }
}
//# sourceMappingURL=chat-session-policy.js.map