# GitHub

Follow the instructions at `https://github.com/settings/apps/new` (or `https://github.com/organizations/<your_org>/settings/applications/new` for orgs).

GitHub App name: "My Gatekeeper"

Description: "Caddy v2 Authentication Portal"

Homepage URL: `https://localhost:8443/`

User authorization callback URL: `https://localhost:8443/oauth2/github/authorization-code-callback`

Check "Expire user authorization tokens".

Check "Request user authorization (OAuth) during installation"

Upon successful completion of the instructions, you will get:

![Settings - Developer settings - GitHub Apps - My Gatekeeper](../images/oauth2_github_new_app.png)

Additionally, click "generate a private key" to sign access token requests.

![Settings - Developer settings - GitHub Apps - My Gatekeeper - Private Keys](../images/oauth2_github_sign_keys.png)

This [`Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/oauth/github/Caddyfile)
allows GitHub-based authentication.

The users authenticating via GitHub would have to accept the terms:

![Settings - Developer settings - GitHub Apps - My Gatekeeper - Accept Terms Screen](../images/oauth2_github_accept_screen.png)

