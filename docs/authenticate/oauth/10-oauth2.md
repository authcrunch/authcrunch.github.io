---
title: "OAuth and OIDC providers"
description: "Connect an external identity provider to the portal, choose callback URLs and scopes, and turn identity claims into application permissions."
discovery:
  topic: identity-providers
  kind: concept
  aliases: ["OpenID Connect", "OIDC", "OAuth2", "PKCE", "callback URL", "login icon", "reserved roles", "provider role collisions"]
---

import OAuthFlow from '@site/src/components/OAuthFlow';

# OAuth and OIDC providers

An external provider handles sign-in; AuthCrunch turns the returned identity
into a session for your application. Configure the provider once, enable it in
an authentication portal, and use an authorization policy to decide who can
reach the app.

For a complete example, follow **[Sign in with GitHub](81-backend-oauth2-0007-github.md)**.
If this is your first AuthCrunch deployment, start with
[Protect your first app](../../start/first-app.md) to learn the portal and policy
without external credentials.

:::note[Version scope]

The behavior described here targets the published **caddy-security v1.3.0**
bundle, which contains **go-authcrunch v1.3.8**. Install that bundle and check
the embedded library with `authcrunch security version`. The separate
`authcrunch version` command reports Caddy's version. A newer standalone
library release does not change an existing bundle.

:::

## OAuth 2.0 Flow

The portal uses the authorization code flow. OAuth gives it access to provider
APIs; OpenID Connect (OIDC) adds a standard identity layer, including the
`openid` scope and an ID token. OAuth-only providers such as GitHub supply the
user's identity through their profile API.

<OAuthFlow />

There are two token issuers in this flow. Provider access tokens and OIDC ID
tokens come from the external provider. The application policy in this setup
checks the token issued by **AuthCrunch**, with the roles assigned by your
portal. Configure the portal's signing key and the policy's verification key
consistently.

This page covers external providers attached to an **authentication portal**.
[Direct OAuth](../../intro.md#choose-a-login-model) connects an external
provider directly to a policy and has a different session and callback model.

## Connect the provider, portal, and policy

These names have different jobs:

| Setting | What it controls | Example |
| --- | --- | --- |
| Provider name | The configuration referenced by `enable identity provider` | `github` |
| `driver` | Provider-specific defaults and identity extraction | `github` or `generic` |
| `realm` | The login source used in the portal URL and claim matching | `github` |
| Portal name | The configuration attached to the `authenticate` handler | `myportal` |
| Policy name | The access rules attached to the `authorize` handler | `apppolicy` |

Define an `oauth identity provider` inside the global `security` block, then
reference its name inside the portal. Mount that portal with `authenticate`.
A provider definition alone does not add login to a site.

Use a provider's dedicated driver when it matches your service. The `generic`
driver covers OIDC services configured with their discovery endpoint and client
credentials. See the [generic OIDC configuration](81-backend-oauth2-0000-generic.md)
and the [provider directory](../../guides.md?topic=identity-providers) for
provider-specific settings. A `driver` value is an implementation choice;
renaming a `realm` does not change it.

### Register the callback URL

For the standard server-side callback, the URL combines the site's public
origin, portal mount, and provider **realm**:

```text
https://auth.example.com/auth/oauth2/github/authorization-code-callback
└──── public origin ────┘└mount┘      └realm┘
```

With the portal at `/auth/` and `realm github`, register the complete URL above
at the provider. If the portal is at the site root, omit `/auth`. Include a
non-default port when the public origin uses one. Keep the registered URL and
the actual browser-facing scheme, host, port, and path consistent.

The policy's `set auth url` points to the **login entrance**, such as
`https://auth.example.com/auth/`. The provider sends its response to the
**callback**. These URLs serve different stages of the flow.

### Request the claims you need

The provider's `scopes` directive controls the permissions requested during
login. OIDC usually needs `openid` plus the scopes for the profile, email, or
groups your policy uses. OAuth-only services use their own scope names; the
GitHub example requests `read:user user:email`.

A scope request does not guarantee that a claim will appear. Provider consent,
account data, API permissions, and the driver's extraction rules determine the
result. Inspect the signed-in user's identity at the portal's `/whoami` route
(`/auth/whoami` for this mount) before relying on a claim in a transform.

### Reserve roles used by your policy

OIDC group and role claims can become portal roles before transforms run.
If your policy allows `app/member`, an upstream group with that exact name
could satisfy it without the intended membership transform. The current OIDC
examples clear provider-derived `authp/*` and `app/member` first, then grant
portal access and the application role from the documented identity rule.
Keep those steps in order and test a provider claim containing a reserved role.

`action drop matched role` evaluates each role without the other identity
fields. Its role-dropping transform therefore matches only roles; adding a
realm matcher prevents removal. The complete examples enable one provider.
For a shared portal, define the internal roles each identity source may receive
and grant them explicitly after clearing reserved input roles. See
[user transforms](../42-user-transforms.md#drop-matched-roles).

## PKCE

[PKCE](https://datatracker.ietf.org/doc/html/rfc7636) binds the authorization code
to a verifier generated for the login attempt. When enabled, this release sends
an `S256` challenge and supplies the verifier during the token exchange.

| Driver in go-authcrunch v1.3.8 | Effective behavior |
| --- | --- |
| `generic`, `okta`, `google`, `gitlab`, `azure`, `nextcloud`, `cognito` | PKCE enabled by default |
| `github`, `facebook`, `discord`, `linkedin` | Driver forces PKCE off |

These are **driver behaviors**, not a statement about provider support.
[GitHub supports PKCE](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow),
but the bundled GitHub driver disables it. Setting `pkce enabled` does not
override that driver behavior in this release.

For a driver that enables PKCE by default, the explicit switch is
`pkce disabled` inside its `oauth identity provider` block. The older
`disable pkce` spelling is also accepted. Keep the default unless you have
verified a compatibility requirement with the particular provider.

The driver defaults are implemented in
[go-authcrunch v1.3.8](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/pkg/idp/oauth/provider.go).

## Adding Role Claims

Put `transform user` blocks inside the authentication portal. Match the
identity source as well as the account or group that should receive access.
For GitHub, this example grants an application role to one numeric account ID:

```text
transform user {
    match realm github
    match github id exact 12345678
    action add role app/member
}
```

Replace `12345678` with the intended account ID. Both matchers in the block
must match. Then require the same role in the application's policy:

```text
authorization policy apppolicy {
    set auth url https://auth.example.com/auth/
    crypto key verify {env.JWT_SHARED_KEY}
    allow roles app/member
}
```

The portal must sign with the corresponding `JWT_SHARED_KEY`. See the complete
[GitHub configuration](81-backend-oauth2-0007-github.md#configure-authcrunch)
for the surrounding blocks and protected route.

A successful login alone does not meet the `app/member` rule. The default
`authp/guest` fallback applies when the user has no roles; `authp/user` can be
added for ordinary portal access. Keep your application's permission explicit
instead of allowing every portal role into it.

See [User transforms](../42-user-transforms.md) for the general syntax and
[GitHub identity and organization matching](81-backend-oauth2-0007-github.md#choose-who-can-use-the-app)
for the provider-specific claims.

## Icon Name, Text, and Color

Configure the login button inside the `oauth identity provider` block. These
named settings make each value explicit:

```text
login icon class_name "lab la-github la-2x"
login icon color "white"
login icon background_color "#24292f"
login icon text "Continue with GitHub"
login icon text_color "white"
login icon text_background_color "#24292f"
login icon priority 100
```

The class uses the portal's Line Awesome icons. Text and colors affect the
button; priority controls ordering relative to other providers. Changing the
button does not rename the provider or realm, alter the callback, or grant
application access.

## Additional provider trust controls

[Upstream OIDC token trust](83-oidc-trust.md) covers static key pins, exact
issuer/audience/authorized-party checks and bounded remote JWKS rollover.
The accepted [Nextcloud driver](81-backend-oauth2-0014-nextcloud.md) lacks a
complete native account-identity flow; do not infer support from its name.
