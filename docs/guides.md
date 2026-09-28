---
title: Guides by topic
description: Find AuthCrunch guides for identity providers, login, sessions, authorization, application integration, and operations.
---

# Guides by topic

Choose the part of your setup you want to work on. New to AuthCrunch? Follow the
[learning path](intro.md) for a complete local setup first.

## Identity providers

Connect a source of user identities to your authentication portal.

| Task | Guide |
| --- | --- |
| Manage users in a local database | [Local identity store](authenticate/local/20-identity-store.md) |
| Authenticate against a directory | [LDAP](authenticate/ldap/10-ldap.md) and [user search](authenticate/ldap/20-search.md) |
| Connect an OAuth or OIDC provider | [Provider overview](authenticate/oauth/10-oauth2.md) and [generic provider settings](authenticate/oauth/81-backend-oauth2-0000-generic.md) |
| Sign in with GitHub | [GitHub](authenticate/oauth/81-backend-oauth2-0007-github.md) |
| Sign in with Google | [Google](authenticate/oauth/81-backend-oauth2-0002-google.md) |
| Connect Microsoft Entra ID / Azure AD | [Microsoft OAuth](authenticate/oauth/81-backend-oauth2-0006-microsoft.md) |
| Connect a SAML identity provider | [SAML](authenticate/saml/10-saml.md), [Microsoft](authenticate/saml/20-azure.md), and [JumpCloud](authenticate/saml/30-jumpcloud.md) |

Find other provider guides under **Authentication → OAuth 2.0 IdP** in the sidebar.

## Login and MFA

- [Authentication portal](authenticate/auth-portal.md): define and mount a portal.
- [Multi-factor authentication](authenticate/11-mfa.md): add another authentication factor.
- [Authentication challenges](authenticate/13-authentication-challenges.md): control what users must complete during login.
- [User transforms](authenticate/42-user-transforms.md): map user information and assign roles.
- [User registration](authenticate/local/40-user-registration.md): configure local account registration.
- [Portal UI](authenticate/55-ui-features.md): customize the login and application pages.
- [Internationalization](authenticate/12-i18n-internationalization.md): configure portal language support.

## Sessions and cookies

- [Authentication cookies](authenticate/auth-cookie.md): scope the browser's login cookie.
- [Refresh tokens](authenticate/30-refresh-token.md): review portal token renewal.
- [Logout](authenticate/15-logout.md): end the browser's login session.
- [Token discovery](authorize/token-discovery.md): select where a policy looks for a token.
- [Token verification](authorize/token-verification.md): configure token validation.

Start with [Choose a login model](intro.md#choose-a-login-model) before applying
session settings. A portal-issued token and a direct OAuth policy session have
different lifecycles.

## Authorization

- [First protected app](start/first-app.md): connect a policy to an HTTP route.
- [Role-based access](authorize/acl-rbac.md): allow or deny based on roles and claims.
- [Path-based access](authorize/path-acl.md): apply rules to request paths.
- [Identity headers](authorize/headers.md): pass user information to an application.
- [IP filtering](authorize/ip-filter.md): add network-based restrictions.
- [API key authentication](authorize/api_key_auth.md) and [Basic authentication](authorize/basic_auth.md): review alternatives to browser login.
- [Verify access](start/verify-access.md): test the policy's allowed and denied outcomes.

## Applications and SSO

- [Choose a login model](intro.md#choose-a-login-model): distinguish a portal, direct OAuth access, and AuthCrunch as an OIDC provider.
- [Application overview](apps/intro.md): find the application integration configuration.
- [SAML applications](apps/sso_saml.md): configure AuthCrunch for downstream SAML applications.
- [Angular integration](authenticate/webapps/10-angular.md): review an existing web application integration.

An application that consumes an identity protocol needs its own client
configuration. Protecting a reverse proxy route with `authorize` is a separate
integration pattern.

## Operations

- [Deployment next steps](start/next-steps.md#prepare-a-deployment): move beyond the local example.
- [Credentials](credentials/intro.md): configure reusable credentials.
- [Messaging](messaging/intro.md): configure notification delivery.
- [Local password management](authenticate/local/30-password-management.md): manage local credentials.
- [API reference](authenticate/api/10-api.md): find portal, profile, server, and system APIs.
- [Configuration examples](https://github.com/authcrunch/authcrunch.github.io/tree/main/assets/conf): inspect complete configurations and their environment requirements.
- [Troubleshooting](troubleshoot.md): narrow down a failed login or access check.
