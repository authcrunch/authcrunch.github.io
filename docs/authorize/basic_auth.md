---
sidebar_position: 14
---

# Basic Authentication

The following directives instruct the authorizer to validate Basic
Authentication credentials with the "myportal" portal
and "local" realm.

```
security {
  authorization policy mypolicy {
    with basic auth portal myportal realm local
  }
}
```

Currently, for the configuration to work, the `authenticate` and `authorize` should be on
the same server instance.

In the near future, you will be able to configure `authorization policy` in such a way
that it authenticates against remote `authentication portal`.

Please see: https://github.com/greenpau/caddy-security/issues/462

## Usage

The following commands pass basic auth credentials:


```bash
curl -v -H 'X-Auth-Realm: local' --user 'jsmith:My@Password123' https://go.myfiosgateway.com:8443/api/foo
curl -v -H 'X-Auth-Realm: userpool1.localdomain' --user 'jsmith:My@Password123' https://go.myfiosgateway.com:8443/api/foo
```

## Setting Default Realm

If you want to set default realm, so that you don't have to provide `X-Auth-Realm` header, add `request_header` prior
to `authorize`.

```Caddyfile
handle * {
	request_header +X-Auth-Realm "local"
	authorize with mypolicy
}
```

## Multiple Realms

In the below configuration we have multiple realms: `userpool1.localdomain` and `userpool2.localdomain`.

```text
	security {

    ...

		local identity store userpool1 {
			realm userpool1.localdomain
			path assets/config/userpool1.json
			icon "USERPOOL1" "las la-shield-alt la-2x" "white" "#fc6d26" priority 90
			user webadmin {
				name Webmaster
				email webadmin@localhost.localdomain
				password "bcrypt:10:$2a$10$r3mhN5ZzrmufA2rjcn4iCuaAXN9.3OCDxiPYheSuU8Pq1xWiiDBhG" overwrite
				roles "authp/admin" "authp/user"
			}
			user jsmith {
				name John Smith
				email jsmith@localhost.localdomain
				password "My@Password123"
				roles "authp/user" "dash"
				# apikey: FDWgq9cSwD6lF1d6djazgSxyh6cDRFfkBobyp5bWIkbRvCWt03oXauCSz8pa1sJsAO8txytf
				api key FDWgq9cSwD6lF1d6djazgSxy "bcrypt:10:$2a$10$UQNdEmDD0zhg1crmy9EoEeXyxfPzVf31y8Dvig8rCceHj0xW1W7nC"
			}
		}

		local identity store userpool2 {
			realm userpool2.localdomain
			icon "USERPOOL2" "las la-shield-alt la-2x" "white" "#fc6d26" priority 80
			path assets/config/userpool2.json
			user webadmin {
				name Webmaster
				email webadmin@localhost.localdomain
				password "bcrypt:10:$2a$10$r3mhN5ZzrmufA2rjcn4iCuaAXN9.3OCDxiPYheSuU8Pq1xWiiDBhG" overwrite
				roles "authp/admin" "authp/user"
			}
			user mstone {
				name Mia Stone
				email mstone@localhost.localdomain
				password "My@Password123"
				roles "authp/user" "dash"
				# apikey: IP8PjcP4sKRS50CVuIYHN5ylNaKoJHCwtg3eklq67uk0dX9OQoylCWnBcKFqpTD5u2cFyARr
				api key IP8PjcP4sKRS50CVuIYHN5yl "bcrypt:10:$2a$10$.DFyI5DxFeuQUWoTFNQIiOAG5Pf8DuzrClFA7qSTg5azL44mtaSRa"
			}
		}

...


		authentication portal myportal {

...
			enable identity store userpool1
			enable identity store userpool2
		}

...

		authorization policy api_access_policy {
			crypto key verify 01ee2688-36e4-47f9-8c06-d18483702520
			allow roles authp/admin authp/user
			with basic auth portal myportal realm userpool1.localdomain
			with basic auth portal myportal realm userpool2.localdomain
			# with auth realm header name X-Auth-Realm
		}
...

  }

...

*:8443 {
	route /api/* {
		authorize with api_access_policy
		respond * "api access granted to {http.auth.user.id} in {http.auth.user.realm}" 200
	}
}
```

When user logs in, the user can see the two realms present:

![](./images/multi_realm_basic_auth_login.png)

A user from `userpool1.localdomain` authenticates the following way:

```bash
curl -H 'X-Auth-Realm: userpool1.localdomain' -H 'Authorization: Basic anNtaXRoOk15QFBhc3N3b3JkMTIz' https://go.myfiosgateway.com:8443/api/foo
curl -H 'X-Auth-Realm: userpool1.localdomain' -u "jsmith:My@Password123" https://go.myfiosgateway.com:8443/api/foo
```

The expected output follows. Note the `userpool1.localdomain` in the output.

```text
api access granted to jsmith@localhost.localdomain in userpool1.localdomain
```

A user from `userpool2.localdomain` authenticates the following way:

```bash
curl -H 'X-Auth-Realm: userpool2.localdomain' -H 'Authorization: Basic bXN0b25lOk15QFBhc3N3b3JkMTIz' https://go.myfiosgateway.com:8443/api/foo
curl -H 'X-Auth-Realm: userpool2.localdomain' -u "mstone:My@Password123" https://go.myfiosgateway.com:8443/api/foo
```

The expected output follows. Note the `userpool2.localdomain` in the output.

```text
api access granted to mstone@localhost.localdomain in userpool2.localdomain
```

## Changing Authentication Realm Header Name

To change the `X-Auth-Realm` header to something else, use the following directive:

```
security {
  authorization policy mypolicy {
    with auth realm header name X-Secret-Realm
  }
}
```