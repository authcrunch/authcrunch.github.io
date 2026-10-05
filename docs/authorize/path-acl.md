---
sidebar_position: 10
description: "Check a request path against access lists carried in token claims."
discovery:
  topic: authorization
  kind: reference
  aliases: ["ACL", "URI", "path permissions"]
---

# Path-Based Access Lists

`validate path acl` checks the requested path against signed token grants in
`acl.paths`, in addition to ordinary policy rules. A client cannot grant itself
paths by editing an unsigned JSON payload.

```json
{
  "sub":"alice",
  "roles":["app/member"],
  "exp":1900000000,
  "acl":{"paths":{"/api/users/*":{},"/api/media/**":{}}}
}
```

This is a claim-shape example, not a token to copy. The expiry is numeric.
Configure the policy:

```Caddyfile
validate path acl
allow roles app/member
```

Literal paths match exactly. Wildcards have the following restricted meanings:

| Pattern | Characters matched |
| --- | --- |
| `*` | One or more ASCII letters, digits, `_`, `.`, `~`, or `-`; no slash |
| `**` | One or more of those characters, including slash |

`/api/users/*` matches `/api/users/alice`, not `/api/users/` or a deeper tree.
`/api/media/**` spans path segments but does not match an empty suffix. Other
punctuation is literal; this is not a regex or a shell glob.

The gatekeeper checks decoded and cleaned interpretations, including on cached
identities, and rejects ambiguous/malformed encodings. It does not rewrite the
upstream path to rescue a failed grant. Exercise allowed, sibling, traversal,
encoded-slash, and double-encoded paths with the same token.

For role/path rules in the policy itself, use [ACL conditions](acl-rbac.md)
and `validate method path`. Token-carried path grants must be issued by a
trusted signer and should be specific to the application.
