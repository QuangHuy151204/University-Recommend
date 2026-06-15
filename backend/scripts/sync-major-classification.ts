/**
 * Đồng bộ phân loại nhóm ngành + tags cho toàn bộ majors.
 * Run: npm run sync:major-classification
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { classifyMajor } from '../src/majors/major-classification';
import {
  KHAC_GROUP_ID,
  MAJOR_GROUPS,
} from '../src/majors/major-groups-catalog';

dotenv.config();

type MajorRow = {
  id: number;
  name: string;
  code: string | null;
  field_group: string | null;
};

type ConflictFix = {
  major_name: string;
  issue: string;
  fix: string;
};

async function main(): Promise<void> {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_recommend',
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../src/database/migrations/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
  });
  await ds.initialize();

  const rows = await ds.query<MajorRow[]>(
    'SELECT id, name, code, field_group FROM majors ORDER BY id',
  );

  const conflicts: ConflictFix[] = [];
  const majorMapping: Array<{
    major_name: string;
    major_id: number;
    correct_groups: string[];
    tags: string[];
  }> = [];

  const qr = ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    for (const group of MAJOR_GROUPS) {
      await qr.query(
        `INSERT INTO major_groups (group_id, group_name, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (group_id) DO UPDATE
           SET group_name = EXCLUDED.group_name,
               description = EXCLUDED.description,
               updated_at = now()`,
        [group.group_id, group.group_name, group.description],
      );
    }

    const catalogIds = MAJOR_GROUPS.map((g) => g.group_id);
    await qr.query(
      `DELETE FROM major_groups
       WHERE group_id <> ALL($1::text[])
         AND NOT EXISTS (
           SELECT 1 FROM major_group_assignments a WHERE a.group_id = major_groups.group_id
         )`,
      [catalogIds],
    );

    for (const major of rows) {
      const before = major.field_group;
      const classification = classifyMajor(major.name, major.field_group);

      await qr.query(`UPDATE majors SET field_group = $1, tags = $2 WHERE id = $3`, [
        classification.primary_group_name,
        classification.tags,
        major.id,
      ]);

      await qr.query(`DELETE FROM major_group_assignments WHERE major_id = $1`, [
        major.id,
      ]);

      for (let i = 0; i < classification.group_ids.length; i++) {
        const groupId = classification.group_ids[i];
        if (groupId === KHAC_GROUP_ID) continue;
        await qr.query(
          `INSERT INTO major_group_assignments (major_id, group_id, is_primary)
           VALUES ($1, $2, $3)
           ON CONFLICT (major_id, group_id) DO NOTHING`,
          [major.id, groupId, i === 0],
        );
      }

      majorMapping.push({
        major_name: major.name,
        major_id: major.id,
        correct_groups: classification.group_names,
        tags: classification.tags,
      });

      const normalized = major.name.toLowerCase();
      if (
        (normalized.includes('an toan thong tin') ||
          normalized.includes('an ninh mang')) &&
        before &&
        (before.includes('An ninh') || before.includes('Quốc phòng'))
      ) {
        conflicts.push({
          major_name: major.name,
          issue: `Nhầm sang nhóm an ninh/quốc phòng: "${before}"`,
          fix: `→ ${classification.group_names.join(', ')}`,
        });
      }
      if (
        (normalized.includes('canh sat') ||
          normalized.includes('bien phong') ||
          normalized.includes('nghiep vu an ninh')) &&
        classification.group_ids.includes('cong-nghe-thong-tin')
      ) {
        conflicts.push({
          major_name: major.name,
          issue: 'Nhầm sang CNTT do từ khóa "an ninh"',
          fix: `→ ${classification.group_names.join(', ')}`,
        });
      }
    }

    await qr.commitTransaction();
  } catch (err) {
    await qr.rollbackTransaction();
    throw err;
  } finally {
    await qr.release();
  }

  const output = {
    groups: MAJOR_GROUPS.map((g) => ({
      group_name: g.group_name,
      group_id: g.group_id,
      description: g.description,
    })),
    major_mapping: majorMapping,
    conflicts_fixed: conflicts,
  };

  const outPath = path.resolve(
    __dirname,
    '../../data/major-classification.json',
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

  console.log('=== Major classification sync ===');
  console.log(`Majors synced: ${rows.length}`);
  console.log(`Conflicts fixed: ${conflicts.length}`);
  console.log(`JSON: ${outPath}`);

  await ds.destroy();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
