---
sidebar_position: 13
description: "Exclude selected request paths from authorization with URI matching rules."
discovery:
  topic: authorization
  kind: reference
  aliases: ["bypass uri", "public route"]
---

# Bypass Authorization for Specific URIs

A bypass lets a matching request proceed without a credential or authenticated
identity. Use it for deliberately public resources, such as a health endpoint,
not as a remedy for a login loop.

```Caddyfile
# Inside the policy:
bypass uri exact /health
bypass uri prefix /public/
allow roles app/member
```

| Strategy | Match |
| --- | --- |
| `exact` | The whole path |
| `partial` | A substring anywhere in the path |
| `prefix` | Beginning of the path |
| `suffix` | End of the path |
| `regex` | A Go regular expression; anchor it when the whole path matters |

`prefix /public` also matches `/publicity`. Use an exact path plus a slash-ended
prefix when granting a directory tree. Query parameters do not turn a protected
path into a public one.

The released implementation checks decoded and cleaned path interpretations;
ambiguous encodings must not create a bypass. Test `/health`, `/health-extra`,
`/public/file`, and a protected sibling separately. The direct OAuth policy's
reserved callback/logout paths are handled by its [own flow](direct-oauth.md).

Configured identity headers are cleared even on bypass. The backend must treat
a public request as unauthenticated. For complex public/private routing, separate
Caddy handlers can make the boundary easier to review than a broad bypass rule.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Explain the public boundary</summary>

```text
Help me understand Bypass Authorization for Specific URIs.

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
https://docs.authcrunch.com/docs/authorize/bypass

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain what a successful bypass establishes and what it does not establish
about identity. Compare a public health route with a signed user holding a
guest role. Trace where bypass sits relative to ordinary authorization and
direct OAuth reserved routes.
```

</details>

<details>
<summary>Choose a precise matcher</summary>

```text
Help me understand Bypass Authorization for Specific URIs.

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
https://docs.authcrunch.com/docs/authorize/bypass

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare exact, partial, prefix, suffix, and regex bypass strategies for
/health and /public/. Show a sibling such as /publicity and explain
boundary-aware choices. Ask which endpoints must truly be public before
reviewing a rule.
```

</details>

<details>
<summary>Diagnose an unexpected public route</summary>

```text
Help me understand Bypass Authorization for Specific URIs.

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
https://docs.authcrunch.com/docs/authorize/bypass

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me investigate a protected resource that appears reachable without
credentials. Ask for redacted bypass rules, handler order, and raw request
paths. Separate a broad matcher, proxy routing, and path normalization; do not
assume any successful response proves authenticated access.
```

</details>

<details>
<summary>Test bypass and header provenance</summary>

```text
Help me understand Bypass Authorization for Specific URIs.

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
https://docs.authcrunch.com/docs/authorize/bypass

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Design tests with no token and forged identity headers for a bypassed
endpoint, its sibling, and an encoded-path variant. Include downstream
observations that prove public requests do not acquire trusted identity.
Verify implementation behavior rather than only parser acceptance.
```

</details>

<details>
<summary>Review alternatives for a login loop</summary>

```text
Help me understand Bypass Authorization for Specific URIs.

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
https://docs.authcrunch.com/docs/authorize/bypass

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

I am tempted to fix a login loop with a broad bypass. Teach me how to check
the portal route, return trust, and cookie delivery first. Compare explicit
public routing with narrow bypasses, then ask me to explain the authorization
boundary I intend.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28BypassConfigs%20OR%20bypassRequest%20OR%20parseCaddyfileAuthorizationBypass%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authz_bypass.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_bypass.go)
   — parses bypass URI match strategies.
3. [go-authcrunch: pkg/authz/gatekeeper.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/gatekeeper.go)
   — constructs validators and handles policy requests, bypass, and redirects.
4. [go-authcrunch: pkg/authz/authenticate.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/authenticate.go)
   — authenticates requests, forwards claims, and strips accepted credentials.
5. [go-authcrunch: pkg/authz/path_e2e_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/path_e2e_test.go)
   — exercises request-path restrictions through gatekeeper requests.
