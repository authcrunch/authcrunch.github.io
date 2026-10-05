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
