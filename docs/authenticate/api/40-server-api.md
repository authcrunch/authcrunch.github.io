---
description: "Enable and call administrator APIs for store inspection, user management, reloads, and explicitly permitted private-key export."
discovery:
  topic: operations
  kind: reference
  aliases: ["admin API", "metadata", "private key export"]
---

# Server API

The Server API administers the portal's configured identity stores. Enable it
inside the existing `authentication portal` block:

```Caddyfile
enable admin api
```

The default is disabled. Calls require an authenticated identity with the exact
reserved role **`authp/admin`**; a role named `admin` or an application role does
not qualify. Only grant this role through a trusted administrative provisioning
path. Use HTTPS and keep these routes behind the intended management boundary.

All paths below are relative to the portal mount. JSON POST bodies are limited
to 1 MiB. A native example with an administrator's access token:

```bash
curl --fail-with-body --silent --show-error \
  https://auth.example.com/auth/api/server/realms \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer ${AUTHCRUNCH_ADMIN_ACCESS_TOKEN}" \
  --data '{"query":"all"}'
```

## Server State

### Metadata

**`GET /api/server/metadata`** returns AuthCrunch version, commit, and a server
timestamp. This describes the running library; also record the Caddy executable
and adapter version when checking a deployment.

### Realm Discovery

**`POST /api/server/realms`**, for example `{"query":"all"}`, lists configured
**identity stores** with realm, name, and kind. OAuth/SAML identity providers
are a separate configuration surface. Do not assume that a listed store
supports every local-user operation.

## Database Operations

### Database Info

**`POST /api/server/info`** takes `{"realm":"local"}` and optional `query`.
The result is backend-specific metadata, such as local storage and password
policy information. A missing realm returns `400`; an unknown realm returns
`404`. Protect responses that disclose filesystem paths or store configuration.

### List users

**`POST /api/server/users`** takes `{"realm":"local","query":"all"}`.
It returns a count, user metadata, and a timestamp. The released interface does
not supply a general pagination contract. Check that the requested store exists;
an empty result alone is not proof that the realm was selected correctly.

### Manage one user

**`POST /api/server/user`** requires `realm`, `operation`, and a `user` object.
Both `username` and `email` are required to identify the target:

```json
{
  "realm": "local",
  "operation": "info",
  "user": {"username":"alice","email":"alice@example.com"}
}
```

| `operation` | Purpose and extra data |
| --- | --- |
| `info` | Fetch account data |
| `add` | Provision an account; additionally supply `user.name` and nonempty `user.roles` |
| `delete` | Delete the selected account |
| `disable`, `enable` | Change account availability |
| `reset_password` | Generate a replacement password; handle the returned credential privately |
| `overwrite_roles`, `add_roles` | Supply `user.roles` to replace or extend roles |
| `overwrite_auth_challenges` | Supply `user.challenges` to replace ordered challenge rules |

Backend support and validation determine the outcome. Some mutation failures
return HTTP `200` with `status: "failure"` and an error. **Check the result body**;
a successful HTTP exchange does not prove a user changed. Account responses
may contain private credential data. Do not print administrative tokens or
reset results into shared logs.

Disabling an account prevents new authentication through that store. It is not
a distributed JWT revocation protocol: separately issued access tokens have
an expiry and validation lifecycle. See [token verification](../../authorize/token-verification.md)
and [persistent runtime state](../../operations/runtime-state.md).

### Reload a store

**`POST /api/server/reload`** takes `{"realm":"local"}`. It asks that store to
reload its data, not Caddy to reload its configuration. Require an explicit
`status: "success"`; an unknown realm may return a timestamp without a status.
Coordinate offline database edits with backups and the store's ownership rules.

## Private signing-key export

The independent opt-in is:

```Caddyfile
enable admin api
enable admin api private key export
```

**`GET /api/server/private_keys`** remains `404` unless both flags are enabled.
It also requires `authp/admin`. This endpoint exports signing credentials;
ordinary token verification should use the public **`/auth/jwks.json`** instead.

| Query | Result |
| --- | --- |
| No query, or `format=pkcs8` | JSON `keys` array containing PKCS#8 PEM keys |
| `format=pkcs8&encoding=der` | Base64 DER inside JSON |
| `format=pkcs1` | RSA keys only |
| `format=sec1` | EC keys only |
| `format=jwk` | Private JWKs with JSON encoding |

Unsupported, repeated, empty, or incompatible format/encoding parameters return
`400`. A key set incompatible with PKCS#1 or SEC1 fails the entire export rather
than silently omitting keys. The handler disables caching. Keep this opt-in
absent from routine deployments and perform backups through the private state
workflow when that meets the operational need.
