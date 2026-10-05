---
sidebar_position: 12
description: "Select which token field supplies the user identity returned to Caddy."
discovery:
  topic: authorization
  kind: reference
  aliases: ["subject", "email", "user ID"]
---

# Caddy User Identity

`set user identity` selects the value returned as Caddy's user ID after
successful authorization. It changes request metadata, not the token's claims,
the local account record, or access permissions.

```Caddyfile
# Inside the policy; choose one setting.
set user identity subject
```

| Value | Caddy user ID |
| --- | --- |
| `email` (default) | Email, falling back to subject when email is absent |
| `subject` or `sub` | JWT `sub` |
| `id` | JWT `jti` claim ID |

`id` therefore identifies a token's claim set, not a durable user identifier.
Do not use it to key an application account. For external issuers, bind a subject
to its trusted issuer namespace before mapping application users.

The other [identity placeholders](placeholders.md) remain available when
supplied. Apply role/claim rules separately; displaying an email or subject
does not grant permission to access the application.
