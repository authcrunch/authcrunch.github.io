---
title: "OAuth provider endpoint settings"
description: "Control discovery startup, retries, provider readiness, logout, and the different PKCE defaults of named and generic drivers."
discovery:
  topic: identity-providers
  kind: reference
  aliases: ["endpoint", "retry", "delay_start"]
---

# OAuth provider endpoint settings

Place these settings inside an existing `oauth identity provider` block.
They control upstream provider setup and login behavior, separately from the
portal's access-token lifetime, local refresh sessions, or direct OAuth policy.
This reference targets [Caddy Security v1.3.0 / library v1.3.8](../../operations/versions.md).

## OAuth 2.0 Endpoint Delayed Start

```Caddyfile
delay_start 5
```

Delay discovery/key setup by five seconds. With no delay, required setup runs
while provisioning; failure can prevent the configuration from loading. With a
delay, the provider starts setup asynchronously and rejects login while it is
not ready. This is useful when another service needs time to start, but it does
not turn an unavailable provider into an authenticated identity.

When a delay is configured without retry settings, the released configuration
uses two attempts and an interval equal to the delay. Worker cancellation on
reload/shutdown stops owned setup work; delayed setup does not authorize stale
callbacks after the provider closes.

## OAuth 2.0 Endpoint Retry Attempts

```Caddyfile
retry_attempts 3
retry_interval 10
```

These values allow up to **three total attempts** for discovery and key fetch,
with ten seconds between failures. Without a delay, a positive retry count with
no interval defaults to five seconds. Discovery and key retrieval are separate
stages; the count is not a universal retry policy for every HTTP call.

The options do not replay authorization-code exchange, automatically renew a
provider access/refresh token, or repair a bad issuer/callback/client secret.
Inspect [diagnostic logs](../../operations/logging.md), DNS, TLS trust, network
access, and provider metadata before increasing retries. A completed setup does
not imply every future upstream request will succeed.

## OAuth 2.0 Logout

```Caddyfile
enable logout
```

Provider logout is optional and distinct from
[portal logout](../15-logout.md). Discovery can supply an
`end_session_endpoint`; an explicit `logout_url` overrides the discovered URL.
The released named Cognito driver derives its `/logout` URL and appends a client
ID; Google uses its own logout URL. Generic OIDC can use discovery's logout
endpoint. The previous claim that only Cognito supports this option is outdated.

Provider-specific parameters still matter. An endpoint can require a registered
post-logout destination, ID-token hint, or other fields that the bare discovered
URL does not supply automatically. For Cognito, a complete explicit `logout_url`
can include the provider-required, URL-encoded registered destination. Consult
the provider's current logout contract and verify the actual browser flow.

Signing out from AuthCrunch does not prove that the upstream provider session
ended, that every application session ended, or that independently accepted JWTs
were revoked. Test local logout, upstream logout, and any return redirect as
separate outcomes.

## OAuth 2.0 PKCE

The generic OIDC driver enables PKCE by default. This does **not** apply equally
to all named drivers: released GitHub, Facebook, Discord, and LinkedIn configure
it off. LinkedIn also disables nonce generation; GitHub/Facebook/Discord use an
opaque access-token/profile flow rather than signed OIDC ID-token validation.

```Caddyfile
# For a specific provider that deliberately cannot use PKCE:
disable pkce
```

Use a code-flow confidential client whose settings match the driver's behavior.
Do not disable signature, issuer, audience, or nonce checks to hide a failed
OIDC registration. The [OAuth/OIDC overview](10-oauth2.md#pkce) and
[generic OIDC guide](81-backend-oauth2-0000-generic.md) explain the flow and
validation controls. State binding and PKCE are complementary checks.

## Accepted flags and actual discovery

In this release, `disable metadata discovery` is accepted configuration but
not read by the provider consumer. Explicit endpoints plus static keys and no
metadata URL can avoid discovery; supplying metadata still causes it to be
fetched. See [OIDC token trust](83-oidc-trust.md) for static pins and remote key
rollover. `disable key verification` controls remote fetching, while the JWT
parser still enforces asymmetric signature/key checks.
