---
sidebar_position: 14
description: "Look up user metadata placeholders available to Caddy after authorization."
discovery:
  topic: authorization
  kind: reference
  aliases: ["variables", "logging"]
---

# Caddy Placeholders

After successful `authorize`, Caddy exposes the policy's normalized identity
through these placeholders. Values may be absent when the authenticated source
does not supply them. They are not available as trusted identity before the
policy runs or on a public bypass.

## Available Placeholders

| Placeholder | Meaning |
| --- | --- |
| `{http.auth.user.id}` | Identity selected by [set user identity](identity.md) |
| `{http.auth.user.claim_id}` | JWT `jti`, identifying this token/session claim set |
| `{http.auth.user.sub}` | JWT subject |
| `{http.auth.user.roles}` | Normalized roles, separated by spaces |
| `{http.auth.user.email}` | Email claim |
| `{http.auth.user.name}` | Display-name claim |
| `{http.auth.user.issuer}` | JWT `iss`; for a portal token this is the portal issuer |
| `{http.auth.user.origin}` | Authentication source/origin claim |
| `{http.auth.user.realm}` | Realm supplied by the identity |
| `{http.auth.user.username}` | `userinfo.preferred_username`, when present |

A token's claim ID changes with token issuance; it is not a permanent account
ID. A subject's namespace belongs to its issuer/realm. Avoid conflating tokens
from different issuers merely because their `sub` strings match.

## Passing User Info to an Upstream App

`header_up` belongs inside `reverse_proxy`, not directly in a route or global
options block:

```Caddyfile
app.example.com {
    route {
        authorize with apppolicy
        reverse_proxy 127.0.0.1:8080 {
            header_up X-User-ID {http.auth.user.id}
            header_up X-User-Roles {http.auth.user.roles}
        }
    }
}
```

Define `apppolicy` in the existing global security block. These assignments
replace incoming values for the named headers. The backend must accept trusted
identity only from this proxy and must not be publicly reachable through a
route that bypasses authorization. See [Caddy's header_up reference](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy#headers)
and [automatic claim headers](headers.md).

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Locate placeholder creation</summary>

```text
Help me understand Caddy Placeholders.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-http-integrations,
configuration-authorization.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/placeholders

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Trace where authorization supplies Caddy identity placeholders and when they
become trustworthy. Explain missing values, denied requests, and public
bypass. Distinguish selected user ID, subject, issuer, realm, and claim ID
using synthetic claims.
```

</details>

<details>
<summary>Read a proxy mapping</summary>

```text
Help me understand Caddy Placeholders.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-http-integrations,
configuration-authorization.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/placeholders

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Annotate a reverse_proxy header_up fragment that forwards only user ID and
roles. Explain its placement after authorize and how assignment handles
client-supplied header values. Ask how the backend prevents a direct
connection that avoids this policy.
```

</details>

<details>
<summary>Diagnose empty values</summary>

```text
Help me understand Caddy Placeholders.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-http-integrations,
configuration-authorization.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/placeholders

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me investigate an empty username or email placeholder. Ask for redacted
normalized identity, issuer, handler order, and exact placeholder name.
Separate absent provider data, wrong nesting, and execution before
authorization rather than inventing default identity values.
```

</details>

<details>
<summary>Test the forwarding contract</summary>

```text
Help me understand Caddy Placeholders.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-http-integrations,
configuration-authorization.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/placeholders

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Create a test plan that observes backend headers for two authorized
identities, absent optional claims, forged incoming headers, a denied user,
and a bypassed route. State which checks establish provenance and which only
demonstrate presentation.
```

</details>

<details>
<summary>Choose stable identifiers</summary>

```text
Help me understand Caddy Placeholders.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-http-integrations,
configuration-authorization.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/placeholders

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare http.auth.user.id, sub, and claim_id for an application account key
and an audit event. Include token reissuance and matching subject strings from
different trusted issuers. Quiz me about the namespace and stability required
by each use.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28http.auth.user%20OR%20UserIdentityField%20OR%20GetData%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: plugin_authz.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authz.go)
   — connects policy results to Caddy authentication and route configuration.
3. [caddy-security: plugin_authorization.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authorization.go)
   — preserves handled responses and applies authorized identity in the Caddy handler chain.
4. [go-authcrunch: pkg/authz/authenticate.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/authenticate.go)
   — authenticates requests, forwards claims, and strips accepted credentials.
5. [caddy-security: caddyfile_authz_misc.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_misc.go)
   — parses source selection, validation, identity, and redirect options.
