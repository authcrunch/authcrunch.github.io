---
sidebar_position: 1
title: Install and verify
description: Get the published AuthCrunch bundle, verify its security modules, and prepare a local learning environment.
---

# Install and verify

The walkthrough uses the **AuthCrunch v1.3.0 bundle** from the caddy-security
release. Its executable, `authcrunch`, is Caddy with the security module included.
A standard Caddy installation does not include this module.

## What you need

- macOS or Linux, or a Linux environment such as WSL.
- A terminal with a POSIX-compatible shell, `tar`, `curl`, and `openssl`.
- A browser and an available local port **9080**.
- A new directory for the demo's configuration and local data.

The commands below use a foreground process and HTTP on the loopback interface.
They do not require root, a service installation, a domain, or certificate trust.

## Get the bundle

1. Open the [v1.3.0 release](https://github.com/greenpau/caddy-security/releases/tag/v1.3.0).
2. Download the `.tar.gz` archive for your operating system and architecture,
   together with the release checksum file. For example, Apple silicon uses
   `authcrunch_1.3.0_darwin_arm64.tar.gz`; Linux on x86-64 uses
   `authcrunch_1.3.0_linux_amd64.tar.gz`.
3. Compare the archive's SHA-256 digest with the checksum file. Use
   `shasum -a 256` on macOS or `sha256sum` on Linux, followed by the archive path.
4. Create a directory named `authcrunch-demo` and extract the archive into it.
   The archive contains `bin/authcrunch`, `LICENSE`, and `README.md`.

For example, after changing the archive path to your downloaded file:

```sh
mkdir authcrunch-demo
cd authcrunch-demo
tar -xzf /path/to/authcrunch_1.3.0_darwin_arm64.tar.gz
```

Run all subsequent commands from this `authcrunch-demo` directory.

## Check the executable

```sh
./bin/authcrunch version
./bin/authcrunch security version
./bin/authcrunch list-modules
```

The first command reports the Caddy version. The second must report
**go-authcrunch v1.3.8** for this bundle. The module list must include:

```text
security
http.handlers.authentication
http.handlers.authorization
```

If `security` is an unknown command or these modules are missing, you are running
a different Caddy build. Check the executable path before editing configuration.

:::tip[Already have a custom Caddy build?]

You can use a build containing `github.com/greenpau/caddy-security`. Run the same
checks against that executable and substitute its path for `./bin/authcrunch`
throughout the walkthrough. The [Caddy download builder](https://caddyserver.com/download?package=github.com%2Fgreenpau%2Fcaddy-security)
provides custom builds; its selected module versions may differ from this pinned
release. Record both the Caddy and AuthCrunch versions when diagnosing a problem.

:::

Continue to **[Protect your first app](first-app.md)**.
