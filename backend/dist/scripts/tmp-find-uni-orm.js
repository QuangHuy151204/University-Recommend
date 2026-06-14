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
const university_entity_1 = require("../src/universities/university.entity");
const chatbot_intent_rules_1 = require("../src/chatbot/chatbot-intent-rules");
dotenv.config();
async function findUniversityByEntities(univRepo, entities, msg) {
    const msgLower = msg.toLowerCase();
    const acronym = (0, chatbot_intent_rules_1.extractParentheticalAcronym)(msg);
    console.log('acronym:', acronym);
    if (entities.university_name) {
        const tokens = entities.university_name
            .split(/[,;/]/)
            .map((t) => t.trim())
            .filter((t) => t.length >= 2);
        for (const name of tokens) {
            const found = await univRepo.findOne({
                where: [
                    { name: (0, typeorm_1.ILike)(`%${name}%`) },
                    { short_name: (0, typeorm_1.ILike)(`%${name}%`) },
                ],
            });
            console.log(`token ILIKE ${name}:`, found?.name);
            if (found)
                return found;
        }
    }
    const all = await univRepo.find();
    console.log('total unis:', all.length);
    const byShort = [...all]
        .filter((u) => u.short_name && msgLower.includes(u.short_name.toLowerCase()))
        .sort((a, b) => (b.short_name?.length ?? 0) - (a.short_name?.length ?? 0));
    if (byShort[0])
        return byShort[0];
    const hit = all.find((u) => {
        const name = u.name?.toLowerCase();
        const ok = !!(name && name.length >= 8 && msgLower.includes(name));
        if (ok)
            console.log('step4 hit:', u.id, u.name);
        return ok;
    });
    return hit ?? null;
}
async function main() {
    const ds = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'university_recommend',
        entities: [university_entity_1.University],
    });
    await ds.initialize();
    const repo = ds.getRepository(university_entity_1.University);
    const msg = 'điểm chuẩn của trường đại học ngoại ngữ';
    const result = await findUniversityByEntities(repo, {}, msg);
    console.log('RESULT:', result?.name ?? 'NULL');
    await ds.destroy();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=tmp-find-uni-orm.js.map