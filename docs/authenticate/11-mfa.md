---
title: MFA
sidebar_position: 11
---

# Multi-Factor Authentication

## Enabling MFA

MFA can be enabled by adding `require mfa` directive inside `transform user` directive:

```
{
  security {
    local identity store localdb {
      realm local
      path {$HOME}/.local/caddy/users.json
    }

    authentication portal myportal {
      enable identity store localdb
      transform user {
        match realm local
        require mfa
      }
    }
  }
}

auth.myfiosgateway.com {
  authenticate with myportal
}
```

Currently, the MFA requirement can be applied only to `local` identity store type.

## Add MFA Authenticator Application

The following screenshot is from `/auth/settings/mfa/add/app` endpoint:

![](./images/settings_mfa_app.png)

The QR Code displayed on the page complies [Key Uri Format](https://github.com/google/google-authenticator/wiki/Key-Uri-Format).

In your MFA application, e.g. Microsoft Authenticator, follow these steps to
onboard your web account.

| <!-- -->    | <!-- -->    | <!-- -->    |
|-------------|-------------|-------------|
| ![](./images/ms_mfa_app_add_account.png) | ![](./images/ms_mfa_app_scan_qrcode.png) | ![](./images/ms_mfa_app_new_account.png) |
