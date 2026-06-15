import { MigrationInterface, QueryRunner } from 'typeorm';

/** Gộp nhóm An toàn thông tin vào Công nghệ thông tin. */
export class MergeCybersecurityIntoIt1760000000004 implements MigrationInterface {
  name = 'MergeCybersecurityIntoIt1760000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO major_group_assignments (major_id, group_id, is_primary)
      SELECT major_id, 'cong-nghe-thong-tin', is_primary
      FROM major_group_assignments
      WHERE group_id = 'an-toan-thong-tin'
      ON CONFLICT (major_id, group_id) DO NOTHING
    `);

    await queryRunner.query(`
      DELETE FROM major_group_assignments
      WHERE group_id = 'an-toan-thong-tin'
    `);

    await queryRunner.query(`
      UPDATE majors
      SET field_group = 'Công nghệ thông tin'
      WHERE field_group = 'An toàn thông tin'
    `);

    await queryRunner.query(`
      UPDATE major_groups
      SET description = 'Lập trình, phần mềm, khoa học máy tính, AI, dữ liệu, mạng máy tính, an toàn thông tin, cybersecurity, điện tử viễn thông số.',
          updated_at = now()
      WHERE group_id = 'cong-nghe-thong-tin'
    `);

    await queryRunner.query(`
      DELETE FROM major_groups
      WHERE group_id = 'an-toan-thong-tin'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO major_groups (group_id, group_name, description)
      VALUES (
        'an-toan-thong-tin',
        'An toàn thông tin',
        'Cybersecurity, bảo mật hệ thống, an ninh mạng IT, kiểm thử bảo mật — không bao gồm cảnh sát/quân đội.'
      )
      ON CONFLICT (group_id) DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE major_groups
      SET description = 'Lập trình, phần mềm, khoa học máy tính, AI, dữ liệu, mạng máy tính, điện tử viễn thông số.',
          updated_at = now()
      WHERE group_id = 'cong-nghe-thong-tin'
    `);
  }
}
