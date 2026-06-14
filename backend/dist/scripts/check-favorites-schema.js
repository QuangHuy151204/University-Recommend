"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const pg_1 = require("pg");
async function main() {
    const c = new pg_1.Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 5432),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    await c.connect();
    const cols = await c.query(`SELECT column_name FROM information_schema.columns WHERE table_name='user_favorites' ORDER BY ordinal_position`);
    const migs = await c.query('SELECT name FROM migrations ORDER BY id DESC LIMIT 8');
    console.log('columns', cols.rows.map((r) => r.column_name));
    console.log('migrations', migs.rows.map((r) => r.name));
    await c.end();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=check-favorites-schema.js.map