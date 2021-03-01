data "aws_ssm_parameter" "web_domain_name" {
  name = "/${var.prefix}/${var.env}/${var.ssm_web_domain_name}"
}

locals {
  web_domain_name                  = data.aws_ssm_parameter.web_domain_name.value
}
