import type { ChatEntities, ChatIntent } from './chatbot.types';
export type ChatbotFollowUpE2eCase = {
    id: string;
    q: string;
    intent: ChatIntent;
    entities: Partial<ChatEntities>;
    context_note: string;
    handler: string;
};
export declare const CHATBOT_FOLLOW_UP_E2E_CASES: ChatbotFollowUpE2eCase[];
