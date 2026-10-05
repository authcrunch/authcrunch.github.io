---
sidebar_position: 45
title: "Monitoring application example"
description: "Find an example that protects Prometheus, Alertmanager, and Elasticsearch with local, LDAP, and GitHub identities."
discovery:
  topic: applications-and-sso
  kind: guide
  aliases: ["reverse proxy", "Kibana", "monitoring"]
---

# Monitoring application example

Protect each monitoring application's entire route with an authorization policy,
then configure that application's external URL to match the proxy path. Login
alone does not protect Prometheus, Alertmanager, Kibana or Elasticsearch; the
`authorize` handler must run before their responses and proxy requests.

## Choose the login source

Begin with the maintained [local walkthrough](../start/first-app.md),
[LDAP guide](ldap/10-ldap.md), or [GitHub guide](oauth/81-backend-oauth2-0007-github.md).
Grant a distinct application role such as `app/monitoring` and require it in the
monitoring policy. Separate read-only viewers from administration rather than
letting every portal user reach every service.

The repository's [legacy combined LDAP example](https://github.com/authcrunch/authcrunch.github.io/blob/main/assets/conf/ldap/Caddyfile)
shows the historical architecture, but includes obsolete UI directives, broad
roles, demo credentials and skipped certificate verification. It is not the
current production starting point.

## Protect a route before proxying

In an otherwise complete deployment with `monitoringpolicy` already defined:

```caddyfile
@prometheus path /prometheus /prometheus/*
handle @prometheus {
    route {
        authorize with monitoringpolicy
        reverse_proxy 127.0.0.1:9090
    }
}
```

This preserves the prefix. Configure Prometheus's public external URL and route
prefix to match, or deliberately choose a stripping proxy design and configure
the backend for that design. Apply the same decision to assets, redirects,
WebSockets and API requests; protecting just the landing page is insufficient.

For Kibana, `server.basePath: "/kibana"` alone does not define who removes the
prefix. Configure its matching rewrite/public-URL settings for your installed
Kibana version and proxy design. AuthCrunch does not replace Elasticsearch's
backend account permissions or Kibana's native security features.

## Verify the boundary

Check anonymous redirect, a monitoring member's access and a nonmember's 403 for
both the root and an API/static path. Verify logout, generated links, backend
redirects and streaming/WebSocket requests. Bind backends privately so users
cannot bypass the policy by reaching their original listening ports.

For server-to-server monitoring clients, choose a documented nonbrowser
credential flow and policy. Do not make the whole monitoring namespace public
just because a scraper cannot follow interactive login.
