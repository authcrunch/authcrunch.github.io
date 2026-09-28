---
sidebar_position: 12
description: "Select which token field supplies the user identity returned to Caddy."
discovery:
  topic: authorization
  kind: reference
  aliases: ["subject", "email", "user ID"]
---

# Caddy User Identity

When the plugin successfully validates a JWT token, the plugin passes
the user identity identifier back to the Caddy server.

By default, the identity passed to Caddy is email address. However,
it could be changed with `set user identity` Caddyfile directive.

```
{
  security {
    authorization policy mypolicy {
      set user identity id
      set user identity subject
      set user identity email
    }
  }
}
```

If `email` is being set, but a JWT token does not contain an email address,
then the plugin uses `subject` for identity.
