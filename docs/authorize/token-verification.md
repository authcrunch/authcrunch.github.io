---
sidebar_position: 7
---

# Token Verification

Find the information about the various algorithms described below in
[RFC 7518](https://tools.ietf.org/html/rfc7518).

## Verification with Shared Secret

The shared secret methods are based on Hash-based Message Authentication Code
(HMAC) algorithm, where the hash is being computed using SHA256, SHA384, and
SHA512 hash functions.

The supported methods for the verification of token signatures are:

* `HS256`
* `HS384`
* `HS512`

The following Caddyfile directives set the default token verification key to
"shared" (symmetric) key with the value of `383aca9a-1c39-4d7a-b4d8-67ba4718dd3f`.
It also sets a custom token name. The plugin would search for tokens with
the `app_token` name.

```
{
  security {
    authorization policy mypolicy {
      crypto key verify 383aca9a-1c39-4d7a-b4d8-67ba4718dd3f
      crypto key token name app_token
    }
  }
}

assetq.myfiosgateway.com {
  authorize with mypolicy
  root * {env.HOME}/www
  file_server
}
```

The syntax is:

```
crypto key verify <SHARED_SECRET>
crypto key token name <TOKEN_NAME>
```

Alternatively, the key could be set via environment variables. The
`from env APP_TOKEN` instructs the plugin to load the key from
`APP_TOKEN` environment variable.

```
{
  security {
    authorization policy mypolicy {
      crypto key verify from env APP_TOKEN
      crypto key token name app_token
    }
  }
}

assetq.myfiosgateway.com {
  authorize with mypolicy
  root * {env.HOME}/www
  file_server
}
```

The syntax is:

```
crypto key verify from env <NAME>
crypto key token name <TOKEN_NAME>
```

Additionally, the key may have a key ID. It is otherwise known as `kid`.
It could be passed via right after the `crypto key` keywords.

```
{
  security {
    authorization policy mypolicy {
      crypto key e5ZaB46bF27d verify 383aca9a-1c39-4d7a-b4d8-67ba4718dd3f
      crypto key e5ZaB46bF27d token name app_token
      crypto key 3bc4be49abf6 verify from env SECRET_TOKEN
      crypto key 3bc4be49abf6 token name secret_token
    }
  }
}

assetq.myfiosgateway.com {
  authorize with mypolicy
  root * {env.HOME}/www
  file_server
}
```

The syntax is:

```
crypto key <ID> verify <SHARED_SECRET>
crypto key <ID> verify from env <NAME>
crypto key <ID> token name <TOKEN_NAME>
```

## Verification with RSA and ECDSA Keys

The RSA and ECDSA methods are based on asymmetric signature algorithms
defined in [RFC7518](https://tools.ietf.org/html/rfc7518).

The supported RSA methods are:

* `RS256`: RSASSA-PKCS1-v1_5 using SHA-256
* `RS384`
* `RS512`

The DSA are based on the Elliptic Curve Digital Signature Algorithm (ECDSA).
See [RFC7518 Section 3.4](https://tools.ietf.org/html/rfc7518#section-3.4)
for details.

The supported DSA methods are:

* `ES256`: ECDSA using P-256 and SHA-256 (SHA256withECDSA)
  - The Elliptic Curve has 256-bit integer prime.
* `ES384`: ECDSA using P-384 and SHA-384 (SHA384withECDSA)
  - The Elliptic Curve has 384-bit integer prime.
* `ES512`: ECDSA using P-521 and SHA-512 (SHA512withECDSA)
  - The Elliptic Curve has 512-bit integer prime.

The `P-256` curve (aka prime256v1) is being used in U2F and CBOR.

The verification of the tokens is being done by "public" RSA or ECDSA keys.
If the plugin finds a "private" key, it would extract "public" key from it
and that key would be used to verify tokens.

**NOTE**: The `verify` keyword is used when the keys provided are public keys.
Otherwise, user `sign-verify` or `auto`.

The following Caddyfile directives configure multiple token verification
keys.

1. The default key ID (aka kid 0) is defined when the key ID value is
   not provided. Loads the key from `/etc/gatekeeper/auth/jwt/verify_key1.pem` file.
1. The key ID `e5ZaB46bF27d`: loads from `/etc/gatekeeper/auth/jwt/verify_key2.pem`.
1. The key ID `3bc4be49abf6`: loads the key from the file stored in the `VERIFY_KEY_FILE`
   environment variable.
1. The key ID `pik3mfhsXR1B`: loads the keys from the directory stored in the
   environment variable `VERIFY_KEY_DIR`.

```
{
  security {
    authorization policy mypolicy {
      crypto key verify from file /etc/gatekeeper/auth/jwt/verify_key1.pem
      crypto key e5ZaB46bF27d verify from file /etc/gatekeeper/auth/jwt/verify_key2.pem
      crypto key 3bc4be49abf6 verify from env VERIFY_KEY_FILE as file
      crypto key pik3mfhsXR1B verify from env VERIFY_KEY_DIR as directory
    }
  }
}

assetq.myfiosgateway.com {
  authorize with mypolicy
  root * {env.HOME}/www
  file_server
}
```

Additionally, there could be a directory with public PEM keys.

```
{
  security {
    authorization policy mypolicy {
      crypto key e5ZaB46bF27d verify from directory /etc/gatekeeper/auth/jwt
      crypto key 3bc4be49abf6 verify from env VERIFY_KEY_DIR as directory
    }
  }
}

assetq.myfiosgateway.com {
  authorize with mypolicy
  root * {env.HOME}/www
  file_server
}

```

The syntax is:

```
crypto key <ID> verify from <directory|file> <PATH>
crypto key <ID> verify from env <NAME> as <directory|file|value>
```

### Generate RSA Public Key

Th `verify_key1.pem` is RSA public key. It is generated with
the following commands:

```shell
openssl genrsa -out /etc/gatekeeper/auth/jwt/sign_key1.pem 2048
openssl rsa -in /etc/gatekeeper/auth/jwt/sign_key1.pem -pubout -out /etc/gatekeeper/auth/jwt/verify_key1.pem
```

The content of `verify_key1.pem` follows:

```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAphJPa8M0D/iY/I6kAs7K
4M30kPfurFEwpJe4zd9h9E/iuWbqpHCx+sQqAG8xJawddG6WupZiWRY3+44hw7nH
srH7XY2Dv/6igo1WU6U0PjHQ0SRSKGkGb3x4iwHx8IMsUQ44iDZYugxrjf5xkthc
6MNwqqcTuHLJtgEqSPETiqZgbcRHEWtqPb/LuQl3hLscokO7e5Yw0LQibtnZt4UR
Wb3z9CrzP8yS2Ibf8vbhiVhzYWSkXOiwsA0X5sBdNZbg8AkkqgyVe2FtCPBPdW6/
KOj8geX+P2Wms6msOZIRk7FqpKfEiK//arjumEsVF34S7GPavynLmyLfC4j9DcFI
PQIDAQAB
-----END PUBLIC KEY-----
```

### Generate ECDSA Public Key

The `verify_key1.pem` is generated with the following commands.

First, review the output of the following command to determine the
available Elliptic Curves.

```
$ openssl ecparam -list_curves
  secp224r1 : NIST/SECG curve over a 224 bit prime field
  secp256k1 : SECG curve over a 256 bit prime field
  secp384r1 : NIST/SECG curve over a 384 bit prime field
  secp521r1 : NIST/SECG curve over a 521 bit prime field
  prime256v1: X9.62/SECG curve over a 256 bit prime field
```

Next, generate `ES256` private and public key pair:

```shell
openssl ecparam -genkey -name prime256v1 -noout \
  -out /etc/gatekeeper/auth/jwt/sign_key2.pem
openssl ec -in /etc/gatekeeper/auth/jwt/sign_key2.pem -pubout \
  -out /etc/gatekeeper/auth/jwt/verify_key2.pem
```

The content of `verify_key2` follows:

```
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEwlCJyaA2uhZ29yhDkmsSm6nEageO
e0rB8fQM/g4WpLtz1AbPVZq9mjFHz390r7b2Dz6P/fNYqk5joikWVXrJ9g==
-----END PUBLIC KEY-----
```

For `ES384` use `-name secp384r1` argument.

For `ES512` use `-name secp521r1` argument.
