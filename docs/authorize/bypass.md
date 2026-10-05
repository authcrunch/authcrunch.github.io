---
sidebar_position: 13
description: "Exclude selected request paths from authorization with URI matching rules."
discovery:
  topic: authorization
  kind: reference
  aliases: ["bypass uri", "public route"]
---

# Bypass Authorization for Specific URIs

A bypass lets a matching request proceed without a credential or authenticated
identity. Use it for deliberately public resources, such as a health endpoint,
not as a remedy for a login loop.

```Caddyfile
# Inside the policy:
bypass uri exact /health
bypass uri prefix /public/
allow roles app/member
```

| Strategy | Match |
| --- | --- |
| `exact` | The whole path |
| `partial` | A substring anywhere in the path |
| `prefix` | Beginning of the path |
| `suffix` | End of the path |
| `regex` | A Go regular expression; anchor it when the whole path matters |

`prefix /public` also matches `/publicity`. Use an exact path plus a slash-ended
prefix when granting a directory tree. Query parameters do not turn a protected
path into a public one.

The released implementation checks decoded and cleaned path interpretations;
ambiguous encodings must not create a bypass. Test `/health`, `/health-extra`,
`/public/file`, and a protected sibling separately. The direct OAuth policy's
reserved callback/logout paths are handled by its [own flow](direct-oauth.md).

Configured identity headers are cleared even on bypass. The backend must treat
a public request as unauthenticated. For complex public/private routing, separate
Caddy handlers can make the boundary easier to review than a broad bypass rule.
