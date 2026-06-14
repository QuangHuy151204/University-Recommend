import { User } from '../users/user.entity';
import { ChatMessage } from './chat-message.entity';
export declare class ChatSession {
    id: number;
    user: User | null;
    session_key: string | null;
    title: string | null;
    session_context: Record<string, unknown> | null;
    messages: ChatMessage[];
    created_at: Date;
    updated_at: Date;
}
