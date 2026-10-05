---
sidebar_position: 14
title: "Generate an ECDSA key"
description: "Generate matching P-256 PEM signing and verification keys and configure their service paths."
discovery:
  topic: operations
  kind: reference
  aliases: ["ES256", "EC", "openssl"]
---

# Generate an ECDSA key


## Follow the key material

The generated ECDSA files have different owners and permissions even though they form one pair.

| Material | Owner | Purpose |
| --- | --- | --- |
| P-256 private PEM | Portal signer; protected service-readable file | Signs ES256 access tokens |
| Derived public PEM | Gatekeepers and other trusted verifiers | Checks signatures; cannot sign |
| Public JWKS entry | Consumers configured to trust this issuer | Distributes public key data; does not configure polling |
| A different curve or JWT method | Explicitly matching signer and verifier configuration | Requires compatible key and method; a file name proves neither |

## Encryption Keys

This published heading is retained for existing links. ECDSA keys **sign and
verify** JWTs; they do not encrypt the token payload. Use the separate
[System key](../authenticate/api/50-system-api.md) or
[runtime-state key](../operations/runtime-state.md) for those encryption tasks.

Generate a P-256 private key in PEM format and derive its public key:

```bash
umask 077
mkdir -p "$HOME/.config/authcrunch/keys"
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:prime256v1 \
  -out "$HOME/.config/authcrunch/keys/signing-private.pem"
openssl pkey -in "$HOME/.config/authcrunch/keys/signing-private.pem" -pubout \
  -out "$HOME/.config/authcrunch/keys/signing-public.pem"
openssl pkey -pubin -in "$HOME/.config/authcrunch/keys/signing-public.pem" -text -noout
```

The private output is unencrypted PKCS#8 PEM, protected by filesystem
permissions. Keep it private and provision it to the service owner. The public
output can be distributed to JWT verifiers. Do not write DER bytes to a file
named `.pem`; the released loader expects supported key files in the correct
format.

Inside the existing portal:

```Caddyfile
crypto key app-signing sign-verify from file /etc/authcrunch/signing-private.pem
```

Inside the matching policy:

```Caddyfile
crypto key app-signing verify from file /etc/authcrunch/signing-public.pem
```

This signs with ES256. Keep the ID and loaded keys aligned across the issuer
and verifier. See [verification and rotation](token-verification.md) before
replacing keys in an active deployment.

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Explain signing versus encryption</summary>

```text
Help me understand Generate an ECDSA key.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-crypto, authentication-portal-jwks.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/encryption

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain what the P-256 ECDSA example signs and verifies, and what remains
readable in a JWT. Distinguish the historical Encryption Keys heading from
System encryption and runtime-state encryption. Draw the portal/private-key
and policy/public-key roles.
```

</details>

<details>
<summary>Read the OpenSSL sequence</summary>

```text
Help me understand Generate an ECDSA key.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-crypto, authentication-portal-jwks.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/encryption

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Walk through the documented P-256 key generation and public-key derivation
commands without running them. Explain umask, PEM versus DER, PKCS#8 private
output, and service-readable destination paths. Identify which output must
remain private.
```

</details>

<details>
<summary>Diagnose a key-loading mismatch</summary>

```text
Help me understand Generate an ECDSA key.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-crypto, authentication-portal-jwks.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/encryption

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me reason about a .pem file containing DER bytes, a mismatched public
key, wrong curve, and insufficient service permissions. Ask for public key
metadata and redacted errors only. Separate shell output format from Caddy
key-source grammar.
```

</details>

<details>
<summary>Plan a safe local validation</summary>

```text
Help me understand Generate an ECDSA key.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-crypto, authentication-portal-jwks.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/encryption

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Design a disposable-key exercise proving that the portal can sign ES256 and
the policy verifies using only the matching public key. Include wrong-key and
expired-token denial. Explain how to destroy disposable private material and
avoid replacing production keys during the exercise.
```

</details>

<details>
<summary>Practice key lifecycle decisions</summary>

```text
Help me understand Generate an ECDSA key.

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-crypto, authentication-portal-jwks.

Secondary reference:
https://docs.authcrunch.com/docs/authorize/encryption

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Quiz me on distributing a private key to verifiers, replacing keys while
tokens remain valid, renaming kid, and generated signing keys across restarts.
Wait for each answer and explain the relevant runtime boundary rather than
assuming automatic rotation.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28ES256%20OR%20prime256v1%20OR%20CryptoKeyConfig%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authn_crypto.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_crypto.go)
   — adapts portal signing and System-key declarations.
3. [caddy-security: caddyfile_authz_crypto.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authz_crypto.go)
   — delegates policy verification-key declarations to the keystore parser.
4. [go-authcrunch: pkg/kms/crypto_key_config.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/kms/crypto_key_config.go)
   — parses individual key declarations and key-source settings.
5. [go-authcrunch: pkg/kms/methods.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/kms/methods.go)
   — maps supported signing methods and key types.
6. [go-authcrunch: pkg/kms/crypto_key_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/kms/crypto_key_test.go)
   — tests key construction and supported cryptographic operations.
