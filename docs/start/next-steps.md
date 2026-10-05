---
sidebar_position: 4
title: Next steps
description: "Choose an identity provider, add authentication controls, and understand what must change before deploying the local example."
discovery:
  topic: operations
  kind: guide
  aliases: ["deployment", "production", "reverse proxy"]
---

# Next steps

You now have a portal that authenticates users and a policy that admits one user
while rejecting another. Choose the next task based on your application.

## Connect your identity source

- **Use an external provider:** start with [OAuth and OIDC](../authenticate/oauth/10-oauth2.md), then select the provider guide in [Identity providers](../guides.md#identity-providers).
- **Use enterprise SAML:** follow [the signed, browser-bound SAML flow](../authenticate/saml/10-saml.md).
- **Use a directory:** review [LDAP](../authenticate/ldap/10-ldap.md) and its user search settings.
- **Keep local users:** learn about the [local identity store](../authenticate/local/20-identity-store.md) and [password management](../authenticate/local/30-password-management.md).

Keep the provider's callback URL, the portal mount path, and the policy's login
URL consistent. When changing the identity source, verify the claims and roles
it produces before relying on the existing app policy.

## Shape login and access

- Add [multi-factor authentication](../authenticate/11-mfa.md) and understand [authentication challenges](../authenticate/13-authentication-challenges.md).
- Map identities into application roles with [user transforms](../authenticate/42-user-transforms.md).
- Refine access with [role-based rules](../authorize/acl-rbac.md) and [path rules](../authorize/path-acl.md).
- Pass selected identity information to an upstream application using [headers](../authorize/headers.md).

Repeat both the allowed-user and denied-user checks after changing the rules.
An upstream application that trusts identity headers must only accept them from
the trusted proxy; users must not be able to bypass that proxy or supply trusted
headers themselves.

## Prepare a deployment

The learning Caddyfile is deliberately local. Before turning it into a service,
make these deployment choices:

| Area | What must change |
| --- | --- |
| HTTPS and addresses | Use your real HTTPS hostnames and matching login/callback URLs. Remove `cookie insecure enabled`. Revisit the loopback binding and cookie scope for your topology. |
| Users | Remove the public demo accounts and passwords. Review every account and role in the store, including any bootstrap administrator. |
| Signing keys | Supply protected, durable key material. The shell-generated demo secret is temporary; changing it prevents existing tokens from verifying against the new key. |
| Storage | Give the service durable, access-controlled storage and a backup plan. Relative paths resolve from its working directory. Keeping a user database is distinct from preserving sessions across restarts. |
| Application | Replace the demo response with your application handler, such as `reverse_proxy`, after the authorization handler in the matched route. |
| Operations | Choose a service manager, logging, updates, and an explicit administration/reload strategy. The tutorial disables Caddy's admin endpoint. |

Use [Caddy's reverse proxy reference](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)
for upstream configuration and its [running guide](https://caddyserver.com/docs/running)
for service operation. Keep the authorization check ahead of the app handler and
test the full set of application paths you intend to protect.

For renewable local login, configure [refresh sessions](../authenticate/30-refresh-token.md)
explicitly. For restart continuity, follow [runtime-state storage](../operations/runtime-state.md);
a mounted user database alone does not preserve sessions. For an app acting as
an OIDC client, use the [OIDC provider](../apps/oidc-provider.md).

For a specific task, continue with the [topic directory](../guides.md). For
configuration details, use the [reference](../reference.md).
