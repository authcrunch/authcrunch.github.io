# Local Configuration

The following directive instructs the plugin to use the local
`$HOME/.local/caddy/users.json` file for authentication.

```
{
  security {
    local identity store localdb {
      realm local
      path {$HOME}/.local/caddy/users.json
    }

    authentication portal myportal {
      enable identity store localdb
    }
  }
}

app.contoso.com {
  authenticate with myportal
}
```

Please browse the following configuration files for examples:

* [Local auth only](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/local/Caddyfile)
* [Local auth with registration](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/local/registration/Caddyfile)

The plugin creates local authentication file (i.e. `users.json`) if it does
not exist already.

After starting the server, and find the following log entries with
`user_name` and `user_secret`.

```json
{"level":"info","ts":1588704471.5784082,"logger":"http.authentication.providers.portal","msg":"created new user","user_id":"cd5f647a-cc04-4ae2-9d0a-2d5e9b95cf98","user_name":"webadmin","user_email":"webadmin@localdomain.local","user_claims":{"roles":"superadmin"}}
{"level":"info","ts":1588704471.5784378,"logger":"http.authentication.providers.portal","msg":"created default superadmin user for the database","user_name":"webadmin","user_secret":"d87e7749-0dd8-482b-91a2-ada370263293"}
```

Alternatively, use the following environment variables to instruct the plugin which username, email and password to use.

* `AUTHP_ADMIN_USER`
* `AUTHP_ADMIN_EMAIL`
* `AUTHP_ADMIN_SECRET`
