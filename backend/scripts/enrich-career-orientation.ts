// @file: CLI that enriches major career_orientation fields in Excel and optionally imports them.
/**
 * Bổ sung career_orientation vào sheet `majors` của file Excel master.
 *
 * Chạy:
 *   npm run enrich:career-orientation
 *   npm run enrich:career-orientation -- --dry-run
 *   npm run enrich:career-orientation -- --merge-import   # patch Excel rồi import:excel:merge
 *
 * Sau khi patch Excel, nạp DB:
 *   npm run import:excel:merge
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import {
  buildFilledOrientationMap,
  ENRICH_FIELD_GROUPS,
  resolveCareerOrientation,
} from '../src/data/career-orientation-enrichment';
import { runExcelImport } from '../src/import-excel';

dotenv.config();

const DEFAULT_EXCEL_PATH = path.resolve(
  __dirname,
  '../../mau_du_lieu_truong_dai_hoc_5_sheets_bo_sung_phuong.xlsx',
);

const excelPath = process.env.IMPORT_EXCEL_PATH
  ? path.resolve(process.env.IMPORT_EXCEL_PATH)
  : DEFAULT_EXCEL_PATH;

const dryRun =
  process.argv.includes('--dry-run') || process.env.ENRICH_DRY_RUN === 'true';
const mergeImport =
  process.argv.includes('--merge-import') ||
  process.env.ENRICH_MERGE_IMPORT === 'true';

type MajorSheetRow = Record<string, unknown> & {
  name?: string;
  'Field Group'?: string;
  field_group?: string;
  career_orientation?: string;
};

function cleanStr(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || s.toLowerCase() === 'nan') return null;
  return s;
}

async function main() {
  console.log('📂 File Excel:', excelPath);
  if (!fs.existsSync(excelPath)) {
    throw new Error(`Không tìm thấy file Excel: ${excelPath}`);
  }

  const wb = XLSX.readFile(excelPath);
  const sheetName = 'majors';
  const sheet = wb.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Không tìm thấy sheet "${sheetName}"`);
  }

  const rows = XLSX.utils.sheet_to_json<MajorSheetRow>(sheet, { defval: null });
  const inputs = rows
    .map((r) => ({
      name: cleanStr(r.name) ?? '',
      fieldGroup: cleanStr(r['Field Group']) || cleanStr(r.field_group),
      career_orientation: cleanStr(r.career_orientation),
    }))
    .filter((r) => r.name);

  const filledMap = buildFilledOrientationMap(inputs);
  const stats = {
    patched: 0,
    skipped_existing: 0,
    skipped_other_group: 0,
    by_source: { inherit: 0, pattern: 0, field_group: 0 } as Record<
      string,
      number
    >,
  };

  for (let i = 0; i < rows.length; i++) {
    const name = cleanStr(rows[i].name);
    if (!name) continue;

    const result = resolveCareerOrientation(
      {
        name,
        fieldGroup:
          cleanStr(rows[i]['Field Group']) || cleanStr(rows[i].field_group),
        career_orientation: cleanStr(rows[i].career_orientation),
      },
      filledMap,
    );

    if (!result) {
      stats.skipped_other_group++;
      continue;
    }
    if (result.source === 'existing') {
      stats.skipped_existing++;
      continue;
    }

    rows[i].career_orientation = result.career_orientation;
    filledMap.set(name.toLowerCase(), result.career_orientation);
    stats.patched++;
    stats.by_source[result.source] =
      (stats.by_source[result.source] ?? 0) + 1;
  }

  console.log(`\n📊 Kết quả (nhóm: ${ENRICH_FIELD_GROUPS.join(', ')})`);
  console.log(`   Đã bổ sung: ${stats.patched}`);
  console.log(`   Giữ nguyên (đã có): ${stats.skipped_existing}`);
  console.log(`   Bỏ qua (ngoài 3 nhóm): ${stats.skipped_other_group}`);
  console.log(`   Theo nguồn:`, stats.by_source);

  if (dryRun) {
    console.log('\n🔍 --dry-run: không ghi file Excel.');
    return;
  }

  const backupPath = `${excelPath}.bak-${new Date().toISOString().slice(0, 10)}`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(excelPath, backupPath);
    console.log(`\n💾 Backup: ${backupPath}`);
  }

  const newSheet = XLSX.utils.json_to_sheet(rows);
  wb.Sheets[sheetName] = newSheet;
  XLSX.writeFile(wb, excelPath);
  console.log(`\n✅ Đã ghi career_orientation vào sheet majors (${excelPath})`);

  if (mergeImport) {
    console.log('\n🔄 Chạy import:excel:merge...');
    process.env.IMPORT_MERGE = 'true';
    await runExcelImport();
  } else {
    console.log('\n👉 Chạy tiếp: npm run import:excel:merge');
  }
}

main().catch((err) => {
  console.error('❌ Lỗi enrich career_orientation:', err);
  process.exit(1);
});
