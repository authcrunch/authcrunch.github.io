---
sidebar_position: 14
---

# Basic Authentication

The following directives instruct the authorizer to validate Basic
Authentication credentials with the "myportal" portal
and "local" realm.

```
security {
  authorization policy mypolicy {
    with basic auth portal myportal realm local
  }
}
```

Currently, for the configuration to work, the `authenticate` and `authorize` should be on
the same server instance.

In the near future, you will be able to configure `authorization policy` in such a way
that it authenticates against remote `authentication portal`.

Please see: https://github.com/greenpau/caddy-security/issues/462
