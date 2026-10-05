---
sidebar_position: 2
title: "Authorization overview"
description: "Understand how a policy selects credentials, verifies identity, checks access, and forwards trusted application identity."
discovery:
  topic: authorization
  kind: concept
  aliases: ["authorize"]
---

# Authorization overview

An authorization policy decides whether a request may reach an application.
The portal establishes identity; the policy checks that identity against the
application's rules. A successful login alone does not grant access.

| Stage | Decision | Guide |
| --- | --- | --- |
| Discover a credential | Which cookie, header, or query value is accepted? | [Token discovery](token-discovery.md) |
| Verify it | Does a configured key verify the JWT and its time claims? | [Token verification](token-verification.md) |
| Evaluate permission | Do roles, claims, method, and path satisfy the policy? | [Access rules](acl-rbac.md) |
| Forward identity | Which trusted headers or Caddy placeholders does the app receive? | [Headers](headers.md), [placeholders](placeholders.md) |

Start with [Protect your first app](../start/first-app.md) and its observed
Alice-allowed/Bob-denied checks. Configure a named policy in the global
`security` block, then run `authorize with apppolicy` **before** the protected
handler. A Caddy `route` preserves this explicit order.

JWT verification is the ordinary portal-token path. PASETO is used separately
by the encrypted [System API](../authenticate/api/50-system-api.md); it is not
an interchangeable bearer format for this gatekeeper. Policies can also use
[Basic](basic_auth.md), [API keys](api_key_auth.md), or a dedicated
[direct OAuth session](direct-oauth.md). Their credentials and lifecycles differ.

Use an explicit application role such as `app/member`. Reserved roles such as
`authp/user` concern portal functions and are often broader than application
membership. Restrict trusted issuers and audiences when accepting external JWTs;
a signature verifies the signer, not that this particular application was the
intended recipient.

A missing credential normally redirects a browser to the configured portal.
A valid identity that fails an ACL receives `403`. APIs can disable redirects
and return `401` when authentication is required. Public paths need an explicit
[bypass](bypass.md), and bypassed requests have no authenticated identity.
