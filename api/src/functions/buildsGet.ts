import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { buildsContainer } from '../lib/cosmos';
import { requireAuth } from '../lib/middleware';

async function handler(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const { sub: userId } = requireAuth(req);
    const { resources } = await buildsContainer.items
      .query({ query: 'SELECT * FROM c WHERE c.userId = @uid', parameters: [{ name: '@uid', value: userId }] }, { partitionKey: userId })
      .fetchAll();
    return { status: 200, jsonBody: resources };
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e) return e as HttpResponseInit;
    const message = e instanceof Error ? e.message : String(e);
    ctx.error('buildsGet error:', message);
    return { status: 500, jsonBody: { message } };
  }
}

app.http('buildsGet', { methods: ['GET'], authLevel: 'anonymous', route: 'builds', handler });
