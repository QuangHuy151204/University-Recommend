"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionContext1759500000000 = void 0;
class ChatSessionContext1759500000000 {
    name = 'ChatSessionContext1759500000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "chat_sessions"
      ADD COLUMN IF NOT EXISTS "session_context" jsonb
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "chat_sessions"
      DROP COLUMN IF EXISTS "session_context"
    `);
    }
}
exports.ChatSessionContext1759500000000 = ChatSessionContext1759500000000;
//# sourceMappingURL=1759500000000-ChatSessionContext.js.map