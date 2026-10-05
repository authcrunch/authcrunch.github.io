---
sidebar_position: 1
title: "Credentials and secret references"
description: "Configure named service credentials, private environment values and optional secret-manager modules."
discovery:
  topic: operations
  kind: reference
  aliases: ["SMTP password", "secrets", "AWS Secrets Manager", "credentials"]
---

# Secrets Management

Separate service credentials, portal signing keys and user password hashes. A named `credentials` entry supplies a username/password to a consumer such as a messaging provider; it is not an encrypted vault or an end-user login account. Secret-manager references require a separately compiled module.

## Credentials Directive

Define a credential label in the global `security` block and reference that label from its consumer:

```caddyfile
credentials outbound-mail {
  username {env.SMTP_USERNAME}
  password {env.SMTP_PASSWORD}
}

messaging email provider notifications {
  address smtp.example.com:465
  protocol smtps
  credentials outbound-mail
  sender no-reply@example.com "Example portal"
}
```

The credential requires a name, nonempty username and nonempty password; `domain` is optional. The email transport uses SASL PLAIN with the username/password, not OAuth or the optional domain. Use [messaging guidance](../messaging/intro.md) for transport and workflow limits.

`{env.VARIABLE}` values here resolve during provisioning. `{$VARIABLE}` expands earlier while adapting a Caddyfile. Supply private service environment values and keep expanded configuration, process environment and credentials out of published assets. Changing an environment value does not rewrite a running provider; reprovision and test delivery. Caddy adaptation alone does not test SMTP credentials.

For local **user** passwords and API keys, use the released [credential generation commands](../authenticate/local/30-password-management.md) and [local administration CLI](../operations/local-client.md). An SMTP password must remain usable by its service; replacing it with a bcrypt hash would not authenticate to the mail server.

## Static Secrets Plugin

The optional [static secrets module](https://github.com/greenpau/caddy-security-secrets-static-secrets-manager) stores named key/value material in configuration. Its reference form is `secrets:<SECRET_ID>:<FIELD>`: the middle component identifies a configured secret and the last component is the field to retrieve, not the secret value itself.

For example, the module's `access_token` entry can supply a `shared_secret` field to:

```caddyfile
crypto key sign-verify secrets:access_token:shared_secret
```

The corresponding module block is `secrets static_secrets_manager access_token { ... }`; use the selected module version's parser for its body. Moving plaintext into that block centralizes references but does not encrypt the Caddyfile or turn static configuration into a remote vault.

This module is **not compiled into the published v1.3.0 binary audited here**. Confirm `security.secrets.static_secrets_manager` appears in `authcrunch list-modules` before using its directives. Pin and validate compatible module/integration versions for a custom build; a link to an older module README is not proof of current runtime compatibility.

## AWS Secrets Manager Secrets

The optional [AWS Secrets Manager module](https://github.com/greenpau/caddy-security-secrets-aws-secrets-manager) retrieves named secret material from **AWS Secrets Manager**, a different service from Systems Manager Parameter Store.

Its documented module configuration uses:

```caddyfile
secrets aws_secrets_manager access_token {
  region us-east-1
  path authcrunch/caddy/access_token
}
```

A consumer can then reference a field such as `secrets:access_token:value`. Match the field to the secret's actual structure. Configure the module's AWS identity/permissions privately and limit access to the intended secrets. Do not paste AWS access keys or resolved signing secrets into documentation.

`security.secrets.aws_secrets_manager` is also absent from the audited published binary. Check the module's current setup and dependencies, build it explicitly, then test retrieval and the actual consumer. Core placeholder substitution supports credential instructions and selected store/provider/key fields; it is not a promise that every arbitrary field accepts secret references or refreshes them continuously.

## Verify the boundary

Inspect the executable's modules, adapt with synthetic values, then provision in an isolated environment using the intended secret source. Check a missing credential/reference fails and the intended service operation succeeds. Record separately whether you verified grammar, secret retrieval, SMTP delivery or user login; those are different checks.
