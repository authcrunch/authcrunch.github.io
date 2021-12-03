# Developer Notes

## Authentication Challenges

Conceptually, when a user provides username or email during an authentication
session to authentication portal, the user provides "identity". Optionally, the
user could provide the "realm" to further assist in identifying the user. For
example, user `foo` may exists in multiple realms, e.g. `bar.baz` and `baz.bar`.

Once the portal has the "identity" (`id` and `realm`) of the user, the
portal determines the challenges the user must pass to get authentication.

The "challenge" or "checkpoint" could be one of these:

* Authenticating with a password (`password`)
* Authenticating with application authentication or hardware token (`mfa`)
* Accepting terms of use or consenting to conditions (`consent`)

The checkpoints represent authentication scheme for a user and is being stored
in local authentication database. Additionally, a checkpoint can be applied by
using "User Transforms".

The order of the checkpoints in the user transforms will determine the order
in which the user will receive the challenges.

The portal constructs a list of one or more challenges from the above list.
Then, redirects the user to "sandbox" where the user solves the challenges
to authenticate.

If the user passes these challenges, the user gets authenticated and granted
access.

References:
* `NewCheckpoint` function in [`caddy-authorize/pkg/user/user.go`](https://github.com/greenpau/caddy-authorize/blob/main/pkg/user/user.go)
* `Transform` function in [caddy-auth-portal/pkg/transformer/transformer.go](https://github.com/greenpau/caddy-auth-portal/blob/main/pkg/transformer/transformer.go)

## Sandbox Views

When a user enters the authentication sandbox, the user gets presented one
of the following views:

- `error`: A user encountered an error during one of security challenges
- `terminate`: A user have failed a number of security challenges and is required
  to restart the authentication process
- `mfa_app_auth`: App Authenticator authentication screen
- `mfa_app_register`: App Authenticator registration screen
- `mfa_mixed_auth`: TODO
- `mfa_mixed_register`: TODO
- `mfa_u2f_auth`: TODO
- `mfa_u2f_register`: TODO
- `password_auth`: TODO
- `password_recovery`: TODO
