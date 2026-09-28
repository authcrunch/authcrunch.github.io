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

This [`Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/Caddyfile)
secures Prometheus, Alertmanager, Elasticsearch services.
Users may access using local, LDAP, and Github credentials.

**Note**: Add the following line in `/etc/kibana/kibana.yml`. It must match the
the prefix used when proxying traffic through:

```
server.basePath: "/elk"
```
