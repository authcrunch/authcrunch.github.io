---
sidebar_position: 1
title: "Authentication portal overview"
description: "Understand identity sources, login checkpoints, portal tokens, and the separate policy that protects your application."
discovery:
  topic: login-and-mfa
  kind: concept
  aliases: ["authenticate", "JWT", "identity store", "identity provider"]
---

# Authentication portal overview

An AuthCrunch portal signs people in and issues tokens describing their identity
and roles. An authorization policy checks those tokens before a request reaches
your application. A successful login establishes an identity; your policy decides
whether that identity may use a particular application.

For a first working installation, follow the [learning path](../intro.md).
For the browser experience, see [Using the portal](auth-portal.md).

## How a request reaches your application

1. A browser requests a route protected by `authorize with apppolicy`.
2. The policy looks for a valid token. Without one, it sends the browser to its
   configured authentication URL.
3. The portal identifies the user through an attached store or provider, applies
   [transforms](42-user-transforms.md), and completes the required login challenges.
4. The portal issues a signed access token, normally delivered in a browser cookie.
5. The browser requests the app again. The policy verifies the token and evaluates
   its [access rules](../authorize/acl-rbac.md). Only an allowed request continues
   to the application's response or reverse proxy.

The [first-app example](../start/first-app.md) makes this distinction visible:
Alice and Bob can both sign in, but only Alice has the `app/member` role needed
by the app. Bob receives 403.

## Choose an identity source

Declare sources inside the global `security` block, then attach their **names**
to an `authentication portal`. A source's **realm** identifies its login domain
and appears in the resulting identity. A store name and a realm are different
settings, even when you give them the same value.

| Source | Credentials are checked by | Start here |
| --- | --- | --- |
| Local store | AuthCrunch, using a file-backed user database | [Local users](local/10-local.md) |
| LDAP store | Your directory, including Active Directory | [LDAP](ldap/10-ldap.md) |
| OAuth / OpenID Connect provider | An external provider's sign-in flow | [OAuth and OIDC](oauth/10-oauth2.md) |
| SAML provider | An external identity provider's SAML response | [SAML](saml/10-saml.md) |

A portal can attach several sources. Require MFA for local accounts with
[portal challenges](11-mfa.md); configure upstream MFA at your external identity
provider for federated accounts. Portal profile features such as local password
and authenticator management do not change an external provider's account.

## Connect configuration to routes

The global block defines named objects. Site handlers select those objects:

```caddyfile
route {
    authenticate /auth/* with myportal

    @app path /app /app/*
    route @app {
        authorize with apppolicy
        reverse_proxy 127.0.0.1:8080
    }
}
```

This is a routing fragment: define `myportal` and `apppolicy` in the global
`security` block, as the [complete example](../start/first-app.md) demonstrates.
The access check must run before the upstream handler. The app's own network
address should not provide another public path around that check.

For a portal mounted at `/auth/`, its browser login is `/auth/login`, its
applications page is `/auth/portal`, and its identity view is `/auth/whoami`.
Provider callback URLs and [cookie paths](auth-cookie.md) must match that mount.

## Plan the session boundary

The portal's access token has its own lifetime and signing key; it is separate
from an OAuth provider's token. A cookie must reach the protected host and path,
and the policy must trust the portal's key. A role change does not rewrite an
already issued token. [Logout](15-logout.md) clears the portal browser session;
upstream SSO and copies of a token require separate consideration.

For local accounts, optional [refresh sessions](30-refresh-token.md) can renew
short-lived access tokens. Use [trusted redirects](100-trust-login-logout.md) to
control where users return after login. Consult [Troubleshoot](../troubleshoot.md)
when a successful login still leads to a loop or denied access.
