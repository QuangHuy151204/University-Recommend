import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Chuẩn hoá scope Hà Nội: xóa trường ngoài HN (CASCADE university_majors, cutoff_scores),
 * gán location trống → Hà Nội, profile user → Hà Nội.
 */
export class HanoiOnlyDataScope1751000000000 implements MigrationInterface {
  name = 'HanoiOnlyDataScope1751000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE universities
      SET location = 'Hà Nội'
      WHERE location IS NULL OR TRIM(location) = ''
    `);

    await queryRunner.query(`
      DELETE FROM universities
      WHERE location NOT ILIKE '%Hà Nội%'
        AND location NOT ILIKE '%Ha Noi%'
        AND location NOT ILIKE '%hanoi%'
    `);

    await queryRunner.query(`
      UPDATE student_profiles
      SET preferred_location = 'Hà Nội'
      WHERE preferred_location IS NULL
         OR TRIM(preferred_location) = ''
         OR (
           preferred_location NOT ILIKE '%Hà Nội%'
           AND preferred_location NOT ILIKE '%Ha Noi%'
           AND preferred_location NOT ILIKE '%hanoi%'
         )
    `);
  }

  public async down(): Promise<void> {
    // Không khôi phục dữ liệu trường đã xóa.
  }
}
