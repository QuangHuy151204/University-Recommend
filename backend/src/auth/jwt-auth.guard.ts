// @file: Route guard that enforces access rules for user registration, login, JWT cookies, and password reset.
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
