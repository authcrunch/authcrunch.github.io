---
sidebar_position: 3
---

# Architecture

With Caddy v2 modules (aka plugins), there is a shift in how one builds a plugin.
If a plugin is being used in multiple parts of a configuration, e.g. in different
routes, each part of the configuration initializes (provisions and validates) a
new instance of the plugin.

For example, this authorization plugin may be used to protect multiple routes.
It means that each of the routes will get its own instance of the plugin.

**How does configuration in one part affects other parts?**

* By default, a single instance of a plugin inherits "default" context.
* All instances of the plugin in an authorization context (e.g. "default"
  authorization context) inherit settings from the **primary** instance in
  the authorization context.
* There is only one **primary** instance in an authorization context.
* A plugin MUST have a **primary** instance in an authorization context.
* If an instance is not a **primary** instance, and a particular configuration
  property is not being set, then the instance inherits the property from the
  **primary** instance.

**What happens when a plugin does not have access list**

* If an instance of a plugin does not have an access list, it inherits the
  configuration from the **primary** instance in its authorization context.
* If a **primary** instance does not have an access list, the instances plugin
  fails.
