import { ChatSession } from './chat-session.entity';
export type ChatMessageSender = 'user' | 'assistant';
export declare class ChatMessage {
    id: number;
    chatSession: ChatSession;
    sender: ChatMessageSender;
    message: string;
    metadata: Record<string, unknown> | null;
    created_at: Date;
}
