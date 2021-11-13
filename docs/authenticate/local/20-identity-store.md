# Identity Store

The `users.json` file has the following structure:

```
{
  "version": "1.1.2",
  "policy": {
    "password": {
      "keep_versions": 10,
      "min_length": 8,
      "max_length": 128,
      "require_uppercase": false,
      "require_lowercase": false,
      "require_number": false,
      "require_non_alpha_numeric": false,
      "block_reuse": false,
      "block_password_change": false
    },
    "user": {
      "min_length": 3,
      "max_length": 50,
      "allow_non_alpha_numeric": false,
      "allow_uppercase": false
    }
  },
  "revision": 2,
  "last_modified": "2021-10-25T13:04:58.482997492-04:00",
  "users": [
    {
      "id": "39555452-454e-4c85-829b-8195a8dd8c81",
      "username": "webadmin",
      "email_address": {
        "address": "webadmin@localdomain.local",
        "domain": "localdomain.local"
      },
      "email_addresses": [
        {
          "address": "webadmin@localdomain.local",
          "domain": "localdomain.local"
        }
      ],
      "passwords": [
        {
          "purpose": "generic",
          "algorithm": "bcrypt",
          "hash": "$2a$10$B67nHY0PEdxLYdyoLk1YLOomvs.T/dSIyzPuoX9vWULrsD3PRf/sq",
          "cost": 10,
          "expired_at": "0001-01-01T00:00:00Z",
          "created_at": "2021-10-25T17:04:58.4251263Z",
          "disabled_at": "0001-01-01T00:00:00Z"
        }
      ],
      "created": "2021-10-25T17:04:58.42512588Z",
      "last_modified": "2021-10-25T17:04:58.42512594Z",
      "roles": [
        {
          "name": "admin",
          "organization": "authp"
        }
      ]
    }
  ]
}
```

If the file does not exists, the plugin would create it for you.
The password will be in the log output.

Finally, browse to `/auth` and login with the username and password:

![](../images/basic_login.png)

There is no web interface for adding users. You would need to manually
edit the JSON file to add users.
