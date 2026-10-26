---
sidebar_position: 1
title: Install and verify
description: "Get the published AuthCrunch bundle, verify its security modules, and prepare a local learning environment."
discovery:
  topic: operations
  kind: tutorial
  aliases: ["installation", "download", "Caddy module", "version"]
---

# Install and verify

The walkthrough uses the **AuthCrunch v1.5.0 distribution** from
[authcrunch/authcrunch](https://github.com/authcrunch/authcrunch/releases/tag/v1.5.0).
Its executable, `authcrunch`, is Caddy with caddy-security and the optional backend
plugins included. A standard Caddy installation does not include these modules.

The separate caddy-security release also names its core executable `authcrunch`,
but omits the optional backend companions. Choose the distribution for the
[SQLite, Consul and policy-service guides](../operations/backends.md).

## What you need

- macOS or Linux, or a Linux environment such as WSL.
- A terminal with a POSIX-compatible shell, `tar`, and `curl`.
- A browser and available local ports **8443** (HTTPS portal/app) and **5555**
  (loopback certificate approval).
- A new directory for the demo's configuration and local data.

The walkthrough runs HTTPS on the loopback interface with Caddy's local CA.
It does not require root, a service installation, a public domain or environment
variables. The example leaves your system trust store unchanged; the browser
will need to accept the local certificate warning for this disposable demo.

## Get the bundle

1. Open the [AuthCrunch v1.5.0 release](https://github.com/authcrunch/authcrunch/releases/tag/v1.5.0).
2. Download the `.tar.gz` archive for your operating system and architecture,
   together with the release checksum file. For example, Apple silicon uses
   `authcrunch_1.5.0_darwin_arm64.tar.gz`; Linux on x86-64 uses
   `authcrunch_1.5.0_linux_amd64.tar.gz`.
3. Compare the archive's SHA-256 digest with the checksum file. Use
   `shasum -a 256` on macOS or `sha256sum` on Linux, followed by the archive path.
4. Create a directory named `authcrunch-demo` and extract the archive into it.
   The archive contains `bin/authcrunch`, `LICENSE`, and `README.md`.

For example, after changing the archive path to your downloaded file:

```sh
mkdir authcrunch-demo
cd authcrunch-demo
tar -xzf /path/to/authcrunch_1.5.0_darwin_arm64.tar.gz
```

Run all subsequent commands from this `authcrunch-demo` directory.

## Check the executable

```sh
./bin/authcrunch version
./bin/authcrunch security version
./bin/authcrunch list-modules --versions
```

The first command reports the Caddy version. The second must report
**go-authcrunch v1.4.1** for this distribution; Caddy reports **v2.11.7**.
The module list must include:

```text
security
http.handlers.authentication
http.handlers.authorization
http.handlers.authenticator
security.identity_stores.sqlite
security.oauth_login_stores.consul
```

If `security` is an unknown command or these modules are missing, you are running
a different Caddy build. Check the executable path before editing configuration.

:::tip[Already have a custom Caddy build?]

You can use a build containing `github.com/greenpau/caddy-security`. Run the same
checks against that executable and substitute its path for `./bin/authcrunch`
throughout the walkthrough. The [Caddy download builder](https://caddyserver.com/download?package=github.com%2Fgreenpau%2Fcaddy-security)
provides custom builds; its selected module versions may differ from this pinned
release. Record both the Caddy and AuthCrunch versions when diagnosing a problem.
Add every required companion explicitly when building with xcaddy; see the
[module inventory](../operations/backends.md#companion-inventory).

:::

Continue to **[Protect your first app](first-app.md)**.
