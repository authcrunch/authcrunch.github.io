---
title: "Local password management"
description: "Generate bcrypt or Argon2id hashes and change a local password through the current profile interface."
discovery:
  topic: operations
  kind: guide
  aliases: ["authdbctl", "password hash", "bcrypt", "Argon2id"]
---

# Local password management

Local passwords support **bcrypt and Argon2id** in caddy-security v1.3.0 /
go-authcrunch v1.3.8. A federated user changes their password at their identity
provider; signing into the portal does not grant control of a local account.

## Manually

Use the released executable's password utility. It prompts without terminal echo:

```sh
authcrunch security local generate password hash
authcrunch security local generate password hash --algorithm argon2
```

Bcrypt is the default, cost 10. Argon2 selects Argon2id; defaults are 65536 KiB,
three iterations and four lanes. The output is a quoted **Caddyfile password
directive**, ready for [static-user provisioning](50-static-users.md). Review
resource use before changing cost parameters; `--cost` is bcrypt-only.

For automation, `--password-file /private/password.txt` requires an owner-only
file, or `--password-file -` reads stdin. One final LF/CRLF is removed; other
whitespace is preserved. `--db-path` reads the existing password policy without
modifying the database. Do not put a production password on a command line.

A compatible standalone CLI can be installed at the matching version:

```sh
go install github.com/greenpau/go-authcrunch/cmd/authdbctl@v1.3.8
```

Its [released command guide](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/cmd/authdbctl/README.md)
explains server configuration and updates. Do not assume installing `@latest`
changes the library inside a previously built Caddy server.

Prefer a supported account mutation over replacing a JSON hash by hand. Manual
file repair requires a stopped writer and coherent backup; it must preserve
algorithm and security metadata. A password change invalidates prior credential
evidence, so verify a fresh login and old refresh/OIDC credential rejection.

## Settings Page

For a local account with `authp/user` or `authp/admin`, sign in and open
`/auth/profile/`, then choose password management. A live completed portal session
is required. The old `/auth/settings` route is not available in this release.

1. Confirm the selected local account and enter the current password.
2. Enter and confirm a new password that satisfies the store's policy.
3. Submit the change and sign in again with the new credential.
4. Verify that the old password fails and required MFA still applies.

<details className="screenshot-gallery">
<summary>Password-change sequence captured in March 2026</summary>

<figure className="doc-screenshot">
  <img src={require('./images/local_password_change_1.png').default} alt="Username step before a local password change" />
  <figcaption>Enter the username, then complete the password and any required MFA steps.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/local_password_change_2.png').default} alt="Applications page with a User Profile link" />
  <figcaption>Select the configured User Profile link, or open `/auth/profile/` directly.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/local_password_change_3.png').default} alt="Local profile dashboard with Change Password highlighted" />
  <figcaption>Select password management for your local account.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/local_password_change_4.png').default} alt="Local profile password-change dialog" />
  <figcaption>Verify the current password and submit a policy-compliant replacement; current field layout may differ.</figcaption>
</figure>

</details>

The released recovery endpoint does not provide a complete forgotten-password
service. Establish an administrator-assisted recovery process rather than
promising reset links that the implementation cannot complete.
