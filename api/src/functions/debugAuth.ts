import * as crypto from 'crypto';
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';

function base64urlDecode(str: string): unknown {
  try {
    return JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) return { status: 400, jsonBody: { error: 'No Bearer token found in Authorization header' } };

  const parts = token.split('.');
  if (parts.length !== 3) return { status: 400, jsonBody: { error: `Expected 3 parts, got ${parts.length}` } };

  const [header, body, sig] = parts;
  const secret = process.env.HMAC_SECRET ?? '';
  const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  const sigMatch = sig === expectedSig;

  const payload = base64urlDecode(body) as Record<string, unknown> | null;
  const now = Math.floor(Date.now() / 1000);
  const exp = typeof payload?.exp === 'number' ? payload.exp : null;

  return {
    status: 200,
    jsonBody: {
      tokenLength:   token.length,
      sigMatch,
      secretLength:  secret.length,
      expired:       exp !== null ? now > exp : 'exp not found',
      exp,
      now,
    },
  };
}

app.http('debugAuth', { methods: ['GET'], authLevel: 'anonymous', route: 'debug-auth', handler });
