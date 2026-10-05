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

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Place transforms in the flow</summary>

```text
Help me understand User Transforms.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-user-transforms,
authentication-portal-challenges, authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/user-transforms

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain when transforms run during local versus provider login and how they
affect roles, requirements, claims, links, and token issuance. Separate
matching an identity from completed authentication evidence and the
application’s later ACL decision.
```

</details>

<details>
<summary>Review a role mapping</summary>

```text
Help me understand User Transforms.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-user-transforms,
authentication-portal-challenges, authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/user-transforms

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me review a synthetic realm/account mapping to authp/user and app/member.
Ask whether the provider claim is immutable and trustworthy. Compare numeric
GitHub ID, subject, email suffix, and group mappings without treating a
renamed claim or mere email appearance as verification.
```

</details>

<details>
<summary>Understand role removal</summary>

```text
Help me understand User Transforms.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-user-transforms,
authentication-portal-challenges, authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/user-transforms

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain drop matched role’s per-role evaluation and why adding a realm/email
matcher can prevent the drop. Trace reserved-role removal and independent role
grants in order. Show how several matching transforms can accumulate roles and
a later deny can still block issuance.
```

</details>

<details>
<summary>Explore custom claim types</summary>

```text
Help me understand User Transforms.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-user-transforms,
authentication-portal-challenges, authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/user-transforms

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Compare scalar, list, nested map, and supported interpolation in configured
additions. Explain why incoming claim text is data and why custom claims must
not overwrite standard identity, expiry, roles, or challenge evidence.
Distinguish header traversal from typed policy-local ACL fields.
```

</details>

<details>
<summary>Design transform regression tests</summary>

```text
Help me understand User Transforms.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-user-transforms,
authentication-portal-challenges, authorization-policy-acl.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/user-transforms

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Build fresh-login cases for intended identity, lookalike email, wrong realm,
reserved upstream roles, deny-after-add, and required MFA. Observe normalized
claims and downstream app denial as separate results. Include a visible app
link for a nonmember to prove navigation grants nothing.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28UserTransformer%20OR%20dropMatchedRole%20OR%20TransformUser%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authn_transform.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_transform.go)
   — adapts user-transform matchers, actions, and required challenges.
3. [caddy-security: caddyfile_authn_transform_test.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_transform_test.go)
   — tests user-transform directive adaptation.
4. [go-authcrunch: pkg/authn/transformer/parser/parser.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/transformer/parser/parser.go)
   — parses user-transform matchers and actions.
5. [go-authcrunch: pkg/authn/transformer/transformer.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/transformer/transformer.go)
   — evaluates configured transformations against identity data.
6. [go-authcrunch: pkg/authn/authentication_challenges.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/authentication_challenges.go)
   — checks direct credential login against resolved challenge requirements.
