---
title: "Portal operations notes"
description: "Notes on privileged ports, source IP tracking, and authentication portal configuration details."
discovery:
  topic: operations
  kind: reference
  aliases: ["source address", "setcap"]
---

# Portal operations notes

Use the [version reference](../operations/versions.md) to identify the executable
and bundled library before investigating behavior. Runtime files, forwarding
headers and session ownership affect authentication independently of site layout.

## Binding to Privileged Ports

On Linux, follow your service manager's supported Caddy installation and
capability configuration. A binary capability can permit ports 80/443:

```sh
sudo setcap cap_net_bind_service=+ep /usr/local/bin/authcrunch
getcap /usr/local/bin/authcrunch
```

Use the actual installed path; this is not a deployment script. Replacing a
binary can remove its capabilities. Do not delete the installation directory
or run the whole authentication service as root merely to bind a port. A
higher-port listener behind a controlled frontend is another option.

## Recording Source IP Address in JWT Token

Inside an otherwise working portal and its policy:

```caddyfile
authentication portal myportal {
    enable identity store localdb
    enable source ip tracking
}

authorization policy apppolicy {
    validate source address
    allow roles app/member
}
```

This records a source address and compares it on protected requests. It is useful
only when both handlers see the same normalized, trustworthy client address.
Mobile networks, VPN changes and different proxy paths can invalidate legitimate
requests. It is not a replacement for authentication or token revocation.

The released address helper reads `X-Real-IP`, then `X-Forwarded-For`, then the
connection address. It also reads forwarding host/protocol headers when building
URLs. Syntax validation is **not** proof that those headers came from your proxy.
At a public edge, remove client-supplied forwarding headers before these handlers;
behind a proxy, admit requests only from the trusted frontend and have it replace
the headers with canonical values. Do not assume Caddy's separate trusted-proxy
setting automatically rewrites every header read by AuthCrunch.

Test spoofed forwarding headers, direct backend reachability and both IPv4/IPv6
before depending on [source-address filtering](../authorize/ip-filter.md).

## Session ID Cache

A portal's live session cache associates completed login with claims and backend
evidence. Account management needs that live context, not just a correctly signed
JWT. Thus a token may authorize an application while being insufficient for a
local profile operation.

[Persistent runtime state](../operations/runtime-state.md) can retain completed
sessions across a controlled stop/start. Without it, a restart can lose profile
session context even when an explicit JWT key still verifies older tokens.
Persistence is single-owner storage, not shared active/active session replication.

## Shortcuts

Prefer explicit named store/provider definitions and portal selections. Legacy
positional shortcuts hide realm and callback details and do not produce a complete
deployment on their own. Use the maintained
[local example](../start/first-app.md),
[generic OIDC example](oauth/81-backend-oauth2-0000-generic.md), or
[LDAP guide](ldap/10-ldap.md) for the corresponding boundary.

## Auto-Redirect URL

The policy's `set auth url` selects where anonymous requests begin login. The
portal's trusted `redirect_url` mechanism returns to a permitted application;
its default temporary cookie is `AUTHP_REDIRECT_URL`.

The separate `ui { auto_redirect_url ... }` setting chooses a configured portal
landing destination. It does not register OAuth callbacks, grant application
roles or create a trust rule for arbitrary return URLs. Review
[trusted redirects](100-trust-login-logout.md) and test the complete browser flow.

For renewal, storage and diagnostics, use [refresh sessions](30-refresh-token.md),
[runtime state](../operations/runtime-state.md) and [logging](../operations/logging.md).
