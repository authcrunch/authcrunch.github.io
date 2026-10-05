---
title: "Authentication logging"
description: "Inspect login and policy failures and filter selected AuthCrunch diagnostic messages without changing access decisions."
discovery:
  topic: operations
  kind: guide
  aliases: ["logs", "debug", "logging skip", "diagnostics"]
---

# Authentication logging

Use logs to identify the failing stage: startup, identity lookup, provider
exchange, token verification, or policy evaluation. Record versions and request
IDs alongside an observed HTTP status. Read [Troubleshoot](../troubleshoot.md)
before changing an access rule to silence a denial.

## Enable diagnostics

Add `debug` in Caddy's global options block when reproducing a problem:

```caddyfile
{
    debug
    security {
        # Existing stores, portal and policies.
    }
}
```

Diagnostic logs can contain identity claims, addresses and bootstrap credentials.
Keep them private and remove tokens, passwords, cookies and provider secrets
before sharing a relevant excerpt. Disable verbose diagnostics when finished.
Caddy access logs are configured separately from AuthCrunch component logs.

## Filter expected messages

The optional block below is available in **caddy-security v1.3.0 /
go-authcrunch v1.3.8**. Add it inside the existing `security` block:

```caddyfile
logging {
    skip exact text "no token found"
    skip prefix text "Expected example diagnostic:"
}
```

Match the actual message text you observed; the second line is illustrative.
Each rule has `skip MATCH_TYPE text VALUE`. Match types are `exact`, `partial`,
`prefix`, `suffix`, or `regex`; matching is case-sensitive. Rules combine with
OR. Quote multiword strings and regexes. Values remain literal, including
placeholder-looking text; they are not expanded as credentials.

These rules suppress matching **AuthCrunch component diagnostics**. They do not
change login or authorization results, Caddy's independent authentication
middleware logger, or HTTP access logs. An empty block skips nothing.

Prefer a narrow match for a known repetitive message. After adding it, reproduce
both the expected event and an unrelated failure to confirm useful diagnostics
remain visible. Logging-only changes do not invalidate persisted sessions.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Identify the logger that emitted a line</summary>

```text
Help me understand Authentication logging.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-logging, logging.

Secondary reference:
https://docs.authcrunch.com/docs/operations/logging

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Given a redacted denied-request log, distinguish AuthCrunch component
diagnostics, Caddy’s independent authentication handler logger, and HTTP
access logs. Inspect message and error fields separately. Explain why a
library skip rule can suppress one line while a host line remains, without
changing the denied HTTP result.
```

</details>

<details>
<summary>Explore selector semantics</summary>

```text
Help me understand Authentication logging.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-logging, logging.

Secondary reference:
https://docs.authcrunch.com/docs/operations/logging

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare exact, partial, prefix, suffix, and Go regex selectors against
synthetic messages and supported field values. Include case changes,
unanchored regex, multiple OR rules, and an empty block. Explain which keys,
numbers, arrays, or nested objects are outside the filter’s selector.
```

</details>

<details>
<summary>Review a narrowly scoped filter</summary>

```text
Help me understand Authentication logging.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-logging, logging.

Secondary reference:
https://docs.authcrunch.com/docs/operations/logging

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Review a skip rule intended to reduce expected missing-token noise. Ask for
the actual component message and redacted fields, then predict matching and
nonmatching cases. Keep malformed-token and unrelated failures visible. Do not
recommend broad suppression simply because several lines share a logger name.
```

</details>

<details>
<summary>Trace configuration and lifecycle</summary>

```text
Help me understand Authentication logging.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-logging, logging.

Secondary reference:
https://docs.authcrunch.com/docs/operations/logging

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Follow a skip statement through Caddy tokenization, the shared parser, JSON,
and immutable runtime filter construction. Explain literal
runtime-placeholder-looking patterns versus adaptation-time environment
expansion. Compare removing a rule, reload restrictions, and a logging-only
persistent stop/start without claiming changed access policy.
```

</details>

<details>
<summary>Prove observability without weakening access</summary>

```text
Help me understand Authentication logging.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-logging, logging.

Secondary reference:
https://docs.authcrunch.com/docs/operations/logging

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Design a before/after check using one expected denial, one malformed
credential, one unrelated error, and one allowed request. Compare logs and
HTTP outcomes separately. Ask how logs are stored and redact tokens before
sharing evidence; no live credential is needed to demonstrate matching.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28LoggingConfig%20OR%20SkipRule%20OR%20NewFilter%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_logging.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_logging.go)
   — collects root diagnostic skip statements for the shared logging parser.
3. [caddy-security: app_logging_test.go](https://github.com/greenpau/caddy-security/blob/main/app_logging_test.go)
   — tests logging configuration and its Caddy app boundary.
4. [go-authcrunch: pkg/logging/config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/logging/config.go)
   — defines diagnostic skip selectors and validates their configuration.
5. [go-authcrunch: pkg/logging/filter.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/logging/filter.go)
   — filters matching component messages and supported field values.
6. [go-authcrunch: pkg/logging/filter_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/logging/filter_test.go)
   — tests selector semantics and logger field matching.
7. [caddy-security: app.go](https://github.com/greenpau/caddy-security/blob/main/app.go)
   — owns Caddy security-app startup, route admission, and cleanup.
