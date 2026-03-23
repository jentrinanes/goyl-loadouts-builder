import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { usersContainer } from '../lib/cosmos';
import { comparePassword, createSession } from '../lib/auth';

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

    const token = await createSession(user.id, user.username);
    return { status: 200, jsonBody: { token, user: { id: user.id, username: user.username } } };
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e) return e as HttpResponseInit;
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('authLogin', { methods: ['POST'], authLevel: 'anonymous', route: 'auth/login', handler });
