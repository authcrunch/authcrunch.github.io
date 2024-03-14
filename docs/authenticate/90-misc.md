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

## Basic Authentication

The `/basic/login/<realm>` endpoint provides a way to trigger Basic HTTP authentication.


```bash
curl -v --user 'webadmin:asd3kldkjld23HJh33jDnx!@1' https://auth.myfiosgateway.com:8443/basic/login/local
```

The output follows. The token is in the `authorization` header and `access_token` cookie.

```
< HTTP/2 303
< authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3Mzc2NDUsImp0aSI6IktzRXFpdTRqVXFQajJxUHJRZjhuWlEwSlFSell1R015MmlqU1oiLCJpYXQiOjE2Mzg3MzQwNDUsImlzcyI6Imh0dHBzOi8vYXV0aC5teWZpb3NnYXRld2F5LmNvbTo4NDQzL2Jhc2ljL2xvZ2luL2xvY2FsIiwibmJmIjoxNjM4NzMzOTg1MDAwLCJzdWIiOiJ3ZWJhZG1pbiIsImVtYWlsIjoid2ViYWRtaW5AbG9jYWxkb21haW4ubG9jYWwiLCJyb2xlcyI6WyJhdXRocC9hZG1pbiJdLCJvcmlnaW4iOiJsb2NhbCIsImFkZHIiOiIxMC4wLjIuMiJ9.gJXu5Dzj1VsI-QAWOv1kOcfMI8v5luiri4hmIOI1fL1XVnscaCOUyixpZLGRbqXCMhd8v4XBsdJUCVeMJ3RMFw
< cache-control: no-store
< content-type: text/plain
< location: https://auth.myfiosgateway.com:8443/portal
< pragma: no-cache
< server: Caddy
< set-cookie: access_token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3Mzc2NDUsImp0aSI6IktzRXFpdTRqVXFQajJxUHJRZjhuWlEwSlFSell1R015MmlqU1oiLCJpYXQiOjE2Mzg3MzQwNDUsImlzcyI6Imh0dHBzOi8vYXV0aC5teWZpb3NnYXRld2F5LmNvbTo4NDQzL2Jhc2ljL2xvZ2luL2xvY2FsIiwibmJmIjoxNjM4NzMzOTg1MDAwLCJzdWIiOiJ3ZWJhZG1pbiIsImVtYWlsIjoid2ViYWRtaW5AbG9jYWxkb21haW4ubG9jYWwiLCJyb2xlcyI6WyJhdXRocC9hZG1pbiJdLCJvcmlnaW4iOiJsb2NhbCIsImFkZHIiOiIxMC4wLjIuMiJ9.gJXu5Dzj1VsI-QAWOv1kOcfMI8v5luiri4hmIOI1fL1XVnscaCOUyixpZLGRbqXCMhd8v4XBsdJUCVeMJ3RMFw; Domain=myfiosgateway.com; Path=/; Secure; HttpOnly;
< set-cookie: AUTHP_SANDBOX_ID=delete; Domain=myfiosgateway.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;
< content-length: 0
< date: Sun, 05 Dec 2021 19:54:05 GMT
<
* Connection #0 to host auth.myfiosgateway.com left intact
```

## JSON API

### Authenticate

The following command provides a programmatic way to authenticate to `/login` endpoint:

```bash
curl -X POST https://auth.myfiosgateway.com:8443/login \
   -H 'Accept: application/json' \
   -H 'Content-Type: application/json' \
   -d '{"username":"webadmin","password":"asd3kldkjld23HJh33jDnx!@1","realm":"local"}'
```

The output follows.

```
{"token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3MzgyMjEsImp0aSI6IlN6d2JiOXI5eG5NeVlHUE5IbGZHeklQVlc5VHVLY1VlcndMbmNHR1BtIiwiaWF0IjoxNjM4NzM0NjIxLCJpc3MiOiJodHRwczovL2F1dGgubXlmaW9zZ2F0ZXdheS5jb206ODQ0My9sb2dpbiIsIm5iZiI6MTYzODczNDU2MTAwMCwic3ViIjoid2ViYWRtaW4iLCJlbWFpbCI6IndlYmFkbWluQGxvY2FsZG9tYWluLmxvY2FsIiwicm9sZXMiOlsiYXV0aHAvYWRtaW4iLCJhdXRocC91c2VyIl0sIm9yaWdpbiI6ImxvY2FsIiwiYWRkciI6IjEwLjAuMi4yIn0.QuSld2zKYtQX5gPIUlg7glRb7GXuieXm7ALxBTRd2dxCK4T-cZN-2KiK376Z1sxSFf3P3PA-ycrcazjdU5XETQ","token_name":"access_token"}
```

### User Identity

The following command provides a programmatic way to get information from `/whoami`
endpoint using the previously acquired JWT token. This works well for the
creation of user badge.

```
curl -X GET https://auth.myfiosgateway.com:8443/whoami \
   -H 'Accept: application/json' \
   -H 'Content-Type: application/json' \
   -H 'Authorization: Bearer: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3MzgyMjEsImp0aSI6IlN6d2JiOXI5eG5NeVlHUE5IbGZHeklQVlc5VHVLY1VlcndMbmNHR1BtIiwiaWF0IjoxNjM4NzM0NjIxLCJpc3MiOiJodHRwczovL2F1dGgubXlmaW9zZ2F0ZXdheS5jb206ODQ0My9sb2dpbiIsIm5iZiI6MTYzODczNDU2MTAwMCwic3ViIjoid2ViYWRtaW4iLCJlbWFpbCI6IndlYmFkbWluQGxvY2FsZG9tYWluLmxvY2FsIiwicm9sZXMiOlsiYXV0aHAvYWRtaW4iLCJhdXRocC91c2VyIl0sIm9yaWdpbiI6ImxvY2FsIiwiYWRkciI6IjEwLjAuMi4yIn0.QuSld2zKYtQX5gPIUlg7glRb7GXuieXm7ALxBTRd2dxCK4T-cZN-2KiK376Z1sxSFf3P3PA-ycrcazjdU5XETQ'
```

The output contains basic user information:

```json
{
  "exp": 1638738221,
  "jti": "Szwbb9r9xnMyYGPNHlfGzIPVW9TuKcUerwLncGGPm",
  "iat": 1638734621,
  "iss": "https://auth.myfiosgateway.com:8443/login",
  "nbf": 1638734561000,
  "sub": "webadmin",
  "email": "webadmin@localdomain.local",
  "roles": [
    "authp/admin",
    "authp/user"
  ],
  "origin": "local",
  "addr": "10.0.2.2"
}
```

## Logout

All authentication endpoints have a dedicated logout path, typically accessed through `/logout`.

Upon reaching this path, users are usually redirected to the login page (`/login`),
with some exceptions as detailed below.

### Logout with Redirect URL Query Parameter

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