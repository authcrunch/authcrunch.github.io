---
title: Reference
description: "Entry points for AuthCrunch Caddyfile configuration, authorization rules, token handling, APIs, and version checks."
discovery:
  topic: operations
  kind: reference
  aliases: ["configuration", "directives"]
  listed: false
---

# Reference

Use these pages when you know which setting or interface you need. For a complete
working example, start with [Protect your first app](start/first-app.md).

## Caddyfile configuration

AuthCrunch's named stores, portals, and policies belong inside the global
`security` block. The `authenticate` and `authorize` handlers connect them to
routes in a site block.

| Area | Reference |
| --- | --- |
| Portal configuration | [First portal configuration](start/first-app.md#1-create-the-configuration) |
| Local identities | [Identity store](authenticate/local/20-identity-store.md) and [static users](authenticate/local/50-static-users.md) |
| OAuth / OIDC identity providers | [Provider settings](authenticate/oauth/81-backend-oauth2-0000-generic.md) and [endpoint configuration](authenticate/oauth/82-backend-oauth2-endpoint.md) |
| User mapping | [Transforms](authenticate/42-user-transforms.md) |
| Login requirements | [Authentication challenges](authenticate/13-authentication-challenges.md) |
| Policy syntax | [Authorization syntax](authorize/syntax.md) |
| Access rules | [Roles and claims](authorize/acl-rbac.md) and [paths](authorize/path-acl.md) |
| Request identity | [Headers](authorize/headers.md) and [placeholders](authorize/placeholders.md) |

For Caddy itself, use the official [Caddyfile concepts](https://caddyserver.com/docs/caddyfile/concepts)
and [`route` reference](https://caddyserver.com/docs/caddyfile/directives/route).
Handler order determines whether an access check runs before the application.

## Tokens and cookies

- [Cookie settings](authenticate/auth-cookie.md)
- [Token discovery](authorize/token-discovery.md)
- [Token verification](authorize/token-verification.md)
- [Generate an ECDSA key](authorize/encryption.md)
- [Logout](authenticate/15-logout.md)
- [Refresh sessions](authenticate/30-refresh-token.md)
- [Persistent runtime state](operations/runtime-state.md)

## Application sign-in models

- [Direct OAuth authorization](authorize/direct-oauth.md) for provider sign-in without a portal.
- [AuthCrunch as an OpenID Provider](apps/oidc-provider.md) for relying applications using local accounts.

## APIs

Begin with the [API overview](authenticate/api/10-api.md), then select the
interface that matches your caller:

- [Portal API](authenticate/api/20-portal-api.md)
- [Server API](authenticate/api/40-server-api.md)
- [System API](authenticate/api/50-system-api.md)

API permissions and authentication requirements are endpoint-specific. A portal
login alone does not establish administrative API access.

## Executable and versions

The bundled executable is named `authcrunch`; a custom Caddy build may be named
`caddy`. Use the actual executable path when running these commands:

```sh
./bin/authcrunch version
./bin/authcrunch security version
./bin/authcrunch list-modules
./bin/authcrunch security --help
```

`version` reports Caddy's version; `security version` reports the AuthCrunch
library version. The [installation guide](start/install.md) identifies the
bundle used in the learning path. Check the
[release notes](https://github.com/greenpau/caddy-security/releases) before
using configuration from a different version.

See [Feature availability and versions](operations/versions.md) for the
distinction between the released integration and newer library features, and
[Authentication logging](operations/logging.md) for diagnostic controls.
