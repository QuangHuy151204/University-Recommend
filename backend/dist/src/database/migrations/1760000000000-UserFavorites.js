"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFavorites1760000000000 = void 0;
class UserFavorites1760000000000 {
    name = 'UserFavorites1760000000000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_favorites" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "university_id" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_favorites" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_favorites_user_university" UNIQUE ("user_id", "university_id"),
        CONSTRAINT "FK_user_favorites_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_favorites_university" FOREIGN KEY ("university_id")
          REFERENCES "universities"("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "user_favorites"`);
    }
}
exports.UserFavorites1760000000000 = UserFavorites1760000000000;
//# sourceMappingURL=1760000000000-UserFavorites.js.map