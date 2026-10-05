---
sidebar_position: 11
title: "Identity headers"
description: "Pass token claims to downstream applications in HTTP headers and strip authentication data."
discovery:
  topic: authorization
  kind: reference
  aliases: ["X-Token", "inject header", "reverse proxy"]
---

# Identity headers

Pass only the identity data the backend needs. Run authorization before the
proxy and keep the backend reachable only through the trusted proxy path;
otherwise a client can bypass the policy and send its own identity headers.

## Pass JWT Token Claims in HTTP Request Headers

### Auto-Defined Headers

```Caddyfile
# Inside the policy:
inject headers with claims
```

After successful authorization, the policy injects available claims:

| Header | Claim |
| --- | --- |
| `X-Token-Subject` | `sub` |
| `X-Token-User-Name` | `name` |
| `X-Token-User-Email` | `email` |
| `X-Token-User-Roles` | Normalized roles, separated by spaces |

Configured destination headers are cleared before authentication, including
deny and bypass paths. This prevents a client-supplied value from surviving as
trusted identity. A bypassed request does not get an authenticated user.

### Custom Headers

```Caddyfile
inject header X-User-Email from email
inject header X-Picture from picture
```

Map only claims whose source and meaning the application understands. A
profile picture or email value is not proof of application membership, email
verification, or administrator status.

#### Nested Data Source

Use `|` to traverse a nested claim:

```Caddyfile
inject header X-User-Timezone from "userinfo|zoneinfo"
inject header X-User-Groups from "userinfo|custom_groups"
```

String arrays are rendered as comma-separated values for custom injection.
Check the actual response to your upstream, including absent/malformed claim
values; do not build an authorization decision around a display-format guess.
Prefer normalized application roles for permissions. Custom header traversal
is separate from the [typed ACL field registration](custom-fields.md) available
only in newer library/adapter versions.

## Strip JWT Token from HTTP Request

```Caddyfile
enable strip token
```

The released implementation supports more than cookies:

| Accepted source | Removed before the downstream handler |
| --- | --- |
| Cookie | Matching accepted token cookie; unrelated cookies remain |
| Bearer or named Authorization entry | Matching token entry; unrelated entries remain |
| Basic | Basic Authorization entries |
| API-key header | Configured API-key header |
| Query | Accepted token value; unrelated parameters remain |

This removes a credential from the **forwarded request**. It does not delete the
browser cookie, revoke a token, or log the user out. It also does not strip every
possible credential a client could attach. For an upstream that should never
receive an Authorization header, use an explicit proxy header rule such as
`header_up -Authorization` in the `reverse_proxy` block.

See [Caddy placeholders](placeholders.md) for an alternative that lets the proxy
construct a small explicit identity-header set.
