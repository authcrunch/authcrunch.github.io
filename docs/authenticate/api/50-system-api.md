---
description: "Authenticate remote Basic credentials and API keys through encrypted PASETO System messages with shared key IDs."
discovery:
  topic: operations
  kind: reference
  aliases: ["PASETO", "remote authentication", "System keys"]
---

# System API

## Overview

**`POST /auth/api/system`** lets an authorization gatekeeper ask a portal to
validate Basic credentials or a local API key. The released handler supports
these two request kinds. It does not implement authentication database
synchronization, replicated portal sessions, or distributed JWT revocation
lists.

The caller's authority is its shared System encryption key, not `authp/admin`.
The admin API switch does not enable or protect this protocol. A portal needs
a configured System key whose ID matches the message footer.

## Communication Encryption

The HTTP body is a PASETO **`v4.local`** encrypted message, not ordinary JSON or
an access JWT. Successful responses are encrypted with the selected key;
transport or validation errors can be JSON error responses. The body limit is
1 MiB. Use HTTPS in addition to message encryption.

```text
v4.local.<encrypted-payload>.<footer>
```

The authenticated footer carries the `kid`. System keys have a separate usage
from the keys that sign portal access tokens. Do not use a System message as
an application bearer token.

## Configuration

Configure the same private 256-bit key and matching ID on the portal and remote
policy. These are fragments inside existing `security` definitions:

```Caddyfile
authentication portal main {
    crypto key remote-auth system from file /etc/authcrunch/system.key
    # Existing identity-store and portal configuration goes here.
}

authorization policy remote-app {
    crypto key remote-auth system from file /etc/authcrunch/system.key
    with basic auth portal https://auth.example.com/auth realm local
    with api key auth portal https://auth.example.com/auth realm local
    allow roles app/member
}
```

Generate a fresh key using the pinned management client:

```bash
go install github.com/greenpau/go-authcrunch/cmd/authdbctl@v1.3.8
install -d -m 700 "$HOME/.config/authcrunch"
authdbctl system generate key \
  --output-key-file "$HOME/.config/authcrunch/system.key"
```

The file contains **64 hexadecimal characters** encoding 32 random bytes,
followed by a newline. It is written with mode `0600` when created. Give only
the relevant service owners access, and provision its private parent directory.
The System codec implements PASETO v4.local; the key configuration names its
usage `system`. These credentials are independent of [runtime-state encryption](../../operations/runtime-state.md).

## Key ID Field

The footer `kid` must identify a System key already configured at the receiving
portal. It selects a key; it is not proof of a particular host or administrator.
Plan coordinated key replacement and overlap explicitly. Changing a System key
does not itself revoke previously issued access JWTs.

## Messages

The following JSON describes the **plaintext before encryption**. Do not POST
it directly to `/api/system`.

### Basic Authentication

```json
{
  "kind":"basic_auth_request",
  "username":"alice",
  "password":"replace-with-the-account-password",
  "realm":"local",
  "address":"192.0.2.10"
}
```

The portal validates the account, applies transforms and the applicable
credential-authentication boundary, then encrypts an `auth_response` containing
`authenticated: true`, `user_data`, and a timestamp. A password authentication
establishes password evidence; it does not complete a missing TOTP or WebAuthn
checkpoint. See [Basic authentication](../../authorize/basic_auth.md).

For a diagnostic client, set `base_url: https://auth.example.com/auth` in a
private `authdbctl` YAML configuration. Store the request JSON in a private
file and run:

```bash
authdbctl --config "$HOME/.config/authdbctl/config.yaml" system send message \
  --encryption-key "$HOME/.config/authcrunch/system.key" \
  --input-message-file "$HOME/.config/authcrunch/request.json" \
  --key-id remote-auth
```

The client encrypts the request and decrypts the response. Do not add debug
logging to a routine credential-validation workflow.

### API Key Authentication

```json
{
  "kind":"api_key_auth_request",
  "api_key":"replace-with-a-private-account-api-key",
  "realm":"local",
  "address":"192.0.2.10"
}
```

The key belongs to an account in the selected store. The response carries the
account's current transformed identity; the gatekeeper still applies its own
allow/deny policy. API-key authentication is not an MFA login or a grant of
refresh/OIDC credentials. See [API-key authorization](../../authorize/api_key_auth.md)
and [Profile key management](30-profile-api.md).

## Restricting Access

Place an exact-path restriction before the portal handler when only known
remote gatekeepers need the System endpoint:

```Caddyfile
@system_api_blocked {
    path /auth/api/system
    not remote_ip 192.0.2.0/24
}
handle @system_api_blocked {
    respond "Forbidden" 403
}
# The portal's handle /auth/* follows this restriction.
```

Use the connection address unless trusted-proxy configuration supplies a
verified client address. Protect the key even on a restricted network: anyone
holding it can construct System requests. An IP matcher does not establish
caller identity or replace HTTPS.
