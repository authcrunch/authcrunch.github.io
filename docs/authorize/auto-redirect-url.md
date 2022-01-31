---
sidebar_position: 8
---

# Auto-Redirect URL

## HTTP Redirect

Consider the following configuration snippet. When the JWT plugin detects
unauthenticated user, it forwards the user to `https://auth.example.com`.

```
{
  security {
    authorization policy mypolicy {
      set auth url https://auth.example.com/auth
    }
  }
}
```

By default, the plugin adds the `redirect_url` parameter in URL query
pointing back to the page where the plugin detected unauthenticated user.
It signals an authenticator to redirect where to redirect the user upon
successful authentication.

If you would like to disable the addition of `redirect_url`, please
add `disable auth redirect query`:

```
{
  security {
    authorization policy mypolicy {
      set auth url https://auth.example.com/auth
      disable auth redirect query
    }
  }
}
```

If you would like to change the parameter name, e.g. from `redirect_url`
to `referer_url`, use the `set redirect query parameter` Caddyfile directive.

```
{
  security {
    authorization policy mypolicy {
      set redirect query parameter referer_url
    }
  }
}
```

The following Caddyfile directive changes the status code (default: `302`) for
the redirects.

```
{
  security {
    authorization policy mypolicy {
      set redirect status 307
    }
  }
}
```

If `authorize` configuration contains the following directive, then the redirect
is disabled and the request is refused with a HTTP `401 Unauthorized` error.

```
{
  security {
    authorization policy mypolicy {
      disable auth redirect
    }
  }
}
```

Importantly, if the plugin finds expired token, it attempts to extract the
token's issuer value. Then, it checks whether the value starts with `http`.
If it is, then the `set auth url` will be overwritten with the issuer's
web address.

## Javascript Redirect

The following directive enables Javascript-based redirect. This is useful when
the URI path contains pound (`#`) sign.

```
{
  security {
    authorization policy mypolicy {
      enable js redirect
    }
  }
}
```

## Login Hint

Login hints are part of the
[OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1)
and can be used to notify an Authorization Server about the login identifier
used by a user (e.g. to pre-fill fields in the login form).

The `enable login hint` command can be used to forward a login hint to the auth URL by passing it to a protected
route as a query parameter. In case the auth URL belongs to a portal defined in the `authenticate` configuration,
it will be automatically forwarded to the backend.

By default, the `enable login hint` accepts email addresses, phone numbers and alphanumeric characters. Using the
`with` keyword in combination with one or more of the validator names `email`, `phone` and `alphanumeric`, they can be
toggled individually. For example, the command `enable login hint with email alphanumeric` would only forward email
addresses and alphanumeric strings to the auth URL, but no phone numbers.

### Configuration Example

```
{
  security {
    authorization policy mypolicy {
      set auth url https://auth.example.com/auth
      enable login hint
    }
  }
}


myapp.com {
        route /protected* {
                authorize with mypolicy
                respond "myapp is running"
        }
}
```

Given the above configuration, when a user visits `https://myapp.com/protected?login_hint=myusername`,
the login hint will be forwarded to the auth URL and therefore the user will be forwarded to the
following URL:

```
https://auth.example.com/auth?login_hint=myusername&redirect_url=https://myapp.com/protected
```
