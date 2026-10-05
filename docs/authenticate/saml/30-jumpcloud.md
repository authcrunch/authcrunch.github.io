---
title: "JumpCloud SAML integration"
description: "Connect a JumpCloud custom SAML application with pinned trust and browser-bound portal login."
discovery:
  topic: identity-providers
  kind: guide
  aliases: ["SAML 2.0", "JumpCloud custom SAML", "ACS"]
---

import CodeBlock from '@theme/CodeBlock';
import canonicalCaddyfile from '@site/assets/conf/saml/jumpcloud/Caddyfile?raw';

# JumpCloud SAML Integration

Use a JumpCloud custom SAML application as an upstream identity provider. The [canonical Caddyfile](https://github.com/authcrunch/authcrunch.github.io/blob/main/assets/conf/saml/jumpcloud/Caddyfile) serves the portal at `/auth/` and protects `/app`. It uses `driver generic`, the released SAML mapper and a separately pinned signing certificate.

## Configure the custom SAML application

Create a custom SAML connector using JumpCloud's current [connector-field reference](https://jumpcloud.com/support/sso-application-connector-fields). Use these values consistently:

| Field | Example value |
| --- | --- |
| SP Entity ID | `urn:authcrunch:jumpcloud` |
| ACS URL | `https://auth.example.com/auth/saml/jumpcloud` |
| Login URL / bookmark target | `https://auth.example.com/auth/saml/jumpcloud` |
| IdP URL | Your connector's JumpCloud SSO URL, copied into `JUMPCLOUD_SAML_LOGIN_URL` |
| NameID format | Email-address format if appropriate to your connector; additional mapped attributes are still required |

Set the SP identifier independently of the IdP identifier. Use a signed response/assertion with the downloaded IdP certificate. Retain the SP's original RelayState; do not replace it with a static redirect URL.

Configure these attribute names with populated values:

| Attribute name | AuthCrunch claim | Requirement |
| --- | --- | --- |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/displayname` | `name` | Required, nonempty display name |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` | `email` | Required, nonempty email |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name` | `sub` | Send a stable application identity |
| `http://claims.example.com/SAML/Attributes/Role` | `roles` | Optional, one value per application role |

Map display name to full name, email to email and name to a stable user identity. To authorize the example app, emit `App.Access` as a value of the custom `Attributes/Role` attribute for an administrator-managed app group/assignment. Do not make authorization attributes user-editable. Arbitrary JumpCloud group attributes are not automatically mapped into roles by the released SAML parser.

## Install trust and start the portal

Download the connector metadata XML and signing certificate. Set `SAML_METADATA_PATH`, `SAML_CERT_PATH`, `JUMPCLOUD_SAML_LOGIN_URL` and a private `JWT_SHARED_KEY`. The certificate must be a local PEM file; metadata can be local XML or an HTTP(S) URL. The first three values expand at Caddyfile adaptation.

Start with the canonical example after replacing its hostname. Its transforms clear reserved roles, grant `authp/user` to the JumpCloud realm and grant `app/member` only when the same realm supplies `App.Access`. A valid SAML login alone does not grant the protected app.

## Verify the browser flow

Open `/app`, follow the portal login and select JumpCloud. The browser must first GET `/auth/saml/jumpcloud` so AuthCrunch can create state before the IdP's POST callback. An unsolicited POST from the JumpCloud user-portal tile is rejected; a bookmark tile can point to that GET entry URL.

Test assigned member and portal-only accounts, inspect `/auth/whoami`, and verify direct `/app` access. Replaying a response or opening its callback in a different browser must fail. See [SAML troubleshooting](10-saml.md#verify-and-troubleshoot) for cookie, claim and signing errors. On certificate rollover, verify and update the separate pin and reprovision; metadata does not override it.

## Complete Caddyfile

<CodeBlock language="caddyfile" title="Caddyfile">{canonicalCaddyfile}</CodeBlock>

## Historical connector walkthrough

These preserved images show connector creation, identifiers, attributes, certificate export and user-portal placement. Their hostname lacks the new `/auth/` mount, and the old user tile must not be used as an unsolicited-login recipe. Follow the current values above.

<figure>

![Jumpcloud SAML App Registration - New Application](images/jumpcloud_saml_sso_00a.png)

<figcaption>Historical console: Jumpcloud SAML App Registration - New Application. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>

<figure>

![Jumpcloud SAML App Registration - SSO connector](images/jumpcloud_saml_sso_00b.png)

<figcaption>Historical console: Jumpcloud SAML App Registration - SSO connector. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>

<figure>

![Jumpcloud SAML App Registration - App Name](images/jumpcloud_saml_sso_01.png)

<figcaption>Historical console: Jumpcloud SAML App Registration - App Name. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>

<figure>

![Jumpcloud SAML App Registration - SSO Configuration](images/jumpcloud_saml_sso_02.png)

<figcaption>Historical console: Jumpcloud SAML App Registration - SSO Configuration. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>

<figure>

![Jumpcloud SAML App Registration - SSO Configuration](images/jumpcloud_saml_sso_03.png)

<figcaption>Historical console: Jumpcloud SAML App Registration - SSO Configuration. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>

<figure>

![Jumpcloud SAML App Registration - SSO Configuration](images/jumpcloud_saml_sso_04.png)

<figcaption>Historical console: Jumpcloud SAML App Registration - SSO Configuration. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>

<figure>

![Jumpcloud SAML App Registration - User Attributes](images/jumpcloud_saml_sso_05.png)

<figcaption>Historical console: Jumpcloud SAML App Registration - User Attributes. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>

<figure>

![Jumpcloud SAML App Registration - IDP Certificate](images/jumpcloud_saml_sso_05a.png)

<figcaption>Historical console: Jumpcloud SAML App Registration - IDP Certificate. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>

<figure>

![Jumpcloud SAML App Registration - Complete](images/jumpcloud_saml_sso_06.png)

<figcaption>Historical console: Jumpcloud SAML App Registration - Complete. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>

<figure>

![Jumpcloud SAML App User Portal](images/jumpcloud_saml_sso_07.png)

<figcaption>Historical console: Jumpcloud SAML App User Portal. Use the current values and flow described above; the displayed IDs, hosts and ports belong to the old example.</figcaption>
</figure>
