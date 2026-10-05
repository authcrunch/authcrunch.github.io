# Conditional Javascript Login Redirects

Historical navigation experiment using Referrer, `/sandbox/`, `/portal` and
`/whoami` assumptions. Review its API and path handling against the current
[portal API](../../../docs/authenticate/api/20-portal-api.md) and
[UI customization](../../../docs/authenticate/55-ui-features.md) before reusing
any script. It logs identity information for debugging and contains fixed
workstation URLs; avoid carrying that logging into a deployment.

The script's dashboard jump does not restrict access to a user's dashboard.
Both named users satisfy the original policy's `authp/user` allow rule, so the
server policy does not isolate their `/dash/` paths. Enforce the intended
identity and path with [server-side ACLs](../../../docs/authorize/path-acl.md),
then test direct requests without relying on a browser redirect. See the
[solution status](../README.md) for other obsolete assumptions.
