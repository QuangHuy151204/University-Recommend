import type { ChatIntent } from './chatbot.types';
import type { ChatEntities } from './chatbot.types';
export declare const GUARDRAIL_INTENT_ALIASES: Record<string, ChatIntent>;
export declare function shouldPreferRuleOverOllamaIntent(ruleIntent: ChatIntent, ollamaIntent: ChatIntent, msg: string): boolean;
export declare function isLikelyFalseUniversityName(name: string, msg: string): boolean;
export declare function sanitizeExtractedEntities(entities: ChatEntities, msg: string): ChatEntities;
export interface EntityDbValidator {
    universityExists(name: string): Promise<boolean>;
    majorExists(term: string): Promise<boolean>;
}
export declare function validateEntitiesAgainstDb(entities: ChatEntities, msg: string, db: EntityDbValidator): Promise<ChatEntities>;
export declare function isCutoffMissingAnswer(answer: string): boolean;
