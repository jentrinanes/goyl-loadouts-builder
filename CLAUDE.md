# Yotei Legends — Claude Context

## What This Is
A Ghost of Yotei fan app for creating and saving character builds. Built with React 19 + Vite + TypeScript (strict). No CSS framework — all inline styles. Data is persisted to localStorage.

## Tech Stack
- **React 19** + **React Router v7**
- **TypeScript** (strict, `noEmit` via `tsconfig.json`)
- **Vite** (`vite.config.ts`)
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
    StatBar.tsx           # Horizontal stat bar
  pages/
    LandingPage.tsx       # Public landing / login / register
    DashboardPage.tsx     # Lists saved builds
    BuilderPage.tsx       # 3-step build creator (Class → Gear → Review)
  App.tsx                 # Routes
  main.tsx                # Entry point
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
- **Hankyu:** Hankyu, Storm Hankyu, Hurricane Hankyu*
- **Tanegashima:** Tanegashima, Lightning Tanegashima*
- **Yumi:** Yumi, Skipping Stone Bow*, True Aim Yumi*
- **Bombs:** Concussion Bomb, Vengeful Onibi Bomb*, Blind Bomb, Healing Blind Bomb*

## Rarity Colours
| Rarity | Colour |
|---|---|
| Common | `#9ca3af` |
| Rare | `#3b82f6` |
| Epic | `#a855f7` |
| Legendary | `#f59e0b` |

## Builder Page Behaviour
- 3 steps: Class selection → Gear selection → Review & Save
- Selecting a weapon does **not** auto-advance to the next slot — it stays on the current slot and shows the attribute panel
- Each equipped weapon can have up to **3 attributes** selected (capped, with a counter display)
- Attributes reset when a different weapon is selected for the same slot

## Design Conventions
- Dark theme: background `#030712`, cards `#111827`, nav `#0f172a`
- All styling via inline `style` props — no CSS classes or external stylesheets
- Accent colour for actions: `#f59e0b` (gold)
- SVG weapon icons in `WeaponIcon.tsx` — add new `MeleeWeaponType` values there and in `src/types/index.ts`

## Common Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npx tsc --noEmit  # Type-check without building
npm run lint      # ESLint
```
