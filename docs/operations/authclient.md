---
title: "Go authentication client"
description: "Authenticate an application through the reusable Go client with explicit password, TOTP, API-key, and refresh transport boundaries."
discovery:
  topic: operations
  kind: guide
  aliases: ["authclient", "Go SDK", "NewClient", "FileTokenStore"]
---

# Go authentication client

`github.com/greenpau/go-authcrunch/pkg/authclient` performs the portal's JSON
login exchange. It supports password, TOTP, and a separate API-key login. It
does not administer users, verify JWT signatures, implement browser WebAuthn,
or automatically renew refresh credentials.

Pin the version corresponding to the portal being integrated:

```bash
go get github.com/greenpau/go-authcrunch@v1.3.8
```

Use that module's required Go toolchain. `NewClient` validates and copies its
configuration. Supply terminal/UI input through `Options.Prompt` when needed;
the package itself does not discover configuration files or prompt directly.
Use one client per identity, and serialize calls when a shared prompt or other
stateful input is involved.

## Authenticate with an account API key

Provision a private [local account key](../authorize/api_key_auth.md) in the
selected realm. This example reads it from an application environment and probes
the authenticated identity without printing the key or returned token:

```go
package main

import (
    "context"
    "fmt"
    "net/http"
    "os"
    "time"

    "github.com/greenpau/go-authcrunch/pkg/authclient"
)

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
    defer cancel()

    client, err := authclient.NewClient(&authclient.Config{
        BaseURL: "https://auth.example.com/auth",
        Realm:   "local",
        APIKey:  os.Getenv("AUTHCRUNCH_ACCOUNT_API_KEY"),
    }, authclient.Options{})
    if err != nil { panic(err) }
    credentials, err := client.Authenticate(ctx)
    if err != nil { panic(err) }
    authorization, err := credentials.Authorization()
    if err != nil { panic(err) }

    req, err := http.NewRequestWithContext(ctx, http.MethodGet,
        "https://auth.example.com/auth/whoami?format=json", nil)
    if err != nil { panic(err) }
    req.Header.Set("Authorization", authorization)
    transport := &http.Client{
        Timeout: 5*time.Second,
        CheckRedirect: func(*http.Request, []*http.Request) error {
            return http.ErrUseLastResponse
        },
    }
    response, err := transport.Do(req)
    if err != nil { panic(err) }
    defer response.Body.Close()
    fmt.Println("Identity probe HTTP status:", response.StatusCode)
}
```

Send credentials only to an intended trusted HTTPS service; do not forward them
through arbitrary redirects. The portal validates the account's key and direct
authentication requirements. A key is not a way around a required MFA login.
Do not combine `APIKey` with username/password/TOTP configuration or native
body refresh transport. This login returns an access token and creates no
refresh family or browser OIDC session.

## Password, TOTP, and renewable native sessions

For a password login, configure `Username` and `Realm`, then supply `Password`
or an application-owned prompt. TOTP can use an entered code or explicitly
configured secret/code parameters. Keeping a TOTP seed alongside the password
changes the security of the automation; prefer a design that preserves the
intended factor boundary.

The default cookie-compatible mode can authenticate an access-only realm.
If a refresh-enabled realm returns browser session metadata instead of access
credentials, the client returns `ErrNativeTransportRequired` without retrying.
To receive native credentials, set `RefreshTransport: authclient.RefreshTransportBody`
and explicitly [enable body transport](../authenticate/30-refresh-token.md)
for that local realm. This mode has no cookie jar and does not establish a
browser Profile or OIDC session.

Every `Authenticate` starts a fresh exchange, bounded to ten requests. Redirects
are disabled; context cancellation applies to HTTP requests and prompts. An
unsupported WebAuthn challenge returns an error rather than being substituted
with another authentication method.

## Credential storage and validation

`Credentials.Authorization()` produces the portal's `name=token` header.
The optional `FileTokenStore` loads/saves private credentials. Applications choose
the cache path and lifecycle; isolate stores by portal and identity and protect
the containing directory. Avoid logging configuration or credential objects.

`Credentials.Validate()` checks transport syntax, **not** JWT authenticity or
expiry. A receiving gatekeeper still verifies the token and applies its ACL.
The client returns refresh credentials when configured but does not rotate them;
use the explicit refresh protocol and preserve its single-use/replay semantics.

See the [released package contract](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/pkg/authclient/doc.go)
and the [management CLI](local-client.md) for the separate administrative workflow.
