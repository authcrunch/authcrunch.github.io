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

Run the following command to deploy the changes:

```bash
make release
```

## Miscellaneous 

### Formatting Configs

Reformat `Caddyfile` configs:

```bash
for f in `find ./assets -type f -name 'Caddyfile'`; do ../../greenpau/caddy-security/bin/caddy fmt --overwrite $f; done
```
