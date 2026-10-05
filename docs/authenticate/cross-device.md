---
title: "Cross-device login preview"
description: "Preview the opt-in browser approval flow that signs another device in, with explicit consent and independent sessions."
discovery:
  topic: login-and-mfa
  kind: guide
  aliases: ["cross-device", "QR login", "device approval", "unreleased"]
---

# Cross-device login preview

:::info[Version boundary]

The library feature is released in **go-authcrunch v1.3.11**. Its Caddy integration
is present in the source checkout at `a8f81c7` and is **unreleased for Caddy** as
of October 5, 2026. The published caddy-security v1.3.0 bundle does not accept
these directives. Use a matching custom integration build for this preview.

:::

Cross-device login lets a browser request approval from another browser. It is
useful when entering credentials on the requesting device is inconvenient. The
approving browser completes ordinary login and explicitly approves the displayed
account and matching code. The requesting browser receives its own session.

## Enable the preview

Add this directive to an otherwise working portal in a compatible build:

```caddyfile
authentication portal myportal {
    enable identity store localdb
    enable cross-device login
}
```

Omission disables the feature, including its routes and login links. Explicit
opt-out uses `disable cross-device login`. Both are statements, not nested blocks.
Built-in templates display the option; a custom login template must add its own
opt-in link to the flow.

## Approve another browser

For a portal mounted at `/auth/`:

1. Open `/auth/cross-device` on the requesting device. It displays a QR/link and
   a short matching code.
2. Open that link on the approving device. Confirm that the matching code agrees
   with the request you initiated and that you recognize the requesting device.
3. Start and complete a **fresh** portal login, including required password/MFA
   or the configured OAuth/SAML flow.
4. Review the account and code, then choose approve or deny explicitly.
5. The requester polls serially and, after successful single-use redemption,
   receives independent credential cookies and continues to the portal.

The QR/link contains an activation code, not the requester secret or bearer
tokens. A link alone cannot authenticate either browser. Do not approve an
unsolicited request just because its link points to your legitimate portal.
An existing JWT, API-key/Basic request or JSON login cannot replace the required
fresh HTML completion.

This is a browser approval flow, **not an RFC 8628 device authorization endpoint**.
The older `/qrcode/login.png` merely points at ordinary portal navigation and
does not enable cross-device approval.

## Session and failure behavior

Requests expire after five minutes. The client polls every two seconds and
stops on cancellation, denial, expiry, navigation or uncertain network failure.
Reloading starts a new interaction. Redemption is single-use; a lost redeemed
response requires a new request, not a retry that issues another credential.

The approving account's current local identity and challenge policy are checked
again at redemption. Provider identities rerun their portal transforms for the
requesting device. Upstream ID/refresh tokens are not copied. A transfer does
not add upstream account introspection beyond the provider's existing contract.

When configured, refresh and OIDC create independent sessions on the requester.
Logging out or revoking the approving session/family invalidates outstanding
approvals, but cannot undo a transfer already completed. Test stronger challenge
policies and account changes as well as a happy path.

## Deployment checks

Use HTTPS and the exact portal origin/mount. POSTs require a matching Origin,
compatible Fetch Metadata, and a bounded URL-encoded form. The temporary
approving-browser cookie is Secure, HttpOnly, host-only, mount-scoped and
SameSite=None to accommodate signed SAML POST callbacks. It relies on explicit
origin, browser binding and approval checks.

Pending requests remain in memory even with [persistent state](../operations/runtime-state.md).
Restart discards them. Fixed limits are 1024 active requests total and eight
per trusted source address. Confirm trusted proxy normalization, both browser
paths, denial/cancellation, logout invalidation, and narrow mobile layout before
offering the preview to users.

Implementation references: [library v1.3.11](https://github.com/greenpau/go-authcrunch/tree/v1.3.11/pkg/authn),
[Caddy integration commit](https://github.com/greenpau/caddy-security/commit/a8f81c7).
