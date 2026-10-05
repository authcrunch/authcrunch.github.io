---
title: "SAML identity providers"
description: "Connect upstream SAML identity providers with signed, browser-bound login and explicit claim mapping."
discovery:
  topic: identity-providers
  kind: concept
  aliases: ["SAML 2.0", "NTP", "ACS", "RelayState", "certificate pinning"]
---

# SAML identity providers

AuthCrunch acts as a SAML **service provider** when users sign in through an upstream identity provider. Start with [Microsoft Entra ID](20-azure.md) or [JumpCloud](30-jumpcloud.md). The released configuration supports `driver azure` and `driver generic`; other compatible providers use the generic driver and must supply the required claims and supported bindings.

This is separate from [application-side SAML SSO](../../apps/sso_saml.md), which does not complete AWS assertion issuance in the released runtime. The baseline here is [Caddy Security v1.3.0 / go-authcrunch v1.3.8](../../operations/versions.md).

## Follow the login transaction

1. The browser opens the portal's `/auth/saml/<realm>` URL with **GET**.
2. AuthCrunch creates an AuthnRequest and an unpredictable RelayState, sets a dedicated browser-binding cookie, and redirects to the IdP using HTTP-Redirect binding.
3. The IdP authenticates the user and returns the signed SAMLResponse and original RelayState to the exact ACS URL using HTTP-POST binding.
4. AuthCrunch checks the initiating browser, callback URL, request ID, signature and assertion conditions before mapping claims and issuing its own portal token.

The state lasts five minutes and is consumed once. An unsolicited IdP-initiated POST, a response from another browser, a changed callback or replay is rejected. Start another GET transaction after a failed or expired callback. RelayState is an opaque transaction value, not a destination URL to replace in the provider console.

The dedicated cookie is host-only, `Secure`, `HttpOnly`, `SameSite=None`, with path `/` and a five-minute lifetime. Serve the callback over HTTPS; ordinary portal cookie settings do not remove this requirement. Use [proxy header normalization](../90-misc.md#recording-source-ip-address-in-jwt-token) when TLS terminates upstream so the externally reconstructed ACS URL remains correct.

## Time Synchronization

Keep the portal and IdP clocks synchronized. SAML validates assertion time conditions; an incorrect clock can reject an otherwise valid signature. Check system time before changing validation or certificates.

## Configuration

Define a provider in the global `security` block and enable its name in an authentication portal:

```caddyfile
saml identity provider company {
  realm company
  driver generic
  entity_id urn:authcrunch:company
  acs_url https://auth.example.com/auth/saml/company
  idp_login_url https://idp.example.com/saml/sso
  idp_metadata_location /etc/authcrunch/saml/metadata.xml
  idp_sign_cert_location /etc/authcrunch/saml/signing-cert.pem
}
```

| Setting | Meaning |
| --- | --- |
| `realm` | Determines the callback's final path component |
| `driver` | `generic` or `azure`; there is no `provider okta` setting |
| `entity_id` | Your SP identifier, matching the IdP's audience configuration |
| `acs_url` | Exact public callback URL; repeat for each deliberately supported portal address |
| `idp_login_url` | IdP SSO endpoint for the generic driver's AuthnRequest |
| `idp_metadata_location` | Local metadata XML or an HTTP(S) metadata URL, read during provisioning |
| `idp_sign_cert_location` | Local PEM certificate file; the signing trust anchor is pinned separately from metadata |

`method saml` is not a body directive. `saml identity provider` selects the method. The Azure driver additionally requires tenant/application IDs and an application name; its legacy defaults and header check are explained in the [Entra guide](20-azure.md).

Metadata provides configuration, but additional signing certificates in metadata do not override the pinned certificate. On IdP certificate rollover, verify the new certificate out of band, replace the pin and metadata as needed, and reprovision the portal. Metadata fetched at startup is not a live refresh service.

## Map identity and application access

The released mapper recognizes attribute **name suffixes**, not arbitrary friendly names or every provider's default role claim. Use these full names:

| Attribute name | AuthCrunch claim | Requirement |
| --- | --- | --- |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/displayname` | `name` | Required, nonempty display name |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` | `email` | Required, nonempty email |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name` | `sub` | Send a stable application identity |
| `http://claims.example.com/SAML/Attributes/Role` | `roles` | Optional, one value per application role |

A NameID containing email does not substitute for the required email/display-name attributes. Separate given name and surname attributes are not automatically combined. Default Entra role names ending in `/claims/role` do not match `Attributes/Role`; configure the explicit custom attribute.

Clear reserved `authp/*` and application roles from upstream claims before granting them with controlled [user transforms](../42-user-transforms.md). Permit portal login separately from access to `/app`; the provider examples show this boundary.

## Verify and troubleshoot

Use a fresh browser session to test an assigned app member, a portal-only user and an unassigned user. Inspect `/auth/whoami` for the mapped identity and roles, then request the protected app directly. Test logout and start a fresh transaction; portal logout does not establish upstream SAML Single Logout.

| Symptom | Check |
| --- | --- |
| Unsupported ACS URL | Public scheme/host, portal mount and realm match an `acs_url` exactly |
| Browser binding invalid or expired | HTTPS cookie, original browser, original RelayState, five-minute window and a preceding GET |
| Signature or audience rejection | Pinned certificate, matching SP Entity ID, correct request and accurate time |
| Mandatory name/email missing | Full mapped attribute names and nonempty values; NameID alone is insufficient |
| Callback body rejected | One SAMLResponse and RelayState; form content type `application/x-www-form-urlencoded`; known body length from 500 to 30,000 bytes |
| Login succeeds but app denies | Required upstream app role and realm-specific transform, then policy role |

A proxy that adds a charset to the callback content type or removes its known Content-Length can conflict with the released handler. Retain provider POST fields and the externally correct callback address. Avoid recording complete assertions or cookies in diagnostic logs.
