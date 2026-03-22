---
sidebar_position: 1
---

# Messaging Providers

The `security` app's sub-systems require messaging capabilities to facilitate essential identity
workflows, such as Multi-Factor Authentication (MFA) codes, user registration confirmations,
and password reset links.

The system currently supports two primary messaging backends:

1. Email: For direct delivery via SMTP/SMTPS.
2. File: For integration with local mail spoolers or directory-based delivery systems

## Email Messaging Provider

The `email` provider connects to a mail server to dispatch messages. It supports standard SMTP,
secure SMTPS, and various authentication methods.

### Configuration

Use this setup for mail servers requiring specific credentials.

```Caddyfile
{
  security {
    messaging email provider localhost-smtp-server {
      address 127.0.0.1:1025
      protocol smtp
      credentials root@localhost
      sender root@localhost "My Auth Portal"
      bcc greenpau@localhost
    }
  }
}
```

#### Testing with Mock Email Server

The following command installs `smtp-debug-server`

```bash
go install github.com/emersion/go-smtp/cmd/smtp-debug-server@latest
```

```text
$ ls -alh ~/dev/bin/smtp-debug-server
-rwxr-xr-x@ 1 greenpau  staff   7.0M Mar  9 09:00 /Users/greenpau/dev/bin/smtp-debug-server
```

Start the server:

```text
$ smtp-debug-server
2026/03/09 09:02:31 Starting SMTP server at 127.0.0.1:1025
```

Once the mock email server is running, you can test the registration workflow without
needing a live mail provider. When you submit the registration form, the system connects
to the server at `127.0.0.1:1025` and transmits the message. The `smtp-debug-server` will
then output the raw email content directly to your terminal.

#### SMTP Server Message

Here is an example of a message the SMTP server will receive:

```text
2026/03/22 11:51:17 Starting SMTP server at 127.0.0.1:1025
220 localhost ESMTP Service Ready
EHLO localhost
250-Hello localhost
250-PIPELINING
250-8BITMIME
250-ENHANCEDSTATUSCODES
250-CHUNKING
250 SIZE
MAIL FROM:<root@localhost> BODY=8BITMIME
250 2.0.0 Roger, accepting mail from <root@localhost>
RCPT TO:<greenpau@outlook.com>
250 2.0.0 I'll make sure <greenpau@outlook.com> gets this
DATA
354 Go ahead. End your data with <CR><LF>.<CR><LF>
MIME-Version: 1.0
Date: Sun, 22 Mar 2026 11:51:24 -0400
From: "My Auth Portal" <root@localhost>
Subject: Registration Confirmation Required
Thread-Topic: Account Registration.
Message-ID: <wMMZJXnIfDivJlbSyLV7EVZu6JQH5ck0rHTrXOUFY9De28UndkFk4nyzvO64QXlH.root@localhost>
To: greenpau@outlook.com
Bcc: greenpau@localhost
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="utf-8"

<html>
  <body>
    <p>
      Please confirm your registration by clicking this
      <a href=3D"https://auth.myfiosgateway.com:8443/auth/register/local/ac=
k/YiHLj1xbFB7ODSZhgoLId1fHngVvPIbXjpzTyxOMO4eBjMvzG8DXXTwNQTdyHzLa0kuViGUae=
jQI6">link</a>
      and providing the registration code <b><code>j3kNpD</code></b>
      within the next 45 minutes. If you haven't done so, please re-registe=
r.
    </p>

    <p>The registation metadata follows:</p>
    <ul style=3D"list-style-type: disc">
      <li>Session ID: ctXaWd8UVMyY4mZLDfQuWSuVK8zXwYocYyqOtgr</li>
      <li>Request ID: a2174fe0-c3af-48e6-814c-7098ee3f32ff</li>
      <li>Username: <code>greenpau</code></li>
      <li>Email: <code>greenpau@outlook.com</code></li>
      <li>IP Address: <code>192.168.99.182</code></li>
      <li>Timestamp: Sun Mar 22 15:51:24 UTC 2026</li>
    </ul>
  </body>
</html>
.
250 2.0.0 OK: queued
QUIT
221 2.0.0 Bye
^C
```

### Passwordless

The `passwordless` allows skipping password requirement for the provided credentials.

```Caddyfile
{
  security {
    messaging email provider localhost-smtp-server {
      passwordless
    }
  }
}
```

### TLS

The `protocol smtps` enables TLS for the connection.

```Caddyfilefile
{
  security {
    messaging email provider localhost-smtp-server {
      protocol smtps
    }
  }
}
```

## File Messaging Provider

The `file` provider is utilized for systems where mail is processed via a **drop-folder** or **mail spool**. Instead
of communicating over a network protocol, the provider writes the message content into a directory. This allows
external mailers (like Postfix or custom scripts) to pick up and process the message.

### Configuration

Specify the `root_dir` where the system should drop the outgoing message files.

```Caddyfile
{
  security {
    messaging file provider mail-spooler {
      root_dir /var/spool/auth-messaging/
      sender root@localhost "My Auth Portal"
    }
  }
}
```

#### Email Message

The server logs the realm and the user information:

```text
2026/03/22 20:48:22.878 DEBUG   security        Created registration cache entry        {"session_id": "ctXaWd8UVMyY4mZLDfQuWSuVK8zXwYocYyqOtgr", "request_id": "4799120e-2522-4029-924f-64a03fc8cb1f", "registration_id": "TauuHTBQ9iqopZ3hR4k653FlJhpfxwCLpgO96TivSepPK1lCvu5qjFNr9P2SW8f0", "realm_name": "local"}
2026/03/22 20:48:22.879 INFO    security        Successful user registration    {"session_id": "ctXaWd8UVMyY4mZLDfQuWSuVK8zXwYocYyqOtgr", "request_id": "4799120e-2522-4029-924f-64a03fc8cb1f", "username": "greenpau", "email": "greenpau@outlook.com", "src_ip": "192.168.99.182", "src_conn_ip": "192.168.99.182", "realm_name": "local"}
```

Additionally, the `security` app created `assets/config/eIs5Ys2UxNIp1JvRHdjb7IoIKBpmNUWb.eml` file.

```eml
MIME-Version: 1.0
Date: Sun, 22 Mar 2026 16:48:22 -0400
Subject: Registration Confirmation Required
Thread-Topic: Account Registration.
Message-ID: <eIs5Ys2UxNIp1JvRHdjb7IoIKBpmNUWbKaUNWLW6iXbnzns7XwUghmyvGH4CPRAy>
To: greenpau@outlook.com
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="utf-8"

<html>
  <body>
    <p>
      Please confirm your registration by clicking this
      <a href=3D"https://auth.myfiosgateway.com:8443/auth/register/local/ac=
k/TauuHTBQ9iqopZ3hR4k653FlJhpfxwCLpgO96TivSepPK1lCvu5qjFNr9P2SW8f0">link</a=
>
      and providing the registration code <b><code>usebXgb</code></b>
      within the next 45 minutes. If you haven't done so, please re-registe=
r.
    </p>

    <p>The registation metadata follows:</p>
    <ul style=3D"list-style-type: disc">
      <li>Session ID: ctXaWd8UVMyY4mZLDfQuWSuVK8zXwYocYyqOtgr</li>
      <li>Request ID: 4799120e-2522-4029-924f-64a03fc8cb1f</li>
      <li>Username: <code>greenpau</code></li>
      <li>Email: <code>greenpau@outlook.com</code></li>
      <li>IP Address: <code>192.168.99.182</code></li>
      <li>Timestamp: Sun Mar 22 20:48:22 UTC 2026</li>
    </ul>
  </body>
</html>
```

## Messaging Templates

Messaging templates allow you to customize the content and look of the notifications sent by the
security app. Each template maps a specific identity workflow event to a physical file on your
system (typically HTML or text).

To define a template, use the following syntax within a messaging provider block:

```Caddyfilefile
template <name> <path>
```

The `name` is the identifier for the workflow event.

The `path` is the absolute or relative path to the template file.

The security configuration recognizes the following template names:

| Name | Description |
| :--- | :--- |
| `password_recovery` | Sent when a user requests a password reset link. |
| `registration_confirmation` | Sent to verify a user's email address during sign-up. |
| `registration_ready` | Sent to administrators or users when a registration is ready for review. |
| `registration_verdict` | Sent to the user once their registration has been approved or denied. |
| `mfa_otp` | Sent during login to provide a Multi-Factor Authentication one-time passcode. |


Here, we associate specific HTML files with the email provider to brand the identity emails.

```Caddyfile
{
  security {
    messaging email provider mail-server {
      # Mapping workflows to template files
      template mfa_otp /etc/caddy/templates/mfa.html
      template password_recovery /etc/caddy/templates/recovery.html
      template registration_confirmation /etc/caddy/templates/confirm.html
    }
  }
}
```