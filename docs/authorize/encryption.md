---
sidebar_position: 14
title: "Generate an ECDSA key"
description: "Generate an ECDSA P-256 private key using OpenSSL."
discovery:
  topic: operations
  kind: reference
  aliases: ["ES256", "EC", "openssl"]
---

# Generate an ECDSA key

## Encryption Keys

The following command generates ECDSA key with P-256 curve:

```bash
openssl genpkey \
  -algorithm EC \
  -pkeyopt ec_param_enc:named_curve \
  -pkeyopt ec_paramgen_curve:P-256 | \
  openssl pkcs8 -topk8 -nocrypt -outform der > testdata/misckeys/test_4_es256_pri.pem
```
