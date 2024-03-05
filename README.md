# caddy-auth-docs

Documentation for Caddy v2 Auth Portal and Authorize Plugins.

Documentation Website: https://docs.authcrunch.com/

<!-- begin-markdown-toc -->
## Table of Contents

* [Local Testing](#local-testing)
* [Deployment](#deployment)

<!-- end-markdown-toc -->

## Local Testing

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
