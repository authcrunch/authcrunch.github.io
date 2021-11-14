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
localhost {
  route /auth* {
    authp {
      ...
      enable source ip tracking
      ...
```

This could be useful to force re-authentication when the client IP
address changes.

## Session ID Cache

When the plugin issues JWT tokens, it either passes `jti` values
from upstream providers or generates its own `jti` values.

The plugin stores the mappings between `jti` value and associated
data in a cache. The associated data contains claims and the
metadata from the backend which authenticated a particular session.

This cache is used to assess whether a claim holder is able using
certain portal's capabilities, e.g. add public SSH/GPG key, configure
MFA tokens, change password, etc.


## Shortcuts

The following Caddyfile shortcuts could be used to configure local, OAuth 2.0
backends:

```
backend local <path> <realm>
backend google <client_id> <client_secret>
backend github <client_id> <client_secret>
backend facebook <client_id> <client_secret>
```

## Auto-Redirect URL

Consider the following configuration snippet. When the JWT plugin detects
unauthenticated user, it forwards the user to `https://auth.example.com`.
The `redirect_url` in URL query creates `AUTH_PORTAL_REDIRECT_URL` cookie
in the users session. Upon successful authentication, the portal
clears the cookie and redirects the user to the path specified in
`AUTH_PORTAL_REDIRECT_URL` cookie.

```
https://chat.example.com {
  authorize {
    set auth url https://auth.example.com/auth?redirect_url=https://chat.example.com
  }
}
```
