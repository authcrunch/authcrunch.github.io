---
sidebar_position: 1
---

# Authentication

`caddy-auth-portal` is Authentication Plugin for Caddy v2 implementing
Form-Based, Basic, Local, LDAP, OpenID Connect, OAuth 2.0, SAML
Authentication.

The purpose of this plugin is providing **authentication** only. The plugin
issue JWT tokens upon successful authentication. In turn, the **authorization**
of the tokens is being handled by
[`caddy-authorize`](https://github.com/greenpau/caddy-authorize).

The plugin supports the following **authentication** backends:

* OAuth 2.0 (Google, Facebook, LinkedIn, etc.) and OpenID Connect (OIDC)
* LDAP (`ldap`) - remote Microsoft AD database
* Local (`local`) - JSON flat file database
* SAML

The plugin accepts user credentials for **authentication** with:

* Form-based Authentication: `POST` with `application/x-www-form-urlencoded`
* Basic Authentication: `GET` with `Authorization: Basic` header
* API: `GET` and `POST` with JSON document

The plugin has `/whoami` endpoint to access user data programmatically.
