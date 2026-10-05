---
sidebar_position: 10
description: "Check a request path against access lists carried in token claims."
discovery:
  topic: authorization
  kind: reference
  aliases: ["ACL", "URI", "path permissions"]
---

# Path-Based Access Lists

`validate path acl` checks the requested path against signed token grants in
`acl.paths`, in addition to ordinary policy rules. A client cannot grant itself
paths by editing an unsigned JSON payload.

```json
{
  "sub":"alice",
  "roles":["app/member"],
  "exp":1900000000,
  "acl":{"paths":{"/api/users/*":{},"/api/media/**":{}}}
}
```

This is a claim-shape example, not a token to copy. The expiry is numeric.
Configure the policy:

```Caddyfile
validate path acl
allow roles app/member
```

Literal paths match exactly. Wildcards have the following restricted meanings:

| Pattern | Characters matched |
| --- | --- |
| `*` | One or more ASCII letters, digits, `_`, `.`, `~`, or `-`; no slash |
| `**` | One or more of those characters, including slash |

`/api/users/*` matches `/api/users/alice`, not `/api/users/` or a deeper tree.
`/api/media/**` spans path segments but does not match an empty suffix. Other
punctuation is literal; this is not a regex or a shell glob.

The gatekeeper checks decoded and cleaned interpretations, including on cached
identities, and rejects ambiguous/malformed encodings. It does not rewrite the
upstream path to rescue a failed grant. Exercise allowed, sibling, traversal,
encoded-slash, and double-encoded paths with the same token.

For role/path rules in the policy itself, use [ACL conditions](acl-rbac.md)
and `validate method path`. Token-carried path grants must be issued by a
trusted signer and should be specific to the application.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Read token-carried grants</summary>

```text
Help me understand Path-Based Access Lists.

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
https://docs.authcrunch.com/docs/authorize/path-acl

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain token-carried path ACLs separately from policy method/path rules. Use
a synthetic signed identity with narrow grants and describe which layer
authenticates those grants. Check whether my chosen provider actually forwards
these claims before assuming they are available.
```

</details>

<details>
<summary>Work through wildcard boundaries</summary>

```text
Help me understand Path-Based Access Lists.

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
https://docs.authcrunch.com/docs/authorize/path-acl

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare exact paths, a single star, and a double star using empty suffixes,
one segment, deeper segments, punctuation, and sibling paths. Derive the
allowed character behavior from the matcher. Explain why these patterns are
not ordinary regex or shell glob syntax.
```

</details>

<details>
<summary>Investigate path disagreement</summary>

```text
Help me understand Path-Based Access Lists.

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
https://docs.authcrunch.com/docs/authorize/path-acl

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me diagnose a path that looks allowed but is denied after encoding or
normalization. Ask for redacted raw and decoded URLs and routing
transformations. Trace the implementation’s checked interpretations; do not
suggest rewriting a failed request to force a grant.
```

</details>

<details>
<summary>Design adversarial path cases</summary>

```text
Help me understand Path-Based Access Lists.

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
https://docs.authcrunch.com/docs/authorize/path-acl

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Build a test table for a token granting /reports/* and /media/**. Include
traversal, encoded slash, double encoding, empty suffix, a sibling path, and
repeat requests using the same credential. State the expected boundary and
what cached identity does not exempt.
```

</details>

<details>
<summary>Compare grant strategies</summary>

```text
Help me understand Path-Based Access Lists.

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
https://docs.authcrunch.com/docs/authorize/path-acl

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me choose between issuer-carried path grants and policy-local
role/method/path rules for a multi-app deployment. Ask who controls grants and
whether direct OAuth is used. Explain the maintenance and trust consequences,
and quiz me on one unauthorized sibling request.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28ValidateAccessListPathClaim%20OR%20MatchPathBasedACL%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authz_misc.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_misc.go)
   — parses source selection, validation, identity, and redirect options.
3. [go-authcrunch: pkg/acl/path.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/acl/path.go)
   — evaluates token-carried path grants and wildcard matching.
4. [go-authcrunch: pkg/authz/validator/validator.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/validator/validator.go)
   — configures token validation and request-specific authorization checks.
5. [go-authcrunch: pkg/authz/path_e2e_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/path_e2e_test.go)
   — exercises request-path restrictions through gatekeeper requests.
