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
  "id": "faaf870b-c350-4a2b-bef3-ebfd90ae3f86",
  "kind": "auth_response",
  "authenticated": true,
  "user_data": {
    "addr": "10.1.1.1",
    "email": "jsmith@localhost.localdomain",
    "name": "Smith, John",
    "origin": "local",
    "realm": "local",
    "roles": [
      "authp/user",
      "dash"
    ],
    "sub": "jsmith"
  },
  "timestamp": "2026-03-29T16:06:45.73201Z"
}
```

Now, let's test the same with `authdbctl` utility.

```bash
cat <<EOF > .tmp/basic_auth_message.json
{
    "kind": "basic_auth_request",
    "username": "jsmith",
    "password": "My@Password123",
    "realm": "local",
    "address": "10.1.1.1"
}
EOF

authdbctl --debug system send message --encryption-key ~/.config/caddy/security_system.key --input-message-file .tmp/basic_auth_message.json --key-id j163xe
```

The key ID must match the one configured on the authentication portal.

The following above command emulates the work of a gatekeeper (`authorize` plugin) that received Basic authentication
credentials and need to authenticate the credentials with remove authentication portal.


### API Key Authentication

To perform API key authentication for a user, the gatekeeper (`authenticate` plugin) sends a message with
the following payload:

```json
{
    "kind": "api_key_auth_request",
    "api_key": "<API_KEY>",
    "realm": "<REALM_NAME>",
    "address": "<SOURCE_ADDRESS>"
}
```

The receiving portal responds with the following message:

```json
{
  "id": "0b719a2c-0894-4157-ba83-4f5c0ca50ceb",
  "kind": "auth_response",
  "authenticated": true,
  "user_data": {
    "addr": "10.1.1.1",
    "email": "jsmith@localhost.localdomain",
    "name": "Smith, John",
    "origin": "local",
    "realm": "local",
    "roles": [
      "authp/user",
      "dash"
    ],
    "sub": "jsmith"
  },
  "timestamp": "2026-03-29T16:53:55.993986Z"
}
```

Now, let's test the same with `authdbctl` utility.

```bash
cat <<EOF > .tmp/api_key_auth_message.json
{
    "kind": "api_key_auth_request",
    "api_key": "Lpi1BhMmSIcRk96E7QBovuik2rww3PV5JfSkzSVGNmKlNNCjpKbe66750TrUHIgcl67OEeCz",
    "realm": "local",
    "address": "10.1.1.1"
}
EOF

authdbctl --debug system send message --encryption-key ~/.config/caddy/security_system.key --input-message-file .tmp/api_key_auth_message.json --key-id j163xe
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