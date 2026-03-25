---
sidebar_position: 13
---

# Authentication Challenges

Currently, when user attempts to login the users will be prompted for the password first. Then,
if MFA (application or hardware) is configured for the user, the user will be prompted to authenticate with
either of them.

If Caddyfile contains `require mfa` in `transform user` and the MFA is not configured, then
as part of user login, the user will be required to onboard MFA token. It could be Authenticator
application token, hardware token, e.g. Yubico, or device-associated token, e.g. passkey.

To summarize, there are two pathways to get authentication:

1. password only
2. password, then MFA (either app or hardware)

Authentication challenge rules allow to change this default by specifying
which challenge types a user must pass and in what order, with conditional
fallbacks based on what the user has registered.

## Challenge Types

| Type | Description |
|------|------------|
| `password` | Authenticate with a password |
| `totp` | Authenticate with an authenticator app passcode |
| `u2f` | Authenticate with a hardware token (e.g. Yubico) or passkey |
| `mfa` | Authenticate with any available MFA method (totp, u2f, or email) |
| `email` | Authenticate with an email-based verification code * |

\* Email challenge support is being added.

**The `password` type is always considered available.** The other types
require the user to have a matching token registered in the identity
store.

## Rule Syntax

Each rule specifies one or more challenge types with an optional
condition:

```
<type> [<type>...] [if <type> [and <type>...] not available]
```

Rules are evaluated in order. The first rule whose challenge types are
available and whose conditions are met determines the checkpoint sequence.

When multiple challenge types appear in a rule, the user must pass
all of them. The `or` keyword relaxes the availability check: the rule
matches if the user has at least one of the listed types registered,
rather than requiring all of them.

The `if ... not available` clause makes a rule apply only when the
specified types are not registered for the user. If the user has any of
the condition types registered, the rule is skipped.

If no rules match, the default behavior applies (password, plus any
detected MFA).

## Configuring via authdbctl

The `authdbctl` tool can set authentication challenge rules for a user:

```bash
authdbctl update user \
  --username jsmith \
  --email jsmith@localhost.localdomain \
  --realm local \
  --overwrite-auth-challenges "u2f" \
  --overwrite-auth-challenges "password totp if u2f not available" \
  --overwrite-auth-challenges "password if u2f and totp not available"
```

A successful response follows:

```json
{"auth_challenge_rules":["u2f","password totp if u2f not available","password if u2f and totp not available"],"status":"success","timestamp":"2026-03-25T10:30:00.000Z"}
```

The same operation is available via the Profile API. The request payload
uses the `challenges` key:

```json
{
  "challenges": [
    "u2f",
    "password totp if u2f not available",
    "password if u2f and totp not available"
  ]
}
```

For details on installing `authdbctl`, see
[Static Users](./local/50-static-users.md#password-generation).

## Caddyfile Configuration

Caddyfile support for authentication challenges is tracked in
[#470](https://github.com/greenpau/caddy-security/issues/470).

### Via Transform User Directive

The following directive forces a particular authentication challenges via `transform user` directive.
Here, the user should authenticate with `u2f` (Yubico or passkey only). If this method is not configured
for the user, i.e. not tokens in user database, then it should fallback to `totp` (authenticator app passcode).
If authenticator app is not configured, then default to password only.

```Caddyfile
transform user {
  match origin local
  require auth challenges u2f
  require auth challenges password totp if u2f not available
  require auth challenges password if u2f and totp not available
}
```

### Via Identity Store User Configuration

The same would apply when you add these requirements via user configuration
in the local identity store.

```Caddyfile
local identity store localdb {
  user jsmith {
    name John Smith
    email jsmith@localhost.localdomain
    auth challenges u2f
    auth challenges password totp if u2f not available
    auth challenges password if u2f and totp not available
  }
}
```

## Evaluation Examples

The following table shows the checkpoint sequence for different users
when the U2F-first ruleset is configured:

| User has registered | Matching rule | Checkpoint sequence |
|---------------------|--------------|---------------------|
| Hardware token + authenticator app | `u2f` | u2f |
| Hardware token only | `u2f` | u2f |
| Authenticator app only | `password totp if u2f not available` | password, totp |
| No MFA tokens | `password if u2f and totp not available` | password |

When the user has both a hardware token and an authenticator app, the
first rule matches because u2f is available. The authenticator app is
not used.

The following ruleset uses `or` to require any MFA method when at least
one is registered:

```
u2f or totp
password if u2f and totp not available
```

| User has registered | Matching rule | Checkpoint sequence |
|---------------------|--------------|---------------------|
| Hardware token + authenticator app | `u2f or totp` | u2f, totp |
| Hardware token only | `u2f or totp` | u2f, totp |
| Authenticator app only | `u2f or totp` | u2f, totp |
| No MFA tokens | `password if u2f and totp not available` | password |

When `or` is used, the rule matches if the user has at least one of the
listed types registered. All listed types become checkpoints. If the
user does not have a token for one of the types, they will be prompted
to register one during login.

## Editing the Identity Store Directly

Authentication challenge rules are stored in the user record in
`users.json`:

```json
{
  "username": "jsmith",
  "auth_challenge_rules": [
    "u2f",
    "password totp if u2f not available",
    "password if u2f and totp not available"
  ]
}
```

For details on the identity store file format, see
[Identity Store](./local/20-identity-store.md).
