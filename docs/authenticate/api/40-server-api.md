# Server API

The Service API allows for programmatic control over the portal’s runtime state and user
data. All requests are sent as JSON and require an active, authorized session with the `admin` role.

These endpoints are designed for system administrators to audit and manage the portal's
global infrastructure and its relationship with various identity providers.

To enable the API, the `enable admin api` directive must be present in your `Caddyfile` within
the `authentication portal` block.

## Server State

These endpoints allow administrators to inspect the health and composition of the security portal.

### Metadata

Retrieves the versioning and build information of the running AuthCrunch instance. Use this to
verify deployment consistency and check the system timestamp. The endpoint returns version,
commit hash, and server-side timestamp.

Endpoint: `GET /api/server/metadata`

The endpoint returns version, commit hash, and server-side timestamp.

### Realm Discovery

Lists all authentication domains (realms) currently loaded by the server. This endpoint lists
only the Local realms. It does not list other identity providers, e.g. LDAP, OAuth2, etc..

Endpoint: `POST /api/server/realms`

## Database Operations

These endpoints manage the lifecycle of the underlying identity databases.

### Database Info

Provides deep inspection of a specific realm's status and its internal security policies. The endpoint
returns the file path of the database, the last time it was modified, and current password complexity
policies, e.g. min/max length, character requirements, etc. It also helps understanding if a realm is
operating "in-memory" or backed by persistent storage.

Endpoint: `POST /api/server/info`

---

TBC.