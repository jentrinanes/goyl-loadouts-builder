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

export interface TechniqueSlot {
  slot: number;
  default?: string;
  image?: string;
  description?: string;
  options?: string[];
  optionDescriptions?: Record<string, string>;
  optionImages?: Record<string, string>;
}

export interface ClassDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  bonuses: StatSet;
  perk: string;
  color: string;
  accentColor: string;
  meleeSlotTypes?: Record<string, MeleeWeaponType>;
  rangeSlotTypes?: Record<string, RangedWeaponType[]>;
  slotAllowedItems?: Record<string, string[]>;
  techniques?: TechniqueSlot[];
}

export type GearCategory = 'Melee' | 'Range' | 'Charm' | 'Ghost Tool';
export type GearRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type MeleeWeaponType = 'katana' | 'dual_katana' | 'yari' | 'kusarigama' | 'odachi';
export type RangedWeaponType = 'hankyu' | 'tanegashima' | 'yumi' | 'bomb';

export interface Gear {
  id: string;
  name: string;
  category: GearCategory;
  rarity: GearRarity;
  icon: string;
  stats: StatSet;
  perk: string;
  attributes1: string[];
  attributes2: string[];
  attributes3: string[];
  attributeMaxValues?: Record<string, number>;
  weaponType?: MeleeWeaponType;
  rangedWeaponType?: RangedWeaponType;
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

// ─── Build ───────────────────────────────────────────────────────────────────

export interface Build {
  id: string;
  userId: string;
  name: string;
  classId: string;
  gears: Record<string, string>;
  gearAttributes: Record<string, [string, string, string]>;
  techniques?: Record<number, string>;
  createdAt: number;
}

export type NewBuild = Omit<Build, 'id' | 'createdAt'> & { id?: string };

// ─── Auth context ─────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
