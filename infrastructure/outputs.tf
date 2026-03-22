output "static_web_app_url" {
  description = "Default hostname of the deployed Static Web App"
  value       = "https://${azurerm_static_web_app.main.default_host_name}"
}

output "static_web_app_api_key" {
  description = "Deployment token — use this with the SWA CLI or as a GitHub Actions secret"
  value       = azurerm_static_web_app.main.api_key
  sensitive   = true
}
