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

## Password Generation

First, download `go-authcrunch` files from [releases](https://github.com/greenpau/go-authcrunch/releases).
When you unpack, there will be `authdbctl` utility in `bin/` directory.

Alternatively, you can install it with `go`:

```bash
go install github.com/greenpau/go-authcrunch/cmd/authdbctl@latest
```

Usage:

```text
$ authdbctl generate password hash --help
NAME:
   authdbctl generate password hash - generate password hash

USAGE:
   authdbctl generate password hash [command options]

OPTIONS:
   --password value  The password to hash (insecure, use prompt instead)
   --cost value      The hashing cost factor (default: 10)
   --db-path PATH    Sets PATH to the database file
   --help, -h        show help
```

Generate:

```bash
authdbctl generate password hash
authdbctl generate password hash --cost 10 --password SomeFunkyPassword
authdbctl generate password hash --db-path assets/conf/local/users.json
```

Once generated, update a user's password in `Caddyfile`:

```
password "bcrypt:10:<new password here>" overwrite
```
