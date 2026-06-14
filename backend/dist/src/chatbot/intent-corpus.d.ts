import { DB_MAJOR_LIST_PREFIX } from './chatbot-copy';
import { type ChatEntities, type ChatIntent, type IntentHandlerConfig } from './chatbot.types';
export { DB_MAJOR_LIST_PREFIX };
import { CORPUS_ROW_COUNT } from './intent-corpus.generated';
export { CORPUS_ROW_COUNT };
export declare const INTENT_CLASSIFY_DESCRIPTIONS: Record<ChatIntent, string>;
export declare const INTENT_EXAMPLES: Array<{
    q: string;
    intent: ChatIntent;
    is_follow_up: boolean;
    context_note: string | null;
}>;
export declare const ENTITY_EXAMPLES: Array<{
    q: string;
    a: Record<string, string | number | null>;
    is_follow_up: boolean;
    context_note: string | null;
}>;
export declare const COMBINED_EXAMPLES: Array<{
    q: string;
    intent: ChatIntent;
    confidence: number;
    entities: Record<string, string | number | null>;
    is_follow_up: boolean;
    context_note: string | null;
}>;
export declare const INTENT_HANDLER_MATRIX: Record<ChatIntent, IntentHandlerConfig>;
export declare function isStructuredDbAnswer(ruleAnswer: string): boolean;
export declare function shouldSkipOllamaRewrite(ruleAnswer: string, intent: ChatIntent): boolean;
export declare const PROMPT_EDGE_CASE_EXAMPLES: Array<{
    q: string;
    intent: ChatIntent;
    is_follow_up: boolean;
    context_note: string | null;
}>;
export declare const PROMPT_COMBINED_EDGE_CASES: Array<{
    q: string;
    intent: ChatIntent;
    confidence: number;
    entities: Record<string, string | number | null>;
    is_follow_up: boolean;
    context_note: string | null;
}>;
export declare function selectPromptExamples(): {
    intentExamples: Array<{
        q: string;
        intent: ChatIntent;
        is_follow_up: boolean;
        context_note: string | null;
    }>;
    entityExamples: Array<{
        q: string;
        a: Record<string, string | number | null>;
        is_follow_up: boolean;
        context_note: string | null;
    }>;
    combinedExamples: Array<{
        q: string;
        intent: ChatIntent;
        confidence: number;
        entities: Record<string, string | number | null>;
        is_follow_up: boolean;
        context_note: string | null;
    }>;
};
export declare function corpusEntitiesToChatEntities(raw: Record<string, string | number | null>): ChatEntities;
