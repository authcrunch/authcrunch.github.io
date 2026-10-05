---
description: "Manage a signed-in local account through the Profile API, including passwords, authenticators, API keys, and challenge policy."
discovery:
  topic: operations
  kind: reference
  aliases: ["account API", "credential management", "overwrite_user_auth_challenges"]
---

# Profile API

The [User Profile](../auth-portal.md#user-settings) calls **`POST /auth/api/profile`**
with a JSON `kind` selecting an operation. This API manages the current local
account. It does not accept an arbitrary target username, and it is not the
administrator's user-management API.

## Authentication and request format

A caller needs a valid portal token, `authp/user` or `authp/admin`, and the live
session that originally authenticated a local identity. A signed token without
that session is insufficient. Identity changes made by transforms do not let
a caller select another account. External-provider account management is not
implemented by this local API.

Send `Content-Type: application/json`; the body limit is 1 MiB. In a browser,
use a same-origin request and the portal cookie. A caller using a bearer credential still needs the token’s live browser portal
session. A native body-transport refresh login does not create that Profile
session; its valid token can pass `whoami` while Profile returns `401`. Prefer
the Profile UI for self-service. The diagnostic example assumes
`AUTHCRUNCH_ACCESS_TOKEN` identifies an existing live browser login:

```bash
curl --fail-with-body --silent --show-error \
  https://auth.example.com/auth/api/profile \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer ${AUTHCRUNCH_ACCESS_TOKEN}" \
  --data '{"kind":"fetch_user_info"}'
```

Responses include a numeric `status`, a timestamp, and operation-specific
`entry`, `entries`, or `message` fields. Check HTTP status before using the
result. An unsupported kind or malformed field returns `400`. A missing allowed
role returns `403`; an invalid token returns `401`. A non-local account cannot
use the local credential backend.

## Password changes

```json
{
  "kind": "update_user_password",
  "old_password": "replace-with-current-password",
  "new_password": "replace-with-new-password"
}
```

The current password must verify and the new password must satisfy the local
store's policy. The handler trims leading and trailing whitespace from these
fields; do not design a password around surrounding whitespace. See
[password management](../local/30-password-management.md) for the UI and
administrator reset workflow.

## Authentication challenge policy

Fetch the account's effective policy:

```json
{"kind":"fetch_user_auth_challenges"}
```

The result includes `entries`, `registered_methods`, `effective_challenges`,
`additional_challenges`, and `policy_source`. This distinguishes account rules
from portal requirements and backend defaults.

Replace the account's ordered rules:

```json
{
  "kind": "overwrite_user_auth_challenges",
  "challenges": ["password", "u2f or totp"]
}
```

An empty array clears account overrides and restores the applicable defaults.
A missing field, `null`, mixed types, unsupported methods, or an unsatisfiable
policy returns `400` without partially writing the rule set. A successful
change returns `reauthentication_required: true`: complete a new login before
using the changed security state. Enrollment by itself does not prove that a
factor was used in the current login. See [challenge selection](../13-authentication-challenges.md).

## Operation reference

| Task | `kind` values |
| --- | --- |
| Account and dashboard | `fetch_user_info`, `fetch_user_dashboard_data`, `fetch_debug` |
| Password | `update_user_password` |
| List, inspect, or remove MFA authenticators | `fetch_user_multi_factor_authenticators`, `fetch_user_multi_factor_authenticator`, `delete_user_multi_factor_authenticator` |
| Application MFA enrollment and test | `fetch_user_app_multi_factor_authenticator_code`, `test_user_app_multi_factor_authenticator`, `add_user_app_multi_factor_authenticator`, `test_user_app_token_passcode` |
| WebAuthn enrollment and test | `fetch_user_u2f_reg_params`, `fetch_user_u2f_ver_params`, `test_user_u2f_reg`, `add_user_u2f_token`, `test_user_webauthn_token` |
| API keys | `fetch_user_api_keys`, `fetch_user_api_key`, `delete_user_api_key`, `add_user_api_key`, `test_user_api_key` |
| SSH public keys | `fetch_user_ssh_keys`, `fetch_user_ssh_key`, `delete_user_ssh_key`, `test_user_ssh_key`, `add_user_ssh_key` |
| GPG public keys | `fetch_user_gpg_keys`, `fetch_user_gpg_key`, `delete_user_gpg_key`, `test_user_gpg_key`, `add_user_gpg_key` |
| Challenge rules | `fetch_user_auth_challenges`, `overwrite_user_auth_challenges` |

Singular credential operations use the credential's `id`. Enrollment requires
additional type-specific fields and, for WebAuthn, the browser registration
and verification ceremonies. Use the [Profile UI](../auth-portal.md) for an
interactive enrollment; the exact payload contracts are in the
[released profile dispatcher and handlers](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/pkg/authn/handle_api_profile.go).

An API-key addition supplies `content` (64–72 alphanumeric characters), `title`,
and `description`, with optional labels and tags. Generate a unique secret,
not a value copied from an example. Fetching keys or MFA details can return
credential material: these are private account responses, not a public
metadata service. Do not put their bodies in analytics, shared caches, or
application logs. SSH/GPG enrollment stores public keys; it does not grant
shell access or replace an application's own key policy.
