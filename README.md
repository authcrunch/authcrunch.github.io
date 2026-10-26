# caddy-security-docs

Documentation for Caddy v2 Security Plugin.

Documentation Website: https://docs.authcrunch.com/

<!-- begin-markdown-toc -->
## Table of Contents

* [Local Testing](#local-testing)
* [Deployment](#deployment)
* [Miscellaneous](#miscellaneous)

<!-- end-markdown-toc -->

## Local Testing

Use Node.js 24.15 or newer in the 24.x release line and npm 10 or newer.
Install the locked dependencies with `npm ci`.

If necessary, upgrade packages:

```bash
npm run upgrade
```

Check the site's Markdown and MDX files:

```bash
npm run check:mdx
```

This uses the locked checker version and checks `docs/`, `blog/`, and
`src/pages/`. The bare `npx docusaurus-mdx-checker` command ignores `.gitignore`
and also scans downloaded tools and upstream snapshots under `tmp/`, which can
report errors unrelated to the site. Keep those working artifacts out of the
content check rather than editing third-party files to satisfy it.
The npm script's scope does not apply to a separate invocation of the upstream
CLI; adding `tmp/` to `.gitignore` does not change that CLI's scan.

Run a build:

```bash
npm run build
```

The build runs the scoped MDX check before diagram validation and site generation.

Validate the getting-started Caddyfile through real browser login:

```bash
npm run test:first-app -- --binary /path/to/authcrunch
```

Use the AuthCrunch distribution described in the guide. This needs local Chrome,
curl, and free loopback ports 8443 and 5555. Pass `--browser /path/to/chrome` to
select another installed Chromium executable. The runner uses the canonical
Caddyfile, disposable TLS storage, and desktop/mobile browser contexts. It writes
an offline screenshot report under ignored `tmp/first-app-e2e/`, then stops its
runtime and removes its private storage. It does not install a browser or change
the host trust store. Review captures before copying them to public image assets;
`assets/conf/getting-started/screenshots.json` records the published captures.

Run the website locally on port 4200:

```bash
npm run dev
```

Navbar search uses a local full-text index generated with the site. It loads on
first use, keeps queries in the browser, and needs no external search service.
Open it with Cmd/Ctrl+K. Validate it with:

```sh
npm run test:search
npm run build
npm run check:search
```

See [local search maintenance](assets/search/README.md) for indexing rules,
development updates, and browser acceptance checks.

## Deployment

Documentation release versions match caddy-security. From a clean `main` branch,
run:

```bash
make release
```

At invocation, the release resolves the highest stable `vX.Y.Z` Git tag from
`greenpau/caddy-security`. It excludes prereleases and synchronizes `VERSION`,
`package.json`, and both root version fields in `package-lock.json`. It commits
changed metadata, creates the matching annotated tag, and atomically pushes
`main` and that one tag to `origin`, triggering GitHub Pages.

Prepare or inspect the version without publishing:

```bash
make sync-release-version
make check-release-version
npm run test:release
```

Synchronization changes only version metadata. The check is offline and compares
local metadata; pass `RELEASE_TAG=vX.Y.Z` to verify a tag. Release always resolves
the upstream version again, so an earlier synchronization does not freeze it.
The default upstream is `https://github.com/greenpau/caddy-security.git`;
`CADDY_SECURITY_REPOSITORY` can select a trusted mirror for offline work or tests.

Only one documentation release tag can exist for each caddy-security version.
An existing local or remote tag stops the release before any files change. For
additional documentation updates under that version, commit the changes and
use the **Deploy Docusaurus** workflow's manual dispatch. If the atomic push
fails, the script prints the exact retry command and retains the local release
commit/tag; resolve the failure and retry that push rather than rerunning release.

## Miscellaneous 

### Formatting Configs

Reformat `Caddyfile` configs:

```bash
for f in `find ./assets -type f -name 'Caddyfile'`; do ../../greenpau/caddy-security/bin/caddy fmt --overwrite $f; done
```
