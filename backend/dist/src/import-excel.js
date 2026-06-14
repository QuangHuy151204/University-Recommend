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
const path = __importStar(require("path"));
const XLSX = __importStar(require("xlsx"));
const data_scope_1 = require("./common/data-scope");
const major_normalization_1 = require("./majors/major-normalization");
const major_classification_1 = require("./majors/major-classification");
const major_groups_catalog_1 = require("./majors/major-groups-catalog");
dotenv.config();
const EXCEL_PATH = path.resolve(__dirname, '../../mau_du_lieu_truong_dai_hoc_5_sheets.xlsx');
const SHEET_UNIVERSITIES = 'universities_hanoi';
const SHEET_METHODS = 'admission_methods';
const SHEET_MAJORS = 'majors';
const SHEET_UNI_MAJORS = 'university_majors';
const SHEET_DTN = 'cutoff_scores(ĐTN)';
const SHEET_DGNL = 'cutoff_scores(ĐGNL)';
const mergeMode = process.argv.includes('--merge') || process.env.IMPORT_MERGE === 'true';
function cleanStr(v) {
    if (v === null || v === undefined)
        return null;
    const s = String(v).trim();
    if (!s || s.toLowerCase() === 'nan')
        return null;
    return s;
}
function cleanNum(v) {
    if (v === null || v === undefined)
        return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}
function cleanInt(v) {
    const n = cleanNum(v);
    return n === null ? null : Math.round(n);
}
function readSheet(wb, name) {
    const sheet = wb.Sheets[name];
    if (!sheet) {
        console.warn(`  [WARN] Không tìm thấy sheet: ${name}`);
        return [];
    }
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
}
async function upsertCutoff(qr, row, merge) {
    const comboKey = row.combo ?? '';
    if (merge) {
        const existing = await qr.query(`SELECT id FROM cutoff_scores
       WHERE university_major_id = $1 AND year = $2
         AND COALESCE(subject_combination, '') = $3
         AND admission_method = $4
       LIMIT 1`, [row.umId, row.year, comboKey, row.methodLabel]);
        if (existing.length > 0) {
            await qr.query(`UPDATE cutoff_scores SET score = $1, note = $2 WHERE id = $3`, [row.score, row.note, existing[0].id]);
            return 'updated';
        }
    }
    await qr.query(`INSERT INTO cutoff_scores (university_major_id, year, score, admission_method, subject_combination, note)
     VALUES ($1,$2,$3,$4,$5,$6)`, [row.umId, row.year, row.score, row.methodLabel, row.combo, row.note]);
    return 'inserted';
}
async function main() {
    console.log('📂 Đọc file:', EXCEL_PATH);
    if (mergeMode) {
        console.log('🔄 Chế độ MERGE — giữ users/chat/recommendations, upsert master data');
    }
    else {
        console.log('🗑️  Chế độ mặc định — TRUNCATE master tables rồi nạp lại');
    }
    const wb = XLSX.readFile(EXCEL_PATH);
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'university_recommend',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        migrationsRun: process.env.DB_MIGRATIONS_RUN !== 'false',
    });
    await dataSource.initialize();
    console.log('✅ Kết nối PostgreSQL thành công');
    const qr = dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
        if (!mergeMode) {
            console.log('🗑️  Xóa dữ liệu cũ (giữ users, chat, recommendations)...');
            await qr.query(`TRUNCATE TABLE cutoff_scores, university_majors, majors, admission_methods, universities RESTART IDENTITY CASCADE`);
        }
        const uniIdByShort = new Map();
        const majorIdByName = new Map();
        const majorIdByCanonicalName = new Map();
        const umIdByKey = new Map();
        const methodNameByCode = new Map();
        if (mergeMode) {
            const uniRowsDb = await qr.query(`SELECT id, short_name FROM universities WHERE short_name IS NOT NULL`);
            for (const r of uniRowsDb) {
                uniIdByShort.set(r.short_name, r.id);
            }
            const majorRowsDb = await qr.query(`SELECT id, name FROM majors`);
            for (const r of majorRowsDb) {
                majorIdByName.set(r.name, r.id);
                majorIdByCanonicalName.set((0, major_normalization_1.canonicalMajorName)(r.name), r.id);
            }
            const umRowsDb = await qr.query(`SELECT id, university_id, major_id FROM university_majors`);
            for (const r of umRowsDb) {
                umIdByKey.set(`${r.university_id}|${r.major_id}`, r.id);
            }
            const methodRowsDb = await qr.query(`SELECT method_code, method_name FROM admission_methods`);
            for (const r of methodRowsDb) {
                methodNameByCode.set(r.method_code, r.method_name);
            }
            console.log(`  Đã nạp cache: ${uniIdByShort.size} trường, ${majorIdByName.size} ngành, ${umIdByKey.size} liên kết`);
        }
        const uniRows = readSheet(wb, SHEET_UNIVERSITIES);
        for (const row of uniRows) {
            const short = cleanStr(row['short_name']);
            if (!short)
                continue;
            const rawLocation = cleanStr(row['location']) || data_scope_1.DATA_SCOPE_LOCATION;
            if (!(0, data_scope_1.isHanoiLocation)(rawLocation)) {
                console.warn(`  ⏭️  Bỏ qua ${short}: location "${rawLocation}" ngoài phạm vi Hà Nội`);
                continue;
            }
            const params = [
                cleanStr(row['name']) || short,
                short,
                cleanStr(row['type']) || 'public',
                rawLocation,
                cleanStr(row['address']),
                cleanStr(row['website']),
                cleanStr(row['description']),
                cleanNum(row['tuition_fee_min']),
                cleanNum(row['tuition_fee_max']),
                cleanStr(row['source_url']),
            ];
            const existingId = uniIdByShort.get(short);
            if (mergeMode && existingId !== undefined) {
                await qr.query(`UPDATE universities SET name=$1, short_name=$2, type=$3, location=$4, address=$5, website=$6,
           description=$7, tuition_fee_min=$8, tuition_fee_max=$9, source_url=$10, updated_at=NOW()
           WHERE id=$11`, [...params, existingId]);
            }
            else {
                const result = await qr.query(`INSERT INTO universities (name, short_name, type, location, address, website, description, tuition_fee_min, tuition_fee_max, source_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`, params);
                uniIdByShort.set(short, result[0].id);
            }
        }
        console.log(`✅ universities: ${uniIdByShort.size} trường`);
        const methodRows = readSheet(wb, SHEET_METHODS);
        for (const row of methodRows) {
            const code = cleanStr(row['method_code']);
            if (!code)
                continue;
            const name = cleanStr(row['method_name']) || code;
            methodNameByCode.set(code, name);
            if (mergeMode) {
                await qr.query(`INSERT INTO admission_methods (method_code, method_name, description)
           VALUES ($1,$2,$3)
           ON CONFLICT (method_code) DO UPDATE SET
             method_name = EXCLUDED.method_name,
             description = EXCLUDED.description`, [code, name, cleanStr(row['description'])]);
            }
            else {
                await qr.query(`INSERT INTO admission_methods (method_code, method_name, description) VALUES ($1,$2,$3)`, [code, name, cleanStr(row['description'])]);
            }
        }
        console.log(`✅ admission_methods: ${methodNameByCode.size} phương thức`);
        const majorRows = readSheet(wb, SHEET_MAJORS);
        for (const row of majorRows) {
            const name = cleanStr(row['name']);
            if (!name)
                continue;
            const canonicalName = (0, major_normalization_1.canonicalMajorName)(name);
            const fieldGroup = (0, major_normalization_1.canonicalFieldGroup)(name, cleanStr(row['Field Group']) || cleanStr(row['field_group']));
            const code = cleanStr(row['code']);
            const description = cleanStr(row['description']);
            const orientation = cleanStr(row['career_orientation']);
            const existingCanonicalId = majorIdByCanonicalName.get(canonicalName);
            if (existingCanonicalId !== undefined) {
                majorIdByName.set(name, existingCanonicalId);
                if (mergeMode) {
                    await qr.query(`UPDATE majors
             SET code = COALESCE($1, code),
                 description = COALESCE($2, description),
                 career_orientation = COALESCE($3, career_orientation),
                 field_group = COALESCE($4, field_group),
                 updated_at = NOW()
             WHERE id = $5`, [code, description, orientation, fieldGroup, existingCanonicalId]);
                }
                continue;
            }
            const result = await qr.query(`INSERT INTO majors (name, code, description, career_orientation, field_group)
         VALUES ($1,$2,$3,$4,$5) RETURNING id`, [name, code, description, orientation, fieldGroup]);
            majorIdByName.set(name, result[0].id);
            majorIdByCanonicalName.set(canonicalName, result[0].id);
        }
        console.log(`✅ majors (sheet): ${majorIdByName.size} ngành`);
        async function getOrCreateUniversityMajor(uniShort, majorName, extra) {
            const uniId = uniIdByShort.get(uniShort);
            if (!uniId)
                return null;
            let majorId = majorIdByName.get(majorName);
            if (majorId === undefined) {
                const canonicalName = (0, major_normalization_1.canonicalMajorName)(majorName);
                const existingCanonicalId = majorIdByCanonicalName.get(canonicalName);
                if (existingCanonicalId !== undefined) {
                    majorId = existingCanonicalId;
                    majorIdByName.set(majorName, majorId);
                }
            }
            if (majorId === undefined) {
                const canonicalName = (0, major_normalization_1.canonicalMajorName)(majorName);
                const ins = await qr.query(`INSERT INTO majors (name, field_group) VALUES ($1, $2) RETURNING id`, [majorName, (0, major_normalization_1.canonicalFieldGroup)(majorName, null)]);
                majorId = ins[0].id;
                majorIdByName.set(majorName, majorId);
                majorIdByCanonicalName.set(canonicalName, majorId);
            }
            const key = `${uniId}|${majorId}`;
            if (umIdByKey.has(key)) {
                if (mergeMode && extra) {
                    await qr.query(`UPDATE university_majors SET training_program = COALESCE($1, training_program),
             duration = COALESCE($2, duration), tuition_fee = COALESCE($3, tuition_fee),
             admission_methods = COALESCE($4, admission_methods)
             WHERE id = $5`, [
                        extra.program,
                        extra.duration,
                        extra.tuition,
                        extra.admissionNotes,
                        umIdByKey.get(key),
                    ]);
                }
                return umIdByKey.get(key);
            }
            const result = await qr.query(`INSERT INTO university_majors (university_id, major_id, training_program, duration, tuition_fee, admission_methods)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`, [
                uniId,
                majorId,
                extra?.program ?? null,
                extra?.duration ?? null,
                extra?.tuition ?? null,
                extra?.admissionNotes ?? null,
            ]);
            umIdByKey.set(key, result[0].id);
            return result[0].id;
        }
        const umRows = readSheet(wb, SHEET_UNI_MAJORS);
        for (const row of umRows) {
            const uniShort = cleanStr(row['university_short_name']);
            const majorName = cleanStr(row['major_name']);
            if (!uniShort || !majorName)
                continue;
            await getOrCreateUniversityMajor(uniShort, majorName, {
                program: cleanStr(row['program_name']),
                duration: cleanInt(row['duration_years']),
                tuition: cleanNum(row['tuition_fee']),
                admissionNotes: cleanStr(row['admission_notes']),
            });
        }
        console.log(`✅ university_majors (sheet): ${umIdByKey.size} liên kết`);
        const tuitionAggRows = await qr.query(`SELECT
         um.university_id AS university_id,
         MIN(um.tuition_fee) AS tuition_fee_min,
         MAX(um.tuition_fee) AS tuition_fee_max
       FROM university_majors um
       WHERE um.tuition_fee IS NOT NULL AND um.tuition_fee > 0
       GROUP BY um.university_id`);
        let tuitionBackfilled = 0;
        for (const row of tuitionAggRows) {
            const min = cleanNum(row.tuition_fee_min);
            const max = cleanNum(row.tuition_fee_max);
            if (min === null || max === null)
                continue;
            await qr.query(`UPDATE universities
         SET tuition_fee_min = $1,
             tuition_fee_max = $2,
             updated_at = NOW()
         WHERE id = $3`, [min, max, row.university_id]);
            tuitionBackfilled++;
        }
        console.log(`✅ universities tuition backfill: ${tuitionBackfilled} trường (từ university_majors)`);
        const cutoffRows = [
            ...readSheet(wb, SHEET_DTN),
            ...readSheet(wb, SHEET_DGNL),
        ];
        let cutoffInserted = 0;
        let cutoffUpdated = 0;
        let cutoffSkipped = 0;
        for (const row of cutoffRows) {
            const uniShort = cleanStr(row['university_short_name']);
            const majorName = cleanStr(row['major_name']);
            const year = cleanNum(row['year']);
            const score = cleanNum(row['score']);
            const methodCode = cleanStr(row['admission_method_code']);
            const combo = cleanStr(row['subject_combination']);
            const note = cleanStr(row['Note']) || cleanStr(row['note']);
            if (!uniShort || !majorName || !year || score === null) {
                cutoffSkipped++;
                continue;
            }
            const umId = await getOrCreateUniversityMajor(uniShort, majorName);
            if (!umId) {
                cutoffSkipped++;
                continue;
            }
            const methodLabel = (methodCode && methodNameByCode.get(methodCode)) ||
                methodCode ||
                'THPT';
            const result = await upsertCutoff(qr, { umId, year, score, methodLabel, combo, note }, mergeMode);
            if (result === 'inserted')
                cutoffInserted++;
            else if (result === 'updated')
                cutoffUpdated++;
        }
        console.log(`✅ cutoff_scores: +${cutoffInserted} mới` +
            (mergeMode ? `, ${cutoffUpdated} cập nhật` : '') +
            ` (bỏ qua ${cutoffSkipped})`);
        console.log(`✅ majors (tổng sau import): ${majorIdByName.size}`);
        console.log(`✅ university_majors (tổng): ${umIdByKey.size}`);
        console.log('🔄 Đồng bộ nhóm ngành + tags...');
        const allMajors = await qr.query('SELECT id, name, field_group FROM majors ORDER BY id');
        for (const major of allMajors) {
            const classification = (0, major_classification_1.classifyMajor)(major.name, major.field_group);
            await qr.query('UPDATE majors SET field_group = $1, tags = $2 WHERE id = $3', [classification.primary_group_name, classification.tags, major.id]);
            await qr.query('DELETE FROM major_group_assignments WHERE major_id = $1', [major.id]);
            for (let i = 0; i < classification.group_ids.length; i++) {
                const groupId = classification.group_ids[i];
                if (groupId === major_groups_catalog_1.KHAC_GROUP_ID)
                    continue;
                await qr.query(`INSERT INTO major_group_assignments (major_id, group_id, is_primary)
           VALUES ($1, $2, $3)
           ON CONFLICT (major_id, group_id) DO NOTHING`, [major.id, groupId, i === 0]);
            }
        }
        console.log(`✅ Phân loại: ${allMajors.length} ngành`);
        await qr.commitTransaction();
        console.log('\n🎉 Import Excel vào PostgreSQL hoàn tất!');
    }
    catch (err) {
        await qr.rollbackTransaction();
        throw err;
    }
    finally {
        await qr.release();
        await dataSource.destroy();
    }
}
main().catch((err) => {
    console.error('❌ Lỗi import:', err);
    process.exit(1);
});
//# sourceMappingURL=import-excel.js.map