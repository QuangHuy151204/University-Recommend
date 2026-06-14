import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './chatbot.dto';
import type { AuthenticatedRequest } from '../auth/jwt-user.types';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    chat(dto: ChatMessageDto, req: AuthenticatedRequest, sessionIdQuery?: string): Promise<{
        answer: string;
        engine: "ollama" | "rule";
        compare_university_ids: number[] | null;
    }>;
    listSessions(req: AuthenticatedRequest): Promise<{
        session_id: string;
        title: string;
        updated_at: Date;
        preview: string | null;
    }[]>;
    getHistory(req: AuthenticatedRequest, sessionId?: string): Promise<{
        id: number;
        question: string;
        answer: string;
        session_id: string | null;
        created_at: Date;
        compare_university_ids: number[] | null;
    }[]>;
}
