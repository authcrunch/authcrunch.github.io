---
title: "Local password management"
description: "Generate bcrypt or Argon2id hashes and change a local password through the current profile interface."
discovery:
  topic: operations
  kind: guide
  aliases: ["authdbctl", "password hash", "bcrypt", "Argon2id"]
---

# Local password management

Local passwords support **bcrypt and Argon2id** in caddy-security v1.3.0 /
go-authcrunch v1.3.8. A federated user changes their password at their identity
provider; signing into the portal does not grant control of a local account.


## Choose the password operation

Hash generation, password replacement, and recovery are different operations with different authority.

| Task | Interface | Expected outcome |
| --- | --- | --- |
| Generate bcrypt or Argon2id import material | Offline released password utility | A directive; no account is changed |
| Change your own current password | Local Profile with live session and current proof | Account mutation; verify new login and old credential rejection |
| Replace another account’s password | Enabled administrative API or compatible management client | Explicit admin mutation of the selected account |
| Recover a forgotten password | Your administrator-assisted process | The released recovery view is not a complete reset-link service |

## Manually

Use the released executable's password utility. It prompts without terminal echo:

```sh
authcrunch security local generate password hash
authcrunch security local generate password hash --algorithm argon2
```

Bcrypt is the default, cost 10. Argon2 selects Argon2id; defaults are 65536 KiB,
three iterations and four lanes. The output is a quoted **Caddyfile password
directive**, ready for [static-user provisioning](50-static-users.md). Review
resource use before changing cost parameters; `--cost` is bcrypt-only.

For automation, `--password-file /private/password.txt` requires an owner-only
file, or `--password-file -` reads stdin. One final LF/CRLF is removed; other
whitespace is preserved. `--db-path` reads the existing password policy without
modifying the database. Do not put a production password on a command line.

A compatible standalone CLI can be installed at the matching version:

```sh
go install github.com/greenpau/go-authcrunch/cmd/authdbctl@v1.3.8
```

Its [released command guide](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/cmd/authdbctl/README.md)
explains server configuration and updates. Do not assume installing `@latest`
changes the library inside a previously built Caddy server.

Prefer a supported account mutation over replacing a JSON hash by hand. Manual
file repair requires a stopped writer and coherent backup; it must preserve
algorithm and security metadata. A password change invalidates prior credential
evidence, so verify a fresh login and old refresh/OIDC credential rejection.

## Settings Page

For a local account with `authp/user` or `authp/admin`, sign in and open
`/auth/profile/`, then choose password management. A live completed portal session
is required. The old `/auth/settings` route is not available in this release.

1. Confirm the selected local account and enter the current password.
2. Enter and confirm a new password that satisfies the store's policy.
3. Submit the change and sign in again with the new credential.
4. Verify that the old password fails and required MFA still applies.

<details className="screenshot-gallery">
<summary>Password-change sequence captured in March 2026</summary>

<figure className="doc-screenshot">
  <img src={require('./images/local_password_change_1.png').default} alt="Username step before a local password change" />
  <figcaption>Enter the username, then complete the password and any required MFA steps.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/local_password_change_2.png').default} alt="Applications page with a User Profile link" />
  <figcaption>Select the configured User Profile link, or open `/auth/profile/` directly.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/local_password_change_3.png').default} alt="Local profile dashboard with Change Password highlighted" />
  <figcaption>Select password management for your local account.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/local_password_change_4.png').default} alt="Local profile password-change dialog" />
  <figcaption>Verify the current password and submit a policy-compliant replacement; current field layout may differ.</figcaption>
</figure>

</details>

The released recovery endpoint does not provide a complete forgotten-password
service. Establish an administrator-assisted recovery process rather than
promising reset links that the implementation cannot complete.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Compare bcrypt and Argon2id</summary>

```text
Help me understand Local password management.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: local-password-authentication, configuration-users,
authentication-portal-profile.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/password-management

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain the released password utility’s algorithms, cost/resource settings,
and generated Caddyfile directive. Separate hashing from encryption and from a
JSON credential record. Ask which installed utility/version I use before
recommending parameters.
```

</details>

<details>
<summary>Understand private input handling</summary>

```text
Help me understand Local password management.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: local-password-authentication, configuration-users,
authentication-portal-profile.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/password-management

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Walk through interactive terminal input, owner-only password file, and stdin
without running commands. Explain newline removal, preserved whitespace,
--db-path policy reading, and why a production password must not appear on a
command line or in shell history.
```

</details>

<details>
<summary>Compare self-service and administration</summary>

```text
Help me understand Local password management.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: local-password-authentication, configuration-users,
authentication-portal-profile.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/password-management

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain a current local Profile password change versus administrator
credential provisioning/reset. Include current-password verification,
local/live-session requirements, policy enforcement, and fresh login. Keep
federated password changes at the identity source.
```

</details>

<details>
<summary>Diagnose a rejected password</summary>

```text
Help me understand Local password management.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: local-password-authentication, configuration-users,
authentication-portal-profile.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/password-management

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me investigate wrong old password, surrounding-whitespace differences,
hash-format mismatch, password policy, unsupported cost flags, or old Settings
links. Ask for redacted errors and metadata. Never ask for the actual password
or manually alter textual hash parameters to rehash it.
```

</details>

<details>
<summary>Plan credential-change regression</summary>

```text
Help me understand Local password management.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: local-password-authentication, configuration-users,
authentication-portal-profile.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/password-management

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Design a disposable-user test for new-password success, old-password denial,
MFA persistence, and refresh/OIDC evidence invalidation. Explain supported
mutation versus offline stopped-writer repair and the absence of a complete
released forgotten-password workflow.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28Argon2%20OR%20PasswordHashConfig%20OR%20update_user_password%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: command_credentials.go](https://github.com/greenpau/caddy-security/blob/main/command_credentials.go)
   — implements offline password-hash and API-key generation.
3. [caddy-security: command_credentials_test.go](https://github.com/greenpau/caddy-security/blob/main/command_credentials_test.go)
   — tests credential-generation flags, input, and output handling.
4. [go-authcrunch: pkg/identity/password.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/identity/password.go)
   — defines password records and hash handling.
5. [go-authcrunch: pkg/identity/password_argon2.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/identity/password_argon2.go)
   — implements bounded Argon2id password-hash handling.
6. [go-authcrunch: pkg/authn/api_update_user_password.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/api_update_user_password.go)
   — validates and applies a signed-in local user’s password change.
7. [go-authcrunch: pkg/identity/password_argon2_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/identity/password_argon2_test.go)
   — tests Argon2id hashing, verification, and rejected inputs.
