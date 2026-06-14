// Shared TypeScript types matching backend NestJS DTOs/entities.
// Keep field names in snake_case to mirror the JSON returned by /api.

export type UserRole = 'student' | 'admin';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    email_verified?: boolean;
}

export interface AuthResponse {
    access_token: string;
    user: AuthUser;
}

export interface RegisterResponse {
    message: string;
    email: string;
}

export interface MessageResponse {
    message: string;
}

export interface StudentProfile {
    id: number;
    expected_score: number | null;
    subject_combination: string | null;
    interests: string | null;
    preferred_location: string | null;
    budget_range: 'low' | 'medium' | 'high' | null;
    budget_max_yearly?: number | null;
    career_goal: string | null;
    preferred_method_code?: string | null;
    created_at: string;
    updated_at: string;
}

export interface MeResponse extends AuthUser {
    created_at: string;
    updated_at: string;
    profile?: StudentProfile | null;
}

export interface UpdateProfilePayload {
    expected_score?: number;
    subject_combination?: string;
    interests?: string;
    preferred_location?: string;
    budget_range?: 'low' | 'medium' | 'high';
    budget_max_yearly?: number;
    career_goal?: string;
    preferred_method_code?: string;
}

export type UniversityType = 'public' | 'private' | 'international';

export interface University {
    id: number;
    name: string;
    short_name: string | null;
    type: UniversityType | string;
    location: string | null;
    address: string | null;
    website: string | null;
    description: string | null;
    tuition_fee_min: number | null;
    tuition_fee_max: number | null;
    /** Học phí/tín chỉ (text); chỉ dùng trang chi tiết trường. */
    tuition_per_credit_note: string | null;
    logo_url: string | null;
    established_year: number | null;
    source_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Major {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    career_orientation: string | null;
    required_skills: string | null;
    field_group: string | null;
    tags: string[];
    groups?: Array<{ group_id: string; group_name: string; is_primary: boolean }>;
    created_at: string;
    updated_at: string;
}

export interface UniversityMajor {
    id: number;
    university: University;
    major: Major;
    training_program: string | null;
    duration: number | null;
    tuition_fee: number | null;
    quota: number | null;
    admission_methods: string | null;
    created_at: string;
}

export interface AdmissionMethod {
    id: number;
    method_code: string;
    method_name: string;
    description: string | null;
    created_at: string;
}

export interface CutoffScore {
    id: number;
    year: number;
    subject_combination: string | null;
    admission_method: string | null;
    score: number;
    note: string | null;
    universityMajor?: UniversityMajor;
}

export interface Paginated<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    group?: { name: string; slug: string };
}

export interface MajorGroupSummary {
    name: string;
    slug: string;
    count: number;
}

export interface MajorGroupListResponse {
    data: MajorGroupSummary[];
    total: number;
}

// Response của GET /api/universities/:id — đã có quan hệ universityMajors + cutoffScores
export interface UniversityDetail extends University {
    universityMajors?: Array<
        Omit<UniversityMajor, 'university'> & {
            major: Major;
            cutoffScores?: CutoffScore[];
        }
    >;
}

// Response của GET /api/majors/:id
export interface MajorDetail extends Major {
    universityMajors?: Array<
        Omit<UniversityMajor, 'major'> & { university: University }
    >;
}

// 1 item trong response của POST /api/recommendations
export type AdmissionTier = 'safety' | 'match' | 'reach';

export type RecommendEmptyReason =
    | 'no_subject_combination'
    | 'no_score_match'
    | 'no_data';

export interface RecommendFiltersApplied {
    subject_combination: string | null;
    method_code: string;
    method_label: string | null;
    interests: string[] | null;
    preferred_location: string | null;
    budget_range: string | null;
    budget_max_yearly: number | null;
}

export interface RecommendationItem {
    id: number;
    university: {
        id: number;
        name: string;
        short_name: string | null;
        location: string | null;
        type: string;
        tuition_fee_min: number | null;
        tuition_fee_max: number | null;
        website: string | null;
    };
    major: {
        id: number;
        name: string;
        code: string | null;
        field_group: string | null;
        tags?: string[];
        groups?: Array<{ group_id: string; group_name: string; is_primary: boolean }>;
    };
    tuition_fee: number | null;
    cutoffScores?: CutoffScore[];
    matchScore: number;
    admissionTier: AdmissionTier | null;
    scoreDiff: number | null;
    referenceCutoff: number | null;
    reason: string[];
}

export interface RecommendResponseMeta {
    totalCandidates: number;
    filtersApplied: RecommendFiltersApplied;
    emptyReason: RecommendEmptyReason | null;
    diversified: boolean;
}

export interface RecommendResponse {
    results: RecommendationItem[];
    meta: RecommendResponseMeta;
}

export interface RecommendRequest {
    expected_score: number;
    subject_combination: string;
    interests: string;
    preferred_location?: string;
    budget_range?: 'low' | 'medium' | 'high';
    budget_max_yearly?: number;
    career_goal?: string;
    /** Mã PT xét tuyển (THPT, HOC_BA, …); bỏ trống = mặc định THPT */
    method_code?: string;
}

export interface ApiError {
    statusCode: number;
    message: string | string[];
    error?: string;
    email?: string;
}

// ── Chatbot ──────────────────────────────────────────────────

export type ChatEngine = 'rule' | 'ollama';

/** Response payload từ POST /api/chatbot/chat. */
export interface ChatResponse {
    answer: string;
    engine: ChatEngine;
    /** Có khi intent compare_universities và resolve ≥2 trường — dùng render bảng so sánh. */
    compare_university_ids?: number[] | null;
}

export type ChatRole = 'user' | 'assistant';

/** Tin nhắn trong UI (lưu localStorage để giữ ngữ cảnh giữa các lần reload). */
export interface ChatMessage {
    id: string;
    role: ChatRole;
    text: string;
    engine?: ChatEngine;
    compareUniversityIds?: number[];
}

/** Row từ GET /api/chatbot/history (yêu cầu JWT). */
export interface ChatHistoryItem {
    id: number;
    question: string;
    answer: string;
    session_id: string | null;
    created_at: string;
    /** Có khi lượt so sánh trường — lưu trong metadata assistant. */
    compare_university_ids?: number[] | null;
}

/** GET /api/chatbot/sessions — tối đa 5 cuộc gần nhất. */
export interface ChatSessionSummary {
    session_id: string;
    title: string;
    updated_at: string;
    preview: string | null;
}
