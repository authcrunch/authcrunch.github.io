---
sidebar_position: 12
description: "Select which token field supplies the user identity returned to Caddy."
discovery:
  topic: authorization
  kind: reference
  aliases: ["subject", "email", "user ID"]
---

# Caddy User Identity

`set user identity` selects the value returned as Caddy's user ID after
successful authorization. It changes request metadata, not the token's claims,
the local account record, or access permissions.

```Caddyfile
# Inside the policy; choose one setting.
set user identity subject
```

| Value | Caddy user ID |
| --- | --- |
| `email` (default) | Email, falling back to subject when email is absent |
| `subject` or `sub` | JWT `sub` |
| `id` | JWT `jti` claim ID |

`id` therefore identifies a token's claim set, not a durable user identifier.
Do not use it to key an application account. For external issuers, bind a subject
to its trusted issuer namespace before mapping application users.

The other [identity placeholders](placeholders.md) remain available when
supplied. Apply role/claim rules separately; displaying an email or subject
does not grant permission to access the application.


## Choose the identifier for the job

An account identifier, a displayed identity, and a token identifier solve different problems.

| Need | Suitable evidence | Do not confuse it with |
| --- | --- | --- |
| Stable external account mapping | Trusted issuer namespace plus `sub` | An email address that can change |
| Caddy user metadata | Configured `email`, `subject`, or `id` selection | An ACL grant |
| Identify one issued claim set | JWT `jti` / `claim_id` | A permanent account ID |
| App membership | Verified roles and policy conditions | A recognizable display name |

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Compare identity selectors</summary>

```text
Help me understand Caddy User Identity.

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
https://docs.authcrunch.com/docs/authorize/identity

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain email, subject, and id in set user identity. Distinguish a user
subject from a JWT jti and describe the email fallback. Use two tokens for one
user to show why a claim-set ID is not a durable application account key.
```

</details>

<details>
<summary>Map an external identity</summary>

```text
Help me understand Caddy User Identity.

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
https://docs.authcrunch.com/docs/authorize/identity

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me design an application identity key when two issuers can emit the same
sub. Ask about trusted issuer and realm namespaces. Compare email changes with
stable subject mapping without assuming global uniqueness from one field.
```

</details>

<details>
<summary>Diagnose a changing user ID</summary>

```text
Help me understand Caddy User Identity.

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
https://docs.authcrunch.com/docs/authorize/identity

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

A backend sees a different user ID after renewed login. Help me inspect the
configured identity selector and synthetic claim examples. Separate token
reissuance, missing email, provider subject changes, and account mapping.
Explain what evidence distinguishes these causes.
```

</details>

<details>
<summary>Test fallback and scope</summary>

```text
Help me understand Caddy User Identity.

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
https://docs.authcrunch.com/docs/authorize/identity

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Create cases for missing email, present email, missing subject, and renewed
tokens with different jti values. Check the Caddy result and available
placeholders after authorization. Include a denied request so metadata
selection cannot be mistaken for an access grant.
```

</details>

<details>
<summary>Practice account mapping</summary>

```text
Help me understand Caddy User Identity.

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
https://docs.authcrunch.com/docs/authorize/identity

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Ask me one scenario at a time about email fallback, jti rotation, identical
subjects from different issuers, and choosing a display name. Wait for my
reasoning and correct it using implementation references and the
installed-version behavior.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28UserIdentityField%20OR%20GetIdentity%20OR%20http.auth.user.id%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authz_misc.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_misc.go)
   — parses source selection, validation, identity, and redirect options.
3. [go-authcrunch: pkg/authz/authenticate.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/authenticate.go)
   — authenticates requests, forwards claims, and strips accepted credentials.
4. [caddy-security: plugin_authz.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authz.go)
   — connects policy results to Caddy authentication and route configuration.
5. [caddy-security: plugin_authorization.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authorization.go)
   — preserves handled responses and applies authorized identity in the Caddy handler chain.
