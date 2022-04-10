---
sidebar_position: 14
---

# Basic and API Key Authentication

The following directives instruct the authorizer to validate Basic
Authentication credentials or API keys with the "myportal" portal
and "local" realm.

```
security {
  authorization policy mypolicy {
    with basic auth portal myportal realm local
    with api key auth portal myportal realm local
  }
}
```
