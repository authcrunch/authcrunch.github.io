---
sidebar_position: 2
title: "Community examples"
description: "Find community-written examples of AuthCrunch integrations."
discovery:
  topic: operations
  kind: reference
  aliases: ["deployment"]
---

# Community examples

Start with the [tested first-app Caddyfile](../start/first-app.md) or a provider's
canonical example. For additional patterns, Eric Zimmerman's
[community writeup](https://gist.github.com/EricZimmerman/3015b94ab027d0597e0e55e93f0466c3)
covers home services and mobile clients using Basic/API-key authentication.

That writeup describes a specific older deployment, not a versioned test suite
for the current release. In particular, use the released [API-key guidance](../authorize/api_key_auth.md)
and [Basic authentication requirements](../authorize/basic_auth.md), including
the realm header and trusted route boundary, rather than copying its old key
length workaround or treating custom header names as an access policy.

Before adopting any community configuration, identify its module/library
versions, replace hostnames and credentials, validate the grammar and test both
an authorized user and a signed-in nonmember. Optional modules, TLS/DNS setup
and application-specific APIs require their own verification. Keep private
keys and account data outside the file-server root.
