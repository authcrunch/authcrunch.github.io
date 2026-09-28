---
title: "Generic OpenID Connect"
description: "Connect an OIDC service through discovery, validate provider tokens, map groups to application roles, and troubleshoot missing claims."
discovery:
  topic: identity-providers
  kind: reference
  aliases: ["OpenID Connect", "OIDC", "generic OAuth provider", "metadata_url", "discovery", "UserInfo", "client_secret_post"]
---

import CodeBlock from '@theme/CodeBlock';
import caddyfile from '@site/assets/conf/oauth/generic/Caddyfile?raw';

# Generic OpenID Connect

Use `driver generic` to connect an OpenID Connect service to an AuthCrunch
portal. The portal discovers the service's endpoints, exchanges the login code
for tokens, validates the identity, and issues its own application token.

This reference targets **caddy-security v1.3.0** with **go-authcrunch v1.3.8**.
For a provider setup walkthrough, follow [Keycloak](81-backend-oauth2-0011-keycloak.md).
For the relationship between the provider, portal, and policy, read the
[OAuth/OIDC overview](10-oauth2.md).

## What the provider must supply

Register a confidential, server-side client that supports the authorization
code flow. For the example below, configure:

| Provider setting | Required value or behavior |
| --- | --- |
| Client credentials | A client ID and client secret |
| Token endpoint authentication | Accept `client_id` and `client_secret` in the form body (`client_secret_post`) |
| Redirect URI | `https://auth.example.com/auth/oauth2/generic/authorization-code-callback` |
| Scopes | `openid email profile`, plus any provider-specific scope needed for your claims |
| PKCE | Support the `S256` challenge sent by the generic driver |
| ID token | A signed `id_token` for this client, with the login's nonce and an email claim |
| Application membership | A string array claim such as `groups: ["app-members"]` in the ID token |

Use your actual public portal hostname. The callback contains the AuthCrunch
realm, `generic`; it does not have to match a tenant or realm name at the
provider. This configuration expects an OIDC ID token. For an OAuth-only service
such as GitHub, follow its dedicated provider guide and profile-API setup.

## Complete configuration

Set the portal hostname, provider issuer and discovery URL in this Caddyfile.
The example expects a group named `app-members`; replace that matcher with the
exact value your provider emits. The complete file is also in the
[generic example directory](https://github.com/authcrunch/authcrunch.github.io/blob/main/assets/conf/oauth/generic/Caddyfile).

<CodeBlock language="text" title="Caddyfile">{caddyfile}</CodeBlock>

Supply these variables to the running process:

| Variable | Value |
| --- | --- |
| `GENERIC_CLIENT_ID` | The registered OIDC client ID |
| `GENERIC_CLIENT_SECRET` | That client's secret |
| `JWT_SHARED_KEY` | A random signing secret shared by this portal and policy |

For an interactive trial, export the client credentials and generate the
signing key with `export JWT_SHARED_KEY="$(openssl rand -hex 32)"`. For a managed
service, store all three in its protected environment and keep the signing key
stable across restarts. `{env.VARIABLE}` resolves when AuthCrunch starts.

Run `./bin/authcrunch adapt --adapter caddyfile --config Caddyfile >/dev/null`
to check parsing, then `./bin/authcrunch run --config Caddyfile` to start.
Provisioning contacts the discovery and key endpoints. Start the provider first;
parsing alone does not establish provider connectivity or valid credentials.
The public HTTPS host also needs working DNS and certificate issuance.

The example disables the admin endpoint. Use **Ctrl+C** and restart the
foreground process after edits. Replace the protected `respond` with your
application's `reverse_proxy` when the login and denial checks pass.

## Discovery, issuer, and keys

Copy the exact discovery URL from the provider's configuration. Read its JSON
from the AuthCrunch host to verify connectivity:

```sh
curl --fail --silent --show-error https://id.example.com/.well-known/openid-configuration
```

| Caddyfile setting | Meaning in this release |
| --- | --- |
| `metadata_url` | The discovery document URL. It supplies `authorization_endpoint`, `token_endpoint`, and `jwks_uri`. |
| `issuer` | Expected token issuer. It must match the token's `iss` exactly, including case and a trailing slash. If omitted, the driver uses the discovered issuer when supplied. |
| `authorization_url` / `token_url` | Explicit endpoint overrides; these take precedence over the corresponding discovery values. |
| `base_auth_url` | A provider base URL used by configuration defaults. It is not a substitute for `metadata_url` and does not establish the expected issuer. Omit it for this discovery-based example. |

Use an issuer and discovery document for the **same tenant or realm**. The
browser must reach the authorization endpoint; the AuthCrunch server must reach
the token and signing-key endpoints and trust their TLS certificates. A
container-only hostname in published metadata is not a browser-accessible URL.

The driver verifies signatures with the provider's public keys and checks the
ID token's issuer, audience, and nonce. An invalid identity token rejects login.
PKCE, nonce, TLS verification, and signing-key verification remain enabled in
this example. Fix endpoint, certificate, and claim mismatches at their source.

The default token response requires both `id_token` and `access_token`.
A non-identity access token may be opaque. A JWT access token can also contribute
claims if its signature and trust checks succeed; a failed supplemental access
token check does not invalidate an otherwise accepted ID token. Put essential
application membership in the ID token to make the mapping explicit.

## Map claims to application permissions

The generic driver's supported role paths include:

| Provider token claim | Available to the portal as |
| --- | --- |
| `groups` | Roles after the portal combines group and role claims |
| `role`, `group`, `roles` | Roles |
| `realm_access.roles` | Roles, including Keycloak realm roles |
| `app_metadata.authorization.roles` | Roles |
| `resource_access.CLIENT.roles` | Not extracted by this release's generic token parser; map the needed values into a supported claim |

Configure membership claims as arrays of strings and inspect the resulting
`roles` at `/auth/whoami`. Claim extraction is implemented in the
[released token parser](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/pkg/idp/oauth/claim_parser.go).
Arbitrary token fields are not automatically copied into the AuthCrunch token.

The example's access decision is:

| Stage | Value |
| --- | --- |
| Provider ID token | `groups: ["app-members"]` |
| Portal transform | Matches realm `generic` and role `app-members` |
| Issued AuthCrunch token | Includes the added `app/member` role |
| Application policy | Requires `app/member` |

A user without that group still receives `authp/user` for portal access but
cannot reach `/app`. An identity-provider group is an authorization input;
verify the issued claims and a denied account before opening access.

### Email and UserInfo

By default, the driver requires the **email claim to be present in the identity
token** before optional UserInfo fetching runs. Requesting the `email` scope
alone does not create it. Configure the provider's email mapper and the user's
email. This presence check does not require `email_verified: true`.

For a provider that intentionally omits email, `email claim check disabled`
inside the provider block disables that specific check. Review any
email-dependent transforms before using it.

UserInfo fetching is optional and must be enabled explicitly, for example:

```text
user_info_fields email groups
```

Place this inside the `oauth identity provider` block. It requires the `openid`
scope and a discovered `userinfo_endpoint`. Selected ordinary fields are stored
under `userinfo`; extracted role/group fields become portal roles. In this
release, non-empty roles extracted from UserInfo **replace** the previously
extracted token roles. Fetch errors are logged and login processing continues.
UserInfo email does not satisfy the earlier ID-token email check. The
[UserInfo implementation](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/pkg/idp/oauth/user_info.go)
defines this behavior; the complete example relies on ID-token claims instead.

## Verify and troubleshoot

Open `/app`, sign in through **OpenID Connect**, and check `/auth/whoami`.
A member of `app-members` should reach the protected response; a different
account should sign in but receive **403** at `/app`, `/app/`, and `/app/nested`.
Use fresh logins after changing claims or transforms: existing AuthCrunch tokens
keep their issued roles until they expire or are otherwise rejected.

| Symptom | Check |
| --- | --- |
| Startup fails while loading the provider | Fetch the discovery document from the server; verify its URLs, TLS trust, and `jwks_uri`. |
| Provider rejects the client | Check client ID/secret, confidential-client settings, and support for form-body client authentication. |
| Callback rejected | Match the public scheme, host, port, `/auth/` mount, and AuthCrunch realm exactly. |
| Issuer or audience failure | Use the intended tenant's discovery document; compare `iss` with `issuer` and ID-token `aud` with the client ID. |
| Missing email error | Add email to the ID token; a UserInfo-only email is too late for the default check. |
| Login works but the app denies access | Inspect `roles`, including group prefixes or paths; check the transform and required `app/member` role. |
| A claimed custom field is missing | Check the supported token paths and any explicit UserInfo field selection. |
| Callback fails after retrying a copied URL | Start a new login flow. Codes, state, nonce, and PKCE belong to one login attempt. |

The [Keycloak walkthrough](81-backend-oauth2-0011-keycloak.md) shows the
provider-side mapper and both allowed and denied users with this model.
