---
sidebar_position: 1
---

# Messaging Providers

The `authenticate` and `authorize` sub-systems require messaging capabilities,
e.g. email, SMS, chat bots, etc.

The following configuration sets up email messaging provider. It
uses `root@localhost` credentials.

```
{
  security {
    messaging email provider localhost-smtp-server {
      address 127.0.0.1:1025
      protocol smtp
      credentials root@localhost
      sender root@localhost "My Auth Portal"
      bcc greenpau@localhost
    }
  }
}
```

It can also be "passwordless":

```
{
  security {
    messaging email provider localhost-smtp-server {
      address 127.0.0.1:1025
      protocol smtp
      passwordless
      sender root@localhost "My Auth Portal"
      bcc greenpau@localhost
    }
  }
}
```

It may support TLS:

```
{
  security {
    messaging email provider localhost-smtp-server {
      address 127.0.0.1:1025
      protocol smtps
      passwordless
      sender root@localhost "My Auth Portal"
      bcc greenpau@localhost
    }
  }
}
```
