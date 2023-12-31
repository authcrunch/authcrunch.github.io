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
        action add role authp/admin
      }
```

## Icon Name, Text, and Color

The following directive sets name, text, and color of the icon
for this identity provider:

```
oauth identity provider generic {
  icon "GitLab" "lab la-gitlab la-2x" "white" "#fc6d26" priority 100
}
```

The `lab la-gitlab la-2x` refers to the name of the [Line Awesome](https://icons8.com/line-awesome) icon.

The `white` refers to the icon color.

The `#fc6d26` refers to the background color.

The `priority 100` specified the order in which the icon will be shown.

Other examples:

```
icon "Discord" "lab la-discord la-2x" "white" "#5865f2" priority 100
icon "Discord" "lab la-discord la-2x" "white" "#7289da" priority 100
icon "Discord" "lab la-discord la-2x" "white" "#404eed" priority 100
```
