---
title: Troubleshoot
description: "Diagnose missing security modules, local startup failures, login redirects, and denied access in AuthCrunch."
discovery:
  topic: operations
  kind: troubleshooting
  aliases: ["403 Forbidden", "access denied", "error", "login loop", "restart"]
---

# Troubleshoot

Start with the failing request and the result you expected. For the local
walkthrough, [Verify access](start/verify-access.md) lists the expected
outcomes and how to reproduce each one.

## Caddy does not recognize `security` or `authenticate`

Run `list-modules` against the **same executable** you use to start the server.
It must include `security`, `http.handlers.authentication`, and
`http.handlers.authorization`. A standard Caddy build does not include them.

Follow [Install and verify](start/install.md). If the module is present but a
subdirective is rejected, record `security version` and compare the configuration
with that release. An example for another version may use removed syntax.

## The local demo will not start

Read the first startup error in the server terminal.

| Observation | Check |
| --- | --- |
| Address already in use | Check port 8443 for HTTPS and port 5555 for certificate approval. Stop the earlier demo process, or update all matching addresses, auth/return URLs and the `ask` URL when changing ports. |
| Signing key error | Restore the same literal demo key in both crypto directives from [the complete example](start/first-app.md#1-create-the-configuration). No environment variable is required. |
| Cannot create TLS storage | Start from the demo directory. Check that `data` is writable. Demo identities use memory; certificates and the local CA use `data/caddy`. |
| Certificate warning or curl trust error | The demo leaves the system trust store unchanged. Accept the local browser warning for `https://localhost:8443`, or use curl's `--cacert` with the generated CA as shown in [Verify access](start/verify-access.md). |
| Certificate approval fails | Check that `http://localhost:5555/?domain=localhost` returns 200 and another or missing domain returns 400. Keep the approval endpoint bound to loopback. |
| Caddyfile parse error | Copy the complete file, including the global block and site block. Run `adapt` to isolate parsing before attempting login. |

The demo disables Caddy's admin endpoint. To change its configuration, use
**Ctrl+C** and start it again; a reload command cannot reach a disabled endpoint.

## The browser returns to login

First distinguish a missing login from an invalid token:

1. Use `https://localhost:8443` consistently for the local example. Do not switch
   between `localhost` and `127.0.0.1`.
2. Confirm that you completed both the username and password steps. Starting at
   `/` returns there automatically; starting at the portal offers **Example app**
   on the Applications page.
3. In browser developer tools, check that the login sets a cookie and that the
   next request to `/` sends `AUTHTEST_ACCESS_TOKEN` and `AUTHTEST_SESSION_ID`.
   The portal's `AUTHTEST` prefix must agree with the policy's cookie names.
   Do not copy token values into public reports.
4. Confirm that the portal and policy use the same signing/verification key.
   If you changed the demo key, sign in again to get a token signed with it.

For a deployed site, check the [cookie domain and path](authenticate/auth-cookie.md),
HTTPS, the policy's auth URL, and [token discovery](authorize/token-discovery.md).
A cookie that the browser does not send cannot satisfy the policy.

## Login works, but the app returns 403

The default local-demo policy allows `authp/admin` or `authp/user`, so both Alice
and Bob should reach the app. Bob receives **403** only during the
[narrower-policy exercise](start/verify-access.md#check-denied-access), where
`app/member` is required and only Alice has it. This separates a successful login
from a successful authorization decision.

If Alice is denied, compare the active Caddyfile with the
[complete example](start/first-app.md#1-create-the-configuration). Check her roles
and the policy's `allow roles` entry, then test from a fresh login. If you have
changed the in-memory demo accounts, restart Caddy and repeat with a fresh
browser context to separate old cookies from the active configuration.

For your own deployment, compare the authenticated user's claims with the
[policy rules](authorize/acl-rbac.md). Check rule order and any
[path restrictions](authorize/path-acl.md) before changing permissions.

## The app is reachable without signing in

Test with `curl -i` without a cookie jar, or a new private browser window.
Confirm the request matches the protected route and that `authorize` runs before
the application handler. In the learning example, the `/*` route protects `/`
and its application paths. The more specific `/auth*` route serves the portal,
and `/healthz` deliberately returns a public status message.

For a reverse proxy deployment, also check that users cannot reach the upstream
application directly through another public address or port.

## There is an extra local administrator

When a new local store has no administrative user, AuthCrunch can create a
bootstrap administrator. With the demo's default environment, its username is
`webadmin` and its password is generated; the Alice and Bob tests do not use it.
Do not assume that the two configured demo accounts are the only store records.

Review [local identity store configuration](authenticate/local/20-identity-store.md)
before using local accounts in a deployment.

## An external provider redirects back but login fails

Check the callback for the configured **realm**, not merely the provider's
configuration name. The public origin and portal mount must agree with the
registered callback. Inspect the specific failed trust check before changing
scopes or retries.

| Observation | Follow-up |
| --- | --- |
| Discovery fails or the provider is not ready | Verify DNS, certificate trust and copied discovery URL; [startup/retry settings](authenticate/oauth/82-backend-oauth2-endpoint.md) are separate from code-exchange retry |
| OIDC issuer, audience, nonce or signing key fails | Compare the actual issuer/client and [upstream token trust](authenticate/oauth/83-oidc-trust.md); the accepted metadata-disable flag does not suppress a configured fetch |
| Login succeeds but a group grants unexpected app access | Clear reserved internal roles before controlled [transforms](authenticate/42-user-transforms.md); inspect the driver's actual claim source |
| A SAML POST lacks usable state | Start from the portal GET entrance, preserve RelayState and use HTTPS; check the [bound SAML flow](authenticate/saml/10-saml.md), callback and dedicated cookie |
| Nextcloud redirects but no identity is created | The [native Nextcloud driver boundary](authenticate/oauth/81-backend-oauth2-0014-nextcloud.md) is incomplete; an opaque access token is not a portal identity |

Do not disable signature/nonce checks or add app permissions to conceal a
provider setup failure. Test a fresh valid login and a signed-in nonmember.

## Registration or email behaves differently from the template

Email acknowledgement writes a separate registration dropbox; it does not
create an active account. Check [registration](authenticate/local/40-user-registration.md)
for confirmation failure, replay and administrative delivery behavior.

The released [messaging transport](messaging/intro.md) uses embedded registration
templates even when a custom path is configured. SMTP requires the correct
plaintext/implicit-TLS mode; it does not upgrade with STARTTLS. A BCC header
does not add a delivery recipient in this implementation. Verify actual delivery
with private test recipients instead of assuming parser acceptance proves it.

## A feature is visible in source but missing from my binary

Compare the integration revision, bundled library and compiled modules with
[Feature availability](operations/versions.md). New library APIs, accepted
configuration names and partial handlers do not all establish a working Caddy
integration. For example, [AWS SSO](apps/sso_saml.md) has metadata/menu support
without an implemented assume-role assertion, while [certificate login](authenticate/x509/x509.md)
is separate from Caddy's transport-level mutual TLS.

## Ask for help with a reproducible case

For renewable local sessions, check the status table in
[Refresh sessions](authenticate/30-refresh-token.md#diagnose-a-failed-renewal).
For a restart or storage error, check the ownership, permissions and stop/start
requirements in [Persistent runtime state](operations/runtime-state.md).
Use [Authentication logging](operations/logging.md) to capture a relevant
diagnostic without changing the access decision.

Open an [issue](https://github.com/greenpau/caddy-security/issues/new/choose) with:

- The Caddy and AuthCrunch versions and how you installed the binary.
- The expected result, actual HTTP status, and the step that failed.
- A minimal Caddyfile and the relevant server error, with secrets removed.
- Whether the [local walkthrough](start/first-app.md) works in a fresh directory.

Remove passwords, tokens, cookies, private keys, and provider secrets before
sharing configuration or logs.
