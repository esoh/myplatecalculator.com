variable "prefix" {
  description = "A prefix used for all resources"
  type        = string
}

variable "env" {
  description = "The environment to deploy to"
  type        = string
}

variable "ssm_web_domain_name" {
  description = "Web Domain Name"
  type        = string

  default = "web/DOMAIN_NAME"
}

variable "subzones" {
  description = "External zone configs"
  type        = list(any)

  default     = []
}

variable "needs_google_mx_records" {
  description = "Google MX records. Set to true if current environment is the main domain host and you have google workspace set up with the domain and would like to receive emails via user@domain.com."
  type        = bool

  default     = false
}
