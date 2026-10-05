---
sidebar_position: 4
title: Next steps
description: "Choose an identity provider, add authentication controls, and understand what must change before deploying the local example."
discovery:
  topic: operations
  kind: guide
  aliases: ["deployment", "production", "reverse proxy"]
---

# Next steps

You now have a portal that authenticates users and a policy that admits one user
while rejecting another. Choose the next task based on your application.

## Connect your identity source

- **Use an external provider:** start with [OAuth and OIDC](../authenticate/oauth/10-oauth2.md), then select the provider guide in [Identity providers](../guides.md#identity-providers).
- **Use enterprise SAML:** follow [the signed, browser-bound SAML flow](../authenticate/saml/10-saml.md).
- **Use a directory:** review [LDAP](../authenticate/ldap/10-ldap.md) and its user search settings.
- **Keep local users:** learn about the [local identity store](../authenticate/local/20-identity-store.md) and [password management](../authenticate/local/30-password-management.md).

Keep the provider's callback URL, the portal mount path, and the policy's login
URL consistent. When changing the identity source, verify the claims and roles
it produces before relying on the existing app policy.

## Shape login and access

- Add [multi-factor authentication](../authenticate/11-mfa.md) and understand [authentication challenges](../authenticate/13-authentication-challenges.md).
- Map identities into application roles with [user transforms](../authenticate/42-user-transforms.md).
- Refine access with [role-based rules](../authorize/acl-rbac.md) and [path rules](../authorize/path-acl.md).
- Pass selected identity information to an upstream application using [headers](../authorize/headers.md).

Repeat both the allowed-user and denied-user checks after changing the rules.
An upstream application that trusts identity headers must only accept them from
the trusted proxy; users must not be able to bypass that proxy or supply trusted
headers themselves.

## Prepare a deployment

The learning Caddyfile is deliberately local. Before turning it into a service,
make these deployment choices:

| Area | What must change |
| --- | --- |
| HTTPS and addresses | Use your real HTTPS hostnames and matching login/callback URLs. Remove `cookie insecure enabled`. Revisit the loopback binding and cookie scope for your topology. |
| Users | Remove the public demo accounts and passwords. Review every account and role in the store, including any bootstrap administrator. |
| Signing keys | Supply protected, durable key material. The shell-generated demo secret is temporary; changing it prevents existing tokens from verifying against the new key. |
| Storage | Give the service durable, access-controlled storage and a backup plan. Relative paths resolve from its working directory. Keeping a user database is distinct from preserving sessions across restarts. |
| Application | Replace the demo response with your application handler, such as `reverse_proxy`, after the authorization handler in the matched route. |
| Operations | Choose a service manager, logging, updates, and an explicit administration/reload strategy. The tutorial disables Caddy's admin endpoint. |

Use [Caddy's reverse proxy reference](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)
for upstream configuration and its [running guide](https://caddyserver.com/docs/running)
for service operation. Keep the authorization check ahead of the app handler and
test the full set of application paths you intend to protect.

For renewable local login, configure [refresh sessions](../authenticate/30-refresh-token.md)
explicitly. For restart continuity, follow [runtime-state storage](../operations/runtime-state.md);
a mounted user database alone does not preserve sessions. For an app acting as
an OIDC client, use the [OIDC provider](../apps/oidc-provider.md).

For a specific task, continue with the [topic directory](../guides.md). For
configuration details, use the [reference](../reference.md).

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Turn the local demo into a deployment plan</summary>

```text
Help me understand Next steps.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
configuration-authorization, runtime-state.

Secondary reference:
https://docs.authcrunch.com/docs/start/next-steps

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Ask about the application, public HTTPS origin, service manager, identity
source, and deployed versions. Identify real hostnames, secure cookies,
demo-account removal, private durable keys/storage, and backend routing
choices. Explain the purpose of each change and what must be tested before
using the learning example as a service.
```

</details>

<details>
<summary>Choose and connect an identity source</summary>

```text
Help me understand Next steps.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
configuration-authorization, runtime-state.

Secondary reference:
https://docs.authcrunch.com/docs/start/next-steps

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare local users, external OAuth/OIDC, enterprise SAML, and LDAP for my
requirements. Trace provider registration, callback URL, portal mount, and
policy login URL. Explain why changed claims and roles must be inspected
before reusing the demo application policy.
```

</details>

<details>
<summary>Add factors and application membership</summary>

```text
Help me understand Next steps.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
configuration-authorization, runtime-state.

Secondary reference:
https://docs.authcrunch.com/docs/start/next-steps

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain user transforms, login challenges, factor evidence, application roles,
and policy rules as separate stages. Build allowed-user and denied-user cases
after changing identity or MFA settings. Show why a generic portal role or a
visible login button does not prove permission for the application.
```

</details>

<details>
<summary>Review the proxy trust boundary</summary>

```text
Help me understand Next steps.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
configuration-authorization, runtime-state.

Secondary reference:
https://docs.authcrunch.com/docs/start/next-steps

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Trace an authorized request into the reverse proxy and identify which identity
headers the backend may trust. Ask whether clients can reach the backend
directly or submit those headers themselves. Test anonymous access and
uncovered application paths without assuming successful homepage login
protects every route.
```

</details>

<details>
<summary>Choose continuity features explicitly</summary>

```text
Help me understand Next steps.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration, configuration-http-integrations,
configuration-authorization, runtime-state.

Secondary reference:
https://docs.authcrunch.com/docs/start/next-steps

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare durable local users, stable signing keys, renewable portal sessions,
persistent completed runtime state, and downstream OIDC integration. Ask which
behavior the application needs across expiry, logout, restart, and account
changes. Explain the single-owner lifecycle and avoid promising session
continuity from a mounted users file alone.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28AuthenticationHandler%20OR%20AuthorizationHandler%20OR%20SessionCache%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: assets/config/Caddyfile](https://github.com/greenpau/caddy-security/blob/main/assets/config/Caddyfile)
   — provides an upstream configuration entry point with named security components and routes.
3. [caddy-security: plugin_authn.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authn.go)
   — mounts the portal in Caddy and delegates HTTP requests.
4. [caddy-security: plugin_authorization.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authorization.go)
   — preserves handled responses and applies authorized identity in the Caddy handler chain.
5. [caddy-security: caddyfile_authn.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn.go)
   — dispatches authentication-portal configuration.
6. [caddy-security: caddyfile_authz_acl.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_acl.go)
   — adapts full ACL rules, actions, defaults, and field declarations.
7. [go-authcrunch: pkg/kms/crypto_keystore.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/kms/crypto_keystore.go)
   — loads and organizes configured signing, verification, and System keys.
8. [go-authcrunch: server_persistent_state.go](https://github.com/greenpau/go-authcrunch/blob/main/server_persistent_state.go)
   — derives conservative persistent-session bindings from security configuration.
