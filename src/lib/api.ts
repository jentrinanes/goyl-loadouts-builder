import type { Build, User } from '../types';

const TOKEN_KEY = 'yotei_token';
const USER_KEY = 'yotei_user';
const BUILDS_CACHE_KEY = 'yotei_builds';

function getCachedBuilds(): Build[] | null {
  try {
    const raw = localStorage.getItem(BUILDS_CACHE_KEY);
    return raw ? JSON.parse(raw) as Build[] : null;
  } catch {
    return null;
  }
}
function setCachedBuilds(builds: Build[]): void {
  localStorage.setItem(BUILDS_CACHE_KEY, JSON.stringify(builds));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(BUILDS_CACHE_KEY);
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

/** Strip HTML tags and angle brackets to prevent XSS injection. */
export function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
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
      ...(token ? { 'X-Auth-Token': token } : {}),
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
    resetPassword: (username: string, newPassword: string) =>
      apiFetch<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ username, newPassword }),
      }),
  },
  builds: {
    list: async () => {
      const cached = getCachedBuilds();
      if (cached) return cached;
      const builds = await apiFetch<Build[]>('/builds');
      setCachedBuilds(builds);
      return builds;
    },
    get: (id: string) => apiFetch<Build>(`/builds/${id}`),
    create: async (build: NewBuild) => {
      const created = await apiFetch<Build>('/builds', { method: 'POST', body: JSON.stringify(build) });
      const cached = getCachedBuilds();
      if (cached) setCachedBuilds([...cached, created]);
      return created;
    },
    update: async (id: string, build: Partial<NewBuild>) => {
      const updated = await apiFetch<Build>(`/builds/${id}`, { method: 'PUT', body: JSON.stringify(build) });
      const cached = getCachedBuilds();
      if (cached) setCachedBuilds(cached.map(b => b.id === id ? updated : b));
      return updated;
    },
    delete: async (id: string) => {
      await apiFetch<void>(`/builds/${id}`, { method: 'DELETE' });
      const cached = getCachedBuilds();
      if (cached) setCachedBuilds(cached.filter(b => b.id !== id));
    },
  },
};
