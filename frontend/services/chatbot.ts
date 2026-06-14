import { api } from '@/lib/api';
import type { ChatHistoryItem, ChatResponse, ChatSessionSummary } from '@/types';

/**
 * Gửi tin nhắn cho chatbot.
 * Endpoint công khai — không bắt buộc JWT.
 * Truyền `token` nếu user đã login để backend gắn câu hỏi với userId.
 */
export function sendChatMessage(
    message: string,
    sessionId?: string,
    token?: string,
): Promise<ChatResponse> {
    return api.post<ChatResponse>(
        '/chatbot/chat',
        { message },
        {
            query: sessionId ? { session_id: sessionId } : undefined,
            token,
        },
    );
}

/**
 * Lấy lịch sử chat (yêu cầu JWT).
 * Truyền `sessionId` để chỉ lấy 1 cuộc hội thoại.
 */
export function getChatSessions(): Promise<ChatSessionSummary[]> {
    return api.get<ChatSessionSummary[]>('/chatbot/sessions');
}

export function getChatHistory(sessionId: string): Promise<ChatHistoryItem[]> {
    return api.get<ChatHistoryItem[]>('/chatbot/history', {
        query: { session_id: sessionId },
    });
}
