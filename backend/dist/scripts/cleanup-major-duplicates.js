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
const major_normalization_1 = require("../src/majors/major-normalization");
const duplicate_cleanup_1 = require("../src/majors/duplicate-cleanup");
dotenv.config();
const APPLY = process.argv.includes('--apply');
async function main() {
    const ds = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'university_recommend',
    });
    await ds.initialize();
    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
        const majors = (await qr.query(`
      SELECT id, name, code, field_group
      FROM majors
      ORDER BY id ASC
    `));
        const linkCountsRows = (await qr.query(`
      SELECT major_id, COUNT(*)::text AS links
      FROM university_majors
      GROUP BY major_id
    `));
        const linksByMajor = new Map(linkCountsRows.map((r) => [r.major_id, Number(r.links)]));
        const byCanonical = new Map();
        for (const m of majors) {
            const key = (0, major_normalization_1.canonicalMajorName)(m.name);
            const bucket = byCanonical.get(key) ?? [];
            bucket.push(m);
            byCanonical.set(key, bucket);
        }
        const duplicateGroups = [...byCanonical.entries()].filter(([, arr]) => arr.length > 1);
        if (duplicateGroups.length === 0) {
            console.log('✅ Không phát hiện major canonical trùng.');
            await qr.rollbackTransaction();
            await qr.release();
            await ds.destroy();
            return;
        }
        let majorsMerged = 0;
        let universityMajorsMerged = 0;
        let cutoffDeduped = 0;
        for (const [canonical, group] of duplicateGroups) {
            const decorated = group.map((m) => ({
                ...m,
                links: linksByMajor.get(m.id) ?? 0,
            }));
            const keeper = (0, duplicate_cleanup_1.pickMajorKeeper)(decorated);
            const removeIds = group.filter((m) => m.id !== keeper.id).map((m) => m.id);
            console.log(`• Canonical "${canonical}" => keep major #${keeper.id}, merge [${removeIds.join(', ')}]`);
            majorsMerged += removeIds.length;
            if (!APPLY)
                continue;
            const fallbackCode = decorated
                .map((m) => m.code)
                .find((code) => typeof code === 'string' && code.trim().length > 0);
            const fallbackFieldGroup = decorated
                .map((m) => m.field_group)
                .find((fg) => typeof fg === 'string' && fg.trim().length > 0);
            await qr.query(`UPDATE majors
         SET code = COALESCE(code, $1),
             field_group = COALESCE(field_group, $2),
             updated_at = NOW()
         WHERE id = $3`, [fallbackCode ?? null, fallbackFieldGroup ?? null, keeper.id]);
            await qr.query(`UPDATE university_majors SET major_id = $1 WHERE major_id = ANY($2::int[])`, [
                keeper.id,
                removeIds,
            ]);
            await qr.query(`DELETE FROM majors WHERE id = ANY($1::int[])`, [removeIds]);
        }
        const umRows = (await qr.query(`
      SELECT id, university_id, major_id, training_program, duration, tuition_fee, quota, admission_methods
      FROM university_majors
      ORDER BY id ASC
    `));
        const umCutoffCountRows = (await qr.query(`
      SELECT university_major_id, COUNT(*)::text AS count
      FROM cutoff_scores
      GROUP BY university_major_id
    `));
        const umCutoffCount = new Map(umCutoffCountRows.map((r) => [r.university_major_id, Number(r.count)]));
        const umByKey = new Map();
        for (const um of umRows) {
            const key = `${um.university_id}|${um.major_id}`;
            const list = umByKey.get(key) ?? [];
            list.push(um);
            umByKey.set(key, list);
        }
        const umDuplicateGroups = [...umByKey.entries()].filter(([, rows]) => rows.length > 1);
        for (const [key, group] of umDuplicateGroups) {
            const decorated = group.map((um) => ({
                ...um,
                cutoff_count: umCutoffCount.get(um.id) ?? 0,
            }));
            const keeper = (0, duplicate_cleanup_1.pickUniversityMajorKeeper)(decorated);
            const dupes = group.filter((um) => um.id !== keeper.id);
            const dupeIds = dupes.map((um) => um.id);
            console.log(`• University-major "${key}" => keep #${keeper.id}, merge [${dupeIds.join(', ')}]`);
            universityMajorsMerged += dupeIds.length;
            if (!APPLY)
                continue;
            let mergedProgram = keeper.training_program;
            let mergedDuration = keeper.duration;
            let mergedTuition = keeper.tuition_fee;
            let mergedQuota = keeper.quota;
            let mergedAdmissionMethods = keeper.admission_methods;
            for (const d of dupes) {
                mergedProgram = (0, duplicate_cleanup_1.pickLongerText)(mergedProgram, d.training_program);
                mergedDuration ??= d.duration;
                mergedTuition ??= d.tuition_fee;
                mergedQuota ??= d.quota;
                mergedAdmissionMethods = (0, duplicate_cleanup_1.pickLongerText)(mergedAdmissionMethods, d.admission_methods);
            }
            await qr.query(`UPDATE university_majors
         SET training_program = $1,
             duration = $2,
             tuition_fee = $3,
             quota = $4,
             admission_methods = $5
         WHERE id = $6`, [
                mergedProgram,
                mergedDuration,
                mergedTuition,
                mergedQuota,
                mergedAdmissionMethods,
                keeper.id,
            ]);
            await qr.query(`UPDATE cutoff_scores
         SET university_major_id = $1
         WHERE university_major_id = ANY($2::int[])`, [keeper.id, dupeIds]);
            const cutoffRows = (await qr.query(`SELECT id, year, score, admission_method, subject_combination, note
         FROM cutoff_scores
         WHERE university_major_id = $1
         ORDER BY id DESC`, [keeper.id]));
            const seen = new Set();
            for (const c of cutoffRows) {
                const dedupeKey = (0, duplicate_cleanup_1.cutoffDedupeKey)(c);
                if (seen.has(dedupeKey)) {
                    await qr.query(`DELETE FROM cutoff_scores WHERE id = $1`, [c.id]);
                    cutoffDeduped++;
                    continue;
                }
                seen.add(dedupeKey);
            }
            await qr.query(`DELETE FROM university_majors WHERE id = ANY($1::int[])`, [dupeIds]);
        }
        if (APPLY) {
            await qr.commitTransaction();
            console.log('\n✅ Cleanup applied.');
        }
        else {
            await qr.rollbackTransaction();
            console.log('\nℹ️ Preview only (không ghi DB). Chạy lại với --apply để áp dụng.');
        }
        console.log(`- Major merged: ${majorsMerged}`);
        console.log(`- University-major merged: ${universityMajorsMerged}`);
        console.log(`- Cutoff duplicate removed: ${cutoffDeduped}`);
    }
    catch (error) {
        await qr.rollbackTransaction();
        throw error;
    }
    finally {
        await qr.release();
        await ds.destroy();
    }
}
main().catch((err) => {
    console.error('❌ cleanup:majors failed', err);
    process.exit(1);
});
//# sourceMappingURL=cleanup-major-duplicates.js.map