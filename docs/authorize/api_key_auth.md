---
sidebar_position: 15
---

# API Key Authentication

## Usage

The following directives instruct the authorizer to validate API keys
with the "myportal" portal and "local" realm.

With such a setup, the api key generated in the portal can be
used in the `X-Api-Key` header to access authorized resources.

```
security {
  authorization policy mypolicy {
    with api key auth portal myportal realm local
  }
}
```

Currently, for the configuration to work, the `authenticate` and `authorize` should be on
the same server instance.

In the near future, you will be able to configure `authorization policy` in such a way
that it authenticates against remote `authentication portal`.

Please see: https://github.com/greenpau/caddy-security/issues/462


For example, the `/api/*` is protected by the `api_access_policy` below.

```text
...

		local identity store localdb {
			realm local
			path assets/config/users.json
			user webadmin {
				# secret: r7lQbaotIG4303j2to2sS5cOYBEyRAAgDGlbhfgFBxPM889501VDbk8ZmGHAevr8Buv6YRqG
				api key r7lQbaotIG4303j2to2sS5cO "bcrypt:10:$2a$10$dQTjh/Vt2Bu2Vf5OEvyLwOD3wMIi/jbKVdim1xH9GhpV065nUa80G"
			}
		}

...

		authorization policy api_access_policy {
			crypto key verify 01ee2688-36e4-47f9-8c06-d18483702520
			allow roles authp/admin authp/user
			with api key auth portal myportal realm local
		}

...

	route /api/* {
		authorize with api_access_policy
		respond * "api access granted to {http.auth.user.id} in {http.auth.user.realm}" 200
	}
```

The following `curl` request will result in the granted access.

```bash
curl -H 'X-Api-Key: r7lQbaotIG4303j2to2sS5cOYBEyRAAgDGlbhfgFBxPM889501VDbk8ZmGHAevr8Buv6YRqG' https://go.myfiosgateway.com:8443/api/foo
```

The server responds with:

```text
api access granted to webadmin@localhost.localdomain in local
```

If the API key is malformed:

```
```bash
curl -H 'X-Api-Key: foobar' https://go.myfiosgateway.com:8443/api/foo
```

The server responds with:

```
401 Unauthorized
```

If the API header is not the one configured (e.g. different api key header name set), you will get `302` redirect.

```text
> GET /api/foo HTTP/2
> Host: go.myfiosgateway.com:8443
> User-Agent: curl/8.7.1
> Accept: */*
> X-Api-Key: r7lQbaotIG4303j2to2sS5cOYBEyRAAgDGlbhfgFBxPM889501VDbk8ZmGHAevr8Buv6YRqG
> 
* Request completely sent off
< HTTP/2 302 
< alt-svc: h3=":8443"; ma=2592000
< location: /auth?redirect_url=https%3A%2F%2Fgo.myfiosgateway.com%3A8443%2Fapi%2Ffoo
< server: Caddy
< content-type: text/plain; charset=utf-8
< content-length: 5
< date: Thu, 12 Mar 2026 19:29:32 GMT
< 
* Connection #0 to host go.myfiosgateway.com left intact
Found
```

## Changing API Key Header Name

To change the `X-Api-Key` header to something else, use the following directive:

```
security {
  authorization policy mypolicy {
    with api key auth portal myportal realm local
    with api key header name X-Secret
  }
}
```

Please see: https://github.com/greenpau/caddy-security/issues/466

## Changing Authentication Realm Header Name

To change the `X-Auth-Realm` header to something else, use the following directive:

```
security {
  authorization policy mypolicy {
    with auth realm header name X-Secret-Realm
  }
}
```

## Generating API Key

Please see https://github.com/greenpau/go-authcrunch/blob/main/cmd/authdbctl/README.md#generating-api-key to
learn how to generate API keys.