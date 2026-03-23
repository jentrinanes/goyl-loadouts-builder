import type { Build, User } from '../types';

const TOKEN_KEY = 'yotei_token';
const USER_KEY = 'yotei_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) as User : null;
  } catch {
    return null;
  }
}
export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (res.status === 401) {
    clearToken();
    window.location.href = '/';
    throw new ApiError(401, 'Session expired');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new ApiError(res.status, body.message ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

type NewBuild = Omit<Build, 'id' | 'createdAt'>;

export const api = {
  auth: {
    login: (username: string, password: string) =>
      apiFetch<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    register: (username: string, password: string) =>
      apiFetch<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    logout: () => apiFetch<void>('/auth/logout', { method: 'POST' }),
  },
  builds: {
    list: () => apiFetch<Build[]>('/builds'),
    get: (id: string) => apiFetch<Build>(`/builds/${id}`),
    create: (build: NewBuild) =>
      apiFetch<Build>('/builds', { method: 'POST', body: JSON.stringify(build) }),
    update: (id: string, build: Partial<NewBuild>) =>
      apiFetch<Build>(`/builds/${id}`, { method: 'PUT', body: JSON.stringify(build) }),
    delete: (id: string) => apiFetch<void>(`/builds/${id}`, { method: 'DELETE' }),
  },
};
