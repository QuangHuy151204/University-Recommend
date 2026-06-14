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
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
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
    const unis = await ds.query(`
    SELECT id, name, short_name, location
    FROM universities
    WHERE name ILIKE '%ngoại ng%'
       OR name ILIKE '%ngoai ng%'
       OR short_name ILIKE '%ULIS%'
       OR short_name ILIKE '%QHF%'
    ORDER BY name
  `);
    console.log('=== UNIVERSITIES ===');
    console.table(unis);
    for (const u of unis) {
        const [{ cnt }] = await ds.query(`SELECT COUNT(*)::int AS cnt
       FROM cutoff_scores cs
       JOIN university_majors um ON um.id = cs.university_major_id
       WHERE um.university_id = $1`, [u.id]);
        console.log(`\n${u.name} (${u.short_name}): ${cnt} cutoff rows`);
        const sample = await ds.query(`SELECT m.name AS major, cs.year, cs.subject_combination, cs.score, cs.admission_method
       FROM cutoff_scores cs
       JOIN university_majors um ON um.id = cs.university_major_id
       JOIN majors m ON m.id = um.major_id
       WHERE um.university_id = $1
       ORDER BY cs.year DESC, m.name
       LIMIT 10`, [u.id]);
        console.table(sample);
    }
    const testNames = [
        'Trường Đại học Ngoại ngữ',
        'Đại học Ngoại ngữ',
        'Ngoại ngữ',
        'VNU-ULIS',
    ];
    console.log('\n=== CHATBOT ILIKE SIMULATION ===');
    for (const term of testNames) {
        const found = await ds.query(`SELECT id, name, short_name FROM universities
       WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT 3`, [`%${term}%`]);
        console.log(`term="${term}" ->`, found.length ? found[0] : 'NOT FOUND');
    }
    const spTa = await ds.query(`
    SELECT m.name, COUNT(cs.id)::int AS cutoff_rows
    FROM majors m
    JOIN university_majors um ON um.major_id = m.id
    JOIN universities u ON u.id = um.university_id
    LEFT JOIN cutoff_scores cs ON cs.university_major_id = um.id
    WHERE u.short_name = 'VNU-ULIS'
      AND (m.name ILIKE '%sư phạm%' AND m.name ILIKE '%anh%')
    GROUP BY m.name
    ORDER BY m.name
  `);
    console.log('\n=== Sư phạm + Anh @ ULIS ===');
    console.table(spTa);
    const msg = 'điểm chuẩn của trường đại học ngoại ngữ';
    const [{ name: uniName }] = await ds.query(`SELECT name FROM universities WHERE short_name = 'VNU-ULIS'`);
    const nameLower = uniName.toLowerCase();
    console.log('\n=== Unicode match ===');
    console.log('msg includes nameLower:', msg.includes(nameLower));
    const filtered = await ds.query(`SELECT COUNT(*)::int AS cnt FROM cutoff_scores cs
     INNER JOIN university_majors um ON um.id = cs.university_major_id
     INNER JOIN majors m ON m.id = um.major_id
     WHERE um.university_id = 7
       AND (m.name ILIKE $1 OR m.field_group ILIKE $1)`, ['%Sư phạm Tiếng anh%']);
    console.log('cutoffs ULIS + major filter "Sư phạm Tiếng anh":', filtered[0].cnt);
    const allUnis = await ds.query(`SELECT id, name, short_name FROM universities ORDER BY id`);
    const msgLower = msg;
    const hits = allUnis.filter((u) => {
        const name = u.name?.toLowerCase();
        return name && name.length >= 8 && msgLower.includes(name);
    });
    console.log('\n=== Universities whose full name appears in msg (step 4 simulation) ===');
    console.table(hits);
    const anhMatch = await ds.query(`SELECT id, name, short_name FROM universities
     WHERE name ILIKE '%ANH%' OR short_name ILIKE '%ANH%' LIMIT 5`);
    console.log('\n=== ILIKE %ANH% (Ollama bad extract) ===');
    console.table(anhMatch);
    await ds.destroy();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=tmp-check-ulis.js.map