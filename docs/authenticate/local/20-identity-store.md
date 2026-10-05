---
title: "Local identity store format"
description: "Inspect the local users.json structure, including password policy, user records, and revision metadata."
discovery:
  topic: identity-providers
  kind: reference
  aliases: ["local database", "JSON schema"]
---

# Local identity store format

`users.json` is the file-backed local identity database. AuthCrunch creates and
maintains it; it is not a list of plaintext passwords or a replacement Caddyfile.
Treat it as private credential storage and retain the full schema when backing it up.

## Database structure

The document contains version/revision metadata, policy and user records:

```json
{
  "version": "<database schema version>",
  "revision": 1,
  "last_modified": "<timestamp>",
  "policy": {"password": {}, "user": {}},
  "users": []
}
```

This is an explanatory outline, **not a database to copy into a deployment**.
Actual policy objects contain password length/history/reuse and username rules.
User records contain immutable IDs, canonical and additional email addresses,
roles, password records, registered credentials, security revisions and optional
challenge rules. Fields change with the schema; preserve unknown fields rather
than reconstructing an account from this outline.

| Data | Meaning |
| --- | --- |
| User `id` | Immutable account identity; deleting/recreating a username changes it |
| `username`, `email_address`, `email_addresses` | Canonical account and aliases; aliases must resolve to the same account |
| `roles` | Role objects, including organization/name components |
| `passwords` | Hash algorithm, encoded hash, creation and disabled/expired state |
| `auth_challenge_rules` | Ordered local authentication policy |
| Database/security revisions | Mutation and authentication-evidence tracking |

Password records support bcrypt and Argon2id in the released bundle. A Caddyfile
import such as `bcrypt:COST:HASH` or `argon2:PHC` is **not** the JSON hash field's
entire value. Use [password management](30-password-management.md) to generate and
apply credentials through the supported boundary.

## Manage accounts through supported interfaces

Use [static users](50-static-users.md) for controlled initial provisioning and
[Server API](../api/40-server-api.md) or a compatible `authdbctl` for account CRUD.
Local users manage their own passwords/MFA through `/auth/profile/` with an
allowed role and live portal session. The older claim that users can only be
added by manually editing JSON is no longer accurate.

<figure className="doc-screenshot">
  <a href={require('../images/basic_login.png').default}><img src={require('../images/basic_login.png').default} alt="Historical local portal login form" /></a>
  <figcaption>Historical login screen retained as a visual reference. Use the current portal's username and password steps; database management is a separate task.</figcaption>
</figure>

## Protect changes and backups

Do not edit the file while a process is writing it. If manual repair is necessary,
stop the writer, take a coherent private backup and preserve IDs, schema,
credentials and revision data. Do not infer that replacing a hash in a live file
will trigger every security invalidation the supported mutation API performs.

Application signing keys, OIDC private keys and encrypted runtime state are
separate artifacts. Restore the appropriate coherent set and test fresh login,
role changes, disabled accounts and old-session invalidation. Never publish the
database or use it as a browser-downloadable debugging artifact.
