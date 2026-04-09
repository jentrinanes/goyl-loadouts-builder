import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { buildsContainer } from '../lib/cosmos';
import { requireAuth } from '../lib/middleware';
import * as crypto from 'crypto';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const { userId } = await requireAuth(req);
    const body = await req.json() as Record<string, unknown>;
    const build = {
      ...body,
      id: crypto.randomUUID(),
      userId, // always from token
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
