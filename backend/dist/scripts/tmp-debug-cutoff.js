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
const chatbot_intent_rules_2 = require("../src/chatbot/chatbot-intent-rules");
const chat_session_context_1 = require("../src/chatbot/chat-session-context");
dotenv.config();
async function findUniversityByEntities(ds, entities, msg) {
    const univRepo = ds.getRepository(university_entity_1.University);
    const msgLower = msg.toLowerCase();
    const acronym = (0, chatbot_intent_rules_1.extractParentheticalAcronym)(msg);
    if (acronym) {
        const byAcronym = await univRepo.findOne({
            where: [{ short_name: (0, typeorm_1.ILike)(acronym) }, { name: (0, typeorm_1.ILike)(`%${acronym}%`) }],
        });
        if (byAcronym)
            return byAcronym;
    }
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
            console.log(`  token ILIKE "${name}" ->`, found?.name ?? 'null');
            if (found)
                return found;
        }
    }
    const all = await univRepo.find();
    const byShort = [...all]
        .filter((u) => u.short_name && msgLower.includes(u.short_name.toLowerCase()))
        .sort((a, b) => (b.short_name?.length ?? 0) - (a.short_name?.length ?? 0));
    if (byShort[0])
        return byShort[0];
    const hit = all.find((u) => {
        const name = u.name?.toLowerCase();
        return name && name.length >= 8 && msgLower.includes(name);
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
    const msg = 'điểm chuẩn của trường Đại học Ngoại ngữ';
    const intent = (0, chatbot_intent_rules_2.classifyIntentRuleOnly)(msg, (0, chat_session_context_1.parseSessionContext)(null));
    console.log('intent:', intent);
    const sessionAfterMajor = (0, chat_session_context_1.parseSessionContext)({
        last_intent: 'search_major',
        last_major: 'Sư phạm Tiếng anh',
    });
    const entities = (0, chat_session_context_1.mergeEntitiesWithSession)({
        score: null,
        subject_group: null,
        major: 'Sư phạm Tiếng anh',
        location: null,
        university_name: null,
        year: null,
        method_code: null,
    }, sessionAfterMajor);
    console.log('merged entities:', entities);
    console.log('\nfindUniversity (no session uni):');
    const u1 = await findUniversityByEntities(ds, {}, msg);
    console.log('result:', u1?.name ?? 'NULL');
    console.log('\nfindUniversity (with session major only):');
    const u2 = await findUniversityByEntities(ds, entities, msg);
    console.log('result:', u2?.name ?? 'NULL');
    if (u2) {
        const qb = await ds.query(`SELECT COUNT(*)::int cnt FROM cutoff_scores cs
       INNER JOIN university_majors um ON um.id = cs.university_major_id
       INNER JOIN majors m ON m.id = um.major_id
       WHERE um.university_id = $1 AND (m.name ILIKE $2 OR m.field_group ILIKE $2)`, [u2.id, '%Sư phạm Tiếng anh%']);
        console.log('cutoffs with major filter:', qb[0].cnt);
    }
    await ds.destroy();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=tmp-debug-cutoff.js.map