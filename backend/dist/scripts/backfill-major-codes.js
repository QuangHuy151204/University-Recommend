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
exports.extractCodeFromMajorName = extractCodeFromMajorName;
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function extractCodeFromMajorName(name) {
    const trimmed = name.trim();
    if (!trimmed)
        return null;
    const qhs = trimmed.match(/^QHS(\d+[A-Z]?)/i);
    if (qhs)
        return `QHS${qhs[1].toUpperCase()}`;
    const prefix = trimmed.match(/^([A-Z]{2,6})-/);
    if (prefix)
        return prefix[1].toUpperCase();
    const suffix = trimmed.match(/[–-]\s*([A-Z]{2,6})\s*$/);
    if (suffix)
        return suffix[1].toUpperCase();
    const paren = trimmed.match(/\(([A-Z]{2,6})\)\s*$/);
    if (paren)
        return paren[1].toUpperCase();
    return null;
}
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
    const rows = await ds.query('SELECT id, name, code FROM majors ORDER BY id');
    let updated = 0;
    let skipped = 0;
    for (const row of rows) {
        if (row.code?.trim()) {
            skipped++;
            continue;
        }
        const extracted = extractCodeFromMajorName(row.name);
        if (!extracted)
            continue;
        await ds.query('UPDATE majors SET code = $1, updated_at = NOW() WHERE id = $2', [
            extracted,
            row.id,
        ]);
        updated++;
    }
    const after = await ds.query(`SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE code IS NOT NULL AND TRIM(code) <> '')::int AS with_code
     FROM majors`);
    console.log('=== Backfill major codes from names ===');
    console.log(`Skipped (already had code): ${skipped}`);
    console.log(`Updated from name patterns: ${updated}`);
    console.log(`With code now: ${after[0].with_code}/${after[0].total}`);
    await ds.destroy();
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=backfill-major-codes.js.map