import { MigrationInterface, QueryRunner } from 'typeorm';

/** Speed up university browse filters (latest-year cutoff join). */
export class CutoffScoreFilterIndexes1762000000000 implements MigrationInterface {
  name = 'CutoffScoreFilterIndexes1762000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_cutoff_scores_um_year"
      ON "cutoff_scores" ("university_major_id", "year" DESC)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_university_majors_major_id"
      ON "university_majors" ("major_id")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_university_majors_university_id"
      ON "university_majors" ("university_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_university_majors_university_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_university_majors_major_id"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cutoff_scores_um_year"`);
  }
}
