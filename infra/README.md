# infra
1. `cd` into a config module
1. `terragrunt apply/plan"`

# Deploy

1. Register domain name
1. Create the SSM params for `<prefix>/prod/web/HOST_BUCKET` and `<prefix>/prod/web/DOMAIN_NAME` (Make sure `HOST_BUCKET` is `www.DOMAIN_NAME`!)
1. Deploy `web` to deploy web bucket
1. Deploy `dns-zone` to deploy hosted zone. Connect output nameservers to domain name
1. Deploy `routing` to create certs and connect everything to https
