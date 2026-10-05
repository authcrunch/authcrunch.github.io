---
title: "Facebook"
description: "Understand the released Facebook driver compatibility limit, callback and credential requirements, and historical setup screens."
discovery:
  topic: identity-providers
  kind: guide
---

import CodeBlock from '@theme/CodeBlock';
import example from '@site/assets/conf/oauth/facebook/Caddyfile?raw';

# Facebook

:::warning[Released driver compatibility limit]

The bundled Facebook driver hard-codes `v12.0` authorization, token, and Graph
profile endpoints. Its configuration overwrites the authorization/token URLs;
changing `base_auth_url` does not upgrade those calls. This page preserves the
integration reference, but it does **not** establish compatibility with Meta's
current Graph API. Verify support with Meta before relying on it for a new
production deployment. A parser check cannot resolve this upstream limitation.

:::

## Application and callback reference

For a compatible deployment, register a server-side Facebook Login application
in the [Meta developer dashboard](https://developers.facebook.com/apps/), keep
its App Secret on the server, and use the exact authorized redirect:

```text
https://auth.example.com/auth/oauth2/facebook/authorization-code-callback
```

The App Secret is the confidential OAuth credential. A Client Token or browser
SDK app identifier is not a substitute. The named driver calculates an
`appsecret_proof` for the Graph profile request. Consult
[Meta's web login guide](https://developers.facebook.com/docs/facebook-login/web/)
and [API version policy](https://developers.facebook.com/docs/graph-api/changelog/versions/)
for current application, permission, and version requirements. The old wizard's
app-type labels are historical.

<figure className="doc-screenshot">

[![Historical valid OAuth redirect field; the current example uses the public /auth mount.](../images/oauth2_facebook_app_login_settings_screen.png)](../images/oauth2_facebook_app_login_settings_screen.png)

<figcaption>Historical valid OAuth redirect field; the current example uses the public /auth mount.</figcaption>
</figure>
<details className="screenshot-gallery">
<summary>Preserved Facebook setup and consent screens</summary>

<figure className="doc-screenshot">

[![Historical developer application list.](../images/oauth2_facebook_apps_screen.png)](../images/oauth2_facebook_apps_screen.png)

<figcaption>Historical developer application list.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical connected-experiences app-type wizard; current app selection can differ.](../images/oauth2_facebook_apps_type_choice_screen.png)](../images/oauth2_facebook_apps_type_choice_screen.png)

<figcaption>Historical connected-experiences app-type wizard; current app selection can differ.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical application name and contact fields.](../images/oauth2_facebook_apps_name_choice_screen.png)](../images/oauth2_facebook_apps_name_choice_screen.png)

<figcaption>Historical application name and contact fields.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical Facebook Login product selection.](../images/oauth2_facebook_app_screen.png)](../images/oauth2_facebook_app_screen.png)

<figcaption>Historical Facebook Login product selection.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical App Secret proof requirement and client-token fields; do not reuse pictured values.](../images/oauth2_facebook_app_settings_advanced_screen.png)](../images/oauth2_facebook_app_settings_advanced_screen.png)

<figcaption>Historical App Secret proof requirement and client-token fields; do not reuse pictured values.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical private App Secret access with an account confirmation prompt.](../images/oauth2_facebook_app_settings_basic_screen.png)](../images/oauth2_facebook_app_settings_basic_screen.png)

<figcaption>Historical private App Secret access with an account confirmation prompt.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical user consent screen; consent does not grant AuthCrunch application roles.](../images/oauth2_facebook_user_login_screen.png)](../images/oauth2_facebook_user_login_screen.png)

<figcaption>Historical user consent screen; consent does not grant AuthCrunch application roles.</figcaption>
</figure>

</details>
## Released configuration reference

<CodeBlock language="caddyfile" title="assets/conf/oauth/facebook/Caddyfile">{example}</CodeBlock>
Replace the client values and private signing key in the server environment.
`FACEBOOK_ALLOWED_SUB` expands at parse time and must be the exact app-scoped
account ID returned by this integration. The example resets provider roles and
grants `app/member` only to that subject. It does not grant portal administration
by email or allow every Facebook identity into the application.

Facebook access tokens are opaque to this driver; it retrieves the profile
through the provider rather than treating them as signed OIDC ID tokens. PKCE
and nonce are disabled for this named driver. Email can be absent even when
requested, so decide explicitly whether the application's subject-based identity
permits disabling the default email claim check.

## Compatibility verification

Before deployment, test code exchange, Graph profile retrieval, application
assignment/permissions, exact subject mapping, and a nonmember's rejection.
If a retired endpoint or provider permission blocks the flow, a Caddyfile
rewrite is not evidence of a repaired upstream implementation. Use another
[documented provider](10-oauth2.md) that meets your deployment requirements.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Inspect compatibility before setup</summary>

```text
Help me understand Facebook.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0008-facebook

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Audit the installed Facebook driver’s hard-coded API versions and endpoint
override behavior. Compare them with current official Meta support policy
before proposing a deployment. Explain why parsing or an authorization
redirect is not evidence of successful modern profile retrieval.
```

</details>

<details>
<summary>Distinguish Facebook credentials</summary>

```text
Help me understand Facebook.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0008-facebook

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain App ID, confidential App Secret, Client Token, and user access token
in this named driver. Trace appsecret_proof and profile lookup. Use fake
values and keep real secrets out of browser code, screenshots, and logs.
```

</details>

<details>
<summary>Compare identity trust models</summary>

```text
Help me understand Facebook.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0008-facebook

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain this driver’s opaque-token/profile path versus generic OIDC signed
identity tokens. Inspect actual PKCE, nonce, state, and email behavior for my
release. Do not invent an ID token or automatically weaken a different driver
to match Facebook defaults.
```

</details>

<details>
<summary>Diagnose without inventing compatibility</summary>

```text
Help me understand Facebook.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0008-facebook

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me classify unsupported API version, callback registration,
permission/app-review restrictions, profile error, absent email, and app-role
denial. Ask for redacted response metadata and consult official Meta
requirements. Leave unsupported behavior explicitly unresolved.
```

</details>

<details>
<summary>Design a compatibility gate</summary>

```text
Help me understand Facebook.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-oauth-providers,
oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/oauth/backend-oauth2-0008-facebook

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Create a go/no-go checklist that requires live profile retrieval and
member/nonmember access, not only adaptation. Include secret handling,
missing-email policy, exact subject mapping, and logout/session limits.
Explain which upstream change would be needed if the named driver’s endpoints
are obsolete.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28facebook%20OR%20appsecret_proof%20OR%20v12.0%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_identity_provider_oauth.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_identity_provider_oauth.go)
   — adapts OAuth/OIDC provider settings, scopes, endpoints, and trust options.
3. [go-authcrunch: pkg/idp/oauth/config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/idp/oauth/config.go)
   — validates generic and named-driver defaults and endpoint settings.
4. [go-authcrunch: pkg/idp/oauth/user.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/idp/oauth/user.go)
   — fetches and normalizes named-provider profile, membership, and identity data.
5. [go-authcrunch: pkg/idp/oauth/authenticate.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/idp/oauth/authenticate.go)
   — handles authorization callbacks, token exchange, and identity completion.
6. [go-authcrunch: pkg/idp/oauth/config_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/idp/oauth/config_test.go)
   — tests generic/named provider configuration and validation.
