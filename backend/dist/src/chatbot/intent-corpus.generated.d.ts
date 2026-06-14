export declare const CORPUS_ROW_COUNT = 428;
export declare const INTENT_EXAMPLES: Array<{
    q: string;
    intent: string;
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
    intent: string;
    confidence: number;
    entities: Record<string, string | number | null>;
    is_follow_up: boolean;
    context_note: string | null;
}>;
