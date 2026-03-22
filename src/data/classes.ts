import type { ClassDef } from '../types';

const GHOST_TOOL_ITEMS = [
  'smoke_bomb',
  'weakening_smoke_bomb',
  'caltrops',
  'affliction_caltrops',
  'healing_incense',
  'purified_healing_incense',
];

export const CLASSES: ClassDef[] = [
  {
    id: 'samurai',
    name: 'Samurai',
    icon: '🗡️',
    description:
      'The honorable warrior. Masters of close-quarters combat and unbreakable defense. Their resolve fuels devastating stances.',
    bonuses: { attack: 20, defense: 15, health: 10, resolve: 10, stealth: 0, ranged: 0 },
    perk: 'Legendary Stance: Enter Ghost Stance with 20% less resolve',
    color: '#dc2626',
    accentColor: '#fca5a5',
    meleeSlotTypes: { melee1: 'katana', melee2: 'yari', melee3: 'odachi' },
    rangeSlotTypes: { range1: ['hankyu', 'tanegashima', 'bomb'] },
    slotAllowedItems: {
      charm: ['basic_charm', 'spirit_brew', 'harmonious_bell', 'risky_parry', 'samurais_bracers'],
      ghostWeapon: ['tanzutsu', 'storm_tanzutsu', 'kunai', 'spirit_kunai', 'metsubushi', 'hallucinating_metsubushi'],
      ghostWeapon2: GHOST_TOOL_ITEMS,
    },
    techniques: [
      { slot: 1, default: "Hachiman's Fury" },
      { slot: 2, options: ['Spirit Pull', 'Raging Flame'] },
      { slot: 3, options: ['Increase Melee Damage', 'Increase Melee Stagger Damage', 'Ability Cooldown'] },
      { slot: 4, options: ['Weapon Insight', 'Parry Damage', 'Spirited'] },
      { slot: 5, options: ["Hachiman's Rage", "Hachiman's Gift", "Hachiman's Zeal"] },
    ],
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
    rangeSlotTypes: { range1: ['yumi'], range2: ['hankyu', 'tanegashima', 'bomb'] },
    slotAllowedItems: {
      charm: ['basic_charm', 'archers_supplies', 'harmonious_bell', 'spirit_brew', 'risky_parry'],
      ghostWeapon: GHOST_TOOL_ITEMS,
    },
    techniques: [
      { slot: 1, default: 'Eye of Uchitsune' },
      { slot: 2, options: ['Empowered Hunt', 'Shadow Flame Arrow'] },
      { slot: 3, options: ['Lethal Proximity', 'Spirited', 'Ability Cooldown'] },
      { slot: 4, options: ['Resupply', 'Point Blank', 'Serrated Shots'] },
      { slot: 5, options: ['Consuming Flames', 'All-Seeing Eye', 'Bountiful Ammo'] },
    ],
  },
  {
    id: 'mercenary',
    name: 'Mercenary',
    icon: '⚔️',
    description:
      'A battle-hardened fighter for hire. Tough as iron, they absorb punishment and outlast any enemy.',
    bonuses: { attack: 15, defense: 25, health: 25, resolve: 5, stealth: 0, ranged: 0 },
    perk: 'Iron Will: Survive one lethal hit per encounter with 1 HP',
    color: '#d97706',
    accentColor: '#fcd34d',
    meleeSlotTypes: { melee1: 'katana', melee2: 'dual_katana', melee3: 'odachi' },
    rangeSlotTypes: { range1: ['tanegashima', 'bomb', 'hankyu'] },
    slotAllowedItems: {
      charm: ['basic_charm', 'harmonious_bell', 'spirit_brew', 'mercenarys_best_friend', 'risky_parry'],
      ghostWeapon: ['tanzutsu', 'storm_tanzutsu', 'kunai', 'spirit_kunai', 'metsubushi', 'hallucinating_metsubushi'],
      ghostWeapon2: GHOST_TOOL_ITEMS,
    },
    techniques: [
      { slot: 1, default: "Takemikazuchi's Smite" },
      { slot: 2, options: ['Spirit Throw', 'Spirit Animal'] },
      { slot: 3, options: ['Enhanced Ghost Tools', 'Enhanced Impalement', 'Ability Cooldown'] },
      { slot: 4, options: ['Spirit Shatter', 'Spirited', 'Status Effect Duration'] },
      { slot: 5, options: ['Energizing Smite', 'Raging Storm', 'Weakening Blast'] },
    ],
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
    meleeSlotTypes: { melee1: 'katana', melee2: 'yari', melee3: 'kusarigama' },
    rangeSlotTypes: { range1: ['hankyu', 'tanegashima', 'bomb'] },
    slotAllowedItems: {
      charm: ['basic_charm', 'spirit_brew', 'harmonious_bell', 'risky_parry', 'shinobis_shadow'],
      ghostWeapon: ['kunai', 'spirit_kunai', 'metsubushi', 'hallucinating_metsubushi', 'tanzutsu', 'storm_tanzutsu'],
      ghostWeapon2: GHOST_TOOL_ITEMS,
    },
    techniques: [
      { slot: 1, default: 'Shadow Strike' },
      { slot: 2, options: ['Toxic Vanish', 'Group Vanish'] },
      { slot: 3, options: ['Assassination Damage', 'Status Effect Duration', 'Ability Cooldown'] },
      { slot: 4, options: ['Shinobi Decoy', 'Spirited', 'Hallucination Assassination'] },
      { slot: 5, options: ['Shadow Strike Vanish', 'Shadow Strike Upgrade', 'Shadow Strike Decoy'] },
    ],
  },
];

export const getClassById = (id: string | null): ClassDef | undefined =>
  CLASSES.find((c) => c.id === id);
