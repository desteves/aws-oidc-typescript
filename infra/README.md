# aws-oidc-typescript Pulumi template

A Pulumi template to quickly **create** AWS OIDC resources + configure a Pulumi Cloud ESC Environment with such.

*Last update: February 2024*

## Thumbprint OIDC finder

To get your thumbprint quickly, run:

```bash
# Replace the OIDC IdP URL with yours
docker run --platform linux/amd64  nullstring/oidc-thumbprint-finder https://api.pulumi.com/oidc
```
