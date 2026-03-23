import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { sessionsContainer } from './cosmos';

const SALT_ROUNDS = 10;
const SESSION_TTL_SECONDS = 86400; // 24 hours

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface SessionPayload {
  userId: string;
  username: string;
}

export async function createSession(userId: string, username: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  await sessionsContainer.items.create({ id: token, userId, username, expiresAt });
  return token;
}

export async function validateSession(token: string): Promise<SessionPayload | null> {
  const { resources } = await sessionsContainer.items
    .query<{ id: string; userId: string; username: string; expiresAt: number }>(
      { query: 'SELECT * FROM c WHERE c.id = @id', parameters: [{ name: '@id', value: token }] }
    )
    .fetchAll();
  const session = resources[0];
  if (!session || Date.now() > session.expiresAt) return null;
  return { userId: session.userId, username: session.username };
}

export async function deleteSession(token: string): Promise<void> {
  try {
    await sessionsContainer.item(token, token).delete();
  } catch { /* ignore */ }
}
