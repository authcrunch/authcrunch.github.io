---
title: "Trusted application ticket login"
description: "Accept short-lived browser-bound sign-in tickets from a trusted application using SQLite or Consul, with explicit issuer and callback bindings."
discovery:
  topic: identity-providers
  kind: guide
  aliases: ["ticket login", "single-use", "SQLite", "Consul", "application sign-in"]
---

# Trusted application ticket login

AuthCrunch v1.5.0 can accept single-use tickets from an application that already
authenticates and authorizes its users. The trusted application owns issuance;
Caddy owns portal routing, transforms, policy and access-token signing. This
integration creates no issuer endpoint, anonymous issuance API or issuance CLI.
Use OAuth/OIDC for an ordinary external identity-provider integration.

## Configure the provider

Install the [`identity-providers-sqlite` companion](../operations/backends.md).
Inside `security`, add:

```caddyfile
identity provider sqlite trusted-app {
    realm application
    path /var/lib/authcrunch/private/tickets.db
    public_origin https://auth.example.com
    issuer_url https://issuer.example.com/signin
    base_path /auth
    cookie_name APP_LOGIN_BINDING
    timeout 1s
}
```

Enable `trusted-app` with `enable identity provider trusted-app` inside your
portal. Mount it at `/auth` using `authenticate with myportal at /auth` and keep
the full path. Configure normal signing and application authorization separately.
All provider fields are literal. The required absolute SQLite path needs an
existing private `0700` parent; database and sidecars use `0600`.

The HTTPS origin and issuer are canonical, with no userinfo, query or fragment.
Issuer and callback cannot be the same URL. The binding cookie must not collide
with portal/provider cookies. It is Secure, HttpOnly, host-only, SameSite=Lax
and scoped to the callback. Its name is independent of the portal cookie prefix.

For durable account UUIDs, add `attach to local identity store accounts` and
declare the built-in local store described in [connected accounts](connected-accounts.md).
Omission uses a provider-private passwordless memory identity. Pending-ticket
durability alone does not preserve that identity or completed browser sessions.

## Integrate the trusted issuer

1. The browser follows `/auth/provider/application`.
2. AuthCrunch creates a five-minute request and browser-binding cookie, then
   redirects to the pinned issuer with `request` and `callback` parameters.
3. The issuer independently authenticates/authorizes the user, validates the
   request through the selected backend's public Go integration, and issues a
   ticket bounded to two minutes and the original request deadline.
4. The browser returns the exact state and ticket to the configured callback.
   AuthCrunch checks the original browser cookie and atomically consumes the ticket.
5. Current portal transforms and factor policy decide whether to issue access.

Implement issuance with the public provider integration documented in the
[versioned trusted-issuer contract](https://github.com/greenpau/caddy-security/blob/v1.5.0/.codex/skills/configuration-ticket-providers/references/trusted-issuer.md).
With SQLite, issuer and Caddy need compatible local access to the same private
database. For cross-host issuance, select `identity provider consul` with the
same realm/origin/issuer/mount and configure [Consul storage](../operations/backends.md#consul-prerequisites);
it uses a Consul prefix instead of a SQLite path.

A wrong browser does not spend the legitimate ticket. Successful consumption
is single-use even if later policy/signing denies login. Asserted roles do not
prove local password or MFA. API refresh snapshots and downstream OIDC local
login do not accept ticket proof. Portal logout does not revoke pending tickets
or already issued stateless access JWTs.

## Protect logs and test failures

Tickets and request identifiers travel in redirect URLs. Delete `request>uri`
and `resp_headers>Location` from **both** global diagnostic and site access
filter encoders. Apply equivalent protection at the issuer and proxies.
Handler query stripping does not redact Caddy's earlier request copy.

Test successful login, wrong browser, duplicate callbacks, replay, mismatched
host/mount, expired state, stronger local factor policy and compatible restart.
After an uncertain commit, issue no tentative identity or credential; drain and
reopen unhealthy storage, reconcile the outcome and start a fresh login.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Trace trusted issuance</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-ticket-providers; sqlite-ticket-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/ticket-login

Explain which application authenticates the user, which public API issues a ticket and which Caddy callback consumes it. Do not invent an issuer endpoint or issuance CLI.
```

</details>

<details>
<summary>Bind the browser</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-ticket-providers; sqlite-ticket-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/ticket-login

Explain request/ticket deadlines, callback state, exact origin/mount and the independent cookie name/scope. Analyze wrong-browser and duplicate-parameter failures.
```

</details>

<details>
<summary>Compare backend placement</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-ticket-providers; sqlite-ticket-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/ticket-login

Compare local SQLite issuer access with Consul peer issuance. Distinguish pending-ticket persistence from durable attached account IDs and completed portal sessions.
```

</details>

<details>
<summary>Check factor and role claims</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-ticket-providers; sqlite-ticket-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/ticket-login

Analyze a valid ticket with app-only roles and a portal requiring local MFA. Explain why federated assertions cannot supply local-factor, refresh or downstream OIDC authority.
```

</details>

<details>
<summary>Handle replay and diagnostics</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-ticket-providers; sqlite-ticket-provider.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authenticate/ticket-login

Design concurrent-consumption, replay, restart and uncertain-commit checks. Explain URI/Location redaction on Caddy, issuer and proxies before logging synthetic journeys.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20ticket%20login&type=code).
- [plugins/identity-providers-sqlite/plugin.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/plugins/identity-providers-sqlite/plugin.go): Provider module registration.
- [plugins/identity-providers/sqlite/provider.go (v1.4.1)](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/plugins/identity-providers/sqlite/provider.go): Trusted issuance and consumption.
- [plugins/identity-providers/sqlite/consumer_e2e_test.go (v1.4.1)](https://github.com/greenpau/go-authcrunch/blob/v1.4.1/plugins/identity-providers/sqlite/consumer_e2e_test.go): Public consumer protocol tests.
