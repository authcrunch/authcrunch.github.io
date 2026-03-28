# System API

## Overview

The purpose of the System API is to allow authentication portals (`authenticate` plugin) deployes on different instances
to share state among themselves, perform authentication database synchronization, and distributes various revocation lists.

Additionally, the same API is used by gatekeepers running authorization policies (`authorize` plugin) to
perform API key and Basic authentication through a remote authentication portals. The gatekeepers also
get revocation list via the API to prevent unauthorized access if a user was disabled, but the user's tokens
are still valid.

## Communication Encryption

The messages sent and received via the API are encoded in platform-agnostic security tokens (PASETO).

All authentication portals and authorization policy gatekeepers encrypt their
communication with the same key.

Specifically, `v4.local` specification is being used.

The format of the token:

```text
v4.local.<payload>.<footer>
```

The System API keys must have an identifier (`kid`) associated with them.
The identifier gets embedded in the `footer` of the token.

## Configuration

The syntax to configure shared encryption key follows.

```Caddyfile
authentication portal <PORTAL_NAME> {
    crypto key <KEY_ID> system <file:PATH/TO/security_system.key>
}

authorization policy <POLICY_NAME> {
    crypto key <KEY_ID> system {file.PATH/TO/security_system.key}
    with api key auth portal https://<PORTAL_BASE_URL>/auth realm <REALM_NAME>
    with basic auth portal https://<PORTAL_BASE_URL>/auth realm <REALM_NAME>
}
```

> Note the use of `{file.*}` replacer. Caddy will read the `security_system.key` file
> and extract the shared key.
> 
> You can also store the key in an environment variable, e.g. `SYSTEM_API_SECRET`, and
> then reference it via environment variable replacer `{env.*}`, e.g.
> `crypto key <KEY_ID> system {env.SYSTEM_API_SECRET}`

The following command generates the shared encryption key. The key is random 256-bit (32-byte) symmetric key.
The algorithm used is `XChaCha20-Poly1305`.

```bash
authdbctl system generate key --output-key-file ~/.config/caddy/security_system.key
```

The `~/.config/caddy/security_system.key` contains Base64 encoded key:

```text
f6db709dadd4258c51c99fe60ddbbedc1178dc2255a16cd5a675a9f638e16d36
```

## Key ID Field

The `kid` field is mandatory for System API messages. It helps identifying the sources
of the API requests and rotating keys.

## Messages

### Basic Authentication

To perform basic authentication for a user, the gatekeeper (`authenticate` plugin) sends a message with
the following payload:

```json
{
    "kind": "basic_auth",
    "username": "<USERNAME>",
    "password": "<PASSWORD>",
    "realm": "<REALM_NAME>"
}
```

The receiving portal responds with the following message:

```json
{
    "authenticated": true
}
```

Now, let's test the same with `authdbctl` utility.

```bash
cat <<EOF > .tmp/basic_auth_message.json
{
    "kind": "basic_auth",
    "username": "jsmith",
    "password": "My@Password123",
    "realm": "local"
}
EOF

authdbctl system send message --encryption-key ~/.config/caddy/security_system.key --input-message-file .tmp/basic_auth_message.json
```

The following above command emulates the work of a gatekeeper (`authorize` plugin) that received Basic authentication
credentials and need to authenticate the credentials with remove authentication portal.


### API Key Authentication

To perform API key authentication for a user, the gatekeeper (`authenticate` plugin) sends a message with
the following payload:

```json
{
    "kind": "api_key_auth",
    "api_key": "<API_KEY>",
    "realm": "<REALM_NAME>"
}
```

The receiving portal responds with the following message:

```json
{
    "authenticated": true
}
```

## Restricting Access

You can use Caddy matchers to match `/api/system` in the URL path and allow
access to the path only from specific IP addresses or address ranges.


```Caddyfile
    @system_api_blocked {
        path *api/system*
        not remote_ip 192.168.1.0/24 10.0.0.0/8
    }

    handle @system_api_blocked {
        respond "Forbidden" 403
    }
```