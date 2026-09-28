---
name: release-and-versioning
description: "Prepare or perform AuthCrunch documentation version bumps and GitHub Pages releases, and diagnose partial release failures. Covers the versioned tool, Makefile commit/tag/push behavior, and publication boundaries."
---

# Release And Versioning

## Release scope and prerequisites

Own version metadata and the transition from reviewed content to a tagged,
published site. Source authority is [Makefile](../../../Makefile),
[VERSION](../../../VERSION), [package.json](../../../package.json), and
[deploy.yml](../../../.github/workflows/deploy.yml). The versions here identify
the documentation site, not a Caddy or go-authcrunch runtime release.

Distinguish preparing a release from publishing it. Build, inspect metadata,
and prepare requested changes within the user's scope; push tags or dispatch
deployment only when publication is authorized. Existing explicit authorization
is sufficient and does not require repeated confirmation. A request for a
commit message or local verification alone does not authorize release actions.

Check the current branch, staged/unstaged changes, untracked files, target
version, local tags, configured remote, and the `versioned` executable. The
Makefile expects `main` and a clean tracked diff. Release preparation should
include the relevant site build/typecheck evidence before any publication.

## Actual Makefile lifecycle

`make release` currently performs these operations in order:

1. Runs `versioned --sync package.json` before checking branch or cleanliness.
2. Rejects a branch other than `main` and a tracked diff against `HEAD`.
3. Runs `versioned -patch` and synchronizes `package.json` again.
4. Stages `VERSION` and `package.json`, then commits with `released v<VERSION>`.
5. Creates annotated tag `v<VERSION>` with the same version as its message.
6. Runs `git push`, then `git push --tags`.
7. Prints tag deletion commands as recovery hints; it does not execute them.

This is not a build target, dry run, or atomic transaction. The initial sync can
change files even if a later precondition fails. `git diff-index` does not reject
untracked files. `git push --tags` can publish unrelated local tags, and `git push`
uses the configured upstream/default behavior. Inspect these effects before
running the target. Do not execute its printed deletion commands automatically.

The target does not synchronize or stage `package-lock.json`; its root version
metadata can therefore lag `VERSION` and `package.json`. Compare all three when
handling version work. If lockfile synchronization is in scope, perform it
deliberately and review the dependency graph for unintended changes. Do not
claim the existing target maintains lockfile metadata automatically.

Hand-written commit conventions are defined by
[source-code-management](../source-code-management/SKILL.md). The automated
release subject is an existing exception, not evidence that all messages may
omit the adopted format.

## Publication and failure recovery

A pushed `v*` tag triggers the Pages pipeline; a manual workflow dispatch also
publishes the selected revision. `npm run deploy` invokes the generic
Docusaurus deploy command, but this repository's configured publication path
is the GitHub Pages artifact workflow. Do not substitute one path for the other
without reviewing its behavior and the requested scope.

Preserve alignment of the configured site URL, root
[CNAME](../../../CNAME), and [static/CNAME](../../../static/CNAME) when changing
the custom domain. `static/CNAME` is part of the built output.

If a release fails, inspect which state transitions already happened: version
change, staged files, commit, local tag, remote commit/tag, workflow run, or Pages
deployment. Do not rerun the whole target blindly; another run may bump again
or conflict with an existing tag. Recover from the observed state within the
authorized scope. Tag deletion, rewriting a published release, or force-pushing
requires its own explicit scope, not an assumption from the printed hints.

After authorized publication, verify the intended remote tag/revision and Pages
workflow result. If remote access or credentials are unavailable, identify the
last verified state without claiming deployment success. Automation changes can
be exercised in a disposable repository with a local bare remote and controlled
version-tool inputs; do not test them against the live publication remote.

## Acceptance scenarios

- A preparation-only request yields reviewed metadata and validation evidence,
  with the publication step still pending.
- An authorized release uses the intended version and revision, avoids exposing
  unrelated local tags, and has a confirmed deployment result or explicit limit.
- A non-main or dirty checkout is caught before invoking a target whose first
  step mutates metadata; failures do not silently discard user changes.
- A push failure after local commit/tag creation is recovered from that state
  without accidentally creating another patch release.
