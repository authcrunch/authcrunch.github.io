---
sidebar_position: 1
title: "Applications and SSO"
description: "Choose portal authorization, direct OAuth, OIDC issuance or upstream SAML for your application boundary."
discovery:
  topic: applications-and-sso
  kind: concept
  aliases: ["SSO", "application integration", "federation"]
---

# Overview

Choose the integration by where the application accepts identity and who enforces access. Begin with [your first protected app](../start/first-app.md) if you are new to AuthCrunch.

| Goal | Integration | Access boundary |
| --- | --- | --- |
| Protect an app behind Caddy | [Authentication portal](../authenticate/auth-portal.md) and [authorization policy](../authorize/getting-started.md) | Caddy validates the portal token and application roles before forwarding |
| Protect an app directly with an upstream OAuth provider | [Direct OAuth policy](../authorize/direct-oauth.md) | The policy owns an opaque browser session and evaluates claims |
| Let an application use AuthCrunch as an OIDC issuer | [OIDC provider](oidc-provider.md) | Registered redirect/client, local account authentication, consent and code/PKCE flow |
| Let users sign into the portal through an enterprise SAML IdP | [Upstream SAML login](../authenticate/saml/10-saml.md) | Signed and browser-bound assertions become portal identities |
| Issue AWS console SAML assertions | [AWS SSO status](sso_saml.md) | Metadata/menu exist; assertion issuance is incomplete in the released runtime |

The portal's Applications page and [UI links](../authenticate/55-ui-features.md) help users navigate to services. A link is not an access grant: protect the destination route with its own policy and test a signed-in account without the required app role.

Use the [released-version table](../operations/versions.md) when choosing features. Upstream provider login, issuing tokens to downstream clients, and presenting a menu are distinct capabilities; one does not imply the others.
