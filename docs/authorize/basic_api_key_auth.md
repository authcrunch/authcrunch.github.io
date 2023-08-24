---
sidebar_position: 14
---

# Basic and API Key Authentication

The following directives instruct the authorizer to validate Basic
Authentication credentials or API keys with the "myportal" portal
and "local" realm.

With such a setup, the api key generated in the portal can be
used in the `X-Api-Key` header to access authorized resources.

```
security {
  authorization policy mypolicy {
    with basic auth portal myportal realm local
    with api key auth portal myportal realm local
  }
}
```
