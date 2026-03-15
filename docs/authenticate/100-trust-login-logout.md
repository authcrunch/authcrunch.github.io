# Trusted Login and Logout Redirects

When the `authorize` plugin denies an unauthenticated request, it redirects
the user to the authentication portal with a `redirect_url` query parameter
set to the originally requested URL.

After successful login, the portal stores the redirect target in a cookie
and redirects the user back, but only if the target URL is trusted.

Without this check, an attacker could craft a login URL that sends the user
to a malicious site after authentication:

```
https://auth.example.com/auth/login?redirect_url=https://evil.com/phish
```

The user sees the legitimate login page, authenticates, and gets redirected
to a site the attacker controls.

The `trust login redirect uri` directive defines which domains and paths
are allowed as post-login redirect targets. If the `redirect_url` does not
match any trusted URI, the portal ignores the parameter and redirects to
the default portal page instead.

## Trust Login Redirect URI

The directive is configured inside the `authentication portal` block.

The syntax follows:

```
authentication portal <name> {
  trust login redirect uri domain [exact|partial|prefix|suffix|regex] <domain_name> path [exact|partial|prefix|suffix|regex] <path>
}
```

Both `domain` and `path` are required. When the match type is
omitted, `exact` is used. The matching works the same way as ACL rules.

Examples follow:

```
authentication portal myportal {
  trust login redirect uri domain suffix mydomain.com path prefix /
  trust login redirect uri domain exact app.internal path prefix /dashboard
}
```

The first rule trusts any redirect URL ending with `mydomain.com` at any
path. The `path prefix /` covers all paths, essentially a wildcard. This
also covers subdomains like `app.mydomain.com` and `api.mydomain.com`.

The second rule trusts only the exact host `app.internal` with paths
starting with `/dashboard`.

Multiple directives can be specified for all URLs you want to cover. A
match against any single rule is sufficient.

### Full Configuration Example

A typical setup with OAuth 2.0 involves both the `authorize` and
`authentication portal` directives. Here, the `set auth url` directive in
the authorization policy tells the `authorize` plugin where to redirect
unauthenticated users. The `trust login redirect uri` directive in the
portal tells the portal which redirect targets to allow after login.

```
{
  security {
    oauth identity provider generic {
      realm generic
      driver generic
      client_id {env.OIDC_CLIENT_ID}
      client_secret {env.OIDC_CLIENT_SECRET}
      scopes openid email profile
      base_auth_url https://id.mydomain.com
      metadata_url https://id.mydomain.com/.well-known/openid-configuration
    }

    authentication portal myportal {
      enable identity provider generic
      trust login redirect uri domain suffix mydomain.com path prefix /
    }

    authorization policy mypolicy {
      set auth url /auth/oauth2/generic
      allow roles user
    }
  }
}

auth.mydomain.com {
  authenticate with myportal
}

app.mydomain.com {
  authorize with mypolicy
  reverse_proxy backend:8080
}
```

### How It Works

1. User requests `https://app.mydomain.com/dashboard`
2. The `authorize` plugin finds no valid session cookie and redirects to
   `https://auth.mydomain.com/auth/oauth2/generic?redirect_url=https://app.mydomain.com/dashboard`
3. User authenticates at the portal
4. Portal checks `redirect_url` against `trust login redirect uri` rules
5. If trusted: the portal stores the redirect target in the `AUTHP_REDIRECT_URL`
   cookie, issues a session cookie (`access_token`), and sends the user back
   to the original URL
6. If not trusted: the portal issues a session cookie and redirects to the
   portal landing page, dropping the redirect target

For cookie scope configuration (which domains receive the session cookie),
see [Authorization Cookie](./auth-cookie.md).

### Match Types

| Type | Behavior |
|------|----------|
| `exact` | Value must match exactly (default when omitted) |
| `partial` | Value appears anywhere in the string |
| `prefix` | Value starts with the specified string |
| `suffix` | Value ends with the specified string |
| `regex` | Value matches the regular expression |

These apply independently to `domain` (matched against the host) and `path`
(matched against the URL path).

### Troubleshooting

If users are not being redirected to their originally requested page after
login, enable debug logging:

```
{
  debug
}
```

Look for these log messages:

- `"Login redirect URI configuration not present"` (at startup): no
  `trust login redirect uri` directive is configured. The portal will
  work, but all `redirect_url` parameters will be silently ignored.

- `"trust login redirect uri is not configured, but detected redirect_url attempt"`:
  same as above, logged per request.

- `"provided redirect_url is not trusted"`: the redirect URL does not match
  any rule. Verify that the domain and path cover the URL being redirected to.

> **Note:** If upgrading from a version before this security fix, existing
> configurations that relied on automatic post-login redirects will need
> the `trust login redirect uri` directive added. Without it, users will
> still authenticate successfully but will land on the portal page instead
> of their intended destination.

## Trust Logout Redirect URI

Logout redirects follow the same pattern. When a user visits the logout
endpoint with a `redirect_uri` query parameter, the portal only honors
the redirect if it matches a `trust logout redirect uri` rule.

The syntax follows:

```
authentication portal <name> {
  trust logout redirect uri domain [exact|partial|prefix|suffix|regex] <domain_name> path [exact|partial|prefix|suffix|regex] <path>
}
```

Examples follow:

```
authentication portal myportal {
  trust logout redirect uri domain authcrunch.com path /foo/bar
  trust logout redirect uri domain exact google.com path suffix /foo
}
```

For external provider logout (OAuth 2.0, SAML), see
[Logout](./15-logout.md#external-endpoint-logout).

> **Note:** Login uses the `redirect_url` query parameter. Logout uses
> `redirect_uri`. These are different parameters.

## Non-Standard Ports

If you are serving the website your are redirecting to on non-default HTTP/HTTPS ports, the `domain_name` may include
a port value, e.g. `8080`, `8443`, etc.

As such, you will need to match in the following way:

```
trust login redirect uri domain regex ^site1.example.com(:[0-9]+)?$ path prefix /
trust logout redirect uri domain regex ^site1.example.com(:[0-9]+)?$ path prefix /
```

The above `regex` will match:

```
site1.example.com
site1.example.com:443
site1.example.com:8443
site1.example.com:18443
```