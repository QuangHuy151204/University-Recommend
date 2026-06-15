import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniversityWard1761000000000 implements MigrationInterface {
  name = 'UniversityWard1761000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE universities
      ADD COLUMN IF NOT EXISTS ward VARCHAR(100) NULL
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN universities.ward IS 'Phường/xã tại Hà Nội (sau sáp nhập 2025)'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE universities DROP COLUMN IF EXISTS ward
    `);
  }
}
