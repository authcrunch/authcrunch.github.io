---
title: "Keycloak"
description: "Connect a Keycloak realm to AuthCrunch, map group membership into the ID token, and verify allowed and denied application access."
discovery:
  topic: identity-providers
  kind: guide
  aliases: ["OpenID Connect", "OIDC", "Keycloak groups", "realm_access", "Group Membership mapper"]
---

import CodeBlock from '@theme/CodeBlock';
import caddyfile from '@site/assets/conf/oauth/keycloak/Caddyfile?raw';

# Keycloak

Sign in with Keycloak and let an AuthCrunch policy protect your application.
This walkthrough admits members of one Keycloak group. Other users can sign in
to the portal but cannot access the app.

The integration was tested with **Keycloak 26.7.4** and the published
**caddy-security v1.3.0** bundle, containing **go-authcrunch v1.3.8**. Real browser
logins against a disposable local Keycloak instance verified PKCE, claim mapping,
and application access. Public HTTPS and your deployment's network paths still
need verification.

## Before you start

Have an existing Keycloak server and permission to manage a realm and client.
For a new server, follow Keycloak's [getting-started guide](https://www.keycloak.org/getting-started/getting-started-docker)
and [production configuration guidance](https://www.keycloak.org/server/configuration-production).
Complete [Install and verify](../../start/install.md) for the AuthCrunch binary.

This example uses two public HTTPS hosts. Replace them with your own:

| Name | Value in this guide |
| --- | --- |
| Keycloak server | `https://id.example.com` |
| Keycloak realm | `example` |
| Keycloak client ID | `authcrunch` |
| AuthCrunch portal | `https://auth.example.com/auth/` |
| AuthCrunch provider name and realm | `keycloak` |
| Protected application | `https://auth.example.com/app` |

The Keycloak realm selects the tenant. The AuthCrunch realm identifies the
login source inside the portal. They serve different purposes and need not
share a name.

## Realm

Create a realm named `example`, or select an existing application realm. Keep
`master` for Keycloak administration, as described in
[Keycloak's realm setup](https://www.keycloak.org/getting-started/getting-started-docker#create-a-realm).
Leave the realm's signing-key providers in place; this integration retrieves
public verification keys through discovery.

Check this URL from the AuthCrunch server:

```text
https://id.example.com/realms/example/.well-known/openid-configuration
```

The response's `issuer` should be `https://id.example.com/realms/example`, and
its endpoints must be reachable by the browser or server that uses them. Current
Keycloak deployments use `/realms/…` by default. Include an additional `/auth`
prefix only if your deployment actually configures it. See
[Keycloak's OIDC endpoints](https://www.keycloak.org/securing-apps/oidc-layers).

## Client

In the `example` realm, create an **OpenID Connect** client with client ID
`authcrunch`. Configure these capabilities and URLs:

| Setting | Value |
| --- | --- |
| Client authentication | On; AuthCrunch is a confidential server-side client |
| Standard flow | On |
| Implicit flow, Direct access grants, Service accounts | Off for this integration |
| Home URL | `https://auth.example.com/auth/` |
| Valid redirect URIs | `https://auth.example.com/auth/oauth2/keycloak/authorization-code-callback` |
| Require PKCE | On |
| PKCE Method | `S256` |

Use the exact redirect URI. The code exchange happens on the server; the
walkthrough does not require a wildcard redirect or browser CORS access to the
token endpoint. Save the client and copy its secret from **Credentials**.
Keep the client secret out of the browser and repository.

The generic driver sends the client ID and secret in the token request body.
Use Keycloak's client ID/secret authentication for this setup, rather than a
signed client assertion. The driver already sends S256 PKCE; configure the
client to require that method. See the
[Keycloak OIDC client settings](https://www.keycloak.org/docs/latest/server_admin/index.html#_oidc_clients).

### Map groups into the ID token

Keep the client's `profile` and `email` scopes. Add a **Group Membership**
protocol mapper for this client, with these settings:

| Mapper setting | Value |
| --- | --- |
| Name | `authcrunch-groups` |
| Token Claim Name | `groups` |
| Full group path | On |
| Add to ID token | On |
| Add to access token | Off for this example |
| Add to userinfo | Off for this example |

Use the client's dedicated scope so this mapping applies to this client.
In the client, open **Client scopes**, select its dedicated scope, and add a
mapper **By configuration → Group Membership**. This is ordinary realm group
membership, not an Organization Group Membership mapper.

With full paths enabled, a member of the top-level `app-members` group receives
this ID-token claim:

```json
{
  "groups": ["/app-members"]
}
```

The leading slash matters. AuthCrunch combines group claims into its roles,
so the Caddyfile matches the exact role `/app-members`. Putting the mapper only
on UserInfo does not supply this example's ID-token claim.

## Groups

Create a top-level group named `app-members`. Assign only the intended
application users to it. In this walkthrough, Alice is a member and Bob is not.

| Stage | Access information |
| --- | --- |
| Keycloak membership | Alice belongs to `/app-members` |
| Keycloak ID token | Contains `groups: ["/app-members"]` |
| AuthCrunch transform | Matches realm `keycloak` and role `/app-members` |
| AuthCrunch application token | Receives `app/member` |
| Application policy | Allows `app/member` |

The transform also gives every signed-in Keycloak user `authp/user` for ordinary
portal access. That role does not meet the application's rule.

## Users

Create or choose two users in the same realm:

| User | Group membership | Expected `/app` result |
| --- | --- | --- |
| Alice | `/app-members` | 200, protected response |
| Bob | No `/app-members` membership | 403, no protected response |

Set each user's email and credentials. The generic driver requires an email
claim in the ID token by default, so retain the `email` client scope and its
ID-token mapping. For disposable test users, set a password in **Credentials**;
if it is temporary, complete Keycloak's required password change during login.

Assign Alice through the user's **Groups** tab. An email address or a similarly
named Keycloak role does not automatically place a user in this group.

## Realm Roles

Existing deployments may prefer realm roles over a groups mapper. The bundled
generic driver recognizes `realm_access.roles` as well as top-level `roles`.
Configure the relevant realm-role mapper to include the intended role in the
ID token, then replace the group matcher with that role name. For example:

```text
transform user {
    match realm keycloak
    match role example-app-member
    action add role app/member
}
```

This is an alternative to the group-granting transform. Keeping both grants
would allow either one to add `app/member`. Nested client roles under
`resource_access.CLIENT.roles` are not extracted by this release's generic
parser; map the needed values into a supported claim. See the
[generic claim reference](81-backend-oauth2-0000-generic.md#map-claims-to-application-permissions).

There is no need to give application members `authp/admin` in Keycloak.
The example keeps portal permissions and application permissions separate.

## Configure AuthCrunch

Save this as `Caddyfile`. Replace `auth.example.com` in both the site address and
policy login URL. Replace `id.example.com` and `example` in the issuer and
metadata URLs to match your Keycloak deployment. Keep the registered callback
in sync with the public portal hostname and `/auth/` mount.

The example is embedded from the
[canonical Keycloak Caddyfile](https://github.com/authcrunch/authcrunch.github.io/blob/main/assets/conf/oauth/keycloak/Caddyfile).

<CodeBlock language="text" title="Caddyfile">{caddyfile}</CodeBlock>

Supply these values to the AuthCrunch process:

```sh
export KEYCLOAK_CLIENT_ID='authcrunch'
export KEYCLOAK_CLIENT_SECRET='YOUR_KEYCLOAK_CLIENT_SECRET'
export JWT_SHARED_KEY="$(openssl rand -hex 32)"
```

Replace the secret placeholder with the client secret from Keycloak. For a
managed service, store these values in its protected environment and reuse the
signing key across restarts. The portal and policy must use the same key.

Start Keycloak before AuthCrunch, then check and run the Caddyfile:

```sh
./bin/authcrunch adapt --adapter caddyfile --config Caddyfile >/dev/null
./bin/authcrunch run --config Caddyfile
```

Adaptation checks parsing. Startup loads the discovery document and keys, and
Caddy provisions HTTPS for the public portal host. DNS and ports 80/443 must be
configured for your certificate setup. The example disables the admin endpoint;
use **Ctrl+C** and restart the foreground process after edits.

The protected handler currently responds with a message. Replace that `respond`
with your application's `reverse_proxy` after verification. Keep `authorize`
before it and preserve the matcher covering `/app` and `/app/*`.

## User Login

1. Open `https://auth.example.com/app`. The policy sends you to the portal.
2. Choose **Keycloak** and sign in as Alice.
3. If you reach the portal's Applications page, select **Example app**.
   You should see `You reached the Keycloak-protected app.`
4. Select **My identity** or visit `/auth/whoami`. Confirm that `roles` includes
   `/app-members`, `authp/user`, and `app/member`, and `realm` is `keycloak`.
5. In a separate browser session, sign in as Bob. He should reach the portal,
   but `/app`, `/app/`, and `/app/nested` should return **403**.

Membership and transforms are evaluated at login. Removing Alice from the group
does not rewrite an existing AuthCrunch token. This example uses a 900-second
token lifetime; test changed membership with a fresh login.

### Check logout separately

The portal's **Sign out** action clears its browser session. In this configuration,
it does not end the Keycloak SSO session. A subsequent Keycloak login can issue
a new portal token without asking for a password again. Use separate browser
sessions when testing Alice and Bob; portal logout alone does not switch their
Keycloak account.

## Troubleshoot

| Symptom | Check |
| --- | --- |
| Discovery fails at startup | Verify the realm's full discovery URL, configured context path, DNS, and TLS trust from the AuthCrunch server. |
| `invalid_redirect_uri` | Match the registered callback to the portal hostname, `/auth/` mount, and AuthCrunch realm `keycloak`. |
| Client authentication fails | Verify Client authentication is On and the process has the current client ID and secret. |
| Issuer mismatch | Compare the configured issuer with Keycloak's discovery document and ID token; proxy hostname settings and realm paths must agree. |
| PKCE failure | Require `S256` at the client and leave PKCE enabled in AuthCrunch. Start a fresh login flow. |
| Email claim missing | Give the user an email and include it in the ID token through the client's email scope. |
| Alice signs in but gets 403 | Check membership, mapper placement, Add to ID token, and the leading slash in `/app-members`; inspect the resulting roles after a new login. |
| Bob reaches the app | Check for another transform or provider role that grants `app/member`, and ensure the policy requires that role rather than `authp/user`. |
| Login resumes immediately after logout | The Keycloak SSO session is still active; use a separate browser session for a different account. |

For discovery overrides, supported claim paths, and optional UserInfo behavior,
continue to [Generic OpenID Connect](81-backend-oauth2-0000-generic.md).
