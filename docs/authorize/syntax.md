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
