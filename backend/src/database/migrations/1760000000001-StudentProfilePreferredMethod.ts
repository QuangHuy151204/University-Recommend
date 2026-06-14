import { MigrationInterface, QueryRunner } from 'typeorm';

export class StudentProfilePreferredMethod1760000000001 implements MigrationInterface {
  name = 'StudentProfilePreferredMethod1760000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "student_profiles"
      ADD COLUMN IF NOT EXISTS "preferred_method_code" varchar DEFAULT 'THPT'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "student_profiles"
      DROP COLUMN IF EXISTS "preferred_method_code"
    `);
  }
}
