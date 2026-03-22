import type { Build, User } from '../types';

const TOKEN_KEY = 'yotei_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function parseTokenUser(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.sub || !payload.username) return null;
    return { id: payload.sub, username: payload.username };
  } catch {
    return null;
  }
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
