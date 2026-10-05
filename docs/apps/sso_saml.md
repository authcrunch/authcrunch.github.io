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

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Locate the implementation boundary</summary>

```text
Help me understand SAML application SSO: released status.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-sso-app, saml-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/apps/sso_saml

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare external SAML login with the portal’s AWS SAML SSO app feature. Trace
the assume-role handler in my installed release and current main. Identify
whether it issues a signed assertion or a placeholder response; do not treat
valid metadata or a visible role menu as working AWS federation.
```

</details>

<details>
<summary>Read an SSO declaration</summary>

```text
Help me understand SAML application SSO: released status.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-sso-app, saml-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/apps/sso_saml

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Annotate a synthetic AWS provider declaration: name, entity_id, driver, PEM
certificate, PKCS8 private key, and externally reachable location. Follow the
portal enablement and mount prefix. Explain parser acceptance, key loading,
metadata generation, and assertion issuance as separate checks.
```

</details>

<details>
<summary>Distinguish menu roles from cloud authorization</summary>

```text
Help me understand SAML application SSO: released status.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-sso-app, saml-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/apps/sso_saml

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain how aws/account_id/role_name values build menu choices. Compare portal
authentication, metadata access, role display, a signed SAML assertion, and
AWS trust policy evaluation. Inspect actual role checks rather than trusting
an admin-only comment. State which steps remain unimplemented in my version.
```

</details>

<details>
<summary>Inspect metadata without exposing keys</summary>

```text
Help me understand SAML application SSO: released status.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-sso-app, saml-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/apps/sso_saml

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me inspect public entity IDs, SSO locations, signing certificates, and
browser binding in generated metadata. Explain certificate versus private-key
handling and how a different portal prefix affects URLs. Keep test material
synthetic and distinguish a reachable authenticated metadata route from a
public metadata endpoint.
```

</details>

<details>
<summary>Choose an integration with evidence</summary>

```text
Help me understand SAML application SSO: released status.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-sso-app, saml-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/apps/sso_saml

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Given an application that needs real single sign-on, ask about its supported
protocols, account source, and deployed versions. Compare upstream SAML login,
supported downstream OIDC, and the partial AWS SAML app route. Identify the
evidence required before selecting an approach and avoid inventing assertion
or session-tag capabilities.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28handleHTTPAppsSSO%20OR%20ParseRequestURL%20OR%20ASSUME%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_sso_provider.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_sso_provider.go)
   — adapts SSO app names, AWS driver, locations, and key/certificate paths.
3. [caddy-security: caddyfile_sso_provider_test.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_sso_provider_test.go)
   — tests SSO app configuration adaptation.
4. [go-authcrunch: pkg/authn/handle_http_apps_sso.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_http_apps_sso.go)
   — handles the authenticated SSO menu, metadata, and assume-role placeholder.
5. [go-authcrunch: pkg/sso/provider.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/sso/provider.go)
   — loads SSO certificate and private-key material and constructs metadata.
6. [go-authcrunch: pkg/sso/metadata.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/sso/metadata.go)
   — defines the generated SAML IdP metadata structure.
7. [go-authcrunch: pkg/sso/request.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/sso/request.go)
   — parses provider and assume-role targets from portal URLs.
