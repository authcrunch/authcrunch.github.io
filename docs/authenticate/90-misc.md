# Miscellaneous

## Binding to Privileged Ports

It may be necessary to bind Caddy to privileged port, e.g. 80 or 443.
Grant the `cap_net_bind_service` capability to the Caddy binary, e.g.:

```bash
sudo systemctl stop gatekeeper
sudo rm -rf /usr/local/bin/gatekeeper
sudo cp bin/caddy /usr/local/bin/gatekeeper
sudo setcap cap_net_bind_service=+ep /usr/local/bin/gatekeeper
sudo systemctl start gatekeeper
```


## Recording Source IP Address in JWT Token

The `enable source ip tracking` Caddyfile directive instructs
the plugin to record the source IP address when issuing claims.

```
{
  security {
    authentication portal myportal {
      enable source ip tracking
    }

    authorization policy mypolicy {
      validate source address
    }
  }
}

auth.myfiosgateway.com {
  authenticate with myportal
}

app.myfiosgateway.com {
  authorize with mypolicy
}
```

This could be useful to force re-authentication when the client IP
address changes.

## Session ID Cache

When the plugin issues JWT tokens, it either passes `jti` values
from upstream providers or generates its own `jti` values.

The plugin stores the mappings between `jti` value and associated
data in a cache. The associated data contains claims and the
metadata from the identity stores/providers which authenticated a particular session.

This cache is used to assess whether a claim holder is able using
certain portal's capabilities, e.g. add public SSH/GPG key, configure
MFA tokens, change password, etc.


## Shortcuts

The following Caddyfile shortcuts could be used to configure local, OAuth 2.0
identity stores and providers:

```
{
  security {
    local identity store local <path>
    oauth identity provider google <client_id> <client_secret>
    oauth identity provider github <client_id> <client_secret>
    oauth identity provider facebook <client_id> <client_secret>
    }
  }
}

auth.myfiosgateway.com {
  authenticate with myportal
}
```

## Auto-Redirect URL

Consider the following configuration snippet. When the JWT plugin detects
unauthenticated user, it forwards the user to `https://auth.myfiosgateway.com`.
The `redirect_url` in URL query creates `AUTH_PORTAL_REDIRECT_URL` cookie
in the users session. Upon successful authentication, the portal
clears the cookie and redirects the user to the path specified in
`AUTH_PORTAL_REDIRECT_URL` cookie.

```
{
  security {
    authentication portal myportal

    authorization policy mypolicy {
      set auth url https://auth.myfiosgateway.com/login?redirect_url=https://app.myfiosgateway.com
    }
  }
}

auth.myfiosgateway.com {
  authenticate with myportal
}

app.myfiosgateway.com {
  authorize with mypolicy
}
```
