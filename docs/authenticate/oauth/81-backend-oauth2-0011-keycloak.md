# Keycloak

Find Keycloak integration example in the following [`Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/oauth/keycloak/Caddyfile).

## User and Group

First, create "Admin", "Editors", and "Viewer" groups under "Manager", "Groups".

Next, create a new user under "Manager", "Users". As part of the process assign
the newly created groups to the user.

![Keycloak](./images/keycloak/keycloak_new_user.png)

Then, click "View all users" and click on the ID of the newly created user:

![Keycloak](./images/keycloak/keycloak_new_user_1.png)

Browse to "Credentials" tab and set user password.

![Keycloak](./images/keycloak/keycloak_new_user_2.png)

Test the login by the user. The URL is `https://keycloak/auth/realms/master/account/`.

![Keycloak](./images/keycloak/keycloak_user_login.png)

![Keycloak](./images/keycloak/keycloak_user_dashboard.png)

## Realm

Disable a number of providers under "Configure", "Realm Settings", "Keys", and "Providers".

![Keycloak](./images/keycloak/keycloak_realm_1.png)

![Keycloak](./images/keycloak/keycloak_realm_2.png)

![Keycloak](./images/keycloak/keycloak_realm_3.png)

At the end, you should have `rsa-generated` provider only.

![Keycloak](./images/keycloak/keycloak_realm_4.png)

## Client

Add client configuration. See screenshots.

Set "Valid Redirect URIs" to your callback endpoint,
e.g. `https://auth.myfiosgateway.com:8443/oauth2/keycloak/authorization-code-callback`.

Set "Base URL" to the authentication portal, e.g. `https://auth.myfiosgateway.com:8443/`.

The "well-known" configuration URL would be:

```
http://keycloak/auth/realms/{realm}/.well-known/openid-configuration
https://keycloak.axi92.at/auth/realms/master/.well-known/openid-configuration
```

![Keycloak](./images/keycloak/keycloak_new_client_1.png)

![Keycloak](./images/keycloak/keycloak_new_client_2.png)

![Keycloak](./images/keycloak/keycloak_new_client_3.png)

![Keycloak](./images/keycloak/keycloak_new_client_4.png)

![Keycloak](./images/keycloak/keycloak_new_client_5.png)

![Keycloak](./images/keycloak/keycloak_new_client_6.png)

![Keycloak](./images/keycloak/keycloak_new_client_7.png)

Confirm the configuration.

![Keycloak](./images/keycloak/keycloak_client_config_1.png)

![Keycloak](./images/keycloak/keycloak_client_config_2.png)

![Keycloak](./images/keycloak/keycloak_client_config_3.png)

## User Login

The user's profile now has the new application.

![Keycloak](./images/keycloak/keycloak_user_profile.png)

The login to authentication portal will succeed.

![Keycloak](./images/keycloak/keycloak_authenticated.png)
