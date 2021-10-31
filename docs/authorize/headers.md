---
sidebar_position: 11
---

# HTTP Headers

## Pass JWT Token Claims in HTTP Request Headers

### Auto-Defined Headers

To pass JWT token claims in auto-generated HTTP headers to downstream
plugins, use the following Caddyfile directive:

```
authorize {
   ...
   inject headers with claims
   ...
}
```

The downstream plugins would get the following `X-Token-` headers:

```
    "X-Token-Subject": "webadmin"
    "X-Token-User-Name": "Web Administrator"
    "X-Token-User-Email": "webadmin@localdomain.local"
    "X-Token-User-Roles": "superadmin guest anonymous"
```


### Custom Headers

The syntax for adding a custom header follows:

```
inject header <header_name> from <field_name>
```

For example, add the injection of `X-Picture` header with the value from `picture` field
of JWT token:

```
route /guest* {
  inject headers with claims
  inject header "X-Picture" from picture
}
```

After the addition, we could see the `X-Picture` header, as well as the other
headers injected by `inject headers with claims`:

```json
{
  "X-Picture": "https://avatars.githubusercontent.com/u/3826416?v=4",
  "X-Token-Subject": "github.com/greenpau",
  "X-Token-User-Name": "Paul Greenberg",
  "X-Token-User-Roles": "authp/guest"
}
```

## Strip JWT Token from HTTP Request

The following directive instructs the plugin to remove the found
token from a request.

```
authorize {
   ...
   enable strip token
   ...
}
```

**Note**: Currently, this feature works with cookies only. It will
not strip a token from an authorization header.
