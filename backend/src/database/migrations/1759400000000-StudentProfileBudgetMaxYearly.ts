import { MigrationInterface, QueryRunner } from 'typeorm';

export class StudentProfileBudgetMaxYearly1759400000000 implements MigrationInterface {
  name = 'StudentProfileBudgetMaxYearly1759400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE student_profiles
      ADD COLUMN IF NOT EXISTS budget_max_yearly integer NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE student_profiles
      DROP COLUMN IF EXISTS budget_max_yearly
    `);
  }
}
