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
  const rows = await ds.query(`
    SELECT
      (SELECT COUNT(*)::int FROM majors) AS majors,
      (SELECT COUNT(*)::int FROM university_majors) AS university_majors,
      (SELECT COUNT(*)::int FROM cutoff_scores) AS cutoff_scores
  `);
  console.log(rows[0]);
  await ds.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
