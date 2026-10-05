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

The manifest overrides `serialize-javascript` and SockJS's `uuid` to patched
versions until upstream dependency ranges catch up. Keep UUID on the compatible
CommonJS-capable 11.x line for SockJS. Review these overrides during upgrades;
validate audit results, production builds, and dev startup before removing them.

The build consumes docs, blog, pages, site configuration, and static assets and
writes `build/` plus generated `.docusaurus/` state. These are ignored artifacts,
not sources to patch or commit. `assets/` examples are not automatically copied
into the public output.

## Command selection

| Task | Command | Meaning and limits |
| --- | --- | --- |
| Install reproducibly | `npm ci` | Uses the committed dependency graph; replaces `node_modules/` |
| Check typed source | `npm run typecheck` | Runs `tsc`; separate from the site build |
| Test release automation | `npm run test:release` | Offline Node tests with disposable local Git remotes; no installed npm dependencies or publication |
| Check hosted search | `npm run check:search` | Read-only Algolia queries; fails on stale destinations, missing metadata/facets, or failed relevance checks |
| Build static output | `npm run build` | Compiles MDX and site code and checks configured links |
| Check diagram assets | `npm run diagrams:check` | Verifies authored Mermaid inventory, source assets, and committed SVG hashes without a browser |
| Regenerate diagrams | `npm run diagrams:render` | Uses one local Chrome instance to generate light/dark SVGs; closes it on completion or failure |
| Preview source | `npm run dev` | Starts the development server on port 4200, bound to `0.0.0.0` |
| Preview generated output | `npm run serve -- --port 4200` | Serves an existing `build/` |
| Clear stale generated state | `npm run clear` | Docusaurus cache cleanup; rebuild afterward |

The README also suggests `npx docusaurus-mdx-checker`, but it is not a declared
dependency or npm script. It may fetch a tool; the production build is the
repository's installed MDX check. Use an additional checker only when it helps
diagnose a specific issue, and distinguish it from committed CI coverage.

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

- For MDX errors, check fences, unescaped braces/angle brackets, and JSX in
  the reported page. For missing images, resolve the path from that document.
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
public content needs a site build; typed source or dependencies need typecheck
and build; visible changes also need rendered inspection when available.

## Hosted search

The site and `check:search` script share the public search client in
[client.json](../../../assets/search/client.json). It contains a search-only key,
not the private crawler credential. The maintained
[crawler configuration and procedure](../../../assets/search/README.md) own
extraction, current-domain URLs, document exclusions, and existing-index settings.
Private crawler credentials stay in Algolia; do not put them in the repository.
Keep the dashboard template's first line `new Crawler({`, without leading
comments or Markdown fences. The editor has reported a JSON parsing error when
the JavaScript template began with `//` comments. Node syntax checks alone do
not establish dashboard compatibility; verify the pasted configuration in the
Editor and URL Tester.
The crawler's display name, its index prefix, and its action's index name are
separate values. The prefix is concatenated with the action name. Confirm the
actual index returned by Algolia before changing the site's client. During a
migration, `npm run check:search -- --index <name>` checks a candidate index with
the public key while leaving the configured client unchanged. Missing indices
fail the check. Switch the client only after the candidate's results pass.
Preserve the maintainer's crawl schedule and publishing safety checks when
adapting configuration. Do not replace the default crawler to rename an index;
if it has already been deleted, follow Algolia's DocSearch recovery guidance.

A successful build does not refresh Algolia. Deploy the metadata-bearing site,
test its generated records in the crawler's URL Tester, then run a full crawl
and check its results. `initialIndexSettings` does not update an existing index;
maintainers must apply the corresponding searchable attributes and facets there.
Preserve Docusaurus language/version/tag facets when changing search settings.
Missing discovery tags indicate a site/crawler deployment mismatch; do not
remove that guard to crawl old output. Publication still follows the release
workflow and requires authorization.

`npm run check:search -- --output tmp/search-check.json` saves observed query
results and an unfiltered sample of up to 1,000 records. It verifies the first
five distinct destinations for representative queries and detects obsolete
URLs and missing title/topic/type metadata in returned records. A larger index
also needs review in the dashboard. The script cannot prove the hosted extractor
works, all URLs are clean, or an authentication configuration is valid. Keep
missing-content queries distinct from indexing failures.

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
