---
title: "Direct OAuth authorization"
description: "Protect an application with provider sign-in and an opaque local session, without creating an authentication portal."
discovery:
  topic: authorization
  kind: guide
  aliases: ["portal-free", "OAuth policy", "OIDC", "opaque session"]
---

import CodeBlock from '@theme/CodeBlock';
import example from '@site/assets/conf/oauth/direct/Caddyfile?raw';

# Direct OAuth authorization

A policy can send users directly to an OAuth/OIDC provider and manage the
application's local session. This mode requires no portal, local database or
application JWT signing configuration. It is available in **caddy-security
v1.3.0 / go-authcrunch v1.3.8**.

Use a portal when you need local accounts, portal transforms, profile management,
local MFA or downstream OIDC. Direct authorization retains provider claims and
checks its ACL on every request; it does not run those portal features.

## Register and configure

Create a confidential provider application supporting authorization code,
`client_secret_post`, and S256 PKCE. For this example register exactly:

```text
https://app.example.com/_authcrunch/oauth2/apppolicy/authorization-code-callback
```

Set `OIDC_ISSUER` and `OIDC_DISCOVERY_URL` to the issuer and its discovery URL;
these expand at adaptation time. Set `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET`
to the provider credentials; their runtime placeholders stay in the example.
Configure an ID-token group/role `app-members` for intended users and provide
email for the generic driver's default check. See the [generic provider guide](../authenticate/oauth/81-backend-oauth2-0000-generic.md)
for claim-source requirements.

<CodeBlock language="caddyfile" title="assets/conf/oauth/direct/Caddyfile">{example}</CodeBlock>

The whole site routes through one policy, including its callback and logout
namespace. If you protect only selected app paths, explicitly route the OAuth
namespace to the **same policy** too. Do not strip or rewrite its base path.

## Decide who may enter

The example requires `app-members`, supplied by the verified provider identity.
Test a member and nonmember. Direct policies add `authp/user` to authenticated
users; allowing that baseline alone admits every account the provider accepts.
It is not a restricted application membership rule.

Provider group configuration, app assignment, and the AuthCrunch ACL are
separate checks. Direct policies cannot use a portal transform to add a missing
claim. Generic OIDC does not forward arbitrary path-ACL claims; use policy
[method/path rules](acl-rbac.md) for resource restrictions instead.

## Request and session behavior

An anonymous GET or HEAD starts provider login with a 302. A successful callback
returns 303 to the saved local URI. Unauthenticated requests with other methods
receive 401; request bodies are not replayed after login. A denied identity or
resource receives 403. Malformed callbacks return 400, unsupported methods 405,
provider initiation failures 502, and capacity exhaustion 503.

The policy creates host-only, root-path, Secure, HttpOnly, SameSite=Lax session
and login cookies. The browser receives an opaque local session credential,
not an upstream token. Sessions are bound to the policy and HTTPS origin. An
upstream account change does not instantly revoke a completed local session;
choose its lifetime accordingly.

| Setting inside the policy | Default |
| --- | --- |
| `oauth base path` | `/_authcrunch/oauth2/POLICY_NAME` |
| `oauth session lifetime` | 900 seconds, maximum 86400 |
| `oauth maximum sessions` | 10000 |
| `oauth maximum pending logins` | 1024, including in-flight exchanges |
| `oauth session cookie name` | `AUTHZ_POLICY_NAME_SESSION` |
| `oauth login cookie name` | `AUTHZ_POLICY_NAME_LOGIN` |

`oauth public origin` pins the external HTTPS origin. Behind TLS termination,
preserve the expected Host through the trusted proxy. Without an explicit origin,
the incoming connection must use TLS and the site must restrict valid hosts.

JWT keys, token-source lists, portal cookie settings and authentication proxies
cannot be combined with direct OAuth in the same policy. Normal claim injection,
token stripping, ACLs and bypass rules remain separate policy options. The
reserved OAuth namespace is processed before bypass rules.

## Sign out and restart

POST to `/_authcrunch/oauth2/apppolicy/logout` with the exact same-origin `Origin`
header. In a browser:

```js
await fetch('/_authcrunch/oauth2/apppolicy/logout', {
  method: 'POST',
  credentials: 'same-origin',
});
```

A successful response is 204. It revokes the local session and pending login,
then deletes both policy cookies. It does not end the provider's SSO session.
There is no sliding renewal or refresh token in this mode; expiry starts a new
provider login, which may reuse upstream SSO.

Without [persistent state](../operations/runtime-state.md), restart loses
sessions and pending logins. Persistence retains completed sessions and logout,
but unfinished exchanges still restart. Keep browser callbacks and relying
requests on the same process; there is no distributed session store.

## Verify the deployment

Check the exact callback URL, member access, nonmember denial, POST without a
session, expiry, local logout, and callback replay rejection. Confirm that the
OAuth namespace reaches the policy rather than your upstream. A parser check
does not establish live provider registration, consent or group configuration.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Compare direct and portal login</summary>

```text
Help me understand Direct OAuth authorization.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-oauth, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/direct-oauth

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain direct OAuth authorization’s provider-backed opaque local session.
Contrast it with portal JWTs, local accounts, transforms, Profile, and refresh
sessions. Ask about my required capabilities and use source evidence to
identify which mode fits.
```

</details>

<details>
<summary>Trace the reserved namespace</summary>

```text
Help me understand Direct OAuth authorization.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-oauth, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/direct-oauth

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Walk through login initiation, the exact callback route, state/browser/origin
binding, and the saved return URI. Explain why callback/logout paths must
reach the same policy and how reserved routes interact with bypass. Use
synthetic URLs and a simple flow diagram.
```

</details>

<details>
<summary>Diagnose provider versus ACL failure</summary>

```text
Help me understand Direct OAuth authorization.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-oauth, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/direct-oauth

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me distinguish provider registration or callback failure from missing
member claims and target-resource denial. Ask for redacted status, callback
URL, origin, and normalized roles. Explain why baseline authp/user is broad
and why a portal transform cannot repair a direct-policy claim.
```

</details>

<details>
<summary>Exercise session boundaries</summary>

```text
Help me understand Direct OAuth authorization.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-oauth, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/direct-oauth

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Design cases for GET/HEAD versus POST without a session, callback replay,
wrong browser/origin, expiry, capacity, same-origin logout, and restart.
Separate local session revocation from provider SSO logout and explain what
persistence retains.
```

</details>

<details>
<summary>Review a deployment choice</summary>

```text
Help me understand Direct OAuth authorization.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authorization,
authorization-policy-oauth, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/direct-oauth

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Review my redacted direct policy for incompatible JWT/source/proxy options,
host restrictions, public origin, member ACLs, and routing. Explain which
checks establish parser validity and which need a real provider/browser. End
with a teach-back question about sticky routing and unfinished exchanges.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28OAuthAuthorizationConfig%20OR%20ConfigureOAuth%20OR%20CancelLogin%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authz.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz.go)
   — dispatches authorization-policy subdirectives into library configuration.
3. [caddy-security: caddyfile_authz_oauth_test.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_oauth_test.go)
   — tests direct OAuth policy configuration and incompatible options.
4. [go-authcrunch: pkg/authz/oauth_config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/oauth_config.go)
   — validates direct OAuth settings, limits, and policy compatibility.
5. [go-authcrunch: pkg/authz/oauth.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authz/oauth.go)
   — handles direct OAuth callbacks, local sessions, and logout.
6. [go-authcrunch: server_oauth_authorization_e2e_test.go](https://github.com/greenpau/go-authcrunch/blob/main/server_oauth_authorization_e2e_test.go)
   — tests provider login and application access through the public server interface.
