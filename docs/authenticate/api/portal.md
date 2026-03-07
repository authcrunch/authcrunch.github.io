# Portal JSON Endpoints

These endpoints expose the portal’s core authentication data over JSON. Prefix
them with your portal mount path (e.g., `/auth` → `/auth/json/login`).

## `POST /json/login`

Authenticate with JSON credentials and receive a session token.

- **Body:** `{"username":"<user>","password":"<pass>","realm":"<realm>"}`  
- **Success:** `200 OK` with `{"token":"<jwt>","token_name":"<cookie name>"}`
- **Failure:** `401 Unauthorized` with error JSON.

Example:

```bash
curl -X POST https://auth.example.com/json/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret","realm":"local"}'
```

## `GET /json/whoami`

Return the authenticated user claims.

- **Query params (optional):**
  - `probe=true` – include `authenticated` and `expires_in` seconds.
  - `id_token=true` – include `id_token` cookie value when available.
- **Success:** `200 OK` with user claim map.
- **Failure:** `401 Unauthorized`.

Example:

```bash
curl -H "Cookie: <portal-session-cookie>" \
  "https://auth.example.com/json/whoami?probe=true"
```

## `GET /json/beacon`

Lightweight health/identity check.

- **Success:** `200 OK` body `OK` when the session is valid.
- **Failure:** `401 Unauthorized`.
