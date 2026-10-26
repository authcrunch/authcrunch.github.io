---
title: "Connected external accounts"
description: "Attach verified OAuth, SAML, LDAP or ticket identities to a durable local store and connect an external login to an existing account with fresh browser proof."
discovery:
  topic: identity-providers
  kind: guide
  aliases: ["account linking", "connected accounts", "attachment", "local UUID"]
---

# Connected external accounts

AuthCrunch v1.5.0 can attach an external identity to a named built-in local
store. This preserves a local account UUID and its current roles/factor policy
across provider logins. A separate browser confirmation flow lets a user connect
a newly attached external identity to an existing local account.

## Select the account owner

Inside `security`, declare a built-in local store:

```caddyfile
local identity store accounts {
    realm local
    path /var/lib/authcrunch/private/accounts.json
}
```

Add this statement once inside the OAuth, SAML, LDAP or ticket backend:

```caddyfile
attach to local identity store accounts
```

The selector is a store **name**, not its realm or path. It must identify an
enabled built-in local store. SQLite and Consul password plugins are not
attachment targets in this release. Selecting an attachment does not enable
local login: enable `accounts` in the portal too if users need connection or
fresh local password/MFA checkpoints. Enable the external provider there as usual;
LDAP is selected as an identity store.

Omission retains provider-private memory with no default password or admin.
It lasts for that runtime only and does not offer explicit connection. Use a
file-backed local attachment for durable identity. Root state and refresh
storage remain separate requirements for session continuity.

## Identity and account policy

The external key is provider name, kind, issuer and verified subject. Display
email or username never silently joins an existing account. A new key creates
a passwordless, email-less local shell with an opaque UUID. Provider email is
display information, not a local recovery/login alias. Later logins retain that
UUID while the store and external binding remain intact.

Current local account status, roles and required factors govern subsequent
issuance. Provider claims cannot supply local MFA proof. A linked external login
does not acquire local Profile, Documents or downstream OIDC authority merely
because its identity has a local UUID.

## Connect to an existing local account

1. Sign in through the external provider in the browser. The source must be a
   recent passwordless disposable shell in an explicit attachment.
2. Open `/auth/connected-accounts/`, substituting your portal mount.
3. Start the connection using the rendered form. Follow its fresh local-login
   redirect and complete that specific password/MFA journey in the target realm.
4. Review the account and confirm or cancel in the same browser.
5. Sign in through the external provider again to obtain credentials using the
   chosen local UUID and current policy.

The operation uses the current access and session cookies, a private operation
path, CSRF protection and a specific fresh local HTML sandbox. A previous local
login, native JSON token, unrelated tab's sandbox or copied URL cannot substitute.
Operations expire after five minutes and are single-use. Restart loses pending
connections. Storage uncertainty requires a new flow after reconciliation.

Only the external key moves. The target's profile, passwords, roles, MFA, API
keys and Documents remain unchanged. The disposable source is disabled and its
proof invalidated. Test cancellation, wrong-browser/replay rejection and fresh
login after connection alongside the successful flow.

## Administration and diagnostics

Use `security local` against an enabled admin API to administer eligible attached
accounts. Automatically provisioned shells have no email; current commands allow
an empty email selector for those accounts, paired with the exact stored username.
Do not substitute a provider display name/email or relax ordinary account
selectors. Use the [CLI help](../operations/local-client.md) for each operation.

Connection operation URLs and return destinations are private. Redact
`request>uri`, `request>headers>Referer` and `resp_headers>Location` from Caddy
request logs; also redact `url`, `redirect_url` and `redirect_url_any` from
diagnostic encoders used for these flows. Application URL stripping does not
redact Caddy's earlier request copy. Keep password, factor and token material
out of captures and logs.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Identify an attachment</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; authentication-portal-api.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/connected-accounts

Explain provider name/kind/issuer/subject binding and the difference between provider-private memory and an explicit file-backed local attachment. Show why email does not join accounts.
```

</details>

<details>
<summary>Trace user confirmation</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; authentication-portal-api.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/connected-accounts

Trace start, fresh local HTML sandbox, confirmation and next external login. Identify cookies, CSRF, operation lifetime and which exact local proof is required.
```

</details>

<details>
<summary>Reject substitute proof</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; authentication-portal-api.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/connected-accounts

Analyze native JSON login, another tab, copied operation URL, unrelated fresh login and stale cookies. Explain why none silently connects an account.
```

</details>

<details>
<summary>Inspect connection effects</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; authentication-portal-api.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/connected-accounts

Explain what changes on source and target accounts after connection and what does not. Distinguish local UUID attachment from Profile, Documents and downstream OIDC authority.
```

</details>

<details>
<summary>Plan private diagnostics</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-identity-stores; authentication-portal-api.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/connected-accounts

Design success, cancellation, replay and restart checks. Explain the host-log URI/Referer/Location and diagnostic URL redactions needed without collecting live credentials.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20connected%20accounts&type=code).
- [caddyfile_identity_attachment.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/caddyfile_identity_attachment.go): Attachment selection.
- [connected_accounts_e2e_test.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/connected_accounts_e2e_test.go): Host browser authority checks.
- [pkg/authn/connected_accounts_http.go (v1.4.1)](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/pkg/authn/connected_accounts_http.go): Connection HTTP workflow.
