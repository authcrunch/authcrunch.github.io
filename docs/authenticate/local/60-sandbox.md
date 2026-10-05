---
title: "Local login sandbox"
description: "Follow a local login through its sandbox session and password or MFA checkpoints."
discovery:
  topic: login-and-mfa
  kind: concept
  aliases: ["login session", "checkpoint"]
---

# Local login sandbox

A local login creates a short-lived interaction before issuing its final access
credential. The username and realm locate an account; a bound sandbox tracks the
checkpoints still requiring proof. It is distinct from a completed JWT, refresh
family or OIDC session.

1. Resolve the local identity and its registered methods.
2. Apply transforms and select the effective challenge sequence.
3. Create the temporary sandbox, bind it to the client, and present its next step.
4. Verify checkpoints in order, then issue credentials only if current identity
   and policy evidence still permit completion.

For a `/auth/` portal, HTML navigation uses `/auth/sandbox/...`. The default
browser-binding cookie is `AUTHP_SANDBOX_ID`, scoped to `/auth/`; custom prefixes
change its name. JSON clients use the bound `sandbox_id` and rotating
`sandbox_secret` from the [Portal API](../api/20-portal-api.md).

## Checkpoints

The account's ordered challenge rules select a sequence. Transform policies can
replace that selection and additive requirements can add checkpoints. A matched
explicit policy with no available sequence denies login rather than reverting
to password. See [challenge rules](../13-authentication-challenges.md).

### Password

The server verifies the current password; it does not trust the submitted
username as proof. Sandbox retry limits end a failed interaction. A separate
password-attempt limiter spans browser, JSON and Basic paths, with five failed
attempts causing a five-minute source block. Public IPv4 sources can share the
blocked `/24`; private IPv4 and IPv6 use individual addresses. A new sandbox
does not clear that limiter.

The recovery view is legacy scaffolding, not a complete forgotten-password flow.
Use a reviewed administrator-assisted account recovery process.

### MFA

| Requirement and registration | Outcome |
| --- | --- |
| Additive `require mfa`, no usable token | Enrollment flow is required |
| TOTP checkpoint, usable app token | Verify a current time-based code |
| `u2f` checkpoint, usable hardware/passkey token | Issue and verify a bound WebAuthn assertion |
| Generic MFA with both kinds | Factor selection may be offered |
| Explicit unavailable-method policy | Deny rather than bypass the policy |

Registering a credential changes security state. It is not reusable proof of a
completed authentication checkpoint; follow the fresh-login requirement after
enrollment. A WebAuthn challenge response containing options is likewise not a
successful assertion.

Local MFA failures are tracked on the account across sandboxes. Ten failures
cause a 15-minute lockout; successful validation clears the counter and expired
lockouts reset. TOTP and hardware failures contribute to the same account limit.
Use [MFA enrollment](../11-mfa.md) and maintain clock synchronization for TOTP.

## Configuration

In an otherwise configured portal with the local store enabled:

```caddyfile
transform user {
    match realm local
    require mfa
}
```

The first application's store and portal wiring are in the
[complete walkthrough](../../start/first-app.md). Passwordless or strict-factor
selection needs explicit challenge rules, not merely this additive MFA requirement.

## Terminating a Session

The sandbox expires after five minutes from creation and can be cancelled. Its terminate navigation
ends that interaction and returns to login; it does not log out an independently
completed session. On expiry, stale/rotated-secret rejection or uncertain request
completion, start a fresh login rather than replaying an old secret. Logout for
completed sessions follows the [logout guide](../15-logout.md).
