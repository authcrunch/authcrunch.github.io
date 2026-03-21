---
sidebar_position: 1
---

# Secrets Management

The `authenticate` and `authorize` sub-systems require managing credentials,
e.g. email credentials.


## Credentials Directive

The `credentials` directive is the most basic way to store passwords.

The syntax for the usage of secrets is:

```Caddyfile
{
  security {
    credentials smtp.outlook.com {
      username {env.SMTP_USERNAME}
      password {env.SMTP_PASSWORD}
    }
  }
}
```

## Static Secrets Plugin

The [caddy-security-secrets-static-secrets-manager](https://github.com/greenpau/caddy-security-secrets-static-secrets-manager)
is another Caddy plugin that allows reading secrets from config and refer to the in the `security` app with `secrets:`.

The syntax for the usage of secrets is `secrets:<KEY>:<VALUE>`.

Here, the `KEY` is `shared_secret` and the `VALUE` is `b006d65b-c923-46a1-8da1-7d52558508fe`.

```Caddyfile
		secrets static_secrets_manager access_token {
			shared_secret b006d65b-c923-46a1-8da1-7d52558508fe
		}
```

Example follows.

```Caddyfile
{
	security {
		# require secrets-static-secrets-manager plugin
		secrets static_secrets_manager access_token {
			shared_secret b006d65b-c923-46a1-8da1-7d52558508fe
		}

		secrets static_secrets_manager users/jsmith {
			username jsmith
			name "John Smith"
			email "jsmith@localhost.localdomain"
			password "My@Password123"
		}

		local identity store localdb {
			realm local
			path assets/config/users.json
			user "secrets:users/jsmith:username" {
				name "secrets:users/jsmith:name"
				email "secrets:users/jsmith:email"
				password "secrets:users/jsmith:password"
				roles "authp/user" "dash"
			}
        }

		authentication portal myportal {
			crypto key sign-verify secrets:access_token:shared_secret
			enable identity store localdb
		}

		authorization policy mypolicy {
			crypto key verify "secrets:access_token:shared_secret"
		}
    }
}
```

## AWS Secrets Manager Secrets

The [ccaddy-security-secrets-aws-secrets-manager](https://github.com/greenpau/caddy-security-secrets-aws-secrets-manager)
is another Caddy plugin that allows reading secrets from AWS SSM and refer to the in the `security` app with `secrets:`.

The syntax for the usage of secrets is `secrets:<KEY>:<VALUE>`.

Example follows.

```Caddyfile
{
	security {
		secrets aws_secrets_manager access_token {
			region us-east-1
			path authcrunch/caddy/access_token
		}

		secrets aws_secrets_manager users/jsmith {
			region us-east-1
			path authcrunch/caddy/users/jsmith
		}

		local identity store localdb {
			realm local
			path users.json
			user jsmith {
				name "secrets:users/jsmith:name"
				email "secrets:users/jsmith:email"
				password "secrets:users/jsmith:password" overwrite
				api_key "secrets:users/jsmith:api_key" overwrite
				roles authp/admin authp/user
			}
		}

		authentication portal myportal {
			crypto default token lifetime 3600
			crypto key sign-verify "secrets:access_token:value"
			enable identity store localdb
		}
	}
}
```