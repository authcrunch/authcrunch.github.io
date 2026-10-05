---
title: "Angular and browser applications"
description: "Integrate browser identity displays and login redirects while enforcing application access at the server."
discovery:
  topic: applications-and-sso
  kind: guide
  aliases: ["Angular", "SPA", "ngx-authp-service", "ngx-avatar-persona", "CORS"]
---

# Angular integration libraries

Protect the application and its API at the server, then use portal identity data for the signed-in UI. Begin with [your first protected app](../../start/first-app.md) and the [portal API](../api/20-portal-api.md). A client-side route guard, hidden menu item or avatar does not enforce API permissions.

## Prefer a clear browser boundary

For a same-origin application served alongside a portal under `/auth/`, the browser can send its scoped cookie to `/auth/whoami?format=json`. Request JSON explicitly and handle a denied/expired session without treating it as an empty authorized identity:

```typescript
async function readPortalIdentity(): Promise<Record<string, unknown> | undefined> {
  const response = await fetch('/auth/whoami?format=json', {
    credentials: 'same-origin',
    headers: {Accept: 'application/json'},
  });
  if (response.status === 401 || response.status === 403) return undefined;
  if (!response.ok) throw new Error('Identity request failed');
  return response.json();
}
```

Use `name`, `email`, `roles` and optional picture data to render the UI; preserve missing-field behavior. Start authentication with a top-level navigation to the portal login or provider entry point. Keep redirect destinations under the portal's configured [redirect controls](../../authorize/auto-redirect-url.md).

For cross-origin requests, use an explicit permitted origin, credentialed fetch and compatible cookie scope/SameSite settings. Wildcard CORS does not permit credentialed access, and CORS does not grant application roles. Handle OPTIONS/preflight deliberately without making the protected API public. See [cookie scope](../auth-cookie.md) and [server authorization](../../authorize/headers.md).

## Existing Angular libraries

The original integrations remain available:

- [ngx-authp-service](https://github.com/greenpau/ngx-authp-service) wraps identity retrieval and portal redirects.
- [ngx-avatar-persona](https://github.com/greenpau/ngx-avatar-persona) renders an avatar/persona menu.

Their READMEs target older portal and Angular conventions, including the retired `authp { backend ... }` Caddy grammar and `/settings` path. Those examples are not a current AuthCrunch configuration. Check package peer dependencies, your Angular version, response fields and redirect behavior before adopting them. The library links and preserved animation do not establish tested compatibility with the latest Angular release.

<figure>

![Historical Angular avatar menu opening beside a signed-in persona](./images/ngx-avatar-persona-animation.gif)

<figcaption>Historical ngx-avatar-persona demonstration. The visual remains useful as a menu example; use current portal routes and your application's access boundary.</figcaption>
</figure>

## Verify the integration

Test anonymous access, an authorized app member, a signed-in nonmember, expiry and logout. Fetch the protected API directly as the nonmember; it must deny access even if the browser UI is modified. A `whoami` probe reports expiry but does not renew it. [Refresh sessions](../30-refresh-token.md) require explicit server configuration; these older libraries do not establish an automatic renewal contract.

If the application expects a standard OIDC relying-party flow, use the released [OIDC provider](../../apps/oidc-provider.md) and its registered client/redirect/consent requirements instead of treating the portal's access JWT as an OAuth authorization-code response.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Separate UI state from access control</summary>

```text
Help me understand Angular and browser applications.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-api,
configuration-http-integrations, authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/webapps/angular

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain Angular identity display, route guards, portal login navigation, and
protected server/API handlers. Use a modified browser UI to show why an avatar
or hidden menu cannot enforce permissions. Keep whoami success separate from
an app-specific ACL grant.
```

</details>

<details>
<summary>Compare same-origin and cross-origin fetch</summary>

```text
Help me understand Angular and browser applications.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-api,
configuration-http-integrations, authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/webapps/angular

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Trace a same-origin identity request with explicit JSON selection and scoped
cookie. Compare permitted origins, credentialed fetch, SameSite, and preflight
for cross-origin use. Consult current browser/framework guidance before
prescribing CORS settings; CORS does not grant roles.
```

</details>

<details>
<summary>Diagnose identity loading</summary>

```text
Help me understand Angular and browser applications.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-api,
configuration-http-integrations, authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/webapps/angular

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me classify denied/expired session, HTML instead of JSON, absent optional
fields, wrong portal prefix, cookie delivery, and network/server failure. Ask
for redacted response metadata and framework version. Do not silently convert
every failed request into an authorized empty identity.
```

</details>

<details>
<summary>Review older integration libraries</summary>

```text
Help me understand Angular and browser applications.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-api,
configuration-http-integrations, authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/webapps/angular

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare the linked ngx-authp-service/ngx-avatar-persona README assumptions
with my current Angular and portal versions. Identify old authp grammar,
Settings route, response shape, and renewal claims that need evidence. Do not
assume the preserved animation establishes current compatibility.
```

</details>

<details>
<summary>Test the real application boundary</summary>

```text
Help me understand Angular and browser applications.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: authentication-portal-api,
configuration-http-integrations, authentication-portal-cookies.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/webapps/angular

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Design anonymous/member/nonmember, direct API request, UI tampering, expiry,
and logout cases. Explain identity probe versus renewal and when standard OIDC
relying-party integration is appropriate. Require server denial even if the
client route guard is bypassed.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28handleJSONWhoami%20OR%20AuthorizationHandler%20OR%20CookieConfig%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: plugin_authn.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authn.go)
   — mounts the portal in Caddy and delegates HTTP requests.
3. [caddy-security: plugin_authorization.go](https://github.com/greenpau/caddy-security/blob/main/plugin_authorization.go)
   — preserves handled responses and applies authorized identity in the Caddy handler chain.
4. [go-authcrunch: pkg/authn/handle_json_whoami.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_json_whoami.go)
   — returns validated identity, expiry probes, and optional upstream-token data.
5. [go-authcrunch: pkg/authn/cookie/configuration.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/cookie/configuration.go)
   — validates cookie roles, names, attributes, and prefix changes.
6. [go-authcrunch: pkg/authn/profile_session_e2e_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/profile_session_e2e_test.go)
   — tests the live-session boundary for profile access.
