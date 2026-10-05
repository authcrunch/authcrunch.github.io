---
title: "Upstream OIDC token trust and key rollover"
description: "Configure issuer/audience checks, static PEM key pins and bounded upstream JWKS refresh."
discovery:
  topic: identity-providers
  kind: reference
  aliases: ["JWKS rollover", "static keys", "kid", "access_token_audience", "azp", "OIDC nonce"]
---

# Upstream OIDC token trust and key rollover

These controls validate tokens **received from an upstream OAuth/OIDC provider** in Caddy Security v1.3.0 / go-authcrunch v1.3.8. They are separate from [the portal's own JWT signing/verification](../../authorize/token-verification.md) and [AuthCrunch serving as an OIDC issuer](../../apps/oidc-provider.md). Begin with [generic OIDC setup](81-backend-oauth2-0000-generic.md) for a complete portal and app example.

## Keep token purposes distinct

| Token | Released trust decision |
| --- | --- |
| Identity token | Supported asymmetric signature, configured/discovered exact issuer, audience containing this client ID, and transaction nonce when enabled |
| Identity token with multiple audiences | Also requires `azp` matching the OAuth client ID |
| Supplemental JWT access token | Signature and issuer; explicit `access_token_audience` when set. Without it, a resource audience can be accepted only with `azp` identifying this client |
| Opaque access token | Not parsed as identity JWT claims |

A present `azp` must match the client even when it is not otherwise required. An invalid identity token rejects login. A supplemental access JWT that fails validation contributes no claims; it does not turn an otherwise valid ID token into a failed login. Put essential application membership in a verified ID-token claim and use controlled transforms.

The default generic response requires both `id_token` and `access_token`. `required_token_fields` changes response-field requirements, not the trust checks or the ability to derive identity from an arbitrary opaque token.

## Pin upstream public keys

For a provider with explicitly managed endpoints/keys, this block can be added to an existing `security` configuration:

```caddyfile
oauth identity provider pinned-company {
  realm company
  driver generic
  client_id {env.OIDC_CLIENT_ID}
  client_secret {env.OIDC_CLIENT_SECRET}
  base_auth_url https://id.example.com
  issuer https://id.example.com
  authorization_url https://id.example.com/authorize
  token_url https://id.example.com/token
  scopes openid email profile
  jwks key company-2026 /etc/authcrunch/keys/company-public.pem
}
```

Enable this provider's name in the portal and retain the application-role boundary from the generic example. `jwks key` takes a key ID and a local public PEM path, not private key material or an HTTP URL. RSA, supported EC curves and Ed25519 public keys are supported; at most 64 static keys are accepted. The key ID must agree with the upstream JWT header when it supplies `kid`.

An explicit static key ID takes precedence over a remote key with the same ID. Updating remote metadata cannot silently replace that pin. Verify a replacement public key out of band and reprovision after changing its file/configuration. No discovered issuer is available in this manual example, so the explicit `issuer` is essential.

With explicit authorization/token URLs, static keys and no metadata URL, provisioning does not need discovery. If a metadata URL is also configured, it is still fetched. The accepted `disable metadata discovery` flag is not consumed by the released provider and does not guarantee offline provisioning. Preserve signature, PKCE and nonce checks rather than relying on a flag name to bypass missing setup.

## Follow remote rollover

When discovery supplies a JWKS URL, a missing eligible key ID or a cryptographic signature failure using a remote key can trigger one bounded refresh/retry for that parse. This supports rollover where either `kid` or key material changes. Concurrent requests share the fetch result; fetch attempts are rate limited. Static pins, malformed headers, claim failures and unsupported algorithms do not become remote refresh bypasses.

A complete valid remote `keys` array replaces the previous remote trust snapshot while preserving explicit static pins. Malformed/failed transport does not publish a partial replacement. Remote TLS and HTTP status still matter. This refresh behavior is not an upstream refresh-token grant and does not renew the portal session.

The historical `disable key verification` setting controls remote key fetching; the JWT parser still enforces its asymmetric method/key checks. It is not a way to accept unsigned or HMAC identity tokens.

## Verify the provider boundary

Test a valid ID token, wrong issuer/client/nonce, multiple audiences with missing/wrong `azp`, a changed remote key and a rogue key claiming a pinned ID. Test optional access-token claims separately. Successful adaptation only proves grammar and static-file acceptance; a synthetic signing fixture verifies these checks, while live provider consent and certificate/network setup need their own test.
