install-terra-env:
	@chmod 755 scripts/install_terra_env
	./scripts/install_terra_env

set-terra-versions:
	@chmod 755 ~/.tfenv/bin/terraform
	@chmod 755 ~/.tgenv/bin/terragrunt
	@tfenv install
	@tgenv install
	@tfenv use $(shell cat .terraform-version)
	@tgenv use $(shell cat .terragrunt-version)
