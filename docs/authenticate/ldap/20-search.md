---
title: "LDAP user search"
description: "Trace LDAP service binding, escaped user lookup, membership mapping, and password verification, including fallback and failure boundaries."
discovery:
  topic: identity-providers
  kind: concept
  aliases: ["search_base_dn", "sAMAccountName", "Active Directory"]
---

# LDAP user search

An LDAP login has two credentials: the portal's search-service credential and
the end user's password. The service credential locates an account; it does not
prove that the requester owns it. The released connector opens connections for
its work and closes them afterward rather than maintaining a persistent pool.
See [LDAP configuration](10-ldap.md) for complete verified-TLS examples.

## Lookup and membership

The connector binds as the configured service account, searches beneath
`search_base_dn`, and replaces every `%s` in `search_user_filter` (also accepted
as `search_filter`) with the **LDAP-filter-escaped login**. For example:

```Caddyfile
search_user_filter "(&(|(sAMAccountName=%s)(mail=%s))(objectClass=user))"
```

Escaping prevents characters such as `*` or parentheses in user input from
becoming filter operators. DN escaping and filter escaping serve different
purposes; see [RFC 4515](https://www.rfc-editor.org/rfc/rfc4515).
The lookup must return exactly one entry. Zero or multiple matches fail rather
than choosing an arbitrary user. The returned DN supplies the subsequent user
bind; configured attributes supply the username, name, email, and memberships.

A synthetic AD entry might contain:

```json
{
  "DN":"CN=Smith\\, John,OU=Users,DC=CONTOSO,DC=COM",
  "Attributes":[
    {"Name":"givenName","Values":["John"]},
    {"Name":"sn","Values":["Smith"]},
    {"Name":"sAMAccountName","Values":["jsmith"]},
    {"Name":"mail","Values":["jsmith@contoso.com"]},
    {"Name":"memberOf","Values":["CN=App Members,OU=Groups,DC=CONTOSO,DC=COM"]}
  ]
}
```

Ordinary mode compares `memberOf` DN values with the explicit `groups` mappings
using case-insensitive string comparison. It does not automatically query or
expand every nested directory group. The directory and search schema determine
which memberships are returned.

With `posix_groups`, it instead searches for group entries under the configured
base. `%s` in `search_group_filter` is the escaped **returned user DN**.
This supports DN-valued membership filters; it is not a bare-username `memberUid`
substitution. The resulting entry DNs drive explicit or automatic mapping.
A failed or empty secondary search is an authentication error.

## Role and password boundaries

When ordinary successful mapping yields no roles, explicitly configured
`fallback roles` can provide limited roles. Without a mapping or applicable
fallback, identification fails. Fallback never validates a password and never
rescues a failed secondary search.

After identification, the password checkpoint opens a directory connection,
binds the service account, locates the account again, and binds with the returned
**user DN and submitted password**. A wrong password fails even if group mapping
succeeded. Only completed authentication checkpoints lead to a portal access
JWT; group membership alone is not authentication evidence.

The token then passes through [user transforms](../42-user-transforms.md) and
the application's [authorization policy](../../authorize/intro.md). Keep a
limited portal role separate from application membership. Account disablement
or a group change does not instantly revoke all previously issued JWTs; choose
an appropriate [access lifetime](../../authorize/token-verification.md) and
recheck behavior for your integration.
