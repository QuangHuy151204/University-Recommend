/**
 * Báo cáo chất lượng dữ liệu: học phí thiếu, ngành chưa phân loại.
 * Run: npm run report:data-gaps
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_recommend',
  });
  await ds.initialize();

  const [{ count: uniTotal }] = await ds.query<{ count: string }[]>(
    'SELECT COUNT(*)::text AS count FROM universities',
  );
  const [{ count: missingTuition }] = await ds.query<{ count: string }[]>(
    `SELECT COUNT(*)::text AS count FROM universities
     WHERE tuition_fee_min IS NULL AND tuition_fee_max IS NULL`,
  );
  const missingTuitionList = await ds.query<
    { id: number; name: string; short_name: string | null }[]
  >(
    `SELECT id, name, short_name FROM universities
     WHERE tuition_fee_min IS NULL AND tuition_fee_max IS NULL
     ORDER BY name LIMIT 20`,
  );
  const [{ count: majorTotal }] = await ds.query<{ count: string }[]>(
    'SELECT COUNT(*)::text AS count FROM majors',
  );
  const [{ count: uncategorizedMajors }] = await ds.query<{ count: string }[]>(
    `SELECT COUNT(*)::text AS count FROM majors
     WHERE field_group IS NULL OR TRIM(field_group) = '' OR field_group = 'Khác'`,
  );

  console.log('=== Data quality report ===');
  console.log(`Universities: ${uniTotal} total, ${missingTuition} missing tuition`);
  if (missingTuitionList.length > 0) {
    console.log('Sample missing tuition (max 20):');
    for (const u of missingTuitionList) {
      console.log(`  - [${u.id}] ${u.short_name ?? u.name}`);
    }
  }
  console.log(
    `Majors: ${majorTotal} total, ${uncategorizedMajors} uncategorized (null/empty/Khác)`,
  );
  console.log(
    'Tip: npm run import:tuition (needs danh_sach_truong_thieu_hoc_phi_final_batch05.xlsx)',
  );

  await ds.destroy();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
