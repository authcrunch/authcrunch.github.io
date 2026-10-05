---
title: "Nextcloud OAuth2 compatibility boundary"
description: "Understand why an accepted Nextcloud driver name does not establish native Nextcloud account login."
discovery:
  topic: identity-providers
  kind: reference
  aliases: ["Nextcloud", "OAuth2", "opaque access token", "native Nextcloud login"]
---

# Nextcloud OAuth2 compatibility boundary

The released configuration recognizes `driver nextcloud` and derives `/apps/oauth2/authorize` and `/apps/oauth2/api/v1/token` from `base_auth_url`. That endpoint configuration is **not a complete native Nextcloud identity-login integration**.

Nextcloud's [native OAuth2 documentation](https://docs.nextcloud.com/server/35/admin_manual/configuration_server/oauth2.html) describes confidential clients and bearer access to the account. It does not establish an OIDC ID-token/discovery contract. Its account access tokens are not a restricted identity-only grant; do not treat an `email` scope in AuthCrunch configuration as proof of limited Nextcloud permissions.

## The released gap

In Caddy Security v1.3.0 / go-authcrunch v1.3.8:

- The Nextcloud driver defaults to requiring `id_token` and `access_token`, while native Nextcloud OAuth2 does not provide the required OIDC identity-token flow.
- The driver does not implement a Nextcloud account/profile request that converts an opaque access token into a portal identity.
- Changing `required_token_fields` to only `access_token` does not make an opaque token supply verified identity claims.
- Generic OIDC UserInfo extraction requires the generic driver, the `openid` scope and a discovered UserInfo endpoint; it is not a Nextcloud-specific OCS account fetch.

Therefore there is no canonical working native Nextcloud login recipe here. Accepted syntax or an authorization redirect alone does not prove completed portal authentication. The same missing profile integration remains in the audited standalone v1.3.11 source.

## Choose a complete integration

If a separately configured service provides real OIDC identity for your users, connect its issuer using [generic OIDC](81-backend-oauth2-0000-generic.md) and verify its [token trust](83-oidc-trust.md). Otherwise use a documented local, LDAP, OAuth/OIDC or SAML identity source for the portal. Protecting a Nextcloud application behind a proxy also requires reviewing that application's own authentication/API requirements; placing a portal in front does not configure Nextcloud accounts or OAuth clients automatically.

Validate a fresh login and both allowed and denied application requests before treating any custom bridge as supported. Keep native Nextcloud account tokens private, and do not reuse token-response examples as application credentials.
