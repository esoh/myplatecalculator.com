variable "prefix" {
  description = "A prefix used for all resources"
  type        = string
}

variable "env" {
  description = "The environment to deploy to"
  type        = string
}

variable "region" {
  description = "AWS Region"
  type        = string
}

variable "profile" {
  description = "AWS Profile Name"
  type        = string
}

variable "ssm_web_host_bucket" {
  description = "Web Hosting Bucket Name"
  type        = string

  default = "web/HOST_BUCKET"
}

