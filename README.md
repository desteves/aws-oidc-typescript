# aws-oidc-typescript 🚧🦺🏗️ WORK IN PROGRESS

A Pulumi template to create required AWS resources to set up ESC in the Pulumi Cloud.

The template lives in the `infra/` subfolder


To get your thumbprint quickly, run:

```bash
# Replace the OIDC IdP URL with yours
docker run --platform linux/amd64  nullstring/oidc-thumbprint-finder https://api.pulumi.com/oidc
```

To use the template

```bash
# copy the template
pulumi new desteves/aws-oidc-typescript/infra --dir aws-oidc-typescript
# complete the prompts

# create the resources
pulumi up --cwd aws-oidc-typescript --yes
```

To validate is properly configured, use the `test/` 🚧🦺🏗️

```bash
# copy the template
pulumi new desteves/aws-oidc-typescript/infra --dir test-aws-oidc

pulumi up --cwd test-aws-oidc --yes
pulumi destroy --cwd test-aws-oidc --yes
pulumi rm --cwd test-aws-oidc --yes
```

## Reference Material

Based on the Python version at
https://github.com/pulumi/examples/tree/master/aws-py-oidc-provider-pulumi-cloud#readme
so follow those instructions!