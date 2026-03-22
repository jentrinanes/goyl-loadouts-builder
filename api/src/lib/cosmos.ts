import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
const db = client.database(process.env.COSMOS_DB_NAME ?? 'yotei-legends');

export const usersContainer = db.container('users');
export const buildsContainer = db.container('builds');
