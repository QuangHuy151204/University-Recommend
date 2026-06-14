import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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

  const rows = await ds.query(
    'SELECT id, name, code, field_group FROM majors ORDER BY name',
  );
  const outPath = path.resolve(__dirname, '../../data/majors-full-export.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8');
  console.log(`Exported ${rows.length} majors to ${outPath}`);

  await ds.destroy();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
