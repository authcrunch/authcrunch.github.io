---
sidebar_position: 11
title: "Multi-factor authentication"
description: "Require multi-factor authentication for local users and enroll an authenticator application."
discovery:
  topic: login-and-mfa
  kind: guide
  aliases: ["MFA", "2FA", "TOTP", "authenticator"]
---

# Multi-factor authentication

For local accounts, the portal can require a password followed by a registered
TOTP authenticator or WebAuthn credential. An external OAuth, SAML or LDAP
provider's own MFA is a separate policy at that provider; `require mfa` does not
turn an upstream login into a local enrollment workflow.

## Enabling MFA

Add this fragment to an otherwise working local portal:

```caddyfile
transform user {
    match realm local
    require mfa
}
```

Match the store's **realm**, not just the fact that it is a local store. Start
with the [first application](../start/first-app.md), then enable MFA for its local
realm. Keep application roles and signing keys unchanged while testing the
additional checkpoint.

Without an explicit challenge policy, local login normally requires a password
and any configured MFA. `require mfa` adds the MFA requirement, including enrollment
when no usable token exists. Creating a token changes credential state: enrollment
is not proof that a subsequent login checkpoint has passed. Complete a fresh
login with the newly registered method.

For a deliberate passwordless or ordered-method policy, use
[authentication challenges](13-authentication-challenges.md). A password-only
fallback explicitly weakens that policy; choose it only when intended.

## Add MFA Authenticator Application

For an already signed-in local user with `authp/user` or `authp/admin`, open
`/auth/profile/`, then choose MFA and add an authenticator application. First-login
enrollment may instead appear in the sandbox flow when the policy requires it.

1. Use HTTPS and confirm that you are enrolling the intended account.
2. Add an account in a TOTP application and scan the **new QR displayed by your
   own portal**, or enter its secret manually.
3. Give the token a recognizable comment and submit the verification code
   requested by the current form. The current profile form uses one code;
   the historical form below requested two consecutive codes.
4. Finish enrollment and sign in again. Confirm that a password alone does not
   complete login, a wrong/expired code is rejected, and the current code succeeds.

The provisioning URI follows the [authenticator key URI format](https://github.com/google/google-authenticator/wiki/Key-Uri-Format).
Synchronize the server and authenticator clocks. The enrollment secret and QR are
credentials; the historical demonstration below must never be reused as a real
account's secret.

<figure className="doc-screenshot">
  <a href={require('./images/settings_mfa_app.png').default}><img src={require('./images/settings_mfa_app.png').default} alt="Historical authenticator enrollment showing a QR and two code fields" /></a>
  <figcaption>Historical Settings UI. Current account management is at `/profile/` and its TOTP form differs; use the QR and verification fields displayed by your running release.</figcaption>
</figure>

<details className="screenshot-gallery">
<summary>Historical Microsoft Authenticator enrollment sequence</summary>

<figure className="doc-screenshot">
  <img src={require('./images/ms_mfa_app_add_account.png').default} alt="Microsoft Authenticator add-account menu" />
  <figcaption>Add the account type supported by your authenticator's current interface.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/ms_mfa_app_scan_qrcode.png').default} alt="Microsoft Authenticator camera scanning the portal enrollment screen" />
  <figcaption>Scan your own portal's fresh enrollment QR; this older image illustrates the camera step.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/ms_mfa_app_new_account.png').default} alt="An AuthCrunch account added to Microsoft Authenticator" />
  <figcaption>The authenticator produces time-based codes after enrollment.</figcaption>
</figure>

</details>

## Hardware tokens and passkeys

WebAuthn enrollment and assertion require a secure browser origin. Keep the
portal hostname stable; credentials are bound to its relying-party identity.
The historical `u2f` keyword selects this hardware/passkey checkpoint. Issuing
an assertion challenge alone does not complete authentication.

Test the actual browser and device combinations you support. A discoverable
passkey is not an automatic promise of username-free login in this portal.
Maintain a reviewed recovery process with a local administrator; the released
`/recover` handler does not implement a complete password or MFA recovery flow.
