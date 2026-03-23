import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { deleteSession } from '../lib/auth';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (token) await deleteSession(token);
  return { status: 204 };
}

app.http('authLogout', { methods: ['POST'], authLevel: 'anonymous', route: 'auth/logout', handler });
