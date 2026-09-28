# AuthCrunch documentation repository

This repository publishes `https://docs.authcrunch.com/` using Docusaurus,
React, and TypeScript. It contains public documentation in `docs/`, articles in
`blog/`, site components and styling in `src/`, published assets in `static/`,
and Caddy configuration examples in `assets/`.

## Working scope

Keep changes in this repository. Sibling repositories such as
`../../greenpau/caddy-security` and `../../greenpau/go-authcrunch` can provide
read-only implementation evidence; reading or porting their skills does not
authorize editing them. This site does not implement the authentication runtime.

Keep public documentation in `docs/` and `blog/`; store agent workflows in
`.codex/skills/`. Do not edit generated `build/`, `.docusaurus/`, or
`node_modules/` as source. Use ignored `tmp/` for working artifacts.

Use the npm scripts in `package.json` for site work. `make build` and `make test`
are placeholders; `make release` commits, tags, and pushes changes that trigger
publication. A local validation task does not authorize publication.

Update affected skill guidance when a change alters the workflow or behavior it
describes. Keep instructions grounded in the current files and actual validation.

## Repo-local skills

- Use [skill-authoring](.codex/skills/skill-authoring/SKILL.md) to create, port, revise, or audit repo-local skills and their task routes.
- Use [source-code-management](.codex/skills/source-code-management/SKILL.md) to create or review commit messages and timestamped message files.
- Use [documentation](.codex/skills/documentation/SKILL.md) to maintain public docs, API and provider guidance, blog posts, navigation content, and Caddy configuration examples.
- Use [site-development](.codex/skills/site-development/SKILL.md) to change the documentation site's React components, layout, styling, or navigation configuration.
- Use [site-operations](.codex/skills/site-operations/SKILL.md) to install, build, preview, troubleshoot, or update site tooling and CI, and to prepare or perform releases and deployments.
