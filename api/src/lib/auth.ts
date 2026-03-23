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
  try {
    const { resource } = await sessionsContainer.item(token, token).read<{ userId: string; username: string; expiresAt: number }>();
    if (!resource || Date.now() > resource.expiresAt) return null;
    return { userId: resource.userId, username: resource.username };
  } catch {
    return null;
  }
}

export async function deleteSession(token: string): Promise<void> {
  try {
    await sessionsContainer.item(token, token).delete();
  } catch { /* ignore */ }
}
