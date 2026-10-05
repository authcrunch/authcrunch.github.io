---
title: "Nextcloud OAuth2 compatibility boundary"
description: "Understand why an accepted Nextcloud driver name does not establish native Nextcloud account login."
discovery:
  topic: identity-providers
  kind: reference
  aliases: ["Nextcloud", "OAuth2", "opaque access token", "native Nextcloud login"]
---

# Nextcloud OAuth2 compatibility boundary

The released configuration recognizes `driver nextcloud` and derives `/apps/oauth2/authorize` and `/apps/oauth2/api/v1/token` from `base_auth_url`. That endpoint configuration is **not a complete native Nextcloud identity-login integration**.

Nextcloud's [native OAuth2 documentation](https://docs.nextcloud.com/server/35/admin_manual/configuration_server/oauth2.html) describes confidential clients and bearer access to the account. It does not establish an OIDC ID-token/discovery contract. Its account access tokens are not a restricted identity-only grant; do not treat an `email` scope in AuthCrunch configuration as proof of limited Nextcloud permissions.


## Locate the incomplete native login boundary

Native OAuth account access and OIDC identity processing are different contracts.

| What happens | What it proves | What is missing in this driver |
| --- | --- | --- |
| Nextcloud driver name adapts | Endpoint configuration exists | A complete account identity consumer |
| Authorization code produces an opaque account token | OAuth access can be issued | A required OIDC ID-token contract |
| Required-token settings are changed | The field requirement changes | Verified identity claims from the opaque token |
| A separate real OIDC issuer is configured | The generic OIDC model can be evaluated | Automatic conversion of native Nextcloud OAuth into OIDC |

## The released gap

In Caddy Security v1.3.0 / go-authcrunch v1.3.8:

- The Nextcloud driver defaults to requiring `id_token` and `access_token`, while native Nextcloud OAuth2 does not provide the required OIDC identity-token flow.
- The driver does not implement a Nextcloud account/profile request that converts an opaque access token into a portal identity.
- Changing `required_token_fields` to only `access_token` does not make an opaque token supply verified identity claims.
- Generic OIDC UserInfo extraction requires the generic driver, the `openid` scope and a discovered UserInfo endpoint; it is not a Nextcloud-specific OCS account fetch.

Therefore there is no canonical working native Nextcloud login recipe here. Accepted syntax or an authorization redirect alone does not prove completed portal authentication. The same missing profile integration remains in the audited standalone v1.3.11 source.

## Choose a complete integration

If a separately configured service provides real OIDC identity for your users, connect its issuer using [generic OIDC](81-backend-oauth2-0000-generic.md) and verify its [token trust](83-oidc-trust.md). Otherwise use a documented local, LDAP, OAuth/OIDC or SAML identity source for the portal. Protecting a Nextcloud application behind a proxy also requires reviewing that application's own authentication/API requirements; placing a portal in front does not configure Nextcloud accounts or OAuth clients automatically.

Validate a fresh login and both allowed and denied application requests before treating any custom bridge as supported. Keep native Nextcloud account tokens private, and do not reuse token-response examples as application credentials.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Identify the incomplete boundary</summary>

```text
Help me understand Nextcloud OAuth2 compatibility boundary.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0014-nextcloud

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Trace what the native Nextcloud driver configures and what identity-login step
is absent in the audited release. Compare OAuth account access with OIDC
discovery/ID-token identity. Do not turn accepted endpoints into a claimed
working portal integration.
```

</details>

<details>
<summary>Explain opaque-token limitations</summary>

```text
Help me understand Nextcloud OAuth2 compatibility boundary.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0014-nextcloud

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare changing required_token_fields with actually deriving a verified
subject/profile. Explain why an opaque access token does not become identity
claims and why generic UserInfo is not a Nextcloud-specific OCS fetch. Inspect
current source before assuming the gap is fixed.
```

</details>

<details>
<summary>Review alternative integration choices</summary>

```text
Help me understand Nextcloud OAuth2 compatibility boundary.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0014-nextcloud

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me compare a documented external OIDC provider/compatible Nextcloud app
with native Nextcloud OAuth2. Ask what service must authenticate whom and what
account permissions the token carries. Consult official Nextcloud requirements
before recommending a specific supported path.
```

</details>

<details>
<summary>Diagnose without weakening trust</summary>

```text
Help me understand Nextcloud OAuth2 compatibility boundary.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0014-nextcloud

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me classify missing id_token, unsupported identity retrieval, endpoint
failure, and absent claims using redacted responses. Do not recommend
disabling token verification or inventing an x509/profile directive to
complete the flow. State the upstream evidence needed for a fix.
```

</details>

<details>
<summary>Design an acceptance gate</summary>

```text
Help me understand Nextcloud OAuth2 compatibility boundary.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0014-nextcloud

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Define proof required before advertising native Nextcloud login: verified
identity retrieval, stable subject, appropriate permissions, member/nonmember
access, and failure tests. Compare this with adaptation/redirect success and
label unavailable behavior rather than writing a speculative recipe.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28nextcloud%20OR%20required_token_fields%20OR%20fetchClaims%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_identity_provider_oauth.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_identity_provider_oauth.go)
   — adapts OAuth/OIDC provider settings, scopes, endpoints, and trust options.
3. [go-authcrunch: pkg/idp/oauth/config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/idp/oauth/config.go)
   — validates generic and named-driver defaults and endpoint settings.
4. [go-authcrunch: pkg/idp/oauth/provider.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/idp/oauth/provider.go)
   — loads discovery metadata, provider readiness, and driver setup.
5. [go-authcrunch: pkg/idp/oauth/user.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/idp/oauth/user.go)
   — fetches and normalizes named-provider profile, membership, and identity data.
6. [go-authcrunch: pkg/idp/oauth/authenticate.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/idp/oauth/authenticate.go)
   — handles authorization callbacks, token exchange, and identity completion.
7. [go-authcrunch: pkg/idp/oauth/config_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/idp/oauth/config_test.go)
   — tests generic/named provider configuration and validation.
