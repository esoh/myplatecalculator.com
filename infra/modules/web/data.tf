data "aws_ssm_parameter" "web_host_bucket" {
  name = "/${var.prefix}/${var.env}/${var.ssm_web_host_bucket}"
}

locals {
  web_host_bucket_name = data.aws_ssm_parameter.web_host_bucket.value
}
