---
sidebar_position: 7
description: "Match the source address of a request against the IP address recorded in its token."
discovery:
  topic: authorization
  kind: reference
  aliases: ["IP filtering", "validate source address"]
---

# IP Address Filtering

`validate source address` requires the request's source address to equal the
`addr` claim in the accepted token. It is an additional binding check, not a
network allowlist and not proof that a device is trusted.

```Caddyfile
# Inside an authorization policy:
validate source address
allow roles app/member
```

The issuer must record the source address. In a portal, `enable source ip tracking`
enables this token claim. A missing or mismatched claim fails validation.
Configure the issuer and gatekeeper to interpret source addresses consistently.

Behind a reverse proxy, trust only known proxy hops and normalize forwarded
headers. Otherwise an arbitrary forwarded address can defeat the intended
binding or lock out legitimate users. See [deployment diagnostics](../operations/logging.md).

A user's address can change with mobile networks, VPNs, NAT, and IPv4/IPv6
selection. Test those transitions before enabling this rule for a browser
application. To restrict a management endpoint to a CIDR, use an appropriate
Caddy request matcher rather than this token-equality feature.
