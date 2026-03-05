---
sidebar_position: 14
---

# Caddy Placeholders

Caddy's security module populates specific **placeholders** (variables) after a user has been
successfully authenticated. These placeholders allow you to access user metadata directly 
within your `Caddyfile` for logging, headers, or further routing logic.

## Available Placeholders

The following table breaks down the standard placeholders available during the authorization lifecycle:

| Placeholder                 | Description                                                                    | Example Value                    |
| --------------------------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `{http.auth.user.claim_id}` | The internal unique identifier for the specific claim set.                     | `c7f3b2...`                      |
| `{http.auth.user.sub}`      | The **Subject** claim; the unique ID provided by the OIDC/OAuth issuer.        | `user_9921`                      |
| `{http.auth.user.email}`    | The email address associated with the authenticated user.                      | `admin@example.com`              |
| `{http.auth.user.name}`     | The full display name of the user.                                             | `John Doe`                       |
| `{http.auth.user.issuer}`   | The URL of the identity provider (IdP) that issued the identity.               | `https://auth.myfiosgateway.com` |
| `{http.auth.user.origin}`   | The specific authentication source or backend used.                            | `google` or `local`              |
| `{http.auth.user.realm}`    | The specific authentication realm used.                                        | `google` or `local`              |
| `{http.auth.user.username}` | The shorthand login name, typically derived from `userinfo.preferred_username` | `jsmith`                         |


## Passing User Info to an Upstream App

You can use these placeholders to pass user information to backend applications via request
headers. This is a common pattern for "Identity Aware Proxy" setups.

In this configuration, even though the backend doesn't handle the login, it receives
the user's ID and roles via headers set by Caddy.

```caddy
{
  route {
    authorize with defaultPolicy
    
    # Inject user metadata into headers
    header_up X-User-ID {http.auth.user.id}
    header_up X-User-Roles {http.auth.user.roles}
    
    reverse_proxy localhost:8080
  }
}
```