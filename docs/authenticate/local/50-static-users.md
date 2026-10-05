---
description: "Define local users, password hashes, and roles inside a Caddyfile identity store."
discovery:
  topic: identity-providers
  kind: reference
  aliases: ["bootstrap", "bcrypt", "Argon2id"]
---

# Static Users

A local store can provision named users from configuration. Use this for explicit
initial accounts; normal account changes belong to the supported management API.
The file path is private persistent storage, not a web-served resource.

```caddyfile
local identity store localdb {
    realm local
    path /var/lib/authcrunch/users.json
    user alice {
        name "Alice Example"
        email alice@example.com
        password "{$ALICE_PASSWORD_HASH}"
        roles authp/user app/member
    }
}
```

Set `ALICE_PASSWORD_HASH` to the **complete imported value**, such as
`bcrypt:COST:HASH` or `argon2:PHC`, produced by the utility below. The variable
expands during adaptation; protect expanded JSON as credential material.
Plaintext is supported and defaults to bcrypt hashing, but do not commit a real
plaintext password. The [local exercise](../../start/first-app.md) deliberately
uses public disposable passwords.

Existing accounts are not fully reconciled from this block. A configured password
replaces an existing one only when `overwrite` is appended. Initial name/email/role
values do not continually synchronize every existing account. Nonempty challenge
rules are explicitly overwritten; configured API keys are processed separately.
Use an account mutation API for deliberate role and identity changes.

## Password Generation

The released Caddy bundle includes:

```sh
authcrunch security local generate password hash --algorithm argon2
```

It reads a password interactively without echo and prints a directive in this
**illustrative shape**:

```text
password "argon2:$argon2id$v=19$m=65536,t=3,p=4$SALT$DIGEST"
```

`SALT`/`DIGEST` here are labels, not an importable hash. Copy the utility's actual
value rather than constructing it manually. For bcrypt, omit `--algorithm` or
select `--algorithm bcrypt --cost 10`. The parser verifies the encoded cost and
bounded hash format; changing a textual cost does not rehash the password.

When intentionally replacing an existing account's password, append `overwrite`
to the generated directive. Leaving it permanently enabled can reset a user's
self-service password at each provisioning. Prefer removing that one-time
replacement setting after the intended update.

A version-compatible `authdbctl` is available from
[go-authcrunch v1.3.8](https://github.com/greenpau/go-authcrunch/releases/tag/v1.3.8)
or `go install github.com/greenpau/go-authcrunch/cmd/authdbctl@v1.3.8`.
Read its help for management transport and credential settings. The bundled
utility's [password guide](30-password-management.md) covers private file/stdin
input and Argon2 parameters.

Static `auth challenges` statements select methods, not enrolled factors. A
strict TOTP/WebAuthn rule needs a usable registered credential or login is denied.
Finally test fresh password/MFA login, the intended application role, a nonmember
and old-credential invalidation after replacement.
