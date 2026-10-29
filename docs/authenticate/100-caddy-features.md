---
sidebar_position: 100
---

# Caddy Replacers

Caddy placeholders let configuration values come from the environment, files,
system information, or the current time. Caddy Security resolves supported
placeholders while provisioning the `security` app. It keeps the declarative
configuration unchanged and uses a resolved copy at runtime.

This timing matters during reloads: the running Caddy process resolves the
placeholders, not the process that adapts and submits the Caddyfile. If a value
cannot be resolved, provisioning fails and Caddy rejects the new configuration.

## Placeholder Forms

| Form | Meaning |
| --- | --- |
| `{env.NAME}` | Read `NAME` from the running Caddy process environment. |
| `{file.PATH}` | Read `PATH` from the filesystem. |
| `{$NAME}` | Substitute `NAME` while adapting a Caddyfile. This is not a runtime replacer. |
| `secrets:<manager-id>:<key>` | Ask a configured Caddy Security secrets manager for a value. |

Caddy's global replacer also provides placeholders such as
`{system.hostname}`, `{system.os}`, `{system.arch}`, `{system.wd}`, and
`{time.now}`. See [Caddy's placeholder conventions](https://caddyserver.com/docs/conventions#placeholders)
for the complete Caddy syntax.

### Environment Values

Use `{env.NAME}` when the value itself is stored in an environment variable:

```
oauth identity provider google {
  realm google
  driver google
  client_id {env.GOOGLE_CLIENT_ID}
  client_secret {env.GOOGLE_CLIENT_SECRET}
}
```

Do not use `{$GOOGLE_CLIENT_SECRET}` for a secret. The `{$NAME}` form is
expanded during Caddyfile adaptation, so the resulting JSON configuration can
contain the secret. The `{env.NAME}` form remains a placeholder in the stored
configuration and is resolved only in the runtime copy.

### File Values

Use `{file.PATH}` when the value is stored in a file:

```
authentication portal myportal {
  crypto key sign-verify {file./run/secrets/auth_sign_key}
}
```

The file path can itself come from a Caddyfile environment substitution:

```
oauth identity provider google {
  realm google
  driver google
  client_id {file.{$GOOGLE_CLIENT_ID_FILE}}
  client_secret {file.{$GOOGLE_CLIENT_SECRET_FILE}}
}
```

Here, `{$GOOGLE_CLIENT_SECRET_FILE}` is replaced with the path during
adaptation. The outer `{file.*}` placeholder remains unresolved until the
`security` app is provisioned. The file is read by the running Caddy process,
which must have permission to access it.

Caddy reads at most 1 MiB from a file placeholder and removes one trailing
newline. Keep credential files limited to the intended value.

## When Values Are Resolved

The lifecycle is:

1. Caddy adapts the Caddyfile to JSON. `{$NAME}` substitutions happen here.
2. Caddy loads the JSON configuration.
3. Caddy Security copies its declarative configuration.
4. Caddy replacers and configured secrets managers resolve supported values in
   that copy.
5. Caddy Security validates the resolved configuration and constructs the
   runtime app.

The Caddy admin API therefore retains `{env.*}` and `{file.*}` references
instead of returning the resolved values. This avoids exposing file contents or
runtime environment secrets through `/config/`.

On `caddy reload`, the process submitting the configuration does not need
access to files referenced by `{file.*}`. The running Caddy service does. This
is important for systemd credentials and other files available only inside the
service's mount namespace.

## Supported Caddy Security Configuration

Caddy Security resolves placeholders in these configuration areas:

- credentials, messaging providers, and user registration directives;
- identity store and identity provider parameters, including OAuth client IDs
  and client secrets;
- SSO provider entity IDs, certificate paths, private-key paths, and locations;
- authentication portal crypto keys, user transforms, selected UI paths and
  text, cookies, and token refresh settings;
- authorization policy crypto keys; and
- portal and policy names used by the `authenticate` and `authorize` HTTP
  directives.

Replacement is not a recursive walk of every string in the configuration.
Fields outside the supported areas may retain their literal placeholder text.

Resolved values are treated as data and are not expanded a second time. For
example, an environment variable whose value is `{env.OTHER_VALUE}` produces
that literal text; it does not trigger another lookup.

## Caddy Security Secrets Managers

The `secrets:<manager-id>:<key>` form is provided by Caddy Security rather than
the Caddy replacer. It is resolved after Caddy placeholders and must be the
entire configuration value:

```
{
  security {
    secrets static_secrets_manager access_token {
      shared_secret {env.JWT_SHARED_KEY}
    }

    authentication portal myportal {
      crypto key sign-verify "secrets:access_token:shared_secret"
    }
  }
}
```

The manager ID must match the ID in the `secrets` block, and the manager must
return a string for the requested key. See [Secrets Management](../credentials/intro.md)
for the available manager examples.

## Failure Behavior

Caddy rejects a new configuration when:

- an environment placeholder is unset or empty;
- a file is missing, unreadable, or empty;
- a secrets manager or key cannot be found;
- a secrets manager returns a non-string value; or
- the resolved value is invalid for its Caddy Security directive.

For file failures, Caddy logs `placeholder: failed to read file` with the path,
working directory, and operating-system error. During a failed reload, the
previous configuration remains active.

## Troubleshooting

1. Run Caddy with the same environment and user account as the service.
2. Confirm `{env.NAME}` is present in that process's environment.
3. Confirm the running Caddy process can read every `{file.PATH}` reference.
4. Run `caddy adapt --config Caddyfile --pretty` and verify that runtime
   placeholders remain in the adapted JSON. A `{$NAME}` value will already be
   expanded.
5. Check Caddy logs for the failing configuration path or file error.

When using native JSON configuration, use `{env.NAME}` and `{file.PATH}`
directly in supported string fields. The `{$NAME}` shorthand belongs to the
Caddyfile adapter and is not available in JSON.
