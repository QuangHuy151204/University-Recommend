import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, isObservable, lastValueFrom } from 'rxjs';

/**
 * Gắn `req.user` khi có JWT hợp lệ (cookie hoặc Bearer); không chặn request nếu thiếu token.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = super.canActivate(context);
      if (isObservable(result)) {
        return await lastValueFrom(result);
      }
      return await Promise.resolve(result);
    } catch {
      return true;
    }
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser | null {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
