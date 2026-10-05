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

The v1.4.0 integration source adds `AUTHP_CROSS_DEVICE_SESSION_ID` for the
[cross-device approval flow](cross-device.md). It is host-only, portal-mount
scoped, Secure/HttpOnly/SameSite=None and limited to 300 seconds independently
of ordinary cookie attributes. In that source build, override only its name
with `cookie cross-device session id name MY_APPROVAL_BINDING`; ordinary domain,
path, insecure and lifetime settings do not weaken its fixed binding contract.
The v1.3.0 downloadable bundle does not support this feature.

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

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Map cookie roles and delivery</summary>

```text
Help me understand Authentication cookies.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-cookies,
authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/auth-cookie

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain the different access, session, return, sandbox, refresh, OIDC, and
SAML cookies. Map host/domain, path, Secure, HttpOnly, and SameSite to browser
delivery. Separate a tracking identifier from an application credential and
check newer cross-device availability explicitly.
```

</details>

<details>
<summary>Compare one host with sibling hosts</summary>

```text
Help me understand Authentication cookies.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-cookies,
authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/auth-cookie

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Use synthetic auth.example.com and app.example.com origins to compare
host-only and parent-domain access cookies. Explain which subdomains must be
trusted and why a cookie path is not a same-origin script isolation boundary.
Ask for my actual mount and scheme.
```

</details>

<details>
<summary>Diagnose a login loop</summary>

```text
Help me understand Authentication cookies.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-cookies,
authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/auth-cookie

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me inspect redacted Set-Cookie and request-cookie metadata for a repeated
login. Check domain, path, SameSite, HTTPS, custom names, policy discovery,
and signing keys. Do not ask for cookie values or conclude that cookie
delivery proves valid authorization.
```

</details>

<details>
<summary>Test dedicated credentials</summary>

```text
Help me understand Authentication cookies.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-cookies,
authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/auth-cookie

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Build browser cases for OAuth redirect, cross-site SAML POST, refresh on the
portal mount, and an app request. Explain which credentials keep fixed
attributes independently of ordinary cookie settings. Include name collisions
and separate-instance policy matching.
```

</details>

<details>
<summary>Practice lifetime reasoning</summary>

```text
Help me understand Authentication cookies.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-cookies,
authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/auth-cookie

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Ask me about cookie Max-Age versus signed JWT expiry, insecure demo settings,
__Host- names, and changing only a session-cookie name. Wait for each
explanation and correct it from the factory and parser rather than generic
browser assumptions.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28CookieConfig%20OR%20CookieFactory%20OR%20AUTHP_ACCESS_TOKEN%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authn_cookie.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_cookie.go)
   — adapts portal cookie directives through the library parser.
3. [caddy-security: caddyfile_authn_cookie_test.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_cookie_test.go)
   — tests names, attributes, collisions, and compatibility grammar.
4. [go-authcrunch: pkg/authn/cookie/configuration.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/cookie/configuration.go)
   — validates cookie roles, names, attributes, and prefix changes.
5. [go-authcrunch: pkg/authn/cookie/cookie_get.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/cookie/cookie_get.go)
   — generates role-specific portal cookie values and delivery attributes.
6. [go-authcrunch: pkg/authn/cookie_browser_e2e_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/cookie_browser_e2e_test.go)
   — tests cookie delivery and browser-visible behavior.
