---
sidebar_position: 1
---

# Credentials Management

The `authenticate` and `authorize` sub-systems require managing credentials,
e.g. email credentials.

```
{
  security {
    credentials smtp.outlook.com {
      username {env.SMTP_USERNAME}
      password {env.SMTP_PASSWORD}
    }
  }
}
```

This section is WIP.
