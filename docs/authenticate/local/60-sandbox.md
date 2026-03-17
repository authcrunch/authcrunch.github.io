# Sandbox

After a user submits their username, the portal creates a sandbox session
where the user must complete a sequence of checkpoints before a JWT is
issued. The sequence follows this order:

1. Portal looks up the user in the identity store and runs configured
   transformers
2. Portal creates a sandbox session with the resulting checkpoint sequence
   and redirects the user to `/sandbox/{session_id}`
3. User completes each checkpoint in order (password, then MFA if required)
4. When all checkpoints pass, the portal issues a JWT

The sandbox session is separate from the final JWT session. It uses its
own cookie (`SandboxID`) and a temporary secret. The session expires
after 5 minutes regardless of activity. If it expires, the user is
redirected back to the login page.

## Checkpoints

The checkpoint sequence is built at login from two sources:

1. **Identity store defaults** -- typically password authentication
2. **Transformer rules** -- directives like `require mfa` add additional
   checkpoints

The sandbox processes checkpoints in order. A user who must provide both
a password and a second factor will see the password form first, then the
MFA form.

### Password

The user enters their password. After 5 consecutive failed attempts the
sandbox session is terminated.

If the user has forgotten their password, the sandbox provides a password
recovery flow at the same step.

### MFA

The MFA checkpoint behavior depends on what tokens the user has registered:

| User has | What happens |
|----------|-------------|
| No tokens registered | Forced to register a token before proceeding |
| Authenticator app only | Prompted for TOTP code |
| Hardware token only | Prompted for WebAuthn challenge |
| Both app and hardware token | Chooses which method to use |

Registration counts as passing the checkpoint.

Failed MFA attempts are tracked on the user record across sandbox
sessions. After 10 consecutive failures the MFA checkpoint is locked
for 15 minutes. During lockout, MFA authentication is rejected without
validating the code. The lockout expires automatically and the counter
resets on successful MFA validation. Both authenticator app and hardware token failures
contribute to the same counter.

For adding MFA tokens outside the login flow, see
[Multi-Factor Authentication](../11-mfa.md).

## Configuration

Password-only login requires no additional configuration. The sandbox
runs automatically.

The following configuration adds MFA as a required checkpoint using the
`require mfa` directive inside `transform user`:

```
{
  security {
    local identity store localdb {
      realm local
      path {$HOME}/.local/caddy/users.json
    }

    authentication portal myportal {
      enable identity store localdb
      transform user {
        match realm local
        require mfa
      }
    }
  }
}

auth.myfiosgateway.com {
  authenticate with myportal
}
```

With this configuration, every user in the `local` realm must complete
both a password checkpoint and an MFA checkpoint at login. If the user
has not registered any MFA token, the sandbox will require them to
register one before login completes.

## Terminating a Session

A user can end their sandbox session early by visiting
`/sandbox/{id}/terminate`, which redirects back to the login page.
