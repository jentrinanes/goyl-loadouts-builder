variable "project_name" {
  description = "Short name used in all resource names (e.g. goyl-loadouts)"
  type        = string
  default     = "goyl-loadouts"
}

variable "environment" {
  description = "Deployment environment label (e.g. prod, staging)"
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Azure region for all resources. Free-tier Static Web Apps are available in: eastasia, eastus2, centralus, westeurope, and a handful of others."
  type        = string
  default     = "eastasia"
}

variable "hmac_secret" {
  description = "Secret key for signing HMAC auth tokens (keep this private)"
  type        = string
  sensitive   = true
}
