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
