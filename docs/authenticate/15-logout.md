---
description: "Configure trusted logout redirects and distinguish portal logout from provider logout."
discovery:
  topic: sessions-and-cookies
  kind: guide
  aliases: ["sign out", "redirect_uri"]
---

# Logout

For a portal mounted at `/auth/`, sign out at `/auth/logout`. What is revoked
depends on the credential model:

| Model | Result |
| --- | --- |
| Ordinary portal JWT | Clears browser credentials; an independently copied JWT may remain valid until expiry |
| Local refresh session | GET displays confirmation; the protected POST revokes the refresh family and clears its cookies |
| AuthCrunch OIDC provider | Revokes its browser-backed OIDC state as implemented; relying parties also need their own session cleanup |
| Direct OAuth policy | Same-origin POST to the policy's logout path revokes its opaque local session |
| External provider SSO | Remains active unless the configured provider logout flow completes |

Use the built-in sign-out action for browser refresh sessions. Custom clients
must follow [refresh logout](30-refresh-token.md); a GET alone does not revoke
that family. Direct policies use the separate [direct OAuth contract](../authorize/direct-oauth.md).

## Logout with Redirect URL Query Parameter

An ordinary portal logout can accept an encoded `redirect_uri` destination only
when it matches a configured trust rule. For example, inside the portal:

```caddyfile
trust logout redirect uri domain exact app.example.com path exact /signed-out
```

The corresponding request is:

```text
https://auth.example.com/auth/logout?redirect_uri=https%3A%2F%2Fapp.example.com%2Fsigned-out
```

Untrusted destinations do not become redirects. Domain matching includes an
explicit port when present; `app.example.com:8443` is a different value.
Login uses `redirect_url`, whereas logout uses `redirect_uri`.
[Trusted redirects](100-trust-login-logout.md) explains matching and tests.
Do not assume this query replaces the protected refresh-logout POST or an OIDC
relying party's own logout protocol.

## External Endpoint Logout

OAuth providers have a separate logout route, such as `/auth/oauth2/upstream/logout`.
The portal clears local credentials and may send the browser to the upstream
logout URL. This is a browser redirect, not proof that all upstream sessions,
access tokens or other applications have been revoked.

### Manual Logout URL

Configure the **identity provider definition**, then enable its nickname in the
portal. Do not nest a provider definition inside `enable identity provider`:

```caddyfile
security {
    oauth identity provider upstream {
        driver generic
        realm upstream
        client_id {env.OIDC_CLIENT_ID}
        client_secret {env.OIDC_CLIENT_SECRET}
        base_auth_url https://identity.example.com
        metadata_url https://identity.example.com/.well-known/openid-configuration
        scopes openid email profile
        logout_url https://identity.example.com/logout
    }
    authentication portal myportal {
        enable identity provider upstream
    }
}
```

A nonempty `logout_url` enables external logout. With a driver-specific provider,
the released handler still applies that driver's redirect-parameter behavior to
a manually configured URL. It does **not** universally use a manual URL unchanged.
Avoid supplying an already assembled query to a driver that appends `?`.

### OAuth Driver Support

The released handler applies the following operations to its configured URL:

| Driver | Added parameter |
| --- | --- |
| `google` | `?continue=` plus the encoded portal logout URL |
| `azure`, `gitlab`, `okta` | `?post_logout_redirect_uri=` plus that URL |
| `cognito` | `&logout_uri=` plus that URL; the configured URL already includes the client ID |
| `github` | None |
| `generic`, `facebook`, `discord`, `linkedin`, `nextcloud` | No driver-specific parameter appended |

These are AuthCrunch handler behaviors, not a guarantee that the provider accepts
the resulting request. Check the provider's current logout requirements and
registered return URLs. Some OIDC providers require an ID-token hint that this
redirect alone does not supply.

Use `enable logout` in the provider block when relying on its driver's configured
logout URL. Without that flag or a nonempty manual URL, logout returns locally
to login. A matching trusted `redirect_uri` on the external logout route takes
precedence over the upstream redirect. Test local access after sign-out and a
new provider login separately: immediate SSO may simply mean the upstream browser
session still exists.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Compare logout effects</summary>

```text
Help me understand Logout.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-transports, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/logout

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare ordinary portal JWT logout, a refresh family, AuthCrunch OIDC state,
direct OAuth local session, and upstream provider SSO. Explain which browser
credentials and server state each action affects and which copied tokens or
relying-party sessions may survive.
```

</details>

<details>
<summary>Read the redirect parameters</summary>

```text
Help me understand Logout.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-transports, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/logout

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain trusted logout redirect_uri separately from login redirect_url. Use a
synthetic fixed landing page and explicit port. Show how destination trust
relates to navigation, not to revoking additional credentials or replacing
protected refresh logout.
```

</details>

<details>
<summary>Diagnose immediate sign-in again</summary>

```text
Help me understand Logout.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-transports, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/logout

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me investigate why provider login succeeds immediately after local
logout. Separate local cookie cleanup, protected family revocation, upstream
SSO, and provider logout registration. Ask for redacted routing/status; do not
infer provider-wide revocation from a browser redirect.
```

</details>

<details>
<summary>Review a provider logout URL</summary>

```text
Help me understand Logout.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-transports, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/logout

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain driver-specific query handling for a manually supplied logout_url and
enable logout. Check the AuthCrunch handler and current official provider
requirements before constructing an example. Include registered return URLs
and possible token-hint requirements; never assume all drivers append the same
parameter.
```

</details>

<details>
<summary>Test sign-out boundaries</summary>

```text
Help me understand Logout.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-transports, oauth-identity-provider.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/logout

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Build a matrix for ordinary browser logout, refresh GET versus POST, failed
revocation storage, direct-policy logout, trusted/untrusted landing targets,
and subsequent app access. Use disposable sessions and explain what each
observation proves about local versus upstream authority.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28handleHTTPLogout%20OR%20handleExternalHTTPLogout%20OR%20logout_url%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authn_misc.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_misc.go)
   — parses portal options, selections, and trusted redirect rules.
3. [go-authcrunch: pkg/authn/handle_http_logout.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_http_logout.go)
   — handles local browser logout and refresh confirmation.
4. [go-authcrunch: pkg/authn/handle_external_http_logout.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_external_http_logout.go)
   — builds provider logout redirects with driver-specific behavior.
5. [go-authcrunch: pkg/authn/handle_http_logout_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_http_logout_test.go)
   — tests portal logout responses and destinations.
6. [go-authcrunch: pkg/authn/handle_external_http_logout_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_external_http_logout_test.go)
   — tests manual and driver-specific external logout URLs.
7. [go-authcrunch: pkg/authn/handle_api_refresh_token.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_api_refresh_token.go)
   — validates browser/native refresh and logout request transport.
