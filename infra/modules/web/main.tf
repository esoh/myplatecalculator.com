terraform {
  required_version = "~> 0.13"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.20.0"
    }
  }
}

resource "aws_s3_bucket" "web_bucket" {
  bucket = local.web_host_bucket_name
  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::${local.web_host_bucket_name}/*"
            ]
        }
    ]
}
POLICY

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

locals {
  s3_origin_id = "primaryS3"
}

