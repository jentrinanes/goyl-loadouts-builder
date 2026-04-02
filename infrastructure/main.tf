terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.75"
    }
  }

  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "goylterraformstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"  # overridden via -backend-config at init time
  }
}

provider "azurerm" {
  features {}
}

# ── Resource Group ─────────────────────────────────────────────────────────────

resource "azurerm_resource_group" "main" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location

  tags = {
    project     = var.project_name
    environment = var.environment
  }
}

# ── Azure Static Web App (Free tier) ──────────────────────────────────────────

resource "azurerm_static_web_app" "main" {
  name                = "swa-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  sku_tier = "Free"
  sku_size = "Free"

  app_settings = {
    COSMOS_CONNECTION_STRING = local.cosmos_connection_string
    COSMOS_DB_NAME           = local.cosmos_db_name
    HMAC_SECRET              = var.hmac_secret
  }

  tags = {
    project     = var.project_name
    environment = var.environment
  }
}

# ── Cosmos DB ──────────────────────────────────────────────────────────────────
# Prod: create a dedicated account with free tier.
# Staging: reuse the prod account to avoid the one-free-tier-per-subscription limit.

resource "azurerm_cosmosdb_account" "main" {
  count               = var.environment == "prod" ? 1 : 0
  name                = "cosmos-${var.project_name}-prod"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  free_tier_enabled = true

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  tags = {
    project     = var.project_name
    environment = var.environment
  }
}

data "azurerm_cosmosdb_account" "prod" {
  count               = var.environment == "staging" ? 1 : 0
  name                = "cosmos-${var.project_name}-prod"
  resource_group_name = "rg-${var.project_name}-prod"
}

locals {
  cosmos_account_name       = var.environment == "prod" ? azurerm_cosmosdb_account.main[0].name : data.azurerm_cosmosdb_account.prod[0].name
  cosmos_resource_group     = var.environment == "prod" ? azurerm_resource_group.main.name : "rg-${var.project_name}-prod"
  cosmos_connection_string  = var.environment == "prod" ? azurerm_cosmosdb_account.main[0].primary_sql_connection_string : data.azurerm_cosmosdb_account.prod[0].primary_sql_connection_string
  cosmos_db_name            = "yotei-legends${var.environment == "prod" ? "" : "-${var.environment}"}"
}

resource "azurerm_cosmosdb_sql_database" "main" {
  name                = local.cosmos_db_name
  resource_group_name = local.cosmos_resource_group
  account_name        = local.cosmos_account_name

  throughput = 400
}

resource "azurerm_cosmosdb_sql_container" "users" {
  name                = "users"
  resource_group_name = local.cosmos_resource_group
  account_name        = local.cosmos_account_name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_path  = "/id"

  unique_key {
    paths = ["/username"]
  }
}

resource "azurerm_cosmosdb_sql_container" "builds" {
  name                = "builds"
  resource_group_name = local.cosmos_resource_group
  account_name        = local.cosmos_account_name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_path  = "/userId"
}

resource "azurerm_cosmosdb_sql_container" "sessions" {
  name                = "sessions"
  resource_group_name = local.cosmos_resource_group
  account_name        = local.cosmos_account_name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_path  = "/id"
  default_ttl         = 86400
}
