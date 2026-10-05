---
title: "Local identity store configuration"
description: "Configure a local identity store and connect its realm to the authentication portal."
discovery:
  topic: identity-providers
  kind: guide
  aliases: ["local database", "users.json"]
---

# Local identity store configuration

A local store owns account records, password hashes, roles and registered MFA
credentials in a file-backed JSON database. Give it a configuration nickname,
a distinct realm and a private, persistent path; enable the nickname in a portal.

```caddyfile
security {
    local identity store localdb {
        realm local
        path /var/lib/authcrunch/users.json
    }
    authentication portal myportal {
        enable identity store localdb
    }
}
```

This is a global-security fragment. A complete deployment also mounts
`authenticate with myportal` and protects its application with an authorization
policy. Use the [first application](../../start/first-app.md) for the complete
local exercise, or [refresh sessions](../30-refresh-token.md) for a canonical
HTTPS renewable-session deployment.

## Provision the database

The service creates the database when it does not exist. Prepare its parent
directory with private service ownership; keep the database outside web roots
and static assets. File-backed identity data are separate from optional
[encrypted runtime state](../../operations/runtime-state.md).

If no administrative account exists, provisioning creates one with `authp/admin`.
Defaults are `webadmin` and `webadmin@localdomain.local`. Set these variables
**before first provisioning** when a known bootstrap account is needed:

| Variable | Purpose |
| --- | --- |
| `AUTHP_ADMIN_USER` | Bootstrap username |
| `AUTHP_ADMIN_EMAIL` | Bootstrap email |
| `AUTHP_ADMIN_SECRET` | Private bootstrap password |

If the password is omitted, the service generates one. The current startup log
reports username/email/roles, **not the password**; searching for the old
`user_secret` log field will not recover it. These variables create a missing
admin, not overwrite an existing account's password. Use supported account
management to change existing credentials.

## Assign the minimum roles

`authp/admin` is for administration, `authp/user` for ordinary portal access, and
an application role such as `app/member` for the app's policy. They have different
purposes. Do not give every new account an administrative role just to make login
work. Static-user provisioning, account updates and self-registration are
explained in the adjacent guides.

Verify a fresh user's login, required MFA, allowed app access, a nonmember's 403
and logout. A correct database path alone does not establish those boundaries.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Map nickname, realm, and path</summary>

```text
Help me understand Local identity store configuration.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-identity-stores,
local-identity-database, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/local

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain a local store’s configuration nickname, login realm, private database
path, and portal selection. Trace the additional handler mount and app policy
required for a complete deployment. Compare file-backed identity records with
encrypted runtime-session state.
```

</details>

<details>
<summary>Understand first provisioning</summary>

```text
Help me understand Local identity store configuration.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-identity-stores,
local-identity-database, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/local

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Walk through missing-database creation and missing-administrator bootstrap.
Explain when AUTHP_ADMIN_USER/EMAIL/SECRET are read and what existing accounts
retain. Do not expect a generated password in startup logs or assume
environment changes reconcile an existing admin.
```

</details>

<details>
<summary>Review role separation</summary>

```text
Help me understand Local identity store configuration.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-identity-stores,
local-identity-database, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/local

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare authp/admin, authp/user, and app/member using three disposable
accounts. Explain login, Profile, administrative API, and app access as
separate boundaries. Help me choose minimum privileges rather than granting
administration to fix app denial.
```

</details>

<details>
<summary>Diagnose store setup</summary>

```text
Help me understand Local identity store configuration.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-identity-stores,
local-identity-database, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/local

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me investigate wrong realm, unreadable/unwritable path, missing
parent-directory ownership, existing admin credentials, and disabled portal
selection. Ask for redacted errors and filesystem metadata only. Keep
users.json outside public static roots.
```

</details>

<details>
<summary>Plan complete local verification</summary>

```text
Help me understand Local identity store configuration.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-identity-stores,
local-identity-database, configuration-users.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/local/local

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Create cases for fresh login, required MFA, intended member access, nonmember
403, logout, and restart with coherent private data. Explain why a correct
file path or successful adaptation alone does not establish those outcomes.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28localIdentityStore%20OR%20AUTHP_ADMIN_SECRET%20OR%20LocalIdentityStore%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_identity_store.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_identity_store.go)
   — adapts local and LDAP store declarations.
3. [caddy-security: caddyfile_user.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_user.go)
   — parses configured local users, credentials, roles, and challenge rules.
4. [go-authcrunch: pkg/ids/local/store.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/ids/local/store.go)
   — constructs the file-backed local store and provisions configured accounts.
5. [go-authcrunch: pkg/ids/local/authenticator.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/ids/local/authenticator.go)
   — authenticates local identities and dispatches account-management requests.
6. [go-authcrunch: pkg/ids/local/store_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/ids/local/store_test.go)
   — tests local store configuration, provisioning, and behavior.
