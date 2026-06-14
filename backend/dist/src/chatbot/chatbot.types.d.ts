export declare const CHAT_INTENTS: readonly ["recommendation_by_score", "ask_cutoff_score", "search_university", "search_major", "ask_tuition_fee", "ask_location", "compare_universities", "ask_career", "ask_admission_method", "ask_scholarship", "ask_facilities", "greeting", "help", "unknown"];
export type ChatIntent = (typeof CHAT_INTENTS)[number];
export interface ChatEntities {
    score: number | null;
    subject_group: string | null;
    major: string | null;
    location: string | null;
    university_name: string | null;
    year: number | null;
    method_code: string | null;
}
export type IntentHandlerName = 'handleCutoffQuery' | 'handleUniversityQuery' | 'handleMajorQuery' | 'handleTuitionQuery' | 'handleLocationQuery' | 'handleScoreQuery' | 'handleCompareQuery' | 'handleCareerQuery' | 'handleAdmissionMethodQuery' | 'handleScholarshipQuery' | 'handleFacilitiesQuery' | 'getGreeting' | 'getHelp' | 'getDefaultAnswer';
export interface IntentHandlerConfig {
    handler: IntentHandlerName;
    needsEntities: boolean;
    skipOllamaRewrite: boolean;
    skipRewriteWhenStructured: boolean;
}
