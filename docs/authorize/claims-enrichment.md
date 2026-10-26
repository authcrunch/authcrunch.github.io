---
title: "Request-time claims enrichment"
description: "Add typed static attributes to a policy's ACL view while preserving the authenticated token, roles, and downstream identity headers."
discovery:
  topic: authorization
  kind: guide
  aliases: ["claims enrichment", "static claims", "attributes"]
---

# Request-time claims enrichment

In v1.5.0, `claims enrichment static` supplies literal attributes to a policy
after authentication and before its ACLs. It requires the
[`claims-enrichment-static` companion](../operations/backends.md). Every accepted
identity receives the same configured values. Use this for deployment attributes
such as a service's department; user-specific entitlements need a different
trusted source.

## Bind the authenticated identity

Inside an existing `authorization policy`, add this fragment:

```caddyfile
claims enrichment static {
    source static
    version v1
    issuer https://auth.example.com/auth/login
    realm local
    subject claim directory_id
    tenant claim tenant
    audience app
    timeout 1s
    max age 1m
    attribute enrichment.department string
    claim enrichment.department engineering
}
acl field department {
    claim enrichment.department
    type string
}
allow department engineering
```

The policy still needs ordinary signature verification, token discovery and its
complete access rules. The exact issuer and realm must match the authenticated
`iss` and origin. The audience list must contain `app`. The selected subject and
tenant claims must be distinct nonempty strings, with an authoritative immutable
account ID as subject. Do not assume a mutable email or username supplies that
guarantee. This example requires tokens carrying `directory_id` and `tenant`;
the declaration does not invent them.

Browser checkpoint login can produce a sandbox-specific issuer. When using a
fixed binding, deliberately set a stable issuer with a portal transform and
verify the resulting token, as shown in
[external authorization](external-authorization.md#bind-a-stable-browser-issuer).
Never derive a trusted issuer from an incoming untrusted header.

## Declare attributes and ACL aliases

`source static` and `version v1` select the backend contract. Repeat `attribute`
and `claim` for 1–32 outputs; each requested output must have a matching value:

```caddyfile
attribute permissions string list
claim permissions json `["read","write"]`
attribute settings json
claim settings json `{"enabled":true,"quota":9007199254740993}`
```

Names are literal top-level keys. A dot does not traverse JSON. Use a
[typed ACL field](custom-fields.md) for every custom string or string-list field
used by a rule. ACLs do not coerce JSON numbers, booleans or objects into strings.
Exact JSON numbers survive the adapter's string transport. In native Caddy JSON,
the static backend uses `claims_json`, a JSON object encoded as a string; a bare
`claims` object is unsupported.

`timeout` defaults to 1s, with a maximum of 30s. `max age` is a freshness bound,
not a cache TTL; static snapshots last one minute, so use 1m–24h. Backend values
remain literal: `{env.NAME}` is data here. Caddy's lexical `{$NAME}` substitution
is a separate adaptation step. Configured values appear in Caddy configuration;
do not put secrets in attributes.

## Understand the access boundary

Enrichment runs for every authenticated request, including token cache hits.
A missing binding, incompatible identity, invalid result or backend failure
denies access even if an ACL would otherwise allow. Explicit configured bypasses
retain their behavior.

Only a detached ACL view receives the values. The signed token, cached identity,
roles, authentication evidence and injected headers retain their original
authenticated values. Static enrichment cannot grant roles, create identity
headers, or alter the attributes sent to an external authorizer. Its
`enrichment.` namespace replaces old values in that detached view; other custom
names cannot collide with an authenticated claim. Standard security claims are
protected.

Test matching and mismatching issuer/realm/audience, absent subject/tenant,
wrong attribute types, a custom-claim collision and repeated requests with the
same token. Confirm that downstream headers and token bytes remain unchanged.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Trace an enriched request</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; claims-enrichment.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/claims-enrichment

Trace a signed token through identity binding, enrichment, typed fields and ACL actions. Compare the detached ACL view, cached identity and downstream headers.
```

</details>

<details>
<summary>Choose identity claims</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; claims-enrichment.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/claims-enrichment

Explain how immutable subject, tenant, issuer, realm and audience constrain this binding. Diagnose missing or mutable identity claims without inventing them in the backend.
```

</details>

<details>
<summary>Check types and collisions</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; claims-enrichment.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/claims-enrichment

Analyze literal dotted keys, string lists, exact JSON numbers, protected claims and authenticated-name collisions. Show safe synthetic rules and expected denial cases.
```

</details>

<details>
<summary>Reason about freshness</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; claims-enrichment.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/claims-enrichment

Explain why max age is not a cache TTL and why token cache hits still run enrichment. Compare explicit bypass with a required-backend failure.
```

</details>

<details>
<summary>Compare authorization extensions</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; claims-enrichment.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/claims-enrichment

Explain when deployment-wide static attributes, signed roles and an external policy decision are appropriate. Show why enrichment does not issue roles or alter remote-authorizer attributes.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20claims%20enrichment&type=code).
- [caddyfile_authz_enrichment.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/caddyfile_authz_enrichment.go): Policy grammar and binding.
- [claims_enrichment_static_e2e_test.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/claims_enrichment_static_e2e_test.go): Token/header isolation and required failures.
- [plugins/claims-enrichment/static/backend.go (v1.4.1)](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/plugins/claims-enrichment/static/backend.go): Static snapshot contract.
