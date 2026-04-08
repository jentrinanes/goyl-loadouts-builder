import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { usersContainer } from '../lib/cosmos';
import { hashPassword } from '../lib/auth';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await req.json() as { username?: string; newPassword?: string };
    const username = (body.username ?? '').trim().toLowerCase();
    const newPassword = (body.newPassword ?? '').trim();

    if (!username || !newPassword) {
      return { status: 400, jsonBody: { message: 'Username and new password are required.' } };
    }
    if (newPassword.length < 4) {
      return { status: 400, jsonBody: { message: 'Password must be at least 4 characters.' } };
    }

    const { resources } = await usersContainer.items
      .query({ query: 'SELECT * FROM c WHERE c.username = @u', parameters: [{ name: '@u', value: username }] })
      .fetchAll();

    const user = resources[0] as { id: string; username: string; passwordHash: string } | undefined;
    if (!user) return { status: 404, jsonBody: { message: 'Username not found.' } };

    const passwordHash = await hashPassword(newPassword);
    await usersContainer.item(user.id, user.id).replace({ ...user, passwordHash });

    return { status: 200, jsonBody: { message: 'Password reset successfully.' } };
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e) return e as HttpResponseInit;
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('authResetPassword', { methods: ['POST'], authLevel: 'anonymous', route: 'auth/reset-password', handler });
