# Github

Follow the instructions at `https://github.com/settings/apps/new`.

GitHub App name: "My Gatekeeper"

Description: "Caddy v2 Authentication Portal"

Homepage URL: `https://localhost:8443/`

User authorization callback URL: `https://localhost:8443/auth/oauth2/github/authorization-code-callback`

Check "Expire user authorization tokens".

Check "Request user authorization (OAuth) during installation"

Upon successful completion of the instructions, you will get:

![Settings - Developer settings - GitHub Apps - My Gatekeeper](../images/oauth2_github_new_app.png)

Additionally, click "generate a private key" to sign access token requests.

![Settings - Developer settings - GitHub Apps - My Gatekeeper - Private Keys](../images/oauth2_github_sign_keys.png)

The Caddyfile follows:

```
app.contoso.com {
  route /auth* {
    authp {
      backend github CLIENT_ID CLIENT_SECRET
      transform user {
        match origin github
        action add role authp/user
        ui link "My Website" / icon "las la-star"
        ui link "My Identity" "/auth/whoami" icon "las la-star"
      }
      transform user {
        match origin github
        match email greenpau@contoso.com
        action add role authp/admin
      }
    }
  }

  route {
    authorize {
      primary yes
      allow roles authp/admin authp/user
      validate bearer header
      set auth url /auth/oauth2/github
      inject headers with claims
    }
    respond * "my app" 200
  }
}
```

The users authenticating via Github would have to accept the terms:

![Settings - Developer settings - GitHub Apps - My Gatekeeper - Accept Terms Screen](../images/oauth2_github_accept_screen.png)

