# User Registration

## Configuration

The provided configuration defines the security and communication backbone for the
registration workflow, specifically linking the user interface to the backend services.

It establishes a local email provider named `localhost-smtp-server` operating
on `127.0.0.1:1025`, which handles the delivery of the verification passcodes seen
in the registration process.

The `user registration` block, labeled `localdbRegistry`, configures the specific
behavior of the form: it enforces the "NY2020" registration code, requires users to
accept terms, and validates email domains via MX records. Furthermore, it
designates `localdb` as the identity store for saving user credentials and specifies
that registration data should be backed up to a JSON "dropbox" file.

```text
	security {
		credentials root@localhost {
			username root
			password foobar
		}

		messaging email provider localhost-smtp-server {
			address 127.0.0.1:1025
			protocol smtp
			passwordless
			sender root@localhost "My Auth Portal"
			bcc greenpau@localhost
		}

		user registration localdbRegistry {
			dropbox assets/config/registrations.json
			title "User Registration"
			code "NY2020"
			require accept terms
			require domain mx
			email provider localhost-smtp-server
			admin email admin@localhost
			identity store localdb
		}

	}
```

The newly registered users will appear in the `registrations.json` file.
An administrator must manually move entries from `registrations.json`
to `users.json` file.

The parameters are:

* `dropbox`: The file path pointing to registration database.
* `code`: The registration code. A user must know what that code is to
  successfully submit a registration request.
* `require accept terms`: A user must accept terms and conditions, as well
  as privacy policy to proceed
* `disabled on`: disables user registration
* `title`: changes the title of the registration page
* `require domain mx`: forces the check of domain MX record
* `admin email`: defines the email recipients after a registrant clicked
  email confirmation link and provided valid code

## Email Domain Restrictions

### Domain Restrictions Syntax

The `allow` and `deny` directives support various matching strategies to provide flexibility
when defining domain boundaries. By default, the system performs an **exact** match, but
you can specify different modes to handle subdomains or complex patterns.

```text
<allow|deny> [exact|partial|prefix|suffix|regex] domain <domain>
```

The domain matching strategies are:

* `exact` (Default): The domain must match the input string precisely, e.g. `allow exact domain foo.com` will
  not match `user@sub.foo.com`.
* `partial`: Matches if the specified string appears anywhere within the domain name.
* `prefix`: Matches if the domain starts with the specified string, e.g. `deny prefix domain dev-` would
  block `dev-portal.com` and `dev-testing.org`.
* `suffix`: Useful for capturing all subdomains, e.g. `allow suffix domain .edu` would permit
  any educational institution, while `allow suffix domain .foo.com` would permit `a.foo.com` and `b.foo.com`.
* `regex`: Allows for complex pattern matching using regular expressions. This is powerful for advanced
  filtering needs where standard string matching is insufficient.


```text
user registration localdbRegistry {
    # Allow any subdomain of microsoft.com
    allow suffix domain .microsoft.com
    
    # Block any domain starting with "gmail" or "outlook"
    deny regex domain ^(gmail|outlook).*
}
```

### Trusted Email Domains

The registration system allows administrators to restrict sign-ups to specific, trusted email
providers. This is achieved using the `allow domain` directive, which creates
a **permit-only list** of approved domains.

When these directives are present in the `user registration` block, the system enforces a strict
validation check on the user's provided email address. Any registration attempt using a domain not
explicitly listed—such as a personal or unauthorized address—will be automatically blocked. This
ensures that only users from designated organizations (e.g., `foo.com` or `bar.com`) can
access the registration form, streamlining the onboarding process for corporate or private
environments and reducing the volume of unauthorized requests for administrators to review.

```text
    user registration localdbRegistry {
        allow domain foo.com
        allow domain bar.com
    }
```

If there are no `deny` statements, then the registration system applies **default deny**.

### Untrusted Email Domains

In addition to permitting specific domains, you can explicitly block untrusted or high-risk
email providers using the `deny domain` directive. This creates an **exclusion list** that
prevents registrations from specific sources, such as known disposable email services or
competitors, while potentially leaving the rest of the internet open for registration.

```text
    user registration localdbRegistry {
        deny domain anonymous-mail.com
        deny domain temporary-inbox.org
    }
```

When a user attempts to register, the system cross-references their email domain against
this list. If a match is found, the registration is immediately halted with an error message. This
is an effective first line of defense against spam and bot registrations, ensuring that only
legitimate email providers can reach the verification stage.

If there are no `allow` statements, then the registration system applies **default allow**.

### Mixture of Allow and Deny Domains

In the case where there are mixture of `allow` and `deny` statements, the default action
will be the opposite of the last action in the list.

For example, the following configuration results in **default deny**.

```text
deny domain foo.com
allow domain bar.com
```

Contrast with the following configuration where it results in **default allow**.

```text
allow domain bar.com
deny domain foo.com
```

## Registration Worflow

### Accessing the Registration Page

On the initial Sign In screen, users who do not yet have an account can initiate
the process by clicking the Register link located at the bottom of the login card.

![](./images/register_button.png)

### Filling Out the Registration Form

The user is directed to the User Registration form. Here, they must provide a unique username,
password, email address, and their first and last name. Additionally, a specific Registration
Code (e.g., "NY2020") is required to proceed. The user must also agree to the Terms and
Conditions before clicking Submit.

![](./images/user_registration_form.png)

### Initial Confirmation

Upon submission, a "Thank you" screen appears. This informs the user that the first part of
the registration is successful and instructs them to check their email for a confirmation
link within the next 15 minutes.

![](./images/user_registration_confirmation.png)

### Receiving the Verification Email

The system sends an email containing the registration metadata (e.g. Session ID and IP Address). Importantly, this
email includes a link to verify the account and a unique 7-character alphanumeric passcode (e.g., `BV9c18W`)
that expires in 45 minutes.

![](./images/user_registration_email_body.png)

### Entering the Passcode

After clicking the link in the email, the user is brought to a Passcode verification
screen. They must enter the exact code provided in the email and click Submit to
validate their email address.

![](./images/user_registration_passcode_verification.png)

### Administrative Approval

Once the email is validated, the user receives a final confirmation message. The account
is not yet active; it now requires an administrator to approve or disapprove the request. The
user will receive a final notification via email once the decision is made.

![](./images/user_registration_passcode_complete.png)

The `admin email` should get the following message:

```text
RCPT TO:<admin@localhost>
250 2.0.0 I'll make sure <admin@localhost> gets this
DATA
354 Go ahead. End your data with <CR><LF>.<CR><LF>
MIME-Version: 1.0
Date: Sat, 14 Mar 2026 19:42:18 -0400
From: "My Auth Portal" <root@localhost>
Subject: Review User Registration
Thread-Topic: Account Registration.
Message-ID: <oXFribHzRN3N0dX9fnWXMORQLDugOtg8OcVfSVXmdBKrPf27zhmKdyKnFDgYcVFe.root@localhost>
To: admin@localhost
Bcc: greenpau@localhost
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="utf-8"

<html>
  <body>
    <p>
      The following user successfully registered with the portal.
      Please use management interface to approve or decline the registratio=
n.
    </p>

    <p>The registation metadata follows:</p>
    <ul style=3D"list-style-type: disc">
      <li>Registration ID: 9J4bpbKo7O6JjM4pWBskM9eXlyit2tftAjbylBB7pJY66geH=
qJ0dQOemckU3jXvuAS7MN0g5xZG</li>
      <li>Registration URL: <code>https://auth.myfiosgateway.com:8443/auth/=
register</code></li>
      <li>Realm Name: <code>userpool1.localdomain</code></li>
      <li>Session ID: 4Mi1FZTfRZyUhvcoeC2BkpICfgU007ntltCehlBFR</li>
      <li>Request ID: e404cf81-51d9-4177-992e-7eee858d0165</li>
      <li>Username: <code>greenpau</code></li>
      <li>Email: <code>greenpau@outlook.com</code></li>
      <li>IP Address: <code>192.168.99.182</code></li>
      <li>Timestamp: Sat Mar 14 23:42:18 UTC 2026</li>
    </ul>
  </body>
</html>
```

At the moment, there is no approval workflow. The admin should manually transfer data
from `registrations.json` file.

> TODO: Add "Admin UI" (similar to Profile UI) to allow approvals via management interface.

## Testing with Mock Email Server

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

## Multiple Realms

Each identity store can support its own distinct registration workflow, provided that they are configured
with unique `dropbox` paths and identity stores. This isolation ensures that registration data
and final user credentials remain separate for different authentication domains or user groups within
the same security configuration.

```Caddyfile
		user registration localdbRegistry {
			dropbox assets/config/registrations_local.json
			title "User Registration"
			code "NY2020"
			require accept terms
			require domain mx
			email provider localhost-smtp-server
			admin email admin@localhost
			identity store localdb
		}

		user registration userpool1dbRegistry {
			dropbox assets/config/registrations_userpool1.json
			title "User Registration"
			code "NY2020"
			require accept terms
			require domain mx
			email provider localhost-smtp-server
			admin email admin@localhost
			identity store userpool1
		}
```

In this configuration, the registration endpoints will have identity store realm name in its path:

```text
/auth/register/local
/auth/register/userpool1.localdomain
```