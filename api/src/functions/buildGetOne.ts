import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { buildsContainer } from '../lib/cosmos';
import { requireAuth } from '../lib/middleware';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const { userId } = await requireAuth(req);
    const id = req.params.id;
    const { resources } = await buildsContainer.items
      .query({ query: 'SELECT * FROM c WHERE c.id = @id AND c.userId = @uid', parameters: [{ name: '@id', value: id }, { name: '@uid', value: userId }] }, { partitionKey: userId })
      .fetchAll();
    if (resources.length === 0) return { status: 404, jsonBody: { message: 'Build not found.' } };
    return { status: 200, jsonBody: resources[0] };
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e) return e as HttpResponseInit;
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('buildGetOne', { methods: ['GET'], authLevel: 'anonymous', route: 'builds/{id}', handler });
