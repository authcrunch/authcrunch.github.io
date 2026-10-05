---
sidebar_position: 8
title: "Authorization redirects"
description: "Configure how an authorization policy redirects unauthenticated requests to login."
discovery:
  topic: sessions-and-cookies
  kind: reference
  aliases: ["redirect_url", "302", "login loop"]
---

# Authorization redirects

## HTTP Redirect

A missing/invalid portal token normally sends a browser to the policy's auth URL:

```Caddyfile
set auth url https://auth.example.com/auth/
```

The default Location redirect is `302`. Its `redirect_url` query parameter
contains the original application URL so the portal can return there after
login. The portal must explicitly [trust that destination](../authenticate/100-trust-login-logout.md);
a policy redirect does not authorize arbitrary return URLs.

Use the configured trusted portal URL. The released gatekeeper does not replace
it with an arbitrary expired JWT's issuer. Behind a proxy, normalize forwarded
host/scheme information so the return URL represents the intended public origin.

| Policy directive | Effect |
| --- | --- |
| `disable auth redirect` | Missing authentication is refused with `401` instead of redirecting |
| `disable auth redirect query` | Redirect without the return-URL parameter |
| `set redirect query parameter referer_url` | Rename the return parameter; coordinate the receiving authenticator |
| `set redirect status 307` | Change Location status; be deliberate about method-preserving redirects |

For an API, `disable auth redirect` usually gives a clearer contract than
returning a login HTML page to a JSON client. A valid identity denied by an ACL
is a separate [403 response](acl-rbac.md#forbidden-access). Avoid protecting the
login route or error page with the policy that redirects to it.

## Javascript Redirect

```Caddyfile
enable js redirect
```

This returns an HTML script that can preserve a browser fragment such as
`#section`, which is never sent in an HTTP request. Its default response status
is `401`; it is not the ordinary Location/302 response. It requires JavaScript
and a compatible content security policy, so use it only for a browser flow
that needs this behavior.

## Login Hint

A hint suggests a login identifier to a provider; it does not establish identity.
The policy can accept `login_hint` from the request and forward it to the portal.

```Caddyfile
enable login hint with email alphanumeric
```

The default validators are `email`, `phone`, and `alphanumeric`. Select the forms
your integration requires. An OAuth provider must support the hint for it to
affect its UI. Do not treat a hinted email as a verified login or role grant.

### Configuration Example

```Caddyfile
# Inside an existing authorization policy:
set auth url https://auth.example.com/auth/
enable login hint with email
allow roles app/member
```

A request to `/private?login_hint=alice%40example.com` can forward the validated
hint alongside the return URL. Query identifiers can appear in logs; avoid
collecting unnecessary login hints in analytics.

## Additional scopes

`enable additional scopes` allows the request's `additional_scopes` value to be
forwarded through the login flow and merged with configured OAuth scopes.
These are provider API/consent scopes, not authorization-policy application roles.

Enable this only for an integration that deliberately allows client-selected
consent expansion. Prefer a fixed provider scope list for a predictable login.
The provider must support the requested scopes; forwarding them does not grant
the caller access or waive provider consent.

### Configuration Example

```Caddyfile
# Inside the policy that redirects to the configured OAuth login:
set auth url /auth/oauth2/customer
enable additional scopes
allow roles app/member
```

Here `customer` is the provider's configured realm. URL-encode a request such
as `additional_scopes=scopeA%20scopeB`. Complete the provider and portal setup
using the [generic OIDC guide](../authenticate/oauth/81-backend-oauth2-0000-generic.md); this fragment
does not define an identity provider.
