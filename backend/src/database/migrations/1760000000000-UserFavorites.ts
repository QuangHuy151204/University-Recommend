import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFavorites1760000000000 implements MigrationInterface {
  name = 'UserFavorites1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_favorites"`);
  }
}
