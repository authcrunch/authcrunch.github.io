---
sidebar_position: 4
title: "Authorization policy syntax"
description: "Look up released policy grammar with precise access-rule, credential-source, forwarding, and version boundaries."
discovery:
  topic: authorization
  kind: reference
  aliases: ["Caddyfile", "configuration", "syntax"]
---

# Authorization policy syntax

Define a policy inside global `security`, then attach it to a site route with
`authorize with POLICY`. The tables target the
[released Caddy bundle](../operations/versions.md). Angle-bracket alternatives
below describe grammar; they are not literal values to paste.

## Start with a complete boundary

```Caddyfile
{
    security {
        authorization policy apppolicy {
            set auth url https://auth.example.com/auth/
            crypto key verify from env AUTHCRUNCH_SIGNING_KEY
            allow roles app/member
        }
    }
}

app.example.com {
    route {
        authorize with apppolicy
        reverse_proxy 127.0.0.1:8080
    }
}
```

Configure the matching signer and portal separately, or use the complete
[first-app example](../start/first-app.md). A policy requires at least one
access rule; a verification key alone does not define who is allowed.

## Credentials and verification

| Directive | Meaning |
| --- | --- |
| `crypto key [ID] verify from env NAME` | HMAC secret in an environment variable |
| `crypto key [ID] verify from file PATH` | Supported public/private key file |
| `crypto key [ID] verify from directory PATH` | Key directory |
| `crypto key [ID] verify from env NAME as file` | Environment value names a key file |
| `crypto key [ID] verify from env NAME as directory` | Environment value names a key directory |
| `set token sources cookie header` | Allowed source order; values are cookie/header/query |
| `set access_token cookie name NAME [NAME...]` | Explicit accepted access cookie names |
| `set session_id cookie name NAME` | One session cookie name |
| `validate bearer header` | Recognize Bearer in the header source |
| `validate source address` | Require token/source address equality |
| `validate method path` | Evaluate method/path rules against checked request paths |
| `validate path acl` | Also check token-carried path grants |

A System key uses `crypto key ID system from file PATH` for remote credential
validation. It does not verify ordinary access JWTs. Keystore directives also
support token name/lifetime configuration; match actual issued credentials and
use the dedicated cookie/source settings for gatekeeper discovery.

## Access rules

```Caddyfile
validate method path
acl rule {
    comment Members may read report paths
    match roles app/member
    match method GET
    prefix match path /reports/
    allow stop log debug
}
```

| Form | Contract |
| --- | --- |
| `allow FIELD VALUES [with METHOD] [to PATH]` | Compact rule; path is substring matching |
| `deny FIELD VALUES [with METHOD] [to PATH]` | Compact deny |
| `[no] [exact|partial|prefix|suffix|regex] match FIELD VALUES` | Full value condition |
| `field FIELD [not] exists` | Presence/absence condition |
| `allow|deny [any] [stop] [counter] [log LEVEL] [tag VALUE]` | Full rule action; Caddy requires an action argument inside a rule |
| `acl default allow|deny` | Ordered catch-all rule, with a released-version limitation |

Built-in matching fields are `roles`, `amr`, `github_id`, `github_orgs`, `email`,
`origin`, `name`, `realm`, `aud`, `scopes`, `org`, `jti`, `iss`, `sub`, `addr`,
`method`, and `path`. Aliases include `role/group/groups`, `subject`, `issuer`,
`audience`, `scope`, `organization`, and `address/ip/ipv4`.

See [ACL semantics](acl-rbac.md), especially AND/OR, `stop`, duplicate fields,
and the v1.3.8 `match any`/default-action limitation. Arbitrary typed custom
fields are [a newer feature](custom-fields.md), not released Caddy syntax.

## Redirects and forwarding

| Directive | Meaning |
| --- | --- |
| `set auth url URL` | Login destination |
| `set forbidden url URL` | 303 destination for a denied authenticated identity |
| `disable auth redirect` | Refuse missing authentication with 401 |
| `disable auth redirect query` | Omit return URL |
| `set redirect query parameter NAME` | Return-parameter name |
| `set redirect status CODE` | Accepted range 300–308; choose appropriate semantics |
| `enable js redirect` | Browser script redirect |
| `enable login hint [with VALIDATORS...]` | Forward a validated identifier hint |
| `enable additional scopes` | Forward client-selected OAuth scopes |
| `inject headers with claims` | Standard trusted identity headers |
| `inject header HEADER from FIELD` | Custom claim header; nested fields use `|` |
| `enable strip token` | Remove accepted credential from forwarded request |
| `set user identity email|subject|id` | Select Caddy user ID; `id` means JWT jti |
| `bypass uri exact|partial|prefix|suffix|regex PATH` | Deliberate unauthenticated path |

## Other authentication modes

```Caddyfile
with basic auth portal myportal realm local
with api key auth portal myportal realm local
with api key header name X-Service-Key
with auth realm header name X-Account-Realm
```

A remote portal URL requires [System keys](../authenticate/api/50-system-api.md).
For a provider-backed opaque browser session, see the separate
[direct OAuth policy](direct-oauth.md). These modes still require a deliberate
application allow rule and do not automatically satisfy interactive MFA.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Read a policy from outside in</summary>

```text
Help me understand Authorization policy syntax.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/syntax

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain the relationship between the global security block, a named policy,
and authorize on a route. Annotate a small existing policy and separate
grammar acceptance, provisioning, authentication, and access decisions. Ask
for my installed versions before selecting syntax.
```

</details>

<details>
<summary>Review rule grammar</summary>

```text
Help me understand Authorization policy syntax.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/syntax

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me read compact and full ACL rules. Use synthetic roles and compare
exact/prefix matching with shortcut path matching. Explain action arguments,
condition combination, and stop behavior. Identify syntax or semantics that
differ between the downloadable bundle and newer source.
```

</details>

<details>
<summary>Diagnose adaptation versus runtime failure</summary>

```text
Help me understand Authorization policy syntax.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/syntax

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Give me a staged diagnosis for a policy that adapts successfully but refuses
access. Separate missing access rules, wrong keys, credential sources, role
mismatch, and route mounting. Ask for redacted configuration and observed
status; do not infer login success from parser acceptance.
```

</details>

<details>
<summary>Design a policy test table</summary>

```text
Help me understand Authorization policy syntax.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/syntax

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Build a test table for a read-only reports policy: allowed member GET,
nonmember, missing token, expired token, sibling path, and wrong method. For
each, identify the layer being tested and observable outcome. Keep
configuration checks separate from live requests.
```

</details>

<details>
<summary>Practice syntax review</summary>

```text
Help me understand Authorization policy syntax.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/syntax

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Quiz me with five short policy fragments, one at a time. Include an action
with wrong arity, a broad shortcut path, misplaced proxy header, unsupported
custom field on an older release, and a missing allow rule. Wait for my
reasoning before explaining each correction.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28parseCaddyfileAuthorizationPolicy%20OR%20PolicyConfig%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authz.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz.go)
   — dispatches authorization-policy subdirectives into library configuration.
3. [caddy-security: caddyfile_authz_misc.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_misc.go)
   — parses source selection, validation, identity, and redirect options.
4. [caddy-security: caddyfile_authz_acl.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_acl.go)
   — adapts full ACL rules, actions, defaults, and field declarations.
5. [go-authcrunch: pkg/authz/config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/config.go)
   — defines and validates authorization-policy settings.
6. [caddy-security: caddyfile_authz_test.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_test.go)
   — checks policy grammar and adapted ACL/credential settings.
