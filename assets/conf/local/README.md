# Local application-role demo

This Caddy Security v1.3.0 / library v1.3.8 example uses three local accounts
and separate application policies. It is HTTP on loopback with public demo
passwords, for a new disposable directory only. Use one demo on port 9080 at a time.

| Account | App roles | `/guests` | `/users` | `/admins` |
| --- | --- | --- | --- | --- |
| Bob | `app/guest` | 200 | 403 | 403 |
| Alice | `app/guest`, `app/member` | 200 | 200 | 403 |
| Carol | `app/guest`, `app/member`, `app/admin` | 200 | 200 | 200 |

All three have `authp/user` for normal portal access. Carol's `app/admin` does
not grant portal `authp/admin`; portal administration and app administration
are different permissions. The bootstrap portal administrator does not
implicitly receive any of these application roles.

Use the executable from [Install and verify](../../../docs/start/install.md).
Copy this Caddyfile into a new demo directory, then run:

```sh
mkdir -p data
export AUTHCRUNCH_DEMO_SECRET="$(openssl rand -hex 32)"
./bin/authcrunch adapt --adapter caddyfile --config Caddyfile >/dev/null
./bin/authcrunch run --config Caddyfile
```

Keep the variable in the server terminal. All accounts
use `LocalDemoPassword123!`. Open `http://localhost:9080/auth/`, finish username
and password steps, then test each app link and a nested path. An anonymous
request redirects to login, a permitted role gets 200, and a signed-in nonmember
gets 403. A fresh request after logout redirects again.

Stop with Ctrl+C. The accounts are initial provisioning, not reconciliation of
an existing database; use a fresh directory and generated key for each test.
For the simpler first-app sequence, follow the [learning path](../../../docs/intro.md).
The previous machine-specific local/GitHub sample had obsolete UI directives
and an administrator-path policy that admitted normal portal users. This file
replaces that behavior with the explicit matrix above.
