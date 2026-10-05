# Historical AuthCrunch solutions

These scenarios preserve older experiments rather than maintained deployment
recipes. They use workstation-specific TLS/store paths, fixed demo accounts,
wide shared cookie domains and old `/settings` links. Do not source their `env`
files or run them against an existing identity store without reviewing the
commands and paths. Current account management lives at `/profile/`.

| Scenario | Original purpose | Current guidance |
| --- | --- | --- |
| [A00001](A00001/README.md) | Remove selected token roles | [User transforms](../../docs/authenticate/42-user-transforms.md) |
| [A00002](A00002/README.md) | Choose a dashboard with browser JavaScript | [UI customization](../../docs/authenticate/55-ui-features.md) and [server-side path ACLs](../../docs/authorize/path-acl.md) |
| [A00003](A00003/README.md) | Trusted logout return | [Logout](../../docs/authenticate/15-logout.md) and [trusted destinations](../../docs/authenticate/100-trust-login-logout.md) |

Start a new setup with the [learning example](../conf/getting-started/Caddyfile)
or a current provider's canonical configuration. Client-side navigation is not
an authorization rule, and portal roles are not automatic app permissions.
