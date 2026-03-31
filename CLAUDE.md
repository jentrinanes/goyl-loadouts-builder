# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Yotei Legends — Claude Context

## What This Is
A Ghost of Yotei fan app for creating and saving character builds. Built with React 19 + Vite + TypeScript (strict). Styled with **Tailwind CSS v4**. Builds are persisted to **Azure Cosmos DB** via an **Azure Functions v4** backend.

## Tech Stack
- **React 19** + **React Router v7**
- **TypeScript** (strict, `noEmit` via `tsconfig.json`)
- **Vite** (`vite.config.ts`) with `@tailwindcss/vite` plugin
- **Tailwind CSS v4** — utility classes throughout; inline styles only for runtime-dynamic colours (rarity, class)
- **ESLint** flat config (`eslint.config.js`) with typescript-eslint v8
- **Azure Functions v4** (Node.js) — REST API in `api/` directory
- **Azure Cosmos DB** — NoSQL/SQL API; containers: `users`, `builds`, `sessions`
- **localStorage** — stores auth token (`yotei_token`) and cached user (`yotei_user`) only

## Project Structure
```
api/                      # Azure Functions v4 backend (separate npm package)
  src/
    functions/            # HTTP triggers: authLogin, authRegister, authLogout,
                          #   buildsGet, buildCreate, buildGetOne, buildUpdate, buildDelete, debugSession
    lib/
      auth.ts             # hashPassword, createSession (UUID token, 24h TTL), validateSession, deleteSession
      cosmos.ts           # CosmosClient — exports usersContainer, buildsContainer, sessionsContainer
      middleware.ts       # requireAuth(req) — validates Bearer token, returns SessionPayload
  tsconfig.json           # Compiles to _api_dist/

src/
  types/index.ts          # Single source of truth for all shared types
  data/
    classes.ts            # 4 classes with full slot restrictions + technique definitions
    gear.ts               # All gear items + class-specific slot layouts + helper functions
  lib/
    api.ts                # REST client (apiFetch with Bearer auth), token helpers, api.auth.*, api.builds.*
  store/
    authStore.ts          # Stub — auth is via src/lib/api.ts
    buildStore.ts         # Stub — builds are via src/lib/api.ts
  context/
    AuthContext.tsx       # useAuth() hook — wraps api.auth.*; throws if used outside provider
    ThemeContext.tsx      # useTheme() hook + ThemeProvider; persists to localStorage
  components/
    GearCard.tsx          # Gear item card (compact + full variants)
    WeaponIcon.tsx        # SVG icons per MeleeWeaponType; falls back to emoji
    StatBar.tsx           # Horizontal stat bar with Tailwind colour classes
  pages/
    AuthPage.tsx          # Public login / register page
    DashboardPage.tsx     # Lists saved builds; copy, delete, PNG share via html-to-image
    BuilderPage.tsx       # 4-step build creator (Class → Gear → Techniques → Review)
  App.tsx                 # Routes — wrapped in ThemeProvider > AuthProvider
  main.tsx                # Entry point
  index.css               # @import "tailwindcss" + @custom-variant dark + scrollbar styles
```

## Key Types (src/types/index.ts)
- `MeleeWeaponType` — `'katana' | 'dual_katana' | 'yari' | 'kusarigama' | 'odachi'`
- `RangedWeaponType` — `'hankyu' | 'tanegashima' | 'yumi' | 'bomb'`
- `GearCategory` — `'Melee' | 'Range' | 'Charm' | 'Ghost Tool'`
- `GearRarity` — `'Common' | 'Rare' | 'Epic' | 'Legendary'`
- `StatSet` — `{ attack, defense, health, resolve, stealth, ranged: number }`
- `TechniqueSlot` — `{ slot: number; default?: string; options?: string[] }` — `default` = fixed technique, `options` = player choice
- `ClassDef` — `bonuses: StatSet`, `perk`, `color`, `accentColor`, optional `meleeSlotTypes`, `rangeSlotTypes`, `slotAllowedItems`, `techniques?: TechniqueSlot[]`
- `Gear` — `stats: StatSet`, `attributes1/2/3: string[]`, optional `attributeMaxValues?: Record<string, number>`, optional `weaponType`, `rangedWeaponType`
- `Build` — `gears: Record<string, string>` (slotId → gearId), `gearAttributes: Record<string, [string, string, string]>`, optional `techniques?: Record<number, string>`
- `NewBuild` — `Omit<Build, 'id' | 'createdAt'> & { id?: string }` — used for create/update API calls
- `User` — `{ id: string; username: string }`

## Class-Specific Gear Slot Layouts (src/data/gear.ts)
`getSlotsForClass(classId)` returns one of three slot arrays:

| Class | Slots |
|---|---|
| **Samurai** | melee1, melee2, melee3, **melee4**, range1, charm, ghostWeapon (7 slots) |
| **Archer** | melee1, melee2, melee3, range1, **range2**, charm, ghostWeapon (7 slots) |
| **Mercenary / Shinobi** | melee1, melee2, melee3, range1, charm, ghostWeapon, **ghostWeapon2** (7 slots) |

The default `GEAR_SLOTS` export (Mercenary/Shinobi) is the fallback. Ghost Tool slots are labelled "Ghost Tool I" / "Ghost Tool II" except on Archer (just "Ghost Tool").

## Classes & Slot Restrictions (src/data/classes.ts)
All 4 classes have slot restrictions. `slotAllowedItems` takes priority over type-based filtering.

**Samurai** 🗡️ — attack/defense; bonuses: attack+20, defense+15, health+10, resolve+10
- melee1=katana, melee2=dual_katana, melee3=yari, melee4=odachi
- range1=hankyu/tanegashima/bomb
- charm=basic_charm, spirit_brew, harmonious_bell, risky_parry, samurais_bracers
- ghostWeapon=tanzutsu/storm_tanzutsu/kunai/spirit_kunai/metsubushi/hallucinating_metsubushi

**Archer** 🏹 — ranged; bonuses: attack+10, defense+5, health+5, resolve+5, stealth+10, ranged+25
- melee1=katana, melee2=yari, melee3=kusarigama
- range1=yumi only, range2=hankyu/tanegashima/bomb
- charm=basic_charm, archers_supplies, harmonious_bell, spirit_brew, risky_parry
- ghostWeapon=GHOST_TOOL_ITEMS (smoke_bomb, caltrops, healing_incense variants)

**Mercenary** ⚔️ — defense/health; bonuses: attack+15, defense+25, health+25, resolve+5
- melee1=katana, melee2=dual_katana, melee3=odachi
- range1=tanegashima/bomb/hankyu
- charm=basic_charm, harmonious_bell, spirit_brew, mercenarys_best_friend, risky_parry
- ghostWeapon=tanzutsu/storm_tanzutsu/kunai/spirit_kunai/metsubushi/hallucinating_metsubushi
- ghostWeapon2=GHOST_TOOL_ITEMS

**Shinobi** 🥷 — stealth; bonuses: attack+10, health+5, resolve+15, stealth+35, ranged+5
- melee1=katana, melee2=yari, melee3=kusarigama
- range1=hankyu/tanegashima/bomb
- charm=basic_charm, spirit_brew, harmonious_bell, risky_parry, shinobis_shadow
- ghostWeapon=kunai/spirit_kunai/metsubushi/hallucinating_metsubushi/tanzutsu/storm_tanzutsu
- ghostWeapon2=GHOST_TOOL_ITEMS

## Slot Restriction System (src/data/gear.ts)
`getGearsByCategory(category, meleeWeaponType?, rangedWeaponTypes?, allowedItemIds?)`:
1. `slotAllowedItems` — if set, returns only those specific gear IDs (highest priority)
2. `meleeSlotTypes` — restricts a melee slot to a single weapon type
3. `rangeSlotTypes` — restricts a range slot to specific ranged weapon type(s)

## Legendary Cap
- Max **2 legendaries** per build
- `GearCard` receives `disabled` prop when cap is reached for an unselected slot
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
All non-legendaries are **Epic** (purple). Legendaries marked with *.
- Kunai, Spirit Kunai*, Metsubushi, Hallucinating Metsubushi*, Tanzutsu, Storm Tanzutsu*, Smoke Bomb, Weakening Smoke Bomb*, Caltrops, Affliction Caltrops*, Healing Incense, Purified Healing Incense*

## Weapon Attributes
Each weapon has 3 independent attribute dropdowns (`attributes1`, `attributes2`, `attributes3`). Attribute labels in UI are **Top Slot**, **Bottom Slot**, **Perk**. `attributeMaxValues` provides the percentage cap per attribute name (used for Attribute Totals in Review step).

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

## Techniques (per class)
Each class has 5 technique slots. Slot 1 is always a fixed `default`; slots 2–5 require a player choice from `options`. Technique selections are stored in `Build.techniques: Record<number, string>`.

| Class | Slot 1 (fixed) | Slots 2–5 (choice) |
|---|---|---|
| Samurai | Hachiman's Fury | Spirit Pull/Raging Flame; Melee Damage/Stagger/Cooldown; Weapon Insight/Parry Damage/Spirited; Hachiman's Rage/Gift/Zeal |
| Archer | Eye of Uchitsune | Empowered Hunt/Shadow Flame Arrow; Lethal Proximity/Spirited/Cooldown; Resupply/Point Blank/Serrated Shots; Consuming Flames/All-Seeing Eye/Bountiful Ammo |
| Mercenary | Takemikazuchi's Smite | Spirit Throw/Spirit Animal; Enhanced Ghost Tools/Impalement/Cooldown; Spirit Shatter/Spirited/Status Duration; Energizing Smite/Raging Storm/Weakening Blast |
| Shinobi | Shadow Strike | Toxic Vanish/Group Vanish; Assassination Damage/Status Duration/Cooldown; Shinobi Decoy/Spirited/Hallucination Assassination; Shadow Strike Vanish/Upgrade/Decoy |

## Rarity Colours
| Rarity | Hex | Tailwind |
|---|---|---|
| Common | `#9ca3af` | `gray-400` |
| Rare | `#3b82f6` | `blue-500` |
| Epic | `#a855f7` | `purple-500` |
| Legendary | `#f59e0b` | `amber-400` |

## Light / Dark Theme
- **Class-based dark mode** via `@custom-variant dark (&:where(.dark, .dark *));` in `index.css`
- `ThemeProvider` (in `App.tsx`) adds/removes the `dark` class on `<html>` and persists to `localStorage`
- Defaults to **dark**. An inline `<script>` in `index.html` applies `dark` before React mounts to prevent flash
- Toggle button (☀️ / 🌙) is in the navbar on Dashboard & Builder, and fixed top-right on AuthPage
- `useTheme()` returns `{ theme, toggleTheme }`

### Tailwind colour pairs (light → dark)
| Element | Light | Dark |
|---|---|---|
| Page background | `bg-gray-100` | `dark:bg-gray-950` |
| Nav / panels | `bg-white` | `dark:bg-slate-900` |
| Sidebar panel | `bg-gray-50` | `dark:bg-[#0a0f1a]` |
| Cards | `bg-white` | `dark:bg-gray-900` |
| Input / button bg | `bg-gray-100` | `dark:bg-gray-800` |
| Panel borders | `border-gray-200` | `dark:border-gray-800` |
| Input borders | `border-gray-300` | `dark:border-gray-700` |
| Body text | `text-gray-900` | `dark:text-gray-100` |
| Secondary text | `text-gray-700` | `dark:text-gray-200` |
| Muted text | `text-gray-600` | `dark:text-gray-400` |
| Very muted | `text-gray-400` | `dark:text-gray-600` |
| StatBar track | `bg-gray-200` | `dark:bg-gray-800` |
| Selected slot/card | `bg-blue-50` | `dark:bg-[#1e3a5f]` |
| Selected class card | `bg-green-50` | `dark:bg-[#1e3a2f]` |
| Disabled button | `bg-gray-200 text-gray-400` | `dark:bg-gray-700 dark:text-gray-500` |

- **Inline styles are only used for runtime-dynamic values** — rarity colour stripes, class card border glow/shadow, stat bar fill width
- Accent colour for actions: `bg-amber-400` / `text-amber-400` (same in both modes)
- SVG weapon icons in `WeaponIcon.tsx` — add new `MeleeWeaponType` values there and in `src/types/index.ts`

## Builder Page Behaviour
- **4 steps**: Class (0) → Gear (1) → Techniques (2) → Review (3)
- Step labels shown in navbar header; completed steps show a ✓ badge
- Selecting a class resets technique choices
- Selecting a weapon does **not** auto-advance to the next slot — shows attribute panel inline inside the selected card
- Unselected gear cards collapse to compact view; only the selected card expands
- Each equipped weapon has **3 attribute dropdowns** (Top Slot / Bottom Slot / Perk); empty string `''` means unselected
- Attributes reset when a different weapon is selected for the same slot
- Techniques step: slot 1 is always fixed (displayed, not clickable); slots 2–5 are radio-style buttons
- "Choose Techniques →" button is disabled until all gear slots are filled; "Review Build →" disabled until all choice techniques are selected
- Builder also supports editing existing builds: `GET /builds/:id` pre-populates state, save calls `PUT /builds/:id`
- Mobile: horizontal slot bar (`flex md:hidden`) for slot navigation; sidebar is `hidden md:flex`
- Gear list uses `flex flex-col gap-3` (not a grid)
- Review step: left column = build name + class + techniques; right column = equipped gear list + Attribute Totals (sum of `attributeMaxValues` across all selected attributes)

## Dashboard Features
- Lists all builds for the authenticated user (fetched via `api.builds.list()`)
- **Copy build** — creates a duplicate via `api.builds.create`
- **Share build** — exports a PNG of the build card via `html-to-image`
- **Delete build** — calls `api.builds.delete`
- **Edit build** — navigates to `/builder/:id`

## API Layer (src/lib/api.ts)
- `apiFetch` attaches `Authorization: Bearer <token>`; on 401 clears token and redirects to `/`
- `api.auth.login / register / logout`
- `api.builds.list / get / create / update / delete`

## Azure Functions API (api/)
- Sessions are UUID tokens stored in the `sessions` Cosmos container with an `expiresAt` timestamp (24-hour TTL)
- `requireAuth(req)` in `middleware.ts` extracts the Bearer token and calls `validateSession`
- Auth endpoints: `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`
- Build endpoints: `GET /api/builds`, `POST /api/builds`, `GET /api/builds/:id`, `PUT /api/builds/:id`, `DELETE /api/builds/:id`
- Local dev requires `api/local.settings.json` with `COSMOS_CONNECTION_STRING` and optionally `COSMOS_DB_NAME` (default: `yotei-legends`)

## Common Commands
```bash
# Frontend
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build locally
npx tsc --noEmit  # Type-check without building
npm run lint      # ESLint

# API (run from api/ directory)
cd api && npm run build   # Compile TypeScript to _api_dist/
cd api && npm run watch   # TypeScript watch mode
cd api && func start      # Start Azure Functions locally (requires Azure Functions Core Tools)
# Note: `cd api && npm start` runs build then func start in one step
```

## Tests
There are no tests in this project.

## CI/CD & Hosting
- **CI** (`.github/workflows/ci.yml`) — runs on PRs and pushes to `master`: builds frontend + API, type-checks frontend
- **Deploy** (`.github/workflows/deploy.yml`) — runs on push to `master`: builds both, deploys to **Azure Static Web Apps** using `dist/` as the app and `api/` as the functions location
- Requires `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in the GitHub repo
