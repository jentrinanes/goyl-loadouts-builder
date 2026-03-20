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
- `GearCategory` — `'Melee' | 'Range' | 'Charm' | 'Ghost Weapon'`
- `GearRarity` — `'Common' | 'Rare' | 'Epic' | 'Legendary'`
- `ClassDef` — includes optional `meleeSlotTypes?: Record<string, MeleeWeaponType>` to restrict per-slot weapon choices
- `Gear` — includes `attributes: string[]` (up to 3 selectable per equipped weapon) and optional `weaponType?: MeleeWeaponType`
- `Build` — stores `gears: Record<string, string>` (slotId → gearId) and `gearAttributes: Record<string, string[]>`

## Gear Slots (in order)
| ID | Label | Category |
|---|---|---|
| melee1 | Melee I | Melee |
| melee2 | Melee II | Melee |
| melee3 | Melee III | Melee |
| range1 | Range I | Range |
| range2 | Range II | Range |
| charm | Charm | Charm |
| ghostWeapon | Ghost Weapon | Ghost Weapon |

## Classes
- **Samurai** — attack/defense focused
- **Archer** — ranged focused; melee slots are restricted: Melee I = katana only, Melee II = yari only, Melee III = kusarigama only
- **Mercenary** — defense/health tank
- **Shinobi** — stealth focused

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
- Selecting a weapon does **not** auto-advance to the next slot — it stays on the current slot and shows the attribute panel
- Each equipped weapon can have up to **3 attributes** selected (capped, with a counter display)
- Attributes reset when a different weapon is selected for the same slot

## Common Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npx tsc --noEmit  # Type-check without building
npm run lint      # ESLint
```
