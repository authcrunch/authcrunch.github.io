---
sidebar_position: 3
title: Verify access
description: Test unauthenticated redirects, allowed and denied users, and logout in the local AuthCrunch walkthrough.
---

# Verify access

A working login page is only part of the setup. Keep the server from
[Protect your first app](first-app.md) running and test these four outcomes.

| Request | Expected result |
| --- | --- |
| No login cookie | `302` redirect toward the portal |
| Alice, with `app/member` | `200` and the protected message |
| Bob, without `app/member` | `403 Forbidden` |
| Alice after signing out | A new request redirects to login |

## Check an unauthenticated request

Open a second terminal and run:

```sh
curl -i http://localhost:9080/app
```

Expect `HTTP/1.1 302 Found`. The `Location` header begins with
`http://localhost:9080/auth/` and includes the original URL as `redirect_url`.
This command sends no browser cookies, so it remains an unauthenticated request
even if you are signed in in your browser.

If it returns the protected message, check that `authorize with apppolicy`
appears before `respond` inside the matched route.

## Check allowed access

In a regular browser window, sign in as **alice** using the demo password
`LocalDemoPassword123!`. Select **Example app** on the Applications page.

Expect **You reached the protected app.** The browser's Network panel shows
status **200** for `/app`.

## Check denied access

Use a separate private/incognito window so Alice's cookie cannot affect this
test. Open `http://localhost:9080/auth/`, sign in as **bob** with the same demo
password, and select **Example app**.

Expect **Forbidden**, with status **403** for `/app`. This is a successful policy
test: Bob authenticated, but he does not have the required `app/member` role.

If Bob reaches the app, check the policy and his configured roles. A rule that
allows `authp/user` would admit both demo users. Do not broaden the rule simply
to make a denied request succeed.

## Check logout

In Alice's browser window, visit
**[http://localhost:9080/auth/logout](http://localhost:9080/auth/logout)**.
Then make a new request by opening `http://localhost:9080/app` again.

Expect to reach the login page. Check a fresh request rather than a previously
rendered tab or the browser's Back button. This verifies browser logout; it does
not establish that a separately copied token has been revoked.

## Stop or reset the demo

Press **Ctrl+C** in the server terminal to stop it. The demo has no Caddy admin
endpoint, so stop and start the process to apply configuration changes.

The user database survives in `data/users.json`. A fresh test should use a new
demo directory and a newly generated `AUTHCRUNCH_DEMO_SECRET`. After stopping
the server, you can delete the disposable `authcrunch-demo` directory when you
no longer need its files.

If any result differs, use the [troubleshooting checks](../troubleshoot.md).
Once all four pass, continue to **[Next steps](next-steps.md)**.
