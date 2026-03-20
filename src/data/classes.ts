import type { ClassDef } from '../types';

export const CLASSES: ClassDef[] = [
  {
    id: 'samurai',
    name: 'Samurai',
    icon: '⚔️',
    description:
      'The honorable warrior. Masters of close-quarters combat and unbreakable defense. Their resolve fuels devastating stances.',
    bonuses: { attack: 20, defense: 15, health: 10, resolve: 10, stealth: 0, ranged: 0 },
    perk: 'Legendary Stance: Enter Ghost Stance with 20% less resolve',
    color: '#dc2626',
    accentColor: '#fca5a5',
  },
  {
    id: 'archer',
    name: 'Archer',
    icon: '🏹',
    description:
      'A deadly marksman who strikes from the shadows. Precision is their creed — one arrow, one kill.',
    bonuses: { attack: 10, defense: 5, health: 5, resolve: 5, stealth: 10, ranged: 25 },
    perk: 'Eagle Eye: Headshots deal +40% damage and restore resolve',
    color: '#16a34a',
    accentColor: '#86efac',
    meleeSlotTypes: { melee1: 'katana', melee2: 'yari', melee3: 'kusarigama' },
  },
  {
    id: 'mercenary',
    name: 'Mercenary',
    icon: '🛡️',
    description:
      'A battle-hardened fighter for hire. Tough as iron, they absorb punishment and outlast any enemy.',
    bonuses: { attack: 15, defense: 25, health: 25, resolve: 5, stealth: 0, ranged: 0 },
    perk: 'Iron Will: Survive one lethal hit per encounter with 1 HP',
    color: '#d97706',
    accentColor: '#fcd34d',
  },
  {
    id: 'shinobi',
    name: 'Shinobi',
    icon: '🥷',
    description:
      'A phantom of the night. Undetectable, unstoppable. Masters of stealth, poison, and swift execution.',
    bonuses: { attack: 10, defense: 0, health: 5, resolve: 15, stealth: 35, ranged: 5 },
    perk: 'Ghost Step: Perform 2 consecutive stealth kills without breaking cover',
    color: '#7c3aed',
    accentColor: '#c4b5fd',
  },
];

export const getClassById = (id: string | null): ClassDef | undefined =>
  CLASSES.find((c) => c.id === id);
