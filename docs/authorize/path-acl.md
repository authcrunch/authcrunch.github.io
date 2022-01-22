---
sidebar_position: 10
---

# Path-Based Access Lists

There are application that specify ACL in its own body, e.g.

```
{
  "iat": 1532093588,
  "jti": "705b6f50-8c21-11e8-9bcb-595326422d60",
  "sub": "jamie",
  "exp": "1532179987",
  "role": "users",
  "acl": {
    "paths": {
      "/*/users/**": {},
      "/*/conversations/**": {},
      "/*/sessions/**": {},
      "/*/devices/**": {},
      "/*/image/**": {},
      "/*/media/**": {},
      "/*/applications/**": {},
      "/*/push/**": {},
      "/*/knocking/**": {}
    }
  },
  "application_id": "aaaaaaaa-bbbb-cccc-dddd-0123456789ab"
}
```

To enable the validation of whether the requested path matches one
of the paths in JWT token claims, use the following Caddyfile
directive:

```
{
  security {
    authorization policy mypolicy {
      validate path acl
    }
  }
}
```

The asterisk `*` signs get converted to the following regex patterns:

* `*`: `[a-zA-Z0-9_.~-]+`
* `**`: `[a-zA-Z0-9_/.~-]+`
