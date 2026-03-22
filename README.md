# GOYL Build Creator

A fan app for **Ghost of Yotei** — create, save, and share character builds.
Built with React 19 + Vite + TypeScript, styled with Tailwind CSS v4, and backed by Azure Cosmos DB.

---

## Features

- **4 playable classes** — Samurai, Archer, Mercenary, Shinobi
- **Per-class slot restrictions** — each class has unique gear pool rules across Melee, Range, Charm, and Ghost Tool slots
- **Legendary cap** — max 2 legendary items per build
- **Weapon attributes** — 3 slots per weapon (Top Slot, Bottom Slot, Perk) with max % display
- **Techniques** — 5 technique slots per class with class-specific options
- **Attribute totals** — auto-calculated stat summary in the Review step
- **Share builds** — download a PNG image of your build to share anywhere
- **Copy builds** — duplicate an existing build as a starting point
- **Light / dark theme** — persisted to localStorage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + React Router v7 + TypeScript (strict) |
| Styling | Tailwind CSS v4 + class-based dark mode |
| Build tool | Vite |
| Backend API | Azure Functions v4 (Node.js) |
| Database | Azure Cosmos DB (NoSQL / SQL API) |
| Hosting | Azure Static Web Apps (Free tier) |
| IaC | Terraform |
| CI/CD | GitHub Actions |

---

## Credits

Created by **noirsupernova**
