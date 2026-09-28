---
sidebar_position: 7
description: "Match the source address of a request against the IP address recorded in its token."
discovery:
  topic: authorization
  kind: reference
  aliases: ["IP filtering", "validate source address"]
---

# IP Address Filtering

The following `Caddyfile` directive instructs the plugin to match the IP
address in a token with the source IP address of HTTP Request.

```
{
  security {
    authorization policy mypolicy {
      validate source address
    }
  }
}
```
