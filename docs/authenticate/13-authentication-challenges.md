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


## Future State

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

### Via Profile API Endpoint

You should be able to configure the above with Profile API.


