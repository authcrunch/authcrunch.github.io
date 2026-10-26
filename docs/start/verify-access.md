---
sidebar_position: 3
title: Verify access
description: "Test unauthenticated redirects, allowed and denied users, and logout in the local AuthCrunch walkthrough."
discovery:
  topic: authorization
  kind: tutorial
  aliases: ["403 Forbidden", "302", "access denied", "test login"]
---

# Verify access

A working login page is only part of the setup. Keep the server from
[Protect your first app](first-app.md) running and test these outcomes. The denied
case uses a temporary, narrower policy.

| Request | Expected result |
| --- | --- |
| No login cookie | `302` redirect toward the portal |
| Alice, with `authp/user` | `200` and the protected message |
| Bob, with `authp/user` | `200` and the protected message |
| Bob after narrowing the policy to `app/member` | `403 Forbidden` |
| Alice after signing out | A new request redirects to login |

## Check an unauthenticated request

Open a second terminal in the same `authcrunch-demo` directory. After the first
browser connection has created Caddy's local CA, run:

```sh
curl --cacert data/caddy/pki/authorities/local/root.crt \
  -i https://localhost:8443/
```

Expect status **302** (`HTTP/2 302` or `HTTP/1.1 302 Found`, depending on your
client). The `Location` header begins with
`https://localhost:8443/auth/login` and includes the original URL as `redirect_url`.
This command sends no browser cookies, so it remains an unauthenticated request
even if you are signed in in your browser. `--cacert` trusts only this invocation's
local CA file; it does not install that CA into your system trust store.

If it returns the protected message, check that `authorize with apppolicy`
appears before `respond` inside the matched route.

## Check allowed access

In a regular browser window, sign in as **alice** using the demo password
`LocalDemoPassword123!`. Starting at `/` returns you there after login;
starting directly at the portal shows Applications, where you select **Example app**.

Expect **You reached the protected app.** The browser's Network panel shows
status **200** for `/`.

Repeat in a private/incognito window as **bob**, using the same password.
Bob also receives **200**: the default policy allows `authp/admin` or `authp/user`,
and both demo users have `authp/user`.

## Check denied access

To see a successful login followed by denied application access, stop Caddy with
**Ctrl+C**. In `authorization policy apppolicy`, temporarily replace
`allow roles authp/admin authp/user` with:

```text
allow roles app/member
```

Start the demo again with `./bin/authcrunch run --config Caddyfile`. Use a fresh
private/incognito window, open `https://localhost:8443/`, and sign in as **bob**
with the same demo password. The trusted return destination sends Bob back to
the app too.

Expect **Forbidden**, with status **403** for `/`. This is a successful policy
test: Bob authenticated, but he does not have the required `app/member` role.

Alice still receives **200** after a fresh login because she has `app/member`.
If Bob reaches the app during this exercise, check that the narrower policy is
active and Caddy was restarted after the edit.

After the exercise, restore `allow roles authp/admin authp/user`, stop and start
Caddy again, and sign in as Alice in a fresh browser window before testing logout.

## Check logout

In Alice's browser window, visit
**[https://localhost:8443/auth/logout](https://localhost:8443/auth/logout)**.
Then make a new request by opening `https://localhost:8443/` again.

Expect to reach the login page. Check a fresh request rather than a previously
rendered tab or the browser's Back button. This verifies browser logout; it does
not establish that a separately copied token has been revoked.

## Stop or reset the demo

Press **Ctrl+C** in the server terminal to stop it. The demo has no Caddy admin
endpoint, so stop and start the process to apply configuration changes.

The in-memory accounts and browser-session state reset when Caddy stops. The
local CA/certificates remain under `data/caddy`, and the literal demo users/key
remain in the Caddyfile. Use a fresh browser context for a clean login test.
After stopping the server, you can delete the disposable `authcrunch-demo`
directory when you no longer need its files.

If any result differs, use the [troubleshooting checks](../troubleshoot.md).
Once these checks pass, continue to **[Next steps](next-steps.md)**.
