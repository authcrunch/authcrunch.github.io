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

Check Markdown files:

```bash
npx docusaurus-mdx-checker
```

Run a build:

```bash
npm run build
```

Run the website locally on port 4200:

```bash
npm run dev
```

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
