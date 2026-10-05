---
description: "Limit the destinations accepted by login and logout redirects using domain and path trust rules."
discovery:
  topic: sessions-and-cookies
  kind: guide
  aliases: ["redirect_url", "redirect_uri", "open redirect"]
---

# Trusted Login and Logout Redirects

A protected application sends an unauthenticated browser to the portal with
`redirect_url` identifying its original destination. The portal records that
value only when a configured domain **and** path rule matches. Otherwise login
still works, but the browser continues to the portal rather than that destination.

Trust rules govern navigation. They neither grant application access nor share
cookies across hosts. A complete deployment needs matching routes, a usable
application role, verification keys and [cookie scope](auth-cookie.md).

## Trust Login Redirect URI

Inside the portal, explicitly trust the application's exact host and routes:

```caddyfile
trust login redirect uri domain exact app.example.com path exact /dashboard
trust login redirect uri domain exact app.example.com path prefix /dashboard/
```

Both conditions in one rule must match; several rules are alternatives. Omitting
the strategy selects exact matching. The two paths above admit `/dashboard` and
its descendants without also admitting `/dashboard-other`.

Avoid `domain suffix example.com`: it also matches `evil-example.com`. If many
subdomains are intentionally trusted, an anchored, escaped regex can distinguish
a label boundary, but an explicit list of application hosts is easier to audit.
A domain rule matches URL `Host`, including a port, and a path rule matches `Path`;
query parameters are not an additional restriction. These directives contain no
scheme matcher. Keep generated application destinations canonical HTTPS and do
not describe a host/path rule as enforcing HTTPS by itself.

### Full Configuration Example

Use the tested [generic OIDC example](oauth/81-backend-oauth2-0000-generic.md) for a complete
single-host deployment. For a cross-host portal, all these settings must agree:

| Setting | Example |
| --- | --- |
| Portal handler mount | `https://auth.example.com/auth/` |
| Policy auth URL | `https://auth.example.com/auth/oauth2/upstream` |
| Trusted return host/path | Exact `app.example.com`, exact `/dashboard` and prefix `/dashboard/` |
| Access-cookie delivery | `cookie domain example.com` and `cookie path /`, only if all subdomains are trusted |
| Application policy | Matching verifier plus an explicitly granted `app/member` role |

A relative auth URL such as `/auth/login` on the application host cannot reach a
portal that exists only on a different host. Trusted redirects do not fix that
routing error. Prefer a single host when broad parent-domain cookies would expose
credentials to unrelated subdomains.

### How It Works

1. The anonymous browser requests the protected application.
2. Its policy redirects to the configured auth URL with an encoded `redirect_url`.
3. The portal checks the host/path pair and records a trusted target in its
   mount-scoped return cookie.
4. The user completes the required login and receives an access credential.
5. The portal consumes the return destination; the application evaluates its
   own policy on the new request.

A trusted return destination does not make a nonmember pass the application ACL.
Test a member, a nonmember and an anonymous user.

### Match Types

| Type | Behavior |
| --- | --- |
| `exact` | Entire value equals the configured value |
| `partial` | Configured text appears anywhere |
| `prefix` | Value starts with configured text |
| `suffix` | Value ends with configured text |
| `regex` | Go regular expression matches; anchor it when requiring the entire value |

Matching is case-sensitive string comparison except for the chosen regex behavior.
Include escaped dots and intentional label/path boundaries. Use exact matching
for sign-out landing pages and other fixed destinations.

### Troubleshooting

Enable [diagnostic logging](../operations/logging.md) locally and look for
`provided redirect_url is not trusted` or
`trust login redirect uri is not configured, but detected redirect_url attempt`.
Check the actual host **including port**, path, portal mount, cookie delivery and
policy auth URL. Avoid logging live credential cookies while investigating.

Try the intended destination and rejection cases: a lookalike hostname,
`app.example.com.evil.test`, an unexpected port, `/dashboard-other`, and a URL
outside the permitted paths. Check the Location and Set-Cookie headers as well
as the final browser destination.

## Trust Logout Redirect URI

Logout uses **`redirect_uri`**, not the login parameter. For a fixed landing page:

```caddyfile
trust logout redirect uri domain exact app.example.com path exact /signed-out
```

The same domain/path matching applies. [Logout](15-logout.md#external-endpoint-logout)
explains the separate upstream provider flow and refresh-session confirmation.
A trusted landing page does not itself revoke any additional credential.

## Non-Standard Ports

List the actual port rather than accepting every port:

```caddyfile
trust login redirect uri domain exact app.example.com:8443 path prefix /dashboard/
trust logout redirect uri domain exact app.example.com:8443 path exact /signed-out
```

For a deliberately reviewed pair of ports, an anchored regex can use
`^app[.]example[.]com:(443|8443)$`. A URL with no explicit port still has a different
Host string from one containing `:443`; add a separate exact rule when needed.
