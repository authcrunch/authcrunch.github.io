---
description: "Collect local registration requests, verify email, and understand the separate approval and provisioning boundary."
discovery:
  topic: login-and-mfa
  kind: guide
  aliases: ["sign up", "enrollment", "SMTP"]
---

import CodeBlock from '@theme/CodeBlock';
import example from '@site/assets/conf/local/registration/Caddyfile?raw';

# User Registration

Registration collects a local account request and verifies its email before
saving a password-hashed record in a **separate registration dropbox**. It does
not automatically approve an account in the active login database or grant an
application role. Plan the administrator's approval/provisioning step before
offering this form to users.

## Configuration

This complete example attaches a registry to `localdb` and the explicit `local`
realm. The portal enables that store; there is no separate `enable registration`
portal directive. It uses a **loopback test mail sink** at port 1025.

<CodeBlock language="caddyfile" title="assets/conf/local/registration/Caddyfile">{example}</CodeBlock>

Set private `AUTHCRUNCH_REGISTRATION_CODE` and `AUTHCRUNCH_SIGNING_KEY` values,
prepare private writable database paths, and provide the terms/privacy pages.
For deployment, replace the test mail sink with a configured
[messaging provider](../../messaging/intro.md) and credentials. `passwordless`
means no SMTP authentication here, not passwordless user registration.

| Setting | Purpose |
| --- | --- |
| `dropbox` | Private registration database, distinct from the active user database |
| `identity store localdb local` | Store nickname and explicit registration realm |
| `code` | Invitation value entered on the form; distinct from the emailed verification passcode |
| `require accept terms`, `link terms`, `link privacy` | Required acknowledgement and published policy links |
| `require domain mx` | Optional DNS MX check; not proof of mailbox ownership |
| `email provider`, `admin email` | Confirmation delivery and administrator notification |

The historical `disabled on` setting is not supported by this registry grammar.
To stop offering registration, remove its registry definition from the deployed
configuration. A registration password must be a real password; hash-import
strings are deliberately rejected on this untrusted boundary.

## Email Domain Restrictions

### Domain Restrictions Syntax

```text
<allow|deny> [exact|partial|prefix|suffix|regex] domain PATTERN
```

Rules are evaluated in order; the **first match** decides. With rules present,
the unmatched default is the opposite of the last configured action. Use exact
allow rules for a closed domain list. Partial/prefix/suffix and unanchored regex
rules can admit lookalike names; a domain restriction is not an email-verification
or organization-membership assertion.

### Trusted Email Domains

```caddyfile
allow exact domain example.com
allow exact domain subsidiary.example.com
```

Unmatched domains are denied because the last action is allow. These two domains
are explicit; subdomains are not automatically included.

### Untrusted Email Domains

```caddyfile
deny exact domain blocked.example
```

A deny-only list allows unmatched domains. It is not equivalent to a closed
invitation policy and does not prevent arbitrary other email domains.

### Mixture of Allow and Deny Domains

For `deny ...` then `allow ...`, unmatched domains are denied. Reversing that
order makes unmatched domains allowed. Overlapping rules use the first match.
Test intended, unintended and lookalike domains before exposing the form.

<span id="registration-worflow"></span>

## Registration workflow

### Accessing the Registration Page

Open `/auth/register/local` or the login page's registration link. Registration
is for anonymous users, not an account-edit screen for an already signed-in user.

### Filling Out the Registration Form

Supply the username, email, password and required acknowledgement/invitation code.
The form and backend enforce their configured policies. Do not submit a password
hash or assume an email suffix alone grants application membership.

### Initial Confirmation

The portal sends a confirmation message and retains temporary registration state.
Restart loses that pending state. The released cache defaults to a 60-minute
lifetime. The screen's 15-minute delivery estimate is not an expiry deadline, and
the older email's 45-minute wording differs from that cache lifetime. Complete promptly and start again after expiry.

### Receiving the Verification Email

Use the new link and passcode delivered to **your own mailbox**. The invitation
code from configuration and the generated emailed passcode serve different
purposes. Do not reuse values visible in the historical demonstration below.

### Entering the Passcode

The acknowledgement verifies the generated passcode, consumes pending state and
writes the account request into the registration dropbox. An expired or mismatched
request does not create an active account.

### Administrative Approval

The administrator receives a notification. The released implementation has no
complete approval UI or automated dropbox-to-active-store transfer. The final
screen's promise of an approval email describes the intended workflow, not a
completed administrative service.

Review requests and provision approved accounts through your established local
account management process. Offline record migration must stop both writers,
back up both databases, preserve schema/IDs/credential metadata and assign only
reviewed roles. Do not casually paste an entire registration database over
`users.json`. Keep an application role separate from the request's portal role,
and verify an approved user's fresh login and denied access before that grant.

<details className="screenshot-gallery">
<summary>Historical registration screens and email</summary>

<figure className="doc-screenshot">
  <img src={require('./images/register_button.png').default} alt="Historical login card with its registration link" />
  <figcaption>Registration entrance; current branding and mount follow your deployment.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/user_registration_form.png').default} alt="Historical local-account registration form" />
  <figcaption>Account details, invitation code and policy acceptance. Use your own code and current form.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/user_registration_confirmation.png').default} alt="Historical confirmation asking the registrant to check email" />
  <figcaption>Pending verification; the 15-minute text estimates email delivery, not credential expiry.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/user_registration_email_body.png').default} alt="Historical demonstration email containing a registration link and passcode" />
  <figcaption>Demonstration only; fresh links and codes are delivered by your configured mail provider.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/user_registration_passcode_verification.png').default} alt="Historical emailed-passcode verification form" />
  <figcaption>Verify the generated passcode, distinct from the invitation code.</figcaption>
</figure>
<figure className="doc-screenshot">
  <img src={require('./images/user_registration_passcode_complete.png').default} alt="Historical registration acknowledgement mentioning administrator approval" />
  <figcaption>The request is stored for review; the advertised approval workflow is not automatically implemented.</figcaption>
</figure>

</details>

## Testing with Mock Email Server

Use an isolated, loopback-only SMTP sink on port 1025 with disposable accounts.
Inspect confirmation and administrator messages locally. Such a sink prints or
stores verification credentials; it is not production delivery.

Test the permitted domain, denied/lookalike domains, wrong invitation code,
missing terms, duplicate username/email, wrong verification passcode, expiry and
a restart between submission and verification. Confirm that the active user
store is unchanged until your separate provisioning step. Stop the mail sink
and test portal when finished.

## Multiple Realms

Use a distinct registration nickname and dropbox per enabled local store.
Supply the intended realm explicitly in `identity store NICKNAME REALM` and visit
`/auth/register/REALM`. A portal accepts one attached registry per store. Sharing
a dropbox or confusing the nickname with the realm defeats that separation.
