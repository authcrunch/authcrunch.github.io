---
title: "Standalone portal login client"
description: "Install caddy-authenticator, configure private login profiles, and obtain or renew native credentials without an administrator API."
discovery:
  topic: operations
  kind: guide
  aliases: ["caddy-authenticator", "native login", "CLI", "profiles"]
---

# Standalone portal login client

`caddy-authenticator` logs in to a portal using password, TOTP or an account API
key. It needs neither a Caddy binary on the client nor the admin/Profile API.
It is separate from [`security local`](local-client.md), which administers users,
and from `authdbctl`. Browser SSO, OAuth redirects and WebAuthn assertions are
outside this direct JSON client's scope.

## Install v1.5.0

The [caddy-security v1.5.0 release](https://github.com/greenpau/caddy-security/releases/tag/v1.5.0)
contains `caddy-authenticator_1.5.0_OS_ARCH` archives: `.tar.gz` for Linux/macOS,
`.zip` for Windows, with `amd64` and `arm64` variants. Compare SHA-256 against
the same release's `authcrunch_1.5.0_SHA256SUMS`, extract and place the executable
on your PATH. The separate AuthCrunch distribution archives contain the server,
not this client.

Alternatively, with Go 1.26 or newer:

```sh
go install github.com/greenpau/caddy-security/cmd/caddy-authenticator@v1.5.0
caddy-authenticator version
```

## Configure and log in

```sh
caddy-authenticator configure --profile work \
  --url https://auth.example.com/auth --realm local --username alice
caddy-authenticator login --profile work --interactive
caddy-authenticator profiles
```

Use the portal base URL, including its mount, without `/login`. Commands are
noninteractive by default. `--interactive` opts into hidden password/MFA
prompts; for automation use a private `--password-file`. The configuration command above stores no
password. Passwords, TOTP codes and bearer tokens are omitted from login output
and logs; failed login preserves an existing saved token.

The default private profile directory is `~/.caddy-authenticator` on macOS/Linux
and `%USERPROFILE%\.caddy-authenticator` on Windows. Its extensionless credentials
file uses named sections; it is not `security local` YAML. Protect credentials,
token files and logs. Use the selected command's `--help` and the
[versioned usage reference](https://github.com/greenpau/caddy-security/blob/v1.5.0/cmd/caddy-authenticator/README.md)
for profile settings and token extraction. The `token` command deliberately
outputs the credential for a consuming application; keep that output private.

## Renewal and uncertain responses

| Saved credential | What `login` does |
| --- | --- |
| Valid with at least three minutes left | Reuse locally |
| Valid with less than three minutes and native refresh | Attempt one rotation |
| Valid with less than three minutes and no refresh | Reuse and report renewal unavailable |
| Absent or expired | Authenticate again |
| Unreadable or indeterminate expiry | Fail; use deliberate `--force` recovery |

Local expiry inspection is a scheduling check, not signature or revocation
verification. Resource servers still validate the token. `login --force`
authenticates again even with an unexpired cached credential.

Refresh requires profile `refresh_transport = body` and the portal's explicit
[native transport opt-in](../authenticate/30-refresh-token.md#native-json-clients).
The client writes a private `refresh.pending` marker before rotation and removes
it only after saving replacement credentials. A failed/uncertain exchange is
not replayed automatically. Recover with fresh `login --force`; `clear` removes
local state without revoking the server session. This client has renewal logic;
the reusable Go SDK and administrative CLI retain their own behavior.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Choose the right client</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: scripts-and-automation; authentication-client.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/caddy-authenticator

Compare caddy-authenticator, security local, authdbctl and the Go SDK for login, administration, profiles and renewal. Identify versioned release assets.
```

</details>

<details>
<summary>Configure private profiles</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: scripts-and-automation; authentication-client.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/caddy-authenticator

Explain a synthetic work/personal profile setup, noninteractive defaults, hidden prompts and private token storage without exposing credentials.
```

</details>

<details>
<summary>Trace cached login</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: scripts-and-automation; authentication-client.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/caddy-authenticator

Walk through valid, near-expiry, expired and unreadable cached credentials. Explain local expiry inspection versus resource-server signature and revocation checks.
```

</details>

<details>
<summary>Recover uncertain refresh</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: scripts-and-automation; authentication-client.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/caddy-authenticator

Explain the refresh.pending marker when rotation commits but the response or local save fails. Show deliberate force-login recovery and why clear does not revoke server authority.
```

</details>

<details>
<summary>Check supported factors</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: scripts-and-automation; authentication-client.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/caddy-authenticator

Compare password/TOTP and API-key native login with browser SSO and WebAuthn. Explain body-transport opt-in and propose positive/negative tests against a pinned portal.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20caddy%20authenticator&type=code).
- [cmd/caddy-authenticator/README.md (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/cmd/caddy-authenticator/README.md): Versioned command usage.
- [pkg/authclient/client.go (v1.4.1)](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/pkg/authclient/client.go): Underlying login client.
