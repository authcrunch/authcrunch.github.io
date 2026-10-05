---
sidebar_position: 1
title: "SAML application SSO: released status"
description: "Understand the implemented AWS SSO metadata and menu, and the unimplemented assertion-issuance boundary."
discovery:
  topic: applications-and-sso
  kind: reference
  aliases: ["AWS federation", "AWS console", "SAML IdP", "assume role", "SSO"]
---

# AWS console SSO with SAML

**AWS console federation is not a complete supported flow in the released Caddy Security v1.3.0 / go-authcrunch v1.3.8 runtime.** The `sso provider` configuration, metadata generation and role menu exist, but the assume-role handler returns the literal body `ASSUME ROLE`. It does not create, sign or submit the SAML assertion required by AWS. The same handler remains incomplete in standalone go-authcrunch v1.3.11.

For a working application integration, use [portal JWT authorization](../authorize/getting-started.md), [direct OAuth policies](../authorize/direct-oauth.md) or the released [OIDC provider](oidc-provider.md). For users signing into AuthCrunch through Entra/JumpCloud, use [upstream SAML identity providers](../authenticate/saml/10-saml.md); that is a separate, implemented flow.

## AWS SSO

AWS accepts SAML assertions from a configured identity provider, including permitted IAM role/provider ARN pairs. Its [console federation procedure](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_enable-console-saml.html) describes that AWS-side protocol. Configuring an AuthCrunch metadata document does not implement the missing assertion issuance or grant an AWS console session.

The released AuthCrunch routes under a portal mounted at `/auth/` are:

| Route | Implemented behavior |
| --- | --- |
| `/auth/apps/sso/aws` | Role-selection menu for an authenticated, cached portal session |
| `/auth/apps/sso/aws/metadata.xml` | XML metadata with the configured entity ID, signing certificate and locations |
| `/auth/apps/sso/aws/assume/<account>/<role>` | Placeholder response; no AWS SAML assertion |

The menu recognizes roles shaped as `aws/<account>/<role>`. It does not turn these values into AWS permissions. The metadata route also requires a live portal session. Despite a source comment calling it admin-only, the handler does not add an admin-role check; do not treat that comment as an access-control guarantee.

### Configuration

For inspecting the implemented metadata/menu only, define and enable a provider:

```caddyfile
sso provider aws {
  entity_id urn:authcrunch:aws
  driver aws
  private key /etc/authcrunch/sso/signing-key.pem
  cert /etc/authcrunch/sso/signing-cert.pem
  location https://auth.example.com/auth/apps/sso/aws
}
```

Add `enable sso provider aws` inside the portal. The only released driver is `aws`. The private key must use a PKCS#8 PEM `PRIVATE KEY` block; the certificate uses a PEM `CERTIFICATE` block. A generated key or downloadable XML does not make the assume-role endpoint functional.

Keep private key material outside published assets and restrict access to the service account. Do not deploy this partial flow as your AWS login solution or promise session-duration/session-tag controls that the handler does not issue.

The implementation boundary is visible in [the released handler](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/pkg/authn/handle_http_apps_sso.go) and [metadata implementation](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/pkg/sso/metadata.go). Track implementation and a tested signed-assertion flow before revising the support claim.
