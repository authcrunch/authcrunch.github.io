---
title: "Typed custom ACL fields"
description: "Bind typed, literal top-level token claims to policy-local ACL aliases in Caddy Security v1.4.0 source."
discovery:
  topic: authorization
  kind: reference
  aliases: ["acl field", "namespaced claims", "typed claims", "v1.4.0 source"]
---

# Typed custom ACL fields

:::info[Version boundary]

Typed fields are released in **go-authcrunch v1.3.9 and later**. The adapter is
in the **caddy-security v1.4.0 source tag**, which pins library v1.3.11. The
published downloadable v1.3.0 bundle does not support `acl field`. At the
October 5 check, v1.4.0 binary assets are not yet published; use a matching
source build and check [availability](../operations/versions.md).

:::

A field declaration binds a literal top-level authenticated claim to a typed
alias used by one policy's ACL rules. This lets a policy match a namespaced
claim without renaming canonical roles or changing the JWT, header output or
another policy's field definitions.

## Declare and match a field

In a Caddy Security v1.4.0 source build, add the declaration and rule inside
the policy:

```caddyfile
authorization policy apppolicy {
    crypto key verify {env.AUTHCRUNCH_SIGNING_KEY}

    acl field department {
        claim "https://example.com/department"
        type string
    }
    acl field entitlements {
        claim "https://example.com/entitlements"
        type string list
    }
    acl rule {
        match department engineering
        match entitlements app:read
        allow stop
    }
    acl default deny
}
```

This matches the following relevant fields of a properly verified token:

```json
{
  "https://example.com/department": "engineering",
  "https://example.com/entitlements": ["app:read", "app:write"]
}
```

The example is a policy fragment, not a token-signing or complete deployment
recipe. Both conditions must match. Configure the issuer so the user cannot edit
the privilege-bearing attributes; a valid signature alone does not establish
their suitability for granting access.

## Grammar and scope

Each declaration requires exactly one `claim` and one `type`, in either order.
Supported types are `string` and `string list` in Caddyfile syntax; serialized
library configuration uses `string` and `string_list`. Names are case-sensitive
ASCII identifiers, at most 128 characters, beginning with a letter or underscore.
Standard fields, aliases and conflicting matcher keywords are reserved.

The claim key is a **literal top-level key**. Dots, pipes, URL punctuation and
spaces do not select nested objects. No placeholder expansion or network lookup
occurs. Declarations are local to the policy and collected before rule
compilation, so their textual order relative to rules does not change scope.

## Missing and malformed claims

| Input | Evaluation |
| --- | --- |
| String scalar for `string` | Valid, including an empty string |
| List containing only strings | Valid; comparison uses list elements |
| Absent claim | Absent; ordinary positive and negative match conditions do not match it |
| Empty list | Exists but matches no value condition, including negation |
| Null, mixed list, number, object or wrong type | Entire evaluation denied when the field is referenced |

Use `field department not exists` for an explicit absence rule. A malformed
referenced claim is checked before allow-stop and default-allow; it cannot turn
a skipped deny into an allow. Malformed unreferenced claims are ignored.

Existing exact, partial, prefix, suffix, regex and negation strategies apply.
Current request method/path data remain authoritative; claim aliases cannot
replace them. These declarations do not make a missing upstream claim appear
in a [direct OAuth identity](direct-oauth.md).

Verify valid input, absent fields, empty lists, null/mixed values, independent
policies, cached requests and wrong-token trust. See the
[library implementation](https://github.com/greenpau/go-authcrunch/tree/v1.3.11/pkg/acl)
and [Caddy adapter commit](https://github.com/greenpau/caddy-security/commit/fe9a179).
