---
title: "Local identity store configuration"
description: "Configure a local identity store and connect its realm to the authentication portal."
discovery:
  topic: identity-providers
  kind: guide
  aliases: ["local database", "users.json"]
---

# Local identity store configuration

A local store owns account records, password hashes, roles and registered MFA
credentials in a file-backed JSON database. Give it a configuration nickname,
a distinct realm and a private, persistent path; enable the nickname in a portal.

```caddyfile
security {
    local identity store localdb {
        realm local
        path /var/lib/authcrunch/users.json
    }
    authentication portal myportal {
        enable identity store localdb
    }
}
```

This is a global-security fragment. A complete deployment also mounts
`authenticate with myportal` and protects its application with an authorization
policy. Use the [first application](../../start/first-app.md) for the complete
local exercise, or [refresh sessions](../30-refresh-token.md) for a canonical
HTTPS renewable-session deployment.

## Provision the database

The service creates the database when it does not exist. Prepare its parent
directory with private service ownership; keep the database outside web roots
and static assets. File-backed identity data are separate from optional
[encrypted runtime state](../../operations/runtime-state.md).

If no administrative account exists, provisioning creates one with `authp/admin`.
Defaults are `webadmin` and `webadmin@localdomain.local`. Set these variables
**before first provisioning** when a known bootstrap account is needed:

| Variable | Purpose |
| --- | --- |
| `AUTHP_ADMIN_USER` | Bootstrap username |
| `AUTHP_ADMIN_EMAIL` | Bootstrap email |
| `AUTHP_ADMIN_SECRET` | Private bootstrap password |

If the password is omitted, the service generates one. The current startup log
reports username/email/roles, **not the password**; searching for the old
`user_secret` log field will not recover it. These variables create a missing
admin, not overwrite an existing account's password. Use supported account
management to change existing credentials.

## Assign the minimum roles

`authp/admin` is for administration, `authp/user` for ordinary portal access, and
an application role such as `app/member` for the app's policy. They have different
purposes. Do not give every new account an administrative role just to make login
work. Static-user provisioning, account updates and self-registration are
explained in the adjacent guides.

Verify a fresh user's login, required MFA, allowed app access, a nonmember's 403
and logout. A correct database path alone does not establish those boundaries.
