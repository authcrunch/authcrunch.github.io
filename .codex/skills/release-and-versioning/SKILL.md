---
name: release-and-versioning
description: "Prepare or publish AuthCrunch documentation releases aligned with caddy-security, validate version metadata, and recover partial release failures. Preparation does not authorize publication."
---

# Release And Versioning

## Version authority and scope

Own release metadata and the transition from reviewed content to a tagged,
published site. Sources are [Makefile](../../../Makefile),
[the release helper](../../../assets/scripts/release-version.mjs),
[VERSION](../../../VERSION), [package.json](../../../package.json),
[package-lock.json](../../../package-lock.json), and
[deploy.yml](../../../.github/workflows/deploy.yml). Regression coverage is in
[release-version.test.mjs](../../../assets/scripts/tests/release-version.test.mjs).

Documentation releases use caddy-security's highest stable `vX.Y.Z` Git tag at
release invocation. The helper queries `greenpau/caddy-security` over HTTPS and
compares numeric components, excluding prereleases and malformed tags. A trusted
mirror can be selected with `CADDY_SECURITY_REPOSITORY`; tests use local remotes.
Do not substitute the sibling checkout's VERSION, go-authcrunch's version, or an
independent documentation patch counter. An aligned site tag does not establish
that every feature is documented or available in a downloadable runtime bundle;
retain the public guides' implementation and artifact boundaries.

Distinguish preparing a release from publishing it. Metadata synchronization,
checks, builds, and local commits stay within preparation scope. Running
`make release`, pushing tags, or dispatching deployment requires publication
authorization. Existing explicit authorization is sufficient. A future release
workflow change or local validation task does not itself authorize publishing.

## Preparation and checks

- `make sync-release-version` resolves the upstream tag and updates VERSION,
  package version, and both npm lockfile root version fields. It preserves the
  dependency graph and performs no staging, commit, tag, or push.
- `make check-release-version` checks local version metadata without network
  access or writes. `RELEASE_TAG=vX.Y.Z` also verifies the proposed tag.
- `npm run test:release` exercises selection, synchronization, preconditions,
  duplicate guards, and publication/recovery in disposable local Git repositories.
  It requires Node and Git, uses no npm dependencies, and never contacts GitHub.
- `npm run typecheck` and `npm run build` supply relevant site validation.

The release helper uses built-in Node modules; `versioned` is no longer used.
`make info` is read-only. Earlier synchronization does not freeze the next release
version: `make release` resolves it afresh.

## Actual release lifecycle

`make release` performs these steps in order:

1. Requires `main`, a clean staged/unstaged/untracked worktree, one origin push
   URL, tracked metadata files, and parseable npm root metadata. Ignored tmp
   artifacts are allowed.
2. Resolves the latest stable caddy-security tag and checks for that tag locally
   and at origin's actual push URL. Lookup failures or duplicates stop before
   metadata changes; there is no local-version fallback.
3. Synchronizes all version fields. When files change, stages only the three
   metadata files and creates `released vX.Y.Z`. Otherwise it uses the existing
   commit without an empty release commit.
4. Creates the matching annotated tag.
5. Atomically pushes `HEAD:refs/heads/main` and that release tag to origin with
   `push.followTags=false`. Unrelated tags are excluded, including when the user's
   Git configuration enables follow-tags.

Only one documentation release tag exists per caddy-security version. Further
documentation updates under that version can use the existing manual Pages
workflow dispatch after committing changes and obtaining publication scope.
Do not invent suffixes, rewrite tags, or increment the documentation version to
bypass the duplicate guard.

## Publication and failure recovery

A pushed `v*` tag or manual dispatch triggers Pages. After Node setup, CI runs the
offline release tests and checks metadata/tag agreement before installation and
build. It does not compare an old tag with a newer upstream release appearing
after publication. `npm run deploy` remains the generic Docusaurus deployment
command; the configured publication path is the GitHub Pages artifact workflow.
Preserve site URL and CNAME alignment.

On failure, inspect metadata, staging, commit, local tag, remote refs, workflow,
and deployment state. Local writes are not an atomic transaction. A failed atomic
push retains the local commit/tag and prints the exact push retry command. Fix
the failure and retry that push within publication scope; rerunning release would
hit the existing local tag or select a newer upstream version. Do not discard
local state automatically. Tag deletion, rewriting a published release, and
force-pushing require explicit scope.

After authorized publication, verify the intended remote revision/tag and Pages
result. State the last verified transition if access is unavailable. Validate
automation against disposable local remotes; live publication is not a smoke test.

## Acceptance scenarios

- Preparation aligns all four stored version values with the selected upstream
  version without changing dependency versions or publishing.
- Newer upstream stable tags are selected at release time; prereleases are ignored.
- Non-main, detached, dirty, invalid metadata, failed lookup, and existing tag
  conditions fail before release writes.
- A successful release publishes one annotated tag and the intended main revision;
  an atomic push rejection publishes neither ref and preserves retryable local state.
- A tagged deployment with mismatched metadata fails CI; manual deployment checks
  metadata without treating the branch name as a release tag.
