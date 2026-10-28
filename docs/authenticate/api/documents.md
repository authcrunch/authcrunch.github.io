---
title: "Encrypted Documents API"
description: "Enable portal-bound encrypted document storage, understand its local browser-session authority, and build clients with recovery and sharing."
discovery:
  topic: applications-and-sso
  kind: guide
  aliases: ["Documents", "end-to-end encryption", "encrypted files", "sharing", "recovery"]
---

# Encrypted Documents API

The opt-in end-to-end encrypted Documents API was available in AuthCrunch
v1.5.0 / go-authcrunch v1.4.1. **caddy-security v1.6.2 / go-authcrunch v1.5.0**
also embeds the **File Vault** browser app. Once the Documents API is enabled
and initialized, eligible users can open it at `<portal>/documents/`.
Follow the [File Vault walkthrough](../../apps/file-vault.md) for recovery,
uploads, downloads and verified sharing, or the
[complete local setup](../../apps/portal-apps.md) for a runnable Caddyfile.

Browser clients encrypt files, metadata and document keys before upload. The
server stores ciphertext, encrypted key vaults, public keys and recipient
envelopes. A custom API client can still bundle the library's portable browser
cryptography helper; enabling the API does not publish that helper as a separate
JavaScript module route.

## Enable storage

Inside a portal with a selected built-in local store whose realm is `local`, add:

```caddyfile
enable documents api
documents api database /var/lib/authcrunch/private/documents.db
documents api public origin https://auth.example.com
documents api base path /auth
documents api realms local
```

Mount the portal with `authenticate with myportal at /auth`, preserving the
request path. The canonical HTTPS origin has no path or trailing slash. Create
the private `0700` parent first; the API can create its `0600` database. Keep it
outside served roots and separate from account, registration and other SQLite
files and their sidecars. This core portal feature does not require a separate
companion. Omission or `disable documents api` leaves it unavailable with 404.

The database permanently binds protocol, portal name, public origin and mount.
Renaming or relocating the logical portal is not a database migration. Account
UUIDs also bind to their original store name and realm. Preserve these values
alongside ciphertext, accounts and key-recovery material.

## Caller authority

Use a current **local browser login** with an admitted `authp/user` or
`authp/admin` session in a selected realm. The exact access token must belong to
that current cached browser session. A valid JWT alone, native login/refresh,
OAuth/SAML attachment or downstream OIDC session is insufficient. Admin role
does not grant another user's documents. SQLite password login does not become
eligible merely by offering transactional account storage.

The effective request origin must match the configured HTTPS origin. Supplied
`Origin` must match exactly; supplied `Sec-Fetch-Site` must be `same-origin` or
`none`. Preserve natural browser headers. JSON body operations use
`Content-Type: application/json` without content encoding; do not add
`format=json`. Unknown/duplicate fields and extra JSON documents are rejected.

## Operations

All paths below follow the portal mount, such as `/auth/api/documents/bootstrap`.
Use the [versioned authored API contracts](https://github.com/greenpau/go-authcrunch/tree/v1.4.1/assets/openapi)
for exact payloads and component definitions.

| Task | Method and relative path |
| --- | --- |
| Obtain protocol/user/portal context and limits | `GET /api/documents/bootstrap` |
| Read or register the encrypted private-key vault | `GET /api/documents/keys/fetch`, `PUT /api/documents/keys/register` |
| Reset own key context | `POST /api/documents/keys/reset` |
| Look up recipient key/fingerprint | `GET /api/documents/key/{user_id}/lookup` |
| List or allocate files | `GET /api/documents/files`, `POST /api/documents/files/allocate` |
| Set manifest and commit a completed upload | `PUT /api/documents/file/{id}/manifest`, `POST /api/documents/file/{id}/commit` |
| Upload or read a chunk | `PUT /api/documents/file/{id}/chunk/{idx}/put`, `GET /api/documents/file/{id}/chunk/{idx}/fetch` |
| Read or delete a file | `GET /api/documents/file/{id}/fetch`, `DELETE /api/documents/file/{id}/delete` |
| Share or revoke a recipient | `PUT /api/documents/file/{id}/share/{user_id}/put`, `DELETE /api/documents/file/{id}/share/{user_id}/delete` |
| List recipients as owner | `GET /api/documents/file/{id}/share/list` |

Allocation reserves ciphertext quota. Uploads remain pending until every declared
chunk exists and the owner commits. Identical chunk retries are idempotent;
changing a stored chunk conflicts. Only file listing accepts the single
`after=ID` query cursor. An unauthorized resource is hidden with 404.
Successful mutations normally return `{"success":true}`; errors use
`{"status":HTTP_CODE,"message":"..."}`. Responses disable caching.

## Limits, sharing and recovery

Default limits are 256 MiB per ciphertext file, 1 GiB per user, 10 GiB total,
1000 files per user, 10000 files total, 10000 key slots and 100 recipients per
file. Pending uploads expire after 86400 seconds without extending on activity.
Portal statements such as `documents api max file bytes 268435456` and
`documents api upload ttl seconds 86400` configure these limits. Quotas include
authentication tags and pending uploads; exhaustion returns 507.

Pin the released [browser crypto helper](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/pkg/authn/documents/client/crypto.mjs)
in your own application. Bind encryption to the bootstrap context and verify
recipient fingerprints. Never upload plaintext, recovery secrets, unwrapped
private keys or raw document keys. Do not reuse a nonce for changed plaintext.

Recipients can read authorized files but cannot reshare or delete the owner's
file. Revocation blocks future fetches; it cannot erase data or keys already
downloaded. Preserve recovery material outside this database. After a fresh
browser login or runtime replacement, unlock the encrypted vault again. Losing
both usable browser keys and recovery material makes the ciphertext unrecoverable.
Key reset invalidates the old key context and requires deliberate confirmation.

Test two users, an unrelated administrator, upload/commit, sharing, revocation,
tampered ciphertext and recovery in a fresh browser. Storage uncertainty is not
permission to generate replacement keys or retry a mutation blindly.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Explain Documents authority</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authentication; authentication-portal-api; authentication-portal-documents.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/api/documents

Compare a current local browser session, native access token, attached provider account and admin role for Documents access. Trace exact token/session/account checks.
```

</details>

<details>
<summary>Build an upload lifecycle</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authentication; authentication-portal-api; authentication-portal-documents.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/api/documents

Trace bootstrap, encrypted vault, allocation, chunks, manifest and commit for a synthetic file. Explain quotas, ciphertext tags, retries and pending expiry.
```

</details>

<details>
<summary>Explain sharing and revocation</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authentication; authentication-portal-api; authentication-portal-documents.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/api/documents

Trace recipient-key fingerprint lookup, wrapping and later revocation. Explain what revocation cannot erase and why an unrelated administrator cannot read another user file.
```

</details>

<details>
<summary>Plan recovery</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authentication; authentication-portal-api; authentication-portal-documents.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/api/documents

Explain which stable portal/account bindings and private recovery material must survive a fresh browser or runtime replacement. Analyze losing keys versus resetting them without promising server-side plaintext recovery.
```

</details>

<details>
<summary>Validate the API boundary</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authentication; authentication-portal-api; authentication-portal-documents.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/api/documents

Use authored OpenAPI plus handlers to design origin, stale-session, malformed JSON, quota, tamper and storage-failure checks. Distinguish API enablement from a shipped Documents UI.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20documents&type=code).
- [caddyfile_authn_documents.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/caddyfile_authn_documents.go): Portal configuration.
- [documents_e2e_test.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/documents_e2e_test.go): TLS API behavior.
- [pkg/authn/documents_http.go (v1.4.1)](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/pkg/authn/documents_http.go): Authority and endpoints.
- [pkg/authn/documents/client/crypto.mjs (v1.4.1)](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/pkg/authn/documents/client/crypto.mjs): Browser encryption and recovery.
