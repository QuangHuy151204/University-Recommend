"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFavoriteUniversityMajor1760000000002 = void 0;
class UserFavoriteUniversityMajor1760000000002 {
    name = 'UserFavoriteUniversityMajor1760000000002';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "user_favorites"
      ADD COLUMN IF NOT EXISTS "university_major_id" integer
    `);
        await queryRunner.query(`
      ALTER TABLE "user_favorites"
      DROP CONSTRAINT IF EXISTS "UQ_user_favorites_user_university"
    `);
        await queryRunner.query(`
      ALTER TABLE "user_favorites"
      ADD CONSTRAINT "FK_user_favorites_university_major"
      FOREIGN KEY ("university_major_id")
      REFERENCES "university_majors"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_favorites_user_university_only"
      ON "user_favorites" ("user_id", "university_id")
      WHERE "university_major_id" IS NULL
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_favorites_user_program"
      ON "user_favorites" ("user_id", "university_major_id")
      WHERE "university_major_id" IS NOT NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "UQ_user_favorites_user_program"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "UQ_user_favorites_user_university_only"`);
        await queryRunner.query(`
      ALTER TABLE "user_favorites"
      DROP CONSTRAINT IF EXISTS "FK_user_favorites_university_major"
    `);
        await queryRunner.query(`
      ALTER TABLE "user_favorites"
      DROP COLUMN IF EXISTS "university_major_id"
    `);
        await queryRunner.query(`
      ALTER TABLE "user_favorites"
      ADD CONSTRAINT "UQ_user_favorites_user_university"
      UNIQUE ("user_id", "university_id")
    `);
    }
}
exports.UserFavoriteUniversityMajor1760000000002 = UserFavoriteUniversityMajor1760000000002;
//# sourceMappingURL=1760000000002-UserFavoriteUniversityMajor.js.map