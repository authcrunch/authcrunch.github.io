---
title: "Generic OAuth provider"
description: "Find the generic OAuth provider example and its metadata and authorization URL settings."
discovery:
  topic: identity-providers
  kind: reference
  aliases: ["OpenID Connect", "OIDC", "metadata_url"]
---

# Generic OAuth provider

This [`Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/oauth/generic/Caddyfile)
allows generic OAuth-based authentication.

When a user browses to login, the user will be redirected to the provider discovered via
`metadata_url` and `base_auth_url` URLs.
