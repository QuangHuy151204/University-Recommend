"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OllamaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const scalar_1 = require("../common/scalar");
const DEFAULT_SYSTEM_PROMPT = `You are a university admission advisor for Vietnamese high school students.
Answer ONLY from the provided database context.
If the context lacks information, say so clearly in Vietnamese.
NEVER invent university names, cutoff scores, tuition fees, or admission methods.
Reply in Vietnamese, concise and friendly.`;
let OllamaService = OllamaService_1 = class OllamaService {
    config;
    logger = new common_1.Logger(OllamaService_1.name);
    constructor(config) {
        this.config = config;
    }
    isEnabled() {
        return this.config.get('OLLAMA_ENABLED', 'true') === 'true';
    }
    getBaseUrl() {
        return this.config
            .get('OLLAMA_BASE_URL', 'http://localhost:11434')
            .replace(/\/+$/, '');
    }
    getModel() {
        return this.config.get('OLLAMA_MODEL', 'llama3.1');
    }
    getTimeoutMs() {
        return Number(this.config.get('OLLAMA_TIMEOUT_MS', '20000'));
    }
    async classifyIntent(message, intents, opts) {
        if (!this.isEnabled())
            return null;
        if (!message?.trim())
            return null;
        const system = [
            'You are an intent classifier for a Vietnamese university admission chatbot (Hanoi universities only).',
            'You MUST reply with a single JSON object, no prose, no markdown, no code fence.',
            'Exact shape: {"intent":"<one_of_allowed_intents>","confidence":<float 0..1>}',
            'Pick the SINGLE best matching intent from the allowed list.',
            '',
            'DISAMBIGUATION (critical):',
            '- recommendation_by_score: user gives THEIR score (or follow-up after score context) and wants school/major advice — "tìm trường", "có đủ vào", "chọn trường nào", "có trường nào", "ưu tiên học phí thấp thì chọn trường nào". NOT ask_cutoff_score.',
            '- Multi-word majors must stay intact in entities.major (e.g. "sư phạm toán" → "Sư phạm Toán học", NOT "toán" or "kế toán").',
            '- ask_cutoff_score: asks official published cutoff ("điểm chuẩn", "điểm đầu vào", "lấy bao nhiêu điểm") — NOT "em được X điểm có đủ vào không".',
            '- search_university: info about ONE named school OR follow-up about "trường đó" (address, quận, programs) after discussing that school.',
            '- ask_location: list schools in Hanoi by area/type — e.g. "trường tư nào học phí thấp ở Hà Nội" (find schools, not one school\'s fee).',
            '- ask_tuition_fee: tuition of a SPECIFIC school/major ("học phí NEU", "học phí trường đó").',
            '- greeting: hello/chào opening — even if followed by "cần tư vấn tuyển sinh" or "giúp em với" (no specific data question yet).',
            '- help: asks what the BOT CAN DO or how to USE the app ("app này làm gì", "hỏi gì để tra điểm chuẩn").',
            '- unknown: out of scope — other cities, exam prep, or questions we cannot answer from DB (e.g. "học bổng toàn phần ở FPT").',
            '',
            'If unsure, pick "unknown" with low confidence.',
            opts?.context
                ? 'Use the previous conversation only to disambiguate follow-up questions (e.g. "còn ngành CNTT thì sao?", "trường đó ở quận nào?"). The intent must reflect the LATEST user message.'
                : '',
        ]
            .filter(Boolean)
            .join('\n');
        const descBlock = opts?.intentDescriptions
            ? Object.entries(opts.intentDescriptions)
                .filter(([k]) => intents.includes(k))
                .map(([k, d]) => `  - ${k}: ${d}`)
                .join('\n')
            : '';
        const exampleBlock = opts?.examples?.length
            ? opts.examples
                .map((ex) => [
                ex.is_follow_up && ex.context_note
                    ? `Previous conversation hint: ${ex.context_note}`
                    : '',
                `User: """${ex.q}"""`,
                `JSON: ${JSON.stringify({ intent: ex.intent, confidence: 0.95 })}`,
            ]
                .filter(Boolean)
                .join('\n'))
                .join('\n\n')
            : '';
        const prompt = [
            opts?.examples?.length ? `Examples:\n${exampleBlock}\n` : '',
            descBlock ? `Intent definitions:\n${descBlock}\n` : '',
            opts?.context ? `Previous conversation:\n${opts.context}\n` : '',
            `Allowed intents (pick exactly one): ${JSON.stringify(intents)}`,
            `Latest user message (Vietnamese): """${message}"""`,
            'Reply with the JSON object only.',
        ]
            .filter(Boolean)
            .join('\n');
        const raw = await this.generate({
            prompt,
            system,
            timeoutMs: opts?.timeoutMs ?? 8000,
            model: opts?.model,
            options: { temperature: 0 },
        });
        if (!raw)
            return null;
        const parsedRoot = this.parseJsonObject(raw);
        if (!parsedRoot) {
            this.logger.warn(`Ollama classify: no JSON in response: ${raw.slice(0, 120)}`);
            return null;
        }
        try {
            const parsed = parsedRoot;
            let intent = parsed.intent;
            if (intent && !intents.includes(intent) && opts?.intentAliases) {
                const aliased = opts.intentAliases[parsed.intent ?? ''];
                if (aliased && intents.includes(aliased)) {
                    this.logger.debug(`Ollama classify: aliased "${parsed.intent}" → "${aliased}"`);
                    intent = aliased;
                }
            }
            if (!intent || !intents.includes(intent)) {
                this.logger.warn(`Ollama classify: invalid intent "${parsed.intent}" (not in allowed list)`);
                return null;
            }
            const conf = typeof parsed.confidence === 'number' ? parsed.confidence : 0.5;
            return {
                intent,
                confidence: Math.max(0, Math.min(1, conf)),
            };
        }
        catch (err) {
            this.logger.warn(`Ollama classify: parse failed (${err.message})`);
            return null;
        }
    }
    async extractEntities(message, schema, examples = [], opts) {
        if (!this.isEnabled())
            return null;
        if (!message?.trim())
            return null;
        const keys = Object.keys(schema);
        const schemaLines = keys
            .map((k) => `  "${k}": ${schema[k].type} | null  // ${schema[k].description}`)
            .join('\n');
        const system = [
            'You are an entity extractor for a Vietnamese university admission chatbot.',
            'You MUST reply with a single JSON object — no prose, no markdown, no code fence.',
            'Use null when a field is not mentioned. Do NOT invent values.',
            opts?.context
                ? 'If the LATEST message references the previous conversation (e.g. "còn ngành đó thì sao?", "trường vừa nói"), INHERIT relevant entities (university_name, year, location, subject_group) from the previous turn.'
                : 'Do not infer from outside context.',
            'Numbers must be plain JSON numbers (not strings). Strings must use double quotes.',
            'Required JSON shape (keys must match exactly):',
            '{',
            schemaLines,
            '}',
        ]
            .filter(Boolean)
            .join('\n');
        const exampleBlock = examples
            .map((ex) => [
            ex.is_follow_up && ex.context_note
                ? `Previous conversation hint: ${ex.context_note}`
                : '',
            `User: """${ex.q}"""`,
            `JSON: ${JSON.stringify(ex.a)}`,
        ]
            .filter(Boolean)
            .join('\n'))
            .join('\n\n');
        const prompt = [
            examples.length ? `Examples:\n${exampleBlock}\n` : '',
            opts?.context ? `Previous conversation:\n${opts.context}\n` : '',
            `Latest user message: """${message}"""`,
            'JSON:',
        ]
            .filter(Boolean)
            .join('\n');
        const raw = await this.generate({
            prompt,
            system,
            timeoutMs: opts?.timeoutMs ?? 8000,
            model: opts?.model,
            options: { temperature: 0 },
        });
        if (!raw)
            return null;
        const parsed = this.parseJsonObject(raw);
        if (!parsed) {
            this.logger.warn(`Ollama extract: no JSON in response: ${raw.slice(0, 120)}`);
            return null;
        }
        const out = {};
        for (const k of keys) {
            const v = parsed[k];
            if (v === null || v === undefined) {
                out[k] = null;
                continue;
            }
            if (schema[k].type === 'number') {
                const n = (0, scalar_1.parseFloatFromUnknown)(v);
                out[k] = Number.isFinite(n) ? n : null;
            }
            else {
                const s = (0, scalar_1.scalarToString)(v);
                out[k] = s.length ? s : null;
            }
        }
        return out;
    }
    async classifyAndExtract(message, intents, schema, opts) {
        if (!this.isEnabled())
            return null;
        if (!message?.trim())
            return null;
        const keys = Object.keys(schema);
        const schemaLines = keys
            .map((k) => `    "${k}": ${schema[k].type} | null  // ${schema[k].description}`)
            .join('\n');
        const system = [
            'You are an intent classifier AND entity extractor for a Vietnamese university admission chatbot (Hanoi only).',
            'You MUST reply with a single JSON object — no prose, no markdown, no code fence.',
            'Exact shape:',
            '{',
            '  "intent": "<one_of_allowed_intents>",',
            '  "confidence": <float 0..1>,',
            '  "entities": {',
            schemaLines,
            '  }',
            '}',
            'Pick the SINGLE best intent for the LATEST user message.',
            'CRITICAL: User states THEIR exam score and asks which school/major → recommendation_by_score (NOT search_major).',
            'CRITICAL: "điểm chuẩn" / official cutoff lookup → ask_cutoff_score.',
            'CRITICAL: entities.major must preserve full major phrases ("sư phạm toán", "an toàn thông tin") — never shorten to a single ambiguous word.',
            'For greeting/help/unknown: set all entity fields to null.',
            'Use null when a field is not mentioned. Do NOT invent values.',
            opts?.context
                ? 'Use previous conversation to disambiguate follow-ups and inherit entities (university_name, year, subject_group) when the latest message is elliptical.'
                : '',
        ]
            .filter(Boolean)
            .join('\n');
        const descBlock = opts?.intentDescriptions
            ? Object.entries(opts.intentDescriptions)
                .filter(([k]) => intents.includes(k))
                .map(([k, d]) => `  - ${k}: ${d}`)
                .join('\n')
            : '';
        const combinedBlock = opts?.combinedExamples?.length
            ? opts.combinedExamples
                .map((ex) => [
                ex.is_follow_up && ex.context_note
                    ? `Previous conversation hint: ${ex.context_note}`
                    : '',
                `User: """${ex.q}"""`,
                `JSON: ${JSON.stringify({
                    intent: ex.intent,
                    confidence: ex.confidence,
                    entities: ex.entities,
                })}`,
            ]
                .filter(Boolean)
                .join('\n'))
                .join('\n\n')
            : '';
        const intentExampleBlock = opts?.intentExamples?.length
            ? opts.intentExamples
                .map((ex) => [
                ex.is_follow_up && ex.context_note
                    ? `Previous conversation hint: ${ex.context_note}`
                    : '',
                `User: """${ex.q}"""`,
                `JSON: ${JSON.stringify({
                    intent: ex.intent,
                    confidence: 0.95,
                    entities: Object.fromEntries(keys.map((k) => [k, null])),
                })}`,
            ]
                .filter(Boolean)
                .join('\n'))
                .join('\n\n')
            : '';
        const entityExampleBlock = opts?.entityExamples?.length
            ? opts.entityExamples
                .map((ex) => [
                ex.is_follow_up && ex.context_note
                    ? `Previous conversation hint: ${ex.context_note}`
                    : '',
                `User: """${ex.q}"""`,
                `JSON: ${JSON.stringify({
                    intent: 'unknown',
                    confidence: 0.5,
                    entities: ex.a,
                })}`,
            ]
                .filter(Boolean)
                .join('\n'))
                .join('\n\n')
            : '';
        const prompt = [
            combinedBlock ? `Combined examples:\n${combinedBlock}\n` : '',
            !combinedBlock && intentExampleBlock
                ? `Intent examples:\n${intentExampleBlock}\n`
                : '',
            !combinedBlock && entityExampleBlock
                ? `Entity examples:\n${entityExampleBlock}\n`
                : '',
            descBlock ? `Intent definitions:\n${descBlock}\n` : '',
            opts?.context ? `Previous conversation:\n${opts.context}\n` : '',
            `Allowed intents (pick exactly one): ${JSON.stringify(intents)}`,
            `Latest user message (Vietnamese): """${message}"""`,
            'Reply with the JSON object only.',
        ]
            .filter(Boolean)
            .join('\n');
        const raw = await this.generate({
            prompt,
            system,
            timeoutMs: opts?.timeoutMs ?? 12000,
            model: opts?.model,
            options: { temperature: 0 },
        });
        if (!raw)
            return null;
        const parsed = this.parseJsonObject(raw);
        if (!parsed) {
            this.logger.warn(`Ollama classify+extract: no JSON in response: ${raw.slice(0, 120)}`);
            return null;
        }
        const intentRaw = typeof parsed.intent === 'string' ? parsed.intent : '';
        let intent = intentRaw ? intentRaw : undefined;
        if (intent && !intents.includes(intent) && opts?.intentAliases) {
            const aliased = opts.intentAliases[intentRaw];
            if (aliased && intents.includes(aliased)) {
                this.logger.debug(`Ollama classify+extract: aliased "${intentRaw}" → "${aliased}"`);
                intent = aliased;
            }
        }
        if (!intent || !intents.includes(intent)) {
            this.logger.warn(`Ollama classify+extract: invalid intent "${String(parsed.intent)}"`);
            return null;
        }
        const conf = typeof parsed.confidence === 'number' ? parsed.confidence : 0.5;
        const entitiesRaw = parsed.entities && typeof parsed.entities === 'object'
            ? parsed.entities
            : {};
        const entities = {};
        for (const k of keys) {
            const v = entitiesRaw[k];
            if (v === null || v === undefined) {
                entities[k] = null;
                continue;
            }
            if (schema[k].type === 'number') {
                const n = (0, scalar_1.parseFloatFromUnknown)(v);
                entities[k] = Number.isFinite(n) ? n : null;
            }
            else {
                const s = (0, scalar_1.scalarToString)(v);
                entities[k] = s.length ? s : null;
            }
        }
        this.logger.debug('Ollama classify+extract: single call OK');
        return {
            intent,
            confidence: Math.max(0, Math.min(1, conf)),
            entities,
        };
    }
    parseJsonObject(raw) {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch)
            return null;
        try {
            return JSON.parse(jsonMatch[0]);
        }
        catch (err) {
            this.logger.warn(`Ollama JSON parse failed (${err.message})`);
            return null;
        }
    }
    async generate(opts) {
        if (!this.isEnabled())
            return null;
        const baseUrl = this.getBaseUrl();
        const model = opts.model ?? this.getModel();
        const timeoutMs = opts.timeoutMs ?? this.getTimeoutMs();
        const system = opts.system ?? DEFAULT_SYSTEM_PROMPT;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(`${baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    prompt: opts.prompt,
                    system,
                    stream: false,
                    options: opts.options,
                }),
                signal: controller.signal,
            });
            if (!res.ok) {
                this.logger.warn(`Ollama returned HTTP ${res.status}; falling back to rule-based.`);
                return null;
            }
            const data = (await res.json());
            if (data.error) {
                this.logger.warn(`Ollama error: ${data.error}`);
                return null;
            }
            const text = data.response?.trim();
            if (!text) {
                this.logger.warn('Ollama returned empty response.');
                return null;
            }
            return text;
        }
        catch (err) {
            const e = err;
            if (e.name === 'AbortError') {
                this.logger.warn(`Ollama call timed out after ${timeoutMs}ms; falling back.`);
            }
            else {
                this.logger.warn(`Ollama call failed (${e.message}); falling back to rule-based.`);
            }
            return null;
        }
        finally {
            clearTimeout(timer);
        }
    }
    async ping() {
        if (!this.isEnabled())
            return false;
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 3000);
            const res = await fetch(`${this.getBaseUrl()}/api/tags`, {
                signal: controller.signal,
            });
            clearTimeout(timer);
            return res.ok;
        }
        catch {
            return false;
        }
    }
};
exports.OllamaService = OllamaService;
exports.OllamaService = OllamaService = OllamaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OllamaService);
//# sourceMappingURL=ollama.service.js.map