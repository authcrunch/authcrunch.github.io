---
title: "Persistent runtime state"
description: "Keep completed sessions and generated keys across restarts using private local storage, with explicit deployment and backup requirements."
discovery:
  topic: operations
  kind: guide
  aliases: ["persistence", "restart", "state directory", "durable sessions"]
---

# Persistent runtime state

AuthCrunch normally keeps runtime sessions in memory. The optional `state`
block saves completed sessions and generated keys so an unchanged installation
can restart without asking every user to sign in again. This is available in
**caddy-security v1.3.0 / go-authcrunch v1.3.8**.

## Enable storage

Add this block inside your existing global `security` block:

```caddyfile
state {
    directory /var/lib/authcrunch/runtime
}
```

Choose a stable absolute directory outside temporary or release directories.
The service creates missing storage privately; an existing directory must have
owner-only permissions. The runtime uses 0700 directories and 0600 files.
Ensure the service account can create and maintain them. An empty block, root
directory, or invalid path is an error, not a request to fall back to memory.

**Use a local Unix filesystem and one active process per directory.** Network
filesystems, sharing between active replicas, and Windows persistence are not
supported. File-backed local user databases remain separate from runtime state;
an in-memory local database is incompatible with persistence.

## What survives a restart

| State | Retained with the same storage and compatible configuration |
| --- | --- |
| Generated signing keys | Existing generated key material and verification of unexpired tokens |
| Completed portal logins | Unexpired sessions and their original local authentication evidence |
| [Portal refresh](../authenticate/30-refresh-token.md) | Families, deadlines, rotations and complete replay history |
| [Direct OAuth authorization](../authorize/direct-oauth.md) | Completed sessions and successful local logout |
| [OIDC provider](../apps/oidc-provider.md) | Completed browser sessions, consent, code/token grants and replay history |

Pending logins, sandbox checkpoints, MFA enrollment, registration and unfinished
interactive authorization must start again. Offline time counts toward expiry.
Persistent state does not renew upstream OAuth tokens or extend session deadlines.

Keep identity databases, configuration, TLS files, explicit signing keys, OIDC
client registrations and provider secrets in their existing locations. Runtime
state does not replace any of them. The local database remains the authority for
current account status and credential versions.

## Deploy with stop/start

1. Stop admitting requests and drain the old process.
2. Stop Caddy completely and wait for it to release the directory lock.
3. Start the replacement using the same service account, public addresses,
   identity files, state directory and compatible security configuration.
4. Verify a pre-restart session, an access denial, renewal if enabled, and logout.

An overlapping reload is rejected because the replacement cannot acquire the
old process's storage. Plan this handover in your service manager or container
deployment. Multiple workers do not gain shared sessions from a shared volume.

First enabling persistence does not import existing in-memory sessions. Users
must sign in again. Changes to the normalized security configuration can also
invalidate sessions conservatively, including ordering or unrelated security
settings. Diagnostic logging changes and the storage path are excluded from
that comparison. Generated keys persist independently of those session changes.

Removing a component and reintroducing it does not restore its previous sessions
when the same directory observed both configurations. A dormant directory or old
backup can still contain valid authority; returning to it is a recovery decision,
not an ordinary way to undo configuration changes.

## Back up and recover

Drain and stop the host, then back up the **entire state directory** together
with its configuration, identity databases and explicit key files. Preserve
ownership and permissions. Restore a coherent set; do not combine individual
records from different backups or edit internal snapshots.

State records are encrypted, but `master.key` is stored in the same directory.
Treat the complete directory and its backups as credentials. Encrypt backups
and restrict their access. Restoring an older complete matching backup can
restore old authority; plan revocation or a fresh login when recovering.

Corrupt or missing committed files, unsafe permissions, a missing key, and a
competing owner fail closed. Failed state writes disable further state-dependent
decisions. An interrupted write can discard the affected sessions on reopen;
this is preferable to restoring a possibly revoked credential. Do not delete
the directory to repair an ordinary startup error: deletion creates new keys
and a new installation.

Snapshots are synchronous local files. Measure write latency and storage size
under your intended session population before raising capacity. This feature
provides restart continuity, not a distributed session database.
