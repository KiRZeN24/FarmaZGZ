import { Request } from 'express';

export interface JwtPayload {
  id: string;
  username?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
