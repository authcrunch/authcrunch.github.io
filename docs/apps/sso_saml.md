---
sidebar_position: 1
---

# Single Sign-On with SAML

## AWS SSO

The [Identity Federation with SAML 2.0](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_federated-users.html)
allows creating trust between authentication portal as an Identity Provider (IdP)
and AWS as the service provider.

The authentication portal generates a SAML authentication response that includes assertions
that identify the user and include attributes about the user. You can also configure the portal
to include a SAML assertion attribute called `SessionDuration` that specifies how long
the console session is valid. You can also configure the portal to pass attributes as
session tags. The portal sends this response via the client browser to AWS SAML
endpoint.

The [Configuring SAML assertions for the authentication response](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_saml_assertions.html)
describes how the authentication portal crafts the XML request to AWS SAML endpoint, i.e. `https://region-code.signin.aws.amazon.com/saml`.

For example, the `Attributes/Role`:

```xml
<Attribute Name="https://aws.amazon.com/SAML/Attributes/Role">
  <AttributeValue>arn:aws:iam::account-number:role/role-name1,arn:aws:iam::account-number:saml-provider/provider-name</AttributeValue>
  <AttributeValue>arn:aws:iam::account-number:role/role-name2,arn:aws:iam::account-number:saml-provider/provider-name</AttributeValue>
  <AttributeValue>arn:aws:iam::account-number:role/role-name3,arn:aws:iam::account-number:saml-provider/provider-name</AttributeValue>
</Attribute>
```

The [Enabling SAML 2.0 federated users to access the AWS Management Console](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_enable-console-saml.html)
outlines the steps necessary to enable SSO on AWS side.

The [Creating a role for SAML 2.0 federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_saml.html)
describes how to create an IAM role for use with SAML federation.

### Configuration

The steps necessary to enable AWS SSO in the plugin follow:

1. Generate a self-signed certificate (for `metadata.xml`) and private key (for creating assertions)
2. Add Caddyfile directives enabling AWS SSO
3. Add Caddyfile user transforms with AWS SSO roles
4. Download metadata file

First, generate self-signed certificate:

```bash
openssl req -x509 -nodes -sha256 -days 1095 -newkey rsa:4096 \
  -keyout authp_saml.key -out authp_saml.crt \
  -subj "/C=US/ST=New York/L=New York/O=AuthPortal/OU=AuthPortalSAMLIdP/CN=AuthPortalSAMLUser"
```

Second, create `Caddyfile` config. Please see an example [here](https://github.com/authp/authp.github.io/blob/main/assets/conf/apps/sso/aws/Caddyfile).

The name of the SSO provider is significant. Access SSO console via `/apps/sso/<provider_name>` endpoint, e.g. `/apps/sso/aws`.
If you want to fetch `metadata.xml`, then the URL is `/apps/sso/aws/metadata.xml`.

```
sso provider aws {
  entity_id caddy-authp-idp
  driver aws
  private key {$HOME}/tmp/authp/awssso/authp_saml.key
  cert {$HOME} ${HOME}/tmp/authp/awssso/authp_saml.crt
  location https://auth.myfiosgateway.com:8443/apps/sso/aws
}
```

TBC.
