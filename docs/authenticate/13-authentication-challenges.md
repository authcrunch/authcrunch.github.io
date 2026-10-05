---
sidebar_position: 13
description: "Define the authentication challenges users must complete, including passwords, application codes, and hardware tokens."
discovery:
  topic: login-and-mfa
  kind: guide
  aliases: ["MFA", "2FA", "passkey", "YubiKey", "passwordless"]
---

# Authentication Challenges

Challenge rules select the methods a **local user** must actually complete and
in what order. The released bundle supports Caddyfile rules, stored user rules
and API updates. A policy selects checkpoints; only successful verification
completes them.

Without explicit rules, a local account uses a password followed by its available
MFA. `require mfa` adds an enrollment requirement when needed. Explicit rules
that cannot match the user's registered methods **deny login**; they do not
silently fall back to the default.

## Challenge Types

| Type | Released portal behavior |
| --- | --- |
| `password` | Password verification; considered available for rule selection |
| `totp` | Registered authenticator application's time-based code |
| `u2f` | Registered WebAuthn hardware token or passkey assertion |
| `mfa` | An available supported MFA method |
| `email` | Recognized by the shared rule grammar, but no implemented portal email checkpoint |

Do not configure `email` as a functioning login method. An email address on an
account does not constitute an enrolled authentication factor.

## Rule Syntax

```text
<type> [<type>...] [if <type> [and <type>...] not available]
<type> or <type> [or <type>...] [if <type> [and <type>...] not available]
```

Rules are ordered. The first satisfiable rule selects a sequence. Without `or`,
all named methods must be available and all become checkpoints. With `or`, the
**first available alternative in the written order** is the sole selected
checkpoint. It does not require enrollment or verification of every alternative.

The `if ... not available` condition requires every condition method to be absent.
Password is always considered available for selection; this does not bypass
password verification. Repeated/conflicting types and malformed rules are rejected.

## Configuring via authdbctl

Use an installed, compatible `authdbctl` against the intended running server and
local realm. The CLI supports repeated overwrite flags:

```sh
authdbctl update user \
  --username alice \
  --email alice@example.com \
  --realm local \
  --overwrite-auth-challenges "password totp"
```

Configure its server credentials and transport as described in
[static users](local/50-static-users.md#password-generation) and
[Server API](api/40-server-api.md). The example requires a previously enrolled
TOTP token; without it login is denied.

The [Profile API](api/30-profile-api.md) uses `kind: overwrite_user_auth_challenges`
and this body for a permitted local account's live session:

```json
{"challenges": ["password totp"]}
```

## Caddyfile Configuration

These fragments are supported in caddy-security v1.3.0 / go-authcrunch v1.3.8.
Adapt the full deployment with the executable you will run.

### Via Transform User Directive

For a strict password-plus-TOTP policy on a provisioned local realm:

```caddyfile
transform user {
    match realm local
    require auth challenges password totp
}
```

A transform-selected policy overrides the account's selected sequence; additive
requirements such as `require mfa` still apply. The first applicable transform
policy that can resolve a sequence wins. If applicable policies resolve none,
login is denied. Use realm matchers so local challenge requirements are not
accidentally applied to federated identities.

### Via Identity Store User Configuration

Within the local store definition, an administrator can set the account policy:

```caddyfile
local identity store localdb {
    realm local
    path /var/lib/authcrunch/users.json
    user alice {
        email alice@example.com
        roles authp/user app/member
        auth challenges password totp
    }
}
```

This fragment assumes an existing account with credentials; it supplies no usable
password or enrolled TOTP secret for a new account. See [static users](local/50-static-users.md)
for provisioning and overwrite semantics.

## Evaluation Examples

A hardware-first policy with an **intentional password-only fallback** can use:

```text
u2f
password totp if u2f not available
password if u2f and totp not available
```

| Registered methods | Selected checkpoints |
| --- | --- |
| Hardware token and TOTP | `u2f` |
| Hardware token only | `u2f` |
| TOTP only | `password`, `totp` |
| Neither MFA method | `password` |

If password-only login is unacceptable, omit that fallback and provision a usable
factor before applying the policy.

For `u2f or totp`, a user with both gets **u2f only**; a user with TOTP only gets
**totp only**. Neither matches when no factor is registered. To require both,
write `u2f totp`. An ordered alternative is not a user-choice screen.

## Editing the Identity Store Directly

Stored local records use `auth_challenge_rules`:

```json
{"username": "alice", "auth_challenge_rules": ["password totp"]}
```

This is an excerpt, not a replacement database. Prefer the supported CLI/API;
manual file edits require stopping the writer, backing up the coherent database
and preserving its schema. Security-state changes invalidate old authentication
evidence, so test with a fresh login rather than an existing cookie.

Also test unavailable methods, wrong assertions, enrollment followed by fresh
login, and stronger policy changes. Basic/API-key authentication cannot manufacture
proof of missing checkpoints. Refresh and OIDC recheck local evidence against the
current policy; selected rules alone are not successful MFA claims.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Trace rule selection</summary>

```text
Help me understand Authentication Challenges.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-challenges,
configuration-authentication-user-transforms, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/authentication-challenges

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain ordered rules, availability, all-method sequences, and first-available
or alternatives. Walk through password, totp, and u2f for accounts with
different enrolled methods. Separate sequence selection from verifying every
selected checkpoint.
```

</details>

<details>
<summary>Compare policy owners</summary>

```text
Help me understand Authentication Challenges.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-challenges,
configuration-authentication-user-transforms, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/authentication-challenges

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare account-stored challenge rules, transform-selected sequences, and
additive require mfa. Explain precedence and what happens when an explicit
applicable policy cannot resolve a sequence. Ask for my local realm and
release before reviewing a policy.
```

</details>

<details>
<summary>Analyze a fallback</summary>

```text
Help me understand Authentication Challenges.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-challenges,
configuration-authentication-user-transforms, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/authentication-challenges

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Use the hardware-first example to identify when password-only login is
intentionally allowed. Compare u2f or totp with u2f totp. Help me remove
ambiguity about unavailable methods without inventing a user-choice screen or
pretending enrollment equals authentication.
```

</details>

<details>
<summary>Design evidence regression tests</summary>

```text
Help me understand Authentication Challenges.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-challenges,
configuration-authentication-user-transforms, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/authentication-challenges

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Create cases for unavailable factors, wrong assertions, enrollment followed by
fresh login, changed challenge policy, direct Basic/API-key calls, and
renewal. Explain how current account evidence affects refresh/OIDC and which
test result proves completed factor claims.
```

</details>

<details>
<summary>Practice editing interfaces</summary>

```text
Help me understand Authentication Challenges.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-challenges,
configuration-authentication-user-transforms, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/authentication-challenges

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain the differences between Caddy static provisioning, supported CLI/API
challenge updates, and offline JSON edits. Use excerpts rather than
replacement databases. Ask me five rule-selection questions one at a time and
require a reasoned checkpoint sequence for each.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28AuthenticationChallengeConfig%20OR%20AuthenticationChallenges%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authn_transform.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_transform.go)
   — adapts user-transform matchers, actions, and required challenges.
3. [go-authcrunch: pkg/authchal/config/config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authchal/config/config.go)
   — defines ordered authentication challenge rules and their validation.
4. [go-authcrunch: pkg/authchal/config/check.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authchal/config/check.go)
   — selects an ordered sequence from available authentication methods.
5. [go-authcrunch: pkg/authn/authentication_challenges.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/authentication_challenges.go)
   — checks direct credential login against resolved challenge requirements.
6. [go-authcrunch: pkg/authn/authentication_challenges_sequence_e2e_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/authentication_challenges_sequence_e2e_test.go)
   — tests ordered authentication sequences through portal requests.
7. [go-authcrunch: pkg/authn/handle_http_sandbox.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_http_sandbox.go)
   — handles local browser authentication checkpoints.
8. [go-authcrunch: pkg/authn/handle_api_profile.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_api_profile.go)
   — checks local identity/session access and dispatches Profile operations.
