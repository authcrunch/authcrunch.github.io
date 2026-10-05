# AuthCrunch configuration examples

The current examples target the downloadable Caddy Security v1.3.0 bundle
with go-authcrunch v1.3.8. Check [feature availability](../../docs/operations/versions.md)
before adopting newer source directives. Configurations use private environment
placeholders; supply the variables stated by the corresponding guide.

Start with [getting-started/Caddyfile](getting-started/Caddyfile) and the
[learning path](../../docs/intro.md). Provider guides embed their canonical
Caddyfiles from this directory. Parser acceptance proves grammar; live provider,
TLS, directory, mail and cloud configuration require separate verification.

- [Local role matrix](local/Caddyfile) separates portal access from guest/member/admin
  app policies; its [README](local/README.md) gives the expected allow/deny cases.
- [Local refresh](local/refresh/Caddyfile), [registration](local/registration/Caddyfile)
  and [LDAP](ldap/Caddyfile) cover their different identity/session boundaries.
- [Direct OAuth](oauth/direct/Caddyfile) attaches provider login to a policy.
- [OIDC provider](apps/oidc/Caddyfile) makes AuthCrunch the issuer for relying parties.
- [Entra SAML](saml/azure/Caddyfile) and [JumpCloud](saml/jumpcloud/Caddyfile)
  use pinned local IdP certificates and bound portal callbacks.
- [ACI](cloud/azure-aci/Caddyfile) separates private configuration from authorized
  public content; it is not a locally verified Azure deployment.

## Single-provider portal entrance

The historical [oauth/authproxy](oauth/authproxy/Caddyfile) location now contains
a current GitHub portal example. It mounts the portal at `/authzproxy/` and
sets the app's auth URL directly to `/authzproxy/oauth2/github`, skipping the
provider chooser. It still issues a portal token; it is not the direct-OAuth
policy model or an external `auth_request` endpoint.

Replace `auth.example.com`, set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
`GITHUB_ALLOWED_USER_ID` and a private `JWT_SHARED_KEY`, and register
`https://auth.example.com/authzproxy/oauth2/github/authorization-code-callback`.
Only the chosen numeric GitHub account receives `app/member`; test a nonmember
as well as the intended account. Follow the [GitHub guide](../../docs/authenticate/oauth/81-backend-oauth2-0007-github.md)
for current app registration and claim rules.

## Compatibility and historical examples

The [Facebook driver](../../docs/authenticate/oauth/81-backend-oauth2-0008-facebook.md)
hard-codes old API endpoints. Its example is parser-valid, not proof of current
Meta API compatibility. The [historical solutions](../solutions/README.md)
retain older machine paths, public demo accounts and UI assumptions. Their
READMEs identify current replacements and boundaries; use the canonical guides
for a new deployment.
