import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';

async function handler(_req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  return {
    status: 200,
    jsonBody: {
      hasHmacSecret:          !!process.env.HMAC_SECRET,
      hmacSecretLength:       process.env.HMAC_SECRET?.length ?? 0,
      hasCosmosConnection:    !!process.env.COSMOS_CONNECTION_STRING,
      cosmosDbName:           process.env.COSMOS_DB_NAME ?? '(not set)',
    },
  };
}

app.http('health', { methods: ['GET'], authLevel: 'anonymous', route: 'health', handler });
