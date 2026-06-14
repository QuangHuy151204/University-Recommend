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
const major_classification_1 = require("../src/majors/major-classification");
const major_groups_catalog_1 = require("../src/majors/major-groups-catalog");
dotenv.config();
async function main() {
    const ds = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'university_recommend',
        entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../src/database/migrations/*{.ts,.js}'],
        synchronize: false,
        migrationsRun: true,
    });
    await ds.initialize();
    const rows = await ds.query('SELECT id, name, code, field_group FROM majors ORDER BY id');
    const conflicts = [];
    const majorMapping = [];
    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
        for (const group of major_groups_catalog_1.MAJOR_GROUPS) {
            await qr.query(`INSERT INTO major_groups (group_id, group_name, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (group_id) DO UPDATE
           SET group_name = EXCLUDED.group_name,
               description = EXCLUDED.description,
               updated_at = now()`, [group.group_id, group.group_name, group.description]);
        }
        for (const major of rows) {
            const before = major.field_group;
            const classification = (0, major_classification_1.classifyMajor)(major.name, major.field_group);
            await qr.query(`UPDATE majors SET field_group = $1, tags = $2 WHERE id = $3`, [
                classification.primary_group_name,
                classification.tags,
                major.id,
            ]);
            await qr.query(`DELETE FROM major_group_assignments WHERE major_id = $1`, [
                major.id,
            ]);
            for (let i = 0; i < classification.group_ids.length; i++) {
                const groupId = classification.group_ids[i];
                if (groupId === major_groups_catalog_1.KHAC_GROUP_ID)
                    continue;
                await qr.query(`INSERT INTO major_group_assignments (major_id, group_id, is_primary)
           VALUES ($1, $2, $3)
           ON CONFLICT (major_id, group_id) DO NOTHING`, [major.id, groupId, i === 0]);
            }
            majorMapping.push({
                major_name: major.name,
                major_id: major.id,
                correct_groups: classification.group_names,
                tags: classification.tags,
            });
            const normalized = major.name.toLowerCase();
            if ((normalized.includes('an toan thong tin') ||
                normalized.includes('an ninh mang')) &&
                before &&
                (before.includes('An ninh') || before.includes('Quốc phòng'))) {
                conflicts.push({
                    major_name: major.name,
                    issue: `Nhầm sang nhóm an ninh/quốc phòng: "${before}"`,
                    fix: `→ ${classification.group_names.join(', ')}`,
                });
            }
            if ((normalized.includes('canh sat') ||
                normalized.includes('bien phong') ||
                normalized.includes('nghiep vu an ninh')) &&
                classification.group_ids.includes('cong-nghe-thong-tin')) {
                conflicts.push({
                    major_name: major.name,
                    issue: 'Nhầm sang CNTT do từ khóa "an ninh"',
                    fix: `→ ${classification.group_names.join(', ')}`,
                });
            }
        }
        await qr.commitTransaction();
    }
    catch (err) {
        await qr.rollbackTransaction();
        throw err;
    }
    finally {
        await qr.release();
    }
    const output = {
        groups: major_groups_catalog_1.MAJOR_GROUPS.map((g) => ({
            group_name: g.group_name,
            group_id: g.group_id,
            description: g.description,
        })),
        major_mapping: majorMapping,
        conflicts_fixed: conflicts,
    };
    const outPath = path.resolve(__dirname, '../../data/major-classification.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
    console.log('=== Major classification sync ===');
    console.log(`Majors synced: ${rows.length}`);
    console.log(`Conflicts fixed: ${conflicts.length}`);
    console.log(`JSON: ${outPath}`);
    await ds.destroy();
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=sync-major-classification.js.map