---
name: configuration-examples
description: "Maintain Caddy security configuration snippets, assets/conf examples, and assets/solutions scenarios. Verify parser support, related environment and UI assets, and the limits of formatting, adaptation, and runtime validation."
---

# Configuration Examples

## Ownership and source evidence

Own Caddyfile content in public docs and the runnable examples under
[assets/conf](../../../assets/conf/) and
[assets/solutions](../../../assets/solutions/). Inputs include the desired
authentication or authorization behavior, selected Caddy/plugin version, and
provider prerequisites. Keep the configuration, explanatory prose, environment
variable names, and companion files consistent.

`assets/conf/` groups the beginner example and local, LDAP, OAuth, and SAML
configurations. The solution
directories combine Caddyfiles and environment files; `A00002` also supplies
custom portal JavaScript. These are examples with machine-specific prerequisites,
not a hermetic test suite. Read the entire affected example before extracting
a block or running it.

For new or disputed syntax, inspect the selected caddy-security parser and its
go-authcrunch dependency. Sibling checkouts at
`../../greenpau/caddy-security` and `../../greenpau/go-authcrunch` are optional
read-only sources; check revisions and the plugin's `go.mod` replacements.
Trace global directives through `caddyfile*.go`, route directives through
`plugin_authn.go` or `plugin_authz.go`, and delegated grammar to the upstream
parser/consumer. Existing adaptation fixtures can support grammar claims.
If matching source or a suitable binary is unavailable, report that limit.

## Example contract

- Keep store/provider, portal, and policy names consistent across definitions
  and route references. Prefer `myportal` or a descriptive portal name in new
  examples. Preserve the directive ordering required by the selected example.
- Align the portal mount path, OAuth callback/ACS URL, policy auth URL, cookie
  scope, TLS hostnames, and protected site. Explain changes to the route prefix
  wherever they affect provider-console setup or redirects.
- Released v1.3.0 bundles library v1.3.8: `match any` and `acl default` can
  be skipped when normalized identity lacks exp. Prefer explicit allow stop
  rules and implicit denial; the unconditional-rule fix is in library v1.3.11.
  Full method/path rules need validate method path. Shortcut paths are partial
  matches, so use a full exact/boundary-aware prefix rule for access boundaries.
- Match token signing and verification configuration between portal and policy.
  Roles granted by transforms must agree with the policy's allowed roles.
  Demonstrate the intended rejection path as well as successful access.
- Keep secrets as named placeholders. Do not silently interchange `{$VAR}` and
  `{env.VAR}`: verify adaptation-time expansion and runtime resolution for the
  directive/version. Label existing demo credentials and insecure options when
  they are relevant to the edited scenario.
- Document required environment variables, certificates, metadata, user database
  locations, and custom JS/CSS paths. Use temporary data locations for validation
  that may provision or rewrite a local store. Do not source an example environment
  file without inspecting its commands and values.
- When changing a solution's JavaScript, check its DOM/API assumptions, redirect
  conditions, and response fields against the matching portal behavior. The
  documentation site's TypeScript check does not validate portal JavaScript.

## Validation levels and side effects

The [existing validator](../../../assets/scripts/validate_config.sh) hard-codes
`$HOME/dev/go/src/github.com/greenpau/caddy-security/bin/caddy`, iterates all
examples, formats each in place, then runs `caddy validate`. Its `set -e` stops
at the first failure. It is neither read-only nor portable to every checkout.
The [README](../../../README.md) formatter also rewrites every example. Prefer
a targeted invocation for the requested change.

From the repository root, after locating an existing Caddy binary with the
security module, a formatting/adaptation check can take this shape:

```sh
example_caddy=../../greenpau/caddy-security/bin/caddy
example_config=assets/conf/oauth/github/Caddyfile
"$example_caddy" version
"$example_caddy" list-modules
"$example_caddy" fmt --diff "$example_config"
"$example_caddy" adapt --adapter caddyfile --config "$example_config" >/dev/null
```

The binary path is a candidate, not a guaranteed build artifact. Formatting
checks presentation; adaptation checks parser/module acceptance. Inspect adapted
JSON in ignored `tmp/` only with synthetic inputs because expansion can expose
secrets. `caddy validate --adapter caddyfile --config ...` additionally loads and
provisions modules; inspect file writes and external provider contact first and
prepare an isolated environment. Never treat it as a pure syntax linter.

A formatter's zero exit status does not prove the source is already formatted.
Inspect its diff or compare the read-only `caddy fmt <file>` output with the
source. `fmt --diff` can print unchanged context; do not require empty output
as the acceptance condition. Avoid `--overwrite` for a read-only check.

Use a disposable local runtime when a behavior check is needed. Record the
binary version, prerequisites, executed commands, and observed allow/deny or
login/redirect results. Missing TLS files, credentials, optional modules, or
provider availability are environment limits to explain, not reasons to weaken
the example. A site build, successful adaptation, and a successful provider
login are different evidence levels.
Disposable runtimes and provider fixtures follow the
[local server lifecycle](../site-operations/SKILL.md#local-server-lifecycle);
finish by stopping their processes and releasing their ports before ending
the turn.

## Refresh, direct OAuth, and OIDC provider examples

The canonical released feature examples are `assets/conf/local/refresh/Caddyfile`,
`assets/conf/oauth/direct/Caddyfile`, and `assets/conf/apps/oidc/Caddyfile`.
Their guides import the files with `?raw`. The baseline is caddy-security v1.3.0
with go-authcrunch v1.3.8. Refresh uses explicitly selected local realms and
HTTPS; direct OAuth uses a policy-owned opaque session rather than portal JWTs.
OIDC provider login selects local realms and dedicated private RSA signing keys.
Its client secret uses `{$OIDC_WEBSITE_SECRET}` for adaptation-time validation;
keep expanded JSON private. Its scoped consent response headers were verified
with an actual browser and must agree with the registered callback origin.

Adaptation alone does not verify these protocols. When changing behavior, use
disposable TLS storage and synthetic accounts/providers to check rotation/replay,
allow/deny/logout, or consent/code/PKCE/UserInfo as appropriate. A loopback provider
with a self-signed certificate can require fixture-only TLS verification disabling;
do not add that setting to the public production example. Persistent-state checks
must stop one owner before starting the replacement and retain the same config.

## Local learning example

[assets/conf/getting-started/Caddyfile](../../../assets/conf/getting-started/Caddyfile)
is the canonical configuration embedded by `docs/start/first-app.md`. It targets
the published caddy-security v1.3.0 bundle and go-authcrunch v1.3.8. Keep its
public walkthrough and executable behavior consistent when updating versions.

Run it in a fresh disposable directory with `data/` and an exported
`AUTHCRUNCH_DEMO_SECRET`. It binds HTTP to `127.0.0.1:9080`, uses the `localhost`
hostname, and permits insecure cookies only for this local exercise. Both the
user database and Caddy storage live under that directory. The disabled admin
endpoint requires stopping the foreground process and starting it again; reload
is not available. Provisioning a new local store may add a bootstrap admin in
addition to its explicit demo users.

The matched `/app` and `/app/*` route must authorize before responding. An
anonymous request redirects, Alice's `app/member` role permits access, and Bob's
portal-only role receives 403. After login, the tested flow reaches the portal's
Applications page; the user selects Example app. Check browser logout with a
fresh app request, without claiming that it revokes an independently copied
token. Scope runtime results to the tested executable and environment.

## GitHub example

[assets/conf/oauth/github/Caddyfile](../../../assets/conf/oauth/github/Caddyfile)
is embedded in the GitHub guide and targets caddy-security v1.3.0 with
go-authcrunch v1.3.8. It serves a portal under `/auth/` and protects `/app` plus
its descendants on one HTTPS hostname. The example grants portal access to
GitHub users but requires a numeric account ID to receive `app/member`.

Set `GITHUB_ALLOWED_USER_ID` before adaptation: `{$GITHUB_ALLOWED_USER_ID}`
expands in the Caddyfile parser. The client ID, client secret, and shared signing
key use runtime `{env.VARIABLE}` placeholders. Use synthetic values when
capturing adapted JSON. HTTPS certificate provisioning requires a real hostname;
local runtime checks should use disposable storage, a loopback listener, and a
local certificate without modifying the user's trust store.

Keep the organization variant's filter and transform together. In this release,
the driver's organization endpoint returns public memberships and it does not
follow pagination. Separate role-granting transforms are additive; requiring
both account ID and organization means putting both matchers in one transform.
Test selected and unselected accounts and a missing organization claim. Local
provider fixtures verify runtime behavior, not GitHub consent or an actual app
registration; record those validation boundaries separately.

## Generic OIDC and Keycloak examples

The [generic](../../../assets/conf/oauth/generic/Caddyfile) and
[Keycloak](../../../assets/conf/oauth/keycloak/Caddyfile) examples are embedded
in their public pages. Both use the generic driver, explicit issuer/discovery
URLs, a portal under `/auth/`, and an `app/member` policy for `/app` and its
descendants. The bundle baseline remains caddy-security v1.3.0 / go-authcrunch
v1.3.8. Keycloak console and runtime guidance is checked against 26.7.4.

The generic example expects `app-members`; Keycloak's Group Membership mapper
with Full group path enabled emits `/app-members`. Preserve this exact
distinction. The mapper adds groups to the ID token; the portal combines them
into roles before transforms grant `app/member`. Email must also be in the ID
token for the default check. An optional UserInfo fetch runs later and is not
an equivalent replacement. Keep portal roles separate from the application grant.

Test actual discovery, a code exchange with S256 PKCE, a member and nonmember,
and a missing or mismatched group claim when an isolated provider is available.
Portal logout and provider SSO logout are separate checks. Disposable local
Keycloak testing may use loopback HTTP with insecure cookies in a temporary
configuration; keep that adaptation out of the canonical HTTPS examples. Do not
present local network tests as production TLS, proxy, or certificate validation.

## Reserved roles in OIDC examples

Provider role/group claims enter the portal before transforms. In the generic,
Keycloak, Google, Entra, Okta, and OneLogin examples, clear provider-derived
`authp/*` and `app/member` first, then grant portal and app roles from the
documented subject or membership rule. Auth0 resets all provider roles before
its subject grant. Otherwise a provider-issued `app/member` can satisfy the
policy directly, and `authp/admin` can grant portal administration.

Keep the role-dropping transform restricted to a role matcher. The runtime
evaluates each candidate role without realm or other identity fields; combining
it with a realm matcher prevents removal. These complete examples enable one
provider. A shared portal needs explicit grants for the internal roles each
identity source may receive after reserved input roles are cleared.

Test reserved input roles on both a member and a nonmember, including roles
supplied through `groups` and `roles`. Assert the intended grant survives,
unrelated provider roles remain available, and portal administrator roles do
not survive. Preserve useful images when adding this explanation to a guide.

## Google and Microsoft Entra ID examples

The [Google](../../../assets/conf/oauth/google/Caddyfile) and
[Entra](../../../assets/conf/oauth/azure/Caddyfile) examples use the same
portal/application boundary. Google grants access by `sub`; Entra's `azure`
driver grants it through the ID-token app role `App.Access`. Keep the complete
Google client ID in its environment value, without appending the suffix again.
`GOOGLE_ALLOWED_SUB` and `ENTRA_TENANT_ID` expand at Caddyfile parse time;
credentials and signing keys retain runtime placeholders.

Use a concrete Entra tenant GUID for the workforce example. The bundled
v1.3.8 validator compares issuer strings literally and does not substitute the
tenant in `common` or `organizations` metadata. Personal-account `consumers`
uses a fixed issuer and needs its own subject-based access rule. Entra email
is optional in the example because app roles, not email, control access.

Google's `hd` and `email_verified`, and Entra's `oid`, `tid`, and
`preferred_username`, are not extracted by this token parser. Google Cloud
Identity group lookup adds display names and does not poll unfinished operations;
lookup failure does not reject login. Entra group overage does not trigger a
Graph lookup. Require the intended role and test missing claims explicitly.

Local OIDC fixtures should preserve the driver, claim transforms, and policies,
and verify code exchange, PKCE, issuer/audience/nonce rejection, and allow/deny.
Record live consent, tenant policy, group API, and production TLS checks
separately; synthetic provider responses cannot establish those behaviors.

## GitLab and Okta examples

The [GitLab](../../../assets/conf/oauth/gitlab/Caddyfile) and
[Okta](../../../assets/conf/oauth/okta/Caddyfile) examples grant `app/member`
from an explicit group while keeping ordinary portal access separate. Preserve
the released v1.3.8 driver's claim source: GitLab fetches UserInfo, while Okta
uses the ID token and does not fetch UserInfo to fill missing email or groups.

GitLab filters the unprefixed UserInfo `groups` paths with `user_group_filters`,
then prefixes retained roles with the host derived from `base_auth_url`.
`GITLAB_DOMAIN` expands at parse time in both the provider and role matcher.
No filter means no group roles. The subject is the UserInfo profile URL, not
GitLab's numeric OIDC subject; test renames, missing groups, and failed UserInfo.

Okta's named driver requires a custom authorization-server ID. `OKTA_DOMAIN`
and `OKTA_SERVER_ID` expand at parse time; credentials resolve at runtime.
Use an ID-token `groups` claim with Always inclusion and verify email presence.
The released client sends credentials in the form body (`client_secret_post`).
App assignment, authorization-server policy, and AuthCrunch policy are separate
checks. Local fixtures cannot establish live Okta entitlement or console setup.

## Auth0 and OneLogin examples

The [Auth0](../../../assets/conf/oauth/auth0/Caddyfile) and
[OneLogin](../../../assets/conf/oauth/onelogin/Caddyfile) examples use the
generic driver with provider-specific realms and callbacks. Both target the
caddy-security v1.3.0 / go-authcrunch v1.3.8 bundle, require confidential web
clients with `client_secret_post`, and separate portal access from `app/member`.

`AUTH0_DOMAIN`, `AUTH0_ALLOWED_SUB`, and `ONELOGIN_DOMAIN` expand at parse time;
credentials and signing keys retain runtime placeholders. Auth0's issuer ends
in `/`; OneLogin's v2 issuer ends in `/oidc/2` without a final slash. Match the
actual discovery issuer literally. Test slash mismatches as well as other
issuer, audience, nonce, signature, and email failures.

Auth0 resets provider-derived roles to `authp/user`, then grants access by the
entire exact subject, including any connection prefix and pipe. A matching
email, similar subject, or provider-issued `app/member` must not grant access.
Auth0's namespaced custom roles are not mapped by the bundled generic parser;
do not imply that adding an Action or an API audience makes them usable roles.
Review the returned subject after account linking or connection changes.

OneLogin requests `groups` and maps the connector's Groups parameter to User
Roles with multi-value output. Clear provider-derived `authp/*` and `app/member`
before adding portal roles and translating `app-members` into app access.
The example does not fetch UserInfo. Test absent, malformed, differently cased,
and similarly named groups, including a group present only in UserInfo.
Application assignment and the AuthCrunch policy remain separate boundaries.

Local fixtures verify the released executable, not live provider registration,
group mapping, tenant policy, consent, or production TLS. Preserve that boundary
in public guidance and verify those settings with the real organization.

## Additional OAuth provider examples

LinkedIn uses its current OIDC product; the named driver disables nonce/PKCE.
PingOne uses the generic code flow, exact copied discovery/issuer values, and
Client Secret Post. Do not restore the old implicit-flow/JS-callback example.
Cognito maps ID-token custom:roles, cognito:groups/roles, timezone, and username;
keep permission-bearing attributes administrator-controlled. Discord group
filters are regular expressions, so use an anchored numeric guild ID; a bare
asterisk is invalid. Clear reserved input roles before granting app/member.
The bundled Facebook driver hard-codes v12.0 endpoints; parser acceptance is
not evidence of compatibility with Meta's current API.

## LDAP examples

The AD, secondary-group, and GLAuth examples use verified LDAPS and a private
bind-secret file. `posix_groups` substitutes the returned user DN into the
secondary filter, not a bare UID. Automatic mappings operate on that secondary
search; ordinary memberOf uses explicit DN mappings. Fallback roles apply only
after successful lookup without mapped roles, not after an empty/failed secondary
search. Preserve separate portal and application roles. A local LDAPS fixture
checks these boundaries without proving a real directory's schema or policy.

## Acceptance scenarios

- A provider change updates both its documented snippet and linked Caddyfile;
  callback URLs and required variables agree, with verified parser support.
- An authorization scenario admits the intended role and rejects another role
  when runtime testing is available; syntax-only evidence is labeled as such.
- An absent Caddy binary or unavailable provider produces an explicit validation
  limitation, without rebuilding or editing a sibling repository implicitly.
- A single-example edit leaves unrelated examples untouched and does not alter
  the contributor's persistent identity database during validation.

## Upstream SAML and application SSO boundaries

The Entra and JumpCloud examples under `assets/conf/saml/` use the released
generic SAML driver, explicit provider SSO URLs, pinned local PEM certificates
and `/auth/saml/<realm>` callbacks. Their guides embed the canonical files.
Preserve SP Entity ID/audience, required display-name/email attribute names,
state-bound GET initiation and original RelayState on POST. Provider roles
must not directly grant reserved portal/application roles. Test signed responses
with the exact library: valid, wrong browser/callback, replay and rogue signing
key. Browser checks must exercise the dedicated SameSite=None HTTPS cookie.

App-side `sso provider aws` is a separate partial implementation: metadata and
menu exist, but the released assume handler returns `ASSUME ROLE`. Accepted
syntax does not prove AWS assertion issuance. Keep its support warning and
PKCS#8 key requirement; do not turn the old placeholder into a deployment recipe.

## Messaging consumer verification

For released messaging guidance, trace parser names through registration Notify
and the transport. In v1.3.8, template paths are accepted but registration uses
embedded English templates; SMTP has no STARTTLS upgrade, SASL is PLAIN, BCC
adds a header without extra RCPT recipients, and file delivery omits From/Bcc.
Only initial confirmation and attempted administrator-ready notification run
in the portal workflow. Passwordless describes the mail connection, not login.
Verify acknowledgement writes the separate hashed dropbox while leaving the
active user store unchanged. A failed administrator delivery does not roll back
the request. Use disposable local sinks/private spool files and stop them.

## Upstream OIDC trust and deployment references

`docs/authenticate/oauth/83-oidc-trust.md` documents released static `jwks key`
pins, explicit issuer/access-token audience, authorized party and bounded
remote rollover. Static IDs override remote keys; malformed/claim failures
do not trigger signature bypasses. The accepted metadata-discovery disable
flag has no released consumer. Check actual fetch paths, not flag comments.
The legacy Nextcloud driver is incomplete for native OAuth2 account identity.

The ACI reference under `assets/conf/cloud/azure-aci/` embeds the current Entra
role boundary and serves only `/srv/public` after authorization. Its host/tenant
expand at adaptation. Validate the image/entrypoint, Azure mounts and TLS
separately; local grammar acceptance is not a cloud deployment result. Keep
private configuration, identity and TLS data outside every file-server root.

The v1.4.0 source tag includes typed policy fields, the unconditional ACL fix
and cross-device login with library v1.3.11. Verify release assets separately
from tag presence; the last observed downloadable bundle remains v1.3.0. The
cross-device browser binding has fixed security/path/lifetime; only its name
can be overridden with `cookie cross-device session id name <name>`.

`assets/conf/oauth/authproxy/` now uses the current GitHub canonical role boundary
at the historical `/authzproxy/` mount and sends app login directly to the
provider entrance. This is still portal-issued JWT login, not direct OAuth
or an external auth-request handler. Preserve hostname/mount/callback agreement.
`assets/solutions/` is explicitly historical: its README records old UI paths,
machine-specific prerequisites and the client-side dashboard redirect's lack
of server-side path isolation. Do not promote those scenarios as current recipes.

The root `assets/conf/local/Caddyfile` is a fresh-directory loopback demo with
Bob as app/guest, Alice as app/member, and Carol as app/admin (all ordinary
portal users). Its three route policies require app roles, not authp/user.
Test the complete allow/deny matrix and nested routes before changing it; keep
portal administration separate and do not reconcile a contributor's real store.
