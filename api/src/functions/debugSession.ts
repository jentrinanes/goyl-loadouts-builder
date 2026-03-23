import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { sessionsContainer } from '../lib/cosmos';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  const authHeader = req.headers.get('authorization') ?? '(none)';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  let queryResult: unknown = null;
  let queryError: string | null = null;

  try {
    const { resources } = await sessionsContainer.items
      .query(
        { query: 'SELECT c.id, c.userId, c.username, c.expiresAt FROM c WHERE c.id = @id', parameters: [{ name: '@id', value: token }] }
      )
      .fetchAll();
    queryResult = resources;
  } catch (e: unknown) {
    queryError = e instanceof Error ? e.message : String(e);
  }

  let allSessions: unknown = null;
  let allError: string | null = null;
  try {
    const { resources } = await sessionsContainer.items
      .query({ query: 'SELECT c.id FROM c' })
      .fetchAll();
    allSessions = (resources as Array<{ id: string }>).map(r => r.id.substring(0, 8) + '...');
  } catch (e: unknown) {
    allError = e instanceof Error ? e.message : String(e);
  }

  return {
    status: 200,
    jsonBody: {
      receivedToken: token ? token.substring(0, 8) + '...' : '(empty)',
      tokenLength: token.length,
      authHeader: authHeader.substring(0, 20) + '...',
      queryResult,
      queryError,
      allSessionIdPrefixes: allSessions,
      allError,
      now: Date.now(),
    },
  };
}

app.http('debugSession', { methods: ['GET'], authLevel: 'anonymous', route: 'debug-session', handler });
