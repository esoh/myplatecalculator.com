# Deploys zone, cert, and cf to web bucket
# Also deploys custom domain name for the api gw for the backend/lambdas/graphql
# with its dns record.

terraform {
  required_version = "~> 0.13"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.20.0"
    }
  }
}

// web domain routing =========================================================
// see infra/web
# If this zone is for a subdomain, then it
# 1. deploys a CF for the web bucket (web_dist)
# 2. deploys an A record for the subdomain.domain.tld (no_www)
# subdomain.domain.tld => web_dist CF => web bucket

# If this zone is for the main domain, then it
# 1. deploys a redirect bucket that redirects all requests to
#   https://www.domain.tld (aws_s3_bucket.no_www)
# 2. deploys a CF for the redirect bucket (no_www_web_dist)
# 3. deploys an A record for domain.tld (no_www)
# 4. deploys a CF for the web bucket (web_dist)
# 5. deploys an A record for www.domain.tld (www)
# domain.tld => no_www_web_dist CF => aws_s3_bucket.no_www
# (redirects to # www.domain.tld)
# www.domain.tld => web_dist CF => web bucket

# If web_domain_name is a subdomain, this will not get verified until after you
# provide the NS of this hosted zone to the zone of the main domain as an NS
# record.
resource "aws_acm_certificate" "cert" {
  domain_name = local.web_domain_name
  subject_alternative_names = ["*.${local.web_domain_name}"]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_records" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.primary_zone.zone_id
}

# points to web bucket
resource "aws_cloudfront_distribution" "web_dist" {
  enabled = true
  origin {
    domain_name = local.web_host_bucket_website_endpoint
    origin_id   = local.s3_origin_id
    custom_origin_config {
      # "HTTP Only: CloudFront uses only HTTP to access the origin."
      # "Important: If your origin is an Amazon S3 bucket configured
      # as a website endpoint, you must choose this option. Amazon S3
      # doesn't support HTTPS connections for website endpoints."
      origin_protocol_policy = "http-only"

      http_port  = "80"
      https_port = "443"

      # "If the origin is an Amazon S3 bucket, CloudFront always uses TLSv1.2."
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  # if this zone IS for a subdomain, subdomain.domain.tld will point to this cf
  # if this zone is NOT for a subdomain, www.domain.tld will point to this cf
  aliases = local.is_subdomain ? [local.web_domain_name] : ["www.${local.web_domain_name}"]

  default_cache_behavior {
    allowed_methods   = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods    = ["GET", "HEAD"]
    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id = local.s3_origin_id
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.cert.arn
    ssl_support_method  = "sni-only"
  }
}

# if this zone is NOT for a subdomain, deploy a redirect bucket that redirects
# to www
// redirects requests to bucket "www.example.com"
resource "aws_s3_bucket" "no_www" {
  count = local.is_subdomain ? 0 : 1

  bucket = local.web_domain_name
  website {
    redirect_all_requests_to = "https://${aws_route53_record.www.0.fqdn}"
  }
}

# with a cf.
resource "aws_cloudfront_distribution" "no_www_web_dist" {
  count = local.is_subdomain ? 0 : 1

  enabled = true
  origin {
    domain_name = aws_s3_bucket.no_www.0.website_endpoint
    origin_id   = local.s3_origin_id
    custom_origin_config {
      # "HTTP Only: CloudFront uses only HTTP to access the origin."
      # "Important: If your origin is an Amazon S3 bucket configured
      # as a website endpoint, you must choose this option. Amazon S3
      # doesn't support HTTPS connections for website endpoints."
      origin_protocol_policy = "http-only"

      http_port  = "80"
      https_port = "443"

      # "If the origin is an Amazon S3 bucket, CloudFront always uses TLSv1.2."
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  aliases = [local.web_domain_name]

  default_cache_behavior {
    allowed_methods   = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods    = ["GET", "HEAD"]
    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id = local.s3_origin_id
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.cert.arn
    ssl_support_method  = "sni-only"
  }
}

# if this zone is NOT for a subdomain, create www to point to website cf
resource "aws_route53_record" "www" {
  count =  local.is_subdomain ? 0 : 1

  name    = "www"
  zone_id = data.aws_route53_zone.primary_zone.zone_id
  type    = "A"
  alias {
    name                    = aws_cloudfront_distribution.web_dist.domain_name
    zone_id                 = aws_cloudfront_distribution.web_dist.hosted_zone_id
    evaluate_target_health  = true
  }
}

# if this zone IS for a subdomain, point blank name to website cf
# if this zone is NOT for a subdomain, point blank name to redirect cf
resource "aws_route53_record" "no_www" {
  name    = ""
  zone_id = data.aws_route53_zone.primary_zone.zone_id
  type    = "A"
  alias {
    name                   = local.is_subdomain ? aws_cloudfront_distribution.web_dist.domain_name : aws_cloudfront_distribution.no_www_web_dist.0.domain_name
    zone_id                = local.is_subdomain ?  aws_cloudfront_distribution.web_dist.hosted_zone_id : aws_cloudfront_distribution.no_www_web_dist.0.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_ssm_parameter" "cf_web_dist_id" {
  name  = local.cf_ssm
  type  = "SecureString"
  value = aws_cloudfront_distribution.web_dist.id
}
