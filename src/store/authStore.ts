import type { User, StoredUser } from '../types';

const USERS_KEY   = 'yotei_users';
const SESSION_KEY = 'yotei_session';

const getUsers   = (): StoredUser[] => JSON.parse(localStorage.getItem(USERS_KEY)   ?? '[]');
const saveUsers  = (users: StoredUser[]): void => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const register = (username: string, password: string): User => {
  const users = getUsers();
  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Username already taken');
  }
  const user: StoredUser = { id: crypto.randomUUID(), username, password };
  saveUsers([...users, user]);
  const session: User = { id: user.id, username: user.username };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const login = (username: string, password: string): User => {
  const users = getUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
  );
  if (!user) throw new Error('Invalid username or password');
  const session: User = { id: user.id, username: user.username };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const logout = (): void => localStorage.removeItem(SESSION_KEY);

export const getSession = (): User | null =>
  JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as User | null;
