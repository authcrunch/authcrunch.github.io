---
sidebar_position: 14
---

# Miscellaneous

## Encryption Keys

The following command generates ECDSA key with P-256 curve:

```bash
openssl genpkey \
  -algorithm EC \
  -pkeyopt ec_param_enc:named_curve \
  -pkeyopt ec_paramgen_curve:P-256 | \
  openssl pkcs8 -topk8 -nocrypt -outform der > testdata/misckeys/test_4_es256_pri.pem
```

## Login Hint

Login hints are part of the
[OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1)
and can be used to notify an Authorization Server about the login identifier
used by a user (e.g. to pre-fill fields in the login form).

The `enable login hint` command can be used to forward a login hint to the auth URL by passing it to a protected
route as a query parameter. In case the auth URL belongs to a portal defined in the `authenticate` configuration,
it will be automatically forwarded to the backend.

By default, the `enable login hint` accepts email addresses, phone numbers and alphanumeric characters. Using the
`with` keyword in combination with one or more of the validator names `email`, `phone` and `alphanumeric`, they can be
toggled individually. For example, the command `enable login hint with email alphanumeric` would only forward email
addresses and alphanumeric strings to the auth URL, but no phone numbers.

### Example

```
{
  security {
    authorization policy mypolicy {
      set auth url https://auth.example.com/auth
      enable login hint
    }
  }
}


myapp.com {
	route /protected* {
		authorize with mypolicy
		respond "myapp is running"
	}
}
```

Given the above configuration, when a user visits `https://myapp.com/protected?login_hint=myusername`, the login hint will be forwarded
to the auth URL and therefore the user will be forwarded to the following URL:

```https://auth.example.com/auth?login_hint=myusername&redirect_url=https://myapp.com/protected```