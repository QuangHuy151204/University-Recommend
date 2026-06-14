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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatbotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_session_entity_1 = require("./chat-session.entity");
const chat_message_entity_1 = require("./chat-message.entity");
const university_entity_1 = require("../universities/university.entity");
const major_entity_1 = require("../majors/major.entity");
const major_interest_match_1 = require("../majors/major-interest-match");
const university_major_entity_1 = require("../majors/university-major.entity");
const cutoff_score_entity_1 = require("../cutoff-scores/cutoff-score.entity");
const ollama_service_1 = require("../ollama/ollama.service");
const recommendations_service_1 = require("../recommendations/recommendations.service");
const admission_methods_service_1 = require("../admission-methods/admission-methods.service");
const chatbot_types_1 = require("./chatbot.types");
const chatbot_copy_1 = require("./chatbot-copy");
const intent_corpus_1 = require("./intent-corpus");
const chatbot_intent_rules_1 = require("./chatbot-intent-rules");
const chatbot_guardrails_1 = require("./chatbot-guardrails");
const major_search_1 = require("./major-search");
const university_extract_1 = require("./university-extract");
const chat_session_context_1 = require("./chat-session-context");
const typeorm_relations_1 = require("../common/typeorm-relations");
const scalar_1 = require("../common/scalar");
const chat_session_policy_1 = require("./chat-session-policy");
const INTENT_CONFIDENCE_THRESHOLD = 0.5;
const PROMPT_EXAMPLES = (0, intent_corpus_1.selectPromptExamples)();
const INTENT_ALIASES = {
    ask_major: 'search_major',
    find_major: 'search_major',
    major_search: 'search_major',
    search_majors: 'search_major',
    recommendation: 'recommendation_by_score',
    recommend: 'recommendation_by_score',
    recommend_university: 'recommendation_by_score',
    score_recommendation: 'recommendation_by_score',
    university_recommendation: 'recommendation_by_score',
    ask_university: 'search_university',
    university_search: 'search_university',
    search_school: 'search_university',
    cutoff: 'ask_cutoff_score',
    ask_cutoff: 'ask_cutoff_score',
    cutoff_score: 'ask_cutoff_score',
    tuition: 'ask_tuition_fee',
    ask_tuition: 'ask_tuition_fee',
    compare: 'compare_universities',
    compare_university: 'compare_universities',
    university_compare: 'compare_universities',
    tuition_comparison: 'compare_universities',
    career: 'ask_career',
    ask_career_path: 'ask_career',
    general_advice: 'help',
    location: 'ask_location',
    search_location: 'ask_location',
    ask_location: 'ask_location',
    admission_method: 'ask_admission_method',
    ask_admission: 'ask_admission_method',
    scholarship: 'ask_scholarship',
    ask_scholarship: 'ask_scholarship',
    facilities: 'ask_facilities',
    ask_facilities: 'ask_facilities',
    dormitory: 'ask_facilities',
    find_location: 'ask_location',
    location_search: 'ask_location',
};
const INTENT_DESCRIPTIONS = intent_corpus_1.INTENT_CLASSIFY_DESCRIPTIONS;
const ENTITY_SCHEMA = {
    score: {
        description: 'Vietnamese THPT exam score, 0-30 scale. Convert Vietnamese number words ("hai mươi tư" = 24).',
        type: 'number',
    },
    subject_group: {
        description: 'Subject combination code: A00, A01, B00, C00, C01, D01, D07. Map "khối tự nhiên" = "A00", "khối xã hội" = "C00".',
        type: 'string',
    },
    major: {
        description: 'Major / field of study in Vietnamese, e.g. "Công nghệ thông tin", "Y khoa", "Kinh tế". Expand common abbreviations: CNTT, IT, AI.',
        type: 'string',
    },
    location: {
        description: 'Region. Dataset only covers Hanoi universities. Return "Hà Nội" when user mentions Hà Nội / Hanoi / "thủ đô" / "miền bắc". Return null for ANY other city (TP.HCM, Sài Gòn, Đà Nẵng, etc.) or when not mentioned.',
        type: 'string',
    },
    university_name: {
        description: 'University name or short name as the user wrote it, e.g. "Bách Khoa Hà Nội", "HUST", "FPT".',
        type: 'string',
    },
    year: {
        description: 'Admission year, must be between 2020 and 2030.',
        type: 'number',
    },
    method_code: {
        description: 'Admission method code when user mentions PT: THPT, HOC_BA, DGNL, DGTD, XTTHANG, HSNL, PV, CCQT, DUHOC, KHAC. Map "học bạ"→HOC_BA, "thi THPT"/"điểm thi tốt nghiệp"→THPT, "đánh giá năng lực"/"DGNL"→DGNL, "tuyển thẳng"→XTTHANG, "hồ sơ năng lực"→HSNL. null if not mentioned.',
        type: 'string',
    },
};
const EMPTY_ENTITIES = {
    score: null,
    subject_group: null,
    major: null,
    location: null,
    university_name: null,
    year: null,
    method_code: null,
};
let ChatbotService = ChatbotService_1 = class ChatbotService {
    sessionRepo;
    messageRepo;
    univRepo;
    majorRepo;
    uniMajorRepo;
    cutoffRepo;
    ollama;
    recommendations;
    admissionMethods;
    logger = new common_1.Logger(ChatbotService_1.name);
    allowedMethodCodes = null;
    constructor(sessionRepo, messageRepo, univRepo, majorRepo, uniMajorRepo, cutoffRepo, ollama, recommendations, admissionMethods) {
        this.sessionRepo = sessionRepo;
        this.messageRepo = messageRepo;
        this.univRepo = univRepo;
        this.majorRepo = majorRepo;
        this.uniMajorRepo = uniMajorRepo;
        this.cutoffRepo = cutoffRepo;
        this.ollama = ollama;
        this.recommendations = recommendations;
        this.admissionMethods = admissionMethods;
    }
    async chat(message, userId, sessionId) {
        const session = await this.resolveChatSession(userId, sessionId);
        const sessionContext = (0, chat_session_context_1.parseSessionContext)(session.session_context);
        const conversationContext = await this.loadConversationContext(userId, sessionId, 5);
        const sessionHint = (0, chat_session_context_1.buildSessionContextHint)(sessionContext);
        const context = [sessionHint, conversationContext]
            .filter(Boolean)
            .join('\n\n');
        if (context) {
            this.logger.debug(`context loaded (${context.split('\n').length} lines)`);
        }
        const normalizedMsg = message.toLowerCase().trim();
        const { answer: ruleAnswer, intent, entities, comparedUniversities, compareUniversityIds, } = await this.processMessage(normalizedMsg, context, sessionContext);
        let finalAnswer = ruleAnswer;
        let engine = 'rule';
        const skipRewrite = (0, intent_corpus_1.shouldSkipOllamaRewrite)(ruleAnswer, intent);
        if (skipRewrite) {
            this.logger.debug(`Skip Ollama rewrite — intent=${intent} (${intent_corpus_1.INTENT_HANDLER_MATRIX[intent].handler}), structured DB answer.`);
        }
        if (this.ollama.isEnabled() && !skipRewrite) {
            const llm = await this.ollama.generate({
                prompt: this.buildOllamaPrompt(message, ruleAnswer, context),
                options: { temperature: 0, num_predict: 1024 },
            });
            if (llm) {
                finalAnswer = llm;
                engine = 'ollama';
            }
            else {
                this.logger.debug('Ollama unavailable → trả về phản hồi rule-based.');
            }
        }
        finalAnswer = this.humanizeAnswer(finalAnswer);
        const resolvedUni = await this.findUniversityByEntities(entities, message);
        const contextEntities = resolvedUni
            ? {
                ...entities,
                university_name: resolvedUni.short_name || resolvedUni.name,
            }
            : entities;
        session.session_context = (0, chat_session_context_1.sessionContextToRecord)((0, chat_session_context_1.updateSessionContext)(sessionContext, intent, contextEntities, comparedUniversities));
        await this.sessionRepo.save(session);
        await this.appendChatTurn(session, message, finalAnswer, engine, intent, entities, compareUniversityIds);
        return {
            answer: finalAnswer,
            engine,
            compare_university_ids: compareUniversityIds,
        };
    }
    async resolveChatSession(userId, clientSessionId) {
        let created = false;
        if (clientSessionId?.trim()) {
            const key = clientSessionId.trim();
            let session = await this.sessionRepo.findOne({
                where: { session_key: key },
                relations: ['user'],
            });
            if (!session) {
                session = this.sessionRepo.create({
                    session_key: key,
                    user: userId ? (0, typeorm_relations_1.relationStub)(userId) : null,
                });
                await this.sessionRepo.save(session);
                created = true;
            }
            else {
                (0, chat_session_policy_1.assertSessionAccess)(session, userId);
                if (userId && (0, chat_session_policy_1.sessionUserId)(session) == null) {
                    session.user = (0, typeorm_relations_1.relationStub)(userId);
                    await this.sessionRepo.save(session);
                }
            }
            if (userId && created) {
                await this.pruneOldSessionsForUser(userId);
            }
            return session;
        }
        const session = this.sessionRepo.create({
            user: userId ? (0, typeorm_relations_1.relationStub)(userId) : null,
        });
        const saved = await this.sessionRepo.save(session);
        if (userId) {
            await this.pruneOldSessionsForUser(userId);
        }
        return saved;
    }
    async pruneOldSessionsForUser(userId) {
        const sessions = await this.sessionRepo.find({
            where: { user: { id: userId } },
            order: { updated_at: 'DESC', id: 'DESC' },
            select: ['id'],
        });
        if (sessions.length <= chat_session_policy_1.MAX_CHAT_SESSIONS_PER_USER)
            return;
        const excess = sessions.slice(chat_session_policy_1.MAX_CHAT_SESSIONS_PER_USER).map((s) => s.id);
        if (excess.length > 0) {
            await this.sessionRepo.delete(excess);
        }
    }
    async appendChatTurn(session, question, answer, engine, intent, entities, compareUniversityIds) {
        const compareIds = compareUniversityIds?.filter((id) => id > 0).slice(0, 2) ?? [];
        const assistantMetadata = {
            engine,
            intent,
            entities,
        };
        if (compareIds.length >= 2) {
            assistantMetadata.compare_university_ids = compareIds;
        }
        await this.messageRepo.save([
            this.messageRepo.create({
                chatSession: session,
                sender: 'user',
                message: question,
            }),
            this.messageRepo.create({
                chatSession: session,
                sender: 'assistant',
                message: answer,
                metadata: assistantMetadata,
            }),
        ]);
        if (!session.title?.trim()) {
            session.title = question.trim().slice(0, 80) || 'Cuộc trò chuyện';
        }
        session.updated_at = new Date();
        await this.sessionRepo.save(session);
    }
    async loadConversationContext(userId, sessionId, limit = 5) {
        if (!userId && !sessionId)
            return '';
        const qb = this.messageRepo
            .createQueryBuilder('m')
            .innerJoin('m.chatSession', 's')
            .orderBy('m.created_at', 'DESC')
            .addOrderBy('m.id', 'DESC')
            .take(limit * 2);
        if (sessionId?.trim()) {
            qb.andWhere('s.session_key = :sk', { sk: sessionId.trim() });
            if (userId) {
                qb.andWhere('s.user_id = :uid', { uid: userId });
            }
        }
        else if (userId) {
            qb.andWhere('s.user_id = :uid', { uid: userId });
        }
        const rows = await qb.getMany();
        if (rows.length === 0)
            return '';
        return rows
            .reverse()
            .map((m) => {
            const label = m.sender === 'user' ? 'User' : 'Bot';
            return `${label}: ${m.message.trim().slice(0, 300)}`;
        })
            .join('\n');
    }
    buildOllamaPrompt(userMessage, dbAnswer, context = '') {
        return [
            context
                ? `Lịch sử hội thoại (chỉ tham khảo tone, KHÔNG được lấy số liệu từ đây):\n"""\n${context}\n"""\n`
                : '',
            `Câu hỏi mới của học sinh: """${userMessage}"""`,
            '',
            'Thông tin tham chiếu để trả lời:',
            '"""',
            dbAnswer,
            '"""',
            '',
            'Yêu cầu:',
            '- Viết lại như cố vấn tuyển sinh đang chat với học sinh THPT: thân thiện, rõ ràng, không máy móc.',
            '- Xưng "mình", gọi "bạn"; câu ngắn; tránh lặp cùng một mẫu câu ở mọi lượt.',
            '- TUYỆT ĐỐI không thêm tên trường, điểm chuẩn, học phí, ngành hay phương thức xét tuyển ngoài dữ liệu tham chiếu.',
            '- Nếu thiếu dữ liệu hoặc không có danh sách ngành, nói thẳng là chưa có — không tự bịa danh sách.',
            '- Giữ nguyên mọi con số và từng tên ngành/chương trình đúng như trong dữ liệu.',
            '- Không rút gọn danh sách có sẵn; không dùng markdown (** hoặc `).',
            '- Không nhắc backend, database, PostgreSQL, API hay "dữ liệu hệ thống".',
            '- Tối đa 1–2 emoji nhẹ (tùy chọn); không disclaimer dài trừ khi đã có trong dữ liệu.',
        ]
            .filter(Boolean)
            .join('\n');
    }
    async processMessage(msg, context = '', sessionContext = (0, chat_session_context_1.parseSessionContext)(null)) {
        const { intent, entities: rawEntities, intentSource, entitySource, confidence, } = await this.resolveIntentAndEntities(msg, context, sessionContext);
        const merged = (0, chat_session_context_1.mergeEntitiesWithSession)(rawEntities, sessionContext, msg);
        const entities = await this.validateAndSanitizeEntities(merged, msg);
        this.logger.debug(`intent=${intent} handler=${intent_corpus_1.INTENT_HANDLER_MATRIX[intent].handler}` +
            ` intentSource=${intentSource}` +
            (confidence != null ? ` confidence=${confidence.toFixed(2)}` : '') +
            ` entitySource=${entitySource} ${JSON.stringify(entities)}`);
        let answer;
        switch (intent) {
            case 'ask_cutoff_score':
                answer = await this.handleCutoffQuery(entities, msg);
                break;
            case 'search_university':
                answer = await this.handleUniversityQuery(entities, msg);
                break;
            case 'search_major':
                answer = await this.handleMajorQuery(entities, msg);
                break;
            case 'ask_tuition_fee':
                answer = await this.handleTuitionQuery(entities, msg, sessionContext);
                break;
            case 'ask_location':
                answer = await this.handleLocationQuery(entities);
                break;
            case 'recommendation_by_score':
                answer = await this.handleScoreQuery(entities, msg);
                break;
            case 'compare_universities':
                answer = await this.handleCompareQuery(entities, msg, sessionContext);
                break;
            case 'ask_career':
                answer = await this.handleCareerQuery(entities, msg);
                break;
            case 'ask_admission_method':
                answer = await this.handleAdmissionMethodQuery(entities, msg);
                break;
            case 'ask_scholarship':
                answer = this.handleScholarshipQuery(entities);
                break;
            case 'ask_facilities':
                answer = await this.handleFacilitiesQuery(entities, msg);
                break;
            case 'greeting':
                answer = this.getGreeting();
                break;
            case 'help':
                answer = this.getHelp();
                break;
            case 'unknown':
            default:
                if ((0, chatbot_intent_rules_1.looksLikeScoreRecommendation)(msg)) {
                    answer = await this.handleScoreQuery(entities, msg);
                }
                else {
                    answer = this.getDefaultAnswer();
                }
        }
        let comparedUniversities = null;
        let compareUniversityIds = null;
        if (intent === 'compare_universities') {
            const resolved = await this.resolveCompareUniversities(entities, msg, sessionContext);
            comparedUniversities = resolved
                .map((u) => u.short_name || u.name)
                .slice(0, 4);
            if (resolved.length >= 2) {
                compareUniversityIds = resolved.slice(0, 2).map((u) => u.id);
            }
        }
        return {
            answer,
            intent,
            entities,
            comparedUniversities,
            compareUniversityIds,
        };
    }
    intentNeedsEntities(intent) {
        return intent_corpus_1.INTENT_HANDLER_MATRIX[intent].needsEntities;
    }
    async validateAndSanitizeEntities(entities, msg) {
        return (0, chatbot_guardrails_1.validateEntitiesAgainstDb)(entities, msg, {
            universityExists: async (name) => {
                const found = await this.univRepo.findOne({
                    where: [
                        { name: (0, typeorm_2.ILike)(`%${name}%`) },
                        { short_name: (0, typeorm_2.ILike)(`%${name}%`) },
                    ],
                });
                return !!found;
            },
            majorExists: async (term) => {
                const found = await this.majorRepo
                    .createQueryBuilder('m')
                    .where((0, major_interest_match_1.majorTagSearchWhere)('m'), { mq: `%${term}%` })
                    .getOne();
                return !!found;
            },
        });
    }
    async resolveIntentAndEntities(msg, context = '', sessionContext = (0, chat_session_context_1.parseSessionContext)(null)) {
        const sessionHint = (0, chat_session_context_1.buildSessionContextHint)(sessionContext);
        const enrichedContext = [sessionHint, context].filter(Boolean).join('\n\n');
        if (this.ollama.isEnabled()) {
            const merged = await this.ollama.classifyAndExtract(msg, chatbot_types_1.CHAT_INTENTS, ENTITY_SCHEMA, {
                context: enrichedContext,
                intentExamples: PROMPT_EXAMPLES.intentExamples,
                entityExamples: PROMPT_EXAMPLES.entityExamples,
                combinedExamples: PROMPT_EXAMPLES.combinedExamples,
                intentAliases: INTENT_ALIASES,
                intentDescriptions: INTENT_DESCRIPTIONS,
            });
            if (merged &&
                merged.confidence >= INTENT_CONFIDENCE_THRESHOLD &&
                merged.intent !== 'unknown') {
                let intent = (0, chatbot_intent_rules_1.resolveFollowUpIntent)((0, chatbot_intent_rules_1.correctRuleIntent)(merged.intent, msg), msg, sessionContext);
                const ruleIntent = (0, chatbot_intent_rules_1.classifyIntentRuleOnly)(msg, sessionContext);
                let intentSource = 'ollama';
                if ((0, chatbot_guardrails_1.shouldPreferRuleOverOllamaIntent)(ruleIntent, intent, msg)) {
                    intent = (0, chatbot_intent_rules_1.resolveFollowUpIntent)((0, chatbot_intent_rules_1.correctRuleIntent)(ruleIntent, msg), msg, sessionContext);
                    intentSource = 'rule';
                    this.logger.debug(`Rule wins on Ollama conflict: ollama=${merged.intent} rule=${ruleIntent} → ${intent}`);
                }
                else if (intent !== merged.intent) {
                    this.logger.debug(`intent corrected ${merged.intent} → ${intent} (score-recommendation heuristic)`);
                }
                if (!this.intentNeedsEntities(intent)) {
                    return {
                        intent,
                        entities: EMPTY_ENTITIES,
                        intentSource,
                        entitySource: 'merged',
                        confidence: merged.confidence,
                    };
                }
                const extracted = await this.extractEntities(msg, enrichedContext, merged.entities);
                return {
                    intent,
                    entities: extracted.entities,
                    intentSource,
                    entitySource: 'merged',
                    confidence: merged.confidence,
                };
            }
            if (merged) {
                this.logger.debug(`classify+extract rejected (intent=${merged.intent}, confidence=${merged.confidence}) → fallback`);
            }
        }
        const ruleIntent = (0, chatbot_intent_rules_1.resolveFollowUpIntent)((0, chatbot_intent_rules_1.correctRuleIntent)((0, chatbot_intent_rules_1.classifyIntentRuleOnly)(msg, sessionContext), msg), msg, sessionContext);
        let entities = EMPTY_ENTITIES;
        let entitySource = 'rule';
        if (this.intentNeedsEntities(ruleIntent)) {
            const extracted = await this.extractEntities(msg, enrichedContext);
            entities = extracted.entities;
            entitySource = extracted.source;
        }
        return {
            intent: ruleIntent,
            entities,
            intentSource: 'rule',
            entitySource,
        };
    }
    async classifyIntent(msg, context = '', sessionContext = (0, chat_session_context_1.parseSessionContext)(null)) {
        if (this.ollama.isEnabled()) {
            const result = await this.ollama.classifyIntent(msg, chatbot_types_1.CHAT_INTENTS, {
                context,
                examples: PROMPT_EXAMPLES.intentExamples,
                intentAliases: INTENT_ALIASES,
                intentDescriptions: INTENT_DESCRIPTIONS,
            });
            if (result &&
                result.confidence >= INTENT_CONFIDENCE_THRESHOLD &&
                result.intent !== 'unknown') {
                let intent = (0, chatbot_intent_rules_1.correctRuleIntent)(result.intent, msg);
                intent = (0, chatbot_intent_rules_1.resolveFollowUpIntent)(intent, msg, sessionContext);
                const ruleIntent = (0, chatbot_intent_rules_1.classifyIntentRuleOnly)(msg, sessionContext);
                if ((0, chatbot_guardrails_1.shouldPreferRuleOverOllamaIntent)(ruleIntent, intent, msg)) {
                    intent = (0, chatbot_intent_rules_1.resolveFollowUpIntent)((0, chatbot_intent_rules_1.correctRuleIntent)(ruleIntent, msg), msg, sessionContext);
                    this.logger.debug(`Rule wins on classify conflict: ollama=${result.intent} rule=${ruleIntent} → ${intent}`);
                    return {
                        intent,
                        source: 'rule',
                        confidence: result.confidence,
                    };
                }
                if (intent !== result.intent) {
                    this.logger.debug(`intent corrected ${result.intent} → ${intent} (rule heuristics / follow-up)`);
                }
                return {
                    intent,
                    source: 'ollama',
                    confidence: result.confidence,
                };
            }
            if (result) {
                this.logger.debug(`Ollama intent "${result.intent}" rejected (confidence=${result.confidence}) → rule fallback`);
            }
        }
        const intent = (0, chatbot_intent_rules_1.classifyIntentRuleOnly)(msg, sessionContext);
        return { intent, source: 'rule' };
    }
    async findUniversityByEntities(entities, msg) {
        const msgLower = msg.toLowerCase();
        const acronym = (0, chatbot_intent_rules_1.extractParentheticalAcronym)(msg);
        if (acronym) {
            const byAcronym = await this.univRepo.findOne({
                where: [
                    { short_name: (0, typeorm_2.ILike)(acronym) },
                    { name: (0, typeorm_2.ILike)(`%${acronym}%`) },
                ],
            });
            if (byAcronym)
                return byAcronym;
        }
        const all = await this.univRepo.find();
        const byShortInMsg = [...all]
            .filter((u) => u.short_name && msgLower.includes(u.short_name.toLowerCase()))
            .sort((a, b) => (b.short_name?.length ?? 0) - (a.short_name?.length ?? 0));
        if (byShortInMsg[0])
            return byShortInMsg[0];
        const explicit = (0, chatbot_intent_rules_1.extractExplicitUniversityFromMessage)(msg);
        if (explicit) {
            const byExplicit = await this.univRepo.findOne({
                where: [
                    { short_name: (0, typeorm_2.ILike)(explicit) },
                    { name: (0, typeorm_2.ILike)(`%${explicit}%`) },
                ],
            });
            if (byExplicit)
                return byExplicit;
        }
        if (entities.university_name) {
            const tokens = entities.university_name
                .split(/[,;/]/)
                .map((t) => t.trim())
                .filter((t) => t.length >= 2);
            for (const name of tokens) {
                const found = await this.univRepo.findOne({
                    where: [
                        { name: (0, typeorm_2.ILike)(`%${name}%`) },
                        { short_name: (0, typeorm_2.ILike)(`%${name}%`) },
                    ],
                });
                if (found)
                    return found;
            }
        }
        return (all.find((u) => {
            const name = u.name?.toLowerCase();
            return name && name.length >= 8 && msgLower.includes(name);
        }) ?? null);
    }
    formatMajorClassification(major) {
        const assignments = major.groupAssignments ?? [];
        const groupNames = assignments
            .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
            .map((a) => a.group?.group_name)
            .filter((name) => Boolean(name));
        const groups = groupNames.length > 0
            ? [...new Set(groupNames)]
            : [major.field_group || 'Khác'];
        const tagPreview = (major.tags || []).slice(0, 5);
        const lines = [`• Nhóm ngành: ${groups.join(', ')}`];
        if (tagPreview.length > 0) {
            lines.push(`• Tags: ${tagPreview.join(', ')}`);
        }
        return lines.join('\n');
    }
    async findMajorByEntities(entities, msg) {
        const msgLower = msg.toLowerCase();
        const withGroups = await this.majorRepo.find({
            relations: ['groupAssignments', 'groupAssignments.group'],
        });
        for (const m of withGroups) {
            const tagHit = (m.tags || []).find((t) => msgLower.includes(t.toLowerCase()));
            if (tagHit)
                return m;
        }
        const searchTerms = [entities.major, (0, major_search_1.resolveMajorSearchTerm)(msg)].filter((t) => !!t?.trim());
        for (const term of searchTerms) {
            const found = await this.majorRepo
                .createQueryBuilder('m')
                .leftJoinAndSelect('m.groupAssignments', 'ga')
                .leftJoinAndSelect('ga.group', 'g')
                .where((0, major_interest_match_1.majorTagSearchWhere)('m'), { mq: `%${term}%` })
                .getOne();
            if (found)
                return found;
        }
        const byNameInMsg = [...withGroups]
            .filter((m) => {
            const name = m.name?.toLowerCase();
            return name && name.length >= 6 && msgLower.includes(name);
        })
            .sort((a, b) => (b.name?.length ?? 0) - (a.name?.length ?? 0));
        if (byNameInMsg[0])
            return byNameInMsg[0];
        return (withGroups.find((m) => msg.includes(m.name.toLowerCase()) ||
            (m.code && msg.includes(m.code.toLowerCase()))) ?? null);
    }
    async handleCutoffQuery(entities, msg) {
        const mentioned = await this.findUniversityByEntities(entities, msg);
        if (!mentioned) {
            return `Để tra điểm chuẩn, bạn thử hỏi cụ thể, ví dụ:\n• "Điểm chuẩn Bách Khoa Hà Nội năm 2024"\n• "Điểm chuẩn ngành CNTT trường FPT"\n\nHoặc vào trang chi tiết trường để lọc theo năm, ngành và phương thức xét tuyển.`;
        }
        const qb = this.cutoffRepo
            .createQueryBuilder('cs')
            .innerJoin('cs.universityMajor', 'um')
            .innerJoin('um.university', 'u')
            .innerJoin('um.major', 'm')
            .where('u.id = :id', { id: mentioned.id });
        if (entities.year) {
            qb.andWhere('cs.year = :year', { year: entities.year });
        }
        const majorFilter = (0, major_search_1.resolveMajorSearchTerm)(msg) ??
            (0, major_search_1.extractMajorFragment)(msg) ??
            entities.major;
        if (majorFilter) {
            qb.andWhere((0, major_interest_match_1.majorTagSearchWhere)('m'), {
                mq: `%${majorFilter}%`,
            });
        }
        if (entities.method_code) {
            const methodLabel = await this.admissionMethods.resolveLabel(entities.method_code);
            if (methodLabel) {
                qb.andWhere('cs.admission_method ILIKE :methodLabel', {
                    methodLabel: `%${methodLabel}%`,
                });
            }
        }
        const cutoffs = await qb.orderBy('cs.year', 'DESC').take(8).getMany();
        if (cutoffs.length === 0) {
            const methodLabel = entities.method_code
                ? await this.admissionMethods.resolveLabel(entities.method_code)
                : null;
            const filter = [
                entities.year ? `năm ${entities.year}` : null,
                entities.major ? `ngành ${entities.major}` : null,
                methodLabel ? `PT ${methodLabel}` : null,
            ]
                .filter(Boolean)
                .join(', ');
            return `Mình chưa có điểm chuẩn cho ${mentioned.name}${filter ? ` (${filter})` : ''} trong dữ liệu hiện tại. Bạn nên xem thêm trên website trường: ${mentioned.website || 'chưa có link'}.`;
        }
        const lines = cutoffs
            .map((c) => `• Năm ${c.year} — tổ hợp ${c.subject_combination || 'chưa rõ'}: ${c.score} điểm (${c.admission_method || 'THPT Quốc gia'})`)
            .join('\n');
        const methodLabel = entities.method_code
            ? await this.admissionMethods.resolveLabel(entities.method_code)
            : null;
        return `Điểm chuẩn ${mentioned.name}${entities.year ? ` năm ${entities.year}` : ' các năm gần đây'}${majorFilter ? ` — ngành ${majorFilter}` : ''}${methodLabel ? ` (${methodLabel})` : ''}:\n${lines}\n\n${chatbot_copy_1.CHAT_DISCLAIMER_CUTOFF}`;
    }
    async formatUniversityMajorsList(uni) {
        const links = await this.uniMajorRepo
            .createQueryBuilder('um')
            .innerJoinAndSelect('um.major', 'm')
            .where('um.university_id = :uid', { uid: uni.id })
            .orderBy('m.name', 'ASC')
            .addOrderBy('um.id', 'ASC')
            .getMany();
        if (links.length === 0)
            return null;
        const byNormalizedKey = new Map();
        for (const um of links) {
            const name = um.major?.name?.trim();
            if (!name)
                continue;
            const program = um.training_program?.trim();
            const label = program && program !== name && !name.includes(program)
                ? `${name} (${program})`
                : name;
            const key = label.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
            if (!byNormalizedKey.has(key))
                byNormalizedKey.set(key, label);
        }
        const sorted = [...byNormalizedKey.values()].sort((a, b) => a.localeCompare(b, 'vi'));
        const lines = sorted.map((label, i) => `${i + 1}. ${label}`).join('\n');
        return (`${chatbot_copy_1.DB_MAJOR_LIST_PREFIX} ${uni.name} (${uni.short_name}) — ${sorted.length} chương trình trong dữ liệu:\n\n` +
            `${lines}\n\n` +
            `Bạn có thể xem điểm chuẩn từng ngành ở trang chi tiết trường, hoặc hỏi: "Điểm chuẩn ${uni.short_name} ngành … năm 2024".`);
    }
    async handleUniversityQuery(entities, msg) {
        const mentioned = await this.findUniversityByEntities(entities, msg);
        const wantsPrograms = (0, chatbot_intent_rules_1.asksUniversityOrPrograms)(msg);
        if (wantsPrograms) {
            if (!mentioned) {
                return ('Để liệt kê ngành/chương trình, bạn cho mình biết tên hoặc mã trường ' +
                    '(ví dụ USTH, HUST, NEU), hoặc hỏi tiếp sau khi đã nói rõ trường ở câu trước.');
            }
            const list = await this.formatUniversityMajorsList(mentioned);
            if (list)
                return list;
            return (`Mình chưa có danh sách ngành/chương trình cho ${mentioned.name} (${mentioned.short_name}).\n\n` +
                `Bạn thử lại sau hoặc xem trang chi tiết trường khi dữ liệu được cập nhật.`);
        }
        if (mentioned) {
            const budgetText = mentioned.tuition_fee_min && mentioned.tuition_fee_max
                ? `${(mentioned.tuition_fee_min / 1_000_000).toFixed(0)}-${(mentioned.tuition_fee_max / 1_000_000).toFixed(0)} triệu/năm`
                : 'Chưa cập nhật';
            return `${mentioned.name} (${mentioned.short_name})\n• Địa điểm: ${mentioned.location}\n• Loại hình: ${this.translateType(mentioned.type)}\n• Học phí tham khảo: ${budgetText}\n• Website: ${mentioned.website || 'chưa có'}\n\n${mentioned.description || 'Mô tả chi tiết đang được cập nhật.'}\n\nBạn có thể mở trang chi tiết trường để xem đủ ngành đào tạo và bảng điểm chuẩn.`;
        }
        const universities = await this.univRepo.find({
            where: entities.location ? { location: entities.location } : {},
            take: 10,
        });
        if (universities.length === 0) {
            return `Mình chưa có trường nào${entities.location ? ` ở ${entities.location}` : ''} trong dữ liệu hiện tại.`;
        }
        const list = universities
            .slice(0, 5)
            .map((u) => `• ${u.name} (${u.short_name}) — ${u.location}`)
            .join('\n');
        return `${entities.location ? `Một số trường ở ${entities.location}:` : 'Dưới đây là vài trường bạn có thể tham khảo:'}\n${list}\n\nBạn muốn tìm hiểu thêm trường nào?`;
    }
    async handleMajorQuery(entities, msg) {
        if ((0, chatbot_intent_rules_1.asksUniversityOrPrograms)(msg)) {
            return this.handleUniversityQuery(entities, msg);
        }
        const mentioned = await this.findMajorByEntities(entities, msg);
        const wantsSchoolList = this.contains(msg, [
            'trường nào',
            'truong nao',
            'trường nào đào tạo',
            'có những trường',
            'co nhung truong',
            'học ở đâu',
            'hoc o dau',
            'đào tạo ở',
            'dao tao o',
        ]);
        if (mentioned) {
            if (wantsSchoolList || entities.location) {
                const qb = this.uniMajorRepo
                    .createQueryBuilder('um')
                    .innerJoinAndSelect('um.university', 'u')
                    .innerJoin('um.major', 'm')
                    .where('m.id = :mid', { mid: mentioned.id });
                if (entities.location) {
                    qb.andWhere('u.location = :loc', { loc: entities.location });
                }
                const links = await qb.orderBy('u.name', 'ASC').take(12).getMany();
                if (links.length > 0) {
                    const list = links
                        .map((um) => {
                        const u = um.university;
                        const fee = um.tuition_fee
                            ? `~${(um.tuition_fee / 1_000_000).toFixed(0)} triệu/năm`
                            : u.tuition_fee_min
                                ? `${(u.tuition_fee_min / 1_000_000).toFixed(0)}-${(u.tuition_fee_max / 1_000_000).toFixed(0)} triệu/năm`
                                : 'đang cập nhật';
                        return `• ${u.name} (${u.short_name}) — ${u.location}, học phí ${fee}`;
                    })
                        .join('\n');
                    return `Các trường đào tạo ${mentioned.name}${entities.location ? ` tại ${entities.location}` : ' (Hà Nội)'}:\n${list}${mentioned.description ? `\n\n${mentioned.description}` : ''}\n\nBạn có thể hỏi tiếp điểm chuẩn từng trường, ví dụ: "Điểm chuẩn HUST ngành ${mentioned.name} năm 2024".`;
                }
            }
            return `${mentioned.name}${mentioned.code ? ` (mã ${mentioned.code})` : ''}\n${this.formatMajorClassification(mentioned)}\n\n${mentioned.description || 'Chưa có mô tả chi tiết.'}\n\nCơ hội nghề nghiệp: ${mentioned.career_orientation || 'đang cập nhật'}\nKỹ năng gợi ý: ${mentioned.required_skills || 'đang cập nhật'}\n\nBạn hỏi tiếp: "Ngành ${mentioned.name} có những trường nào ở Hà Nội?" để xem danh sách trường.`;
        }
        const majors = await this.majorRepo.find({
            relations: ['groupAssignments', 'groupAssignments.group'],
        });
        const grouped = majors.reduce((acc, m) => {
            const primary = m.groupAssignments?.find((a) => a.is_primary)?.group?.group_name ??
                m.field_group ??
                'Khác';
            if (!acc[primary])
                acc[primary] = [];
            acc[primary].push(m.name);
            return acc;
        }, {});
        const groupLines = Object.entries(grouped)
            .map(([g, names]) => `• ${g}: ${names.slice(0, 3).join(', ')}`)
            .join('\n');
        return `Mình có nhiều ngành theo nhóm, ví dụ:\n${groupLines}\n\nBạn quan tâm ngành nào? Hỏi tên ngành hoặc lĩnh vực (CNTT, Y, Kinh tế…) để mình tra cụ thể hơn.`;
    }
    formatTuitionRangeMillion(min, max) {
        if (min && max) {
            return `${(min / 1_000_000).toFixed(0)}–${(max / 1_000_000).toFixed(0)} triệu/năm`;
        }
        return 'chưa có trong dữ liệu';
    }
    async resolveProgramTuition(universityId, majorFilter) {
        if (!majorFilter?.trim())
            return null;
        const link = await this.uniMajorRepo
            .createQueryBuilder('um')
            .innerJoinAndSelect('um.major', 'm')
            .where('um.university_id = :uid', { uid: universityId })
            .andWhere((0, major_interest_match_1.majorTagSearchWhere)('m'), {
            mq: `%${majorFilter}%`,
        })
            .orderBy('um.tuition_fee', 'DESC', 'NULLS LAST')
            .getOne();
        if (!link?.tuition_fee)
            return null;
        return `~${(link.tuition_fee / 1_000_000).toFixed(0)} triệu/năm (ngành ${link.major.name})`;
    }
    async handleCompareTuitionFollowUp(sessionContext, entities, msg) {
        if (!(0, chatbot_intent_rules_1.looksLikeCompareTuitionFollowUp)(msg, sessionContext))
            return null;
        const compared = sessionContext.last_compared_universities ?? [];
        const universities = [];
        const seen = new Set();
        for (const name of compared) {
            const u = await this.findUniversityByEntities({ ...entities, university_name: name }, msg);
            if (u && !seen.has(u.id)) {
                seen.add(u.id);
                universities.push(u);
            }
        }
        if (universities.length < 2)
            return null;
        const majorFilter = entities.major ??
            sessionContext.last_major ??
            (0, major_search_1.resolveMajorSearchTerm)(msg) ??
            (0, major_search_1.extractMajorFragment)(msg);
        const blocks = [];
        let cheapest = null;
        let cheapestMin = Number.POSITIVE_INFINITY;
        for (const u of universities) {
            const programFee = await this.resolveProgramTuition(u.id, majorFilter);
            const rangeFee = this.formatTuitionRangeMillion(u.tuition_fee_min, u.tuition_fee_max);
            const fee = programFee ?? rangeFee;
            blocks.push(`**${u.short_name || u.name}**: ${fee}`);
            const minVal = u.tuition_fee_min ?? Number.POSITIVE_INFINITY;
            if (minVal < cheapestMin) {
                cheapestMin = minVal;
                cheapest = u;
            }
        }
        const majorNote = majorFilter ? ` — ngành **${majorFilter}**` : '';
        const cheapestNote = cheapest
            ? `\n\nTheo mức học phí thấp nhất trong dữ liệu, **${cheapest.short_name || cheapest.name}** có học phí tham khảo thấp hơn trong nhóm vừa so sánh.`
            : '';
        return (`So sánh học phí${majorNote} giữa **${universities.map((u) => u.short_name || u.name).join(', ')}**:\n\n` +
            `${blocks.join('\n')}${cheapestNote}\n\n${chatbot_copy_1.CHAT_DISCLAIMER_TUITION}`);
    }
    async handleTuitionQuery(entities, msg = '', sessionContext = (0, chat_session_context_1.parseSessionContext)(null)) {
        const compareFollowUp = await this.handleCompareTuitionFollowUp(sessionContext, entities, msg);
        if (compareFollowUp)
            return compareFollowUp;
        const mentioned = await this.findUniversityByEntities(entities, msg);
        if (mentioned) {
            const fee = mentioned.tuition_fee_min && mentioned.tuition_fee_max
                ? `${(mentioned.tuition_fee_min / 1_000_000).toFixed(0)}–${(mentioned.tuition_fee_max / 1_000_000).toFixed(0)} triệu/năm`
                : 'chưa có trong dữ liệu';
            return `Học phí ${mentioned.name} (${mentioned.short_name}): ${fee}.\n\n${chatbot_copy_1.CHAT_DISCLAIMER_TUITION}`;
        }
        const qb = this.univRepo
            .createQueryBuilder('u')
            .orderBy('u.tuition_fee_min', 'ASC');
        if (entities.location) {
            qb.andWhere('u.location = :loc', { loc: entities.location });
        }
        if (entities.major) {
            qb.innerJoin('u.universityMajors', 'um')
                .innerJoin('um.major', 'm')
                .andWhere((0, major_interest_match_1.majorTagSearchWhere)('m'), {
                mq: `%${entities.major}%`,
            })
                .distinct(true);
        }
        const universities = await qb.getMany();
        if (universities.length === 0) {
            const filter = [
                entities.location ? `khu vực ${entities.location}` : null,
                entities.major ? `ngành ${entities.major}` : null,
            ]
                .filter(Boolean)
                .join(', ');
            return `Mình chưa có học phí${filter ? ` cho ${filter}` : ''} trong dữ liệu hiện tại.`;
        }
        const list = universities
            .slice(0, 8)
            .map((u) => `• ${u.short_name} (${u.location}): ${u.tuition_fee_min ? (u.tuition_fee_min / 1_000_000).toFixed(0) + '–' + (u.tuition_fee_max / 1_000_000).toFixed(0) + ' triệu/năm' : 'đang cập nhật'}`)
            .join('\n');
        const title = [
            'Học phí tham khảo',
            entities.major ? `ngành ${entities.major}` : null,
            entities.location ? `tại ${entities.location}` : null,
        ]
            .filter(Boolean)
            .join(' — ');
        return `${title}:\n${list}\n\n${chatbot_copy_1.CHAT_DISCLAIMER_TUITION}`;
    }
    async handleLocationQuery(entities) {
        if (!entities.location) {
            return `${chatbot_copy_1.CHAT_SCOPE_HANOI} Bạn muốn xem danh sách trường, tra ngành hay điểm chuẩn?`;
        }
        const unis = await this.univRepo.find({
            where: { location: entities.location },
        });
        if (unis.length === 0) {
            return `Mình chưa có trường ở ${entities.location} trong dữ liệu — ${chatbot_copy_1.CHAT_SCOPE_HANOI}`;
        }
        const list = unis.map((u) => `• ${u.name} (${u.short_name})`).join('\n');
        return `Các trường tại ${entities.location}:\n${list}\n\nBạn muốn xem thêm thông tin trường nào?`;
    }
    async buildEntityFallback(msg) {
        const acronym = (0, chatbot_intent_rules_1.extractParentheticalAcronym)(msg);
        const majorFromInterest = acronym
            ? null
            : await this.extractInterest(msg).then((s) => s || null);
        return {
            score: this.extractScore(msg),
            subject_group: this.extractSubjectCombination(msg),
            major: majorFromInterest,
            location: this.extractLocation(msg),
            university_name: (0, chatbot_intent_rules_1.extractExplicitUniversityFromMessage)(msg) ?? acronym,
            year: (0, chatbot_intent_rules_1.extractYearFromMessage)(msg),
            method_code: await this.extractMethodCode(msg),
        };
    }
    async extractEntities(msg, context = '', preloadedRaw) {
        const fallback = await this.buildEntityFallback(msg);
        let raw = preloadedRaw ?? null;
        if (raw === null && this.ollama.isEnabled()) {
            raw = await this.ollama.extractEntities(msg, ENTITY_SCHEMA, PROMPT_EXAMPLES.entityExamples.map((ex) => ({
                q: ex.q,
                a: (0, intent_corpus_1.corpusEntitiesToChatEntities)(ex.a),
                is_follow_up: ex.is_follow_up,
                context_note: ex.context_note,
            })), { context });
        }
        if (!raw) {
            return { entities: fallback, source: 'rule' };
        }
        const ollama = {
            score: this.validScore(raw.score),
            subject_group: this.validSubjectGroup(raw.subject_group),
            major: typeof raw.major === 'string' && raw.major.trim()
                ? raw.major.trim()
                : null,
            location: this.validLocation(raw.location),
            university_name: typeof raw.university_name === 'string' && raw.university_name.trim()
                ? raw.university_name.trim()
                : null,
            year: this.validYear(raw.year),
            method_code: await this.validMethodCode(raw.method_code),
        };
        let usedFallback = false;
        const pick = (k) => {
            if (ollama[k] !== null)
                return ollama[k];
            if (fallback[k] !== null)
                usedFallback = true;
            return fallback[k];
        };
        const merged = {
            score: pick('score'),
            subject_group: pick('subject_group'),
            major: pick('major'),
            location: pick('location'),
            university_name: pick('university_name'),
            year: pick('year'),
            method_code: pick('method_code'),
        };
        return {
            entities: merged,
            source: usedFallback ? 'merged' : preloadedRaw ? 'merged' : 'ollama',
        };
    }
    validScore(v) {
        const n = (0, scalar_1.parseFloatFromUnknown)(v);
        return Number.isFinite(n) && n >= 0 && n <= 30 ? n : null;
    }
    validSubjectGroup(v) {
        if (typeof v !== 'string')
            return null;
        const s = v.trim().toUpperCase();
        return /^[ABCD]\d{2}$/.test(s) ? s : null;
    }
    validLocation(v) {
        if (typeof v !== 'string')
            return null;
        const s = v.trim().toLowerCase();
        if (['hà nội', 'ha noi', 'hanoi', 'thủ đô', 'thu do', 'miền bắc'].includes(s))
            return 'Hà Nội';
        return null;
    }
    validYear(v) {
        const n = (0, scalar_1.parseIntFromUnknown)(v);
        return Number.isInteger(n) && n >= 2020 && n <= 2030 ? n : null;
    }
    async getAllowedMethodCodes() {
        if (!this.allowedMethodCodes) {
            const rows = await this.admissionMethods.findAll();
            this.allowedMethodCodes = new Set(rows.map((r) => r.method_code));
        }
        return this.allowedMethodCodes;
    }
    async validMethodCode(v) {
        if (typeof v !== 'string' || !v.trim())
            return null;
        const normalized = v.trim().toUpperCase();
        const allowed = await this.getAllowedMethodCodes();
        for (const code of allowed) {
            if (code.toUpperCase() === normalized)
                return code;
        }
        return null;
    }
    async extractMethodCode(msg) {
        const m = msg.match(/\b(THPT|HOC_BA|DGNL|DGTD|XTTHANG|HSNL|PV|CCQT|DUHOC|KHAC|USTH_PT[1-4])\b/i);
        if (m)
            return this.validMethodCode(m[1]);
        const rules = [
            {
                keywords: ['học bạ', 'hoc ba', 'xét học bạ', 'xet hoc ba'],
                code: 'HOC_BA',
            },
            {
                keywords: [
                    'thi thpt',
                    'điểm thi thpt',
                    'diem thi thpt',
                    'xét điểm thi',
                    'xet diem thi',
                    'tốt nghiệp thpt',
                    'tot nghiep thpt',
                ],
                code: 'THPT',
            },
            {
                keywords: ['đánh giá năng lực', 'danh gia nang luc', 'dgnl'],
                code: 'DGNL',
            },
            {
                keywords: ['đánh giá tư duy', 'danh gia tu duy', 'dgtd'],
                code: 'DGTD',
            },
            {
                keywords: ['tuyển thẳng', 'tuyen thang', 'xét tuyển thẳng'],
                code: 'XTTHANG',
            },
            { keywords: ['hồ sơ năng lực', 'ho so nang luc', 'hsnl'], code: 'HSNL' },
            {
                keywords: ['chứng chỉ quốc tế', 'chung chi quoc te', 'ccqt'],
                code: 'CCQT',
            },
            {
                keywords: ['du học', 'du hoc', 'liên kết quốc tế', 'lien ket quoc te'],
                code: 'DUHOC',
            },
        ];
        for (const { keywords, code } of rules) {
            if (this.contains(msg, keywords))
                return this.validMethodCode(code);
        }
        return null;
    }
    extractYear(msg) {
        const m = msg.match(/\b(20[2-3]\d)\b/);
        if (!m)
            return null;
        const n = parseInt(m[1], 10);
        return n >= 2020 && n <= 2030 ? n : null;
    }
    async handleScoreQuery(entities, msg) {
        const score = entities.score;
        if (score === null) {
            return 'Bạn cho mình biết điểm dự kiến (thang 30) để mình gợi ý trường và ngành phù hợp hơn nhé. Ví dụ: "Em được 24 điểm khối A00 muốn học CNTT".';
        }
        if (score < 0 || score > 30) {
            return `Điểm ${score} nằm ngoài thang 0–30. Bạn nhập lại điểm thi tốt nghiệp THPT giúp mình nhé.`;
        }
        const subjectCombination = entities.subject_group ?? 'A00';
        const location = entities.location;
        const interestPhrase = (0, major_search_1.pickMajorInterestPhrase)(msg, entities.major);
        const interest = (await this.resolveInterestFromDb(interestPhrase)) || interestPhrase;
        const methodCode = entities.method_code ?? undefined;
        const methodLabel = methodCode
            ? await this.admissionMethods.resolveLabel(methodCode)
            : null;
        let response;
        try {
            response = await this.recommendations.recommend({
                expected_score: score,
                subject_combination: subjectCombination,
                interests: interest,
                preferred_location: location ?? undefined,
                ...(methodCode ? { method_code: methodCode } : {}),
            });
        }
        catch (err) {
            this.logger.warn(`RecommendationsService failed: ${err.message}`);
            return `Mình tạm thời chưa lấy được gợi ý. Bạn thử lại sau hoặc dùng trang Gợi ý trường/ngành trên menu.`;
        }
        const recs = response.results;
        if (!recs.length) {
            const reasonHint = response.meta.emptyReason === 'no_subject_combination'
                ? `\n\nGợi ý: ít ngành có điểm chuẩn tổ hợp ${subjectCombination} với tiêu chí bạn chọn — thử đổi khối hoặc nới rộng ngành quan tâm.`
                : response.meta.emptyReason === 'no_score_match'
                    ? `\n\nGợi ý: có ngành khớp khối nhưng điểm dự kiến còn thấp so với điểm chuẩn — bạn có thể nới sở thích hoặc cân nhắc thêm nhóm Reach (cân nhắc).`
                    : response.meta.emptyReason === 'no_interest_match'
                        ? `\n\nGợi ý: ${chatbot_copy_1.CHAT_SCOPE_HANOI} Mình chưa thấy ngành "${interest}" trong dữ liệu trường–ngành hiện có — thử tra cứu tên ngành chính xác hoặc hỏi "ở Hà Nội có trường nào đào tạo ngành … không?".`
                        : '';
            return `Với ${score} điểm, tổ hợp ${subjectCombination}${methodLabel ? `, PT ${methodLabel}` : ''}${location ? `, khu vực ${location}` : ''}${interest ? `, quan tâm "${interest}"` : ''}, mình chưa tìm được gợi ý phù hợp trong dữ liệu hiện có.${reasonHint}\n\nBạn thử chỉnh tiêu chí trên trang Gợi ý trường/ngành (có thêm ngân sách và mục tiêu nghề).`;
        }
        const top = recs.slice(0, 5);
        const uniqueTop = this.dedupeChatRecommendationItems(top);
        const lines = uniqueTop
            .map((r, i) => {
            const cutoff = r.cutoffScores?.[0]?.score ?? '—';
            const cutoffYear = r.cutoffScores?.[0]?.year ?? '';
            const shortName = r.university?.short_name || r.university?.name || '';
            const majorName = r.major?.name || '';
            const tierLabel = (0, chatbot_copy_1.tierLabelChat)(r.admissionTier);
            const tierPart = tierLabel ? `, ${tierLabel}` : '';
            return `${i + 1}. ${shortName} — ${majorName} (chuẩn ${cutoffYear}: ${cutoff}, phù hợp ${r.matchScore}%${tierPart})`;
        })
            .join('\n');
        const contextLine = [
            `${score} điểm`,
            `tổ hợp ${subjectCombination}`,
            methodLabel ? `PT ${methodLabel}` : null,
            location ? `khu vực ${location}` : null,
            interest ? `quan tâm ${interest}` : null,
        ]
            .filter(Boolean)
            .join(', ');
        return `Dựa trên ${contextLine}, đây là vài gợi ý phù hợp (điểm chuẩn 2023–2025):\n${lines}\n\nPhân tầng: An toàn = điểm bạn bằng/cao hơn chuẩn; Vừa sức = chênh ≤ 1 điểm; Cân nhắc = thấp hơn trên 1 điểm.\n\nMuốn tính thêm ngân sách và mục tiêu nghề, bạn dùng trang Gợi ý trường/ngành.`;
    }
    dedupeChatRecommendationItems(rows) {
        const seen = new Set();
        const out = [];
        for (const r of rows) {
            const uniKey = String(r.university?.id ??
                r.university?.short_name ??
                r.university?.name ??
                '');
            const majorKey = (r.major?.name ?? '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/\p{M}/gu, '')
                .replace(/\s+/g, ' ')
                .trim();
            const key = `${uniKey}|${majorKey}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            out.push(r);
        }
        return out;
    }
    extractScore(msg) {
        return (0, chatbot_intent_rules_1.extractScoreFromMessage)(msg);
    }
    extractSubjectCombination(msg) {
        const m = msg.match(/\b([abcdABCD]\d{2})\b/);
        return m ? m[1].toUpperCase() : null;
    }
    extractLocation(msg) {
        if (this.contains(msg, ['hà nội', 'ha noi', 'thủ đô', 'miền bắc']))
            return 'Hà Nội';
        return null;
    }
    async extractInterest(msg) {
        const phrase = (0, major_search_1.pickMajorInterestPhrase)(msg, null);
        if (phrase) {
            const fromDb = await this.resolveInterestFromDb(phrase);
            if (fromDb)
                return fromDb;
        }
        const majors = await this.majorRepo.find();
        for (const m of majors) {
            const name = m.name?.toLowerCase();
            if (name && msg.includes(name))
                return m.name;
        }
        if (this.contains(msg, [
            'cntt',
            'công nghệ thông tin',
            'cong nghe thong tin',
            ' it ',
        ]))
            return 'Công nghệ thông tin';
        if (this.contains(msg, ['kinh tế', 'kinh te']))
            return 'Kinh tế';
        if (this.contains(msg, ['y khoa', 'y đa khoa', 'y da khoa', 'bác sĩ']))
            return 'Y khoa';
        if (this.contains(msg, ['luật', 'luat']))
            return 'Luật';
        if (this.contains(msg, ['sư phạm toán', 'su pham toan']) ||
            (phrase &&
                (phrase.toLowerCase().includes('toán') ||
                    phrase.toLowerCase().includes('toan')))) {
            const resolved = phrase ? await this.resolveInterestFromDb(phrase) : null;
            if (resolved)
                return resolved;
        }
        if (this.contains(msg, ['sư phạm', 'su pham']))
            return 'Sư phạm';
        if (this.contains(msg, ['kỹ thuật', 'ky thuat', 'engineer']))
            return 'Kỹ thuật';
        return phrase;
    }
    async resolveInterestFromDb(phrase) {
        const trimmed = phrase.trim();
        if (trimmed.length < 2)
            return null;
        const found = await this.majorRepo
            .createQueryBuilder('m')
            .where((0, major_interest_match_1.majorTagSearchWhere)('m'), { mq: `%${trimmed}%` })
            .orderBy('LENGTH(m.name)', 'ASC')
            .getOne();
        return found?.name ?? null;
    }
    async findUniversitiesByEntities(entities, msg) {
        const names = (0, university_extract_1.collectUniversityNames)(msg, entities.university_name);
        const resolved = [];
        const seen = new Set();
        for (const name of names) {
            const u = await this.findUniversityByEntities({ ...entities, university_name: name }, msg);
            if (u && !seen.has(u.id)) {
                seen.add(u.id);
                resolved.push(u);
            }
        }
        return resolved;
    }
    formatUniversityTypeLabel(type) {
        if (type === 'public')
            return 'Công lập';
        if (type === 'private')
            return 'Tư thục';
        return type?.trim() || 'chưa rõ';
    }
    async resolveCompareUniversities(entities, msg, sessionContext) {
        const universities = await this.findUniversitiesByEntities(entities, msg);
        if (universities.length >= 2) {
            return universities.slice(0, 4);
        }
        const sessionNames = sessionContext.last_compared_universities ?? [];
        if (sessionNames.length < 2) {
            return universities.slice(0, 4);
        }
        const seen = new Set(universities.map((u) => u.id));
        for (const name of sessionNames) {
            const u = await this.findUniversityByEntities({ ...entities, university_name: name }, msg);
            if (u && !seen.has(u.id)) {
                seen.add(u.id);
                universities.push(u);
            }
        }
        return universities.slice(0, 4);
    }
    async collectUniversityAdmissionMethods(universityId) {
        const rows = await this.cutoffRepo
            .createQueryBuilder('cs')
            .innerJoin('cs.universityMajor', 'um')
            .where('um.university_id = :uid', { uid: universityId })
            .select('DISTINCT cs.admission_method', 'method')
            .orderBy('cs.admission_method', 'ASC')
            .getRawMany();
        return rows.map((r) => r.method?.trim()).filter((m) => !!m);
    }
    async buildUniversityCompareBlock(u, entities, majorFilter, subjectGroup, methodCode) {
        const programCount = await this.uniMajorRepo.count({
            where: { university: { id: u.id } },
        });
        const programFee = await this.resolveProgramTuition(u.id, majorFilter);
        const fee = programFee ??
            this.formatTuitionRangeMillion(u.tuition_fee_min, u.tuition_fee_max);
        const methods = await this.collectUniversityAdmissionMethods(u.id);
        const methodLabels = methods.length > 0
            ? methods.slice(0, 5).join(', ')
            : 'chưa có trong dữ liệu điểm chuẩn';
        let block = `**${u.name}** (${u.short_name || '—'})\n` +
            `• Loại hình: ${this.formatUniversityTypeLabel(u.type)}\n` +
            `• Khu vực: ${u.location || 'Hà Nội'}` +
            (u.address ? ` — ${u.address}` : '') +
            `\n` +
            `• Học phí: ${fee}\n` +
            `• Số ngành đào tạo: ${programCount}\n` +
            `• PT xét tuyển (từ điểm chuẩn): ${methodLabels}`;
        if (u.established_year) {
            block += `\n• Thành lập: ${u.established_year}`;
        }
        if (u.website) {
            block += `\n• Website: ${u.website}`;
        }
        const qb = this.cutoffRepo
            .createQueryBuilder('cs')
            .innerJoin('cs.universityMajor', 'um')
            .innerJoin('um.major', 'm')
            .where('um.university_id = :uid', { uid: u.id });
        if (majorFilter) {
            qb.andWhere((0, major_interest_match_1.majorTagSearchWhere)('m'), {
                mq: `%${majorFilter}%`,
            });
        }
        if (entities.year) {
            qb.andWhere('cs.year = :year', { year: entities.year });
        }
        if (subjectGroup) {
            qb.andWhere('cs.subject_combination = :subj', { subj: subjectGroup });
        }
        if (methodCode) {
            const label = await this.admissionMethods.resolveLabel(methodCode);
            const needle = (label ?? methodCode).toLowerCase();
            qb.andWhere('LOWER(cs.admission_method) LIKE :meth', {
                meth: `%${needle}%`,
            });
        }
        qb.orderBy('cs.year', 'DESC').addOrderBy('cs.score', 'DESC');
        const cutoffs = await qb.take(majorFilter ? 5 : 3).getMany();
        if (cutoffs.length > 0) {
            const scores = cutoffs.map((c) => c.score).filter((s) => s > 0);
            const minScore = scores.length ? Math.min(...scores) : null;
            const maxScore = scores.length ? Math.max(...scores) : null;
            const rangeNote = minScore != null && maxScore != null && minScore !== maxScore
                ? ` (khoảng ${minScore}–${maxScore})`
                : minScore != null
                    ? ` (${minScore})`
                    : '';
            const filterNote = [
                majorFilter ? `ngành ${majorFilter}` : null,
                entities.year ? `năm ${entities.year}` : null,
                subjectGroup ? `tổ hợp ${subjectGroup}` : null,
                methodCode ? `PT ${methodCode}` : null,
            ]
                .filter(Boolean)
                .join(', ');
            const cutoffLines = cutoffs
                .map((c) => `  – ${c.year}: ${c.score} (${c.subject_combination || '—'}, ${c.admission_method || '—'})`)
                .join('\n');
            block += `\n• Điểm chuẩn${filterNote ? ` (${filterNote})` : ''}${rangeNote}:\n${cutoffLines}`;
        }
        else if (majorFilter || entities.year || subjectGroup || methodCode) {
            block += `\n• Chưa có điểm chuẩn phù hợp bộ lọc hiện tại trong dữ liệu`;
        }
        return block;
    }
    async handleCompareQuery(entities, msg, sessionContext) {
        const universities = await this.resolveCompareUniversities(entities, msg, sessionContext);
        const majorFilter = (0, major_search_1.resolveMajorSearchTerm)(msg) ??
            (0, major_search_1.extractMajorFragment)(msg) ??
            entities.major ??
            sessionContext.last_major;
        const subjectGroup = entities.subject_group ?? sessionContext.last_subject_group;
        const methodCode = entities.method_code ?? sessionContext.last_method_code;
        if (universities.length >= 2) {
            const blocks = [];
            for (const u of universities.slice(0, 4)) {
                blocks.push(await this.buildUniversityCompareBlock(u, entities, majorFilter, subjectGroup, methodCode));
            }
            const majorNote = majorFilter ? ` — ngành **${majorFilter}**` : '';
            const yearNote = entities.year ? ` năm **${entities.year}**` : '';
            const compareIds = universities.slice(0, 2).map((u) => u.id);
            const deeplink = compareIds.length >= 2
                ? `/universities/compare?ids=${compareIds.join(',')}`
                : null;
            return (`So sánh **${universities.length} trường**${majorNote}${yearNote}:\n\n` +
                `${blocks.join('\n\n')}\n\n` +
                (deeplink
                    ? `Xem bảng so sánh chi tiết trên web: **${deeplink}** (lọc năm & tổ hợp trực tiếp trên trang).\n\n`
                    : '') +
                `Bạn có thể hỏi tiếp: "Hai trường này học phí chênh nhau thế nào?" hoặc "Trường nào dễ đỗ hơn?"\n\n` +
                `${chatbot_copy_1.CHAT_DISCLAIMER_CUTOFF}`);
        }
        const hint = [
            entities.university_name ? `trường ${entities.university_name}` : null,
            entities.major ? `ngành ${entities.major}` : null,
        ]
            .filter(Boolean)
            .join(' / ');
        return `Để so sánh${hint ? ` ${hint} với lựa chọn khác` : ' hai trường'}, bạn có thể:\n1. Vào Tra cứu trường → chọn So sánh (tối đa 2 trường) → So sánh ngay\n2. Ở trang chi tiết trường → Thêm vào so sánh\n3. Xem điểm chuẩn từng trường theo ngành và năm\n\nVí dụ: "So sánh USTH và HUST về điểm chuẩn CNTT năm 2024 khối A00".`;
    }
    async handleAdmissionMethodQuery(entities, msg) {
        const catalog = await this.admissionMethods.findAll();
        const mentioned = await this.findUniversityByEntities(entities, msg);
        if (entities.method_code && !mentioned) {
            const label = await this.admissionMethods.resolveLabel(entities.method_code);
            const desc = catalog.find((c) => c.method_code === entities.method_code);
            const name = label ?? entities.method_code;
            const note = desc?.description?.trim();
            return `Phương thức **${name}** (${entities.method_code}):\n${note || 'Mỗi trường có quy định riêng — bạn hỏi thêm tên trường để mình xem PT nào có trong dữ liệu điểm chuẩn.'}\n\n${chatbot_copy_1.CHAT_DISCLAIMER_GENERAL}`;
        }
        if (mentioned) {
            const rows = await this.cutoffRepo
                .createQueryBuilder('cs')
                .innerJoin('cs.universityMajor', 'um')
                .where('um.university_id = :uid', { uid: mentioned.id })
                .select('DISTINCT cs.admission_method', 'method')
                .orderBy('cs.admission_method', 'ASC')
                .getRawMany();
            const methods = rows
                .map((r) => r.method?.trim())
                .filter((m) => !!m);
            if (methods.length === 0) {
                return `Mình chưa thấy phương thức xét tuyển nào trong dữ liệu điểm chuẩn của ${mentioned.name} (${mentioned.short_name}). Bạn thử hỏi điểm chuẩn theo năm hoặc xem trang chi tiết trường.\n\n${chatbot_copy_1.CHAT_DISCLAIMER_GENERAL}`;
            }
            const list = methods.map((m) => `• ${m}`).join('\n');
            const methodHint = entities.method_code
                ? `\n\nBạn đang hỏi về PT **${entities.method_code}** — hỏi thêm "điểm chuẩn ... theo ${entities.method_code}" để xem mức điểm.`
                : '';
            return `Theo dữ liệu điểm chuẩn, **${mentioned.name}** (${mentioned.short_name}) có các phương thức:\n${list}${methodHint}\n\n${chatbot_copy_1.CHAT_DISCLAIMER_CUTOFF}`;
        }
        const list = catalog
            .slice(0, 12)
            .map((m) => `• ${m.method_name} (${m.method_code})`)
            .join('\n');
        return `Các phương thức xét tuyển trong hệ thống:\n${list}\n\nBạn hỏi thêm tên trường (ví dụ NEU, Bách Khoa) để xem trường đó áp dụng PT nào trong dữ liệu điểm chuẩn.\n\n${chatbot_copy_1.CHAT_DISCLAIMER_GENERAL}`;
    }
    handleScholarshipQuery(entities) {
        const uni = entities.university_name
            ? ` trường ${entities.university_name}`
            : entities.location
                ? ` tại ${entities.location}`
                : '';
        const major = entities.major ? ` ngành ${entities.major}` : '';
        return `Mình **chưa có cơ sở dữ liệu học bổng** chi tiết${uni}${major}.\n\nGợi ý:\n• Xem website chính thức của trường (mục Tuyển sinh / Học bổng)\n• Hỏi phòng Công tác sinh viên hoặc cố vấn tuyển sinh\n• Theo dõi thông báo tuyển sinh từ tháng 3–7 hàng năm\n\n${chatbot_copy_1.CHAT_DISCLAIMER_GENERAL}`;
    }
    async handleFacilitiesQuery(entities, msg) {
        const mentioned = await this.findUniversityByEntities(entities, msg);
        if (mentioned) {
            const parts = [
                mentioned.address ? `Địa chỉ: ${mentioned.address}` : null,
                mentioned.website ? `Website: ${mentioned.website}` : null,
                mentioned.description
                    ? `Giới thiệu: ${mentioned.description.slice(0, 280)}${mentioned.description.length > 280 ? '…' : ''}`
                    : null,
            ].filter(Boolean);
            const body = parts.length > 0
                ? parts.join('\n')
                : 'Mình chưa có mô tả cơ sở vật chất chi tiết trong dữ liệu.';
            return `Thông tin tham khảo — **${mentioned.name}** (${mentioned.short_name}):\n${body}\n\n**Ký túc xá / phòng lab:** hệ thống chưa lưu chi tiết — bạn nên xem website trường hoặc hỏi cố vấn tuyển sinh.\n\n${chatbot_copy_1.CHAT_DISCLAIMER_GENERAL}`;
        }
        if (entities.location) {
            const unis = await this.univRepo.find({
                where: { location: entities.location },
                take: 6,
            });
            if (unis.length > 0) {
                const list = unis
                    .map((u) => `• ${u.short_name}: ${u.address?.slice(0, 60) ?? 'địa chỉ đang cập nhật'}`)
                    .join('\n');
                return `Một số trường tại ${entities.location}:\n${list}\n\nHỏi tên trường cụ thể để xem địa chỉ/website; thông tin KTX chưa có trong dữ liệu.\n\n${chatbot_copy_1.CHAT_DISCLAIMER_GENERAL}`;
            }
        }
        return `Mình có thể tra **địa chỉ / website** nếu bạn nêu tên trường. Thông tin **ký túc xá, lab, thư viện** chưa có trong cơ sở dữ liệu — vui lòng xem website trường.\n\n${chatbot_copy_1.CHAT_DISCLAIMER_GENERAL}`;
    }
    async handleCareerQuery(entities, msg) {
        const mentioned = await this.findMajorByEntities(entities, msg);
        if (mentioned && mentioned.career_orientation) {
            return `Cơ hội nghề nghiệp — ngành ${mentioned.name}:\n${mentioned.career_orientation}\n\nKỹ năng nên trang bị: ${mentioned.required_skills || 'đang cập nhật'}\n\n${chatbot_copy_1.CHAT_DISCLAIMER_GENERAL}`;
        }
        if (mentioned) {
            return `Mình chưa có mô tả nghề nghiệp chi tiết cho ngành ${mentioned.name}. Bạn xem các trường đào tạo ngành này ở trang Tra cứu ngành.`;
        }
        return `Để tư vấn việc làm sau khi ra trường, bạn cho mình biết ngành cụ thể nhé — ví dụ CNTT, Kinh doanh quốc tế, Y khoa… Bạn đang quan tâm ngành nào?`;
    }
    getGreeting() {
        return `Chào bạn! Mình là trợ lý tư vấn tuyển sinh đại học.\n\nMình có thể giúp bạn:\n• Tra cứu trường, ngành, học phí\n• Xem điểm chuẩn theo năm và phương thức xét tuyển\n• Gợi ý trường/ngành theo điểm và sở thích\n\n${chatbot_copy_1.CHAT_SCOPE_HANOI}\n\nBạn muốn hỏi gì trước?`;
    }
    getHelp() {
        return `Bạn có thể hỏi tự nhiên, ví dụ:\n• "Điểm chuẩn Bách Khoa Hà Nội năm 2024"\n• "Học phí ngành CNTT ở Hà Nội"\n• "Em 24 điểm khối A00 muốn học CNTT thì nên chọn trường nào?"\n• "Trường nào ở Hà Nội đào tạo Kinh tế?"\n• "Ngành Marketing ra trường làm gì?"\n\n${chatbot_copy_1.CHAT_SCOPE_HANOI}`;
    }
    getDefaultAnswer() {
        return `Mình chưa chắc bạn đang hỏi về chủ đề nào. Bạn thử hỏi rõ hơn về:\n• Trường đại học (thông tin, học phí)\n• Ngành học và việc làm sau tốt nghiệp\n• Điểm chuẩn theo trường, năm, tổ hợp\n• Gợi ý chọn trường theo điểm và sở thích\n\n${chatbot_copy_1.CHAT_DISCLAIMER_GENERAL}`;
    }
    humanizeAnswer(raw) {
        return raw
            .replace(/\*\*/g, '')
            .replace(/`/g, '')
            .replace(/dataset/gi, 'dữ liệu')
            .replace(/đồ án/gi, 'ứng dụng')
            .replace(/\bhệ thống\b/gi, 'mình')
            .replace(/\btôi\b/gi, 'mình')
            .replace(/top gợi ý từ dữ liệu hệ thống/gi, 'một số gợi ý phù hợp')
            .replace(/số liệu lấy từ điểm chuẩn 2023–2025 trong postgresql\.?/gi, '')
            .replace(/đây là dữ liệu tham khảo từ hệ thống\.?/gi, 'Bạn có thể tham khảo để cân nhắc thêm.')
            .replace(/backend|postgresql|database nội bộ|api nội bộ/gi, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }
    async listUserSessions(userId) {
        const sessions = await this.sessionRepo.find({
            where: { user: { id: userId } },
            order: { updated_at: 'DESC', id: 'DESC' },
            take: chat_session_policy_1.MAX_CHAT_SESSIONS_PER_USER,
        });
        const summaries = [];
        for (const s of sessions) {
            if (!s.session_key)
                continue;
            const lastUser = await this.messageRepo.findOne({
                where: { chatSession: { id: s.id }, sender: 'user' },
                order: { created_at: 'DESC', id: 'DESC' },
            });
            summaries.push({
                session_id: s.session_key,
                title: s.title?.trim() || 'Cuộc trò chuyện',
                updated_at: s.updated_at,
                preview: lastUser?.message?.trim().slice(0, 120) ?? null,
            });
        }
        return summaries;
    }
    async getChatHistory(userId, sessionId) {
        const session = await this.sessionRepo.findOne({
            where: { session_key: sessionId, user: { id: userId } },
            relations: ['user'],
        });
        if (!session) {
            return [];
        }
        const qb = this.messageRepo
            .createQueryBuilder('m')
            .innerJoinAndSelect('m.chatSession', 's')
            .where('s.id = :sid', { sid: session.id })
            .orderBy('m.created_at', 'DESC')
            .addOrderBy('m.id', 'DESC')
            .take(100);
        const messages = await qb.getMany();
        const turns = [];
        const byTimeAsc = [...messages].reverse();
        let pendingUser = null;
        for (const msg of byTimeAsc) {
            if (msg.sender === 'user') {
                pendingUser = msg;
            }
            else if (msg.sender === 'assistant' && pendingUser) {
                const rawIds = msg.metadata?.compare_university_ids;
                const compareUniversityIds = Array.isArray(rawIds)
                    ? rawIds.filter((id) => typeof id === 'number' && id > 0)
                    : [];
                turns.push({
                    id: msg.id,
                    question: pendingUser.message,
                    answer: msg.message,
                    session_id: msg.chatSession.session_key,
                    created_at: pendingUser.created_at,
                    compare_university_ids: compareUniversityIds.length >= 2 ? compareUniversityIds : null,
                });
                pendingUser = null;
            }
        }
        return turns.reverse().slice(0, 50);
    }
    contains(text, keywords) {
        return keywords.some((kw) => text.includes(kw));
    }
    translateType(type) {
        const map = {
            public: 'Công lập',
            private: 'Tư thục',
            international: 'Quốc tế',
        };
        return map[type] || type;
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = ChatbotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_session_entity_1.ChatSession)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(university_entity_1.University)),
    __param(3, (0, typeorm_1.InjectRepository)(major_entity_1.Major)),
    __param(4, (0, typeorm_1.InjectRepository)(university_major_entity_1.UniversityMajor)),
    __param(5, (0, typeorm_1.InjectRepository)(cutoff_score_entity_1.CutoffScore)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        ollama_service_1.OllamaService,
        recommendations_service_1.RecommendationsService,
        admission_methods_service_1.AdmissionMethodsService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map