# Discord

Discord OAuth2 integration allows you to use discord as an identity provider.

It also allows you to add roles to the users based on which "discord servers" they are members of.

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
  scopes identify email guilds # Optional, see notes below
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

**Note**: In order to disciminate users based on which guild they belong to you have to enable the guild scope in the discord oauth configuratio above (`scopes identity guild`)

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