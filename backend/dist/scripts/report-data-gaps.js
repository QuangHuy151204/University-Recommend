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
dotenv.config();
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
    const [{ count: uniTotal }] = await ds.query('SELECT COUNT(*)::text AS count FROM universities');
    const [{ count: missingTuition }] = await ds.query(`SELECT COUNT(*)::text AS count FROM universities
     WHERE tuition_fee_min IS NULL AND tuition_fee_max IS NULL`);
    const missingTuitionList = await ds.query(`SELECT id, name, short_name FROM universities
     WHERE tuition_fee_min IS NULL AND tuition_fee_max IS NULL
     ORDER BY name LIMIT 20`);
    const [{ count: majorTotal }] = await ds.query('SELECT COUNT(*)::text AS count FROM majors');
    const [{ count: uncategorizedMajors }] = await ds.query(`SELECT COUNT(*)::text AS count FROM majors
     WHERE field_group IS NULL OR TRIM(field_group) = '' OR field_group = 'Khác'`);
    console.log('=== Data quality report ===');
    console.log(`Universities: ${uniTotal} total, ${missingTuition} missing tuition`);
    if (missingTuitionList.length > 0) {
        console.log('Sample missing tuition (max 20):');
        for (const u of missingTuitionList) {
            console.log(`  - [${u.id}] ${u.short_name ?? u.name}`);
        }
    }
    console.log(`Majors: ${majorTotal} total, ${uncategorizedMajors} uncategorized (null/empty/Khác)`);
    console.log('Tip: npm run import:tuition (needs danh_sach_truong_thieu_hoc_phi_final_batch05.xlsx)');
    await ds.destroy();
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=report-data-gaps.js.map