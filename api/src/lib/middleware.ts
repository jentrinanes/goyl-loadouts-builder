import type { HttpRequest } from '@azure/functions';
import { verifyToken, type TokenPayload } from './auth';

export function requireAuth(req: HttpRequest): TokenPayload {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const payload = verifyToken(token);
  if (!payload) {
    throw { status: 401, message: 'Unauthorized' };
  }
  return payload;
}
