---
title: "External HTTP authorization"
description: "Require a fresh HTTP JSON policy decision after local authentication and ACL checks, with exact identity binding and denial on service failure."
discovery:
  topic: authorization
  kind: guide
  aliases: ["external authorization", "httpjson", "policy service", "mTLS"]
---

# External HTTP authorization

AuthCrunch v1.5.0 can require an external policy-service decision on every
authenticated request. Install the
[`external-authorization-httpjson` companion](../operations/backends.md).
Credential verification and local ACLs run first. Remote allow cannot override
their denial, and local allow does not skip a configured external decision.

## Configure the policy

Add one flat block inside your existing authorization policy:

```caddyfile
external authorization httpjson {
    endpoint https://policy.example.com/decide
    policy reports
    version production
    issuer https://auth.example.com/auth/login
    realm local
    attribute roles
    timeout 500ms
    tls ca file /etc/caddy/policy-ca.pem
    tls client certificate /etc/caddy/policy-client.pem /etc/caddy/policy-client-key.pem
}
```

Retain ordinary token verification, discovery and `allow roles app/member` in
the surrounding policy. Mount it before the protected handler using `authorize
with POLICY_NAME`. The service must echo `reports` and `production` exactly;
these identify your decision contract, not software release versions.

`issuer` and `realm` bind exact authenticated claims. `subject claim` defaults
to `sub`; optionally select an authoritative immutable subject and a distinct
`tenant claim`. Up to 16 repeated `attribute` statements select original
top-level authenticated claims. Omitted attributes are not sent. Do not select
passwords, tokens or credentials.

## Bind a stable browser issuer

Native and browser checkpoint login can otherwise produce different issuers.
For a portal using the `local` realm, this fragment deliberately chooses the
issuer used by the policy above:

```caddyfile
transform user {
    match realm local
    action overwrite iss https://auth.example.com/auth/login
}
```

Place it inside that portal and inspect a newly issued token before enabling
the external binding. Check all authentication methods using the transform.
Unmodified direct Basic/API-key and direct OAuth sessions have different
issuer/origin contracts; do not assume this browser value applies to them.

## Implement the service contract

The service receives POST JSON with `policy`, `version`, `identity`, `action`,
`resource` and any selected `attributes`. Identity contains issuer, realm,
subject and optionally tenant. Action is the HTTP method; resource is the path.
Incoming query strings, headers, cookies and bodies are not implicitly forwarded.
[Claims enrichment](claims-enrichment.md) affects local ACLs only; external
attributes retain the original authenticated values.

A valid allow response is HTTP 200 with `Content-Type: application/json`:

```json
{"decision":"allow","policy":"reports","version":"production"}
```

Return `"deny"` for denial. The body must contain exactly these three
case-sensitive string fields and be at most 4096 bytes. Duplicate or unknown
fields, obligations, a contract mismatch, malformed JSON, redirects, other
statuses/media types, transport errors and late responses deny access. There
is no decision cache or automatic application retry.

## Transport and failure behavior

Use HTTPS, or HTTP on a literal loopback IP for an isolated fixture. Endpoints
cannot contain URL credentials, query or fragment. Optional CA files replace
system roots for this backend. Optional mTLS files authenticate the service
client; they do not identify the end user. TLS retains hostname verification.
Fields in this block do not expand runtime placeholders or secret references.

The default timeout is 1s; allowed values are 1ms–30s. Request cancellation and
credential expiry can shorten it. Every supported interpretation of an ambiguous
path must allow within that shared deadline. Explicit bypass rules skip this
check as well as authentication, so review them as deliberate access grants.

The decision is fresh for token cache hits, Basic/API-key requests and existing
direct OAuth sessions. Direct OAuth also checks callback admission. An outage
denies the protected request without silently reusing a previous allow or clearing
an otherwise valid credential. Test local denial with remote allow, local allow
with remote deny, service outage, TLS failure and changing decisions for repeated
use of the same token. Confirm that the protected handler receives no denied
requests and that the service receives no incoming credentials.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Trace decision precedence</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; external-authorization.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/external-authorization

Trace local authentication, ACLs and external decisions for four allow/deny combinations. Include explicit bypass and a cached access token.
```

</details>

<details>
<summary>Bind the right identity</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; external-authorization.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/external-authorization

Explain issuer differences between native login, browser checkpoints, Basic/API-key and direct OAuth. Derive a stable browser issuer configuration from the parser and test it without weakening exact binding.
```

</details>

<details>
<summary>Implement a decision service</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; external-authorization.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/external-authorization

Describe exact request/response schemas and negative responses for a synthetic HTTP JSON service. Identify data intentionally omitted and why enriched ACL values do not become authenticated service attributes.
```

</details>

<details>
<summary>Analyze service failures</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; external-authorization.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/external-authorization

Analyze timeout, cancellation, mTLS failure, redirects, oversized JSON and an ambiguous path. Explain fail-closed outcomes and the absence of decision caching or automatic retries.
```

</details>

<details>
<summary>Plan acceptance checks</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-authorization; external-authorization.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/external-authorization

Design a trusted local policy-service fixture testing changing decisions for one token, local denial precedence and credential isolation. Separate TLS provisioning from parser adaptation.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20external%20authorization&type=code).
- [caddyfile_authz_external.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/caddyfile_authz_external.go): Binding grammar.
- [plugins/external-authorization-httpjson/plugin.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/plugins/external-authorization-httpjson/plugin.go): TLS transport and module lifecycle.
- [external_authorization_httpjson_e2e_test.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/external_authorization_httpjson_e2e_test.go): Real host decision and failure tests.
