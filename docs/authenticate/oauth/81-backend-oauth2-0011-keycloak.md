# Keycloak

Find Keycloak integration example in the following [`Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/oauth/keycloak/Caddyfile).

## Realm Roles

Create a set of roles that will be later mapped to group memberships.

* `authp/admin`
* `authp/user`
* `authp/guest`

![Keycloak](./images/keycloak/keycloak_new_role_1a.png)

![Keycloak](./images/keycloak/keycloak_new_role_1b.png)

![Keycloak](./images/keycloak/keycloak_new_role_2a.png)

![Keycloak](./images/keycloak/keycloak_new_role_2b.png)

![Keycloak](./images/keycloak/keycloak_new_role_3a.png)

![Keycloak](./images/keycloak/keycloak_new_role_3b.png)

![Keycloak](./images/keycloak/keycloak_new_role_4.png)

## Groups

First, create "Admins", "Editors", and "Viewer" groups under "Manage", "Groups".

Create "Admins" group:

![Keycloak](./images/keycloak/keycloak_new_group_1a.png)

![Keycloak](./images/keycloak/keycloak_new_group_1b.png)

Assign the previously created `authp/admin` role to "Admins" group:

![Keycloak](./images/keycloak/keycloak_new_group_1c.png)

Create "Editors" group:

![Keycloak](./images/keycloak/keycloak_new_group_2a.png)

![Keycloak](./images/keycloak/keycloak_new_group_2b.png)

Assign the previously created `authp/user` role to "Editors" group:

![Keycloak](./images/keycloak/keycloak_new_group_2c.png)

Create "Viewers" group:

![Keycloak](./images/keycloak/keycloak_new_group_3a.png)

![Keycloak](./images/keycloak/keycloak_new_group_3b.png)

Assign the previously created `authp/guest` role to "Viewers" group:

![Keycloak](./images/keycloak/keycloak_new_group_3c.png)

The list of realm roles follows.

![Keycloak](./images/keycloak/keycloak_new_group_4.png)

## Users

Next, create a new user under "Manage", "Users". As part of the process assign
the newly created groups to the user.

![Keycloak](./images/keycloak/keycloak_new_user.png)

Then, click "View all users" and click on the ID of the newly created user:

![Keycloak](./images/keycloak/keycloak_new_user_1.png)

Browse to "Credentials" tab and set user password.

![Keycloak](./images/keycloak/keycloak_new_user_2.png)

Browser to "Role Mappings" tab and see that the "Effective Roles".

![Keycloak](./images/keycloak/keycloak_user_effective_roles.png)

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

Browse to "Mappers" tab of the client config.

Click "Create" and add `email` property.

![Keycloak](./images/keycloak/keycloak_client_create_mapper.png)

Next, click "Add Builtin" and add "groups" property.

![Keycloak](./images/keycloak/keycloak_client_add_builtin_mapper.png)

Review the created mappers.

![Keycloak](./images/keycloak/keycloak_client_mappers.png)

## User Login

The user's profile now has the new application.

![Keycloak](./images/keycloak/keycloak_user_profile.png)

The login to authentication portal will succeed and `/whoami` will reflect the assigned groups.

![Keycloak](./images/keycloak/keycloak_assigned_roles.png)
