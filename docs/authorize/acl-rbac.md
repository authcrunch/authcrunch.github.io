---
sidebar_position: 9
---

# Access Lists and Role-based Access Control (RBAC)

The `allow` and `deny` directives are the series of entries defining how to
authorize claims. In the above example, the plugin authorizes access for the holders of "roles"
claim where values are any of the following: "anonymous", "guest", "admin".

## Sources of Role Information

By default, the plugin finds role information in the following token fields:

* `roles`
* `role`
* `group`
* `groups`
* `app_metadata` - `authorization` - `roles`
* `realm_access` - `roles`

In the below example, the use has a single role, i.e. `anonymous`.

```json
{
  "exp": 1596031874,
  "sub": "jsmith",
  "name": "Smith, John",
  "email": "jsmith@gmail.com",
  "roles": [
    "anonymous"
  ],
  "origin": "localhost"
}
```

Additionally, the token validation component of the plugin recognized that roles
may be in other parts of a token, e.g. `app_metadata - authorization - roles`:

```json
{
  "app_metadata": {
    "authorization": {
      "roles": ["admin", "editor"]
    }
  }
}
```

Additionally, `realm_access` - `roles`:

```json
{
  "realm_access": {
    "roles": ["admin", "editor"]
  }
}
```

References:

* [Auth0 Docs - App Metadata](https://auth0.com/docs/users/concepts/overview-user-metadata)
* [Netlify - Role-based access control with JWT - External providers](https://docs.netlify.com/visitor-access/role-based-access-control/#external-providers)

## Anonymous Role

By default, if the plugin does not find role information in JWT token, then
automatically treats the token having the following two roles:

* `anonymous`
* `guest`

For example, it happens when:
* `roles` and `app_metadata` are not present in a token
* `app_metadata` does not contain `authorization`

## Granting Access with Access Lists

Access list rule consists of 3 sections:

* Comment
* Conditions
* Actions

The rule has the following syntax:

```
acl rule {
  comment
  conditions
  action
}
```

For example:

```
acl rule {
  comment Allow viewer and editor access, log, count, and stop processing
  match roles viewer editor
  allow stop counter log debug
}
```

### Comment

The comment section is a string to identify a rule.

The section is a single statement.

### Conditions

The conditions section consists of one or more statements matching the fields
of a token.

#### Match Conditions

There are the following types of `match` conditions:

1. match the value of a particular token field, e.g. `roles`
2. match the HTTP method, e.g. GET, POST, etc.
3. match the HTTP URI path, e.g. `/api`

The condition syntax follows:

```
[no] [exact|partial|prefix|suffix|regex] match <field> <value> ... <valueN>
[no] [exact|partial|prefix|suffix|regex] match method <http_method_name>
[no] [exact|partial|prefix|suffix|regex] match path <http_path_uri>
```

The following conditions match when a token has `roles` field with the values
of either `viewer` or `editor` and has `org` field with the value of `nyc`.

```
match roles viewer editor
match org nyc
```

The following conditions match when a token has `roles` field with the values
of either `viewer` or `editor` and `org` field begins with `ny`.

```
match roles viewer editor
prefix match org ny
```

#### Field Exists Conditions

The field existence in a token conditions follow this syntax.

```
field <name> [not] exists
```

For example the following condition checks for the presence
of `sub` field in a token:

```
field sub exists
```

#### Match Any Condition

The `match` any condition is a shortcut for `field exp exists`.

### Actions

The actions section is a single line instructing how to deal with a token
which matches the conditions.

The potential values for actions follow. Please note the first keyword
could be `allow` or `deny`.

```
allow
allow counter
allow counter log <error|warn|info|debug>
allow log <error|warn|info|debug>
allow log <error|warn|info|debug> tag <value>
allow stop
allow stop counter
allow stop counter log <error|warn|info|debug>
allow stop log <error|warn|info|debug>
allow any
allow any counter
allow any counter log <error|warn|info|debug>
allow any log <error|warn|info|debug>
allow any stop
allow any stop counter
allow any stop counter log <error|warn|info|debug>
allow any stop log <error|warn|info|debug>
```

By default the ACL rule hits are not being logged or counted.

The `log <error|warn|info|debug>` keyword enables the logging of rule hits.
If the log level is not being set, it defaults to `info`.

The `tag` keyword instructs the plugin to add a tag to the log output.

The `counter` keyword enables the counting of hits. The counters could be
exposed with prometheus exporter.

The `stop` keyword instructs the plugin to stop processing ACL rules after
the processing the one with the `stop` keyword.

The `any` keyword instructs the plugin to trigger actions when any of the
conditions match. By default, all the conditions must match to trigger
actions.

### ACL Shortcuts

Here are the patterns of one-liner allowed for use:

```
allow roles viewer editor with method get /internal/dashboard
allow roles viewer editor with method post
deny roles anonymous guest with method get /internal/dashboard
deny roles anonymous guest with method post
allow roles anonymous guest
allow audience https://localhost/ https://example.com/
```

### Primer

Please review configuration files
in [conf](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/) directory.

## Default Allow ACL

If `authorize` configuration contains the following directive, then the "catch-all"
action is `allow`.

```
{
  security {
    authorization policy mypolicy {
      acl default allow
    }
  }
}
```

## Forbidden Access

By default, `caddyauth.Authenticator` plugins should not set header or payload of the
response. However, caddy, by default, responds with 401 (instead of 403),
because `caddyauth.Authenticator` does not distinguish between authorization (403)
and authentication (401).

The plugin's default behaviour is responding with `403 Forbidden`.

However, one could use the `set forbidden url` Caddyfile directive to redirect
users to a custom 403 page.

```
{
  security {
    authorization policy mypolicy {
      set forbidden url /custom_403.html
    }
  }
}
```

