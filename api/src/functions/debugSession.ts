import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { sessionsContainer } from '../lib/cosmos';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  const authHeader = req.headers.get('authorization') ?? '(none)';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  const connStr = process.env.COSMOS_CONNECTION_STRING ?? '';
  const endpointMatch = connStr.match(/AccountEndpoint=([^;]+)/);
  const cosmosEndpoint = endpointMatch ? endpointMatch[1] : '(not found)';
  const dbName = process.env.COSMOS_DB_NAME ?? '(not set — using default yotei-legends)';

  let pointReadResult: unknown = null;
  let pointReadError: string | null = null;
  try {
    const { resource } = await sessionsContainer.item(token, token).read();
    pointReadResult = resource ?? '(not found)';
  } catch (e: unknown) {
    pointReadError = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  let queryResult: unknown = null;
  let queryError: string | null = null;
  try {
    const { resources } = await sessionsContainer.items
      .query({ query: 'SELECT c.id, c.userId, c.expiresAt FROM c WHERE c.id = @id', parameters: [{ name: '@id', value: token }] })
      .fetchAll();
    queryResult = resources;
  } catch (e: unknown) {
    queryError = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  return {
    status: 200,
    jsonBody: {
      cosmosEndpoint,
      dbName,
      receivedToken: token ? token.substring(0, 8) + '...' : '(empty)',
      tokenLength: token.length,
      pointReadResult,
      pointReadError,
      queryResult,
      queryError,
      now: Date.now(),
    },
  };
}

app.http('debugSession', { methods: ['GET'], authLevel: 'anonymous', route: 'debug-session', handler });
