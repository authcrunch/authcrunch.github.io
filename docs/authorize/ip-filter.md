---
sidebar_position: 7
description: "Match the source address of a request against the IP address recorded in its token."
discovery:
  topic: authorization
  kind: reference
  aliases: ["IP filtering", "validate source address"]
---

# IP Address Filtering

`validate source address` requires the request's source address to equal the
`addr` claim in the accepted token. It is an additional binding check, not a
network allowlist and not proof that a device is trusted.

```Caddyfile
# Inside an authorization policy:
validate source address
allow roles app/member
```

The issuer must record the source address. In a portal, `enable source ip tracking`
enables this token claim. A missing or mismatched claim fails validation.
Configure the issuer and gatekeeper to interpret source addresses consistently.

Behind a reverse proxy, trust only known proxy hops and normalize forwarded
headers. Otherwise an arbitrary forwarded address can defeat the intended
binding or lock out legitimate users. See [deployment diagnostics](../operations/logging.md).

A user's address can change with mobile networks, VPNs, NAT, and IPv4/IPv6
selection. Test those transitions before enabling this rule for a browser
application. To restrict a management endpoint to a CIDR, use an appropriate
Caddy request matcher rather than this token-equality feature.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Explain address binding</summary>

```text
Help me understand IP Address Filtering.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
configuration-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/ip-filter

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain the relationship between the issuer’s addr claim and validate source
address at the policy. Distinguish this equality check from a CIDR allowlist,
device identity, and role authorization. Walk through missing, matching, and
mismatched claims.
```

</details>

<details>
<summary>Map proxy address trust</summary>

```text
Help me understand IP Address Filtering.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
configuration-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/ip-filter

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me draw the address observed by the portal and gatekeeper through my
reverse proxies. Ask which hops and forwarded headers are trusted. Identify
what evidence is needed to show both services use the same client address
without trusting arbitrary client-supplied headers.
```

</details>

<details>
<summary>Diagnose mobile failures</summary>

```text
Help me understand IP Address Filtering.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
configuration-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/ip-filter

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Build a diagnosis for users who can log in but lose access after a VPN or
mobile-network change. Separate token age, address-family changes, missing
tracking, and proxy disagreement. Explain which observation confirms address
binding rather than a role or signature failure.
```

</details>

<details>
<summary>Plan boundary tests</summary>

```text
Help me understand IP Address Filtering.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
configuration-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/ip-filter

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Create an address-binding test matrix covering direct requests, trusted proxy
traffic, forged forwarded headers, IPv4/IPv6 changes, and a token lacking
addr. Include an allowed application member and a denied nonmember so the IP
check is not mistaken for permission.
```

</details>

<details>
<summary>Choose an appropriate control</summary>

```text
Help me understand IP Address Filtering.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
configuration-authentication.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/ip-filter

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Ask me about a browser app and an internal management endpoint. Help me
compare token-address equality with Caddy network matchers and ordinary ACLs.
Give a reasoned recommendation for each scenario, tied to observable network
behavior and my release rather than assumptions about trusted devices.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28ValidateSourceAddress%20OR%20SourceIPTracking%20OR%20validateSourceAddress%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authz_misc.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_misc.go)
   — parses source selection, validation, identity, and redirect options.
3. [go-authcrunch: pkg/authz/config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/config.go)
   — defines and validates authorization-policy settings.
4. [go-authcrunch: pkg/authz/validator/validator.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/validator/validator.go)
   — configures token validation and request-specific authorization checks.
5. [go-authcrunch: pkg/authz/gatekeeper.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/gatekeeper.go)
   — constructs validators and handles policy requests, bypass, and redirects.
6. [caddy-security: caddyfile_authz_test.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_test.go)
   — checks policy grammar and adapted ACL/credential settings.
