import type { ChatIntent } from './chatbot.types';
export type ChatbotE2eCase = {
    id: string;
    q: string;
    intent: ChatIntent;
    ollama_conflict?: ChatIntent;
};
export declare const CHATBOT_E2E_CASES: ChatbotE2eCase[];
