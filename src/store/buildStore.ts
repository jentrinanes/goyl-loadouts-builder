import type { Build, NewBuild } from '../types';

const BUILDS_KEY = 'yotei_builds';

const getAll  = (): Build[] => JSON.parse(localStorage.getItem(BUILDS_KEY) ?? '[]');
const saveAll = (builds: Build[]): void => localStorage.setItem(BUILDS_KEY, JSON.stringify(builds));

export const getBuildsForUser = (userId: string): Build[] =>
  getAll().filter((b) => b.userId === userId);

export const saveBuild = (build: NewBuild): void => {
  const all = getAll();
  const existing = all.findIndex((b) => b.id === build.id);
  if (existing >= 0) {
    all[existing] = build as Build;
  } else {
    all.push({ ...build, id: crypto.randomUUID(), createdAt: Date.now() });
  }
  saveAll(all);
};

export const isBuildNameTaken = (userId: string, name: string, excludeId?: string): boolean =>
  getAll().some(
    (b) => b.userId === userId && b.name.trim().toLowerCase() === name.trim().toLowerCase() && b.id !== excludeId
  );

export const deleteBuild = (buildId: string): void =>
  saveAll(getAll().filter((b) => b.id !== buildId));

export const getBuildById = (buildId: string): Build | undefined =>
  getAll().find((b) => b.id === buildId);
