# deploys zone
terraform {
  required_version = "~> 0.13"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.20.0"
    }
  }
}

resource "aws_route53_zone" "primary_zone" {
  name = local.web_domain_name
}

resource "aws_route53_record" "subzones" {
  for_each = {
    for subzone in var.subzones: subzone.subdomain => {
      nameservers = subzone.nameservers
    }
  }

  allow_overwrite = true
  name            = each.key
  records         = each.value.nameservers
  ttl             = 60
  type            = "NS"
  zone_id         = aws_route53_zone.primary_zone.zone_id
}

// GSUITE MAIL RECORDS
# resource "aws_route53_record" "gmail" {
#   count = var.needs_google_mx_records ? 1 : 0
#   zone_id = aws_route53_zone.primary_zone.zone_id
#   name    = ""
#   type    = "MX"
#   records = [
#     "1 ASPMX.L.GOOGLE.COM",
#     "5 ALT1.ASPMX.L.GOOGLE.COM",
#     "5 ALT2.ASPMX.L.GOOGLE.COM",
#     "10 ALT3.ASPMX.L.GOOGLE.COM",
#     "10 ALT4.ASPMX.L.GOOGLE.COM",
#   ]
#   ttl = 3600
# }
