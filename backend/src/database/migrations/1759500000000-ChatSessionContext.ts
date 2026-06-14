import { MigrationInterface, QueryRunner } from 'typeorm';

/** Lưu last_university / last_major / last_intent cho follow-up trong chatbot. */
export class ChatSessionContext1759500000000 implements MigrationInterface {
  name = 'ChatSessionContext1759500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "chat_sessions"
      ADD COLUMN IF NOT EXISTS "session_context" jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "chat_sessions"
      DROP COLUMN IF EXISTS "session_context"
    `);
  }
}
