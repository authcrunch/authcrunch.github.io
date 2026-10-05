---
sidebar_position: 10
title: "Using the authentication portal"
description: "Follow a login, open applications, inspect your identity, and manage local passwords and authenticators in the current portal."
discovery:
  topic: login-and-mfa
  kind: guide
  aliases: ["user interface", "profile", "settings", "whoami", "security key"]
---

# Using the authentication portal

<span id="user-interface" />

The portal is the browser interface for signing in, opening application links,
and managing a local account. This guide follows a portal mounted at `/auth/`.
Replace that prefix if your deployment uses another mount.

The current screenshots were captured from **caddy-security v1.3.0 with
go-authcrunch v1.3.8**, using the [local learning example](../start/first-app.md)
and disposable demo accounts. Older screenshots remain beside each task as
historical references. Their lock logo, menus, and `/settings` URLs belong to an
earlier interface; **current account management is at `/auth/profile/`**.

## User Login

Open `/auth/login`, or request an application protected by an authorization
policy. For a local account, enter your username or email and choose **Proceed**.
The next screen asks for your password. If the account requires more challenges,
complete those before the portal issues an access token.

For an external provider, choose its sign-in option. You authenticate on its
site and return through the configured OAuth or SAML callback. Its password and
MFA stay with that provider.

<figure className="doc-screenshot">

[![Current portal sign-in page with a username or email field and Proceed button.](./images/portal-v1-3-0-login.png)](./images/portal-v1-3-0-login.png)

<figcaption>The released portal uses the current AuthCrunch branding. Attached identity sources determine the sign-in options.</figcaption>
</figure>
<figure className="doc-screenshot">

[![Current password checkpoint for the disposable Alice account.](./images/portal-v1-3-0-password.png)](./images/portal-v1-3-0-password.png)

<figcaption>Identifying the account starts the local flow; login is complete only after all required checkpoints.</figcaption>
</figure>
<details className="screenshot-gallery">
<summary>Earlier sign-in and password screens</summary>

<figure className="doc-screenshot">

[![Earlier username form showing a webadmin demonstration account.](./images/authp_demo_01.png)](./images/authp_demo_01.png)

<figcaption>Earlier username step; the current action is Proceed.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Earlier password checkpoint with a masked password and Authenticate button.](./images/authp_demo_02.png)](./images/authp_demo_02.png)

<figcaption>The historical reset-password link is not evidence of an implemented recovery workflow in the current release.</figcaption>
</figure>

</details>

## Portal

After login, `/auth/portal` displays configured application links. In the
learning example, choose **Example app**. A visible link is navigation, not an
access grant: the destination still needs its own authorization policy.

Administrators add links with [`ui links`](55-ui-features.md#portal-links), or add
identity-specific links with [transforms](42-user-transforms.md#add-ui-links).
The current default screen does not automatically add every profile or identity
link; visit those paths directly or ask your administrator to add them.

<figure className="doc-screenshot">

[![Current Applications page with Example app and Sign Out links.](./images/portal-v1-3-0-applications.png)](./images/portal-v1-3-0-applications.png)

<figcaption>Alice can use Example app. Bob sees the same link but receives 403 from its policy.</figcaption>
</figure>
<details className="screenshot-gallery">
<summary>Earlier portal landing page</summary>

<figure className="doc-screenshot">

[![Earlier Welcome page with AuthDB, My Identity, Portal Settings, and Logout links.](./images/authp_demo_03.png)](./images/authp_demo_03.png)

<figcaption>These links were part of the older example configuration; current links depend on your deployment.</figcaption>
</figure>

</details>

## User Identity (whoami)

Open `/auth/whoami` to inspect the current portal identity. Check its subject,
realm, roles, and expiry when diagnosing a policy denial. These are the claims
issued after portal mappings; they may differ from the original provider claims.
Treat identity data as private when sharing screenshots.

For programmatic access, see the [Portal API](api/20-portal-api.md). A successful
identity response alone does not prove that an application policy allows access.

<figure className="doc-screenshot">

[![Current identity view for Alice showing her local realm and app/member role.](./images/portal-v1-3-0-identity.png)](./images/portal-v1-3-0-identity.png)

<figcaption>This disposable identity includes the role required by the learning example.</figcaption>
</figure>
<details className="screenshot-gallery">
<summary>Earlier identity view</summary>

<figure className="doc-screenshot">

[![Earlier JSON identity display for a local administrator.](./images/authp_demo_04.png)](./images/authp_demo_04.png)

<figcaption>Historical claims from 2021. Do not grant administrator roles merely to make an application accessible.</figcaption>
</figure>

</details>

## User Settings

Open **`/auth/profile/`** for the current account dashboard. Local accounts with
`authp/user` or `authp/admin` can use the [Profile API](api/30-profile-api.md)
behind this interface to manage their password, authenticators, API keys, and
public SSH/GPG keys. A guest does not have profile-management permission.

An OAuth, SAML, or LDAP login does not turn into a local account. Manage those
credentials at their identity source; current profile-management operations
support local identities. The profile also depends on a live portal session,
not just possession of a signed token.

<figure className="doc-screenshot">

[![Current local dashboard with key counts, user information, roles, and Change Password.](./images/portal-v1-3-0-profile.png)](./images/portal-v1-3-0-profile.png)

<figcaption>The current User Profile replaces the earlier Settings interface.</figcaption>
</figure>

### Password Management

Choose **Change Password** in the local profile. Supply your current password
and confirm the new one, then verify it with a fresh login. Follow
[Local password management](local/30-password-management.md) for administrator
hash generation and password policy. Password changes and browser logout are
separate actions.

<details className="screenshot-gallery">
<summary>Earlier password form and authenticator list</summary>

<figure className="doc-screenshot">

[![Earlier Settings page with current, new, and confirmation password fields.](./images/authp_demo_05.png)](./images/authp_demo_05.png)

<figcaption>The old form illustrates the three inputs; use Change Password in the current profile.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Earlier MFA settings showing no registered devices.](./images/authp_demo_06.png)](./images/authp_demo_06.png)

<figcaption>This is the authenticator list, despite its position in the old password gallery.</figcaption>
</figure>

</details>

### Add U2F Token (Yubico)

Use the profile's MFA controls to enroll a security key or supported WebAuthn
credential. Follow the browser or operating system prompt, confirm the credential
appears in the account, and test a fresh login. The earlier UI uses **U2F**;
current authentication also supports WebAuthn credentials. Enrollment alone does
not make login passwordless: [challenge rules](13-authentication-challenges.md)
determine the factors and their order.

<details className="screenshot-gallery">
<summary>Earlier security-key enrollment and operating system prompts</summary>

<figure className="doc-screenshot">

[![Earlier Add U2F Security Key form with a comment and Register button.](./images/authp_demo_07.png)](./images/authp_demo_07.png)

<figcaption>Name the credential before registration.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Windows Security confirming security-key setup for the demonstration account.](./images/authp_demo_08.png)](./images/authp_demo_08.png)

<figcaption>A historical system prompt; current prompts depend on the browser and authenticator.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Windows Security asking the user to touch the security key.](./images/authp_demo_09.png)](./images/authp_demo_09.png)

<figcaption>Complete the authenticator physical-presence prompt.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Earlier confirmation that a U2F token was added.](./images/authp_demo_10.png)](./images/authp_demo_10.png)

<figcaption>Successful enrollment precedes a separate login test.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Earlier registered hardware credential with Delete and Test actions.](./images/authp_demo_11.png)](./images/authp_demo_11.png)

<figcaption>Identify the saved credential before testing or deleting it.</figcaption>
</figure>

</details>

### Add Authenticator App

Enroll a TOTP authenticator through the profile's MFA controls. Scan the QR code
from **your own account**, enter a current code to confirm enrollment, and verify
a fresh login. The QR code contains an authenticator secret and must be kept
private. The archived example is illustrative; do not scan it for your account.

See [Multi-factor authentication](11-mfa.md) for requirements and enrollment.

<details className="screenshot-gallery">
<summary>Earlier TOTP enrollment and Microsoft Authenticator examples</summary>

<figure className="doc-screenshot">

[![Earlier authenticator form with a label, comment, and Get QR Code action.](./images/authp_demo_12.png)](./images/authp_demo_12.png)

<figcaption>The label identifies this portal in the authenticator app.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Older Microsoft Authenticator Add Account menu with an Other option.](./images/ms_mfa_app_add_account.png)](./images/ms_mfa_app_add_account.png)

<figcaption>Use a generic TOTP account flow; app menu wording changes across versions.</figcaption>
</figure>

<figure className="doc-screenshot">

[![An older Microsoft Authenticator account displaying a time-limited example code.](./images/ms_mfa_app_new_account.png)](./images/ms_mfa_app_new_account.png)

<figcaption>The app generates a new code periodically. This expired example is not a code to reuse.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Older Microsoft Authenticator camera view scanning an enrollment code.](./images/ms_mfa_app_scan_qrcode.png)](./images/ms_mfa_app_scan_qrcode.png)

<figcaption>Scan the code from your signed-in account.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Earlier demonstration QR enrollment screen and confirmation-code field.](./images/authp_demo_13.png)](./images/authp_demo_13.png)

<figcaption>Historical demonstration only. Never share an enrollment QR code from a real account.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Earlier MFA list with a hardware key and a six-digit, 30-second TOTP authenticator.](./images/authp_demo_14.png)](./images/authp_demo_14.png)

<figcaption>Registered factors and required login challenges are separate settings.</figcaption>
</figure>

</details>

## Multi-Factor Authentication

During a local login, the portal can ask for an authenticator code or a
security-key interaction after the password. If `require mfa` applies and the
account has no factor, login requires enrollment. Custom challenge rules can
change the sequence and fallbacks. For federated logins, configure MFA at the
upstream identity provider.

Read [MFA](11-mfa.md) and [Authentication challenges](13-authentication-challenges.md)
before changing a local account's requirements.

<details className="screenshot-gallery">
<summary>Earlier factor selection and verification prompts</summary>

<figure className="doc-screenshot">

[![Earlier factor selection offering an authenticator app or hardware token.](./images/authp_demo_15.png)](./images/authp_demo_15.png)

<figcaption>Choosing an available factor differs from passing every checkpoint in an explicit sequence.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Earlier authenticator challenge with an example code and Verify action.](./images/authp_demo_16.png)](./images/authp_demo_16.png)

<figcaption>Use a current code from your own app. The historical recovery-code link does not establish a supported recovery workflow.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Earlier hardware challenge with a Windows Security touch-your-key prompt.](./images/authp_demo_17.png)](./images/authp_demo_17.png)

<figcaption>Complete the authenticator prompt on the expected portal origin.</figcaption>
</figure>

</details>

## Sign out and diagnose problems

Choose **Sign Out**, or open `/auth/logout`. In the learning example, a fresh
request to `/app` then requires login. This does not by itself end upstream SSO
or revoke every copy of an access token; see [Logout](15-logout.md).

| Symptom | Next check |
| --- | --- |
| Login repeatedly restarts | [Cookie scope and key consistency](../troubleshoot.md#the-browser-returns-to-login) |
| Login succeeds but app returns 403 | Compare roles with the [application policy](../troubleshoot.md#login-works-but-the-app-returns-403) |
| An old Settings link returns 404 | Update it to `/auth/profile/`, using your actual prefix |
| Profile data cannot load | Confirm local login, profile permission, and a live session; consult the [Profile API](api/30-profile-api.md) |
| Login ends on Applications instead of the requested page | Check [trusted redirects](100-trust-login-logout.md) |
