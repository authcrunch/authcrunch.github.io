---
name: site-operations
description: "Install, build, preview, and troubleshoot the AuthCrunch documentation site; maintain npm dependencies, local command workflows, and GitHub Pages CI. Routes versioning and publishing requests to the release workflow."
---

# Site Operations

## Reproducible inputs and outputs

Own dependency installation, build diagnostics, local command behavior, and
the Pages workflow. Read [package.json](../../../package.json),
[package-lock.json](../../../package-lock.json),
[Makefile](../../../Makefile), and
[deploy.yml](../../../.github/workflows/deploy.yml) before changing their
contracts. Commands below run from the repository root.

`package.json` requires Node `^22.22.2 || ^24.15.0 || >=26.0.0` and npm 10 or
newer to support the dependency upgrade tool; CI selects Node 24. npm and the
committed lockfile define installation. The stack currently uses Docusaurus 3,
React 19, TypeScript 7, and Tailwind 4/PostCSS; read the manifest for exact versions.
Existing `node_modules/` may predate it. `npm ci` replaces installed dependencies
from the lockfile. Reconcile an install mismatch deliberately rather than
discarding the lockfile as a troubleshooting shortcut.

The existing `future.v4` flag enables Docusaurus Faster, including Rspack.
Keep `@docusaurus/faster` aligned with the core version. TypeScript 7 removes
`baseUrl`; the local `tsconfig.json` overrides the inherited value with `null`
and resolves `@site/*` through an explicit project-relative `paths` mapping.

The manifest overrides `serialize-javascript`, SockJS's `uuid`, and KaTeX used
by the MDX checker's math extension to patched versions until upstream dependency
ranges catch up. Keep UUID on the compatible CommonJS-capable 11.x line for
SockJS. The math extension uses KaTeX's `renderToString` API; verify that path
alongside the MDX check when changing its override. Review these overrides during
upgrades; validate audit results, production builds, and dev startup before
removing them.

The build consumes docs, blog, pages, site configuration, and static assets and
writes `build/` plus generated `.docusaurus/` state. These are ignored artifacts,
not sources to patch or commit. `assets/` examples are not automatically copied
into the public output.

## Command selection

| Task | Command | Meaning and limits |
| --- | --- | --- |
| Install reproducibly | `npm ci` | Uses the committed dependency graph; replaces `node_modules/` |
| Check published MDX sources | `npm run check:mdx` | Checks all Markdown/MDX in `docs/`, `blog/`, and `src/pages/` with the pinned checker; omits scratch and agent files |
| Check typed source | `npm run typecheck` | Runs `tsc`; separate from the site build |
| Test release automation | `npm run test:release` | Offline Node tests with disposable local Git remotes; no installed npm dependencies or publication |
| Validate the first-app browser flow | `npm run test:first-app -- --binary /path/to/authcrunch` | Runs the canonical example through installed Chromium; writes an offline screenshot report under `tmp/` |
| Test local search | `npm run test:search` | Offline extraction, ranking, excerpt, highlighting, and URL validation tests |
| Test announcement expiry | `npm run test:banner` | Offline seven-day dismissal boundaries, invalid timestamps, and first-paint bootstrap behavior; browser interaction remains a separate check |
| Check built search | `npm run check:search` | Validates the generated local index, canonical destinations, exclusions, imported configuration, and representative query rankings |
| Build static output | `npm run build` | Runs the scoped MDX check, verifies diagram assets, then compiles the site and checks configured links |
| Check diagram assets | `npm run diagrams:check` | Verifies authored Mermaid inventory, source assets, and committed SVG hashes without a browser |
| Regenerate diagrams | `npm run diagrams:render` | Uses one local Chrome instance to generate light/dark SVGs; closes it on completion or failure |
| Preview source | `npm run dev` | Starts the development server on port 4200, bound to `0.0.0.0` |
| Preview generated output | `npm run serve -- --port 4200` | Serves an existing `build/` |
| Clear stale generated state | `npm run clear` | Docusaurus cache cleanup; rebuild afterward |

Use [check-mdx.mjs](../../../assets/scripts/check-mdx.mjs), exposed by
`npm run check:mdx`, for the maintained MDX preflight. It uses the locked
`docusaurus-mdx-checker` dependency and explicit site-content globs. The build
invokes the same check, so the Pages build also gates on it. Keep these globs
aligned when adding a content root or versioned documentation.

The upstream bare `npx docusaurus-mdx-checker` CLI does not honor `.gitignore`
and has no CLI include/exclude configuration. Its default repository-wide scan
can report errors in ignored `tmp/` snapshots and nested dependencies. Classify
the reported paths first; run the scoped npm command rather than deleting
working evidence, modifying third-party Markdown, suppressing diagnostics, or
weakening MDX parsing. A malformed file in an included content root must still
fail the check with its source path and location. The checker uses upstream
compatibility transforms and does not load this site's complete plugin/config
pipeline; retain the production build and rendered checks as separate evidence.
Report the exact command validated. A passing `npm run check:mdx` does not make
a separate bare `npx docusaurus-mdx-checker` invocation scoped or successful.

The Makefile's `build`, `clean`, and `test` targets only echo progress (`test`
depends on that no-op `clean`). Plain `make` also runs the read-only `info` target.
None of these is a substitute for the npm build or typecheck. The Node release
helper owns caddy-security-aligned metadata synchronization and publication;
use the routed release workflow for those targets.

`npm run upgrade` executes `ncu --upgrade`, removes `node_modules/`,
`package-lock.json`, `build`, and `coverage`, then installs again. It is a broad
dependency mutation, not a repair or validation command. For dependency work,
make the requested update, review manifest/lockfile changes together, and run
typecheck plus build. Avoid changing unrelated versions.

## Local server lifecycle

The [first-app browser runner](../../../assets/scripts/first-app-e2e.mjs) needs
the selected AuthCrunch binary, installed Chrome (or `--browser` with a Chromium
executable), curl, and free loopback ports 8443 and 5555. It neither builds the
sibling repository nor installs a browser. It starts the unmodified canonical
Caddyfile in disposable storage, verifies its local CA with curl, and accepts
the browser's local trust error without installing that CA. A conflicting port
fails setup and leaves its owner alone. There are no automatic test retries.

Both desktop and mobile run username/password login, session/reload/second-tab
access, logout, incorrect-password rejection, altered-token rejection, and Bob's
default allowed access. The runner records the config/binary hashes, versions,
checks, reviewed cookie attributes without values, and full/focused screenshots.
Its unique output contains an offline HTML report, JSON summary, and runtime log.
A failed or incomplete case fails the run; a screenshot alone is not a pass.
Cleanup stops the owned runtime/browser, removes private TLS storage, and checks
the ports. SIGINT/SIGTERM request cleanup; an uncatchable process kill cannot
guarantee it. Reports stay in `tmp/`; review selected images before publishing
them. This command is separate from the site build and Pages CI.

Before ending a turn, shut down all development, preview, prototype, and
test-fixture servers started or used for this repository, including leftovers
from earlier turns. Perform cleanup on successful and failed validation and
when interrupted work ends. Keep a specific server running only when the user
explicitly requests it.

Track each server's tool session or PID and listening ports when starting or
reusing it. Stop it gracefully with Ctrl+C through its session or SIGTERM to
the identified process, then wait for exit. Verify its ports have no remaining
listeners, for example with `lsof -nP -iTCP:<port> -sTCP:LISTEN`.

For discovered leftovers, confirm their command and working directory belong
to this repository before stopping them. If graceful shutdown leaves workers
or listeners behind, inspect and stop the identified remaining processes.
Target those processes rather than killing every Node/Caddy process or an
unrelated service that happens to occupy a port.

Save screenshots, logs, and reproduction commands in ignored `tmp/` before
cleanup. The final response may link saved artifacts and explain how to restart
a preview; do not advertise a stopped server as a live preview.

## Failure triage and verification

### Memory use during validation

On a workstation under memory pressure, stop heavy checks before starting
another build, browser, or Go test. Run those stages sequentially. Use one
browser instance with a bounded number of pages; close pages, contexts, and
the browser in `finally`, including on failed checks. Save full logs and
results in ignored `tmp/` and return concise summaries to the session.

Check process ownership and memory before attributing pressure to the site.
On macOS, `top -l 1 -n 10 -o mem -stats pid,ppid,command,mem,cmprs,state`
and `sysctl vm.swapusage` expose compressed memory and swap that process RSS
alone can miss. Stop identified repository workers first. A leaking editor
extension host needs its own restart; a Node heap limit on a build does not
bound editor, browser, or native compiler memory. Preserve a resumable audit
checkpoint in `tmp/` before a restart that could disconnect the session.

Read the first substantive error and map it to the responsible input:

- For MDX errors, confirm the path belongs to a site-content root, then check
  fences, unescaped braces/angle brackets, and JSX in the reported page. Re-run
  `npm run check:mdx` and the build after a fix. Errors confined to ignored
  upstream/tool snapshots indicate an incorrectly scoped checker invocation.
  For missing images, resolve the path from that document.
- For navigation errors, compare document IDs, frontmatter, sidebar generation,
  and configured navbar/footer targets. Broken site links throw; broken Markdown
  links warn according to `docusaurus.config.ts`. Do not weaken checks to hide
a bad link.
- For CSS/PostCSS or server-rendering errors, inspect the registered plugin,
  imports, and browser-only component code. Separate a TypeScript diagnostic
  from a successful build; they establish different things.
- For apparent cache or dependency drift, compare the installed versions with
  the lockfile, then use targeted cache cleanup or `npm ci` as appropriate.

Development and production builds share `.docusaurus` generated state. Avoid
building while a dev server is running, or restart that server afterward before
testing it. Mixed state can load production-only analytics lifecycle code into
the dev client without its initialization, causing `window.ga` errors on route
or query changes even when the first page renders correctly.

There is no general npm `test` or lint script. The focused `test:release` script
checks release automation. The deployment workflow does not run typecheck, Caddy
validation, or browser tests. Report checks actually
performed. Skill-only changes use skill validators and route/link checks;
public content needs the scoped MDX check and a site build; typed source or
dependencies need typecheck and build; visible changes also need rendered
inspection when available. An MDX-checker scope/tooling change must demonstrate
both rejection of malformed included content and exclusion of scratch artifacts,
then remove its temporary fixtures before the real site build. Cleanup must
cover synthetic malformed fixtures in both included roots and ignored scratch
directories, using `finally` on success or failure. Preserve logs as evidence;
do not leave deliberately invalid `.md` or `.mdx` probes behind. This cleanup
applies to generated test fixtures, not downloaded upstream/tool evidence.

## Local search

[The local search guide](../../../assets/search/README.md) owns the index,
extractor, ranking, modal, and acceptance workflow. The browser fetches a
same-origin static index only when search opens and keeps queries local. A build
emits a content-hashed JSON asset; deploy the complete build with its matching
client. No API key, external index, crawler, or post-deployment crawl is needed.
The classic preset may retain an optional search dependency in the lockfile;
removing its configuration prevents that theme from entering the client build.

After changes to indexed content, discovery metadata, imported Caddyfiles,
canonical routes, or indexing code, regenerate and validate in this order:

```sh
npm run build
npm run check:search
```

The build regenerates the index automatically. `check:search` reads an existing
build; it neither rebuilds nor compares it with current sources. A passing check
against an older build does not prove freshness. Run `npm run test:search` for
extraction, ranking, or validation changes, plus typecheck for typed source changes.
An optional
`npm run check:search -- --output tmp/search-check.json` saves the local report;
`--build` selects another completed output directory. It checks unique canonical
routes, existing built destinations, aliases/body matches through representative
queries, archive/exclusion boundaries, and the canonical Caddyfile's imported
text. The fixed smoke queries do not cover every changed page: inspect affected
records in the newly emitted `build/assets/search/search-index-*.json` and query
them through the browser or the maintained search engine. Check the intended
title, category, permalink, alias/body matches, and absence of removed/excluded
routes; preserve searchable `listed: false` documents. Extend representative
queries when a lasting search use case or regression warrants it. Neither
`npm run build` nor the current Pages workflow runs `test:search` or `check:search`
automatically; do not describe those separate checks as CI gates.

Development uses the same generated asset. Changes to indexed output change its
content hash and client URL; edits to ignored content need not change that hash.
When changing watchers or index inputs, verify refresh with an actual temporary
source edit, including a raw imported Caddyfile when relevant. Restore exact
source bytes in `finally`, including after failure, then confirm the probe has
disappeared. Reopen search after the development reload; do not patch generated
`.docusaurus` data.
Verify initial lazy loading, cached reopening/client navigation, keyboard/modal
focus, mobile layout, and retry after HTTP or malformed-record failures. Search
must remain independent of external network services. Keep development and
production server lifecycles separate, and stop each preview after validation.

For stale results, trace the expected source/metadata through the freshly built
JSON, the client's referenced asset URL, and the served response. Search caches
its prepared index in memory; reload an existing tab to load a new deployed
client rather than expecting reopening to refresh its old index. Publish the
complete build with matching client and hashed asset, never a separately edited
or copied index. After an authorized deployment, verify the deployed revision
and a fresh page's index request/result before claiming the update is live.

## GitHub Pages pipeline

`deploy.yml` runs on pushed `v*` tags or `workflow_dispatch`, not ordinary branch
pushes or pull requests. Its build job checks out the selected revision, sets up
Node, runs offline release tests, and verifies VERSION/package/lockfile agreement.
A tag ref must also match that version; a branch dispatch checks only metadata.
It then installs with `npm ci`, builds with `GENERATE_SOURCEMAP=false`, and uploads
`build/` using the Pages artifact action. The deploy job depends on that build
and publishes through `actions/deploy-pages` in the `github-pages` environment.

Preserve the Pages/OIDC permissions and the `pages` concurrency group unless
the task changes them intentionally. `cancel-in-progress` is false. The workflow
caches `.docusaurus` and `node_modules/.cache` using the lockfile hash. Local
success does not prove that a workflow ran or that the deployed revision changed.

Use [release-and-versioning](../release-and-versioning/SKILL.md) to prepare a version bump, execute an authorized release or deployment, or diagnose tag/version/publication failures.

## Acceptance scenarios

- A content edit produces a successful build with no new unexplained warnings;
  generated output stays untracked.
- A dependency update keeps the manifest and lockfile coherent and passes the
  typecheck and production build on the intended Node version.
- A failed build is repaired at the content, configuration, or dependency input
  without treating a no-op Make target as passing coverage.
- A workflow change preserves the build-to-artifact-to-deploy dependency and
  tests local build behavior without publishing as a smoke test.
- A preview or fixture check ends with its server processes stopped and ports
  released, including after validation failure or reuse across turns. Unrelated
  services remain running; any user-requested exception identifies the server.
