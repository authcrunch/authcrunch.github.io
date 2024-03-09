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

Install `bcrypt-cli` to generate passwords for the users in `Caddyfile`:

```bash
go install github.com/bitnami/bcrypt-cli@latest
```

Generate a password:

```bash
echo -n '4d6822b1-bd45-4d26-9b7e-c2f5ffd31ee5' | bcrypt-cli -c 10
```

Update a user's password in `Caddyfile`:

```
password "bcrypt:10:$2a$10$qiw/ajoL7OBAEtFONhH2JuG2B8haotMqKOAa/ig9zUvxRnX6ceTK6" overwrite
```