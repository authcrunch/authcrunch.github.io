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
npx docusaurus start --port 4200 --host 0.0.0.0
```

## Deployment

Run build to create search index:

```bash
npm run build
```

Deploy to `gh-pages` branch:

```bash
GIT_USER=greenpau DEPLOYMENT_BRANCH=gh-pages USE_SSH=true npm run deploy
```

## Miscellaneous 

Reformat `Caddyfile` configs:

```bash
for f in `find ./assets -type f -name 'Caddyfile'`; do ../../greenpau/caddy-security/bin/caddy fmt --overwrite $f; done
```
