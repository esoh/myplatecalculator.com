data "aws_ssm_parameter" "web_domain_name" {
  name = "/${var.prefix}/${var.env}/${var.ssm_web_domain_name}"
}

# ssm name
data "aws_ssm_parameter" "web_host_bucket" {
  name = "/${var.prefix}/${var.env}/${var.ssm_web_host_bucket}"
}

# s3 bucket
data "aws_s3_bucket" "web_bucket" {
  bucket = data.aws_ssm_parameter.web_host_bucket.value
}

data "aws_route53_zone" "primary_zone" {
  name = data.aws_ssm_parameter.web_domain_name.value
}

locals {
  web_domain_name                  = data.aws_ssm_parameter.web_domain_name.value
  web_host_bucket_website_endpoint = data.aws_s3_bucket.web_bucket.website_endpoint
  cf_ssm                           = "/${var.prefix}/${var.env}/web/CF_ID"

  s3_origin_id                     = "main"
  is_subdomain                     = length(regexall("[\\w]+\\.[\\w]+\\.[\\w]+", local.web_domain_name)) > 0
  stage                            = var.env # stage from backend/lambdas/graphql sls file
}
