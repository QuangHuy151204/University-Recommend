import { ConfigService } from '@nestjs/config';
export interface OllamaGenerateOptions {
    prompt: string;
    system?: string;
    model?: string;
    timeoutMs?: number;
    options?: Record<string, unknown>;
}
export declare class OllamaService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    isEnabled(): boolean;
    getBaseUrl(): string;
    getModel(): string;
    getTimeoutMs(): number;
    classifyIntent<T extends string>(message: string, intents: readonly T[], opts?: {
        timeoutMs?: number;
        model?: string;
        context?: string;
        examples?: Array<{
            q: string;
            intent: T;
            is_follow_up?: boolean;
            context_note?: string | null;
        }>;
        intentAliases?: Record<string, T>;
        intentDescriptions?: Record<string, string>;
    }): Promise<{
        intent: T;
        confidence: number;
    } | null>;
    extractEntities<K extends string>(message: string, schema: Record<K, {
        description: string;
        type: 'number' | 'string';
    }>, examples?: Array<{
        q: string;
        a: Record<K, string | number | null>;
        is_follow_up?: boolean;
        context_note?: string | null;
    }>, opts?: {
        timeoutMs?: number;
        model?: string;
        context?: string;
    }): Promise<Record<K, string | number | null> | null>;
    classifyAndExtract<T extends string, K extends string>(message: string, intents: readonly T[], schema: Record<K, {
        description: string;
        type: 'number' | 'string';
    }>, opts?: {
        timeoutMs?: number;
        model?: string;
        context?: string;
        intentExamples?: Array<{
            q: string;
            intent: T;
            is_follow_up?: boolean;
            context_note?: string | null;
        }>;
        entityExamples?: Array<{
            q: string;
            a: Record<K, string | number | null>;
            is_follow_up?: boolean;
            context_note?: string | null;
        }>;
        combinedExamples?: Array<{
            q: string;
            intent: T;
            confidence: number;
            entities: Record<K, string | number | null>;
            is_follow_up?: boolean;
            context_note?: string | null;
        }>;
        intentAliases?: Record<string, T>;
        intentDescriptions?: Record<string, string>;
    }): Promise<{
        intent: T;
        confidence: number;
        entities: Record<K, string | number | null>;
    } | null>;
    private parseJsonObject;
    generate(opts: OllamaGenerateOptions): Promise<string | null>;
    ping(): Promise<boolean>;
}
