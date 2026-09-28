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

You will run a login portal at `http://localhost:9080/auth/` and protect `/app`
with a role check. Caddy serves a short message as the example application, so
you can learn the access flow without setting up another server.

Complete [Install and verify](install.md) first. This example is tested with
caddy-security **v1.3.0** and go-authcrunch **v1.3.8**.

:::warning[Local learning example]

This configuration uses HTTP and two public demo passwords. It binds to
`127.0.0.1` and is intended for a disposable local directory. Read
[Next steps](next-steps.md) before adapting it for a deployment.

:::

## 1. Create the configuration

In your `authcrunch-demo` directory, create a file named `Caddyfile` with the
following contents. The same file is available in the
[examples directory](https://github.com/authcrunch/authcrunch.github.io/blob/main/assets/conf/getting-started/Caddyfile).

<CodeBlock language="text" title="Caddyfile">{caddyfile}</CodeBlock>

The two users share a demo password but have different application permissions:

| User | Password | Roles | Expected app access |
| --- | --- | --- | --- |
| `alice` | `LocalDemoPassword123!` | `authp/user`, `app/member` | Allowed |
| `bob` | `LocalDemoPassword123!` | `authp/user` | Denied |

The local store hashes the configured passwords when creating its user records.
The clear-text examples remain in your Caddyfile, so use these credentials only
for this demo.

## 2. Prepare the data and signing key

```sh
mkdir -p data
export AUTHCRUNCH_DEMO_SECRET="$(openssl rand -hex 32)"
```

The portal signs tokens with this generated secret; the policy uses the same
secret to verify them. Keep this terminal open for the next command.
`{env.AUTHCRUNCH_DEMO_SECRET}` reads the variable when AuthCrunch starts.

The store creates `data/users.json` on first startup. Caddy's own storage is
also contained under `data/caddy`. All these paths are relative to the directory
from which you start the process.

## 3. Check and run

```sh
./bin/authcrunch adapt --adapter caddyfile --config Caddyfile >/dev/null
./bin/authcrunch run --config Caddyfile
```

Adaptation checks whether Caddy can parse the configuration. The second command
starts the server in the foreground and provisions the local user store.
Leave it running while you use the browser.

Open **[http://localhost:9080/app](http://localhost:9080/app)**. You should reach
the login page. Use `localhost` consistently; the site is configured for that
hostname, and cookies for `localhost` do not also belong to `127.0.0.1`.

## 4. Sign in as Alice

1. Enter **alice** on the login page and proceed.
2. Enter **LocalDemoPassword123!** and submit the password form.
3. On the portal's **Applications** page, select **Example app**.

The app should display:

```text
You reached the protected app.
```

Alice's token contains `app/member`, which the policy permits. Bob can also sign
in, but his token lacks that role. The next page tests this distinction.

## How the configuration fits together

The global `security` block defines named building blocks. The site block
connects those names to HTTP routes.

| Configuration | Purpose |
| --- | --- |
| `local identity store localdb` | Creates the two demo users in a local database |
| `enable identity store localdb` | Gives `myportal` a login source |
| `authenticate /auth/* with myportal` | Serves the portal under `/auth/` |
| `set auth url http://localhost:9080/auth/` | Tells the policy where to send a browser that needs to log in |
| `crypto key sign-verify` / `crypto key verify` | Connects the token issuer and verifier using the same secret |
| `allow roles app/member` | Requires the app-specific role |
| `authorize with apppolicy` | Checks access before the protected response |

`authp/user` permits ordinary portal use. It does not meet this app's
`app/member` rule. Keeping these roles separate lets users sign in without
giving every signed-in user access to the application.

The outer `route` preserves handler order. Inside the `/app` route, `authorize`
runs before `respond`; the app's response is reached only after the policy
allows the request. The matcher covers both `/app` and paths below `/app/`.

`cookie insecure enabled` allows the demo cookie over HTTP. A deployment with
HTTPS should omit this setting. `admin off` disables Caddy's administration
endpoint, and `persist_config off` disables its saved configuration. Use
**Ctrl+C** to stop this foreground demo; do not use `caddy reload` with it.

Continue to **[Verify access](verify-access.md)** before changing the example.
