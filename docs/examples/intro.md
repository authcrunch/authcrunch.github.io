---
sidebar_position: 2
title: "Community examples"
description: "Find community-written examples of AuthCrunch integrations."
discovery:
  topic: operations
  kind: reference
  aliases: ["deployment"]
---

# Community examples

Start with the [tested first-app Caddyfile](../start/first-app.md) or a provider's
canonical example. For additional patterns, Eric Zimmerman's
[community writeup](https://gist.github.com/EricZimmerman/3015b94ab027d0597e0e55e93f0466c3)
covers home services and mobile clients using Basic/API-key authentication.

That writeup describes a specific older deployment, not a versioned test suite
for the current release. In particular, use the released [API-key guidance](../authorize/api_key_auth.md)
and [Basic authentication requirements](../authorize/basic_auth.md), including
the realm header and trusted route boundary, rather than copying its old key
length workaround or treating custom header names as an access policy.

Before adopting any community configuration, identify its module/library
versions, replace hostnames and credentials, validate the grammar and test both
an authorized user and a signed-in nonmember. Optional modules, TLS/DNS setup
and application-specific APIs require their own verification. Keep private
keys and account data outside the file-server root.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Evaluate a community example</summary>

```text
Help me understand Community examples.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
testing-and-ci.

Secondary reference:
https://docs.authcrunch.com/docs/examples/intro

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me review an example’s publication date, actual AuthCrunch/Caddy
versions, provider assumptions, and configuration grammar. Compare it with
current upstream examples and my installed release. Preserve useful topology
ideas while identifying statements that need runtime evidence rather than
assuming a tutorial is a maintained test.
```

</details>

<details>
<summary>Adapt the topology deliberately</summary>

```text
Help me understand Community examples.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
testing-and-ci.

Secondary reference:
https://docs.authcrunch.com/docs/examples/intro

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Ask about public hostnames, HTTPS termination, portal mount, callback URLs,
app paths, and backend reachability. Map these onto a synthetic example and
explain which cookie, login URL, and route-order settings must agree. Do not
merely replace a hostname throughout an older configuration.
```

</details>

<details>
<summary>Inspect the access boundary</summary>

```text
Help me understand Community examples.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
testing-and-ci.

Secondary reference:
https://docs.authcrunch.com/docs/examples/intro

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Review an example’s role transforms, policy rules, factor evidence, and
trusted headers. Explain what the issuer guarantees and what the application
policy must enforce. Design anonymous, allowed, nonmember, wrong-method,
sibling-path, and direct-backend cases before calling the deployment
protected.
```

</details>

<details>
<summary>Check claims and modules before copying fixes</summary>

```text
Help me understand Community examples.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
testing-and-ci.

Secondary reference:
https://docs.authcrunch.com/docs/examples/intro

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Analyze an example that proposes a key-length workaround, custom identity
header, obsolete authp directive, or extra Caddy module. Verify the actual
parser/runtime support and cryptographic requirement for my version. Explain
why a header rename or successful adaptation is not proof of a working access
check.
```

</details>

<details>
<summary>Turn a write-up into evidence</summary>

```text
Help me understand Community examples.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
testing-and-ci.

Secondary reference:
https://docs.authcrunch.com/docs/examples/intro

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Build a short validation record containing source/version references, redacted
configuration, adaptation result, trusted-HTTPS login, denied-user result,
logout, and temporary-server cleanup. Separate fixture coverage from my
environment’s behavior. Ask for unresolved provider or network assumptions
instead of inventing passing results.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28parseCaddyfile%20OR%20AuthenticationHandler%20OR%20AuthorizationHandler%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: assets/config/Caddyfile](https://github.com/greenpau/caddy-security/blob/main/assets/config/Caddyfile)
   — provides an upstream configuration entry point with named security components and routes.
3. [caddy-security: caddyfile.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile.go)
   — registers global security configuration and route directive adapters.
4. [caddy-security: caddyfile_adapt_test.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_adapt_test.go)
   — checks complete Caddyfile fixtures against expected adapted configuration.
5. [caddy-security: plugin_authn.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authn.go)
   — mounts the portal in Caddy and delegates HTTP requests.
6. [caddy-security: plugin_authorization.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authorization.go)
   — preserves handled responses and applies authorized identity in the Caddy handler chain.
7. [go-authcrunch: config.go](https://github.com/greenpau/go-authcrunch/blob/main/config.go)
   — validates the library configuration graph and named components.
