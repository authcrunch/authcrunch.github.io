---
title: "Ping Identity"
description: "Connect a PingOne OIDC code-flow web app, match discovery and client authentication, and preserve historical setup screens."
discovery:
  topic: identity-providers
  kind: guide
---

import CodeBlock from '@theme/CodeBlock';
import example from '@site/assets/conf/oauth/pingid/Caddyfile?raw';

# Ping Identity

This guide connects a **PingOne OIDC web application** with the generic driver.
The historical realm name `pingid` remains in the callback for compatibility;
it does not implement the separate PingID mobile authentication API. PingOne
can enforce its own sign-on/MFA policy before returning an OIDC identity.

## Register a confidential web application

Create an OIDC web application in the intended PingOne environment, enable
**authorization code**, register the callback below, and configure token endpoint
authentication as **Client Secret Post**. PingOne web applications can default
to Client Secret Basic; the bundled generic exchange sends the secret in the
form body. See [PingOne application settings](https://developer.pingidentity.com/pingone-api/platform/application-management.html).

```text
https://auth.example.com/auth/oauth2/pingid/authorization-code-callback
```

Copy the actual issuer and OIDC discovery URL from your environment/application.
Use the region or custom domain PingOne provides. The environment ID and OAuth
client ID are different values; do not construct the issuer from an application
ID. Supply `PINGONE_ISSUER`, `PINGONE_DISCOVERY_URL`, `PINGONE_CLIENT_ID`,
`PINGONE_CLIENT_SECRET`, and the private `AUTHCRUNCH_SIGNING_KEY`.
The issuer/discovery values expand before Caddyfile parsing.

<figure className="doc-screenshot">

[![Historical authorization-code settings; choose Client Secret Post for this example, not the pictured Basic option.](./images/ping_identity_16.png)](./images/ping_identity_16.png)

<figcaption>Historical authorization-code settings; choose Client Secret Post for this example, not the pictured Basic option.</figcaption>
</figure>
<details className="screenshot-gallery">
<summary>Preserved PingOne setup sequence</summary>

<figure className="doc-screenshot">

[![Historical Applications list.](./images/ping_identity_01.png)](./images/ping_identity_01.png)

<figcaption>Historical Applications list.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical OIDC web application selection.](./images/ping_identity_02.png)](./images/ping_identity_02.png)

<figcaption>Historical OIDC web application selection.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical application profile.](./images/ping_identity_03.png)](./images/ping_identity_03.png)

<figcaption>Historical application profile.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical redirect registration; replace its old mount and hostname.](./images/ping_identity_04.png)](./images/ping_identity_04.png)

<figcaption>Historical redirect registration; replace its old mount and hostname.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical openid/profile/email resource grants.](./images/ping_identity_05.png)](./images/ping_identity_05.png)

<figcaption>Historical openid/profile/email resource grants.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical OIDC attribute mapping.](./images/ping_identity_06.png)](./images/ping_identity_06.png)

<figcaption>Historical OIDC attribute mapping.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical application overview and client ID.](./images/ping_identity_07.png)](./images/ping_identity_07.png)

<figcaption>Historical application overview and client ID.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical endpoint list and discovery URL; copy your current environment values.](./images/ping_identity_08.png)](./images/ping_identity_08.png)

<figcaption>Historical endpoint list and discovery URL; copy your current environment values.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical token authentication settings defaulted to Client Secret Basic; use Post here.](./images/ping_identity_09.png)](./images/ping_identity_09.png)

<figcaption>Historical token authentication settings defaulted to Client Secret Basic; use Post here.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical scope grants.](./images/ping_identity_10.png)](./images/ping_identity_10.png)

<figcaption>Historical scope grants.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical sign-on policy assignment; apply your own organization policy.](./images/ping_identity_11.png)](./images/ping_identity_11.png)

<figcaption>Historical sign-on policy assignment; apply your own organization policy.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical group/name/email attribute mapping; this subject-based example does not require groups.](./images/ping_identity_12.png)](./images/ping_identity_12.png)

<figcaption>Historical group/name/email attribute mapping; this subject-based example does not require groups.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical application access policy; assignment and AuthCrunch authorization differ.](./images/ping_identity_13.png)](./images/ping_identity_13.png)

<figcaption>Historical application access policy; assignment and AuthCrunch authorization differ.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical application enable switch.](./images/ping_identity_14.png)](./images/ping_identity_14.png)

<figcaption>Historical application enable switch.</figcaption>
</figure>

<figure className="doc-screenshot">

[![Historical implicit-flow selection; the current example uses authorization code.](./images/ping_identity_15.png)](./images/ping_identity_15.png)

<figcaption>Historical implicit-flow selection; the current example uses authorization code.</figcaption>
</figure>

</details>
## Configure AuthCrunch

<CodeBlock language="caddyfile" title="assets/conf/oauth/pingid/Caddyfile">{example}</CodeBlock>
`PINGONE_ALLOWED_SUB` must be the entire exact observed subject. The transform
resets provider roles before granting the selected identity `app/member`.
PKCE is enabled by the generic driver; keep the application's PKCE policy
compatible. Never enable the old JS callback or implicit `token id_token` flow
merely to reproduce a screenshot.

If group-based access is preferable, emit a string-array `groups` claim in the
**ID token**, inspect its exact values, clear reserved roles, and map only the
intended group to `app/member`. The [generic OIDC guide](81-backend-oauth2-0000-generic.md)
explains claim sources and UserInfo limits.

## Verify and troubleshoot

Sign in through `/auth/oauth2/pingid`, inspect `/auth/whoami?format=json`, and
record the exact subject and realm without logging access tokens. Confirm that
an intended member reaches `/app` and another valid identity is denied. A
successful provider login alone does not establish application authorization.

Check callback scheme, hostname, port, mount, and realm literally; inspect
provider errors and [diagnostic logs](../../operations/logging.md). Keep client
secrets on the server. These examples are parser-verified against the released
bundle; console registration, live provider login, consent, and production TLS
require verification in your own organization.
