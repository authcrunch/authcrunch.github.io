---
title: MFA
sidebar_position: 11
---

# Multi-Factor Authentication

## Enabling MFA

MFA can be enabled by adding `require mfa` directive inside `transform user` directive:

```
    authp {
      backend local /etc/gatekeeper/auth/local/users_db.json local
      transform user {
        match origin local
        require mfa
      }
    }
```

Currently, the MFA requirement can be applied only to `local` backend type.

## Add MFA Authenticator Application

The following screenshot is from `/auth/settings/mfa/add/app` endpoint:

![](./images/settings_mfa_app.png)

The QR Code displayed on the page complies [Key Uri Format](https://github.com/google/google-authenticator/wiki/Key-Uri-Format).

In your MFA application, e.g. Microsoft Authenticator, follow these steps to
onboard your web account.

| <!-- -->    | <!-- -->    | <!-- -->    |
|-------------|-------------|-------------|
| ![](./images/ms_mfa_app_add_account.png) | ![](./images/ms_mfa_app_scan_qrcode.png) | ![](./images/ms_mfa_app_new_account.png) |
