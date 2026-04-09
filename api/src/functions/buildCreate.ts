import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { buildsContainer } from '../lib/cosmos';
import { requireAuth } from '../lib/middleware';
import * as crypto from 'crypto';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const { userId } = await requireAuth(req);
    const body = await req.json() as Record<string, unknown>;

    const { resources } = await buildsContainer.items
      .query({ query: 'SELECT VALUE MAX(c.buildNumber) FROM c WHERE c.userId = @uid', parameters: [{ name: '@uid', value: userId }] })
      .fetchAll();
    const maxNumber = (resources[0] as number | null) ?? 0;

    const build = {
      ...body,
      id: crypto.randomUUID(),
      userId,
      buildNumber: maxNumber + 1,
      createdAt: Date.now(),
    };
    const { resource } = await buildsContainer.items.create(build);
    return { status: 201, jsonBody: resource };
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e) return e as HttpResponseInit;
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('buildCreate', { methods: ['POST'], authLevel: 'anonymous', route: 'builds', handler });
