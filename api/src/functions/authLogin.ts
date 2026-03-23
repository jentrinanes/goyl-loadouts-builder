import * as crypto from 'crypto';
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { usersContainer } from '../lib/cosmos';
import { comparePassword, signToken } from '../lib/auth';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await req.json() as { username?: string; password?: string };
    const username = (body.username ?? '').trim().toLowerCase();
    const password = body.password ?? '';

    const { resources } = await usersContainer.items
      .query({ query: 'SELECT * FROM c WHERE c.username = @u', parameters: [{ name: '@u', value: username }] })
      .fetchAll();

    const user = resources[0] as { id: string; username: string; passwordHash: string } | undefined;
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return { status: 401, jsonBody: { message: 'Invalid username or password.' } };
    }

    const token = signToken({ sub: user.id, username: user.username });
    const secret = process.env.HMAC_SECRET ?? '';
    const secretFingerprint = crypto.createHash('sha256').update(secret).digest('hex').substring(0, 8);
    const parts = token.split('.');
    const expectedSig = crypto.createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest('base64url');
    const selfVerifies = parts[2] === expectedSig;
    return { status: 200, jsonBody: { token, user: { id: user.id, username: user.username }, _debug: { secretFingerprint, selfVerifies, tokenLength: token.length } } };
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e) return e as HttpResponseInit;
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('authLogin', { methods: ['POST'], authLevel: 'anonymous', route: 'auth/login', handler });
