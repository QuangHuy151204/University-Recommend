import { ForbiddenException } from '@nestjs/common';
import type { ChatSession } from './chat-session.entity';

export const MAX_CHAT_SESSIONS_PER_USER = 5;

export function sessionUserId(session: ChatSession): number | null {
  const raw = session.user as { id?: number } | null | undefined;
  return typeof raw?.id === 'number' ? raw.id : null;
}

/** Chặn đọc/ghi session của user khác hoặc session đã gắn user khi chưa đăng nhập. */
export function assertSessionAccess(
  session: ChatSession,
  userId?: number,
): void {
  const ownerId = sessionUserId(session);
  if (ownerId != null) {
    if (!userId) {
      throw new ForbiddenException(
        'Cuộc hội thoại này thuộc tài khoản đã đăng nhập. Vui lòng đăng nhập để tiếp tục.',
      );
    }
    if (ownerId !== userId) {
      throw new ForbiddenException(
        'Không thể truy cập cuộc hội thoại của người dùng khác.',
      );
    }
  }
}
