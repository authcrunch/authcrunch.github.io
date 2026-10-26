---
title: "SQLite accounts and signup"
description: "Provision SQLite password accounts, select them in a portal, and add durable email-confirmed registration without a separate approval service."
discovery:
  topic: identity-providers
  kind: guide
  aliases: ["SQLite", "security identity", "signup", "email confirmation", "registration"]
---

# SQLite accounts and signup

AuthCrunch v1.5.0 provides optional SQLite password identities and email-confirmed
signup using go-authcrunch v1.4.1. Install the
[distribution or required companions](../../operations/backends.md):
`identity-stores-sqlite`, and, for signup, `messaging-sqlite` and
`registration-workflows-sqlite`. This is a different backend from the
[JSON-file local store](20-identity-store.md).

## Provision an account first

Normal startup opens an existing account database; it does not create a default
administrator or empty account store. Prepare a private `0700` directory and a
`0600` JSON file, for example `/var/lib/authcrunch/private/create-alice.json`:

```json
{
  "config": {
    "name": "accounts",
    "realm": "staff",
    "path": "/var/lib/authcrunch/private/accounts.db",
    "timeout": "1s"
  },
  "username": "alice",
  "email": "alice@example.test",
  "name": "Alice Example",
  "roles": ["authp/user", "app/member"]
}
```

Run the trusted offline command; it prompts for and confirms a hidden password:

```sh
authcrunch security identity create --config /var/lib/authcrunch/private/create-alice.json
```

For automation, use `--password-file` with a private regular file. Passwords
require 12–72 UTF-8 bytes and cannot be blank. Keep them out of flags and JSON.
The database stores bcrypt hashes and ordinary account metadata in plaintext;
protect the file and its backups. No external SQLite executable or cgo is needed.

## Select the store

Add this fragment inside the global `security` block of a working portal:

```caddyfile
identity store sqlite accounts {
    realm staff
    path /var/lib/authcrunch/private/accounts.db
    timeout 1s
}
authentication portal myportal {
    enable identity store accounts
    crypto key sign-verify {env.AUTHCRUNCH_SIGNING_KEY}
}
```

Supply a private signing key, mount `authenticate with myportal at /auth`, and
configure a policy verifying that key and requiring `app/member` before the
application handler. The store name is `accounts`; the login realm is `staff`.
Paths must be absolute, with private existing parent directories. These backend
fields do not expand runtime `{env.NAME}` or secret references. `timeout` accepts
1ms–30s and defaults to 1s.

Browser password, native JSON and Basic login use this password store. It does
not implement local MFA, recovery, account API keys or Profile mutations.
Recognized authenticated Profile operations return 501. Requiring an unsupported
factor must deny login. Downstream OIDC realms and external attachment targets
retain their built-in-local-store restrictions.

## Manage current account policy

Offline commands are `security identity set-password`, `roles`, `disable`,
`enable` and `delete`. Mutation JSON contains the same `config`, plus **both**
`username` and `email`; only `roles` additionally accepts a complete replacement
`roles` list. Do not reuse the create file's `name` field for mutations.
`set-password` uses the same prompt or private password-file input.

Disablement, deletion and password changes invalidate captured refresh evidence.
Current roles govern new credentials; already signed access JWTs retain their
expiry. An uncertain mutation requires inspection before retrying. SQLite account
handles create a new proof epoch on replacement, so persisted refresh credentials
cannot reuse the old handle's evidence. Durable accounts alone do not retain
browser sessions.

## Email-confirmed signup

After provisioning the account database, add these declarations inside the same
`security` block. The passwordless SMTP listener is a **loopback test mail sink**;
replace it with a reviewed [production mail configuration](../../messaging/intro.md)
before deployment:

```caddyfile
messaging email provider smtp-local {
    address 127.0.0.1:1025
    protocol smtp
    passwordless
    sender auth@example.test
}
messaging sqlite provider notifications {
    path /var/lib/authcrunch/private/outbox.db
    delivery smtp-local
}
user registration sqlite signup {
    path /var/lib/authcrunch/private/signup.db
    identity_store accounts
    realm staff
    email_provider notifications
    public_origin https://auth.example.com
    base_path /auth
    timeout 1s
}
```

Inside the existing `myportal` block, add:

```caddyfile
enable user registration signup
```

Keep the account, outbox and pending-signup files distinct. Their parents must
already exist privately. The outbox and signup files can be created at startup.
The workflow requires these exact SQLite account and outbox backends; a JSON
local store or ordinary email provider is not a substitute.

Configure the real canonical HTTPS origin and mount. Preserve the path through
the handler. Confirmation links use those configured values, not incoming Host
headers. Explicitly enable the registry in each portal offering signup;
attaching the account store alone does not display the signup link.

| Step | Result |
| --- | --- |
| Submit the realm's signup form | Persist pending evidence and enqueue a confirmation message |
| Receive email | Delivery is separate from durable queue acceptance |
| Submit the body passcode before expiry | Create an enabled account with only `authp/user`; redirect 303 to login |
| Sign in normally | Obtain a session; application access still requires its own role |

Pending signup survives restart, expires after 45 minutes, and allows five wrong
codes. Its lifetime capacity is 10,000 entries including terminal history.
Confirmation grants no session or application membership. This workflow has no
invitation, administrator approval, domain/MX rules, terms gate, public resend
or MFA enrollment. Those legacy registration settings cannot be copied into it.

The legacy [dropbox registration](40-user-registration.md) still retains its
separate review/provisioning boundary. SQLite confirmation provisions the account
directly. Account creation and pending confirmation commit in separate files;
an uncertain result can leave an account already created. Drain/reopen unhealthy
handles, inspect the account and reconcile the same live evidence before retrying.
Do not delete evidence or recreate a deleted enrollment to force success.

## Verify the deployment

Test a provisioned user, wrong password, a user without `app/member`, account
disablement, and password/role changes. For signup, test actual email delivery,
wrong/replayed codes, restart before confirmation and login after confirmation.
Verify that signup alone cannot reach the application. Keep the outbox private:
it contains recipient details and plaintext confirmation codes.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Provision privately</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; configuration-registrations; sqlite-registration.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/local/sqlite

Explain the private JSON and password-file contract for security identity create and roles. Contrast initial database creation with normal portal startup and show a synthetic mutation input.
```

</details>

<details>
<summary>Compare identity stores</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; configuration-registrations; sqlite-registration.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/local/sqlite

Compare built-in local, SQLite and Consul password identities for MFA, profile mutations, downstream OIDC and proof lifetime. Resolve capability claims using interfaces and consumers.
```

</details>

<details>
<summary>Trace confirmed signup</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; configuration-registrations; sqlite-registration.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/local/sqlite

Trace a registration through pending state, outbox delivery, account creation and 303 login redirect. Explain the exact role grant and why confirmation is neither MFA nor application authorization.
```

</details>

<details>
<summary>Recover uncertainty</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; configuration-registrations; sqlite-registration.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/local/sqlite

Analyze a confirmation where account creation commits but pending confirmation fails. Explain how fresh-handle reconciliation preserves UUID and administrator changes without recreating deleted enrollment.
```

</details>

<details>
<summary>Check access boundaries</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; configuration-registrations; sqlite-registration.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/local/sqlite

Design successful and denied login/signup checks with synthetic users, including role changes, wrong/replayed codes, restart and unavailable queues. State which require a real mail sink or browser.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20sqlite&type=code).
- [command_identity_sqlite.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/command_identity_sqlite.go): Private offline administration.
- [app_registration_workflows.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/app_registration_workflows.go): Workflow dependency binding.
- [plugins/identity-stores/sqlite/store.go (v1.4.1)](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/plugins/identity-stores/sqlite/store.go): Password identity transactions.
- [plugins/registration-workflows/sqlite/workflow.go (v1.4.1)](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/plugins/registration-workflows/sqlite/workflow.go): Confirmation and reconciliation.
