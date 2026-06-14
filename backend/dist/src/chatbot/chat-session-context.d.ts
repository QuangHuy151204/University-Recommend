import type { ChatEntities, ChatIntent } from './chatbot.types';
export interface ChatSessionContext {
    last_intent: ChatIntent | null;
    last_university: string | null;
    last_major: string | null;
    last_score: number | null;
    last_subject_group: string | null;
    last_method_code: string | null;
    last_location: string | null;
    last_year: number | null;
    last_compared_universities: string[] | null;
}
export declare function emptySessionContext(): ChatSessionContext;
export declare function parseSessionContext(raw: Record<string, unknown> | null | undefined): ChatSessionContext;
export declare function mergeEntitiesWithSession(entities: ChatEntities, session: ChatSessionContext, msg?: string): ChatEntities;
export declare function buildSessionContextHint(session: ChatSessionContext): string;
export declare function updateSessionContext(prev: ChatSessionContext, intent: ChatIntent, entities: ChatEntities, comparedUniversities?: string[] | null): ChatSessionContext;
export declare function sessionContextToRecord(ctx: ChatSessionContext): Record<string, unknown>;
export declare function parseCorpusContextNote(note: string | null | undefined): ChatSessionContext;
