# Yotei Legends — Claude Context

## What This Is
A Ghost of Yotei fan app for creating and saving character builds. Built with React 19 + Vite + TypeScript (strict). Styled with **Tailwind CSS v4**. Data is persisted to localStorage.

## Tech Stack
- **React 19** + **React Router v7**
- **TypeScript** (strict, `noEmit` via `tsconfig.json`)
- **Vite** (`vite.config.ts`) with `@tailwindcss/vite` plugin
- **Tailwind CSS v4** — utility classes throughout; inline styles only for runtime-dynamic colours (rarity, class)
- **ESLint** flat config (`eslint.config.js`) with typescript-eslint v8
- **localStorage** for auth and build persistence (no backend)

## Project Structure
```
src/
  types/index.ts          # Single source of truth for all shared types
  data/
    classes.ts            # 4 classes: Samurai, Archer, Mercenary, Shinobi
    gear.ts               # All gear items + GEAR_SLOTS + helper functions
  store/
    authStore.ts          # localStorage user auth helpers
    buildStore.ts         # localStorage build save/load helpers
  context/
    AuthContext.tsx       # useAuth() hook — throws if used outside provider
  components/
    GearCard.tsx          # Gear item card (compact + full variants)
    WeaponIcon.tsx        # SVG icons per MeleeWeaponType; falls back to emoji
    StatBar.tsx           # Horizontal stat bar with Tailwind colour classes
  pages/
    AuthPage.tsx          # Public login / register page
    DashboardPage.tsx     # Lists saved builds
    BuilderPage.tsx       # 3-step build creator (Class → Gear → Review)
  App.tsx                 # Routes
  main.tsx                # Entry point
  index.css               # @import "tailwindcss" + custom scrollbar/focus styles
```

## Key Types (src/types/index.ts)
- `MeleeWeaponType` — `'katana' | 'dual_katana' | 'yari' | 'kusarigama' | 'odachi'`
- `RangedWeaponType` — `'hankyu' | 'tanegashima' | 'yumi' | 'bomb'`
- `GearCategory` — `'Melee' | 'Range' | 'Charm' | 'Ghost Tool'`
- `GearRarity` — `'Common' | 'Rare' | 'Epic' | 'Legendary'`
- `ClassDef` — includes optional `meleeSlotTypes`, `rangeSlotTypes`, `slotAllowedItems` for per-slot restrictions
- `Gear` — includes `attributes1`, `attributes2`, `attributes3: string[]` (3 structured dropdown selects per weapon), optional `weaponType?: MeleeWeaponType`, optional `rangedWeaponType?: RangedWeaponType`
- `Build` — stores `gears: Record<string, string>` (slotId → gearId) and `gearAttributes: Record<string, [string, string, string]>`

## Gear Slots (in order)
| ID | Label | Category |
|---|---|---|
| melee1 | Melee I | Melee |
| melee2 | Melee II | Melee |
| melee3 | Melee III | Melee |
| range1 | Range I | Range |
| range2 | Range II | Range |
| charm | Charm | Charm |
| ghostWeapon | Ghost Tool | Ghost Tool |

## Classes
- **Samurai** (🗡️) — attack/defense focused; no slot restrictions
- **Archer** (🏹) — ranged focused; slot restrictions:
  - Melee I = katana only, Melee II = yari only, Melee III = kusarigama only
  - Range I = yumi only (Yumi, Skipping Stone Bow, True Aim Yumi)
  - Range II = hankyu, tanegashima, bomb only
  - Charm = Basic Charm, Spirit Brew, Harmonious Bell, Risky Parry, Archer's Supplies only
  - Ghost Tool = no restriction (open to all classes)
- **Mercenary** (⚔️) — defense/health tank; no slot restrictions
- **Shinobi** (🥷) — stealth focused; no slot restrictions

## Slot Restriction System (src/data/classes.ts + src/data/gear.ts)
Three layers of filtering in `getGearsByCategory(category, meleeWeaponType?, rangedWeaponTypes?, allowedItemIds?)`:
1. `meleeSlotTypes: Record<string, MeleeWeaponType>` — restricts a melee slot to a specific weapon type
2. `rangeSlotTypes: Record<string, RangedWeaponType[]>` — restricts a range slot to specific ranged weapon type(s)
3. `slotAllowedItems: Record<string, string[]>` — restricts any slot to specific gear IDs (checked first, takes priority)

## Legendary Cap
- Max **2 legendaries** per build
- GearCard receives `disabled` prop when legendary cap is reached for that slot
- Disabled cards are greyed out, non-clickable, and show a 🔒 badge

## Weapons

### Melee (src/data/gear.ts)
All non-legendaries are **Epic** (purple). Legendaries marked with *.
- **Katana:** Iaido Katana, Shattering Katana, Thunderous Katana*
- **Dual Katana:** Relentless Dual Katana, Vigilant Dual Katana, Lightning's Bite*
- **Yari:** Relentless Yari, Swift Yari, Vigilant Yari, Thunderous Yari*
- **Kusarigama:** Nimble Kusarigama, Relentless Kusarigama, Vanishing Kusarigama*
- **Odachi:** Odachi, Restoring Odachi, Blade of Mountains*

### Ranged (src/data/gear.ts)
All non-legendaries are **Epic** (purple). Legendaries marked with *.
- **Hankyu:** Hankyu, Storm Hankyu, Hurricane Hankyu*
- **Tanegashima:** Tanegashima, Lightning Tanegashima*
- **Yumi:** Yumi, Skipping Stone Bow*, True Aim Yumi*
- **Bombs:** Concussion Bomb, Vengeful Onibi Bomb*, Blind Bomb, Healing Blind Bomb*

### Charms (src/data/gear.ts)
- Basic Charm (Epic), Spirit Brew*, Harmonious Bell*, Risky Parry*, Archer's Supplies*, Samurai's Bracers*, Mercenary's Best Friend*, Shinobi's Shadow*

### Ghost Tools (src/data/gear.ts)
All non-legendaries are **Epic** (purple). Legendaries marked with *. **No class restrictions on this slot.**
- Kunai, Spirit Kunai*, Metsubushi, Hallucinating Metsubushi*, Tanzutsu, Storm Tanzutsu*, Smoke Bomb, Weakening Smoke Bomb*, Caltrops, Affliction Caltrops*, Healing Incense, Purified Healing Incense*

## Weapon Attributes
Each weapon has 3 independent attribute dropdowns. Attribute pools are **per weapon** (defined on `attributes1`, `attributes2`, `attributes3` fields). Notable custom pools:

| Weapon Type | Attribute 1 | Attribute 2 | Attribute 3 |
|---|---|---|---|
| Katana | Katana Damage, etc. | shared ATTR2_OPTIONS | Expert Combo, Resolve Of Lightning, Burning Blade, Poison Blade |
| Yari | Yari Damage, Yari Stagger Damage, etc. | Enemy Staggered Damage, Ultimate Gain, etc. (no Execution Damage) | Expert Combo, Quickening Tides, Strength Of Typhoons, Burning Blade, Poison Blade |
| Kusarigama | Kusarigama Damage, Assassination Spirit Gain, etc. | Assassination Damage, Enemy Staggered Damage, etc. | Expert Combo, Shattering Strike, Burning Blade, Poison Blade |
| Hankyu | Hankyu Damage, Hankyu Speed, Hankyu Stability, etc. | All Ranged Damage, Ultimate Gain, etc. | Silent Arrow, Critical Release, Iron Grip, Fire Arrows, Poison Arrows (Storm/Hurricane: Fire Arrows, Poison Arrows only) |
| Tanegashima | Tanegashima Damage, Tanegashima Reload Speed, etc. | All Ranged Damage, Ultimate Gain, etc. | Extra Ammo, Shrapnel Bullets, Auto Reload |
| Yumi | Yumi Damage, Yumi Speed, Yumi Stability, etc. | All Ranged Damage, Ultimate Gain, etc. | Silent Arrow, Critical Release, Iron Grip, Disarm Arrows |
| Concussion/Onibi Bombs | All Melee Damage, Concussion Bomb Radius, etc. | All Ranged Damage, Ultimate Gain, etc. | Spirited, Scorch Bombs |
| Blind/Healing Blind Bombs | Ranged Spirit Gain, Assassination Damage, Blind Bomb Radius, etc. | All Ranged Damage, Ultimate Gain, etc. | Spirited, Increased Impact |

## Rarity Colours
| Rarity | Hex | Tailwind |
|---|---|---|
| Common | `#9ca3af` | `gray-400` |
| Rare | `#3b82f6` | `blue-500` |
| Epic | `#a855f7` | `purple-500` |
| Legendary | `#f59e0b` | `amber-400` |

## Tailwind Conventions
- Dark theme base colours map to Tailwind's built-in palette:
  - Page background: `bg-gray-950` (`#030712`)
  - Nav / panels: `bg-slate-900` (`#0f172a`)
  - Cards: `bg-gray-900` (`#111827`)
  - Borders: `border-gray-800` / `border-gray-700`
- **Inline styles are only used for runtime-dynamic values** — rarity colour stripes, class card border glow/shadow, stat bar fill width
- Accent colour for actions: `bg-amber-400` / `text-amber-400`
- SVG weapon icons in `WeaponIcon.tsx` — add new `MeleeWeaponType` values there and in `src/types/index.ts`

## Builder Page Behaviour
- 3 steps: Class selection → Gear selection → Review & Save
- Selecting a weapon does **not** auto-advance to the next slot — it stays on the current slot and shows the attribute panel inline inside the selected card
- Unselected gear cards collapse to compact view; only the selected card expands
- Each equipped weapon has **3 attribute dropdowns** (Attribute 1, 2, 3); empty string `''` means unselected
- Attributes reset when a different weapon is selected for the same slot
- Mobile: horizontal slot bar (`flex md:hidden`) for slot navigation; sidebar is `hidden md:flex`
- Gear list uses `flex flex-col gap-3` (not a grid) to avoid height-stretching unselected compact cards

## Common Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npx tsc --noEmit  # Type-check without building
npm run lint      # ESLint
```
