---
sidebar_position: 40
title: "Authentication cookies"
description: "Configure the domain, path, and browser attributes of authentication cookies."
discovery:
  topic: sessions-and-cookies
  kind: reference
  aliases: ["cookie domain", "SameSite", "secure", "subdomain"]
---

# Authentication cookies

A portal issues an access JWT for protected requests and temporary cookies for
login. Enabling refresh sessions or OIDC adds **separate opaque credentials**.
Cookie scope controls where the browser sends a credential; token verification
and the application's policy decide whether that credential permits access.

## Intra-Domain Cookies

For one HTTPS host with a portal at `/auth/` and an application at `/app/`, keep
host-only cookies and an access-cookie path of `/`. This reaches both routes
without sharing credentials with other subdomains. Inside the portal:

```caddyfile
cookie path /
cookie same site lax
cookie insecure disabled
```

| Directive | Effect |
| --- | --- |
| `cookie domain example.com` | Shares the access/session cookies with that domain and its subdomains |
| `cookie path /` | Sets the access-cookie path; temporary login cookies use the portal mount |
| `cookie lifetime 900` | Sets access-cookie Max-Age; does **not** extend the JWT's signed expiry |
| `cookie same site lax` | Sets the ordinary access-cookie SameSite policy; also accepts `strict` or `none` |
| `cookie insecure disabled` | Keeps Secure and HttpOnly on ordinary portal cookies |
| `cookie guess domain enabled` | Infers a parent domain; explicit domain selection is easier to review |

Use `enabled`/`disabled`, not `on`/`off`. The released parser normalizes a leading
dot on a domain; use `example.com` consistently. Omitting a domain keeps the
cookie host-only. Only share a parent domain when **every receiving subdomain
is trusted**. A path is a delivery filter, not an isolation boundary against
scripts on the same origin.

`cookie insecure enabled` is for a disposable HTTP exercise. It removes both
Secure and HttpOnly from ordinary portal cookies. The dedicated refresh, OIDC
and SAML credentials have their own stricter attributes and HTTPS requirements.
See [MDN's cookie reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
for browser delivery rules.

## Changing Default Cookie Names

The current grammar supports a common prefix and explicit role names:

```caddyfile
cookie prefix CONTOSO
cookie access token name CONTOSO_APP_ACCESS
```

An explicit name wins regardless of statement order. Duplicate settings or
colliding names are rejected. Older `set cookie name prefix CONTOSO` and
`set access_token cookie name CONTOSO_APP_ACCESS` statements remain compatibility
forms; use one form for each setting.

| Role in `cookie <role> name NAME` | Default name |
| --- | --- |
| `session id` | `AUTHP_SESSION_ID` |
| `referer` (also `redirect url`) | `AUTHP_REDIRECT_URL` |
| `sandbox id` | `AUTHP_SANDBOX_ID` |
| `identity token` (also `id token`) | `AUTHP_ID_TOKEN` |
| `access token` | `AUTHP_ACCESS_TOKEN` |
| `refresh token` | `AUTHP_REFRESH_TOKEN` |
| `oidc session id` | `AUTHP_OIDC_SESSION_ID` |
| `oidc request id` | `AUTHP_OIDC_REQUEST_ID` |
| `saml session id` | `AUTHP_SAML_SESSION_ID` |

If authorization runs on a separate Caddy instance, give its policy the matching
access-cookie name and verification key:

```caddyfile
authorization policy apppolicy {
    set access_token cookie name CONTOSO_APP_ACCESS
    crypto key verify {env.AUTHCRUNCH_SIGNING_KEY}
    allow roles app/member
}
```

Same-instance portal/policy provisioning discovers portal cookie names. Check
[discovery order](../authorize/token-discovery.md) when accepting several token
sources or custom names. Changing a session tracking cookie alone does not
replace the access JWT used by the application's policy.

## Scope

For a portal mounted at `/auth/`, the default prefix produces:

| Cookie | Delivery scope and purpose |
| --- | --- |
| `AUTHP_ACCESS_TOKEN` | Host-only unless configured otherwise; path `/` by default; signed application credential |
| `AUTHP_SESSION_ID` | Host/domain tracking identifier at `/`; not an access-token substitute |
| `AUTHP_REDIRECT_URL` | Host-only, `/auth/`; trusted return destination |
| `AUTHP_SANDBOX_ID` | Host-only, `/auth/`; temporary login interaction |
| `AUTHP_ID_TOKEN` | Host-only, `/auth/whoami`; provider identity display when issued |
| `AUTHP_REFRESH_TOKEN` | With refresh enabled: host-only, `/auth/`, Secure/HttpOnly/SameSite=Lax; rotating opaque credential |
| `AUTHP_OIDC_SESSION_ID`, `AUTHP_OIDC_REQUEST_ID` | Dedicated host-only OIDC browser state under its configured mount |
| `AUTHP_SAML_SESSION_ID` | Short-lived host-only browser binding at `/`, Secure/HttpOnly/SameSite=None for cross-site SAML POSTs |

The historical `/auth/api/refresh_token` cookie path is a legacy cleanup path,
**not** the active refresh-session scope. Refresh credentials are issued only
when [refresh sessions](30-refresh-token.md) are enabled for the local realm.
Use the matching guide for refresh lifetime and name overrides.

A `__Host-` cookie requires Secure, no Domain, and path `/`. It therefore cannot
name a credential whose portal mount is `/auth/`. Separate portals on one host
need noncolliding names and mounts; changing a prefix also changes dedicated
OIDC/SAML names.

## JWT Tokens

The portal's access JWT contains identity and role claims. Signing protects
integrity; it does not hide those claims. Grant application roles deliberately
and verify them in a policy. Portal roles have distinct purposes:

- `authp/admin`: portal administration permissions.
- `authp/user`: ordinary portal access and, for local identities, account management
  at `/profile/` with a live session.
- `authp/guest`: restricted portal access when no user/admin role is assigned.

A provider's own roles must not accidentally grant portal administration or your
application membership. See [transforms](42-user-transforms.md).

### Auto-Generated Encryption Keys

The historical heading refers to **signing keys**. With no explicit key, the
portal generates an ECDSA pair and related policies on the same instance can use
it. Without persistent state, restarting replaces that key and invalidates old
JWTs. [Runtime state](../operations/runtime-state.md) can retain generated keys.
For separate instances, configure shared verification material explicitly.

### Encryption Key Configuration

These examples sign JWTs; they do not encrypt them. See
[token verification](../authorize/token-verification.md) for asymmetric keys.

#### Shared Key

A complete deployment must supply a strong private value for the named variable:

```caddyfile
authentication portal myportal {
    enable identity store localdb
    crypto default token lifetime 900
    crypto key appkey sign-verify {env.AUTHCRUNCH_SIGNING_KEY}
}

authorization policy apppolicy {
    crypto key appkey verify {env.AUTHCRUNCH_SIGNING_KEY}
    allow roles app/member
}
```

This is a global-security fragment; define `localdb` and route handlers as in the
[first application](../start/first-app.md). An access-only token defaults to 900
seconds. Refresh-enabled portals use their access lifetime instead, defaulting
to 300 seconds. Cookie Max-Age and browser logout do not extend or necessarily
revoke a copied stateless JWT. Inspect the actual Set-Cookie headers, JWT expiry,
allowed request, denied request and logout after changing these settings.
