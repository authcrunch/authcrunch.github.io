---
sidebar_position: 2
title: "Authorization overview"
description: "Overview of authorization policies, token checks, request identity, and access rules."
discovery:
  topic: authorization
  kind: concept
  aliases: ["authorize"]
---

# Authorization overview

The Authorization Plugin for Caddy v2 **authorizes** users and
grants access to resources upon the discovery of valid JWT or PASETO
authentication tokens.

The features of the plugin are:

* Token discovery
* IP address filtering
* Auto-redirection to auth portal
* Optional Javascript redirects
* Access Lists and Role-Based Access Control (RBAC)
* Path-Based ACLs
* Pass token data via HTTP Request Headers to downstream apps
* Stripping of token data when passing requests to downstream apps
* Authorization bypass for specific URIs
