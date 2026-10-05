---
description: "Define local users, password hashes, and roles inside a Caddyfile identity store."
discovery:
  topic: identity-providers
  kind: reference
  aliases: ["bootstrap", "bcrypt", "Argon2id"]
---

# Static Users

A local store can provision named users from configuration. Use this for explicit
initial accounts; normal account changes belong to the supported management API.
The file path is private persistent storage, not a web-served resource.

```caddyfile
local identity store localdb {
    realm local
    path /var/lib/authcrunch/users.json
    user alice {
        name "Alice Example"
        email alice@example.com
        password "{$ALICE_PASSWORD_HASH}"
        roles authp/user app/member
    }
}
```

Set `ALICE_PASSWORD_HASH` to the **complete imported value**, such as
`bcrypt:COST:HASH` or `argon2:PHC`, produced by the utility below. The variable
expands during adaptation; protect expanded JSON as credential material.
Plaintext is supported and defaults to bcrypt hashing, but do not commit a real
plaintext password. The [local exercise](../../start/first-app.md) deliberately
uses public disposable passwords.

Existing accounts are not fully reconciled from this block. A configured password
replaces an existing one only when `overwrite` is appended. Initial name/email/role
values do not continually synchronize every existing account. Nonempty challenge
rules are explicitly overwritten; configured API keys are processed separately.
Use an account mutation API for deliberate role and identity changes.


## Initial provisioning is not continuous reconciliation

Read each configured field according to its update behavior rather than assuming the block resynchronizes an existing user.

| Configuration or task | Missing account | Existing account |
| --- | --- | --- |
| Name, email, initial roles | Used to provision the account | Not continually reconciled from these initial fields |
| Configured password | Used for provisioning | Replaced only with explicit `overwrite` |
| Nonempty challenge rules | Select local challenge policy | Explicitly overwritten; do not enroll factors |
| Normal role, identity, or password update | Create deliberately through supported administration | Use the supported mutation API/CLI |
| Password utility | Generates import material only | Does not mutate either account |

## Password Generation

The released Caddy bundle includes:

```sh
authcrunch security local generate password hash --algorithm argon2
```

It reads a password interactively without echo and prints a directive in this
**illustrative shape**:

```text
password "argon2:$argon2id$v=19$m=65536,t=3,p=4$SALT$DIGEST"
```

`SALT`/`DIGEST` here are labels, not an importable hash. Copy the utility's actual
value rather than constructing it manually. For bcrypt, omit `--algorithm` or
select `--algorithm bcrypt --cost 10`. The parser verifies the encoded cost and
bounded hash format; changing a textual cost does not rehash the password.

When intentionally replacing an existing account's password, append `overwrite`
to the generated directive. Leaving it permanently enabled can reset a user's
self-service password at each provisioning. Prefer removing that one-time
replacement setting after the intended update.

A version-compatible `authdbctl` is available from
[go-authcrunch v1.3.8](https://github.com/greenpau/go-authcrunch/releases/tag/v1.3.8)
or `go install github.com/greenpau/go-authcrunch/cmd/authdbctl@v1.3.8`.
Read its help for management transport and credential settings. The bundled
utility's [password guide](30-password-management.md) covers private file/stdin
input and Argon2 parameters.

Static `auth challenges` statements select methods, not enrolled factors. A
strict TOTP/WebAuthn rule needs a usable registered credential or login is denied.
Finally test fresh password/MFA login, the intended application role, a nonmember
and old-credential invalidation after replacement.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Distinguish provisioning from reconciliation</summary>

```text
Help me understand Static Users.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-users, local-identity-database,
local-password-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/static-users

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain which fields initialize a missing static account and which settings
can replace existing credentials/challenges. Compare initial name/email/roles
with deliberate API updates. Ask whether the account already exists before
assuming a Caddyfile edit changed it.
```

</details>

<details>
<summary>Read a generated hash directive</summary>

```text
Help me understand Static Users.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-users, local-identity-database,
local-password-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/static-users

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain complete bcrypt:COST:HASH and argon2:PHC imports, quoting,
adaptation-time environment expansion, and private adapted JSON. Use labels
for salt/digest rather than an invented usable hash. Compare trusted imports
with registration password input.
```

</details>

<details>
<summary>Reason about overwrite lifetime</summary>

```text
Help me understand Static Users.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-users, local-identity-database,
local-password-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/static-users

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Walk through a one-time password overwrite and repeated provisioning after a
self-service change. Explain why leaving overwrite enabled can undo the user’s
update. Compare that explicit credential replacement with ordinary
role/account management.
```

</details>

<details>
<summary>Diagnose an unchanged account</summary>

```text
Help me understand Static Users.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-users, local-identity-database,
local-password-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/static-users

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me investigate a static block that does not update an existing user’s
password or roles. Ask for redacted directives, existence, and management
method. Distinguish missing overwrite, initial-only fields, hash validation,
and an incompatible installed utility.
```

</details>

<details>
<summary>Test provisioning and challenges</summary>

```text
Help me understand Static Users.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-users, local-identity-database,
local-password-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/static-users

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Create cases for a new account, an existing account, explicit password
replacement, strict challenge rules without enrolled factors, and fresh login
with intended/denied app roles. Explain why selecting TOTP or u2f in static
configuration does not enroll a factor.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28overwrite%20OR%20auth%20challenges%20OR%20path%3Acaddyfile_user.go%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_user.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_user.go)
   — parses configured local users, credentials, roles, and challenge rules.
3. [caddy-security: command_credentials.go](https://github.com/greenpau/caddy-security/blob/main/command_credentials.go)
   — implements offline password-hash and API-key generation.
4. [go-authcrunch: pkg/ids/local/store.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/ids/local/store.go)
   — constructs the file-backed local store and provisions configured accounts.
5. [go-authcrunch: pkg/identity/password_input.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/identity/password_input.go)
   — distinguishes trusted credential imports from user password input.
6. [go-authcrunch: pkg/ids/local/store_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/ids/local/store_test.go)
   — tests local store configuration, provisioning, and behavior.
