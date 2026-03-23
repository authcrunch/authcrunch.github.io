---
slug: crypto-key-management
title: Crypto Key Management
authors: [greenpau]
tags: [blog]
---

This post walks you through how the `security` app manages cryptographic keys for both `authenticate` and `authorize` plugins.

<!-- truncate -->

## Authentication Portal

When the app initializes a portal via `NewPortal()`, one of the most critical stages is the `configureCryptokey store()`
function. This is where the foundation for secure token handling and access control is laid.

### Access Control and Role Mapping

Before the keys are even touched, `configureCryptokey store` sets up the **default Access Control List (ACL)** for
the portal. This configuration defines the specific roles assigned to:

* Admins
* Regular Users
* Guests

This information is stored in `AccessListConfigs` (`access_list_configs`). If you are troubleshooting
your setup, you can find these details explicitly mapped out in your application logs, ensuring
you can verify which roles are being applied to which identity tiers.

In the `DEBUG` logs you will see the default `portal_access_list_rules` that apply to
accessing authentication portal.

```json
    "portal_access_list_rules": [
        {
            "comment": "admin role name match",
            "conditions": [
                "match role authp/admin"
            ],
            "action": "allow stop"
        },
        {
            "comment": "user role name match",
            "conditions": [
                "match role authp/user"
            ],
            "action": "allow stop"
        },
        {
            "comment": "guest role name match",
            "conditions": [
                "match role authp/guest"
            ],
            "action": "allow stop"
        }
    ],
```

### Token Validator Options

The portal next initializes its **Token Validator Options**. This is done by
calling `options.NewTokenValidatorOptions()`, which prepares the environment for how the portal
will eventually verify incoming claims and token integrity.

### Key Store

The core of the cryptographic setup is the key store. The `security` app follows a "secure by default"
philosophy regarding key availability:

* Manual Configuration: If you provide specific crypto keys in your `Caddyfile`, the app loads them
  into the key store.
* Auto-Generation: If no crypto keys are configured, the app automatically generates a "default" key. To
  ensure modern security standards, it defaults to the `ES512` (ECDSA with P-521 and SHA-512) algorithm.

The application will log and exit if no verification keys are configured, as these are essential for
both `authenticate` and `authorize` plugins to function.

### Token Validator and Grantor

Once the key store and ACLs are ready, the app brings everything together. It initializes
the **Token Validator** using three components:

1.  The previously configured **Validator Options**
2.  The **Verification Keys** loaded (or generated) in the key store
3.  The defined **ACL**

Finally, it configures the **Token Grantor** options, which dictate how new tokens are issued.

> **Troubleshooting Tip:** You can confirm these components are active by searching your logs for the phrase:  
> `"Configured validator and grantor"`