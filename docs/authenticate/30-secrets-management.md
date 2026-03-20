# Secrets Management

## Static Secrets

See https://github.com/greenpau/caddy-security-secrets-static-secrets-manager

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

See https://github.com/greenpau/caddy-security-secrets-aws-secrets-manager