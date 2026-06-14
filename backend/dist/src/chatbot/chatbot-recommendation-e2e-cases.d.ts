import type { ChatIntent } from './chatbot.types';
export type ChatbotRecommendationE2eCase = {
    id: string;
    q: string;
    intent: ChatIntent;
    expectedInterestPhrase: string;
    expectedScore: number;
    expectedSubjectGroup: string | null;
    ollama_major_conflict?: string;
};
export declare const CHATBOT_RECOMMENDATION_E2E_CASES: ChatbotRecommendationE2eCase[];
