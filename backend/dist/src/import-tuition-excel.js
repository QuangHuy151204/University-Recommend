"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const XLSX = __importStar(require("xlsx"));
dotenv.config();
const DEFAULT_TUITION_FILE = path.resolve(__dirname, '../../danh_sach_truong_thieu_hoc_phi_final_batch05.xlsx');
const MASTER_EXCEL = path.resolve(__dirname, '../../mau_du_lieu_truong_dai_hoc_5_sheets.xlsx');
const SHEET_TUITION = 'thieu_hoc_phi';
const SHEET_MASTER_UNI = 'universities_hanoi';
function argValue(flag) {
    const pref = `${flag}=`;
    const hit = process.argv.find((a) => a.startsWith(pref));
    return hit ? hit.slice(pref.length) : undefined;
}
const tuitionFile = path.resolve(argValue('--file') || process.env.TUITION_EXCEL_PATH || DEFAULT_TUITION_FILE);
const patchMaster = process.argv.includes('--patch-master') ||
    process.env.TUITION_PATCH_MASTER === 'true';
function cleanStr(v) {
    if (v === null || v === undefined)
        return null;
    const s = String(v).trim();
    if (!s || s.toLowerCase() === 'nan')
        return null;
    return s;
}
function parseTuitionVnd(v) {
    if (v === null || v === undefined)
        return null;
    const s = String(v).trim();
    if (!s || /^n\/?a$/i.test(s) || s.toLowerCase() === 'nan')
        return null;
    const n = Number(s.replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}
function parsePerCreditNote(v) {
    const s = cleanStr(v);
    if (!s)
        return null;
    if (/^n\/?a(\s|$|-|—)/i.test(s))
        return null;
    if (/^không thấy công bố/i.test(s))
        return null;
    return s;
}
function resolveMinMax(minRaw, maxRaw) {
    let min = parseTuitionVnd(minRaw);
    let max = parseTuitionVnd(maxRaw);
    if (min === 0 && max === null)
        max = 0;
    if (min !== null && max === null)
        max = min;
    if (min === null && max !== null)
        min = max;
    if (min === null || max === null)
        return null;
    if (min > max)
        [min, max] = [max, min];
    return { min, max };
}
function readTuitionRows(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Không tìm thấy file: ${filePath}`);
    }
    const wb = XLSX.readFile(filePath);
    const sheet = wb.Sheets[SHEET_TUITION];
    if (!sheet) {
        throw new Error(`Sheet "${SHEET_TUITION}" không có trong ${filePath}`);
    }
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
}
function patchMasterUniversities(updates) {
    if (!fs.existsSync(MASTER_EXCEL)) {
        console.warn(`  [WARN] Không tìm thấy master Excel: ${MASTER_EXCEL}`);
        return 0;
    }
    const wb = XLSX.readFile(MASTER_EXCEL);
    const sheet = wb.Sheets[SHEET_MASTER_UNI];
    if (!sheet) {
        console.warn(`  [WARN] Sheet "${SHEET_MASTER_UNI}" không có trong master Excel`);
        return 0;
    }
    const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
    });
    let patched = 0;
    for (const row of rows) {
        const short = cleanStr(row['short_name']);
        if (!short)
            continue;
        const fee = updates.get(short);
        if (!fee || fee.min === undefined)
            continue;
        row['tuition_fee_min'] = fee.min;
        row['tuition_fee_max'] = fee.max;
        if (fee.source && !cleanStr(row['source_url'])) {
            row['source_url'] = fee.source;
        }
        patched++;
    }
    wb.Sheets[SHEET_MASTER_UNI] = XLSX.utils.json_to_sheet(rows);
    XLSX.writeFile(wb, MASTER_EXCEL);
    return patched;
}
async function main() {
    console.log('📂 File học phí:', tuitionFile);
    const rows = readTuitionRows(tuitionFile);
    console.log(`   ${rows.length} dòng trên sheet "${SHEET_TUITION}"`);
    const updates = new Map();
    const skipped = [];
    for (const row of rows) {
        const short = cleanStr(row.short_name);
        if (!short)
            continue;
        const entry = updates.get(short) ?? {};
        const perCredit = parsePerCreditNote(row.hoc_phi_tin_chi_text);
        if (perCredit)
            entry.perCreditNote = perCredit;
        const fees = resolveMinMax(row.tuition_fee_min_vnd, row.tuition_fee_max_vnd);
        if (fees) {
            entry.min = fees.min;
            entry.max = fees.max;
            entry.source = cleanStr(row.nguon_hoc_phi);
        }
        if (entry.min !== undefined || entry.perCreditNote) {
            updates.set(short, entry);
        }
        else {
            skipped.push({
                short,
                reason: 'Không có học phí/năm số và không có mô tả tín chỉ',
            });
        }
    }
    const withYearly = [...updates.values()].filter((u) => u.min !== undefined).length;
    const withPerCredit = [...updates.values()].filter((u) => u.perCreditNote).length;
    console.log(`   Sẵn sàng cập nhật: ${updates.size} trường (${withYearly} có phí/năm, ${withPerCredit} có ghi chú tín chỉ)`);
    if (skipped.length) {
        console.log(`   Bỏ qua: ${skipped.length}`);
        for (const s of skipped) {
            console.log(`     - ${s.short}: ${s.reason}`);
        }
    }
    if (patchMaster) {
        const n = patchMasterUniversities(updates);
        console.log(`✅ Master Excel (${SHEET_MASTER_UNI}): ${n} dòng đã ghi học phí`);
    }
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'university_recommend',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
    });
    await dataSource.initialize();
    console.log('✅ Kết nối PostgreSQL');
    const qr = dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    let updated = 0;
    let notFound = 0;
    try {
        for (const [short, fee] of updates) {
            const existing = (await qr.query(`SELECT id FROM universities WHERE short_name = $1 LIMIT 1`, [short]));
            if (!existing.length) {
                notFound++;
                continue;
            }
            await qr.query(`UPDATE universities
         SET tuition_fee_min = COALESCE($1, tuition_fee_min),
             tuition_fee_max = COALESCE($2, tuition_fee_max),
             source_url = COALESCE($3, source_url),
             tuition_per_credit_note = COALESCE($4, tuition_per_credit_note),
             updated_at = NOW()
         WHERE id = $5`, [
                fee.min ?? null,
                fee.max ?? null,
                fee.source ?? null,
                fee.perCreditNote ?? null,
                existing[0].id,
            ]);
            updated++;
        }
        const countRows = (await qr.query(`SELECT COUNT(*)::int AS c FROM universities
         WHERE tuition_fee_min IS NOT NULL AND tuition_fee_max IS NOT NULL`))[0]?.c;
        const perCreditCount = (await qr.query(`SELECT COUNT(*)::int AS c FROM universities
         WHERE tuition_per_credit_note IS NOT NULL
           AND TRIM(tuition_per_credit_note) <> ''`))[0]?.c;
        await qr.commitTransaction();
        console.log(`✅ PostgreSQL: ${updated} trường đã cập nhật học phí`);
        if (notFound) {
            console.log(`   ⚠ ${notFound} short_name không khớp DB (chạy import:excel trước?)`);
        }
        console.log(`   Trường có học phí min/max trong DB: ${countRows ?? '?'}`);
        console.log(`   Trường có ghi chú học phí/tín chỉ: ${perCreditCount ?? '?'}`);
    }
    catch (err) {
        await qr.rollbackTransaction();
        throw err;
    }
    finally {
        await qr.release();
        await dataSource.destroy();
    }
    console.log('\n🎉 Import học phí hoàn tất!');
    if (!patchMaster) {
        console.log('   Gợi ý: chạy lại với --patch-master để ghi vào mau_du_lieu_truong_dai_hoc_5_sheets.xlsx');
    }
}
main().catch((err) => {
    console.error('❌ Lỗi import học phí:', err);
    process.exit(1);
});
//# sourceMappingURL=import-tuition-excel.js.map