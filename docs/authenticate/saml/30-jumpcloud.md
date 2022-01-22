# Jumpcloud SAML Integration

This [`Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/saml/jumpcloud/Caddyfile)
contains the configuration for the SAML integration.

First, browse to "User Authentication | SSO" and create a new application.

Select "Custom SAML App".

![Jumpcloud SAML App Registration - New Application](images/jumpcloud_saml_sso_00a.png)

Confirm new SSO connector instance.

![Jumpcloud SAML App Registration - SSO connector](images/jumpcloud_saml_sso_00b.png)

Provide app name, e.g. "MyFIOS Auth Portal".

![Jumpcloud SAML App Registration - App Name](images/jumpcloud_saml_sso_01.png)

Next, provide IdP Entity ID and SP Entity ID values. Here, `urn:auth-portal`.

![Jumpcloud SAML App Registration - SSO Configuration](images/jumpcloud_saml_sso_02.png)

Then, provide the following:

* ACS URL: `https://auth.myfiosgateway.com:8443/saml/jumpcloud`
* SAMLSubject NameID: `email`
* SAMLSubject NameID Format: `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`
* Signature Algorithm: `RSA-SHA256`
* Login URL: `https://auth.myfiosgateway.com:8443/`

![Jumpcloud SAML App Registration - SSO Configuration](images/jumpcloud_saml_sso_03.png)

Next, provide IDP URL: `https://sso.jumpcloud.com/saml2/auth-portal-saml`

![Jumpcloud SAML App Registration - SSO Configuration](images/jumpcloud_saml_sso_04.png)

Finally, add User Attributes.

* `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`: `email`
* `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/displayname`: `fullname`

![Jumpcloud SAML App Registration - User Attributes](images/jumpcloud_saml_sso_05.png)

After saving the configuration, browse back to "User Authentication | SSO".

Re-enter the application, browse to SSO and download JumpCloud Metadata.
This would be the `JumpCloud-saml2-metadata.xml` file referenced in the config.

Additionally, while in the app, click "IDP Certificate Valid" and "Download certificate.
This would be the `certificate.pem` file referenced in the config.

![Jumpcloud SAML App Registration - IDP Certificate](images/jumpcloud_saml_sso_05a.png)

The setup is now complete.

![Jumpcloud SAML App Registration - Complete](images/jumpcloud_saml_sso_06.png)

When a user accesses Jumpcloud user portal, the user sees the new app in the
list of application.

![Jumpcloud SAML App User Portal](images/jumpcloud_saml_sso_07.png)
