---
title: "Feature availability and versions"
description: "Distinguish the released Caddy bundle, its bundled AuthCrunch library, and newer features visible in source checkouts."
discovery:
  topic: operations
  kind: reference
  aliases: ["release", "version", "unreleased", "compatibility"]
---

# Feature availability and versions

A Caddy integration release and a go-authcrunch library release are different
artifacts. Installing a newer standalone library does not update the dependency
inside a previously built Caddy executable.

As checked on **October 5, 2026**, the latest downloadable Caddy bundle is
[caddy-security v1.3.0](https://github.com/greenpau/caddy-security/releases/tag/v1.3.0),
whose [go.mod](https://github.com/greenpau/caddy-security/blob/v1.3.0/go.mod)
pins **go-authcrunch v1.3.8**. The standalone library has separately released
[v1.3.11](https://github.com/greenpau/go-authcrunch/releases/tag/v1.3.11).
These guides use the published Caddy bundle unless they state another boundary.

## Check the executable you run

```sh
authcrunch version
authcrunch security version
authcrunch list-modules
```

The first reports Caddy, the second the AuthCrunch library, and the third the
compiled modules. For a custom build named `caddy`, use that executable instead.
Keep its integration revision too: the library version alone does not prove
that an adapter exposes a new directive.

## Features in the released bundle

| Capability | Documentation |
| --- | --- |
| Local, LDAP, OAuth/OIDC and SAML login | [Authentication overview](../authenticate/intro.md) |
| Local MFA and ordered challenge policies | [MFA](../authenticate/11-mfa.md) and [challenges](../authenticate/13-authentication-challenges.md) |
| Rotating local refresh sessions | [Refresh sessions](../authenticate/30-refresh-token.md) |
| Completed-session and generated-key persistence | [Runtime state](runtime-state.md) |
| Provider login directly in an app policy | [Direct OAuth](../authorize/direct-oauth.md) |
| AuthCrunch serving relying parties as an OIDC provider | [OIDC provider](../apps/oidc-provider.md) |
| Bundled local management CLI and reusable Go login client | [CLI](local-client.md) and [Go client](authclient.md) |
| Argon2id and bcrypt local passwords | [Password management](../authenticate/local/30-password-management.md) |
| Numeric GitHub IDs and organization transforms | [GitHub](../authenticate/oauth/81-backend-oauth2-0007-github.md) |
| Diagnostic message filtering | [Logging](logging.md) |
| Explicit administrative API permissions and private-key export | [Server API](../authenticate/api/40-server-api.md) |
| RSA, EC, and Ed25519 public signing-key JWKS | [Token verification](../authorize/token-verification.md) |
| Header/query/Basic/API-key credential stripping | [Identity headers](../authorize/headers.md) |

## Partial application SAML support

[AWS application SSO](../apps/sso_saml.md) has metadata and a role menu, but its
assume-role handler does not issue a SAML assertion in either the released
bundle or standalone v1.3.11. Upstream SAML login is implemented separately.
Do not infer complete AWS federation from accepted `sso provider` syntax.

## Newer library and integration work

The [v1.4.0 source tag](https://github.com/greenpau/caddy-security/tree/v1.4.0)
now pins library v1.3.11 and Caddy v2.11.7. At this check, GitHub's release API
still lists v1.3.0 as the latest downloadable bundle; v1.4.0 binary/checksum
assets are not published. A source tag and a verified downloadable executable
are separate availability checks.

These features require that newer integration source:

| Feature | Library availability | Downloadable bundle / newer source |
| --- | --- | --- |
| [Typed policy-local custom ACL fields](../authorize/custom-fields.md) | go-authcrunch v1.3.9 and later | Not in v1.3.0; available in v1.4.0 source |
| Correct unconditional/default ACL evaluation | go-authcrunch v1.3.11 | Fixed in v1.4.0 source; see the [v1.3.0 limitation](../authorize/acl-rbac.md#match-any-condition) |
| [Optional cross-device browser login](../authenticate/cross-device.md) | go-authcrunch v1.3.11 | Not in v1.3.0; available in v1.4.0 source |

Use configuration for those features with a matching v1.4.0 source build.
Do not paste it into v1.3.0 and expect parser support. Check the
v1.4.0 release assets and embedded versions before switching a binary install.

## Upgrade deliberately

Read the relevant release notes, validate the configuration with the replacement
binary, and test login, allowed access, denied access, logout and session behavior.
Persistent-state deployments require a stop/start handover. Regenerate adapted
JSON from the Caddyfile when adopting direct OAuth, rather than carrying forward
an old authorization-handler representation.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Inventory the executable I actually run</summary>

```text
Help me understand Feature availability and versions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: release-and-versioning, configuration.

Secondary reference:
https://docs.authcrunch.com/docs/operations/versions

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Ask for the binary path, Caddy version, security version, compiled modules,
and integration build provenance. Explain what each proves and what it cannot
prove. Distinguish a downloadable bundle, a source tag, a library module
release, and the source currently checked out beside the docs.
```

</details>

<details>
<summary>Verify a feature’s release boundary</summary>

```text
Help me understand Feature availability and versions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: release-and-versioning, configuration.

Secondary reference:
https://docs.authcrunch.com/docs/operations/versions

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Choose a capability I want, then trace its adapter grammar, library consumer,
tests, release tags, and downloadable assets. Compare main with my exact
release. Mark source-only behavior explicitly and do not infer supported
syntax merely because the library exposes a related type.
```

</details>

<details>
<summary>Read release evidence critically</summary>

```text
Help me understand Feature availability and versions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: release-and-versioning, configuration.

Secondary reference:
https://docs.authcrunch.com/docs/operations/versions

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare a version file, go.mod selection, release notes, a Git tag, and an
attached executable/checksum. Explain why a tag without published assets is
not a downloadable upgrade and why updating a source dependency does not
update an existing binary. Verify current official release information before
recommending a version.
```

</details>

<details>
<summary>Plan a reproducible upgrade check</summary>

```text
Help me understand Feature availability and versions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: release-and-versioning, configuration.

Secondary reference:
https://docs.authcrunch.com/docs/operations/versions

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Create a plan to verify artifact provenance, required modules, redacted
configuration adaptation, trusted HTTPS, allowed and denied journeys, and
rollback constraints. Include local identity and persistent-state ownership
where applicable. Ask about topology and current versions before prescribing
commands or a deployment method.
```

</details>

<details>
<summary>Practice version diagnosis</summary>

```text
Help me understand Feature availability and versions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: release-and-versioning, configuration.

Secondary reference:
https://docs.authcrunch.com/docs/operations/versions

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Quiz me on five mismatches: new docs with an old bundle, new library with an
old adapter, a release tag without assets, an executable on a different PATH,
and a locally replaced module. Wait for my evidence and show how to resolve
each without claiming a version check exercises the feature.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28GetVersion%20OR%20go-authcrunch%20OR%20CaddyVersion%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: go.mod](https://github.com/greenpau/caddy-security/blob/main/go.mod)
   — records the integration's selected Caddy and AuthCrunch library dependencies.
3. [caddy-security: command_security.go](https://github.com/greenpau/caddy-security/blob/main/command_security.go)
   — registers security commands, including the library-version report.
4. [caddy-security: command_security_version_e2e_test.go](https://github.com/greenpau/caddy-security/blob/main/command_security_version_e2e_test.go)
   — checks the security version command through the executable boundary.
5. [go-authcrunch: VERSION](https://github.com/greenpau/go-authcrunch/blob/main/VERSION)
   — records the library version in the selected source revision.
6. [go-authcrunch: go.mod](https://github.com/greenpau/go-authcrunch/blob/main/go.mod)
   — records the library's module and dependency declarations.
