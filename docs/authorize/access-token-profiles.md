---
title: "PS256 access-token profiles"
description: "Select a named RSA-PSS signer and enforce access-token purpose, issuer, audience, key IDs and lifetime independently of OIDC ID-token signing."
discovery:
  topic: authorization
  kind: guide
  aliases: ["PS256", "RSA-PSS", "access signer", "strict JWT", "token purpose"]
---

# PS256 access-token profiles

In v1.5.0, the [`cryptographic-signing-rsapss` companion](../operations/backends.md)
can sign portal access JWTs with an explicit purpose and strict consumer profile.
This affects access tokens. OIDC ID-token signing and System API encryption keep
their separate keys and contracts. Ordinary KMS signing remains the default
when no signer is selected.

## Declare the signer

Prepare an RSA private key and matching public PEM outside served roots. The
private key must be an unencrypted PKCS#8 or PKCS#1 two-prime RSA key; the public
key must be 2048–8192 bits. Protect the private regular file and its parent;
the signer rejects symlink key files. Inside `security`, add:

```caddyfile
access signer rsapss grants {
    key file /etc/authcrunch/access-private.pem
    key id current
    issuer https://auth.example.com/auth
    audience app
    max lifetime 15m
}
```

The signer supports PS256 only. Its maximum lifetime uses a whole-second
duration from 1s–24h. Backend fields are literal apart from Caddy's lexical
`{$NAME}` substitution.

## Select matching portal and policy profiles

Inside the existing portal, alongside the selected identity store:

```caddyfile
access signer grants
access token profile {
    issuer https://auth.example.com/auth
    audience app
    key ids current
    max lifetime 900
}
crypto key current verify from file /etc/authcrunch/access-public.pem
transform user {
    match any
    action overwrite aud app
}
```

Replace ordinary non-system signing/sign-verify/auto keys with the explicit
public verifier; they cannot coexist with selected access signing. Retain
separate System encryption entries if required. The transform explicitly
grants the sole audience; the signer cannot invent a missing grant.

Inside the application's policy, use the same `access token profile` block and
public verifier, plus token discovery and the intended `allow roles` rule.
The profile's `max lifetime` uses integer seconds, unlike the signer duration.
Issuer, sole audience and maximum lifetime must agree with the signer.
Renewable portals also require issuer to equal refresh public origin plus mount.
Direct OAuth policies do not accept these JWT profiles.

## What consumers enforce

Profile consumers require `alg=PS256`, `typ=authcrunch-access+jwt`, a trusted
`kid`, exact issuer and sole audience, nonempty subject, and integral positive
`iat`, `nbf` and `exp`. They require `iat <= nbf <= now < exp`, no clock leeway,
and a bounded lifetime. RSA-PSS uses SHA-256 with a 32-byte salt. Duplicate JSON
members, unexpected JOSE headers, other algorithms and malformed envelopes fail.
A cached token does not bypass these requirements.

The portal signs approved claims and checks that returned tokens contain exactly
those claims before publication. Refresh, cross-device and identity transaction
deadlines can shorten access expiry. Setting a signature algorithm alone on an
ordinary RSA key does not enable this purpose profile or claim RFC 9068 compliance.

## Discovery, rotation and verification

The mounted `/.well-known/jwks.json` publishes the current public signing key and
explicitly retained profile verification keys, marked PS256. It never publishes
the external private signer, including through admin private-key export.

For rotation, configure both old and new public key IDs in consumers, switch the
signer to the new key/ID, then retire the old ID after the intended overlap.
Editing a PEM does not change a live runtime; load the replacement configuration.
Persistent roots retain their stop/start boundary. Changed loaded trust retires
prior persistent session/refresh authority; trusting an old key again can still
accept an unexpired stateless access token.

Verify signatures independently and test wrong issuer/audience/purpose/key ID,
expired or excessive lifetime, mismatched signer/verifier and rotation. Keep
an allowed and a denied application role in the test. Check the actual cookie
name if a portal prefix is configured; logical signing names and cookie names
are separate settings.

## Agentic Prompts

Use a prompt to investigate this topic against your deployed version.

<div className="agentic-prompts">

<details>
<summary>Choose signing boundaries</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-crypto; cryptographic-signing.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/access-token-profiles

Compare ordinary KMS access signing, a selected PS256 signer, OIDC ID-token keys and System encryption. Explain why one setting does not configure the others.
```

</details>

<details>
<summary>Build matching profiles</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-crypto; cryptographic-signing.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/access-token-profiles

Derive a signer, portal and policy profile with matching issuer/audience/lifetime and public key IDs. Explain duration versus integer-second grammar and the required audience grant.
```

</details>

<details>
<summary>Reject misleading tokens</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-crypto; cryptographic-signing.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/access-token-profiles

Analyze wrong purpose, key ID, audience, issuer, JOSE headers, times and PSS parameters. Explain why a valid RSA signature or cached token alone is insufficient.
```

</details>

<details>
<summary>Plan key rotation</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-crypto; cryptographic-signing.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/access-token-profiles

Plan old/new public-key overlap, signer replacement, JWKS inspection and retirement. Explain persistent authority retirement versus stateless JWT verification after trust changes.
```

</details>

<details>
<summary>Verify issuance and delivery</summary>

```text
Primary authorities, before website documentation:
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each root AGENTS.md first, any scoped AGENTS.md applying to inspected
paths, then relevant SKILL.md files and their implementation/test references.
Relevant skills to locate: configuration-crypto; cryptographic-signing.
Distinguish main from caddy-security v1.5.0 / go-authcrunch v1.4.1 and my
deployed version. Resolve disagreements with linked code/tests; keep unverified
behavior uncertain. If sources are inaccessible, ask for pasted content.
Use only synthetic or redacted inputs.
Secondary context: https://docs.authcrunch.com/docs/authorize/access-token-profiles

Design independent signature and allow/deny checks for browser/native/refresh issuance. Distinguish logical token names from prefixed HTTP cookies and staged signatures from committed credentials.
```

</details>

</div>

## Source Code References

- [Search the upstream implementations](https://github.com/search?q=%28repo%3Agreenpau%2Fcaddy-security%20OR%20repo%3Agreenpau%2Fgo-authcrunch%29%20access%20token%20profiles&type=code).
- [caddyfile_access_signer.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/caddyfile_access_signer.go): Signer and profile grammar.
- [app_access_signers.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/app_access_signers.go): App-owned signer binding.
- [access_signer_e2e_test.go (v1.5.0)](https://github.com/greenpau/caddy-security/blob/v1.5.0/access_signer_e2e_test.go): Strict issuance and consumer checks.
