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

variable "ssm_web_host_bucket" {
  description = "Web Hosting Bucket Name"
  type        = string

  default = "web/HOST_BUCKET"
}
