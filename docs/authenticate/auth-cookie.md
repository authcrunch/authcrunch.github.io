---
sidebar_position: 40
---

# Authorization Cookie

## Intra-Domain Cookies

The following `Caddyfile` settings define the scope of the cookies issued by
the plugin. Specifically, what URLs the cookies should be sent to.
See [MDN - Using HTTP cookies - Define where cookies are sent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
for more information.

* `cookie domain <domain>`: adds the **Domain** attribute to a cookie. It
  determines which hosts are allowed to receive the cookie. By default,
  the domain is not included.
* `cookie path <path>` (optional): adds the **Path** attribute to a cookie.
  It determines the URL path that must exist in the requested URL in order
  to send  the Cookie header. The default is `/`.
* `cookie lifetime` (optional): sets the number of seconds until the cookie
  expires. The directive sets "Max-Age" cookie attribute.
* `cookie samesite <lax|strict|none>`: specifies SameSite strategy.
* `cookie insecure <on|off>`: Allows sending cookies over HTTP. By default,
  it is disabled.

The `cookie guess domain` directive, when enabled, would automatically try to discover the domain
for intra-domain cookie purposes.

## Changing Default Cookie Names

These are the default cookies used by the authentication portal and authorization gateway:

| Caddyfile directive | Cookie Name | Purpose |
| :--- | :--- | :--- |
| `set session_id cookie name <NAME>` | `AUTHP_SESSION_ID` | Session tracking |
| `set redirect_url cookie name <NAME>` | `AUTHP_REDIRECT_URL` | Redirection logic |
| `set sandbox_id cookie name <NAME>` | `AUTHP_SANDBOX_ID` | Sandbox identification |
| `set id_token cookie name <NAME>` | `AUTHP_ID_TOKEN` | Original identity storage |
| `set access_token cookie name <NAME>` | `AUTHP_ACCESS_TOKEN` | Access token storage |
| `set refresh_token cookie name <NAME>` | `AUTHP_REFRESH_TOKEN` | Refresh token storage |

For example, to change the default session ID cookie name, configure the following:

```Caddyfile
		authentication portal myportal {
			set session_id cookie name CONTOSO_SESSION_ID
		}
```

The syntax:

```text
set <session_id|redirect_url|sandbox_id|id_token|access_token|refresh_token> cookie name <name>
```

Additionally, you can set common prefix to all cookies:

```Caddyfile
		authentication portal myportal {
			set cookie name prefix CONTOSO
		}
```

Importantly, if you changed default session ID cookie name, then you must also update you authorization policy
to match the changed value.

```Caddyfile
		authorization policy mypolicy {
			set session_id cookie name CONTOSO_SESSION_ID
		}
```

If you changed default access_token cookie name, then you must also update you authorization policy
to match the changed value.

```Caddyfile
		authorization policy mypolicy {
			set access_token cookie name CONTOSO_ACCESS_TOKEN
		}
```

> It is not necessary to add `set access_token cookie` if authorization policy and authentication portal
> are on the same Caddy instance. It is being auto-discovered.
>
> It applies to the use case where `authenticate` and `authorize` are on separate Caddy instances.

You can provide more than one cookie name.

```Caddyfile
		authorization policy mypolicy {
			set access_token cookie name CONTOSO_ACCESS_TOKEN CONTOSO_JWT_TOKEN CONTOSO_JWT_ACCESS_TOKEN
		}
```

## JWT Tokens

The plugin issues JWT tokens to authenticated users. The tokens
contains user attributes, e.g. name, email, avatar, etc. They also
contains roles. The roles are used to authorize user access with
`authorize` plugin.

By default, in addition to the roles configured by an authentication provider,
the plugin issues one of the three roles to a user.

* `authp/admin`: this is the admin user. It must be granted by authentication
  provider or added to a user via `transform user` directive
* `authp/user`: the user can access `/settings` endpoint. It must be granted
  by authentication provider or added to a user via `transform user` directive
* `authp/guest`: can access portal only. This is the default role assigned by
  the portal to a user when neither `authp/admin` nor `authp/user` are being
  assigned

The plugin supports the issuance and verification of RSA, ECDSA, and shared keys.
See docs [here](https://github.com/greenpau/caddy-authorize#token-verification).

### Auto-Generated Encryption Keys

By default, if there is no `crypto key` directive, the plugin auto-generated
ECDSA key pair for signing and verification of tokens. The key pair changes
with each restart of the plugin.

In this case, there is no need to define `crypto key` directive in `authorize` plugin
because the two plugins would know about the keypair.

This is a perfect option for standalone servers.

### Encryption Key Configuration

#### Shared Key

The following configuration instructs the plugin to sign/verify token
with shared key `428f41ab-67ec-47d1-8633-bcade9dcc7ed` and add key id of
`a2f19072b6d6` to the token's header. It uses the default token lifetime
of 900 seconds (15 minutes). The name of the token is `access_token`.

```
authentication portal myportal {
  crypto key a2f19072b6d6 sign-verify 428f41ab-67ec-47d1-8633-bcade9dcc7ed
}

authorization policy mypolicy {
  crypto key a2f19072b6d6 verify 428f41ab-67ec-47d1-8633-bcade9dcc7ed
}
```

The corresponding `authorize` plugin config is:

```
route {
  authorize with mypolicy
}
```

The following configuration instructs the plugin to sign/verify token
with shared key `428f41ab-67ec-47d1-8633-bcade9dcc7ed` and add key id of
`a2f19072b6d6` to the token's header. It uses the default token lifetime
of 1800 seconds (30 minutes). The name of the token is `JWT_TOKEN`.


```
authentication portal myportal {
  crypto default token name JWT_TOKEN
  crypto default token lifetime 1800
  crypto key a2f19072b6d6 sign-verify 428f41ab-67ec-47d1-8633-bcade9dcc7ed
}

authorization policy mypolicy {
  crypto key a2f19072b6d6 verify 428f41ab-67ec-47d1-8633-bcade9dcc7ed
}
```

The corresponding `authorize` plugin config is:

```
route {
  authorize with mypolicy
}
```

The following configuration instructs the plugin to sign/verify token
with shared key `428f41ab-67ec-47d1-8633-bcade9dcc7ed` and add key id of
`a2f19072b6d6` to the token's header. It uses the default token lifetime
of 1800 seconds (30 minutes). The name of the token is `JWT_TOKEN`.


```
authentication portal myportal {
  crypto key sign-verify 428f41ab-67ec-47d1-8633-bcade9dcc7ed
}

authorization policy mypolicy {
  crypto key verify 428f41ab-67ec-47d1-8633-bcade9dcc7ed
}
```

The corresponding `authorize` plugin config is:

```
route {
  authorize with mypolicy
}
```


