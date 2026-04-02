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
    meleeSlotTypes: { melee1: 'katana', melee2: 'dual_katana', melee3: 'yari', melee4: 'odachi' },
    rangeSlotTypes: { range1: ['hankyu', 'tanegashima', 'bomb'] },
    slotAllowedItems: {
      charm: ['basic_charm', 'spirit_brew', 'harmonious_bell', 'risky_parry', 'samurais_bracers'],
      ghostWeapon: ['tanzutsu', 'storm_tanzutsu', 'kunai', 'spirit_kunai', 'metsubushi', 'hallucinating_metsubushi'],
    },
    techniques: [
      { slot: 1, default: "Hachiman's Fury", description: 'Perform a series of lightning-fast strikes against a group of enemies.' },
      { slot: 2, options: ['Spirit Pull', 'Raging Flame'], optionDescriptions: {
        'Spirit Pull': 'While active, leech health from nearby enemies. Melee strikes inflict additional damage to all enemies being leeched.',
        'Raging Flame': 'While active, your Melee weapons are imbued with flame. Heavy attacks will ignite nearby enemies.',
      }},
      { slot: 3, options: ['Increase Melee Damage', 'Increase Melee Stagger Damage', 'Ability Cooldown'], optionDescriptions: {
        'Increase Melee Damage': 'Increase Melee Damage by 15%.',
        'Increase Melee Stagger Damage': 'Increase Melee Stagger Damage by 25%.',
        'Ability Cooldown': 'Decrease Class Ability cooldown by 15%.',
      }},
      { slot: 4, options: ['Weapon Insight', 'Parry Damage', 'Spirited'], optionDescriptions: {
        'Weapon Insight': 'If Weapon Aligned, Focus Attacks increase Stagger damage by 30%.',
        'Parry Damage': 'Deal a major amount of Stagger damage to enemies when Parrying their attack.',
        'Spirited': 'Increase maximum Spirit by 2.',
      }},
      { slot: 5, options: ["Hachiman's Rage", "Hachiman's Gift", "Hachiman's Zeal"], optionDescriptions: {
        "Hachiman's Rage": "Increase the number of strikes in Hachiman's Fury by 2.",
        "Hachiman's Gift": "Heal for every hit of Hachiman's Fury.",
        "Hachiman's Zeal": "After you use Hachiman's Fury, Weapon Aligned attacks inflict double Stagger damage for 60 seconds.",
      }},
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
      { slot: 1, default: 'Eye of Uchitsune', image: 'eye_of_uchitsune', description: 'Target 3 enemies and fire a guaranteed headshot at each target.' },
      { slot: 2, options: ['Empowered Hunt', 'Shadow Flame Arrow'], optionDescriptions: {
        'Empowered Hunt': 'Increase damage and speed of Ranged weapons for a brief duration. While active, projectiles gain Piercing and have a massive chance of not consuming ammo.',
        'Shadow Flame Arrow': 'Fire an arrow that deals explosive damage on impact and leaves lingering flames.',
      }, optionImages: {
        'Empowered Hunt': 'empowered_hunt',
        'Shadow Flame Arrow': 'shadow_flame_arrow',
      }},
      { slot: 3, options: ['Lethal Proximity', 'Spirited', 'Ability Cooldown'], optionDescriptions: {
        'Lethal Proximity': 'Increase Ranged Damage by 30% for targets within 12 meters.',
        'Spirited': 'Increase maximum Spirit by 2.',
        'Ability Cooldown': 'Decrease Class Ability cooldown by 15%.',
      }, optionImages: {
        'Lethal Proximity': 'lethal_proximity',
        'Spirited': 'spirited_archer',
        'Ability Cooldown': 'ability_cooldown_archer',
      }},
      { slot: 4, options: ['Resupply', 'Point Blank', 'Serrated Shots'], optionDescriptions: {
        'Resupply': 'Refill 30% of all ammo types. Press x while aiming to activate. Costs 1 Spirit.',
        'Point Blank': 'Body shots with Ranged weapons have a 40% chance to inflict headshot damage.',
        'Serrated Shots': 'Arrows and Bullets inflict Maim for a brief duration, making the target Vulnerable to any weapon.',
      }, optionImages: {
        'Resupply': 'resupply',
        'Point Blank': 'point_blank',
        'Serrated Shots': 'serrated_shots',
      }},
      { slot: 5, options: ['Consuming Flames', 'All-Seeing Eye', 'Bountiful Ammo'], optionDescriptions: {
        'Consuming Flames': 'Shots from your Ultimate trigger a Shadow-Flame explosion, inflicting damage to nearby enemies and setting them on fire.',
        'All-Seeing Eye': 'Ultimate can target 2 more enemies.',
        'Bountiful Ammo': 'Firing Ultimate restores 65% of all ammo types.',
      }, optionImages: {
        'Consuming Flames': 'consuming_flames',
        'All-Seeing Eye': 'all_seeing_eye',
        'Bountiful Ammo': 'bountiful_ammo',
      }},
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
      { slot: 1, default: "Takemikazuchi's Smite", description: "Call forth a blast of Lightning that Disarms and knocks back nearby enemies. Summon 2 Thunderstrikes on nearby enemies inflicting major damage." },
      { slot: 2, options: ['Spirit Throw', 'Spirit Animal'], optionDescriptions: {
        'Spirit Throw': 'Conjure a Spirit Weapon that can be thrown at a nearby enemy.',
        'Spirit Animal': 'Summon a friendly wolf companion for a short duration that inflicts Poison on nearby enemies.',
      }, optionImages: {
        'Spirit Throw': 'spirit_throw',
        'Spirit Animal': 'spirit_animal',
      }},
      { slot: 3, options: ['Enhanced Ghost Tools', 'Enhanced Impalement', 'Ability Cooldown'], optionDescriptions: {
        'Enhanced Ghost Tools': 'Increase damage of all Ghost Tools by 35%.',
        'Enhanced Impalement': 'Increase thrown weapon damage by 25%.',
        'Ability Cooldown': 'Decrease Class Ability cooldown by 15%.',
      }, optionImages: {
        'Enhanced Ghost Tools': 'enhanced_ghost_tools',
        'Enhanced Impalement': 'enhanced_impalement',
        'Ability Cooldown': 'ability_cooldown_mercenary',
      }},
      { slot: 4, options: ['Spirit Shatter', 'Spirited', 'Status Effect Duration'], optionDescriptions: {
        'Spirit Shatter': 'Thrown weapons shatter on impact dealing damage to nearby enemies and inflict Weaken.',
        'Spirited': 'Increase maximum Spirit by 2.',
        'Status Effect Duration': 'Increase Status Effect Duration by 30%.',
      }, optionImages: {
        'Spirit Shatter': 'spirit_shatter',
        'Spirited': 'spirited_mercenary',
        'Status Effect Duration': 'status_effect_duration',
      }},
      { slot: 5, options: ['Energizing Smite', 'Raging Storm', 'Weakening Blast'], optionDescriptions: {
        'Energizing Smite': "Takemikazuchi's Smite refunds a major amount of cooldown on Class Ability and all Ghost Tools.",
        'Raging Storm': "Takemikazuchi's Smite calls down 2 more Thunderstrikes.",
        'Weakening Blast': "Takemikazuchi's Smite also inflicts Weaken and Poison, making enemies Vulnerable to any Melee weapon, increasing damage taken, and reducing damage dealt.",
      }, optionImages: {
        'Energizing Smite': 'energizing_smite',
        'Raging Storm': 'raging_storm',
        'Weakening Blast': 'weakening_blast',
      }},
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
      { slot: 1, default: 'Shadow Strike', description: 'Enter the shadows and strike enemies from a distance.' },
      { slot: 2, options: ['Toxic Vanish', 'Group Vanish'], optionDescriptions: {
        'Toxic Vanish': 'Vanish in a cloud of poisonous smoke that inflicts Stagger damage to nearby enemies and leaves them Vulnerable to all Melee weapons.',
        'Group Vanish': 'You and nearby allies briefly Vanish in a cloud of smoke.',
      }},
      { slot: 3, options: ['Assassination Damage', 'Status Effect Duration', 'Ability Cooldown'], optionDescriptions: {
        'Assassination Damage': 'Increase damage of assassinations by 20%.',
        'Status Effect Duration': 'Increase Status Effect Duration by 40%.',
        'Ability Cooldown': 'Decrease Class Ability cooldown by 15%.',
      }},
      { slot: 4, options: ['Shinobi Decoy', 'Spirited', 'Hallucination Assassination'], optionDescriptions: {
        'Shinobi Decoy': 'Assassinating enemies has a massive chance to summon a Shinobi Decoy.',
        'Spirited': 'Increase maximum Spirit by 2.',
        'Hallucination Assassination': 'Assassinations cause nearby enemies to hallucinate and fight for you for a short period of time.',
      }},
      { slot: 5, options: ['Shadow Strike Vanish', 'Shadow Strike Upgrade', 'Shadow Strike Decoy'], optionDescriptions: {
        'Shadow Strike Vanish': 'After using Shadow Strike, you Vanish for a short time.',
        'Shadow Strike Upgrade': 'Shadow Strike can target an additional 2 enemies.',
        'Shadow Strike Decoy': 'Targets killed by Shadow Strike have a massive chance to summon a Shinobi Decoy.',
      }},
    ],
  },
];

export const getClassById = (id: string | null): ClassDef | undefined =>
  CLASSES.find((c) => c.id === id);
