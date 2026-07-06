/**
 * Import Excel master → PostgreSQL.
 *
 * Logic chính: `backend/src/import-excel.ts`
 *
 * Chạy:
 *   npm run import:excel
 *   npm run import:excel:merge
 *   npx ts-node -r tsconfig-paths/register scripts/import-excel.ts -- --merge
 */

import { runExcelImport } from '../src/import-excel';

runExcelImport().catch((err) => {
  console.error('❌ Lỗi import:', err);
  process.exit(1);
});
