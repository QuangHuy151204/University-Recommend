import { ForbiddenException } from '@nestjs/common';
import { assertSessionAccess, sessionUserId } from './chat-session-policy';
import type { ChatSession } from './chat-session.entity';

function sessionWithUser(userId: number | null): ChatSession {
  return {
    user: userId != null ? ({ id: userId } as ChatSession['user']) : null,
  } as ChatSession;
}

describe('chat-session-policy', () => {
  it('sessionUserId reads owner', () => {
    expect(sessionUserId(sessionWithUser(3))).toBe(3);
    expect(sessionUserId(sessionWithUser(null))).toBeNull();
  });

  it('allows anonymous session for guest', () => {
    expect(() =>
      assertSessionAccess(sessionWithUser(null), undefined),
    ).not.toThrow();
  });

  it('blocks guest on owned session', () => {
    expect(() => assertSessionAccess(sessionWithUser(1), undefined)).toThrow(
      ForbiddenException,
    );
  });

  it('blocks wrong user', () => {
    expect(() => assertSessionAccess(sessionWithUser(1), 2)).toThrow(
      ForbiddenException,
    );
  });

  it('allows owner', () => {
    expect(() => assertSessionAccess(sessionWithUser(1), 1)).not.toThrow();
  });
});
