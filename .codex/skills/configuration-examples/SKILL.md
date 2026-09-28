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

Use a disposable local runtime when a behavior check is needed. Record the
binary version, prerequisites, executed commands, and observed allow/deny or
login/redirect results. Missing TLS files, credentials, optional modules, or
provider availability are environment limits to explain, not reasons to weaken
the example. A site build, successful adaptation, and a successful provider
login are different evidence levels.

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

## Acceptance scenarios

- A provider change updates both its documented snippet and linked Caddyfile;
  callback URLs and required variables agree, with verified parser support.
- An authorization scenario admits the intended role and rejects another role
  when runtime testing is available; syntax-only evidence is labeled as such.
- An absent Caddy binary or unavailable provider produces an explicit validation
  limitation, without rebuilding or editing a sibling repository implicitly.
- A single-example edit leaves unrelated examples untouched and does not alter
  the contributor's persistent identity database during validation.
