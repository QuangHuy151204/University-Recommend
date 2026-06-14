import type { ChatSession } from './chat-session.entity';
export declare const MAX_CHAT_SESSIONS_PER_USER = 5;
export declare function sessionUserId(session: ChatSession): number | null;
export declare function assertSessionAccess(session: ChatSession, userId?: number): void;
