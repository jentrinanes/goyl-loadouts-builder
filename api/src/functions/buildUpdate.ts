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

    const existing = resources[0] as Record<string, unknown>;
    const body = await req.json() as Record<string, unknown>;
    const updated = { ...existing, ...body, id, userId, createdAt: existing.createdAt };

    const { resource } = await buildsContainer.item(id, userId).replace(updated);
    return { status: 200, jsonBody: resource };
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e) return e as HttpResponseInit;
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('buildUpdate', { methods: ['PUT'], authLevel: 'anonymous', route: 'builds/{id}', handler });
