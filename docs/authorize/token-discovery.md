---
sidebar_position: 6
description: "Choose where an authorization policy looks for tokens and the order in which sources are checked."
discovery:
  topic: sessions-and-cookies
  kind: reference
  aliases: ["Authorization header", "cookie", "query", "Bearer"]
---

# Token Discovery

An authorization policy's default source order is **cookie → header → query**.
It selects the first discovered credential; an invalid credential from an
earlier source is not permission to try a different identity from a later one.
Keep a client's authentication source deliberate.

Configure these fragments inside the existing `authorization policy`:

```Caddyfile
# Browser applications: accept the portal cookie only.
set token sources cookie
```

```Caddyfile
# API clients: accept Authorization headers and explicit bearer syntax.
set token sources header
validate bearer header
```

```Caddyfile
# Mixed clients, with headers taking precedence.
set token sources header cookie
validate bearer header
```

`cookie`, `header`, and `query` may each occur once; their order is significant.
Bearer is a format of the header source, not a fourth source name. A policy
needs `validate bearer header` to accept `Authorization: Bearer TOKEN`; the
portal's own API validator already enables that form.

## Credential names

The default accepted access cookie names include `AUTHP_ACCESS_TOKEN`,
`access_token`, and `jwt_access_token`. Named Authorization entries and query
parameters include `access_token` and `jwt_access_token`. A named header uses
`Authorization: access_token=TOKEN`, not a header literally named access_token.

For a portal using a custom cookie prefix or name, configure the policy to match:

```Caddyfile
set access_token cookie name MYAPP_ACCESS_TOKEN
set session_id cookie name MYAPP_SESSION_ID
```

Multiple accepted access cookie names belong on one line. The session cookie
setting accepts one name. Custom access names also add lowercase names to the
named-header/query lookup. `crypto key token name` concerns keystore token
configuration; it is not a substitute for selecting the gatekeeper's accepted
cookie names.

## Exercise the intended source

```bash
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer ${AUTHCRUNCH_ACCESS_TOKEN}" \
  https://app.example.com/private
```

For browser tests, inspect the cookie's domain, path, Secure flag, and exact
name. A cookie scoped to the portal hostname cannot authenticate a sibling
hostname unless your deployment deliberately provides compatible scope.
Avoid query tokens in new integrations: URLs can enter histories, logs, and
referrers. If a legacy client requires them, limit that source to the relevant
policy and use [token stripping](headers.md#strip-jwt-token-from-http-request).
