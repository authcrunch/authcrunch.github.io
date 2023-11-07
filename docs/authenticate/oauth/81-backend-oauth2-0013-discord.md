# Discord

Discord OAuth2 integration allows you to use discord as an identity provider.

It also allows you to add roles to the users based on which "discord servers" they are members of.

The following [`Caddyfile`](https://github.com/authp/authp.github.io/blob/main/assets/conf/oauth/discord/Caddyfile) allows Discord-based authentication

### Registering a discord application

In order to use this plugin with caddy-security you'll need a to register an application in the [Discord Developer Portal](https://discord.com/developers/applications).

Once an application has been created go to the OAuth tab:

![Discord Application Dashboard](../images/oauth2_discord_new_app.jpg)

Copy the `CLIENT ID` and `CLIENT SECRET` and click on `Add Redirect` to add the caddy-security redirect
* For an app hosted on `localhost:443` with the auth portal on route `/auth` add the following redirect: `https://localhost/auth/oauth2/discord/authorization-code-callback`

Be sure to save the changes before closing the browser.

### Sample Caddyfile configuration

```caddyfile
oauth identity provider discord {
  realm discord
  driver discord
  client_id {$CLIENT_ID}
  client_secret {$CLIENT_SECRET}
  scopes identify email guilds guilds.members.read # Optional, `email`, `guilds`, and `guilds.members.read` are optional, see notes below
  user_group_filters {$DISCORD_GUILD_ID} {$OTHER_GUILD_ID} # Optional, effective only if scope guilds is specified
}
```

By default the request for authentication to discord is made only with the "identify" scope (the bare minimum) and that will give you back the id, username and avatar of the logged in user.

you can then match the user ID in the a `transform user` directive like this:

```caddyfile
transform user {
    match sub discord.com/{$DISCORD_USER_ID}
    action add role authp/admin
}
```

**Note**: The DISCORD_USER_ID is a number uniquely identifying the user in question.
To get a discord ID for a particular user using the discord desktop app:
1. Enable developer mode by going to Settings->\[App Settings\]->Advanced->Enable Developer Mode
2. Right click on a user and the last option in the popup menu will be "Copy ID"

**Note**: If you add "email" to the list of scopes requested the email will also be saved.

### Filtering by guild

**Note**: "Guild" is the discord terminology for a "discord server"

**Note**: In order to discriminate users based on which guild they belong to you have to enable the `guilds` scope in the discord oauth configuration above (`scopes identify guilds`)

After the user is authenticated another query is made to the discord api requesting a list of guild IDs the user is part of. By default the result is ignored, which means no new roles will be added to the user object based on guild membership.

To create roles based on the user's membership of ALL his guilds use `user_group_filters *` in the discord oauth configuration.

If you are only interested in the membership of a particular guild then add the guild id like this: `user_group_filters 1254335`

**NOTE**: To get a guild id follow the same instructions as for a DISCORD_USER_ID (explained above)

If the `user_group_filters` filter check passes then additional `roles` will be added to the user as following:
1. If the user is a member of a guild => role `discord.com/{$DISCORD_GUILD_ID}/members`
2. If the user has admin privileges in a guild => role `discord.com/{$DISCORD_GUILD_ID}/admins`

You can them match them like this:

```caddyfile
transform user {
    match role discord.com/{$DISCORD_GUILD_ID}/admins
    action add role authp/admin
}

transform user {
    match role discord.com/{$DISCORD_GUILD_ID}/members
    action add role authp/user
}
```

To find the Role IDs for a server:
1. Enable developer mode by going to Settings->\[App Settings\]->Advanced->Enable Developer Mode
2. Go to the Server Settings for the guild you want to filter by
3. Go to Roles, and right click on the Role in the list of roles that you want, you should see an option "Copy Role ID"

### Filtering by guild role

**Note**: To enable discriminating users based on their role in a specific guild you must enable both the `guilds` AND `guilds.members.read` scopes. (`scopes identify guilds guilds.members.read`) [Read more here](https://discord.com/developers/docs/resources/user#get-current-user-guild-member)

Filtering by role in a guild can be combined with `Filtering by guild` above. Members of a guild will still receive the `discord.com/{$DISCORD_GUILD_ID}/members` and `discord.com/{$DISCORD_GUILD_ID}/admins` roles above.

Users will also receive `discord.com/{$DISCORD_GUILD_ID}/role/{$DISCORD_ROLE_ID}` for each role the user has in each of the guilds specified in `user_group_filters`

Just as in the section above `Filter by guild`, after the user authenticates another query is made to the discord api to fetch their guild IDs, this list of guild IDs is filtered by `user_group_filters`. If the `guilds.members.read` scope is specified then for each specified guild, a query to fetch the user's member data will be made. Only the role ids from this response are saved and they can be used as demonstrated below.

```caddyfile
transform user { # Give a role `authp/rolename` for the specified Role ID in a specific guild
    match role discord.com/{$DISCORD_GUILD_ID}/role/{$DISCORD_ROLE_ID}
    action add role authp/rolename
}

transform user { # Give the role `authp/user` for all members of the guild regardless of their role in the guild
    match role discord.com/{$DISCORD_GUILD_ID}/members
    action add role authp/user
}
```
