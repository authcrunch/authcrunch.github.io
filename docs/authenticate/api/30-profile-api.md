# Profile API

The Profile API handles individual user data management. It allows users to view their dashboard settings, update their account passwords, or configure security keys. 

To tell the server what you want to do, your request body must include a `"kind"` key specifying your exact operation.

### Fetching User Profile Information

Use this endpoint to grab the active user's account details and metadata.

* **Method:** `POST`
* **Endpoint Path:** `/api/profile`
* **Content Type:** `application/json`

#### What to send in the request body:
```json
{
  "kind": "fetch_user_info"
}
```

#### What a successful response looks like (200 OK):
```json
{
  "status": "success",
  "user_info": {
    "username": "developer_user",
    "email": "user@example.com",
    "name": "Alex Smith"
  },
  "timestamp": "2026-06-28T19:30:00Z"
}
```

---

### Updating a User Password

Use this configuration to securely update an active user account password.

* **Method:** `POST`
* **Endpoint Path:** `/api/profile`

#### What to send in the request body:
```json
{
  "kind": "update_user_password",
  "current_password": "old_password_123",
  "new_password": "secure_new_password_456"
}
```

#### What a successful response looks like (200 OK):
```json
{
  "status": "success",
  "message": "Password changed successfully."
}
```
