---
sidebar_position: 1
title: "Messaging providers"
description: "Configure released SMTP/SMTPS and private file delivery, with accurate registration and template limits."
discovery:
  topic: operations
  kind: reference
  aliases: ["SMTP", "SMTPS", "notifications", "registration email", "mail spool"]
---

# Messaging Providers

Messaging providers deliver account-registration notifications. Define a provider in `security`, then attach it to a [local registration](../authenticate/local/40-user-registration.md) through `email provider <name>`. That registration setting can select an email **or file** provider.

The released workflow sends a registrant's confirmation and attempts an administrator notification after the verified request is stored in the dropbox. This does not implement account approval, automatic active-store provisioning, password-reset emails or email-based MFA. See [challenge support](../authenticate/13-authentication-challenges.md) before enabling a factor.

## Email Messaging Provider

The email provider supports `smtp` and `smtps`. Authentication uses SASL PLAIN with a named username/password credential. The release does not implement STARTTLS upgrade or OAuth mail authentication.

### Configuration

Use implicit TLS on the mail service's configured SMTPS endpoint:

```caddyfile
credentials outbound-mail {
  username {env.SMTP_USERNAME}
  password {env.SMTP_PASSWORD}
}

messaging email provider notifications {
  address smtp.example.com:465
  protocol smtps
  credentials outbound-mail
  sender no-reply@example.com "Example portal"
}
```

Put both blocks in `security`. The address includes the port; the server certificate must validate for its hostname. Attach `email provider notifications` to the registration registry. A successful syntax check does not prove network reachability or mail delivery.

`bcc` accepts addresses, but the released email implementation writes a Bcc header without issuing extra SMTP RCPT commands. Do not rely on it for copies, delivery or recipient privacy. Administrator registration messages use the registry's explicit `admin email` recipients instead.

#### Testing with Mock Email Server

Use a disposable mail sink bound to loopback only. For example, the [go-smtp debug server](https://github.com/emersion/go-smtp/tree/master/cmd/smtp-debug-server) can receive test mail; choose a pinned version if installing a tool. The [registration example](https://github.com/authcrunch/authcrunch.github.io/blob/main/assets/conf/local/registration/Caddyfile) targets `127.0.0.1:1025` with `protocol smtp` and `passwordless`.

Run a fresh test portal and sink, submit a synthetic account, inspect the confirmation, enter the new emailed code and check the dropbox and administrator message. Test a wrong code and failed delivery. Keep test messages private because their links and passcodes authorize the pending confirmation. Stop both servers afterward.

#### SMTP Server Message

A confirmation includes the registrant's address, an acknowledgement URL under `/auth/register/<realm>/ack/<id>` and a generated passcode. Treat SMTP acceptance as delivery to the sink, not proof a production mailbox received it. The pending registration remains inactive until your separate approval/provisioning process.

If sending the initial confirmation fails, the portal removes pending cache state and shows an error. If notifying an administrator fails **after** acknowledgement, the committed dropbox request remains and the error is logged. Review the dropbox independently of notification delivery.

### Passwordless

`passwordless` means the **SMTP connection** does not authenticate. It does not remove end-user password requirements or turn email into a login factor.

```caddyfile
messaging email provider local-sink {
  address 127.0.0.1:1025
  protocol smtp
  passwordless
  sender no-reply@example.com "Disposable test portal"
}
```

Use either `credentials` or `passwordless`, never both. Plain `smtp` does not encrypt the connection in this release; reserve the example above for a controlled loopback sink.

### TLS

`protocol smtps` opens TLS immediately and validates the server certificate using the system trust roots. It is not STARTTLS on a plaintext SMTP connection. A server that only offers STARTTLS requires a compatible external relay/transport arrangement; changing the port number alone does not implement an upgrade.

## File Messaging Provider

A file provider writes private `.eml` messages for local inspection or an external spool consumer. AuthCrunch does not run that mailer or deliver the files to a remote mailbox.

### Configuration

```caddyfile
messaging file provider private-spool {
  root_dir /var/lib/authcrunch/mail
  sender no-reply@example.com "Example portal"
}
```

Select `email provider private-spool` in the registry. The release creates a missing directory with mode `0700` and message files with mode `0600`. Pre-existing directory permissions remain the operator's responsibility. Keep the directory outside web roots, backups with broad readership and published site assets; remove expired test mail through your own retention process.

#### Email Message

Each message contains subject, recipient and encoded HTML content. The file implementation does not emit the configured From/Bcc headers. An external spool consumer must account for this rather than assuming a complete SMTP envelope is encoded in the file. Check the newly created file instead of copying the historical examples' links or passcodes.

## Messaging Templates

The provider parsers recognize these names:

| Name | Released workflow boundary |
| --- | --- |
| `registration_confirmation` | Used by registration submission |
| `registration_ready` | Used for attempted administrator notification after acknowledgement |
| `registration_verdict` | Supported by the library notification method; no complete portal approval workflow invokes it |
| `password_recovery` | Accepted configuration name; not a completed mail-based password recovery workflow |
| `mfa_otp` | Accepted configuration name; not a supported email MFA challenge |

The syntax `template <name> <path>` is accepted, but the released registration notification method renders **embedded English templates** and does not read the provider's configured template paths. A custom file, accepted configuration or visible reset/approval wording is therefore not evidence that the workflow or override runs.

Embedded registration bodies use context-aware HTML escaping and quoted-printable delivery. Keep confirmation credentials private. To change this behavior, verify a future implementation and its consuming workflow before treating template settings as effective customization.
