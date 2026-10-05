---
title: "Local management CLI"
description: "Use the bundled security local commands to authenticate, inspect stores, manage users, and generate private credentials."
discovery:
  topic: operations
  kind: guide
  aliases: ["security local", "authdbctl", "CLI", "user administration"]
---

# Local management CLI

The released `authcrunch` executable includes **`security local`**. It calls a
running portal's [Server API](../authenticate/api/40-server-api.md); it does not
edit database files directly. Credential generators work offline and do not
require a server or administrator session.

```bash
authcrunch security local --help
authcrunch security local generate --help
```

Use the actual executable path from your installation. This guide targets
[Caddy Security v1.3.0 / library v1.3.8](versions.md). The standalone pinned
`authdbctl` client is another management interface, but its command-line flags
and retry behavior differ; do not interchange command examples blindly.

## Prepare administrator access

Enable `enable admin api` inside the portal and use a trusted account with
`authp/admin`. The client configuration is a separate private YAML file,
**not the server's Caddyfile**:

```yaml
base_url: https://auth.example.com/auth
realm: local
username: webadmin
token_path: credentials.json
```

`realm` identifies the administrator's login store. A command's `--realm`
identifies the store being managed; these can differ. `base_url` includes the
portal mount and has no query or fragment. A relative `token_path` is resolved
beside the client configuration. Without an explicit path, the bundled CLI
isolates caches by portal and login identity under `.security-tokens`.

Create the parent directory privately and save the YAML with owner-only
permissions, such as `0700` for the directory and `0600` for the file. On Unix,
the CLI rejects credential files readable by group/others. Config and existing
token inputs must be regular files, not leaf symlinks. Keep a separate token
file for each portal and identity; never choose the configuration file or CA
file as the token output.

Omit `password` to use the hidden terminal prompt. A private configuration can
supply `password` or supported TOTP settings for automation, but it then holds
those secrets. The YAML loader does not expand Caddyfile environment placeholders.
WebAuthn/U2F interactive challenges are not supported by this client.

## Connect and inspect

```bash
authcrunch security local connect --config "$HOME/.config/authcrunch/admin.yaml"
authcrunch security local metadata --config "$HOME/.config/authcrunch/admin.yaml"
authcrunch security local list realms --config "$HOME/.config/authcrunch/admin.yaml"
authcrunch security local list users \
  --config "$HOME/.config/authcrunch/admin.yaml" --realm local --format table
authcrunch security local info realm \
  --config "$HOME/.config/authcrunch/admin.yaml" --realm local
```

`connect` authenticates and saves private credentials. A command can authenticate
when its token file is missing. Existing invalid or expired credentials require
an explicit `connect`; administrative requests are not automatically retried.
For a private/internal CA, add `--ca-file /path/to/ca.pem` rather than disabling
TLS verification. `--timeout` bounds login and the request.

Lists support `json`, `table`, and `csv`. Account details can include hashes or
other private data; they are not a public reporting endpoint.

If the portal enables refresh sessions for the administrator's realm, its
browser transport returns metadata rather than a JSON access credential. Add
`refresh_transport: body` to the client YAML **and** explicitly enable native
body transport in that realm's [refresh configuration](../authenticate/30-refresh-token.md).
The CLI stores returned credentials but does not automatically rotate a refresh
family to renew administrative requests. An API-key login is access-only and
cannot select body refresh transport.

## Manage one account

User commands require both username and email. Creation returns a generated
password; keep the output private and arrange delivery through your approved
account-provisioning process.

```bash
authcrunch security local add user \
  --config "$HOME/.config/authcrunch/admin.yaml" --realm local \
  --username alice --email alice@example.com --name 'Alice Example' \
  --roles authp/user,app/member

authcrunch security local info user \
  --config "$HOME/.config/authcrunch/admin.yaml" --realm local \
  --username alice --email alice@example.com
```

Supported updates are account enable/disable, password reset, role replacement
or addition, and ordered authentication-challenge replacement. For example:

```bash
authcrunch security local update user \
  --config "$HOME/.config/authcrunch/admin.yaml" --realm local \
  --username alice --email alice@example.com --overwrite-roles authp/user,report/reader
```

Use `update user --help` for the mutually applicable flags. Password reset
prints a new credential. Role changes must agree with your application's policy.
Changing an account is not immediate distributed revocation of already issued
JWTs or every cached credential result.

`delete user` removes the selected account; `reload --realm local` reloads a
store from disk, not the server configuration. Take an appropriate backup and
verify the exact target before these operations. If a sent mutation encounters
a transport error, the server may already have committed it. Inspect the account
before repeating; the CLI reports an uncertain outcome and does not retry.

## Generate credentials offline

```bash
authcrunch security local generate password hash --algorithm bcrypt
authcrunch security local generate password hash --algorithm argon2
authcrunch security local generate api key
```

The password commands support hidden input and private file/stdin input; see
[password imports](../authenticate/local/30-password-management.md). The API-key
command emits a private 72-character secret and an `api key PREFIX HASH`
directive. Keep the secret for the caller and provision the directive to the
intended static local user. Neither generator writes an account or authenticates
a request by itself.

For application code that needs portal login without administrative commands,
use the [Go authentication client](authclient.md).
