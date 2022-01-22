---
sidebar_position: 7
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
