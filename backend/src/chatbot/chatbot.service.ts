import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ChatSession } from './chat-session.entity';
import { ChatMessage } from './chat-message.entity';
import { University } from '../universities/university.entity';
import { Major } from '../majors/major.entity';
import { majorTagSearchWhere } from '../majors/major-interest-match';
import { UniversityMajor } from '../majors/university-major.entity';
import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
import { OllamaService } from '../ollama/ollama.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { AdmissionMethodsService } from '../admission-methods/admission-methods.service';
import {
  CHAT_INTENTS,
  type ChatEntities,
  type ChatIntent,
} from './chatbot.types';
import {
  CHAT_DISCLAIMER_CUTOFF,
  CHAT_DISCLAIMER_GENERAL,
  CHAT_DISCLAIMER_TUITION,
  CHAT_SCOPE_HANOI,
  DB_MAJOR_LIST_PREFIX,
  tierLabelChat,
} from './chatbot-copy';
import {
  INTENT_CLASSIFY_DESCRIPTIONS,
  INTENT_HANDLER_MATRIX,
  corpusEntitiesToChatEntities,
  selectPromptExamples,
  shouldSkipOllamaRewrite,
} from './intent-corpus';
import {
  asksUniversityOrPrograms,
  asksUniversityPrograms,
  classifyIntentRuleOnly,
  correctRuleIntent,
  extractExplicitUniversityFromMessage,
  extractParentheticalAcronym,
  extractScoreFromMessage,
  extractYearFromMessage,
  looksLikeScoreRecommendation,
  resolveFollowUpIntent,
  looksLikeCompareTuitionFollowUp,
} from './chatbot-intent-rules';
import {
  shouldPreferRuleOverOllamaIntent,
  validateEntitiesAgainstDb,
} from './chatbot-guardrails';
import {
  extractMajorFragment,
  pickMajorInterestPhrase,
  resolveMajorSearchTerm,
} from './major-search';
import { collectUniversityNames } from './university-extract';
import {
  buildSessionContextHint,
  mergeEntitiesWithSession,
  parseSessionContext,
  sessionContextToRecord,
  updateSessionContext,
  type ChatSessionContext,
} from './chat-session-context';
import { relationStub } from '../common/typeorm-relations';
import { parseFloatFromUnknown, parseIntFromUnknown } from '../common/scalar';
import { User } from '../users/user.entity';
import {
  assertSessionAccess,
  MAX_CHAT_SESSIONS_PER_USER,
  sessionUserId,
} from './chat-session-policy';

/** Ngưỡng confidence tối thiểu để chấp nhận intent từ Ollama. */
const INTENT_CONFIDENCE_THRESHOLD = 0.5;

/** Few-shot gửi Ollama (subset corpus intent.txt — tránh prompt quá dài). */
const PROMPT_EXAMPLES = selectPromptExamples();

/** Map intent LLM hay trả sai tên → enum hợp lệ. */
const INTENT_ALIASES: Record<string, ChatIntent> = {
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

/** Mô tả ngắn từng intent — đưa vào prompt classify để qwen2.5:3b phân biệt rõ hơn. */
const INTENT_DESCRIPTIONS = INTENT_CLASSIFY_DESCRIPTIONS;

/** Schema + few-shot cho Ollama. Tách hằng số để dễ tinh chỉnh prompt. */
const ENTITY_SCHEMA = {
  score: {
    description:
      'Vietnamese THPT exam score, 0-30 scale. Convert Vietnamese number words ("hai mươi tư" = 24).',
    type: 'number' as const,
  },
  subject_group: {
    description:
      'Subject combination code: A00, A01, B00, C00, C01, D01, D07. Map "khối tự nhiên" = "A00", "khối xã hội" = "C00".',
    type: 'string' as const,
  },
  major: {
    description:
      'Major / field of study in Vietnamese, e.g. "Công nghệ thông tin", "Y khoa", "Kinh tế". Expand common abbreviations: CNTT, IT, AI.',
    type: 'string' as const,
  },
  location: {
    description:
      'Region. Dataset only covers Hanoi universities. Return "Hà Nội" when user mentions Hà Nội / Hanoi / "thủ đô" / "miền bắc". Return null for ANY other city (TP.HCM, Sài Gòn, Đà Nẵng, etc.) or when not mentioned.',
    type: 'string' as const,
  },
  university_name: {
    description:
      'University name or short name as the user wrote it, e.g. "Bách Khoa Hà Nội", "HUST", "FPT".',
    type: 'string' as const,
  },
  year: {
    description: 'Admission year, must be between 2020 and 2030.',
    type: 'number' as const,
  },
  method_code: {
    description:
      'Admission method code when user mentions PT: THPT, HOC_BA, DGNL, DGTD, XTTHANG, HSNL, PV, CCQT, DUHOC, KHAC. Map "học bạ"→HOC_BA, "thi THPT"/"điểm thi tốt nghiệp"→THPT, "đánh giá năng lực"/"DGNL"→DGNL, "tuyển thẳng"→XTTHANG, "hồ sơ năng lực"→HSNL. null if not mentioned.',
    type: 'string' as const,
  },
};

/** Entity rỗng — dùng cho intent greeting/help/unknown (không cần extract). */
const EMPTY_ENTITIES: ChatEntities = {
  score: null,
  subject_group: null,
  major: null,
  location: null,
  university_name: null,
  year: null,
  method_code: null,
};

export type { ChatEntities } from './chatbot.types';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private allowedMethodCodes: Set<string> | null = null;

  constructor(
    @InjectRepository(ChatSession)
    private readonly sessionRepo: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private readonly messageRepo: Repository<ChatMessage>,
    @InjectRepository(University)
    private readonly univRepo: Repository<University>,
    @InjectRepository(Major)
    private readonly majorRepo: Repository<Major>,
    @InjectRepository(UniversityMajor)
    private readonly uniMajorRepo: Repository<UniversityMajor>,
    @InjectRepository(CutoffScore)
    private readonly cutoffRepo: Repository<CutoffScore>,
    private readonly ollama: OllamaService,
    private readonly recommendations: RecommendationsService,
    private readonly admissionMethods: AdmissionMethodsService,
  ) {}

  async chat(
    message: string,
    userId?: number,
    sessionId?: string,
  ): Promise<{
    answer: string;
    engine: 'ollama' | 'rule';
    compare_university_ids: number[] | null;
  }> {
    const session = await this.resolveChatSession(userId, sessionId);
    const sessionContext = parseSessionContext(session.session_context);

    // Step 4: load 5 turn gần nhất + session carry-over (last_university/major/intent).
    const conversationContext = await this.loadConversationContext(
      userId,
      sessionId,
      5,
    );
    const sessionHint = buildSessionContextHint(sessionContext);
    const context = [sessionHint, conversationContext]
      .filter(Boolean)
      .join('\n\n');
    if (context) {
      this.logger.debug(`context loaded (${context.split('\n').length} lines)`);
    }

    const normalizedMsg = message.toLowerCase().trim();
    const {
      answer: ruleAnswer,
      intent,
      entities,
      comparedUniversities,
      compareUniversityIds,
    } = await this.processMessage(normalizedMsg, context, sessionContext);

    // Nếu Ollama bật: nhờ LLM diễn đạt lại dựa trên DB context (= ruleAnswer).
    // Mọi số liệu trường/ngành/điểm/học phí vẫn lấy từ ruleAnswer (DB-backed).
    let finalAnswer = ruleAnswer;
    let engine: 'ollama' | 'rule' = 'rule';

    const skipRewrite = shouldSkipOllamaRewrite(ruleAnswer, intent);
    if (skipRewrite) {
      this.logger.debug(
        `Skip Ollama rewrite — intent=${intent} (${INTENT_HANDLER_MATRIX[intent].handler}), structured DB answer.`,
      );
    }

    if (this.ollama.isEnabled() && !skipRewrite) {
      const llm = await this.ollama.generate({
        prompt: this.buildOllamaPrompt(message, ruleAnswer, context),
        options: { temperature: 0, num_predict: 1024 },
      });
      if (llm) {
        finalAnswer = llm;
        engine = 'ollama';
      } else {
        this.logger.debug('Ollama unavailable → trả về phản hồi rule-based.');
      }
    }

    finalAnswer = this.humanizeAnswer(finalAnswer);
    const resolvedUni = await this.findUniversityByEntities(entities, message);
    const contextEntities: ChatEntities = resolvedUni
      ? {
          ...entities,
          university_name: resolvedUni.short_name || resolvedUni.name,
        }
      : entities;
    session.session_context = sessionContextToRecord(
      updateSessionContext(
        sessionContext,
        intent,
        contextEntities,
        comparedUniversities,
      ),
    );
    await this.sessionRepo.save(session);
    await this.appendChatTurn(
      session,
      message,
      finalAnswer,
      engine,
      intent,
      entities,
      compareUniversityIds,
    );

    return {
      answer: finalAnswer,
      engine,
      compare_university_ids: compareUniversityIds,
    };
  }

  /**
   * Tìm hoặc tạo `chat_sessions` theo `session_key` (FE) hoặc user ẩn danh.
   * Session đã gắn user khác → Forbidden; sau khi tạo session cho user → giữ tối đa 5.
   */
  private async resolveChatSession(
    userId?: number,
    clientSessionId?: string,
  ): Promise<ChatSession> {
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
          user: userId ? relationStub<User>(userId) : null,
        });
        await this.sessionRepo.save(session);
        created = true;
      } else {
        assertSessionAccess(session, userId);
        if (userId && sessionUserId(session) == null) {
          session.user = relationStub<User>(userId);
          await this.sessionRepo.save(session);
        }
      }
      if (userId && created) {
        await this.pruneOldSessionsForUser(userId);
      }
      return session;
    }

    const session = this.sessionRepo.create({
      user: userId ? relationStub<User>(userId) : null,
    });
    const saved = await this.sessionRepo.save(session);
    if (userId) {
      await this.pruneOldSessionsForUser(userId);
    }
    return saved;
  }

  /** Xóa các session cũ nhất khi user có hơn MAX_CHAT_SESSIONS_PER_USER cuộc. */
  private async pruneOldSessionsForUser(userId: number): Promise<void> {
    const sessions = await this.sessionRepo.find({
      where: { user: { id: userId } },
      order: { updated_at: 'DESC', id: 'DESC' },
      select: ['id'],
    });
    if (sessions.length <= MAX_CHAT_SESSIONS_PER_USER) return;
    const excess = sessions.slice(MAX_CHAT_SESSIONS_PER_USER).map((s) => s.id);
    if (excess.length > 0) {
      await this.sessionRepo.delete(excess);
    }
  }

  private async appendChatTurn(
    session: ChatSession,
    question: string,
    answer: string,
    engine: 'ollama' | 'rule',
    intent: ChatIntent,
    entities: ChatEntities,
    compareUniversityIds?: number[] | null,
  ): Promise<void> {
    const compareIds =
      compareUniversityIds?.filter((id) => id > 0).slice(0, 2) ?? [];
    const assistantMetadata: Record<string, unknown> = {
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

  /**
   * Load N tin gần nhất từ `chat_messages` (ưu tiên theo session_key, else user).
   */
  private async loadConversationContext(
    userId?: number,
    sessionId?: string,
    limit = 5,
  ): Promise<string> {
    if (!userId && !sessionId) return '';

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
    } else if (userId) {
      qb.andWhere('s.user_id = :uid', { uid: userId });
    }

    const rows = await qb.getMany();
    if (rows.length === 0) return '';

    return rows
      .reverse()
      .map((m) => {
        const label = m.sender === 'user' ? 'User' : 'Bot';
        return `${label}: ${m.message.trim().slice(0, 300)}`;
      })
      .join('\n');
  }

  /**
   * Prompt cho Ollama: yêu cầu diễn đạt lại CHỈ DỰA TRÊN context lấy từ DB.
   * Không cho phép tự bịa thêm thông tin. Conversation context (nếu có) chỉ để
   * LLM biết tone/sự liên tục — TUYỆT ĐỐI không lấy số liệu từ đó.
   */
  private buildOllamaPrompt(
    userMessage: string,
    dbAnswer: string,
    context = '',
  ): string {
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
      '- Không rút gọn danh sách có sẵn; không dùng markdown ( hoặc `).',
      '- Không nhắc backend, database, PostgreSQL, API hay "dữ liệu hệ thống".',
      '- Tối đa 1–2 emoji nhẹ (tùy chọn); không disclaimer dài trừ khi đã có trong dữ liệu.',
    ]
      .filter(Boolean)
      .join('\n');
  }

  private async processMessage(
    msg: string,
    context = '',
    sessionContext = parseSessionContext(null),
  ): Promise<{
    answer: string;
    intent: ChatIntent;
    entities: ChatEntities;
    comparedUniversities: string[] | null;
    compareUniversityIds: number[] | null;
  }> {
    const {
      intent,
      entities: rawEntities,
      intentSource,
      entitySource,
      confidence,
    } = await this.resolveIntentAndEntities(msg, context, sessionContext);
    const merged = mergeEntitiesWithSession(rawEntities, sessionContext, msg);
    const entities = await this.validateAndSanitizeEntities(merged, msg);
    this.logger.debug(
      `intent=${intent} handler=${INTENT_HANDLER_MATRIX[intent].handler}` +
        ` intentSource=${intentSource}` +
        (confidence != null ? ` confidence=${confidence.toFixed(2)}` : '') +
        ` entitySource=${entitySource} ${JSON.stringify(entities)}`,
    );

    let answer: string;
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
        if (looksLikeScoreRecommendation(msg)) {
          answer = await this.handleScoreQuery(entities, msg);
        } else {
          answer = this.getDefaultAnswer();
        }
    }
    let comparedUniversities: string[] | null = null;
    let compareUniversityIds: number[] | null = null;
    if (intent === 'compare_universities') {
      const resolved = await this.resolveCompareUniversities(
        entities,
        msg,
        sessionContext,
      );
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

  private intentNeedsEntities(intent: ChatIntent): boolean {
    return INTENT_HANDLER_MATRIX[intent].needsEntities;
  }

  /** Guardrails: bỏ entity nhiễu (ANH, …) và xác thực tên trường/ngành với DB. */
  private async validateAndSanitizeEntities(
    entities: ChatEntities,
    msg: string,
  ): Promise<ChatEntities> {
    return validateEntitiesAgainstDb(entities, msg, {
      universityExists: async (name) => {
        const found = await this.univRepo.findOne({
          where: [
            { name: ILike(`%${name}%`) },
            { short_name: ILike(`%${name}%`) },
          ],
        });
        return !!found;
      },
      majorExists: async (term) => {
        const found = await this.majorRepo
          .createQueryBuilder('m')
          .where(majorTagSearchWhere('m'), { mq: `%${term}%` })
          .getOne();
        return !!found;
      },
    });
  }

  /**
   * Ưu tiên 1 lượt Ollama (classify + extract); fallback 2 lượt hoặc rule.
   */
  private async resolveIntentAndEntities(
    msg: string,
    context = '',
    sessionContext = parseSessionContext(null),
  ): Promise<{
    intent: ChatIntent;
    entities: ChatEntities;
    intentSource: 'ollama' | 'rule';
    entitySource: 'ollama' | 'rule' | 'merged';
    confidence?: number;
  }> {
    const sessionHint = buildSessionContextHint(sessionContext);
    const enrichedContext = [sessionHint, context].filter(Boolean).join('\n\n');

    if (this.ollama.isEnabled()) {
      const merged = await this.ollama.classifyAndExtract(
        msg,
        CHAT_INTENTS,
        ENTITY_SCHEMA,
        {
          context: enrichedContext,
          intentExamples: PROMPT_EXAMPLES.intentExamples,
          entityExamples: PROMPT_EXAMPLES.entityExamples,
          combinedExamples: PROMPT_EXAMPLES.combinedExamples,
          intentAliases: INTENT_ALIASES,
          intentDescriptions: INTENT_DESCRIPTIONS,
        },
      );
      if (
        merged &&
        merged.confidence >= INTENT_CONFIDENCE_THRESHOLD &&
        merged.intent !== 'unknown'
      ) {
        let intent = resolveFollowUpIntent(
          correctRuleIntent(merged.intent, msg),
          msg,
          sessionContext,
        );
        const ruleIntent = classifyIntentRuleOnly(msg, sessionContext);
        let intentSource: 'ollama' | 'rule' = 'ollama';
        if (shouldPreferRuleOverOllamaIntent(ruleIntent, intent, msg)) {
          intent = resolveFollowUpIntent(
            correctRuleIntent(ruleIntent, msg),
            msg,
            sessionContext,
          );
          intentSource = 'rule';
          this.logger.debug(
            `Rule wins on Ollama conflict: ollama=${merged.intent} rule=${ruleIntent} → ${intent}`,
          );
        } else if (intent !== merged.intent) {
          this.logger.debug(
            `intent corrected ${merged.intent} → ${intent} (score-recommendation heuristic)`,
          );
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
        const extracted = await this.extractEntities(
          msg,
          enrichedContext,
          merged.entities,
        );
        return {
          intent,
          entities: extracted.entities,
          intentSource,
          entitySource: 'merged',
          confidence: merged.confidence,
        };
      }
      if (merged) {
        this.logger.debug(
          `classify+extract rejected (intent=${merged.intent}, confidence=${merged.confidence}) → fallback`,
        );
      }
    }

    const ruleIntent = resolveFollowUpIntent(
      correctRuleIntent(classifyIntentRuleOnly(msg, sessionContext), msg),
      msg,
      sessionContext,
    );
    let entities = EMPTY_ENTITIES;
    let entitySource: 'ollama' | 'rule' | 'merged' = 'rule';
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

  /**
   * Ưu tiên Ollama classify; nếu Ollama disabled / lỗi / confidence thấp
   * → fallback rule-based để bot vẫn chạy được khi LLM down.
   *
   * `context` (Step 4) giúp LLM xử lý câu follow-up
   * (vd "còn ngành CNTT thì sao?" sau câu hỏi về điểm chuẩn BKHN).
   */
  private async classifyIntent(
    msg: string,
    context = '',
    sessionContext = parseSessionContext(null),
  ): Promise<{
    intent: ChatIntent;
    source: 'ollama' | 'rule';
    confidence?: number;
  }> {
    if (this.ollama.isEnabled()) {
      const result = await this.ollama.classifyIntent(msg, CHAT_INTENTS, {
        context,
        examples: PROMPT_EXAMPLES.intentExamples,
        intentAliases: INTENT_ALIASES,
        intentDescriptions: INTENT_DESCRIPTIONS,
      });
      if (
        result &&
        result.confidence >= INTENT_CONFIDENCE_THRESHOLD &&
        result.intent !== 'unknown'
      ) {
        let intent = correctRuleIntent(result.intent, msg);
        intent = resolveFollowUpIntent(intent, msg, sessionContext);
        const ruleIntent = classifyIntentRuleOnly(msg, sessionContext);
        if (shouldPreferRuleOverOllamaIntent(ruleIntent, intent, msg)) {
          intent = resolveFollowUpIntent(
            correctRuleIntent(ruleIntent, msg),
            msg,
            sessionContext,
          );
          this.logger.debug(
            `Rule wins on classify conflict: ollama=${result.intent} rule=${ruleIntent} → ${intent}`,
          );
          return {
            intent,
            source: 'rule',
            confidence: result.confidence,
          };
        }
        if (intent !== result.intent) {
          this.logger.debug(
            `intent corrected ${result.intent} → ${intent} (rule heuristics / follow-up)`,
          );
        }
        return {
          intent,
          source: 'ollama',
          confidence: result.confidence,
        };
      }
      if (result) {
        this.logger.debug(
          `Ollama intent "${result.intent}" rejected (confidence=${result.confidence}) → rule fallback`,
        );
      }
    }
    const intent = classifyIntentRuleOnly(msg, sessionContext);
    return { intent, source: 'rule' };
  }

  /**
   * Tìm 1 trường theo `entities.university_name` (ưu tiên ILIKE),
   * fallback loop `msg.includes()` nếu Ollama không bắt được tên.
   */
  /** Một token trường (NEU, FTU, …) — ưu tiên khớp chính xác short_name. */
  private async resolveUniversityByNameToken(
    token: string,
  ): Promise<University | null> {
    const name = token.trim();
    if (name.length < 2) return null;

    const byShort = await this.univRepo.findOne({
      where: { short_name: ILike(name) },
    });
    if (byShort) return byShort;

    return this.univRepo.findOne({
      where: [{ name: ILike(`%${name}%`) }, { short_name: ILike(`%${name}%`) }],
    });
  }

  private async findUniversityByEntities(
    entities: ChatEntities,
    msg: string,
  ): Promise<University | null> {
    const msgLower = msg.toLowerCase();

    if (entities.university_name) {
      const tokens = entities.university_name
        .split(/[,;/]/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 2);
      for (const token of tokens) {
        const found = await this.resolveUniversityByNameToken(token);
        if (found) return found;
      }
    }

    const acronym = extractParentheticalAcronym(msg);
    if (acronym) {
      const byAcronym = await this.resolveUniversityByNameToken(acronym);
      if (byAcronym) return byAcronym;
    }

    const all = await this.univRepo.find();
    const byShortInMsg = [...all]
      .filter(
        (u) => u.short_name && msgLower.includes(u.short_name.toLowerCase()),
      )
      .sort(
        (a, b) => (b.short_name?.length ?? 0) - (a.short_name?.length ?? 0),
      );
    if (byShortInMsg[0]) return byShortInMsg[0];

    const explicit = extractExplicitUniversityFromMessage(msg);
    if (explicit) {
      const byExplicit = await this.resolveUniversityByNameToken(explicit);
      if (byExplicit) return byExplicit;
    }

    return (
      all.find((u) => {
        const name = u.name?.toLowerCase();
        return name && name.length >= 8 && msgLower.includes(name);
      }) ?? null
    );
  }

  /**
   * Tìm 1 ngành theo `entities.major` (ILIKE), fallback loop msg.includes().
   * Dùng cho handleMajorQuery + handleCareerQuery.
   */
  private formatMajorClassification(major: Major): string {
    const assignments = major.groupAssignments ?? [];
    const groupNames = assignments
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
      .map((a) => a.group?.group_name)
      .filter((name): name is string => Boolean(name));
    const groups =
      groupNames.length > 0
        ? [...new Set(groupNames)]
        : [major.field_group || 'Khác'];
    const tagPreview = (major.tags || []).slice(0, 5);
    const lines = [`• Nhóm ngành: ${groups.join(', ')}`];
    if (tagPreview.length > 0) {
      lines.push(`• Tags: ${tagPreview.join(', ')}`);
    }
    return lines.join('\n');
  }

  private async findMajorByEntities(
    entities: ChatEntities,
    msg: string,
  ): Promise<Major | null> {
    const msgLower = msg.toLowerCase();
    const withGroups = await this.majorRepo.find({
      relations: ['groupAssignments', 'groupAssignments.group'],
    });

    for (const m of withGroups) {
      const tagHit = (m.tags || []).find((t) =>
        msgLower.includes(t.toLowerCase()),
      );
      if (tagHit) return m;
    }

    const searchTerms = [entities.major, resolveMajorSearchTerm(msg)].filter(
      (t): t is string => !!t?.trim(),
    );

    for (const term of searchTerms) {
      const found = await this.majorRepo
        .createQueryBuilder('m')
        .leftJoinAndSelect('m.groupAssignments', 'ga')
        .leftJoinAndSelect('ga.group', 'g')
        .where(majorTagSearchWhere('m'), { mq: `%${term}%` })
        .getOne();
      if (found) return found;
    }

    const byNameInMsg = [...withGroups]
      .filter((m) => {
        const name = m.name?.toLowerCase();
        return name && name.length >= 6 && msgLower.includes(name);
      })
      .sort((a, b) => (b.name?.length ?? 0) - (a.name?.length ?? 0));
    if (byNameInMsg[0]) return byNameInMsg[0];

    return (
      withGroups.find(
        (m) =>
          msg.includes(m.name.toLowerCase()) ||
          (m.code && msg.includes(m.code.toLowerCase())),
      ) ?? null
    );
  }

  private async handleCutoffQuery(
    entities: ChatEntities,
    msg: string,
  ): Promise<string> {
    const mentioned = await this.findUniversityByEntities(entities, msg);

    if (!mentioned) {
      return `Để tra điểm chuẩn, bạn thử hỏi cụ thể, ví dụ:\n• "Điểm chuẩn Bách Khoa Hà Nội năm 2024"\n• "Điểm chuẩn ngành CNTT trường FPT"\n\nHoặc vào trang chi tiết trường để lọc theo năm, ngành và phương thức xét tuyển.`;
    }

    // Filter theo year/major nếu entity có; nếu không, lấy 6 cutoff gần nhất.
    const qb = this.cutoffRepo
      .createQueryBuilder('cs')
      .innerJoin('cs.universityMajor', 'um')
      .innerJoin('um.university', 'u')
      .innerJoin('um.major', 'm')
      .where('u.id = :id', { id: mentioned.id });

    if (entities.year) {
      qb.andWhere('cs.year = :year', { year: entities.year });
    }
    const majorFilter =
      resolveMajorSearchTerm(msg) ??
      extractMajorFragment(msg) ??
      entities.major;
    if (majorFilter) {
      qb.andWhere(majorTagSearchWhere('m'), {
        mq: `%${majorFilter}%`,
      });
    }
    if (entities.method_code) {
      const methodLabel = await this.admissionMethods.resolveLabel(
        entities.method_code,
      );
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
      .map(
        (c) =>
          `• Năm ${c.year} — tổ hợp ${c.subject_combination || 'chưa rõ'}: ${c.score} điểm (${c.admission_method || 'THPT Quốc gia'})`,
      )
      .join('\n');
    const methodLabel = entities.method_code
      ? await this.admissionMethods.resolveLabel(entities.method_code)
      : null;
    return `Điểm chuẩn ${mentioned.name}${entities.year ? ` năm ${entities.year}` : ' các năm gần đây'}${majorFilter ? ` — ngành ${majorFilter}` : ''}${methodLabel ? ` (${methodLabel})` : ''}:\n${lines}\n\n${CHAT_DISCLAIMER_CUTOFF}`;
  }

  /**
   * Liệt kê ngành/chương trình của một trường từ `university_majors` (không qua LLM).
   */
  private async formatUniversityMajorsList(
    uni: University,
  ): Promise<string | null> {
    const links = await this.uniMajorRepo
      .createQueryBuilder('um')
      .innerJoinAndSelect('um.major', 'm')
      .where('um.university_id = :uid', { uid: uni.id })
      .orderBy('m.name', 'ASC')
      .addOrderBy('um.id', 'ASC')
      .getMany();

    if (links.length === 0) return null;

    const byNormalizedKey = new Map<string, string>();
    for (const um of links) {
      const name = um.major?.name?.trim();
      if (!name) continue;
      const program = um.training_program?.trim();
      const label =
        program && program !== name && !name.includes(program)
          ? `${name} (${program})`
          : name;
      const key = label.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
      if (!byNormalizedKey.has(key)) byNormalizedKey.set(key, label);
    }

    const sorted = [...byNormalizedKey.values()].sort((a, b) =>
      a.localeCompare(b, 'vi'),
    );
    const lines = sorted.map((label, i) => `${i + 1}. ${label}`).join('\n');

    return (
      `${DB_MAJOR_LIST_PREFIX} ${uni.name} (${uni.short_name}) — ${sorted.length} chương trình trong dữ liệu:\n\n` +
      `${lines}\n\n` +
      `Bạn có thể xem điểm chuẩn từng ngành ở trang chi tiết trường, hoặc hỏi: "Điểm chuẩn ${uni.short_name} ngành … năm 2024".`
    );
  }

  private async handleUniversityQuery(
    entities: ChatEntities,
    msg: string,
  ): Promise<string> {
    const mentioned = await this.findUniversityByEntities(entities, msg);
    const wantsPrograms = asksUniversityOrPrograms(msg);

    if (wantsPrograms) {
      if (!mentioned) {
        return (
          'Để liệt kê ngành/chương trình, bạn cho mình biết tên hoặc mã trường ' +
          '(ví dụ USTH, HUST, NEU), hoặc hỏi tiếp sau khi đã nói rõ trường ở câu trước.'
        );
      }
      const list = await this.formatUniversityMajorsList(mentioned);
      if (list) return list;
      return (
        `Mình chưa có danh sách ngành/chương trình cho ${mentioned.name} (${mentioned.short_name}).\n\n` +
        `Bạn thử lại sau hoặc xem trang chi tiết trường khi dữ liệu được cập nhật.`
      );
    }

    if (mentioned) {
      const budgetText =
        mentioned.tuition_fee_min && mentioned.tuition_fee_max
          ? `${(mentioned.tuition_fee_min / 1_000_000).toFixed(0)}-${(mentioned.tuition_fee_max / 1_000_000).toFixed(0)} triệu/năm`
          : 'Chưa cập nhật';

      return `${mentioned.name} (${mentioned.short_name})\n• Địa điểm: ${mentioned.location}\n• Loại hình: ${this.translateType(mentioned.type)}\n• Học phí tham khảo: ${budgetText}\n• Website: ${mentioned.website || 'chưa có'}\n\n${mentioned.description || 'Mô tả chi tiết đang được cập nhật.'}\n\nBạn có thể mở trang chi tiết trường để xem đủ ngành đào tạo và bảng điểm chuẩn.`;
    }

    // Không có tên trường cụ thể → lọc theo location nếu có, không thì top 5
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

  private async handleMajorQuery(
    entities: ChatEntities,
    msg: string,
  ): Promise<string> {
    if (asksUniversityOrPrograms(msg)) {
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
    const grouped = majors.reduce((acc: Record<string, string[]>, m) => {
      const primary =
        m.groupAssignments?.find((a) => a.is_primary)?.group?.group_name ??
        m.field_group ??
        'Khác';
      if (!acc[primary]) acc[primary] = [];
      acc[primary].push(m.name);
      return acc;
    }, {});

    const groupLines = Object.entries(grouped)
      .map(([g, names]) => `• ${g}: ${names.slice(0, 3).join(', ')}`)
      .join('\n');

    return `Mình có nhiều ngành theo nhóm, ví dụ:\n${groupLines}\n\nBạn quan tâm ngành nào? Hỏi tên ngành hoặc lĩnh vực (CNTT, Y, Kinh tế…) để mình tra cụ thể hơn.`;
  }

  private formatTuitionRangeMillion(
    min: number | null | undefined,
    max: number | null | undefined,
  ): string {
    if (min && max) {
      return `${(min / 1_000_000).toFixed(0)}–${(max / 1_000_000).toFixed(0)} triệu/năm`;
    }
    return 'chưa có trong dữ liệu';
  }

  private async resolveProgramTuition(
    universityId: number,
    majorFilter: string | null,
  ): Promise<string | null> {
    if (!majorFilter?.trim()) return null;
    const link = await this.uniMajorRepo
      .createQueryBuilder('um')
      .innerJoinAndSelect('um.major', 'm')
      .where('um.university_id = :uid', { uid: universityId })
      .andWhere(majorTagSearchWhere('m'), {
        mq: `%${majorFilter}%`,
      })
      .orderBy('um.tuition_fee', 'DESC', 'NULLS LAST')
      .getOne();
    if (!link?.tuition_fee) return null;
    return `~${(link.tuition_fee / 1_000_000).toFixed(0)} triệu/năm (ngành ${link.major.name})`;
  }

  private async handleCompareTuitionFollowUp(
    sessionContext: ChatSessionContext,
    entities: ChatEntities,
    msg: string,
  ): Promise<string | null> {
    if (!looksLikeCompareTuitionFollowUp(msg, sessionContext)) return null;

    const compared = sessionContext.last_compared_universities ?? [];
    const universities: University[] = [];
    const seen = new Set<number>();
    for (const name of compared) {
      const u = await this.findUniversityByEntities(
        { ...entities, university_name: name },
        msg,
      );
      if (u && !seen.has(u.id)) {
        seen.add(u.id);
        universities.push(u);
      }
    }
    if (universities.length < 2) return null;

    const majorFilter =
      entities.major ??
      sessionContext.last_major ??
      resolveMajorSearchTerm(msg) ??
      extractMajorFragment(msg);

    const blocks: string[] = [];
    let cheapest: University | null = null;
    let cheapestMin = Number.POSITIVE_INFINITY;

    for (const u of universities) {
      const programFee = await this.resolveProgramTuition(u.id, majorFilter);
      const rangeFee = this.formatTuitionRangeMillion(
        u.tuition_fee_min,
        u.tuition_fee_max,
      );
      const fee = programFee ?? rangeFee;
      blocks.push(`${u.short_name || u.name}: ${fee}`);
      const minVal = u.tuition_fee_min ?? Number.POSITIVE_INFINITY;
      if (minVal < cheapestMin) {
        cheapestMin = minVal;
        cheapest = u;
      }
    }

    const majorNote = majorFilter ? ` — ngành ${majorFilter}` : '';
    const cheapestNote = cheapest
      ? `\n\nTheo mức học phí thấp nhất trong dữ liệu, ${cheapest.short_name || cheapest.name} có học phí tham khảo thấp hơn trong nhóm vừa so sánh.`
      : '';

    return (
      `So sánh học phí${majorNote} giữa ${universities.map((u) => u.short_name || u.name).join(', ')}:\n\n` +
      `${blocks.join('\n')}${cheapestNote}\n\n${CHAT_DISCLAIMER_TUITION}`
    );
  }

  private async handleTuitionQuery(
    entities: ChatEntities,
    msg = '',
    sessionContext: ChatSessionContext = parseSessionContext(null),
  ): Promise<string> {
    const compareFollowUp = await this.handleCompareTuitionFollowUp(
      sessionContext,
      entities,
      msg,
    );
    if (compareFollowUp) return compareFollowUp;

    const mentioned = await this.findUniversityByEntities(entities, msg);
    if (mentioned) {
      const fee =
        mentioned.tuition_fee_min && mentioned.tuition_fee_max
          ? `${(mentioned.tuition_fee_min / 1_000_000).toFixed(0)}–${(mentioned.tuition_fee_max / 1_000_000).toFixed(0)} triệu/năm`
          : 'chưa có trong dữ liệu';
      return `Học phí ${mentioned.name} (${mentioned.short_name}): ${fee}.\n\n${CHAT_DISCLAIMER_TUITION}`;
    }

    // Build query có WHERE theo location + filter major qua join university_majors
    const qb = this.univRepo
      .createQueryBuilder('u')
      .orderBy('u.tuition_fee_min', 'ASC');

    if (entities.location) {
      qb.andWhere('u.location = :loc', { loc: entities.location });
    }
    if (entities.major) {
      qb.innerJoin('u.universityMajors', 'um')
        .innerJoin('um.major', 'm')
        .andWhere(majorTagSearchWhere('m'), {
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
      .map(
        (u) =>
          `• ${u.short_name} (${u.location}): ${u.tuition_fee_min ? (u.tuition_fee_min / 1_000_000).toFixed(0) + '–' + (u.tuition_fee_max / 1_000_000).toFixed(0) + ' triệu/năm' : 'đang cập nhật'}`,
      )
      .join('\n');
    const title = [
      'Học phí tham khảo',
      entities.major ? `ngành ${entities.major}` : null,
      entities.location ? `tại ${entities.location}` : null,
    ]
      .filter(Boolean)
      .join(' — ');
    return `${title}:\n${list}\n\n${CHAT_DISCLAIMER_TUITION}`;
  }

  private async handleLocationQuery(entities: ChatEntities): Promise<string> {
    // Đồ án scope: chỉ dữ liệu Hà Nội. validLocation đã chuẩn hoá city khác → null.
    if (!entities.location) {
      return `${CHAT_SCOPE_HANOI} Bạn muốn xem danh sách trường, tra ngành hay điểm chuẩn?`;
    }

    const unis = await this.univRepo.find({
      where: { location: entities.location },
    });
    if (unis.length === 0) {
      return `Mình chưa có trường ở ${entities.location} trong dữ liệu — ${CHAT_SCOPE_HANOI}`;
    }
    const list = unis.map((u) => `• ${u.name} (${u.short_name})`).join('\n');
    return `Các trường tại ${entities.location}:\n${list}\n\nBạn muốn xem thêm thông tin trường nào?`;
  }

  /**
   * Ưu tiên Ollama extract (1 lượt cho 6 field); fallback ghép từ regex/keyword cũ.
   * Field nào Ollama trả null thì lấp bằng kết quả regex (an toàn 2 lớp).
   *
   * `context` (Step 4) cho phép LLM kế thừa entity từ turn trước:
   * câu "còn ngành CNTT thì sao" sẽ giữ university_name + year từ context.
   */
  private async buildEntityFallback(msg: string): Promise<ChatEntities> {
    const acronym = extractParentheticalAcronym(msg);
    const majorFromInterest = acronym
      ? null
      : await this.extractInterest(msg).then((s) => s || null);
    return {
      score: this.extractScore(msg),
      subject_group: this.extractSubjectCombination(msg),
      major: majorFromInterest,
      location: this.extractLocation(msg),
      university_name: extractExplicitUniversityFromMessage(msg) ?? acronym,
      year: extractYearFromMessage(msg),
      method_code: await this.extractMethodCode(msg),
    };
  }

  /**
   * Ghép entity từ Ollama (hoặc preloaded từ classify+extract) với regex fallback.
   */
  private async extractEntities(
    msg: string,
    context = '',
    preloadedRaw?: Record<keyof ChatEntities, string | number | null> | null,
  ): Promise<{
    entities: ChatEntities;
    source: 'ollama' | 'rule' | 'merged';
  }> {
    const fallback = await this.buildEntityFallback(msg);

    let raw = preloadedRaw ?? null;
    if (raw === null && this.ollama.isEnabled()) {
      raw = await this.ollama.extractEntities<keyof ChatEntities>(
        msg,
        ENTITY_SCHEMA,
        PROMPT_EXAMPLES.entityExamples.map((ex) => ({
          q: ex.q,
          a: corpusEntitiesToChatEntities(ex.a),
          is_follow_up: ex.is_follow_up,
          context_note: ex.context_note,
        })),
        { context },
      );
    }
    if (!raw) {
      return { entities: fallback, source: 'rule' };
    }

    const ollama: ChatEntities = {
      score: this.validScore(raw.score),
      subject_group: this.validSubjectGroup(raw.subject_group),
      major:
        typeof raw.major === 'string' && raw.major.trim()
          ? raw.major.trim()
          : null,
      location: this.validLocation(raw.location),
      university_name:
        typeof raw.university_name === 'string' && raw.university_name.trim()
          ? raw.university_name.trim()
          : null,
      year: this.validYear(raw.year),
      method_code: await this.validMethodCode(raw.method_code),
    };

    let usedFallback = false;
    const pick = <K extends keyof ChatEntities>(k: K): ChatEntities[K] => {
      if (ollama[k] !== null) return ollama[k];
      if (fallback[k] !== null) usedFallback = true;
      return fallback[k];
    };
    const merged: ChatEntities = {
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

  /** Chấp nhận điểm THPT 0-30 (cho phép 0.5 step). */
  private validScore(v: unknown): number | null {
    const n = parseFloatFromUnknown(v);
    return Number.isFinite(n) && n >= 0 && n <= 30 ? n : null;
  }

  /** Chấp nhận mã tổ hợp A00/A01/B00/C00/C01/D01/D07… (chữ + 2 chữ số). */
  private validSubjectGroup(v: unknown): string | null {
    if (typeof v !== 'string') return null;
    const s = v.trim().toUpperCase();
    return /^[ABCD]\d{2}$/.test(s) ? s : null;
  }

  /**
   * Chuẩn hoá khu vực — đồ án scope CHỈ Hà Nội.
   * Mọi city khác (TP.HCM, Đà Nẵng…) → null (không trong dataset).
   */
  private validLocation(v: unknown): string | null {
    if (typeof v !== 'string') return null;
    const s = v.trim().toLowerCase();
    if (
      ['hà nội', 'ha noi', 'hanoi', 'thủ đô', 'thu do', 'miền bắc'].includes(s)
    )
      return 'Hà Nội';
    return null;
  }

  /** Chấp nhận năm tuyển sinh 2020-2030. */
  private validYear(v: unknown): number | null {
    const n = parseIntFromUnknown(v);
    return Number.isInteger(n) && n >= 2020 && n <= 2030 ? n : null;
  }

  private async getAllowedMethodCodes(): Promise<Set<string>> {
    if (!this.allowedMethodCodes) {
      const rows = await this.admissionMethods.findAll();
      this.allowedMethodCodes = new Set(rows.map((r) => r.method_code));
    }
    return this.allowedMethodCodes;
  }

  /** Chuẩn hoá mã PT theo catalog `admission_methods`. */
  private async validMethodCode(v: unknown): Promise<string | null> {
    if (typeof v !== 'string' || !v.trim()) return null;
    const normalized = v.trim().toUpperCase();
    const allowed = await this.getAllowedMethodCodes();
    for (const code of allowed) {
      if (code.toUpperCase() === normalized) return code;
    }
    return null;
  }

  /**
   * Rule-based: bắt mã PT hoặc cụm tiếng Việt phổ biến khi Ollama không trả field.
   */
  private async extractMethodCode(msg: string): Promise<string | null> {
    const m = msg.match(
      /\b(THPT|HOC_BA|DGNL|DGTD|XTTHANG|HSNL|PV|CCQT|DUHOC|KHAC|USTH_PT[1-4])\b/i,
    );
    if (m) return this.validMethodCode(m[1]);

    const rules: Array<{ keywords: string[]; code: string }> = [
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
      if (this.contains(msg, keywords)) return this.validMethodCode(code);
    }
    return null;
  }

  /** Regex bắt năm 2020-2030 từ câu hỏi — fallback khi Ollama không trả year. */
  private extractYear(msg: string): number | null {
    const m = msg.match(/\b(20[2-3]\d)\b/);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    return n >= 2020 && n <= 2030 ? n : null;
  }

  /**
   * Gợi ý theo điểm số — KHÔNG hard-code danh sách trường.
   * Entities đã được trích ở `processMessage()` (Step 3), chỉ cần consume.
   */
  private async handleScoreQuery(
    entities: ChatEntities,
    msg: string,
  ): Promise<string> {
    const score = entities.score;
    if (score === null) {
      return 'Bạn cho mình biết điểm dự kiến (thang 30) để mình gợi ý trường và ngành phù hợp hơn nhé. Ví dụ: "Em được 24 điểm khối A00 muốn học CNTT".';
    }
    if (score < 0 || score > 30) {
      return `Điểm ${score} nằm ngoài thang 0–30. Bạn nhập lại điểm thi tốt nghiệp THPT giúp mình nhé.`;
    }

    const subjectCombination = entities.subject_group ?? 'A00';
    const location = entities.location;
    const interestPhrase = pickMajorInterestPhrase(msg, entities.major);
    const interest =
      (await this.resolveInterestFromDb(interestPhrase)) || interestPhrase;
    const methodCode = entities.method_code ?? undefined;
    const methodLabel = methodCode
      ? await this.admissionMethods.resolveLabel(methodCode)
      : null;

    let response: Awaited<ReturnType<typeof this.recommendations.recommend>>;
    try {
      response = await this.recommendations.recommend({
        expected_score: score,
        subject_combination: subjectCombination,
        interests: interest,
        preferred_location: location ?? undefined,
        ...(methodCode ? { method_code: methodCode } : {}),
      });
    } catch (err) {
      this.logger.warn(
        `RecommendationsService failed: ${(err as Error).message}`,
      );
      return `Mình tạm thời chưa lấy được gợi ý. Bạn thử lại sau hoặc dùng trang Gợi ý trường/ngành trên menu.`;
    }

    const recs = response.results;
    if (!recs.length) {
      const reasonHint =
        response.meta.emptyReason === 'no_subject_combination'
          ? `\n\nGợi ý: ít ngành có điểm chuẩn tổ hợp ${subjectCombination} với tiêu chí bạn chọn — thử đổi khối hoặc nới rộng ngành quan tâm.`
          : response.meta.emptyReason === 'no_score_match'
            ? `\n\nGợi ý: có ngành khớp khối nhưng điểm dự kiến còn thấp so với điểm chuẩn — bạn có thể nới sở thích hoặc cân nhắc thêm nhóm Reach (cân nhắc).`
            : response.meta.emptyReason === 'no_interest_match'
              ? `\n\nGợi ý: ${CHAT_SCOPE_HANOI} Mình chưa thấy ngành "${interest}" trong dữ liệu trường–ngành hiện có — thử tra cứu tên ngành chính xác hoặc hỏi "ở Hà Nội có trường nào đào tạo ngành … không?".`
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
        const tierLabel = tierLabelChat(r.admissionTier);
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

  private dedupeChatRecommendationItems<
    T extends {
      university?: {
        id?: number | null;
        short_name?: string | null;
        name?: string | null;
      };
      major?: { name?: string | null };
    },
  >(rows: T[]): T[] {
    const seen = new Set<string>();
    const out: T[] = [];
    for (const r of rows) {
      const uniKey = String(
        r.university?.id ??
          r.university?.short_name ??
          r.university?.name ??
          '',
      );
      const majorKey = (r.major?.name ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
      const key = `${uniKey}|${majorKey}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(r);
    }
    return out;
  }

  // ────────────────────────────────────────────────────────────
  // Entity extractors (đơn giản — task sau có thể nâng lên NLP)
  // ────────────────────────────────────────────────────────────

  /** Lấy con số đầu tiên hợp lệ trong khoảng 0–30 từ câu hỏi. */
  private extractScore(msg: string): number | null {
    return extractScoreFromMessage(msg);
  }

  /** Bắt mã tổ hợp môn (A00, A01, B00, C00, C01, D01, D07, …). */
  private extractSubjectCombination(msg: string): string | null {
    const m = msg.match(/\b([abcdABCD]\d{2})\b/);
    return m ? m[1].toUpperCase() : null;
  }

  /**
   * Fallback bắt khu vực khi Ollama down — đồ án scope CHỈ Hà Nội.
   * Mọi city khác → null (không trong dataset).
   */
  private extractLocation(msg: string): string | null {
    if (this.contains(msg, ['hà nội', 'ha noi', 'thủ đô', 'miền bắc']))
      return 'Hà Nội';
    return null;
  }

  /**
   * Bắt sở thích/ngành quan tâm.
   * Thử match tên ngành / tags trong DB trước (không bịa data),
   * fallback sang một vài viết tắt phổ biến.
   */
  private async extractInterest(msg: string): Promise<string> {
    const phrase = pickMajorInterestPhrase(msg, null);
    if (phrase) {
      const fromDb = await this.resolveInterestFromDb(phrase);
      if (fromDb) return fromDb;
    }

    const majors = await this.majorRepo.find();
    for (const m of majors) {
      const name = m.name?.toLowerCase();
      if (name && msg.includes(name)) return m.name;
    }

    if (
      this.contains(msg, [
        'cntt',
        'công nghệ thông tin',
        'cong nghe thong tin',
        ' it ',
      ])
    )
      return 'Công nghệ thông tin';
    if (this.contains(msg, ['kinh tế', 'kinh te'])) return 'Kinh tế';
    if (this.contains(msg, ['y khoa', 'y đa khoa', 'y da khoa', 'bác sĩ']))
      return 'Y khoa';
    if (this.contains(msg, ['luật', 'luat'])) return 'Luật';
    if (
      this.contains(msg, ['sư phạm toán', 'su pham toan']) ||
      (phrase &&
        (phrase.toLowerCase().includes('toán') ||
          phrase.toLowerCase().includes('toan')))
    ) {
      const resolved = phrase ? await this.resolveInterestFromDb(phrase) : null;
      if (resolved) return resolved;
    }
    if (this.contains(msg, ['sư phạm', 'su pham'])) return 'Sư phạm';
    if (this.contains(msg, ['kỹ thuật', 'ky thuat', 'engineer']))
      return 'Kỹ thuật';
    return phrase;
  }

  /** Map cụm ngành người dùng → tên ngành gần nhất trong DB (ILIKE, cụm đầy đủ). */
  private async resolveInterestFromDb(phrase: string): Promise<string | null> {
    const trimmed = phrase.trim();
    if (trimmed.length < 2) return null;

    const found = await this.majorRepo
      .createQueryBuilder('m')
      .where(majorTagSearchWhere('m'), { mq: `%${trimmed}%` })
      .orderBy('LENGTH(m.name)', 'ASC')
      .getOne();

    return found?.name ?? null;
  }

  /** Resolve nhiều trường từ câu hỏi so sánh (mã, biệt danh, entity list). */
  private async findUniversitiesByEntities(
    entities: ChatEntities,
    msg: string,
  ): Promise<University[]> {
    const names = collectUniversityNames(msg, entities.university_name);
    const resolved: University[] = [];
    const seen = new Set<number>();

    for (const name of names) {
      const u = await this.findUniversityByEntities(
        { ...entities, university_name: name },
        msg,
      );
      if (u && !seen.has(u.id)) {
        seen.add(u.id);
        resolved.push(u);
      }
    }

    return resolved;
  }

  private formatUniversityTypeLabel(type: string | null | undefined): string {
    if (type === 'public') return 'Công lập';
    if (type === 'private') return 'Tư thục';
    return type?.trim() || 'chưa rõ';
  }

  /** Resolve trường so sánh từ câu hỏi + session (follow-up "hai trường này"). */
  private async resolveCompareUniversities(
    entities: ChatEntities,
    msg: string,
    sessionContext: ChatSessionContext,
  ): Promise<University[]> {
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
      const u = await this.findUniversityByEntities(
        { ...entities, university_name: name },
        msg,
      );
      if (u && !seen.has(u.id)) {
        seen.add(u.id);
        universities.push(u);
      }
    }
    return universities.slice(0, 4);
  }

  private async collectUniversityAdmissionMethods(
    universityId: number,
  ): Promise<string[]> {
    const rows = await this.cutoffRepo
      .createQueryBuilder('cs')
      .innerJoin('cs.universityMajor', 'um')
      .where('um.university_id = :uid', { uid: universityId })
      .select('DISTINCT cs.admission_method', 'method')
      .orderBy('cs.admission_method', 'ASC')
      .getRawMany<{ method: string }>();
    return rows.map((r) => r.method?.trim()).filter((m): m is string => !!m);
  }

  private async buildUniversityCompareBlock(
    u: University,
    entities: ChatEntities,
    majorFilter: string | null,
    subjectGroup: string | null,
    methodCode: string | null,
  ): Promise<string> {
    const programCount = await this.uniMajorRepo.count({
      where: { university: { id: u.id } },
    });
    const programFee = await this.resolveProgramTuition(u.id, majorFilter);
    const fee =
      programFee ??
      this.formatTuitionRangeMillion(u.tuition_fee_min, u.tuition_fee_max);
    const methods = await this.collectUniversityAdmissionMethods(u.id);
    const methodLabels =
      methods.length > 0
        ? methods.slice(0, 5).join(', ')
        : 'chưa có trong dữ liệu điểm chuẩn';

    let block =
      `${u.name} (${u.short_name || '—'})\n` +
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
      qb.andWhere(majorTagSearchWhere('m'), {
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
      const rangeNote =
        minScore != null && maxScore != null && minScore !== maxScore
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
        .map(
          (c) =>
            `  – ${c.year}: ${c.score} (${c.subject_combination || '—'}, ${c.admission_method || '—'})`,
        )
        .join('\n');
      block += `\n• Điểm chuẩn${filterNote ? ` (${filterNote})` : ''}${rangeNote}:\n${cutoffLines}`;
    } else if (majorFilter || entities.year || subjectGroup || methodCode) {
      block += `\n• Chưa có điểm chuẩn phù hợp bộ lọc hiện tại trong dữ liệu`;
    }

    return block;
  }

  private async handleCompareQuery(
    entities: ChatEntities,
    msg: string,
    sessionContext: ChatSessionContext,
  ): Promise<string> {
    const universities = await this.resolveCompareUniversities(
      entities,
      msg,
      sessionContext,
    );
    const majorFilter =
      resolveMajorSearchTerm(msg) ??
      extractMajorFragment(msg) ??
      entities.major ??
      sessionContext.last_major;
    const subjectGroup =
      entities.subject_group ?? sessionContext.last_subject_group;
    const methodCode = entities.method_code ?? sessionContext.last_method_code;

    if (universities.length >= 2) {
      const blocks: string[] = [];
      for (const u of universities.slice(0, 4)) {
        blocks.push(
          await this.buildUniversityCompareBlock(
            u,
            entities,
            majorFilter,
            subjectGroup,
            methodCode,
          ),
        );
      }

      const majorNote = majorFilter ? ` — ngành ${majorFilter}` : '';
      const yearNote = entities.year ? ` năm ${entities.year}` : '';
      const compareIds = universities.slice(0, 2).map((u) => u.id);
      const deeplink =
        compareIds.length >= 2
          ? `/universities/compare?ids=${compareIds.join(',')}`
          : null;

      return (
        `So sánh ${universities.length} trường${majorNote}${yearNote}:\n\n` +
        `${blocks.join('\n\n')}\n\n` +
        (deeplink
          ? `Xem bảng so sánh chi tiết trên web: ${deeplink} (lọc năm & tổ hợp trực tiếp trên trang).\n\n`
          : '') +
        `Bạn có thể hỏi tiếp: "Hai trường này học phí chênh nhau thế nào?" hoặc "Trường nào dễ đỗ hơn?"\n\n` +
        `${CHAT_DISCLAIMER_CUTOFF}`
      );
    }

    const hint = [
      entities.university_name ? `trường ${entities.university_name}` : null,
      entities.major ? `ngành ${entities.major}` : null,
    ]
      .filter(Boolean)
      .join(' / ');
    return `Để so sánh${hint ? ` ${hint} với lựa chọn khác` : ' hai trường'}, bạn có thể:\n1. Vào Tra cứu trường → chọn So sánh (tối đa 2 trường) → So sánh ngay\n2. Ở trang chi tiết trường → Thêm vào so sánh\n3. Xem điểm chuẩn từng trường theo ngành và năm\n\nVí dụ: "So sánh USTH và HUST về điểm chuẩn CNTT năm 2024 khối A00".`;
  }

  private async handleAdmissionMethodQuery(
    entities: ChatEntities,
    msg: string,
  ): Promise<string> {
    const catalog = await this.admissionMethods.findAll();
    const mentioned = await this.findUniversityByEntities(entities, msg);

    if (entities.method_code && !mentioned) {
      const label = await this.admissionMethods.resolveLabel(
        entities.method_code,
      );
      const desc = catalog.find((c) => c.method_code === entities.method_code);
      const name = label ?? entities.method_code;
      const note = desc?.description?.trim();
      return `Phương thức ${name} (${entities.method_code}):\n${note || 'Mỗi trường có quy định riêng — bạn hỏi thêm tên trường để mình xem PT nào có trong dữ liệu điểm chuẩn.'}\n\n${CHAT_DISCLAIMER_GENERAL}`;
    }

    if (mentioned) {
      const rows = await this.cutoffRepo
        .createQueryBuilder('cs')
        .innerJoin('cs.universityMajor', 'um')
        .where('um.university_id = :uid', { uid: mentioned.id })
        .select('DISTINCT cs.admission_method', 'method')
        .orderBy('cs.admission_method', 'ASC')
        .getRawMany<{ method: string }>();

      const methods = rows
        .map((r) => r.method?.trim())
        .filter((m): m is string => !!m);

      if (methods.length === 0) {
        return `Mình chưa thấy phương thức xét tuyển nào trong dữ liệu điểm chuẩn của ${mentioned.name} (${mentioned.short_name}). Bạn thử hỏi điểm chuẩn theo năm hoặc xem trang chi tiết trường.\n\n${CHAT_DISCLAIMER_GENERAL}`;
      }

      const list = methods.map((m) => `• ${m}`).join('\n');
      const methodHint = entities.method_code
        ? `\n\nBạn đang hỏi về PT ${entities.method_code} — hỏi thêm "điểm chuẩn ... theo ${entities.method_code}" để xem mức điểm.`
        : '';
      return `Theo dữ liệu điểm chuẩn, ${mentioned.name} (${mentioned.short_name}) có các phương thức:\n${list}${methodHint}\n\n${CHAT_DISCLAIMER_CUTOFF}`;
    }

    const list = catalog
      .slice(0, 12)
      .map((m) => `• ${m.method_name} (${m.method_code})`)
      .join('\n');
    return `Các phương thức xét tuyển trong hệ thống:\n${list}\n\nBạn hỏi thêm tên trường (ví dụ NEU, Bách Khoa) để xem trường đó áp dụng PT nào trong dữ liệu điểm chuẩn.\n\n${CHAT_DISCLAIMER_GENERAL}`;
  }

  private handleScholarshipQuery(entities: ChatEntities): string {
    const uni = entities.university_name
      ? ` trường ${entities.university_name}`
      : entities.location
        ? ` tại ${entities.location}`
        : '';
    const major = entities.major ? ` ngành ${entities.major}` : '';
    return `Mình chưa có cơ sở dữ liệu học bổng chi tiết${uni}${major}.\n\nGợi ý:\n• Xem website chính thức của trường (mục Tuyển sinh / Học bổng)\n• Hỏi phòng Công tác sinh viên hoặc cố vấn tuyển sinh\n• Theo dõi thông báo tuyển sinh từ tháng 3–7 hàng năm\n\n${CHAT_DISCLAIMER_GENERAL}`;
  }

  private async handleFacilitiesQuery(
    entities: ChatEntities,
    msg: string,
  ): Promise<string> {
    const mentioned = await this.findUniversityByEntities(entities, msg);
    if (mentioned) {
      const parts = [
        mentioned.address ? `Địa chỉ: ${mentioned.address}` : null,
        mentioned.website ? `Website: ${mentioned.website}` : null,
        mentioned.description
          ? `Giới thiệu: ${mentioned.description.slice(0, 280)}${mentioned.description.length > 280 ? '…' : ''}`
          : null,
      ].filter(Boolean);
      const body =
        parts.length > 0
          ? parts.join('\n')
          : 'Mình chưa có mô tả cơ sở vật chất chi tiết trong dữ liệu.';
      return `Thông tin tham khảo — ${mentioned.name} (${mentioned.short_name}):\n${body}\n\nKý túc xá / phòng lab: hệ thống chưa lưu chi tiết — bạn nên xem website trường hoặc hỏi cố vấn tuyển sinh.\n\n${CHAT_DISCLAIMER_GENERAL}`;
    }

    if (entities.location) {
      const unis = await this.univRepo.find({
        where: { location: entities.location },
        take: 6,
      });
      if (unis.length > 0) {
        const list = unis
          .map(
            (u) =>
              `• ${u.short_name}: ${u.address?.slice(0, 60) ?? 'địa chỉ đang cập nhật'}`,
          )
          .join('\n');
        return `Một số trường tại ${entities.location}:\n${list}\n\nHỏi tên trường cụ thể để xem địa chỉ/website; thông tin KTX chưa có trong dữ liệu.\n\n${CHAT_DISCLAIMER_GENERAL}`;
      }
    }

    return `Mình có thể tra địa chỉ / website nếu bạn nêu tên trường. Thông tin ký túc xá, lab, thư viện chưa có trong cơ sở dữ liệu — vui lòng xem website trường.\n\n${CHAT_DISCLAIMER_GENERAL}`;
  }

  private async handleCareerQuery(
    entities: ChatEntities,
    msg: string,
  ): Promise<string> {
    const mentioned = await this.findMajorByEntities(entities, msg);

    if (mentioned && mentioned.career_orientation) {
      return `Cơ hội nghề nghiệp — ngành ${mentioned.name}:\n${mentioned.career_orientation}\n\nKỹ năng nên trang bị: ${mentioned.required_skills || 'đang cập nhật'}\n\n${CHAT_DISCLAIMER_GENERAL}`;
    }
    if (mentioned) {
      return `Mình chưa có mô tả nghề nghiệp chi tiết cho ngành ${mentioned.name}. Bạn xem các trường đào tạo ngành này ở trang Tra cứu ngành.`;
    }

    return `Để tư vấn việc làm sau khi ra trường, bạn cho mình biết ngành cụ thể nhé — ví dụ CNTT, Kinh doanh quốc tế, Y khoa… Bạn đang quan tâm ngành nào?`;
  }

  private getGreeting(): string {
    return `Chào bạn! Mình là trợ lý tư vấn tuyển sinh đại học.\n\nMình có thể giúp bạn:\n• Tra cứu trường, ngành, học phí\n• Xem điểm chuẩn theo năm và phương thức xét tuyển\n• Gợi ý trường/ngành theo điểm và sở thích\n\n${CHAT_SCOPE_HANOI}\n\nBạn muốn hỏi gì trước?`;
  }

  private getHelp(): string {
    return `Bạn có thể hỏi tự nhiên, ví dụ:\n• "Điểm chuẩn Bách Khoa Hà Nội năm 2024"\n• "Học phí ngành CNTT ở Hà Nội"\n• "Em 24 điểm khối A00 muốn học CNTT thì nên chọn trường nào?"\n• "Trường nào ở Hà Nội đào tạo Kinh tế?"\n• "Ngành Marketing ra trường làm gì?"\n\n${CHAT_SCOPE_HANOI}`;
  }

  private getDefaultAnswer(): string {
    return `Mình chưa chắc bạn đang hỏi về chủ đề nào. Bạn thử hỏi rõ hơn về:\n• Trường đại học (thông tin, học phí)\n• Ngành học và việc làm sau tốt nghiệp\n• Điểm chuẩn theo trường, năm, tổ hợp\n• Gợi ý chọn trường theo điểm và sở thích\n\n${CHAT_DISCLAIMER_GENERAL}`;
  }

  /**
   * Làm mềm văn phong cho UI chat:
   * - bỏ markdown markers như , `
   * - tránh lộ nguồn kỹ thuật (backend/DB/PostgreSQL)
   */
  private humanizeAnswer(raw: string): string {
    return raw
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/dataset/gi, 'dữ liệu')
      .replace(/đồ án/gi, 'ứng dụng')
      .replace(/\bhệ thống\b/gi, 'mình')
      .replace(/\btôi\b/gi, 'mình')
      .replace(/top gợi ý từ dữ liệu hệ thống/gi, 'một số gợi ý phù hợp')
      .replace(/số liệu lấy từ điểm chuẩn 2023–2025 trong postgresql\.?/gi, '')
      .replace(
        /đây là dữ liệu tham khảo từ hệ thống\.?/gi,
        'Bạn có thể tham khảo để cân nhắc thêm.',
      )
      .replace(/backend|postgresql|database nội bộ|api nội bộ/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /** Danh sách tối đa 5 cuộc hội thoại của user (mới nhất trước). */
  async listUserSessions(userId: number) {
    const sessions = await this.sessionRepo.find({
      where: { user: { id: userId } },
      order: { updated_at: 'DESC', id: 'DESC' },
      take: MAX_CHAT_SESSIONS_PER_USER,
    });

    const summaries: Array<{
      session_id: string;
      title: string;
      updated_at: Date;
      preview: string | null;
    }> = [];

    for (const s of sessions) {
      if (!s.session_key) continue;
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

  /** Mỗi phần tử = 1 lượt (question + answer) trong một session thuộc user. */
  async getChatHistory(userId: number, sessionId: string) {
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
    const turns: Array<{
      id: number;
      question: string;
      answer: string;
      session_id: string | null;
      created_at: Date;
      compare_university_ids: number[] | null;
    }> = [];

    const byTimeAsc = [...messages].reverse();
    let pendingUser: ChatMessage | null = null;

    for (const msg of byTimeAsc) {
      if (msg.sender === 'user') {
        pendingUser = msg;
      } else if (msg.sender === 'assistant' && pendingUser) {
        const rawIds = msg.metadata?.compare_university_ids;
        const compareUniversityIds = Array.isArray(rawIds)
          ? rawIds.filter(
              (id): id is number => typeof id === 'number' && id > 0,
            )
          : [];
        turns.push({
          id: msg.id,
          question: pendingUser.message,
          answer: msg.message,
          session_id: msg.chatSession.session_key,
          created_at: pendingUser.created_at,
          compare_university_ids:
            compareUniversityIds.length >= 2 ? compareUniversityIds : null,
        });
        pendingUser = null;
      }
    }

    return turns.reverse().slice(0, 50);
  }

  private contains(text: string, keywords: string[]): boolean {
    return keywords.some((kw) => text.includes(kw));
  }

  private translateType(type: string): string {
    const map: Record<string, string> = {
      public: 'Công lập',
      private: 'Tư thục',
      international: 'Quốc tế',
    };
    return map[type] || type;
  }
}
