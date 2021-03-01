output "cf_web_dist_id" {
  value       = aws_cloudfront_distribution.web_dist.id
  description = "Cloudfront Distribution ID for web bucket"
}
