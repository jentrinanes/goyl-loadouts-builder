import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { usersContainer } from '../lib/cosmos';
import { hashPassword, signToken } from '../lib/auth';
import * as crypto from 'crypto';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await req.json() as { username?: string; password?: string };
    const username = (body.username ?? '').trim().toLowerCase();
    const password = body.password ?? '';

    if (username.length < 3 || password.length < 4) {
      return { status: 400, jsonBody: { message: 'Username must be at least 3 characters and password at least 4.' } };
    }

    // Check uniqueness
    const { resources } = await usersContainer.items
      .query({ query: 'SELECT c.id FROM c WHERE c.username = @u', parameters: [{ name: '@u', value: username }] })
      .fetchAll();
    if (resources.length > 0) {
      return { status: 409, jsonBody: { message: 'Username already taken.' } };
    }

    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    await usersContainer.items.create({ id, username, passwordHash, createdAt: Date.now() });

    const token = signToken({ sub: id, username });
    return { status: 201, jsonBody: { token, user: { id, username } } };
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e) return e as HttpResponseInit;
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('authRegister', { methods: ['POST'], authLevel: 'anonymous', route: 'auth/register', handler });
