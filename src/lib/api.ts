import type { Build, NewBuild } from '../types';

const BUILDS_KEY = 'yotei_builds';

/** Strip HTML tags and angle brackets to prevent XSS injection. */
export function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
}

function readBuilds(): Build[] {
  try {
    const raw = localStorage.getItem(BUILDS_KEY);
    return raw ? JSON.parse(raw) as Build[] : [];
  } catch {
    return [];
  }
}

function writeBuilds(builds: Build[]): void {
  localStorage.setItem(BUILDS_KEY, JSON.stringify(builds));
}

export const api = {
  builds: {
    list: (): Promise<Build[]> => Promise.resolve(readBuilds()),

    get: (id: string): Promise<Build | undefined> =>
      Promise.resolve(readBuilds().find((b) => b.id === id)),

    create: (build: NewBuild): Promise<Build> => {
      const builds = readBuilds();
      const created: Build = { ...build, id: crypto.randomUUID(), createdAt: Date.now() };
      writeBuilds([...builds, created]);
      return Promise.resolve(created);
    },

    update: (id: string, build: Partial<NewBuild>): Promise<Build> => {
      const builds = readBuilds();
      const index = builds.findIndex((b) => b.id === id);
      if (index === -1) return Promise.reject(new Error('Build not found'));
      const updated: Build = { ...builds[index], ...build };
      const next = [...builds];
      next[index] = updated;
      writeBuilds(next);
      return Promise.resolve(updated);
    },

    delete: (id: string): Promise<void> => {
      writeBuilds(readBuilds().filter((b) => b.id !== id));
      return Promise.resolve();
    },
  },
};
