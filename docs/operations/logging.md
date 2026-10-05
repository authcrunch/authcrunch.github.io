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
