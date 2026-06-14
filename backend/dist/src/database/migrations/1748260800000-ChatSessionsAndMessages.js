"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionsAndMessages1748260800000 = void 0;
class ChatSessionsAndMessages1748260800000 {
    name = 'ChatSessionsAndMessages1748260800000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "chat_sessions" (
        "id" SERIAL NOT NULL,
        "user_id" integer,
        "session_key" character varying(64),
        "title" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_sessions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_chat_sessions_session_key" UNIQUE ("session_key"),
        CONSTRAINT "FK_chat_sessions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "chat_messages" (
        "id" SERIAL NOT NULL,
        "chat_session_id" integer NOT NULL,
        "sender" character varying(20) NOT NULL,
        "message" text NOT NULL,
        "metadata" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_messages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_chat_messages_session" FOREIGN KEY ("chat_session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_chat_messages_session_created"
      ON "chat_messages" ("chat_session_id", "created_at")
    `);
        const hasLegacy = await queryRunner.hasTable('chat_history');
        if (!hasLegacy)
            return;
        const rows = await queryRunner.query(`SELECT id, user_id, question, answer, session_id, created_at FROM chat_history ORDER BY id ASC`);
        const sessionIdByKey = new Map();
        for (const row of rows) {
            const cacheKey = row.session_id?.trim() ||
                (row.user_id != null ? `user:${row.user_id}` : `legacy:${row.id}`);
            let chatSessionId = sessionIdByKey.get(cacheKey);
            if (chatSessionId == null) {
                const inserted = await queryRunner.query(`INSERT INTO chat_sessions (user_id, session_key, created_at, updated_at)
           VALUES ($1, $2, $3, $3)
           RETURNING id`, [row.user_id, row.session_id?.trim() || null, row.created_at]);
                chatSessionId = inserted[0].id;
                sessionIdByKey.set(cacheKey, chatSessionId);
            }
            await queryRunner.query(`INSERT INTO chat_messages (chat_session_id, sender, message, created_at)
         VALUES ($1, 'user', $2, $3)`, [chatSessionId, row.question, row.created_at]);
            await queryRunner.query(`INSERT INTO chat_messages (chat_session_id, sender, message, created_at)
         VALUES ($1, 'assistant', $2, $3)`, [chatSessionId, row.answer, row.created_at]);
        }
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_history"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "chat_history" (
        "id" SERIAL NOT NULL,
        "user_id" integer,
        "question" text NOT NULL,
        "answer" text NOT NULL,
        "session_id" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_chat_history_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
        const sessions = await queryRunner.query(`SELECT id, session_key FROM chat_sessions`);
        for (const session of sessions) {
            const messages = await queryRunner.query(`SELECT sender, message, created_at FROM chat_messages
         WHERE chat_session_id = $1 ORDER BY created_at ASC, id ASC`, [session.id]);
            let pendingQuestion = null;
            let pendingAt = null;
            for (const msg of messages) {
                if (msg.sender === 'user') {
                    pendingQuestion = msg.message;
                    pendingAt = msg.created_at;
                }
                else if (msg.sender === 'assistant' && pendingQuestion != null) {
                    await queryRunner.query(`INSERT INTO chat_history (question, answer, session_id, created_at)
             VALUES ($1, $2, $3, $4)`, [
                        pendingQuestion,
                        msg.message,
                        session.session_key,
                        pendingAt ?? msg.created_at,
                    ]);
                    pendingQuestion = null;
                    pendingAt = null;
                }
            }
        }
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_messages"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_sessions"`);
    }
}
exports.ChatSessionsAndMessages1748260800000 = ChatSessionsAndMessages1748260800000;
//# sourceMappingURL=1748260800000-ChatSessionsAndMessages.js.map