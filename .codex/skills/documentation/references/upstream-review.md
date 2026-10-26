# Reviewing upstream changes

Read this when bringing public documentation up to date with AuthCrunch changes.
Use `docs/operations/versions.md` as the last reviewed product baseline and Git
history to identify the last content update. Website package/VERSION metadata is
the site's release version, not proof of the examples' runtime dependencies.

## Inspect three repositories

| Repository | Evidence to retain |
| --- | --- |
| `greenpau/go-authcrunch` | Released runtime tag/commit, implementation and tests, API contracts, feature/config parsers |
| `greenpau/caddy-security` | Integration tag/commit, `go.mod` library pin, adapter grammar, companion registration and host tests |
| `authcrunch/authcrunch` | Distribution tag/commit, `go.mod`, `main.go` imports, Dockerfile, release archives and checksums |

Use GitHub's API/release records to verify tags and assets; rendered release pages
can be cached. For example, fetch `https://api.github.com/repos/OWNER/REPO/releases`
and `/commits/main`, saving dated receipts under ignored `tmp/`. Retain full commit
IDs, release publication times and asset names. Check a moving main branch
separately from a released revision. A tag or dependency update alone does not
establish a downloadable binary's contents.

Sibling checkouts are read-only implementation evidence. Inspect `git status`,
revision and `go.mod` replacements before relying on them. Use `git log`,
`git diff OLD..NEW` and `git show TAG:path` without fetching, switching, building
or modifying sibling state. When a checkout is absent/stale, use remote files or
a disposable snapshot inside this repository's ignored `tmp/`.

Read upstream root/scoped AGENTS.md and the topic's owning skills to find the
implementation/tests. Those skills describe the producer's workflow; they do
not authorize editing or running maintenance in that repository. Public guides
belong here. Verify disputed claims in the selected production code and tests.

## Build a change-to-document map

Compare commits from the last reviewed runtime and integration versions, not
just commits after the website's last timestamp. Include a dependency's complete
version jump and distribution packaging changes. Classify each material item:

- user-visible configuration, defaults, protocol or API behavior;
- operational fixes, lifecycle, storage, revocation or recovery;
- optional module selection and executable/container differences;
- internal tests/CI/maintenance with no changed user instructions;
- incomplete or unsupported behavior that must remain qualified.

Map each item to existing pages and canonical examples before creating a new
guide. Preserve published URLs and screenshots. Update discovery metadata and
topic/reference entrances so new behavior is findable. Existing examples can
retain an older, explicit test baseline if the provider integration was not
retested; do not relabel every old snippet as validated on a new release.

Keep library capability, Caddy grammar, compiled modules and observed runtime
behavior separate. In particular, compare core caddy-security imports with
distribution imports before saying an optional plugin is bundled. Distinguish
root state, pending upstream OAuth, refresh families, account identities, signup
queues and downstream OIDC state; storage sharing in one category does not
establish sharing in another.

## Validate and report

Download the intended executable to `tmp/`, compare its archive SHA-256 with the
same release's checksum file, and record `version`, `security version` and
`list-modules --versions`. Adapt changed snippets using synthetic values. Only
provision/run them after reviewing filesystem/network effects; use disposable
identities, keys and storage. Follow configuration-examples and site-operations
for runtime verification and server cleanup.

Run `npm run check:mdx` and the site build, review warnings, and obtain routes
from the build's resolved document metadata/catalog. Do not derive published URLs
by stripping numeric filename prefixes. Check changed anchors, learning-prompt
copy blocks and representative desktop/mobile light/dark renders. Keep historical
test baselines and unperformed live-provider/distributed acceptance explicit.

Use the scoped MDX check so downloaded upstream Markdown, release READMEs and
tools in `tmp/` do not enter the site-content inventory. Preserve those source
receipts; they are evidence, not public MDX to repair or remove.

Write a Markdown report under `tmp/` with one row for **every changed or added
public URL**: source file, concrete behavior corrected/added, version and relevant
upstream evidence. Include reviewed commits, release/assets, configuration and
runtime check results, site checks and remaining validation limits. Agent skill
changes and generated diagram/download assets belong in a separate report
section, rather than being mistaken for public page URLs. Record unchanged
unsupported features and internal-only upstream changes as audit dispositions.
This report and the updated version reference provide the next review baseline.
Do not publish, tag, or change site release metadata as part of content validation.
