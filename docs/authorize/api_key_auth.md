---
sidebar_position: 15
description: "Authenticate protected requests using an API key issued by a local portal."
discovery:
  topic: authorization
  kind: guide
  aliases: ["X-Api-Key"]
---

# API Key Authentication

Use a local account API key for machine requests that should not send the
account's password. Keys are private credentials, not browser access JWTs or
refresh tokens. Give the account a narrow application role and use HTTPS.

## Usage

```Caddyfile
# Inside the existing policy:
with api key auth portal myportal realm local
disable auth redirect
allow roles app/member
enable strip token
```

`myportal` must enable the selected local store. An HTTPS portal base URL can
replace the local name for [remote encrypted authentication](../authenticate/api/50-system-api.md),
with matching System keys configured on both services.

```bash
curl --fail-with-body --silent --show-error \
  -H 'X-Auth-Realm: local' \
  -H "X-Api-Key: ${AUTHCRUNCH_ACCOUNT_API_KEY}" \
  https://app.example.com/api/report
```

The realm selector is required unless a trusted route assigns it. A recognized
invalid key returns `401`. A successfully authenticated account still needs the
application role; a wrong/missing header follows missing-authentication behavior.
Do not diagnose a redirect as proof that a key itself was accepted.

The portal's direct-authentication boundary applies: an API key does not prove
password, TOTP, or WebAuthn use and cannot bypass a required interactive factor.
It does not mint a native refresh family or an OIDC grant. Use a dedicated
machine account whose requirements fit this authentication method.

## Changing API Key Header Name

```Caddyfile
with api key header name X-Service-Key
```

The client must use the same configured name. `enable strip token` removes that
accepted header before forwarding; the backend can consume trusted
[identity headers](headers.md) instead of the credential.

## Changing Authentication Realm Header Name

```Caddyfile
with auth realm header name X-Account-Realm
```

For a single-realm route, `request_header X-Account-Realm local` before
`authorize` replaces a client value. Do not use an append operation to construct
an ambiguous selector.

## Generating API Key

Create and manage a key in the local user's [Profile](../authenticate/auth-portal.md#user-settings)
or provision it using the bundled offline generator:

```bash
authcrunch security local generate api key
```

The separate pinned `authdbctl` client also provides `generate api key`.
The bundled command emits a private `secret` for the caller and an `api key PREFIX HASH`
Caddyfile directive for a static user. Store the secret privately; put only the
generated directive inside the intended local store's `user` block. Never reuse
an example key. Profile enrollment accepts a unique 64–72-character
alphanumeric key and stores it through the account-management workflow.

Treat deletion, replacement, account disabling, and role changes as lifecycle
operations. Successful credential identities can be cached until their validity
interval expires, so deletion is not a promise of immediate distributed
revocation. Test key rotation and the denial path in the deployed architecture.
