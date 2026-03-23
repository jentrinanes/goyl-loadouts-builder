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
    key                  = "prod.terraform.tfstate"
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
    COSMOS_CONNECTION_STRING = azurerm_cosmosdb_account.main.primary_sql_connection_string
    COSMOS_DB_NAME           = "yotei-legends"
    HMAC_SECRET              = var.hmac_secret
  }

  tags = {
    project     = var.project_name
    environment = var.environment
  }
}

# ── Cosmos DB ──────────────────────────────────────────────────────────────────

resource "azurerm_cosmosdb_account" "main" {
  name                = "cosmos-${var.project_name}-${var.environment}"
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

resource "azurerm_cosmosdb_sql_database" "main" {
  name                = "yotei-legends"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name

  # Share 400 RU/s across all containers — stays within the free tier (1,000 RU/s max)
  throughput = 400
}

resource "azurerm_cosmosdb_sql_container" "users" {
  name                = "users"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_path  = "/id"

  unique_key {
    paths = ["/username"]
  }
}

resource "azurerm_cosmosdb_sql_container" "builds" {
  name                = "builds"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_path  = "/userId"
}

resource "azurerm_cosmosdb_sql_container" "sessions" {
  name                = "sessions"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_path  = "/id"
  default_ttl         = 86400
}
