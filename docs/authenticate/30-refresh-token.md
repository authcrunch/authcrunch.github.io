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
