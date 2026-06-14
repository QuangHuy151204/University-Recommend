/**
 * Backfill majors.code from embedded patterns in major names.
 * Excel majors sheet has no code column — extract QHS/BJS/POHE-style tokens when present.
 * Run: npm run backfill:major-codes
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

type MajorRow = { id: number; name: string; code: string | null };

/** Extract program code from name when obvious; returns null if none. */
export function extractCodeFromMajorName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const qhs = trimmed.match(/^QHS(\d+[A-Z]?)/i);
  if (qhs) return `QHS${qhs[1].toUpperCase()}`;

  const prefix = trimmed.match(/^([A-Z]{2,6})-/);
  if (prefix) return prefix[1].toUpperCase();

  const suffix = trimmed.match(/[–-]\s*([A-Z]{2,6})\s*$/);
  if (suffix) return suffix[1].toUpperCase();

  const paren = trimmed.match(/\(([A-Z]{2,6})\)\s*$/);
  if (paren) return paren[1].toUpperCase();

  return null;
}

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
    'SELECT id, name, code FROM majors ORDER BY id',
  );

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    if (row.code?.trim()) {
      skipped++;
      continue;
    }
    const extracted = extractCodeFromMajorName(row.name);
    if (!extracted) continue;
    await ds.query('UPDATE majors SET code = $1, updated_at = NOW() WHERE id = $2', [
      extracted,
      row.id,
    ]);
    updated++;
  }

  const after = await ds.query<{ with_code: number; total: number }[]>(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE code IS NOT NULL AND TRIM(code) <> '')::int AS with_code
     FROM majors`,
  );

  console.log('=== Backfill major codes from names ===');
  console.log(`Skipped (already had code): ${skipped}`);
  console.log(`Updated from name patterns: ${updated}`);
  console.log(`With code now: ${after[0].with_code}/${after[0].total}`);

  await ds.destroy();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
