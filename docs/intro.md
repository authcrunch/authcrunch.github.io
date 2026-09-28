---
sidebar_position: 1
description: "Learn how AuthCrunch connects login to application access, then build and verify your first local setup."
discovery:
  topic: operations
  kind: concept
  aliases: ["getting started", "beginner", "login model", "OIDC provider"]
---

# Start here

AuthCrunch adds authentication and authorization to Caddy through the
`caddy-security` module. It can give users a place to sign in and check whether
their identity allows them to reach an application.

**Authentication** answers “Who is this user?” **Authorization** answers “May this
user access this resource?” A successful login does not automatically grant access
to every application.

## Build your first setup

Start with two local users and a protected page. You do not need a domain, an
external identity provider, or another application server. By the end, you will
have tested a successful login, allowed access, denied access, and logout.

1. **[Install and verify](start/install.md).** Get a Caddy build that includes AuthCrunch.
2. **[Protect your first app](start/first-app.md).** Run a local portal and connect it to an access policy.
3. **[Verify access](start/verify-access.md).** Check what happens for each user, including a user who must be denied.
4. **[Choose your next step](start/next-steps.md).** Connect a provider or prepare a deployment.

The walkthrough is tested with the published **caddy-security v1.3.0** bundle,
which includes **go-authcrunch v1.3.8**. These are different version numbers:
the first identifies the Caddy integration; the second identifies its AuthCrunch
library. See the [release](https://github.com/greenpau/caddy-security/releases/tag/v1.3.0)
and [dependency declaration](https://github.com/greenpau/caddy-security/blob/v1.3.0/go.mod).

## Understand the moving parts

| Part | What it does | Name in the walkthrough |
| --- | --- | --- |
| `security` | Defines the stores, portals, and policies in Caddy's global options | One shared block |
| Identity store | Holds users and checks their credentials | `localdb` |
| Authentication portal | Provides login pages and issues an access token | `myportal` at `/auth/` |
| Authorization policy | Verifies the token and evaluates access rules | `apppolicy` |
| Protected route | Runs the policy before serving the application | `/app` |

An external identity provider can replace the local login source. The application
still needs an authorization decision before its response reaches the user.

## Choose a login model

Use the portal model for the learning path. The other models serve different
integration needs; their session and configuration settings are not interchangeable.

| Model | Use it when… | How access works |
| --- | --- | --- |
| Portal and token policy | You want a login portal, local users, or portal MFA and profile pages | The portal issues a token; a policy checks the token on the protected route |
| Direct OAuth policy | You want an application's policy to send users directly to an external provider | The policy handles the provider callback and creates its own session; portal user transforms do not apply |
| AuthCrunch as an OIDC provider | Your application is an OIDC client and needs AuthCrunch to supply identity | The application participates in an OIDC authorization flow; this is a separate integration from putting a policy in front of a route |

Begin with **[Install and verify](start/install.md)**. If you already have a
working deployment, [browse the guides by topic](guides.md) or go to the
[reference](reference.md).
