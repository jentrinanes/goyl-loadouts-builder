import type { HttpRequest } from '@azure/functions';
import { validateSession, type SessionPayload } from './auth';

export async function requireAuth(req: HttpRequest): Promise<SessionPayload> {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) throw { status: 401, jsonBody: { message: 'Unauthorized' } };
  const payload = await validateSession(token);
  if (!payload) throw { status: 401, jsonBody: { message: 'Unauthorized' } };
  return payload;
}
