---
title: "Refresh sessions"
description: "Renew short-lived local access tokens with rotating refresh credentials, browser coordination, and explicit native-client transport."
discovery:
  topic: sessions-and-cookies
  kind: guide
  aliases: ["refresh token", "rotation", "idle timeout", "session lifetime"]
---

import CodeBlock from '@theme/CodeBlock';
import example from '@site/assets/conf/local/refresh/Caddyfile?raw';

# Refresh sessions

<span id="refresh-token" />

A refresh session lets a **local account** renew a short-lived portal access
token without repeating its password and MFA at every expiry. Each successful
renewal replaces the refresh credential. The session ends at its idle or absolute
deadline, when revoked, or when the account's security state changes.

This guide targets **caddy-security v1.3.0 / go-authcrunch v1.3.8**. Portal
refresh is separate from an upstream OAuth provider's refresh token and from
AuthCrunch's [downstream OIDC refresh grants](../apps/oidc-provider.md).

## Enable local refresh

Start with a working local portal and users who have appropriate portal and app
roles. Set `AUTHCRUNCH_SIGNING_KEY` to a private random signing secret and ensure
the service can read and update `/var/lib/authcrunch/users.json`. Replace the
example hostname and upstream with your deployment.

<CodeBlock language="caddyfile" title="assets/conf/local/refresh/Caddyfile">{example}</CodeBlock>

The example does not create a privileged application account. Give intended users
`app/member`; a portal role such as `authp/user` alone does not pass the app policy.
Use [static users](local/50-static-users.md) or the [administrative API](api/40-server-api.md)
to manage accounts.

`realms` lists attached local **realm names**, not store nicknames. Each must
identify exactly one local store. Other realms remain access-only. Password/MFA
completion supplies the evidence for a renewable session; API-key login does not.

The public origin is the exact HTTPS origin, including a nondefault port.
The base path is the portal mount before any rewriting. Here the origin is
`https://auth.example.com` and the mount is `/auth`. HTTP demo cookie settings
do not make refresh work over insecure HTTP.

## Choose lifetime and capacity

All durations use integer seconds. Omitted or zero numeric settings select
defaults. A present block defaults to enabled and requires realms, origin and
base path; omission leaves refresh disabled. An empty block is invalid.

| Setting | Default | Effect |
| --- | --- | --- |
| `access lifetime` | 300 | Maximum lifetime of each renewable access token; the signing key and remaining absolute lifetime can shorten it |
| `idle timeout` | 1800 | Time allowed until the next successful renewal; ordinary app requests do not extend it |
| `absolute timeout` | 28800 | Session deadline from the original authentication; renewal never moves it |
| `max sessions` | 10000 | Live refresh families across selected realms and transports; new logins at capacity return 503 |
| `max rotations` | 1024 | Successful renewals per family; the next attempt revokes it and requires login |
| `body transport` | `disabled` | Whether explicitly selected native JSON credential transport is allowed |

Access and idle lifetimes cannot exceed the absolute timeout; absolute timeout
cannot exceed 30 days. Short access lifetimes require a client that actually
renews. Capacity limits bound session storage; they are not request rate limits.

## Browser behavior

The access cookie follows the configured app domain/path. The refresh cookie is
always **host-only, Secure, HttpOnly, SameSite=Lax**, and scoped to the portal
mount. Its default name is `AUTHP_REFRESH_TOKEN`; common cookie-prefix settings
apply, and `cookie name` inside `token refresh` can override it. A `__Host-`
refresh-cookie name requires a root mount.

The embedded portal client coordinates refresh and logout across tabs using
Web Locks and local storage. It stores coordination metadata, not credentials.
An expired portal visit can offer continuation; `/auth/login?fresh=1` starts a
fresh login. Browsers without the required coordination support must sign in
again. Applications on other origins do not automatically acquire this client;
plan their session integration explicitly.

Browser renewal is a same-origin POST to `/auth/api/refresh_token`:

```js
const response = await fetch('/auth/api/refresh_token', {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'X-Authcrunch-Refresh': '1',
  },
  body: '{}',
});
```

This illustrates the request shape, **not a complete renewal coordinator**. A
client must serialize rotation across tabs and handle uncertain responses.
Browser requests require the exact `Origin`, JSON, the refresh header and
compatible Fetch Metadata. The response contains session/expiry metadata;
credentials are delivered as cookies. `/auth/api/refresh_session` probes the
family ID without rotating it and uses the same checks.

## Native JSON clients

Enable `body transport enabled` only for a client that needs it. Such a client
sets `"refresh_transport": "body"` on its initial JSON login **and every
challenge continuation**. It sends no Cookie, Origin, or Fetch Metadata headers.
Completed login returns access and refresh credentials in JSON and sets no
browser cookies.

Renew with this body, replacing the saved credentials atomically on success:

```json
{"refresh_token": "CURRENT_PRIVATE_REFRESH_CREDENTIAL"}
```

POST it as JSON to `/auth/api/refresh_token`. The credential is opaque, not an
access JWT to decode or send to an application. Cookie and body families cannot
be interchanged. Enabling native transport does not enable arbitrary browser
CORS. See the [Portal API](api/20-portal-api.md) for the challenge protocol.

## Replay, logout, and account changes

A refresh credential is single-use. Reusing a spent credential revokes the
family, including its current descendant. If a response is lost after the server
rotates, retrying the old credential can therefore end the session. Require a
fresh login after an uncertain exchange; do not create an automatic retry loop.

Browser GET `/auth/logout` displays confirmation when a refresh cookie exists.
The protected POST `/auth/api/logout` revokes the family before deleting cookies.
Native clients POST their current refresh credential to the same endpoint.
Successful API logout returns `{"logged_out": true}`. A storage failure returns
503 and must not be presented as successful logout.

Password, role, factor, account-status, or challenge-policy changes invalidate
the captured local identity evidence. Renewal checks current account state;
it does not simply mint another token from stale claims. Existing signed access
tokens still have their own validation and expiry behavior.

Without [persistent runtime state](../operations/runtime-state.md), restart loses
refresh families. Persistence retains their expiry and spent-credential history;
it does not extend deadlines or support multiple active owners.

## Diagnose a failed renewal

| Status | Meaning |
| --- | --- |
| 400 | Malformed or ambiguous JSON/credentials, duplicate fields, query parameters, or invalid precondition |
| 401 | Fresh authentication required: invalid, expired, revoked or replayed credential, or changed account evidence |
| 403 | Origin, mount, or transport checks failed |
| 404 | Refresh disabled or wrong endpoint/mount |
| 405 | Wrong method; renewal uses POST |
| 415 | Request is not JSON |
| 503 | Temporary signing, backend, capacity, or storage failure |

Check the configured origin and mount first. Confirm that cookies reach the
portal, the realm participates, and the client selected the right transport.
Use an isolated test account to verify renewal, expiry and logout; never replay
a live credential as a diagnostic experiment.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Separate three renewal models</summary>

```text
Help me understand Refresh sessions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-implementation, refresh-token-transports,
refresh-token-identity.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/refresh-token

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare local portal refresh families, upstream OAuth refresh tokens, and
downstream OIDC refresh grants. Trace which local realms and authentication
evidence qualify for portal renewal. Explain access lifetime, idle timeout,
absolute deadline, and rotation limits using a timeline.
```

</details>

<details>
<summary>Compare browser and body transport</summary>

```text
Help me understand Refresh sessions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-implementation, refresh-token-transports,
refresh-token-identity.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/refresh-token

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain cookies, exact Origin/mount, refresh header, and cross-tab
coordination for browsers, versus explicitly selected body transport for
native JSON login and every continuation. Show why enabling native transport
is not browser CORS and why families cannot change transports.
```

</details>

<details>
<summary>Diagnose failed renewal</summary>

```text
Help me understand Refresh sessions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-implementation, refresh-token-transports,
refresh-token-identity.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/refresh-token

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me classify malformed JSON, wrong method/media type, disabled endpoint,
origin failure, expired/replayed credential, changed account evidence, and
temporary capacity/storage failures. Ask for redacted metadata and status.
Never replay a live refresh credential as an experiment.
```

</details>

<details>
<summary>Understand uncertain rotation</summary>

```text
Help me understand Refresh sessions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-implementation, refresh-token-transports,
refresh-token-identity.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/refresh-token

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Walk through two tabs or a lost response during single-use rotation. Explain
spent-credential reuse, family revocation, atomic credential replacement, and
fresh login after uncertainty. Compare GET logout confirmation with protected
POST revocation and explain a failed-storage logout response.
```

</details>

<details>
<summary>Plan lifecycle tests</summary>

```text
Help me understand Refresh sessions.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication,
refresh-token-implementation, refresh-token-transports,
refresh-token-identity.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/refresh-token

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Design disposable-session cases for idle and absolute expiry, rotations,
password/role/factor changes, logout, restart with and without state, and a
native continuation missing its transport selection. State expected
observables without claiming existing signed access tokens are instantly
revoked.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28TokenRefreshConfig%20OR%20RefreshToken%20OR%20refresh_transport%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authn_token_refresh.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_token_refresh.go)
   — adapts the portal token-refresh block.
3. [caddy-security: caddyfile_authn_token_refresh_test.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_token_refresh_test.go)
   — tests refresh configuration and adapter boundaries.
4. [go-authcrunch: pkg/authn/token_refresh_config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/token_refresh_config.go)
   — defines refresh origins, realms, lifetimes, and transport settings.
5. [go-authcrunch: pkg/authn/handle_api_refresh_token.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/handle_api_refresh_token.go)
   — validates browser/native refresh and logout request transport.
6. [go-authcrunch: pkg/authn/token_refresh_runtime.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/token_refresh_runtime.go)
   — connects refresh rotation to current local account evidence.
7. [go-authcrunch: pkg/authn/token_refresh/manager.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/token_refresh/manager.go)
   — manages refresh families, rotation, expiry, and revocation.
8. [go-authcrunch: pkg/authn/token_refresh_browser_e2e_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/token_refresh_browser_e2e_test.go)
   — tests browser renewal, coordination, and logout journeys.
