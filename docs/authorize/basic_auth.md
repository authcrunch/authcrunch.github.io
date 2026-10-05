---
sidebar_position: 14
description: "Authenticate protected requests with a username, password, and realm."
discovery:
  topic: authorization
  kind: guide
  aliases: ["HTTP Basic", "curl"]
---

# Basic Authentication

HTTP Basic sends an account username and password with each request. Use HTTPS,
a specific application role, and a policy suitable for machine/API callers.
It does not run an interactive MFA ceremony.

Inside the existing authorization policy:

```Caddyfile
with basic auth portal myportal realm local
disable auth redirect
allow roles app/member
```

`myportal` is a portal on the same instance with the selected store enabled.
Released remote authentication is also supported: replace the name with the
portal HTTPS base URL and configure matching [System keys](../authenticate/api/50-system-api.md)
on both services. It is no longer a future feature.

## Usage

```bash
curl --fail-with-body --silent --show-error \
  -H 'X-Auth-Realm: local' --user alice \
  https://app.example.com/api/report
```

Omitting the password from `--user alice` lets curl prompt instead of putting
it in shell history. Send the configured realm even when only one is declared.
A valid password must still satisfy the portal's direct-authentication challenge
boundary and the policy's ACL. An identity requiring another factor cannot
satisfy that requirement merely by using Basic. Use interactive login and
an appropriate session/token for MFA-protected access.

Recognized invalid credentials return `401`; an authenticated nonmember is
forbidden. Missing or unrecognized credentials use the policy's ordinary
missing-authentication behavior. Keep denied tests alongside a successful call.

## Setting Default Realm

If this route is deliberately tied to one realm, replace the incoming selector
before authorization. Do not append another header value:

```Caddyfile
route /api/* {
    request_header X-Auth-Realm local
    authorize with apipolicy
    reverse_proxy 127.0.0.1:8080
}
```

This is a site-block fragment, with `apipolicy` defined in global security
options. On a multi-realm route, keep the explicit permitted realm selection
instead of forcing a default.

## Multiple Realms

```Caddyfile
# Inside the policy:
with basic auth portal myportal realm userpool1.localdomain
with basic auth portal myportal realm userpool2.localdomain
allow roles app/member
```

The portal must enable both stores, each with a distinct configured realm.
Each request selects one using `X-Auth-Realm`. Accounts with the same username
in different stores are different identities; keep the realm in application
account mapping when it matters.

<figure className="doc-screenshot">

[![Portal login page listing two local user pools](./images/multi_realm_basic_auth_login.png)](./images/multi_realm_basic_auth_login.png)

<figcaption>The preserved portal screen illustrates two configured user pools. HTTP Basic selects a realm with a header; it does not click this browser login UI.</figcaption>
</figure>

## Changing Authentication Realm Header Name

```Caddyfile
with auth realm header name X-Account-Realm
```

Update the client or trusted route assignment to use the same name. A realm
header selects an allowed backend; it is not an authorization grant. Keep
passwords out of access logs and use [credential stripping](headers.md) when
the backend should receive identity rather than the Basic credential.

Successful credential identities may be cached for their validity interval.
Do not assume each request rechecks a password or that changing an account
instantly invalidates every cached result. Plan credential changes and token
lifetimes as part of the application's access policy.
