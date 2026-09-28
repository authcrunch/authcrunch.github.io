# AuthCrunch documentation skill authoring supplement

## Scope and ownership

Locate the installed `$skill-creator` through the active skill catalog. Keep
ported guidance and its supporting resources in this repository; sibling
repositories are read-only evidence, with no inherited build-workspace exception.

This is a Docusaurus documentation site. Public guidance belongs in `docs/`,
`blog/`, and relevant example READMEs under `assets/`. Agent workflows belong
in `.codex/skills/`. Keep `AGENTS.md` to orientation, shared rules, and broad
task routes; keep human onboarding in `README.md`.

Do not import caddy-security's Go build commands, runtime ownership, prohibition
on public Markdown, sibling write exceptions, or skill links that do not exist
here. Preserve useful contracts while adapting paths, validation, and terminology.

Choose a cohesive owner for content, configuration examples, site presentation,
site operations, or release work. Keep specialized routes in the broad skill
that can decide when they apply. Extend an existing owner before adding a skill
for an individual provider or document.

## Ground guidance in source

Check site behavior against `package.json`, `docusaurus.config.ts`,
`sidebars.ts`, `src/`, and `.github/workflows/deploy.yml`. Check local command
side effects against `Makefile` and `assets/scripts/validate_config.sh`.
Installed dependencies and generated output can be stale; the committed
manifest, lockfile, and workflow define reproducible inputs.

For Caddyfile and authentication claims, inspect the relevant version of the
caddy-security parser and go-authcrunch consumer when available. A sibling
checkout can be newer than a published example. Record any relevant version
limit and distinguish parser acceptance, provisioning, and a successful login.
Do not present a documentation build as authentication runtime validation.

New examples should use a descriptive portal name such as `myportal` and keep
the corresponding `authenticate with myportal` reference consistent. Use
placeholders for secrets and label demo-only settings explicitly.

## Metadata and validation

Quote UI metadata strings. Keep short descriptions between 25 and 64 characters
and include the exact `$skill-name` in each default prompt. Preserve existing
invocation policy and dependencies when editing metadata. The
[hierarchy contract](hierarchy-contract.md) owns local frontmatter and routing
requirements.

For skill-only changes, run the installed skill-creator validator for each
changed skill, parse UI metadata, check relative links and source paths, traverse
routes from `AGENTS.md`, and run `git diff --check`. A site build or Caddy runtime
test is unnecessary unless a specific behavioral claim needs verification.

Walk representative tasks through the routes and compare instructions with the
actual command implementations. Check for unreachable skills, cycles, vague
actions, stale commands, unsupported coverage claims, and accidental publishing.
Validate release automation changes in disposable repositories with local
remotes; publishing the live site is not a validation step.
