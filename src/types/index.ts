// ─── Shared domain types ────────────────────────────────────────────────────

export interface StatSet {
  attack: number;
  defense: number;
  health: number;
  resolve: number;
  stealth: number;
  ranged: number;
}

export type StatKey = keyof StatSet;

export interface ClassDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  bonuses: StatSet;
  perk: string;
  color: string;
  accentColor: string;
}

export type GearCategory = 'Melee' | 'Range' | 'Charm' | 'Ghost Weapon';
export type GearRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Gear {
  id: string;
  name: string;
  category: GearCategory;
  rarity: GearRarity;
  icon: string;
  description: string;
  stats: StatSet;
  perk: string;
  attributes: string[];
}

export interface GearSlot {
  id: string;
  label: string;
  category: GearCategory;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
}

export interface StoredUser extends User {
  password: string;
}

// ─── Build ───────────────────────────────────────────────────────────────────

export interface Build {
  id: string;
  userId: string;
  name: string;
  classId: string;
  gears: Record<string, string>;
  gearAttributes: Record<string, string[]>;
  createdAt: number;
}

export type NewBuild = Omit<Build, 'id' | 'createdAt'> & { id?: string };

// ─── Auth context ─────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => User;
  register: (username: string, password: string) => User;
  logout: () => void;
}
