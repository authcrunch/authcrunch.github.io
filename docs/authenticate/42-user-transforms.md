---
sidebar_position: 42
description: "Map identity claims to roles, login requirements, portal links, and access decisions."
discovery:
  topic: authorization
  kind: reference
  aliases: ["transform user", "groups", "custom claims", "role mapping"]
---

# User Transforms

Transforms map a resolved identity to portal roles, application roles, custom
claims, links and required checkpoints. For local login, they run while the
portal assembles authentication requirements, **before all checkpoints have
passed**. Matching a transform or adding a role is not evidence of successful MFA.

A transform's matchers are combined; separate matching transforms run in order
and can add cumulative roles. A later deny still blocks token issuance. The
application's authorization policy remains a separate decision.

## Add Roles

Grant a portal role and an application role deliberately. For an exact local account:

```caddyfile
transform user {
    match realm local
    match sub alice
    action add role authp/user app/member
}
```

Use the actual subject emitted by your store/provider; inspect a synthetic test
identity before relying on this fragment. Provider usernames, email addresses and
subjects have different stability guarantees. For GitHub, prefer the released
[numeric account ID](oauth/81-backend-oauth2-0007-github.md#choose-who-can-use-the-app).
An arbitrary role such as `authp/viewer` has no built-in portal administration meaning.

An email suffix alone does not prove verified email ownership. Match the intended
realm and use a trustworthy immutable account/group claim from that provider.
Never rename a merely matched identity to `verified` and treat that label as proof.

## Add UI Links

```caddyfile
transform user {
    match realm local
    match role app/member
    ui link "Example app" /app/ icon "las la-cube"
}
```

This changes navigation, not destination permissions. The app must still run
`authorize` before serving or proxying protected content.

## Force Multi-Factor Authentication

```caddyfile
transform user {
    match realm local
    require mfa
}
```

Local MFA requirements are checkpoints. For strict ordered rules and availability
behavior, see [authentication challenges](13-authentication-challenges.md).
An external provider's MFA policy belongs to that provider; generic upstream
claims cannot manufacture local proof.

## Deny Access

```caddyfile
transform user {
    match realm local
    match email blocked@example.com
    block
}
```

A matched `block`/`deny` prevents successful portal token issuance. Keep application
ACL restrictions in the [policy](../authorize/acl-rbac.md) too. Test a blocked
identity with a fresh login after changing transforms.

## Inject Custom Claims

Configured additions can use scalar, list and nested values:

```caddyfile
transform user {
    match realm local
    action add department engineering as string
    action add nested metadata language with english as string
    action add nested metadata interests with docs operations as list
}
```

The relevant result is:

```json
{
  "department": "engineering",
  "metadata": {"language": "english", "interests": ["docs", "operations"]}
}
```

Existing claim text is data. Configured additions can interpolate supported
`{claims.NAME}` values, but arbitrary input does not get recursively evaluated as
a template. Use explicit types and avoid overwriting standard identity, expiry,
role or challenge fields. Challenge evidence is owned by authentication, not by
a custom claim called `auth_methods` or `challenges`.

The nested-map form `action add nested acl paths "/app/**" as map` creates a
[path ACL](../authorize/path-acl.md); test its allow and deny boundaries separately.
[Typed policy-local custom fields](../authorize/custom-fields.md) require a newer
Caddy integration and are explicitly labeled as a preview.

## Drop Matched Roles

Provider roles can collide with privileged portal/application roles. Clear those
reserved values before independently granting your intended roles:

```caddyfile
transform user {
    regex match role "^(authp/.*|app/member)$"
    action drop matched role
}
```

The drop operation reevaluates its matcher against **each role alone**. Do not add
a realm or email matcher to this dropping transform: those fields are absent in
that per-role evaluation and the role will not be removed. Apply realm/account
conditions to separate role-granting transforms. The
[generic OIDC example](oauth/81-backend-oauth2-0000-generic.md) demonstrates the full boundary.

To remove roles containing whitespace, use `regex match role "\s"` and
`action drop matched role`. Verify the resulting role list and upstream header
serialization. A policy trusting any authenticated user, such as `allow roles
authp/user`, has a broader boundary than one requiring independently assigned
`app/member`.
