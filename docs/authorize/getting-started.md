---
sidebar_position: 5
---

# Getting Started

The `caddy-authorize` repository contains a sample configuration.
Please see `assets/conf/Caddyfile`.

My application is a reverse proxy for Prometheus and Alertmanager instances.
I want to allow access to the instances to the holders of **anonymous** and **guest**
claims.

The Alertmanager route is as follows. The instance of the plugin is NOT
a **primary** instance. The configuration is only an access list.

Since the context is not specified, this instance is in "default" authorization
context.

```
{
  debug
  local_certs
  http_port 8080
  https_port 8443
}

localhost:8443 {
  route /prometheus* {
    authorize {
      primary yes
      # omit crypto key directives for single server deployment
      # the plugin will auto-generate ECDSA key pair (ES512) and make
      # it available to portal plugin.
      crypto key verify 383aca9a-1c39-4d7a-b4d8-67ba4718dd3f
      crypto key token name access_token
      set auth url /auth
      allow roles anonymous guest admin
    }
    respond * "prometheus" 200
  }

  route /alertmanager* {
    authorize
    respond * "alertmanager" 200
  }

  route /auth* {
    respond * "auth portal" 200
  }

  route /version* {
    respond * "1.0.0" 200
  }

  route {
    redir https://{hostport}/auth 302
  }
}
```

Next, notice that Prometheus route the the **primary** in its authorization
context. It has the default setting for the entire context, i.e. all the
routes with `authorize` directive.

The `primary` indicates that the instance is the primary instance in its
authorization context.

Please note that the `authorize` directive instucts the instance of the
plugin to inherit all of its properties from the `primary` instance.
This greatly simplifies the configuration.

```
route /alertmanager* {
  authorize
  respond * "alertmanager" 200
}
```

The `allow` and `deny` directives are the series of entries defining how to
authorize claims. In the above example, the plugin authorizes access
for the holders of "roles" claim where values are any of the
following: "anonymous", "guest", "admin".
