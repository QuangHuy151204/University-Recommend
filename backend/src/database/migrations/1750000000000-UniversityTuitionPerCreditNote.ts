import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniversityTuitionPerCreditNote1750000000000 implements MigrationInterface {
  name = 'UniversityTuitionPerCreditNote1750000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "universities"
      ADD COLUMN IF NOT EXISTS "tuition_per_credit_note" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "universities"
      DROP COLUMN IF EXISTS "tuition_per_credit_note"
    `);
  }
}
