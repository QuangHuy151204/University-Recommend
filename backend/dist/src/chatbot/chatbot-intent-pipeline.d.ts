import { type ChatSessionContext } from './chat-session-context';
import type { ChatIntent } from './chatbot.types';
export declare const INTENT_CONFIDENCE_THRESHOLD = 0.5;
export type IntentPipelineResult = {
    intent: ChatIntent;
    source: 'ollama' | 'rule';
    ruleIntent: ChatIntent;
    ollamaIntent: ChatIntent | null;
    ollamaAccepted: boolean;
    confidence?: number;
};
export declare function resolveIntentPipeline(msg: string, ollamaIntent: ChatIntent | null, ollamaConfidence: number | null | undefined, sessionContext?: ChatSessionContext): IntentPipelineResult;
