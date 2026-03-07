# Administrative API Endpoints

Administrative API calls are **JWT-authenticated** and require the portal’s
`api.admin` (or `api.profile`) configuration to be enabled. Paths are relative
to the portal mount (e.g., `/auth/api/...`). All requests are JSON.

## `POST /api/server/realms`
- **Role:** `admin`
- **Body:** `{"query":"<substring|all>"}` (optional)
- **Response:** `200 OK` with `realms` array `{realm,name,kind}` and `count`.

Example:
```bash
curl -X POST https://auth.example.com/api/server/realms \
  -H "Content-Type: application/json" \
  -d '{"query":"all"}' -H "Cookie: <portal-session>"
```

## `POST /api/server/users`
- **Role:** `admin`
- **Body:** `{"realm":"<realm>","query":"<filter>"}` (realm required)
- **Response:** `200 OK` with `{count, users[], timestamp}` metadata list.

## `POST /api/server/reload`
- **Role:** `admin`
- **Body:** `{"realm":"<realm>"}` (required)
- **Response:** `200 OK` with `{status:"success|failure", timestamp}`.

## `POST /api/server/info`
- **Role:** `admin`
- **Body:** `{"realm":"<realm>","query":"<metadata selector>"}` (realm required)
- **Response:** `200 OK` with realm metadata and `timestamp`.

## `GET /api/server/metadata`
- **Role:** `admin`
- **Response:** `200 OK` with AuthCrunch build/version info plus `timestamp`.

## `POST /api/profile`
- **Role:** `admin` or `user` (when `api.profile` enabled)
- **Body:** `{"kind":"<operation>", ...}` where `kind` is one of:
  - `fetch_debug`, `fetch_user_dashboard_data`, `fetch_user_info`
  - `update_user_password`
  - MFA operations: `fetch_user_multi_factor_authenticator(s)`, `add_user_app_multi_factor_authenticator`, `test_user_app_multi_factor_authenticator`, `delete_user_multi_factor_authenticator`, etc.
  - API/SSH/GPG key operations: `fetch_user_api_keys`, `add_user_api_key`, `test_user_api_key`, `delete_user_api_key`, and analogous `*_ssh_key`, `*_gpg_key`
  - U2F/WebAuthn operations: `fetch_user_u2f_reg_params`, `test_user_webauthn_token`, etc.
- **Response:** `200 OK` on success with operation-specific payload; `400/403/501` on invalid kind, role, or unsupported backend.

Example (fetch profile info):
```bash
curl -X POST https://auth.example.com/api/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: <portal-session>" \
  -d '{"kind":"fetch_user_info"}'
```
