output "nameservers" {
  value       = aws_route53_zone.primary_zone.name_servers
  description = "Name servers of the hosted zone."
}
