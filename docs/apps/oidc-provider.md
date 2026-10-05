---
title: "AuthCrunch as an OpenID Provider"
description: "Register relying applications, publish discovery and dedicated signing keys, and use code/PKCE login for local AuthCrunch accounts."
discovery:
  topic: applications-and-sso
  kind: guide
  aliases: ["OIDC provider", "oauth application", "relying party", "UserInfo", "PKCE"]
---

import CodeBlock from '@theme/CodeBlock';
import example from '@site/assets/conf/apps/oidc/Caddyfile?raw';

# AuthCrunch as an OpenID Provider

AuthCrunch can act as an OpenID Provider for applications that sign in its
**local users**. Your application becomes the relying party: it redirects the
browser to AuthCrunch, receives an authorization code, and exchanges that code
for an ID token and a UserInfo access token.

This is available in **caddy-security v1.3.0 / go-authcrunch v1.3.8**. It is the
opposite direction from [connecting an external OIDC provider](../authenticate/oauth/10-oauth2.md).
The portal adapter selects explicit local realms; external OAuth, SAML and LDAP
logins do not supply downstream OIDC authentication proof.

## Prepare the issuer and keys

Choose a stable canonical HTTPS issuer, here `https://auth.example.com/auth`.
Its path must equal the portal mount, without a trailing slash. Changing the
issuer changes the identity boundary for relying parties.

Create a **dedicated** RSA private key, separate from the ordinary portal JWT key:

```sh
umask 077
mkdir -p /etc/authcrunch/oidc
chmod 700 /etc/authcrunch/oidc
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 \
  -out /etc/authcrunch/oidc/signing.pem
chmod 600 /etc/authcrunch/oidc/signing.pem
```

Run these provisioning commands with the account responsible for the service's
private files. The runtime accepts unencrypted PKCS#8 or PKCS#1 RSA PEM with
2048–8192-bit keys. Parent directories and files must be private and readable
by the service. Never reuse the portal access-token key for OIDC.

Create a private random client secret of at least 32 bytes of entropy, store it
as `OIDC_WEBSITE_SECRET`, and configure the same secret in the relying party.
Provision the local store before testing and choose its password/MFA policy.
The Caddyfile uses `{$OIDC_WEBSITE_SECRET}` because client registration validates
the secret during adaptation. Treat adapted JSON as private: it contains the
expanded client credential.

## Register a relying application

<CodeBlock language="caddyfile" title="assets/conf/apps/oidc/Caddyfile">{example}</CodeBlock>

`website` is the configuration nickname; `website-client` is the protocol client
ID. `applications website` explicitly selects that registration for the portal.
The example retains consent and requires S256 PKCE. It also scopes consent HTML
headers to the exact authorization/continuation paths and callback origin: the
released provider's default `no-referrer` policy can omit Origin on consent POST,
and Chrome checks the form redirect against `form-action`. Keep this header
adjustment narrow; change its callback origin when changing the relying party.

Each `redirect_uri` directive registers **one exact callback**. Repeat it for
another callback; the plural `redirect_uris` is not Caddyfile syntax. HTTPS
callbacks do not support wildcards. Supply explicit credentials on ordinary
adaptation, or use a privately provisioned registration revision; do not generate
new client credentials on every restart.

Configure the relying party with:

| Setting | Value in this example |
| --- | --- |
| Issuer | `https://auth.example.com/auth` |
| Client ID | `website-client` |
| Client authentication | `client_secret_basic` |
| Callback | `https://app.example.com/oidc/callback` |
| Requested scopes | `openid profile email` |
| Response type / PKCE | `code` / `S256` |

Use the relying party's own OIDC integration library to generate state, nonce,
and PKCE, redeem the code, and verify the ID token's signature, issuer, audience,
expiry and nonce. The resulting application session belongs to that application.

## Discovery and token boundaries

| Purpose | Path relative to the issuer |
| --- | --- |
| Discovery | `/.well-known/openid-configuration` |
| Authorization | `/oidc/authorize` |
| Token exchange | `/oidc/token` |
| UserInfo | `/oidc/userinfo` |
| Public OIDC signing keys | `/oidc/jwks` |
| Token revocation | `/oidc/revoke` |

All ID tokens use RS256. The **opaque access token** goes to UserInfo as
`Authorization: Bearer TOKEN`; the ID token and ordinary portal access JWT
cannot be substituted for it. The legacy portal `/.well-known/jwks.json`
publishes a different key set for ordinary portal JWTs.

The OIDC subject derives from the immutable local record plus its store/realm
namespace. Recreating a deleted username creates a different subject. Local
roles and internal credential evidence are not exported as UserInfo claims.
The adapter reports `email_verified: false`; a configured email address is not
proof of verified ownership.

## Consent, native clients, and capabilities

Consent is required by default. `skip_consent yes` preapproves a trusted client
for its registered scopes; it does not override an explicit `prompt=consent`.
`prompt=none` returns a protocol error when login or consent is needed.
`offline_access` requires explicit fresh consent and returns a rotating OIDC
refresh credential. It is independent of [portal refresh](../authenticate/30-refresh-token.md).

Public clients set `token_endpoint_auth_method none`, omit the secret, and must
use S256 PKCE. A native client may register an HTTP callback on literal
`127.0.0.1` or `[::1]`; only its valid port may vary at authorization. Redeem the
code with the actual authorized URI, including that port. `localhost`, private
mobile schemes and arbitrary callback origins do not gain this exception.

The provider supports code responses using query or form-post, scope-limited
claims, authentication-context mappings, and by-value Request Objects using
`none` or registered RS256 keys. Remote request URIs, encrypted Request Objects
and advertised RP-initiated logout are not supported. Available protocol support
is not a claim of OpenID Foundation certification.

## Lifetime, logout, and key rotation

Default browser sessions last 28800 seconds; ID/access grants last at most
300 seconds and are bounded by the session's remaining lifetime. Codes last
60 seconds. OIDC refresh has its own lifetime and capacity. Current account and
credential evidence are checked on authorization, redemption and UserInfo;
account disablement or changed security state can invalidate credentials.

Portal logout revokes the OIDC browser session and dependent opaque grants.
Already issued ID tokens remain signed statements until expiry; relying parties
must end their own application sessions. Refresh/code replay revokes dependent
token authority rather than permitting another successful exchange.

State is volatile unless [persistence](../operations/runtime-state.md) is enabled.
Persistence retains completed sessions and grant/replay history, with one active
owner. Pending interactive requests restart. Browser affinity alone does not
route a relying party's backchannel exchange to the correct process.

For key rotation, list the new private key first and retain old keys later until
relying parties can retire old ID tokens. The first key signs; all listed public
keys are published. Keep the issuer stable.

## Verify the integration

Test discovery, actual browser login and consent, code/PKCE exchange, independent
ID-token verification and UserInfo. Then test an unregistered callback, wrong
verifier, code replay, changed account and logout. Confirm that the callback
reaches the relying party and all issuer paths reach the unstripped portal mount.
