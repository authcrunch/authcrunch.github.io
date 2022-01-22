---
sidebar_position: 6
---

# Token Discovery

The `crypto key token name <NAME>` indicates the name of the token to be
searched in the token sources. By default, it is set to `jwt_access_token`
and `access_token`.

The `set token sources` configures where the plugin looks for an authorization
token. By default, it looks in Authorization header, cookies, and query
parameters. The way to change the order of the lookup or to limit the
search to a specific sources is using the following `Caddyfile` directive.

Limits the search of JWT tokens in cookies only.

```
{
  security {
    authorization policy mypolicy {
      set token sources cookie
    }
  }
}
```

Limits the search of JWT tokens cookies and query parameters.

```
{
  security {
    authorization policy mypolicy {
      set token sources cookie query
    }
  }
}
```

Reorders the default priority of the search of JWT tokens from "cookie",
"header", "query" to "header", "query", and "cookie".

```
{
  security {
    authorization policy mypolicy {
      set token sources header query cookie
    }
  }
}
```

Further, the following `Caddyfile` directive instructs the plugin to
search for `Authorization: Bearer <JWT_TOKEN>` header and authorize
the found token:

```
{
  security {
    authorization policy mypolicy {
      validate bearer header
    }
  }
}
```

Test it with the following `curl` command:

```shell
curl --insecure -H "Authorization: Bearer JWT_TOKEN" -v https://localhost:8443/myapp
```
