---
title: "Backend plugins and deployment choices"
description: "Choose the AuthCrunch distribution or a custom build, select optional SQLite and Consul backends, and understand which state they share."
discovery:
  topic: operations
  kind: reference
  aliases: ["plugins", "SQLite", "Consul", "HA", "xcaddy", "distribution"]
---

# Backend plugins and deployment choices

**AuthCrunch v1.5.0** from [authcrunch/authcrunch](https://github.com/authcrunch/authcrunch/releases/tag/v1.5.0)
is a ready-to-run Caddy distribution. It includes caddy-security v1.5.0,
go-authcrunch v1.4.1, all 17 optional backend companions, Caddy's Consul storage,
AWS Secrets Manager support, and tracing. The separate
[caddy-security release](https://github.com/greenpau/caddy-security/releases/tag/v1.5.0)
provides the core integrations and a standalone login client. The archives have
the same `authcrunch_1.5.0_…` naming pattern; check the repository you download from.

## Select the executable

Use the [distribution install instructions](../start/install.md) for a ready-made
binary. A custom build must select each companion explicitly at the same version
as the core module. Importing the root module alone does not register companions:

```sh
xcaddy build v2.11.7 \
  --with github.com/greenpau/caddy-security@v1.5.0 \
  --with github.com/greenpau/caddy-security/plugins/identity-stores-sqlite@v1.5.0
```

The custom executable is named `caddy`. Run `caddy security version` and
`caddy list-modules --versions` before adapting configuration. A missing module
requires a different build; changing a Caddyfile cannot install it.

## Companion inventory

Every package below is under `github.com/greenpau/caddy-security/plugins/` and is
included in the v1.5.0 AuthCrunch distribution. Declaring a backend and selecting
it in its consumer are separate steps.

| Package suffix | Module ID | Use |
| --- | --- | --- |
| `claims-enrichment-static` | `security.claims_enrichment.static` | [Request-time ACL attributes](../authorize/claims-enrichment.md) |
| `external-authorization-httpjson` | `security.external_authorization.httpjson` | [Required policy-service decisions](../authorize/external-authorization.md) |
| `cryptographic-signing-rsapss` | `security.access_signers.rsapss` | [PS256 access signing](../authorize/access-token-profiles.md) |
| `identity-stores-sqlite` | `security.identity_stores.sqlite` | [Password accounts](../authenticate/local/sqlite.md) |
| `identity-stores-consul` | `security.identity_stores.consul` | Shared password accounts |
| `identity-providers-sqlite` | `security.identity_providers.sqlite` | [Trusted application tickets](../authenticate/ticket-login.md) |
| `identity-providers-consul` | `security.identity_providers.consul` | Shared trusted application tickets |
| `credential-authenticators-sqlite` | `security.credential_authenticators.sqlite` | [API-key requests](../authorize/api_key_auth.md#sqlite-api-keys) |
| `credential-authenticators-consul` | `security.credential_authenticators.consul` | Shared API-key verification |
| `messaging-sqlite` | `security.messaging.sqlite` | [Durable outbox](../messaging/intro.md#sqlite-outbox) |
| `registration-workflows-sqlite` | `security.registration_workflows.sqlite` | [Email-confirmed signup](../authenticate/local/sqlite.md#email-confirmed-signup) |
| `secrets-sqlite` | `security.secrets.sqlite` | [Secret snapshots](../credentials/intro.md#sqlite-and-consul-secrets) |
| `secrets-consul` | `security.secrets.consul` | Shared secret snapshots |
| `oauth-login-storage-sqlite` | `security.oauth_login_stores.sqlite` | [Pending upstream OAuth logins](../authenticate/oauth/login-storage.md) |
| `oauth-login-storage-consul` | `security.oauth_login_stores.consul` | Pending upstream logins across hosts |
| `session-and-refresh-storage-sqlite` | `security.refresh_stores.sqlite` | [Managed refresh families](../authenticate/30-refresh-token.md#named-refresh-storage) |
| `session-and-refresh-storage-consul` | `security.refresh_stores.consul` | Managed refresh in Consul |

Built-in JSON-file local stores, LDAP, OAuth and SAML retain their existing
declarations. A SQLite password store has different capabilities from a built-in
local store; selecting it does not add local MFA or Profile mutation support.

## Match storage to the state you need

| State | Selection | Deployment boundary |
| --- | --- | --- |
| Completed portal, direct OAuth and downstream OIDC state | Root `state` directory | One active owner on a local Unix filesystem; stop/start |
| Pending upstream OAuth state, nonce and PKCE | Provider `login store NAME namespace DEPLOYMENT` | SQLite on one host or Consul across hosts; matching provider configuration |
| Portal refresh rotation and replay history | Portal `token refresh { store NAME … }` | Requires exclusive root state, even with Consul; same-root restart |
| Password accounts | Selected SQLite or Consul identity store | Durable accounts do not make browser sessions shared |
| Email signup and outbox | Selected SQLite workflow and queue | Separate private files; queue acceptance differs from delivery |
| Documents ciphertext | Portal Documents database | Exact portal/origin/mount binding; current local browser login required |

Separate every SQLite database from other categories, their journal/WAL/SHM
sidecars, identity JSON files, served directories, runtime-state directories and
OAuth-registration directories. Use existing private `0700` parent directories
and `0600` files on a local POSIX filesystem. Some backends create their file;
password-account and API-key databases require trusted provisioning first.
Backend fields are generally literal; use each guide's replacement rules.

## Consul prerequisites

Consul companions reuse **`github.com/pteich/caddy-tlsconsul`**, including its
client, key prefix, ACL/TLS settings and AES key. The distribution includes that
module; custom builds must add it alongside the chosen companions. Global
`storage consul` alone does not select any AuthCrunch backend.

Configure a private shared `aes_key`, appropriate Consul ACLs and verified
transport according to the [storage module](https://github.com/pteich/caddy-tlsconsul/tree/v1.5.0).
Participating hosts need matching names, prefixes, backend limits and encryption
keys, compatible provider configuration and synchronized clocks. Backend records
use authenticated encryption; protect the key and backups separately.

For example, inside `security`, declare `oauth login store consul pending`, then
select `login store pending namespace production` in the OAuth provider.
See [shared login storage](../authenticate/oauth/login-storage.md) for the full
selection and failure contract.

Consul password accounts require trusted application administration; there is
no Consul account-management CLI in this release. Consul ticket issuance also
belongs to the trusted application. Consul refresh defaults to 1000 sessions
and 128 rotations; explicitly match those limits in the selecting portal.
Bounded Consul documents can reach their byte limit before their entry capacity.

## Plan affinity and recovery

Consul pending-login storage allows a provider callback to reach another host.
It does **not** distribute portal sessions, sandbox/MFA checkpoints, cross-device
operations, downstream OIDC grants, direct-policy OAuth sessions, or the default
provider-private attached account. Keep affinity for those operations.

Managed Consul refresh still requires one persistent root's private namespace,
generation and ownership. Independently running roots cannot exchange refresh
authority merely by choosing the same Consul backend. External account attachments
still target built-in local stores, not SQLite or Consul password plugins.

After a storage operation with an uncertain commit, withhold tentative credentials,
inspect the failure, and recover or start fresh authentication as the feature
requires. Blindly replaying a refresh exchange or ticket can consume or revoke
credentials. Stop and drain owners before backup, schema migration or changing
storage keys/capacity. Test the intended multi-host routing and outage behavior
in your deployment; a successful adaptation only checks configuration syntax.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Choose an executable</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration; host plugin contracts.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/backends

Compare the core caddy-security release with the AuthCrunch distribution for a deployment needing SQLite identities and Consul pending OAuth. Trace imports to registered modules and explain what list-modules proves.
```

</details>

<details>
<summary>Map state owners</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration; host plugin contracts.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/backends

Build a matrix of account, pending OAuth, refresh, sandbox, cross-device and downstream OIDC state. Explain which records Consul shares and where affinity or exclusive root state remains necessary.
```

</details>

<details>
<summary>Plan a custom build</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration; host plugin contracts.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/backends

Produce a pinned xcaddy build selecting only the required companions for password accounts and an HTTP policy service. Explain a missing-module error using registration code.
```

</details>

<details>
<summary>Reason about restart</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration; host plugin contracts.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/backends

Walk through a drained restart retaining identities, signing keys, root state and a selected refresh backend. Explain generation changes, deadlines and why independent roots do not share refresh authority.
```

</details>

<details>
<summary>Design deployment checks</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration; host plugin contracts.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/operations/backends

Propose acceptance checks for callback direction, denied roles, uncertain writes, storage outage and secret rotation. Distinguish source tests from checks actually observed in my deployment.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20backends&type=code).
- [Distribution imports, v1.5.0](https://github.com/authcrunch/authcrunch/blob/v1.5.0/main.go): compiled companion selection.
- [app.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/app.go): App ownership and publication.
- [plugins/identity-stores-sqlite/plugin.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/plugins/identity-stores-sqlite/plugin.go): Optional module registration.
- [plugins/oauth-login-storage-consul/plugin.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/plugins/oauth-login-storage-consul/plugin.go): Consul login-store integration.
