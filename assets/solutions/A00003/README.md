# Logout Redirects

Historical local/LinkedIn experiment with a trusted return to Google. It retains
public demo accounts, workstation TLS/store paths and old `/settings` links.
The old LinkedIn block also lacks the explicit current OIDC scopes in the
[canonical LinkedIn example](../../conf/oauth/linkedin/Caddyfile).

Use the current [logout flow](../../../docs/authenticate/15-logout.md) and
[trusted redirect matching](../../../docs/authenticate/100-trust-login-logout.md).
Limit the destination to the intended domain/path, URL-encode `redirect_uri`,
and verify an untrusted return is rejected. Portal logout does not prove that
the upstream session or independently copied JWT was revoked. See the
[solution status](../README.md) before using the original files.
