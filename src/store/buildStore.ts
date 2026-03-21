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
    all[existing] = { createdAt: all[existing].createdAt ?? Date.now(), ...build } as Build;
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

export const duplicateBuild = (buildId: string): void => {
  const all      = getAll();
  const original = all.find((b) => b.id === buildId);
  if (!original) return;

  // Generate a unique name: "Name (Copy)", "Name (Copy 2)", …
  let candidate = `${original.name} (Copy)`;
  let counter   = 2;
  while (all.some((b) => b.userId === original.userId && b.name.trim().toLowerCase() === candidate.trim().toLowerCase())) {
    candidate = `${original.name} (Copy ${counter++})`;
  }

  all.push({ ...original, id: crypto.randomUUID(), name: candidate, createdAt: Date.now() });
  saveAll(all);
};

export const getBuildById = (buildId: string): Build | undefined =>
  getAll().find((b) => b.id === buildId);
