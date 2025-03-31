# Static Users

The following configuration allows to create local users as parts
of the definition for local identity store.

```
local identity store localdb {
    realm local
    path {$HOME}/.local/caddy/localdb/users.json
    user webadmin {
        name Webmaster
        email webadmin@localhost.localdomain
        password "bcrypt:10:$2a$10$WiU7BR1vqCNnzP5rZltJ5Ow5RspiIgnenCCFGSeMPrFFUhHRpkIhe" overwrite
        roles authp/admin authp/user
    }
    user jsmith {
        name John Smith
        email jsmith@localhost.localdomain
        password "My@Password123"
        roles authp/user
    }
}
```

The `overwrite` directive instructs the plugin to overwrite the password
currently configured in the identity store.

## Bcrypt Password Generation

First, download `bcrypt-tool` from https://github.com/shoenig/bcrypt-tool/releases

Extract it to the directory of your choice. Usage is:

```bash
./bcrypt-tool hash SomeFunkyPassword 10
```


Update a user's password in `Caddyfile`:

```
password "bcrypt:10:<new password here>" overwrite
```
