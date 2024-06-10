# aws-oidc-typescript Pulumi template

A Pulumi template to quickly create AWS OIDC resources + configure a Pulumi Cloud ESC Environment with such.

*Last update: February 2024*

- The template lives in the `infra/` subfolder.
- To test the template clone the `test/` subfolder.

## Thumbprint OIDC finder

To get your thumbprint quickly, run:

```bash
# Replace the OIDC IdP URL with yours
docker run --platform linux/amd64  nullstring/oidc-thumbprint-finder https://api.pulumi.com/oidc
```

## To use the template to **CREATE** all the resources

```bash
# copy the template (feel free to change the output dir)
$ OUTPUT_DIR=aws-oidc-typescript
$ pulumi new https://github.com/desteves/aws-oidc-typescript/infra --dir ${OUTPUT_DIR} --force
# complete the prompts

# create the resources
$ pulumi up --cwd ${OUTPUT_DIR} --yes

# clean up
$ pulumi destroy --cwd ${OUTPUT_DIR} --yes --remove
```


## To use the template to **TEST** all the resources

```bash
# copy the template (feel free to change the output dir)
$ OUTPUT_DIR=example
$ pulumi new https://github.com/desteves/aws-oidc-typescript/example --dir ${OUTPUT_DIR} --force
# complete the prompts

# create the resources
$ pulumi up --cwd ${OUTPUT_DIR} --yes

# clean up
$ pulumi destroy --cwd ${OUTPUT_DIR} --yes --remove
```
