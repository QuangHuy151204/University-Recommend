"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Usage: ts-node scripts/smoke-verify-user.ts <email>');
        process.exit(1);
    }
    const ds = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    await ds.initialize();
    const codeRows = await ds.query(`SELECT t.code FROM auth_tokens t
     JOIN users u ON u.id = t.user_id
     WHERE u.email = $1 AND t.type = 'email_verify'
     ORDER BY t.created_at DESC LIMIT 1`, [email.toLowerCase()]);
    console.log('CODE', codeRows[0]?.code ?? 'NONE');
    await ds.destroy();
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=smoke-verify-user.js.map