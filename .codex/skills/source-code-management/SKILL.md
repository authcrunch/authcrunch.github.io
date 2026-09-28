---
name: source-code-management
description: "Create or review AuthCrunch documentation commit messages using repository indicators, required body sections, and timestamped message files. A message request does not create a commit."
---

# Source Code Management

## Commit Message Rules

All commits must have a proper commit message. Inspect the requested diff and
`git status --short`, including staged and unstaged work, before describing it.
Use the user's requested scope; do not include unrelated work merely because it
is present in the checkout. Describe the final behavior and actual validation,
not a transcript or an abandoned implementation. Creating a message does not
stage files, create a commit, tag a release, or publish changes.

A hand-written commit message subject line must conform to the following
rules:

- The first line of each commit message is the subject.
- The subject line MUST be less than 87 characters long.
- The subject line MUST NOT terminate with a period (`.`).
- The subject line MUST start with a change indicator followed by a colon (`:`).

## Change Indicators

Use exactly one indicator followed by a colon; do not combine indicators or
add parenthesized scopes. Describe this documentation site's changed surface,
without implying that a documentation edit implements an upstream runtime feature.

Choose the most specific applicable indicator:

- `skills`: repo-local skills, UI metadata, or `AGENTS.md`; prefer this over
  `docs` for agent-facing instructions.
- `docs`: public documentation, navigation content, or example explanations.
- `api`: documentation of authentication portal, profile, server, or system APIs.
- `authenticate`, `authorize`, `ldap`, `local`, `oauth`, `saml`: documentation
  focused on that product surface; use public names instead of `authn`/`authz`.
- `caddyfile`: runnable configuration examples or their validation tooling.
- `ui`: site layout, React components, theme styles, or visual assets.
- `build`: Docusaurus, TypeScript, PostCSS, or local build behavior.
- `github`: GitHub Actions or repository GitHub metadata.
- `ops`: dependency, toolchain, version, release, or repository maintenance work.
- `tests`: validation or coverage additions whose primary purpose is testing.
- `breakfix`: a reported regression or broken published behavior.
- `fix`: a narrower correctness fix without known published breakage.
- `feat`: a user-facing site capability without a more specific surface label.
- `refactor`: restructuring that preserves observable behavior.
- `security`: vulnerability or security-hardening work.
- `various`: intentionally mixed concerns without an honest specific indicator.

The adopted rules govern new hand-written messages; older repository history
also contains unprefixed subjects. The current Makefile release target generates
`released v<VERSION>` without the hand-written body sections. Do not silently
change that automation to enforce message style. Release mechanics and publishing
scope belong to [release-and-versioning](../release-and-versioning/SKILL.md).

The commit message body must contain the following sections in this order:

1. `Before this commit:`
2. `After this commit:`
3. `Tests:`
4. `More info:`

The body may also contain the following optional sections:

1. `Resolves:`
2. `Partial Resolution:`
3. `See also:`
4. `Links:`

The following rules apply to the body of a commit message:

- Separate sections with one blank line.
- Each section title MUST end with a colon (`:`).
- Lines MUST NOT exceed 87 characters, except in `Links` and `More info`.
- Use `Resolves` ONLY when the PR or commit resolves an issue completely.
- Use `Partial Resolution` when the PR or commit addresses an issue partially.
- Use `See also` for additional related references.
- `Resolves`, `Partial Resolution`, and `See also` MUST contain valid links.
- Multiple links in those reference sections MUST be separated by comma and
  space (`, `).
- `Tests` MUST describe the command or manual check performed.
- If no smoke test was run, `Tests` MUST say `not run` and include the
  reason.
- `More info` MUST summarize the implementation details or notable decisions.

The `Links` section must contain a list of valid links or references, e.g.:

```text
  - Text reference
  - [HTTP link](http://google.com/)
```

Use this template for commit messages:

```text
indicator: concise subject under 87 characters

Before this commit: describe the previous behavior, limitation, or state.

After this commit: describe the new behavior, implementation, or state.

Tests: describe the command or manual check performed.

More info: summarize important implementation details or decisions.
```

For example, a commit message may look like this:

```text
docs: add contributing guidance

Before this commit: the repository had no guidance related to open-source
contributions.

After this commit: contribution guidance is documented in `CONTRIBUTING.md`.

Tests: reviewed the rendered Markdown manually.

More info: added a focused contributor workflow and repository etiquette notes.
```

## Commit Message File Workflow

For every request to create or generate a commit message, write it below
`tmp/commits` with a `YYYYMMDD_HHMM_` prefix and always provide the corresponding
`git commit -F ...` command. Do not require the user to ask separately for a
message file. A review-only request does not create a file unless asked.

Commit message files in `tmp/commits` are working artifacts and should not be
committed unless explicitly requested.

## Acceptance criteria

- The subject has one allowed indicator, is shorter than 87 characters, and has
  no final period. The required body sections appear in order and obey line limits.
- Tests names actual commands or manual checks performed and reports omitted
  smoke tests with their reason. A proposed test is never described as passing.
- A message request produces the timestamped file under `tmp/commits` and its
  `git commit -F` command; a review-only request does not create or commit files.
