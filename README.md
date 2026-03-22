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

## Local Development

### Prerequisites

- Node.js **v20** (required by Azure Functions Core Tools v4)
- [nvm-windows](https://github.com/coreybutler/nvm-windows) recommended for version switching
- [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) or Docker
- [SWA CLI](https://azure.github.io/static-web-apps-cli/)
- [Azure Functions Core Tools v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)

```bash
# Switch to Node 20
nvm use 20

# Install SWA CLI globally (once)
npm install -g @azure/static-web-apps-cli

# Install frontend dependencies
npm install

# Install API dependencies
cd api && npm install && cd ..
```

### Cosmos DB Emulator Setup

1. Start the emulator (Windows app or Docker)
2. Open `https://localhost:8081/_explorer` and create:
   - Database: `yotei-legends`
   - Container: `users` — partition key `/id`
   - Container: `builds` — partition key `/userId`
3. Copy `api/local.settings.example.json` → `api/local.settings.json` and fill in:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOS_CONNECTION_STRING": "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMcZcLU/GQzQQSgsw==",
    "COSMOS_DB_NAME": "yotei-legends",
    "HMAC_SECRET": "local-dev-secret"
  }
}
```

### Run

```bash
# From the project root (starts Vite + Functions + SWA proxy together)
swa start http://localhost:5173 --run "npm run dev" --api-location api
```

Open **`http://localhost:4280`** in your browser.

> **Note:** Use the SWA URL (`4280`), not the Vite URL (`5173`), so `/api/*` routes work correctly.

---

## Other Commands

```bash
npm run dev       # Vite dev server only (no API)
npm run build     # Production build
npx tsc --noEmit  # Type-check
npm run lint      # ESLint
```

---

## Deployment

Infrastructure is managed with Terraform and deployed via GitHub Actions.

### First-time setup

**1. Create Terraform state storage (run once in Azure CLI):**

```bash
az group create --name rg-terraform-state --location eastasia
az storage account create --name goylterraformstate --resource-group rg-terraform-state --location eastasia --sku Standard_LRS
az storage container create --name tfstate --account-name goylterraformstate
```

**2. Create an Azure Service Principal:**

```bash
az ad sp create-for-rbac --name "goyl-github-actions" --role Contributor --scopes /subscriptions/<your-subscription-id> --sdk-auth
```

**3. Add GitHub Secrets:**

| Secret | Description |
|---|---|
| `ARM_CLIENT_ID` | Service principal client ID |
| `ARM_CLIENT_SECRET` | Service principal client secret |
| `ARM_SUBSCRIPTION_ID` | Your Azure subscription ID |
| `ARM_TENANT_ID` | Your Azure tenant ID |
| `ARM_ACCESS_KEY` | Storage account key for Terraform state |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | From `terraform output -raw static_web_app_api_key` |
| `COSMOS_CONNECTION_STRING` | From `terraform output -raw cosmosdb_connection_string` |
| `HMAC_SECRET` | A strong random secret for signing auth tokens |

### GitHub Actions Workflows

| Workflow | Trigger | Action |
|---|---|---|
| `terraform.yml` | Push to `master` / PR | Plan on PR, apply on merge |
| `azure-static-web-apps.yml` | Push to `master` / PR | Build & deploy frontend + API |

---

## Project Structure

```
├── api/                          # Azure Functions (backend API)
│   ├── auth/                     # register, login endpoints
│   ├── builds/                   # CRUD endpoints for builds
│   └── local.settings.json       # Local env vars (gitignored)
├── infrastructure/               # Terraform files
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
├── public/
│   └── staticwebapp.config.json  # SPA routing config
├── src/
│   ├── components/               # GearCard, StatBar, WeaponIcon
│   ├── context/                  # AuthContext, ThemeContext
│   ├── data/                     # classes.ts, gear.ts
│   ├── pages/                    # AuthPage, DashboardPage, BuilderPage
│   ├── store/                    # authStore, buildStore
│   └── types/                    # Shared TypeScript types
└── .github/workflows/            # CI/CD pipelines
```

---

## Credits

Created by **noirsupernova**
