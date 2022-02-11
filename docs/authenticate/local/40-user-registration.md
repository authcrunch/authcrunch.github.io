# User Registration

The following Caddy configuration enables user registration.

```
{
  security {
    authentication portal myportal {
      registration {
        dropbox {env.HOME}/.local/caddy/registrations.json
        title "User Registration"
        code "NY2020"
        require accept terms
        require domain mx
        admin email barbaz@bar.baz foobar@foo.bar
      }
    }
  }
}

auth.myfiosgateway.com {
  route {
    authenticate with myportal
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

This screenshot is the registration screen with default options:

![](./images/portal_registration_simple.png)

The following is the registration screen with mandatory registration
code and the acceptable of terms and conditions:

![](./images/portal_registration_terms_code.png)
