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

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Trace a client authentication exchange</summary>

```text
Help me understand Go authentication client.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-client, refresh-token-transports.

Secondary reference:
https://docs.authcrunch.com/docs/operations/authclient

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain how pkg/authclient sends JSON password login, invokes the
application-owned TOTP prompt, and continues checkpoints. Distinguish its
bounded request loop from an interactive browser login. Ask for the module and
portal versions; identify unsupported WebAuthn, administration, and automatic
renewal expectations.
```

</details>

<details>
<summary>Choose an explicit credential transport</summary>

```text
Help me understand Go authentication client.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-client, refresh-token-transports.

Secondary reference:
https://docs.authcrunch.com/docs/operations/authclient

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare access-only compatibility mode with an explicitly enabled body refresh
transport on both client and portal. Explain ErrNativeTransportRequired and
why it must not silently retry or fall back to browser cookies. Trace
transport selection through every checkpoint and keep credential acquisition
separate from refresh rotation.
```

</details>

<details>
<summary>Review client ownership and cancellation</summary>

```text
Help me understand Go authentication client.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-client, refresh-token-transports.

Secondary reference:
https://docs.authcrunch.com/docs/operations/authclient

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Review a small synthetic client integration for one identity per instance,
serialized prompts, context cancellation, timeout, TLS roots, and refused
redirects. Explain why config-file discovery and terminal input belong to the
calling application. Show how to return a canceled prompt without leaking
credentials or continuing authentication.
```

</details>

<details>
<summary>Interpret and store returned credentials</summary>

```text
Help me understand Go authentication client.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-client, refresh-token-transports.

Secondary reference:
https://docs.authcrunch.com/docs/operations/authclient

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain Credentials.Authorization, token-name handling, access versus refresh
fields, and FileTokenStore ownership. Compare Validate’s structural checks
with signature, expiry, and live authorization checks. Plan private storage
and explicit cache invalidation; receiving a stored token is not proof it
remains usable.
```

</details>

<details>
<summary>Compare password and API-key login</summary>

```text
Help me understand Go authentication client.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-client, refresh-token-transports.

Secondary reference:
https://docs.authcrunch.com/docs/operations/authclient

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Trace the separate account API-key exchange and its access-only result.
Explain why mixing password fields, requesting refresh, assuming a Profile
session, or bypassing required factors is incorrect. Design positive,
denied-factor, canceled-context, malformed-response, and expired-cache cases
with synthetic credentials.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28NewClient%20OR%20ErrNativeTransportRequired%20OR%20FileTokenStore%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [go-authcrunch: pkg/authclient/client.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authclient/client.go)
   — runs context-bound JSON authentication and checkpoint continuation.
3. [go-authcrunch: pkg/authclient/config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authclient/config.go)
   — validates authentication URL, identity, TLS, and transport settings.
4. [go-authcrunch: pkg/authclient/credentials.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authclient/credentials.go)
   — represents returned credentials and constructs their Authorization value.
5. [go-authcrunch: pkg/authclient/token_store.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authclient/token_store.go)
   — loads and saves credentials through the configured token-store interface.
6. [go-authcrunch: pkg/authclient/transport_e2e_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authclient/transport_e2e_test.go)
   — tests refresh transport negotiation through real client/server exchanges.
7. [go-authcrunch: pkg/authn/handle_json_login.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_json_login.go)
   — advances stateful JSON login checkpoints and returns completion results.
8. [caddy-security: command_local_client.go](https://github.com/greenpau/caddy-security/blob/main/command_local_client.go)
   — loads private client configuration, authenticates, and sends bounded administrative requests.
