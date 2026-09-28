---
sidebar_position: 5
description: "Continue to the first-app walkthrough to connect a portal to a role-based authorization policy."
discovery:
  topic: authorization
  kind: tutorial
  listed: false
---

# Getting Started

Start with [Protect your first app](../start/first-app.md). The walkthrough
connects a portal to an authorization policy and runs the policy before a
protected response. One demo user has the required role and the other does not.

Then [verify access](../start/verify-access.md): an unauthenticated request should
redirect to login, Alice should reach the app, and Bob should receive `403`.

For an existing deployment, go to [authorization guides](../guides.md#authorization)
or the [policy syntax reference](syntax.md). Keep authentication and authorization
separate: identifying a user does not establish that they may access every route.
