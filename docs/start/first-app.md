---
sidebar_position: 2
title: Protect your first app
description: "Run a local AuthCrunch portal and protect a response with a role-based policy, using a complete tested Caddyfile."
discovery:
  topic: authorization
  kind: tutorial
  aliases: ["getting started", "first setup", "local users", "authenticate", "authorize"]
---

import CodeBlock from '@theme/CodeBlock';
import caddyfile from '@site/assets/conf/getting-started/Caddyfile?raw';

# Protect your first app

You will run a login portal at `https://localhost:8443/auth/` and protect `/`
with a role check. Caddy serves a short message as the example application, so
you can learn the access flow without setting up another server.

Complete [Install and verify](install.md) first. This example is tested with
the AuthCrunch **v1.5.0** distribution, caddy-security **v1.5.0** and
go-authcrunch **v1.4.1**.

:::warning[Local learning example]

This configuration includes two public demo passwords and a published signing secret.
It uses HTTPS with a local certificate and binds to `127.0.0.1`. It is intended
for a disposable local directory. Read
[Next steps](next-steps.md) before adapting it for a deployment.

:::

## 1. Create the configuration

In your `authcrunch-demo` directory, create a file named `Caddyfile` with the
following contents. The same file is available in the
[examples directory](https://github.com/authcrunch/authcrunch.github.io/blob/main/assets/conf/getting-started/Caddyfile).

It adapts the distribution's
[end-to-end login Caddyfile](https://github.com/authcrunch/authcrunch/blob/main/assets/e2e-login/Caddyfile)
with literal values, port 8443 and two local users.
No environment variables or separate application files are required.

<CodeBlock language="text" title="Caddyfile">{caddyfile}</CodeBlock>

The two users share a demo password and can both access the app:

| User | Password | Roles | Expected app access |
| --- | --- | --- | --- |
| `alice` | `LocalDemoPassword123!` | `authp/user`, `app/member` | Allowed |
| `bob` | `LocalDemoPassword123!` | `authp/user` | Allowed |

The policy accepts `authp/admin` or `authp/user`. Alice's additional `app/member`
role is used in the narrower-policy exercise on the next page.

The local store hashes the configured passwords when creating its user records.
The clear-text examples remain in your Caddyfile, so use these credentials only
for this demo.

<span id="2-prepare-the-data-and-signing-key" />

## 2. Prepare local storage

```sh
mkdir -p data
```

The Caddyfile contains the same literal demo key in the portal's signing and
policy's verification settings. Access tokens last at most 300 seconds.
Use this published demo secret only for the local exercise.

Users live in memory (`path :memory:`) and reset when the process stops.
Caddy keeps its local CA and certificates under `data/caddy`, relative to the
directory from which you start the process. No user database is written there.

## 3. Check and run

```sh
./bin/authcrunch adapt --adapter caddyfile --config Caddyfile >/dev/null
./bin/authcrunch run --config Caddyfile
```

Adaptation checks whether Caddy can parse the configuration. The second command
starts the server in the foreground and provisions the local user store.
Leave it running while you use the browser.

Open **[https://localhost:8443/](https://localhost:8443/)**. Caddy asks the
loopback approval endpoint on port 5555 to approve `localhost`, then issues its
local certificate. The endpoint returns 400 for other or missing domains.

The browser will warn that the local CA is untrusted because `skip_install_trust`
prevents automatic changes to your trust store. For this local demo, use the
browser's advanced option to continue to `https://localhost:8443`. You should
then reach the login page. Keep `localhost` consistently in the address; cookies
and certificate trust do not transfer to `127.0.0.1`.

## 4. Sign in as Alice

1. Enter **alice** on the login page and proceed.
2. Enter **LocalDemoPassword123!** and submit the password form.
3. The trusted return destination takes you back to `/` automatically. If you
   started directly at the portal, select **Example app** on its Applications page.

The app should display:

```text
You reached the protected app.
```

Alice's token contains `authp/user`, which the policy permits. Bob has that role
too. The next page checks both logins and shows how a narrower rule denies Bob.

## What you should see

These screenshots come from a Playwright run of the **exact Caddyfile above**
with the v1.5.0 distribution on October 26, 2026. Both desktop and mobile Chromium
completed the username/password flow, reached the app, and required login again
after signing out. Select an image to see it at full size.

<div className="doc-screen-pair">
<figure className="doc-screenshot">
  <a href="/img/first-app/username.png"><img src="/img/first-app/username.png" alt="AuthCrunch Sign In form asking for a username or email address, with a Proceed button." width="580" height="437" loading="lazy" /></a>
  <figcaption><strong>1. Identify the user.</strong> Opening <code>/</code> without a login cookie returns HTTP 302 and takes you to this form. Enter <code>alice</code>, then select <strong>Proceed</strong>.</figcaption>
</figure>
<figure className="doc-screenshot">
  <a href="/img/first-app/password.png"><img src="/img/first-app/password.png" alt="AuthCrunch Authentication form with a masked password and an Authenticate button." width="580" height="437" loading="lazy" /></a>
  <figcaption><strong>2. Complete the challenge.</strong> Enter the demo password and select <strong>Authenticate</strong>. A successful password check issues the named access and session cookies.</figcaption>
</figure>
</div>

<details className="screenshot-gallery">
<summary>Continue through the app, Applications page, and sign-out</summary>

<figure className="doc-screenshot">
  <a href="/img/first-app/application.png"><img src="/img/first-app/application.png" alt="The root application displays You reached the protected app." width="720" height="180" loading="lazy" /></a>
  <figcaption><strong>3. Reach the protected app.</strong> The browser returns to <code>https://localhost:8443/</code> with HTTP 200. This plain response is the complete demo application. Bob reaches the same response because both users have <code>authp/user</code>.</figcaption>
</figure>
<div className="doc-screen-pair">
<figure className="doc-screenshot">
  <a href="/img/first-app/applications.png"><img src="/img/first-app/applications.png" alt="The authenticated Applications page contains Example app and Sign Out links." width="580" height="394" loading="lazy" /></a>
  <figcaption><strong>4. Open the portal.</strong> Visit <code>/auth/</code> while signed in. <strong>Example app</strong> links to <code>/</code>. Select <strong>Sign Out</strong> to end this browser login.</figcaption>
</figure>
<figure className="doc-screenshot">
  <a href="/img/first-app/signed-out.png"><img src="/img/first-app/signed-out.png" alt="The username form appears again after signing out and requesting the app." width="580" height="437" loading="lazy" /></a>
  <figcaption><strong>5. Check a fresh request.</strong> Open <code>/</code> again. It redirects to login instead of returning the protected response. The test also verifies that the browser access cookie was removed.</figcaption>
</figure>
</div>

</details>

<details className="screenshot-gallery">
<summary>See the incorrect-password result and the mobile layout</summary>

<figure className="doc-screenshot">
  <a href="/img/first-app/wrong-password.png"><img src="/img/first-app/wrong-password.png" alt="Authentication Failed page explains that credentials could not be verified and offers Try Again." width="580" height="410" loading="lazy" /></a>
  <figcaption><strong>An incorrect password is rejected.</strong> The password submission returns HTTP 401 and issues no access cookie. <strong>Try Again</strong> returns to login; a new app request still requires authentication.</figcaption>
</figure>
<div className="doc-screen-pair">
<figure className="doc-screenshot">
  <a href="/img/first-app/mobile-username.png"><img src="/img/first-app/mobile-username.png" alt="The AuthCrunch username form in a 390-pixel-wide mobile Chromium viewport." width="390" height="844" loading="lazy" /></a>
  <figcaption><strong>Mobile sign-in.</strong> The same username and password flow works at 390 × 844 pixels with touch emulation.</figcaption>
</figure>
<figure className="doc-screenshot">
  <a href="/img/first-app/mobile-applications.png"><img src="/img/first-app/mobile-applications.png" alt="Mobile Applications page with full-width Example app and Sign Out links." width="390" height="844" loading="lazy" /></a>
  <figcaption><strong>Mobile Applications.</strong> The app and sign-out links remain usable on the narrow layout.</figcaption>
</figure>
</div>

</details>

The browser run also checked access after a reload and in another tab, nested
app paths, a token with an altered signature, and the `AUTHTEST` cookie names
with Secure, HttpOnly, SameSite=Lax, and path `/`. Browser automation accepted
the demo's local CA warning; curl separately verified its certificate chain.
Mobile coverage is Chromium emulation. Browser logout does not establish
revocation of an independently copied token.

## How the configuration fits together

The global `security` block defines named building blocks. The site block
connects those names to HTTP routes.

| Configuration | Purpose |
| --- | --- |
| `local identity store localdb` with `path :memory:` | Creates the two demo users in memory |
| `enable identity store localdb` | Gives `myportal` a login source |
| `route /auth*` with `authenticate with myportal` | Serves the portal separately from the protected app |
| `set auth url https://localhost:8443/auth/login` | Tells the policy where to send a browser that needs to log in |
| `crypto key sign-verify` / `crypto key verify` | Connects the token issuer and verifier using the same secret |
| `trust login redirect uri …` | Permits returning to `/` and its descendants on `localhost:8443` |
| `cookie guess domain enabled` / `cookie prefix AUTHTEST` | Infers the cookie domain and gives portal cookies the `AUTHTEST` prefix |
| `set session_id cookie name …` / `set access_token cookie name …` | Makes the policy read the portal's `AUTHTEST_SESSION_ID` and `AUTHTEST_ACCESS_TOKEN` cookies |
| `tls internal { on_demand }` | Issues a local certificate after the loopback endpoint approves the hostname |
| `allow roles authp/admin authp/user` | Allows either portal role, including both demo users |
| `authorize with apppolicy` | Checks access before the protected response |

The `/healthz`, `/auth*`, and `/*` route blocks keep the public health check,
portal, and protected application separate. Caddy selects the more specific
health and portal routes before the catch-all app route. Inside the app route,
`authorize` runs before `respond`; the app's response is reached only after the
policy allows the request. It covers `/` and all remaining application paths.

The portal's cookie prefix and the policy's cookie names must agree. The portal
uses the default cookie path.

HTTPS allows the portal to use Secure cookies. The approval site at
`http://localhost:5555` only approves certificate names; it does not serve login
or the app. `auto_https disable_redirects` avoids an extra HTTP redirect listener.
`admin off` disables Caddy's administration endpoint, and `persist_config off`
disables its saved configuration. Use
**Ctrl+C** to stop this foreground demo; do not use `caddy reload` with it.

Continue to **[Verify access](verify-access.md)** before changing the example.
