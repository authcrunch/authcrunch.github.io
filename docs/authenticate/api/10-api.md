---
description: "Choose the portal, local profile, administrator, or encrypted System API and understand its authentication boundary."
discovery:
  topic: operations
  kind: reference
  aliases: ["REST", "JSON", "API endpoints"]
---

# API Overview

AuthCrunch has four API families. Choose one by the task and caller; a token
that can enter an application does not automatically grant account management
or server administration.

| Family | Use it for | Authentication |
| --- | --- | --- |
| [Portal](20-portal-api.md) | Login challenges, identity claims, expiry checks | Login challenge credentials; a valid access token for identity checks |
| [Profile](30-profile-api.md) | Manage the signed-in local user's password, authenticators, and keys | A live local portal session with `authp/user` or `authp/admin` |
| [Server](40-server-api.md) | Inspect stores and administer users | Explicitly enabled admin API and `authp/admin` |
| [System](50-system-api.md) | Authenticate Basic credentials or API keys from another gatekeeper | An encrypted message using a shared System key and matching key ID |

All paths are relative to the configured portal mount. If the portal is mounted
at `/auth`, `/api/server/info` means **`/auth/api/server/info`**. It is not an
endpoint at the site's root. Examples use `https://auth.example.com/auth`.

Use `Accept: application/json` when calling the Portal API. Profile and Server
request bodies use JSON; System requests contain encrypted PASETO text. Unsafe
requests with an `Origin` header must match the portal's public origin. Native
clients may omit browser-origin headers; this does not waive authentication.
Configure an upstream proxy to normalize forwarded host and scheme information
rather than trusting arbitrary client headers.

The references target [Caddy Security v1.3.0 and its bundled library](../../operations/versions.md).
The [refresh-session endpoints](../30-refresh-token.md) have their own transport,
rotation, and logout requirements. [OIDC provider endpoints](../../apps/oidc-provider.md)
implement a separate protocol and credential lifecycle.
