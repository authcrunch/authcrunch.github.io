---
slug: crypto-key-management
title: Crypto Key Management
authors: [greenpau]
tags: [blog]
---

A portal issues tokens and a policy verifies them before the application receives
the request. This article explains the key-store boundary in the released
Caddy Security v1.3.0 / go-authcrunch v1.3.8 bundle, reviewed October 5, 2026.
For a runnable setup, use [your first protected app](/docs/start/first-app).

{/* truncate */}

## Authentication Portal

Portal provisioning builds its access rules, validator options and crypto key
store. These cooperate: a valid signature establishes token integrity, while
claims, expiry and access rules determine what that identity may do.

### Access Control and Role Mapping

The default portal rules permit the configured administrator, user and guest
role names/patterns. Typical roles are `authp/admin`, `authp/user` and
`authp/guest`. These are portal permissions, not automatic grants to every
protected application. A separate app policy can require `app/member`.

[User transforms](/docs/authenticate/user-transforms) map upstream identities
into controlled roles. Clear reserved internal roles before granting them from
provider claims. Inspect the resulting identity and test a signed-in nonmember;
a startup log showing the portal ACL is not an app-access test.

### Token Validator Options

The portal initializes validator defaults and uses its configured token/cookie
names. Request token discovery, bearer handling and optional checks still
matter. An application policy has its own [token discovery](/docs/authorize/token-discovery)
and [validation options](/docs/authorize/token-verification); do not assume portal
options replace that route's policy.

### Key Store

Configured crypto keys are parsed and loaded for their declared use. With no
explicit raw key configuration, the released key store generates a default
signing/verifying key; its default algorithm is ES512, using ECDSA P-521. It
also applies configured token name/lifetime and autogeneration tag/algorithm
settings. No explicit key does not necessarily mean startup must fail.

For a portal and policy using a shared HMAC key, provide the same private key
material to the signer and verifier. For asymmetric keys, keep the signing
private key at the issuer and distribute only the public verification material.
The public [JWKS endpoint](/docs/authorize/token-verification) does not expose
HMAC or system shared secrets.

| Key purpose | Keep separate |
| --- | --- |
| Portal access JWT | Issuer signing keys and policy verification trust |
| Upstream OIDC token | [Provider issuer/audience/JWKS trust](/docs/authenticate/oauth/oidc-trust) |
| System API encrypted request | [PASETO system shared key](/docs/authenticate/api/system-api), not a JWT key |
| SAML assertion | [Pinned IdP signing certificate](/docs/authenticate/saml/saml), not portal JWT trust |

Restart continuity requires an explicit key strategy. An ephemeral generated
key is not shared across independent processes by naming a tag. Use durable
configured key material or [supported runtime-state persistence](/docs/operations/runtime-state)
with its single-owner storage/handover limits. Token lifetime is not the same
as a key's lifetime or a refresh session's lifetime.

### Token Validator and Grantor

Provisioning constructs a validator with the key store, options and portal ACL;
grantor options govern issued tokens. The debug message `Configured validator
and grantor` confirms that stage ran, not that every protected route is ordered
correctly or that copied tokens were revoked by logout.

When rotating keys, prepare matching verification trust, issue with the new
key, retain only the deliberate overlap needed for old-token lifetime, then
remove retired trust. Test allowed/denied access and restart behavior with the
actual executable. For generated-key persistence or renewal, follow
[refresh sessions](/docs/authenticate/refresh-token) and the state guide rather
than assuming a key reload renews or revokes all sessions.
