# SAML Overview

The plugin supports the following SAML identity providers (IdP):

* Azure Active Directory (Office 365) Applications

If you would like to see the support for the following identity providers,
please reach out:

* Salesforce
* Okta
* Ping Identity

## Time Synchronization

Importantly, SAML assertion validation checks timestamps. It is
critical that the application validating the assertions maintains
accurate clock. The out of sync time WILL result in failed
authentications.

## Configuration

The following configuration is common across variations of SAML backend:

```
      backends {
        azure_saml_backend {
          method saml
          realm azure
          provider azure
        }
      }
```

| **Parameter Name** | **Description** |
| --- | --- |
| `method` | Must be set to `saml` |
| `realm` | The realm is used to distinguish between various SAML authentication providers |
| `provider` | It is either `generic` or specific, e.g. `azure`, `okta`, etc. |

The URL for the SAML endpoint is: `<AUTH_PORTAL_PATH>/saml/<REALM_NAME>`.

If you specify `realm` as `azure` and the portal is being served at
`/auth`, then you could access the endpoint via `/auth/saml/azure`.

The Reply URL could be `https://localhost:8443/auth/saml/azure`.
