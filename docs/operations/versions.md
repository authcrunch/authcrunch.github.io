---
title: "Feature availability and versions"
description: "Distinguish the released Caddy bundle, its bundled AuthCrunch library, and newer features visible in source checkouts."
discovery:
  topic: operations
  kind: reference
  aliases: ["release", "version", "unreleased", "compatibility"]
---

# Feature availability and versions

A Caddy integration release and a go-authcrunch library release are different
artifacts. Installing a newer standalone library does not update the dependency
inside a previously built Caddy executable.

As checked on **October 5, 2026**, the latest published Caddy integration is
[caddy-security v1.3.0](https://github.com/greenpau/caddy-security/releases/tag/v1.3.0),
whose [go.mod](https://github.com/greenpau/caddy-security/blob/v1.3.0/go.mod)
pins **go-authcrunch v1.3.8**. The standalone library has separately released
[v1.3.11](https://github.com/greenpau/go-authcrunch/releases/tag/v1.3.11).
These guides use the published Caddy bundle unless they state another boundary.

## Check the executable you run

```sh
authcrunch version
authcrunch security version
authcrunch list-modules
```

The first reports Caddy, the second the AuthCrunch library, and the third the
compiled modules. For a custom build named `caddy`, use that executable instead.
Keep its integration revision too: the library version alone does not prove
that an adapter exposes a new directive.

## Features in the released bundle

| Capability | Documentation |
| --- | --- |
| Local, LDAP, OAuth/OIDC and SAML login | [Authentication overview](../authenticate/intro.md) |
| Local MFA and ordered challenge policies | [MFA](../authenticate/11-mfa.md) and [challenges](../authenticate/13-authentication-challenges.md) |
| Rotating local refresh sessions | [Refresh sessions](../authenticate/30-refresh-token.md) |
| Completed-session and generated-key persistence | [Runtime state](runtime-state.md) |
| Provider login directly in an app policy | [Direct OAuth](../authorize/direct-oauth.md) |
| AuthCrunch serving relying parties as an OIDC provider | [OIDC provider](../apps/oidc-provider.md) |
| Bundled local management CLI and reusable Go login client | [CLI](local-client.md) and [Go client](authclient.md) |
| Argon2id and bcrypt local passwords | [Password management](../authenticate/local/30-password-management.md) |
| Numeric GitHub IDs and organization transforms | [GitHub](../authenticate/oauth/81-backend-oauth2-0007-github.md) |
| Diagnostic message filtering | [Logging](logging.md) |
| Explicit administrative API permissions and private-key export | [Server API](../authenticate/api/40-server-api.md) |
| RSA, EC, and Ed25519 public signing-key JWKS | [Token verification](../authorize/token-verification.md) |
| Header/query/Basic/API-key credential stripping | [Identity headers](../authorize/headers.md) |

## Partial application SAML support

[AWS application SSO](../apps/sso_saml.md) has metadata and a role menu, but its
assume-role handler does not issue a SAML assertion in either the released
bundle or standalone v1.3.11. Upstream SAML login is implemented separately.
Do not infer complete AWS federation from accepted `sso provider` syntax.

## Newer library and integration work

The current Caddy source checkout contains changes after v1.3.0:

| Feature | Library availability | Released Caddy bundle |
| --- | --- | --- |
| [Typed policy-local custom ACL fields](../authorize/custom-fields.md) | go-authcrunch v1.3.9 and later | Not in v1.3.0; Caddy integration is unreleased |
| Correct unconditional/default ACL evaluation | go-authcrunch v1.3.11 | Not in v1.3.0; see the [released limitation](../authorize/acl-rbac.md#match-any-condition) |
| [Optional cross-device browser login](../authenticate/cross-device.md) | go-authcrunch v1.3.11 | Not in v1.3.0; Caddy integration is unreleased |

Treat configuration for those features as a preview for a matching custom
integration build. Do not paste it into v1.3.0 and expect parser support. Verify
the next release's dependency and adapter before adopting it.

## Upgrade deliberately

Read the relevant release notes, validate the configuration with the replacement
binary, and test login, allowed access, denied access, logout and session behavior.
Persistent-state deployments require a stop/start handover. Regenerate adapted
JSON from the Caddyfile when adopting direct OAuth, rather than carrying forward
an old authorization-handler representation.
