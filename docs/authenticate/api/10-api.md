# API Overview

The following APIs provide a structured way to interact with the security portal programmatically. These
interfaces allow for both user-level self-service and high-level administrative control over the
server's security configurations.

The API is divided into several domains to ensure a clean separation of concerns between user
identity management and system-wide administration.

* **Portal API**: Allows users probe the current identity context, e.g. claims and session expiry, etc.
* **User Profile API**: Handles identity-specific actions including credential management, multi-factor
  authentication (MFA) setup, and personal attribute updates.
* **Server Management API**: Provides administrative hooks for managing users, realoading, etc.

> All examples and explanations about the API assume that you serve the portal
> from `/auth/` path. Therefore, if the documentation references `/api/server/info`,
> the full path is `/auth//api/server/info`.