# LDAP Authentication Architecture

The plugin does not keep connections open to LDAP servers. The plugin
tears a connection down each time it finishes authenticating a request
associated with the connection.

First, the plugin uses `username` and `password` to bind to an LDAP
server. The purpose of the connection is searching for user objects
in the server's directory.

The plugin takes the username provided in a request. Next, the
plugin substitutes `%s` with the username in its search filter, i.e.
`(&(|(sAMAccountName=%s)(mail=%s))(objectclass=user))`.

The plugin initiates a search for a user object in the scope provided
via `search_base_dn`, e.g. `DC=CONTOSO,DC=COM`.

If the number of objects in the result of the search is not `1`, then
authentication fails.

Typically, the response would have the following structure:

```json
[
  {
    "DN": "CN=Smith\\, John,OU=Users,DC=CONTOSO,DC=COM",
    "Attributes": [
      {
        "Name": "sn",
        "Values": [
          "Smith"
        ]
      },
      {
        "Name": "givenName",
        "Values": [
          "John"
        ]
      },
      {
        "Name": "memberOf",
        "Values": [
          "CN=Admins,OU=Security,OU=Groups,DC=CONTOSO,DC=COM",
          "CN=Editors,OU=Security,OU=Groups,DC=CONTOSO,DC=COM",
          "CN=Viewers,OU=Security,OU=Groups,DC=CONTOSO,DC=COM"
        ]
      },
      {
        "Name": "sAMAccountName",
        "Values": [
          "jsmith"
        ]
      },
      {
        "Name": "mail",
        "Values": [
          "jsmith@contoso.com"
        ]
      }
    ]
  }
]
```

The plugin iterates over `memberOf` attribute and compares the
values to its group mapping:

```json
              "groups": [
                {
                  "dn": "CN=Admins,OU=Security,OU=Groups,DC=CONTOSO,DC=COM",
                  "roles": [
                    "admin"
                  ]
                },
                {
                  "dn": "CN=Editors,OU=Security,OU=Groups,DC=CONTOSO,DC=COM",
                  "roles": [
                    "editor"
                  ]
                },
                {
                  "dn": "CN=Viewers,OU=Security,OU=Groups,DC=CONTOSO,DC=COM",
                  "roles": [
                    "viewer"
                  ]
                }
              ]
```

If there are no matches, the authentication fails.

Once the plugin determines the user's roles, e.g. `admin`, `editor`, `viewer`,
the plugin actually checks whether the user's password is valid.

It does so by doing LDAP re-binding with the user's DN and the password provided
in the request. In this example, the user's DN is
`CN=Smith\\, John,OU=Users,DC=CONTOSO,DC=COM`.

If the re-binding is successful, the plugin issues a JWT token.
