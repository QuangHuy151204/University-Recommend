/** Payload gắn vào `req.user` sau JwtStrategy.validate(). */
export interface JwtUserPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthenticatedRequest {
  user?: JwtUserPayload;
}
