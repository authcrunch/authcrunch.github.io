# Overview

## OAuth 2.0 Flow

Generally, a developer must create an "Application" with and identity provider.
e.g. Google, Okta, Azure, etc., and obtain OAuth 2.0 "Client ID" and
"Client Secret".

The authentication flow begins with obtaining "Authorization Code" from an
identity provider.

* What does the portal send to Okta?
  - Client ID
  - Redirect URI
  - Response Type
  - Scope

* What does the portal receive from Okta?
  - Authorization Code

Once, the portal has the "Authorization Code", it could get "Access Token"
to access the user's data at the identity provider.

* What does the portal send to Okta?
  - Authorization Code
  - Client ID
  - Client Secret

* What does Okta respond with?
  - Access Token

* What could the portal use "Access Token" for?
  -  Make API calls to obtain user information

The OpenID Connect (OIDC) adds login and profile information about the person
who is logged in. The differences between standard OAuth2.0 flow are:

1. In the initial request, a specific scope of `openid` is used
2. In the final exchange the Client receives both an "Access Token" and an "ID Token" (JWT Token).

References:
* [Mozilla - OIDC in a nutshell](https://infosec.mozilla.org/guidelines/iam/openid_connect.html#oidc-in-a-nutshell)


## Adding Role Claims

By default, all users authenticated with the plugin get `authp/guest`
role, unless the following applies.

The Caddyfile `transform user` directive allows adding roles based on the
information provided by OAuth 2.0 provider.

See [User Transforms](#user-transforms) section for explanation about
the `transform user` directive.

For example, the following transform matches any user authenticated
via `google` OAuth provider. Upon the match, the plugin adds `authp/user`
role to the token issued by the it.

```
      transform user {
        match origin google
        action add role authp/user
      }
```

The next transform requires the Google authenticated user to have
email address of `jsmith@contoso.com` to get `authp/admin` role.


```
      transform user {
        match origin google
        match email jsmith@contoso.com
        action add role authp/user
      }
```


## Configuring oath for HA deployments of caddy

If you use the default mode, caddy-auth-portal will save in memory the temporary state used to authenticate the user
with the oauth provider and this is a problem when you have more than one instance of caddy serving under the same
address. To avoid this from happening, you can use a distributed caching service, so far onl memcache is supported.

Here is an example if you are using the google oauth backend:

```
  google_oauth2_backend {
    method oauth2
    realm google
    provider google
    client_id {$GOOGLE_CLIENT_ID}
    client_secret {$GOOGLE_CLIENT_SECRET}
    scopes openid email profile

    storage_backend memcached
    memcached_server memcached-0.m.memcached.svc.cluster.local:11211
    memcached_server memcached-1.m.memcached.svc.cluster.local:11211
    memcached_server memcached-2.m.memcached.svc.cluster.local:11211
  }
```

`storage_backend` is where you choose the backend you want for that backend, it can be either memory or memcached.
`memcached_server` can be used many times and if you have more than one, it will distribute the states between the
servers.
