"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEmailVerification1749000000000 = void 0;
class UserEmailVerification1749000000000 {
    name = 'UserEmailVerification1749000000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "email_verified" boolean NOT NULL DEFAULT false
    `);
        await queryRunner.query(`
      UPDATE "users" SET "email_verified" = true WHERE "email_verified" = false
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "auth_tokens" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "type" character varying(32) NOT NULL,
        "code_hash" character varying(64) NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_auth_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "FK_auth_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_auth_tokens_user_type"
      ON "auth_tokens" ("user_id", "type")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "auth_tokens"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verified"`);
    }
}
exports.UserEmailVerification1749000000000 = UserEmailVerification1749000000000;
//# sourceMappingURL=1749000000000-UserEmailVerification.js.map