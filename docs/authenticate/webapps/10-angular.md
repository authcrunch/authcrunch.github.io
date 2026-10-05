---
title: "Angular and browser applications"
description: "Integrate browser identity displays and login redirects while enforcing application access at the server."
discovery:
  topic: applications-and-sso
  kind: guide
  aliases: ["Angular", "SPA", "ngx-authp-service", "ngx-avatar-persona", "CORS"]
---

# Angular integration libraries

Protect the application and its API at the server, then use portal identity data for the signed-in UI. Begin with [your first protected app](../../start/first-app.md) and the [portal API](../api/20-portal-api.md). A client-side route guard, hidden menu item or avatar does not enforce API permissions.

## Prefer a clear browser boundary

For a same-origin application served alongside a portal under `/auth/`, the browser can send its scoped cookie to `/auth/whoami?format=json`. Request JSON explicitly and handle a denied/expired session without treating it as an empty authorized identity:

```typescript
async function readPortalIdentity(): Promise<Record<string, unknown> | undefined> {
  const response = await fetch('/auth/whoami?format=json', {
    credentials: 'same-origin',
    headers: {Accept: 'application/json'},
  });
  if (response.status === 401 || response.status === 403) return undefined;
  if (!response.ok) throw new Error('Identity request failed');
  return response.json();
}
```

Use `name`, `email`, `roles` and optional picture data to render the UI; preserve missing-field behavior. Start authentication with a top-level navigation to the portal login or provider entry point. Keep redirect destinations under the portal's configured [redirect controls](../../authorize/auto-redirect-url.md).

For cross-origin requests, use an explicit permitted origin, credentialed fetch and compatible cookie scope/SameSite settings. Wildcard CORS does not permit credentialed access, and CORS does not grant application roles. Handle OPTIONS/preflight deliberately without making the protected API public. See [cookie scope](../auth-cookie.md) and [server authorization](../../authorize/headers.md).

## Existing Angular libraries

The original integrations remain available:

- [ngx-authp-service](https://github.com/greenpau/ngx-authp-service) wraps identity retrieval and portal redirects.
- [ngx-avatar-persona](https://github.com/greenpau/ngx-avatar-persona) renders an avatar/persona menu.

Their READMEs target older portal and Angular conventions, including the retired `authp { backend ... }` Caddy grammar and `/settings` path. Those examples are not a current AuthCrunch configuration. Check package peer dependencies, your Angular version, response fields and redirect behavior before adopting them. The library links and preserved animation do not establish tested compatibility with the latest Angular release.

<figure>

![Historical Angular avatar menu opening beside a signed-in persona](./images/ngx-avatar-persona-animation.gif)

<figcaption>Historical ngx-avatar-persona demonstration. The visual remains useful as a menu example; use current portal routes and your application's access boundary.</figcaption>
</figure>

## Verify the integration

Test anonymous access, an authorized app member, a signed-in nonmember, expiry and logout. Fetch the protected API directly as the nonmember; it must deny access even if the browser UI is modified. A `whoami` probe reports expiry but does not renew it. [Refresh sessions](../30-refresh-token.md) require explicit server configuration; these older libraries do not establish an automatic renewal contract.

If the application expects a standard OIDC relying-party flow, use the released [OIDC provider](../../apps/oidc-provider.md) and its registered client/redirect/consent requirements instead of treating the portal's access JWT as an OAuth authorization-code response.
