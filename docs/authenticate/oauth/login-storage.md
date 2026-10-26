---
title: "Shared pending OAuth login storage"
description: "Preserve upstream OAuth state, nonce and PKCE evidence in SQLite or Consul, including callbacks reaching another host and the remaining affinity requirements."
discovery:
  topic: sessions-and-cookies
  kind: guide
  aliases: ["OAuth state", "PKCE", "Consul", "SQLite", "replicas", "load balancer"]
---

# Shared pending OAuth login storage

In v1.5.0, a portal's upstream OAuth/OIDC provider can select a named login
store. SQLite retains pending transactions on a single host; Consul lets a
callback recover a login started on another host. The provider continues to
validate state, nonce, PKCE, browser binding, callback and identity. This feature
does not change your provider's registered callback URL.

## Declare and select a store

Install the [distribution or companion](../../operations/backends.md), then add
this fragment inside the global `security` block:

```caddyfile
oauth login store sqlite pending {
    path /var/lib/authcrunch/private/oauth-logins.db
    timeout 1s
    capacity 10000
}
```

Inside a working OAuth provider declaration, add:

```caddyfile
login store pending namespace production
```

Use an absolute path and existing private `0700` parent. The database contains
private nonce, PKCE and destination evidence in plaintext; protect its `0600`
file, sidecars and backups. Capacity is 1–100000 entries across the whole file,
not per namespace. Every client of that file must agree on capacity. Timeout
defaults to 1s and accepts 1ms–30s. SQLite is for a local POSIX filesystem.

Omitting the provider selection retains private memory. A partial, unknown or
invalid explicit selection fails; it does not fall back. Backend fields are
literal apart from Caddy's lexical `{$NAME}` substitution. Provider store and
namespace selectors support their normal provisioning-time replacements.

## Use Consul across hosts

With `pteich/caddy-tlsconsul` configured as Caddy's global storage, replace the
SQLite declaration with:

```caddyfile
oauth login store consul pending {
    prefix security/oauth-logins
    timeout 3s
    capacity 1000
}
```

Keep the same provider selection. The distribution includes both required
modules; custom builds need `oauth-login-storage-consul` and
`github.com/pteich/caddy-tlsconsul`. Configure its private shared AES key, ACLs
and verified Consul transport. Another Consul storage implementation is not a
substitute. Global `storage consul` alone does not opt any provider in.

Peers need the same store name, prefixes, capacity, encryption key and effective
Consul KV domain, plus matching normalized provider configuration. This includes
credentials, trust settings, attachment selection and configured key paths.
The deployment namespace is combined with a provider-configuration digest;
matching only the text `production` is insufficient. Keep clocks synchronized
and compatible token verification/policy on all resource-serving peers.

Consul capacity is at most 1000 pending/claimed entries for that backend name.
Encrypted records and their capacity index are updated with conditional
transactions. Change capacity or the storage key through a drained migration
or fresh prefix, rather than modifying live records.

## Completion, failure and deployment limits

Pending evidence survives compatible reopening only until its original expiry;
offline time counts. A wrong browser or callback does not consume the legitimate
transaction. One successful completion consumes it. Capacity refusal preserves
existing pending work; completion or expiry restores room.

An uncertain storage write cannot establish whether the transaction committed.
Do not retry automatically or publish tentative credentials. Start a fresh login
after an unavailable exchange. Test callbacks in both peer directions, replay,
wrong browser, mismatched configuration, capacity and a stopped peer.

This backend shares **pending upstream OAuth transactions**. Completed portal
sessions, MFA/sandbox checkpoints, cross-device work, downstream OIDC grants and
direct-policy OAuth pending/session maps have separate owners. Provider-private
attached identities also remain private to each runtime. Keep affinity where
those flows need it; shared pending state does not establish full portal high
availability. [Managed refresh storage](../30-refresh-token.md#named-refresh-storage)
and [root persistence](../../operations/runtime-state.md) have separate contracts.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Follow a peer callback</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-oauth-providers; oauth-identity-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/oauth/login-storage

Trace a pending upstream OAuth transaction started on one host and completed on another. Identify which nonce, PKCE, browser and callback checks remain provider-owned.
```

</details>

<details>
<summary>Diagnose namespace mismatch</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-oauth-providers; oauth-identity-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/oauth/login-storage

Explain why matching the deployment namespace alone is insufficient. Compare provider credentials, trust, attachment and configured key paths using synthetic peer configurations.
```

</details>

<details>
<summary>Choose SQLite or Consul</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-oauth-providers; oauth-identity-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/oauth/login-storage

Compare local POSIX SQLite with Caddy Consul storage for process/host placement, capacity, encryption and ownership. Explain why global storage consul alone does not opt providers in.
```

</details>

<details>
<summary>Handle ambiguous completion</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-oauth-providers; oauth-identity-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/oauth/login-storage

Analyze concurrent callbacks, wrong browser, capacity exhaustion and lost committed responses. Explain single-use consumption and safe fresh-login recovery without blind replay.
```

</details>

<details>
<summary>Bound availability claims</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-oauth-providers; oauth-identity-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/oauth/login-storage

Map remaining portal, sandbox, refresh, cross-device and direct-policy state owners. Explain what routing tests are required before claiming deployment availability.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20login%20storage&type=code).
- [caddyfile_oauth_login_store.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/caddyfile_oauth_login_store.go): Backend declarations.
- [plugins/oauth-login-storage-consul/plugin.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/plugins/oauth-login-storage-consul/plugin.go): Consul binding.
- [oauth_login_store_e2e_test.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/oauth_login_store_e2e_test.go): Two-process callback and replay checks.
