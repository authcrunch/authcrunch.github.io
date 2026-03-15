# Logout

All authentication endpoints have a dedicated logout path, typically accessed through `/logout`.

Upon reaching this path, users are usually redirected to the login page (`/login`),
with some exceptions as detailed below.

## Logout with Redirect URL Query Parameter

If a `redirect_uri` parameter is included in the query string, the portal will redirect
the user to the specified link, but only if the URI is trusted.

Here, the `redirect_uri` is present and points to `https://google.com/`

```
https://localhost:8443/auth/logout?redirect_uri=https://google.com/
```

The trust is being established via `trust logout redirect uri` directive.
If there is a match of `domain` and `path`, then the redirect occurs.
Otherwise, there is no redirect.

The syntax follows:

```
authentication portal <name> {
  trust logout redirect uri domain [exact|partial|prefix|suffix|regex] <domain_name> path [exact|partial|prefix|suffix|regex] <path>
}
```

Examples follow:

```
authentication portal my portal {
  trust logout redirect uri domain authcrunch.com path /foo/bar
  trust logout redirect uri domain exact google.com path suffix /foo
}
```


If you are serving the website your are redirecting to on non-default HTTP/HTTPS ports, the `domain_name` may include
a port value, e.g. `8080`, `8443`, etc.

As such, you will need to match in the following way:

```
trust logout redirect uri domain regex ^site1.example.com(:[0-9]+)?$ path prefix /
```

The above `regex` will match:

```
site1.example.com
site1.example.com:443
site1.example.com:8443
site1.example.com:18443
```

## External Endpoint Logout

The external endpoint logout applies to OAuth 2.0 and SAML authentication.

When `enable logout` is set, the portal will redirect the user to the provider's
logout endpoint upon signing out, ensuring that the user's session is fully
invalidated at the identity provider level (not just locally).

### Manual Logout URL

You can manually specify a logout URL using the `logout_url` parameter. When this
parameter is set:

1.  **Logout is auto-enabled**: There is no need to explicitly set `enable logout`.
2.  **Override**: The portal will redirect the user to this specific URL, bypassing
    any provider-specific discovery or parameter-appending logic.

This is particularly useful for drivers with non-standard logout flows or when
you want to use a specific landing page after logout.

```
authentication portal myportal {
  enable identity provider google {
    ...
    logout_url https://accounts.google.com/logout
  }
}
```

### OAuth Driver Support

The following table summarizes how each supported OAuth 2.0 driver handles
the logout redirect when `enable logout` is used without a manual `logout_url`:

| OAuth Driver Name | Redirect Parameter | Example Logout URL | Status |
|-------------------|--------------------|--------------------|--------|
| `google` | `?continue=<redirect_url>` | `https://accounts.google.com/logout?continue=https://auth.example.com/logout` | Implemented |
| `azure` | `?post_logout_redirect_uri=<redirect_url>` | `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=https://auth.example.com/logout` | Implemented |
| `gitlab` | `?post_logout_redirect_uri=<redirect_url>` | `https://gitlab.com/oauth/logout?post_logout_redirect_uri=https://auth.example.com/logout` | Implemented |
| `okta` | `?post_logout_redirect_uri=<redirect_url>` | `https://okta.example.com/oauth2/v1/logout?post_logout_redirect_uri=https://auth.example.com/logout` | Implemented |
| `cognito` | `&logout_uri=<redirect_url>` | `https://auth.example.com/logout?client_id=foo&logout_uri=https://auth.example.com/logout` | Implemented |
| `github` | *(no redirect parameter)* | `https://github.com/logout` | Implemented |
| `generic` | *(no modification)* | The configured logout URL is used as-is without appending any redirect parameters. | Implemented |
| `facebook` | *(no modification)* | Standard redirect parameter support planned. | TODO |
| `discord` | *(no modification)* | Standard redirect parameter support planned. | TODO |
| `linkedin` | *(no modification)* | Standard redirect parameter support planned. | TODO |
| `nextcloud` | *(no modification)* | Standard redirect parameter support planned. | TODO |

All redirect URIs are automatically URL-encoded by the portal.

To enable external logout for a driver, use the `enable logout` directive
in the identity provider configuration:

```
authentication portal myportal {
  enable identity provider google {
    ...
    enable logout
  }
}
```

> Without the `enable logout` directive (and without a manual `logout_url`), the portal will only clear local session cookies and redirect to the login page. The user's session at the identity provider (e.g., Google, Azure) will remain active.
