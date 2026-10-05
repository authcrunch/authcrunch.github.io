---
title: About these docs
description: How to use the AuthCrunch learning path, topic directory and versioned references.
---

<div className="markdown">

# About these docs

AuthCrunch adds authentication and authorization to Caddy. These docs explain
how to connect identity sources, issue and validate credentials, and protect
application requests with an explicit policy.

Start with the [learning path](/docs/intro) to install a verified bundle, run a
local portal, and test allowed and denied access. If you already have a working
setup, use [Guides by topic](/docs/guides) or the
[configuration reference](/docs/reference). The [troubleshooting guide](/docs/troubleshoot)
starts from a failing request and its expected result.

## Read version and verification boundaries

The Caddy integration and the standalone AuthCrunch library have separate
versions. Check the [availability reference](/docs/operations/versions) and the
version printed by your actual executable before adopting a directive.
A newer source checkout alone does not update an installed binary.

A parser check establishes accepted grammar; a local fixture tests the stated
runtime boundary. Live identity-provider, mail, directory and cloud settings
still need verification in your environment. Guides distinguish these checks
rather than treating a successful documentation build as a successful login.

## Use the visual references

Current portal captures sit alongside retained historical screenshots. Captions
explain older console labels and obsolete values. Follow the current written
steps and canonical configuration, and open a screenshot at full size when a
field is hard to read. Historical images preserve useful context without
establishing support for an old configuration.

## Report a correction

Use the **Edit this page** link on a guide or open an
[issue in the documentation repository](https://github.com/authcrunch/authcrunch.github.io/issues).
Include the page URL, your integration/library versions and a minimal reproduction
with credentials removed. For runtime behavior, use the
[Caddy Security issue tracker](https://github.com/greenpau/caddy-security/issues).

<span id="markdown-page-example" />

</div>
