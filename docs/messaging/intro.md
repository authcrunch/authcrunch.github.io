---
sidebar_position: 1
---

# Messaging Providers

The `authenticate` and `authorize` sub-systems require messaging capabilities,
e.g. email, SMS, chat bots, etc.

```
{
  security {
    messaging email provider smtp.outlook.com {
      address outlook.office365.com:25
      protocol smtp
      credentials smtp.outlook.com
    }
  }
}
```

This section is WIP.
