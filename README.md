# aws-oidc-typescript 🚧🦺🏗️ WORK IN PROGRESS

A Pulumi template to quickly create AWS resources for AWS OIDC in a new Pulumi Cloud ESC Environment

The template lives in the `infra/` subfolder


To get your thumbprint quickly, run:

```bash
# Replace the OIDC IdP URL with yours
docker run --platform linux/amd64  nullstring/oidc-thumbprint-finder https://api.pulumi.com/oidc
```

To use the template

```bash
# copy the template (feel free to change the output dir)
pulumi new https://github.com/desteves/aws-oidc-typescript/infra --dir test --force
# complete the prompts

# create the resources
pulumi up --cwd test --yes

# clean up
pulumi destroy --cwd test --yes --remove
```

## Reference Material

Based on the Python version at
https://github.com/pulumi/examples/tree/master/aws-py-oidc-provider-pulumi-cloud#readme
so follow those instructions!
