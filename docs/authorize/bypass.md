---
sidebar_position: 13
---

# Bypass Authorization for Specific URIs

The `bypass uri` Caddyfile directive allow to bypass authorization for
specific URIs.

```
bypass uri <exact|partial|prefix|suffix|regex> <uri_path>
```

For example, the following configuration allows bypassing authorization for
URI `/app/bypassed` and `/app/another/bypass`.

```
{
  debug

  security {
    authorization policy defaultPolicy {
      bypass uri prefix /app/bypassed
      bypass uri prefix /app/another/bypass
      acl rule {
        match role user admin authp/admin authp/user
        allow stop log debug
      }
      acl default deny
    }
  }
}

app.myfiosgateway.com {
  route {
    authorize with defaultPolicy
    respond * "authorized user or accesses bypassed URLs" 200
  }
}
```

