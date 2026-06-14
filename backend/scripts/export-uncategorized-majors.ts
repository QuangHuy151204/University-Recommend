/**
 * Export majors still classified as "Khác" after keyword rules.
 * Writes CSV + JSON summary for keyword tuning.
 * Run: npm run export:uncategorized-majors
 */
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { classifyMajor } from '../src/majors/major-normalization';

dotenv.config();

const OUT_DIR = path.resolve(__dirname, '..', '..', 'data');

type MajorRow = {
  id: number;
  name: string;
  code: string | null;
  field_group: string | null;
};

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

  const rows = await ds.query<MajorRow[]>(
    'SELECT id, name, code, field_group FROM majors ORDER BY name',
  );

  const uncategorized = rows
    .map((r) => ({
      ...r,
      canonical_group: classifyMajor(r.name, r.field_group).primary_group_name,
    }))
    .filter((r) => r.canonical_group === 'Khác');

  const rawOnly = uncategorized.filter(
    (r) =>
      !r.field_group?.trim() ||
      r.field_group.trim() === 'Khác' ||
      r.field_group.trim() === r.canonical_group,
  );

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const csvPath = path.join(OUT_DIR, `majors-khac-${stamp}.csv`);
  const jsonPath = path.join(OUT_DIR, `majors-khac-${stamp}.json`);

  const csvLines = [
    'id,name,code,field_group,canonical_group',
    ...uncategorized.map(
      (r) =>
        `${r.id},"${r.name.replace(/"/g, '""')}","${r.code ?? ''}","${(r.field_group ?? '').replace(/"/g, '""')}",${r.canonical_group}`,
    ),
  ];
  fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');

  const nameTokens = new Map<string, number>();
  for (const r of uncategorized) {
    const tokens = r.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .split(/[\s,;/()\-–]+/)
      .filter((t) => t.length >= 4);
    for (const t of tokens) {
      nameTokens.set(t, (nameTokens.get(t) ?? 0) + 1);
    }
  }
  const frequentTokens = [...nameTokens.entries()]
    .filter(([, c]) => c >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([token, count]) => ({ token, count }));

  const summary = {
    generated_at: new Date().toISOString(),
    total_majors: rows.length,
    uncategorized_count: uncategorized.length,
    raw_uncategorized_count: rawOnly.length,
    frequent_name_tokens: frequentTokens,
    sample: uncategorized.slice(0, 50).map((r) => ({
      id: r.id,
      name: r.name,
      field_group: r.field_group,
    })),
  };
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log('=== Uncategorized majors export ===');
  console.log(`Total majors: ${rows.length}`);
  console.log(`Canonical "Khác": ${uncategorized.length}`);
  console.log(`CSV: ${csvPath}`);
  console.log(`JSON: ${jsonPath}`);
  console.log('\nTop name tokens (count >= 3):');
  for (const { token, count } of frequentTokens.slice(0, 15)) {
    console.log(`  ${count}x  ${token}`);
  }
  console.log('\nSample (first 15):');
  for (const r of uncategorized.slice(0, 15)) {
    console.log(`  [${r.id}] ${r.name}`);
  }

  await ds.destroy();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
