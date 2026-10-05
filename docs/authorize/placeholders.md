---
sidebar_position: 14
description: "Look up user metadata placeholders available to Caddy after authorization."
discovery:
  topic: authorization
  kind: reference
  aliases: ["variables", "logging"]
---

# Caddy Placeholders

After successful `authorize`, Caddy exposes the policy's normalized identity
through these placeholders. Values may be absent when the authenticated source
does not supply them. They are not available as trusted identity before the
policy runs or on a public bypass.

## Available Placeholders

| Placeholder | Meaning |
| --- | --- |
| `{http.auth.user.id}` | Identity selected by [set user identity](identity.md) |
| `{http.auth.user.claim_id}` | JWT `jti`, identifying this token/session claim set |
| `{http.auth.user.sub}` | JWT subject |
| `{http.auth.user.roles}` | Normalized roles, separated by spaces |
| `{http.auth.user.email}` | Email claim |
| `{http.auth.user.name}` | Display-name claim |
| `{http.auth.user.issuer}` | JWT `iss`; for a portal token this is the portal issuer |
| `{http.auth.user.origin}` | Authentication source/origin claim |
| `{http.auth.user.realm}` | Realm supplied by the identity |
| `{http.auth.user.username}` | `userinfo.preferred_username`, when present |

A token's claim ID changes with token issuance; it is not a permanent account
ID. A subject's namespace belongs to its issuer/realm. Avoid conflating tokens
from different issuers merely because their `sub` strings match.

## Passing User Info to an Upstream App

`header_up` belongs inside `reverse_proxy`, not directly in a route or global
options block:

```Caddyfile
app.example.com {
    route {
        authorize with apppolicy
        reverse_proxy 127.0.0.1:8080 {
            header_up X-User-ID {http.auth.user.id}
            header_up X-User-Roles {http.auth.user.roles}
        }
    }
}
```

Define `apppolicy` in the existing global security block. These assignments
replace incoming values for the named headers. The backend must accept trusted
identity only from this proxy and must not be publicly reachable through a
route that bypasses authorization. See [Caddy's header_up reference](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy#headers)
and [automatic claim headers](headers.md).
