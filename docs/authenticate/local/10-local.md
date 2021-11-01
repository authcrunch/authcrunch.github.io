# Local Configuration

Please refer to the `assets/conf/local/config.json` configuration file when
configurin the plugin backend. In the example, the route refers to `local` backend in
the file `assets/backends/local/users.json`. Specify the path to the file
where you want your database to reside. Do not create a file, but rather
create leading directories.

For example, create `/etc/caddy/auth/local` directory and specify the
`path` value as:

```json
"path": "/etc/caddy/auth/local/users.json",
```

Next, start the server, and find the following following log entries:

```json
{"level":"info","ts":1588704471.5784082,"logger":"http.authentication.providers.portal","msg":"created new user","user_id":"cd5f647a-cc04-4ae2-9d0a-2d5e9b95cf98","user_name":"webadmin","user_email":"webadmin@localdomain.local","user_claims":{"roles":"superadmin"}}
{"level":"info","ts":1588704471.5784378,"logger":"http.authentication.providers.portal","msg":"created default superadmin user for the database","user_name":"webadmin","user_secret":"d87e7749-0dd8-482b-91a2-ada370263293"}
```
