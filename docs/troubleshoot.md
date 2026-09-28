---
title: Troubleshoot
description: Diagnose missing security modules, local startup failures, login redirects, and denied access in AuthCrunch.
---

# Troubleshoot

Start with the failing request and the result you expected. For the local
walkthrough, [Verify access](start/verify-access.md) lists the four expected
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
| Address already in use | Another process is listening on port 9080. Stop the earlier demo process, or choose another available port and update both the site address and policy auth URL. |
| Signing key error | Generate and export `AUTHCRUNCH_DEMO_SECRET` in the terminal that starts the server, as shown in [the walkthrough](start/first-app.md#2-prepare-the-data-and-signing-key). |
| Cannot open or create the store | Start from the demo directory. Check that its `data` directory exists and is writable by the process. |
| Caddyfile parse error | Copy the complete file, including the global block and site block. Run `adapt` to isolate parsing before attempting login. |

The demo disables Caddy's admin endpoint. To change its configuration, use
**Ctrl+C** and start it again; a reload command cannot reach a disabled endpoint.

## The browser returns to login

First distinguish a missing login from an invalid token:

1. Use `http://localhost:9080` consistently for the local example. Do not switch
   between `localhost` and `127.0.0.1`.
2. Confirm that you completed both the username and password steps. The tested
   flow lands on the portal's **Applications** page; choose **Example app** there.
3. In browser developer tools, check that the login sets a cookie and that the
   next request to `/app` sends it. Do not copy token values into public reports.
4. Confirm that the portal and policy use the same signing/verification key.
   If you regenerated the demo secret, sign in again to get a token signed with it.

For a deployed site, check the [cookie domain and path](authenticate/auth-cookie.md),
HTTPS, the policy's auth URL, and [token discovery](authorize/token-discovery.md).
A cookie that the browser does not send cannot satisfy the policy.

## Login works, but the app returns 403

For the local demo, **Bob is supposed to receive 403**. The policy requires
`app/member`, which only Alice has. This separates a successful login from a
successful authorization decision.

If Alice is denied, compare the active Caddyfile with the
[complete example](start/first-app.md#1-create-the-configuration). Check her roles
and the policy's `allow roles` entry, then test from a fresh login. If you have
been editing an existing user database, repeat the original example in a new
directory to separate stored state from configuration.

For your own deployment, compare the authenticated user's claims with the
[policy rules](authorize/acl-rbac.md). Check rule order and any
[path restrictions](authorize/path-acl.md) before changing permissions.

## The app is reachable without signing in

Test with `curl -i` without a cookie jar, or a new private browser window.
Confirm the request matches the protected route and that `authorize` runs before
the application handler. In the learning example, `/app` and `/app/*` are
protected; `/` deliberately returns a public status message.

For a reverse proxy deployment, also check that users cannot reach the upstream
application directly through another public address or port.

## There is an extra local administrator

When a new local store has no administrative user, AuthCrunch can create a
bootstrap administrator. With the demo's default environment, its username is
`webadmin` and its password is generated; the Alice and Bob tests do not use it.
Do not assume that the two configured demo accounts are the only store records.

Review [local identity store configuration](authenticate/local/20-identity-store.md)
before using local accounts in a deployment.

## Ask for help with a reproducible case

Open an [issue](https://github.com/greenpau/caddy-security/issues/new/choose) with:

- The Caddy and AuthCrunch versions and how you installed the binary.
- The expected result, actual HTTP status, and the step that failed.
- A minimal Caddyfile and the relevant server error, with secrets removed.
- Whether the [local walkthrough](start/first-app.md) works in a fresh directory.

Remove passwords, tokens, cookies, private keys, and provider secrets before
sharing configuration or logs.
