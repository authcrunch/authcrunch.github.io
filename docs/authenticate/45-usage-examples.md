---
sidebar_position: 45
---

# Usage Examples

This [`Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/Caddyfile)
secures Prometheus, Alertmanager, Elasticsearch services.
Users may access using local, LDAP, and GitHub credentials.

**Note**: Add the following line in `/etc/kibana/kibana.yml`. It must match the
the prefix used when proxying traffic through:

```
server.basePath: "/elk"
```
