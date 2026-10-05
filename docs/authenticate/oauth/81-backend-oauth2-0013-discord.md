---
title: "Discord"
description: "Connect a user OAuth app, filter exact guild IDs, map guild roles to application permission, and test denied identities."
discovery:
  topic: identity-providers
  kind: guide
---

import CodeBlock from '@theme/CodeBlock';
import example from '@site/assets/conf/oauth/discord/Caddyfile?raw';

# Discord

Use the Discord OAuth2 named driver to identify an account and optionally map
its guild memberships/roles. A guild is Discord's term for a server. This is a
user OAuth application, not a bot invitation or a bot token configuration.

### Registering a discord application

Create an application in the [Discord developer portal](https://discord.com/developers/applications),
record its client ID and private OAuth client secret, and add exactly:

```text
https://auth.example.com/auth/oauth2/discord/authorization-code-callback
```

Save `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` in the server environment.
Enable developer mode when copying numeric guild and role IDs. IDs and display
names are different; names alone cannot populate this example's filters.
See [Discord's OAuth2 scopes and code flow](https://docs.discord.com/developers/topics/oauth2).

<figure className="doc-screenshot">

[![Historical Discord OAuth2 settings and Add Redirect; keep the client secret private and use the public callback above.](../images/oauth2_discord_new_app.jpg)](../images/oauth2_discord_new_app.jpg)

<figcaption>Historical Discord OAuth2 settings and Add Redirect; keep the client secret private and use the public callback above.</figcaption>
</figure>
### Sample Caddyfile configuration

<CodeBlock language="caddyfile" title="assets/conf/oauth/discord/Caddyfile">{example}</CodeBlock>
Set a private `AUTHCRUNCH_SIGNING_KEY` plus numeric `DISCORD_GUILD_ID` and
`DISCORD_ROLE_ID` before parsing. The ID placeholders expand at parse time.
The initial transform clears reserved portal roles and direct `app/member`;
only the intended role in the intended guild grants application access.

The named driver defaults to `identify` and disables PKCE and nonce. `email`
requests optional email, `guilds` enables membership queries, and
`guilds.members.read` enables a per-guild member-role query. Email may still be
missing; choose deliberately whether your subject-based application permits
`disable email claim check`.

For account-specific access instead, match the **entire**
`discord.com/NUMERIC_USER_ID` subject with the correct realm, then add an
application role. A Discord account or guild administrator is not automatically
an AuthCrunch administrator.

### Filtering by guild

`user_group_filters` contains **regular expressions**, not a wildcard language.
Use anchored `^NUMERIC_GUILD_ID$` for one exact guild. The old `*` example is
invalid regex; `.*` would match every returned guild and should be used only
when that broad disclosure/role mapping is intentional. Without filters, guild
membership does not produce these roles.

| Observed membership | Derived role |
| --- | --- |
| Member of an included guild | `discord.com/GUILD_ID/members` |
| Administrator permission bit in that guild | `discord.com/GUILD_ID/admins` |

Filtering controls which membership data becomes roles; it does not itself deny
an otherwise valid Discord login. The application's policy still requires
`app/member`. An API failure can leave login without guild roles; a restrictive
policy then denies application access.

### Filtering by guild role

With both `guilds` and `guilds.members.read`, the connector queries each included
guild member and adds `discord.com/GUILD_ID/role/ROLE_ID` for returned role IDs.
The canonical transform admits exactly the selected guild-role combination.
It does not grant all guild members application access, nor does it promote a
Discord guild administrator to portal administration.

Test a member with the selected role, a member without it, and an account in
another guild. Removing a guild role does not revoke every previously issued
portal JWT immediately; use a suitable access lifetime and require a fresh
login to inspect changed provider data.

## Verify and troubleshoot

Sign in through `/auth/oauth2/discord`, inspect `/auth/whoami?format=json`, and
record the exact subject and realm without logging access tokens. Confirm that
an intended member reaches `/app` and another valid identity is denied. A
successful provider login alone does not establish application authorization.

Check callback scheme, hostname, port, mount, and realm literally; inspect
provider errors and [diagnostic logs](../../operations/logging.md). Keep client
secrets on the server. These examples are parser-verified against the released
bundle; console registration, live provider login, consent, and production TLS
require verification in your own organization.
