---
name: site-development
description: "Develop the AuthCrunch Docusaurus homepage, React components, navigation configuration, CSS, and Tailwind integration. Use for site presentation changes, distinct from documenting the authentication portal UI."
---

# Site Development

## Site boundaries

Own the documentation site's presentation and navigation configuration. This
React UI is separate from the authentication portal UI described in
`docs/authenticate/55-ui-features.md` and the portal scripts under
`assets/solutions/`. Start with the desired page behavior and existing component
or stylesheet, then change the narrowest owner.

| Surface | Source |
| --- | --- |
| Homepage composition and hero | [src/pages/index.tsx](../../../src/pages/index.tsx) |
| Feature cards and Heroicons | [HomepageFeatures](../../../src/components/HomepageFeatures/index.tsx) |
| Global Infima colors, typography, Tailwind imports | [custom.css](../../../src/css/custom.css) |
| PostCSS integration | [tailwind plugin](../../../src/plugins/tailwind-config.ts) |
| Additional Tailwind configuration | [tailwind.config.ts](../../../tailwind.config.ts) |
| Site metadata, navbar/footer, search, themes, plugins | [docusaurus.config.ts](../../../docusaurus.config.ts) |
| Published images, fonts, domain and verification files | [static](../../../static/) |

## Component and build behavior

Use the existing Docusaurus `Layout`, `Link`, `Heading`, and site context
patterns. Keep internal navigation compatible with the configured base URL and
document IDs. Site configuration runs in Node; avoid browser APIs or JSX there.
Components must also survive server rendering during `npm run build`, so guard
browser-only behavior or move it into the appropriate client lifecycle.

Content sidebar ordering is generated from documents and category metadata in
`sidebars.ts`; navbar `docId` entries must match those documents. Site config
currently uses `https://docs.authcrunch.com`, `/`, and `trailingSlash: false`.
Treat route changes as public URL changes and review inbound links.

Check whether a CSS module is actually imported and its classes used before
editing it. The current homepage mostly uses inline Tailwind class names; the
adjacent `.module.css` files are not a reliable map of rendered styles.

## Styling contract

The PostCSS plugin registers `@tailwindcss/postcss`. `custom.css` imports
Tailwind theme and utilities, attempts to contain preflight beneath `#tw-scope`,
and maps `dark:` to Docusaurus's `[data-theme="dark"]` attribute. The homepage
hero and feature section use `tw-scope` wrappers. Preserve the intent to keep
Tailwind resets from disrupting Infima documentation pages; inspect generated
CSS and rendered pages when changing the import or selector structure.

Use existing `--ifm-*` tokens for colors and typography and check both themes.
There is no explicit `@config` declaration in the current CSS. Do not assume
editing `tailwind.config.ts` alone changes the compiled output; verify that the
configuration or new utility is actually consumed by the installed toolchain.

Keep responsive reading order, heading hierarchy, accessible link text, and
focus behavior. Follow the existing Heroicons system for ordinary UI icons.
Static assets are served from the site root; assets imported by components can
be bundled. Preserve domain and site-verification files during asset cleanup.

## Verification and acceptance

Run `npm run typecheck` and `npm run build` for TypeScript, configuration, or
component changes. For CSS-only work, build and inspect affected pages; run
typecheck as well if typed files changed. The build does not run `tsc` as a
separate CI gate. Command details and failure triage are in
[site-operations](../site-operations/SKILL.md).

Preview with `npm run dev` (port 4200, host `0.0.0.0`) or serve a completed build with
`npm run serve -- --port 4200`. Check the homepage and a representative docs
page in light/dark themes and narrow/wide layouts. If browser inspection is
unavailable, state that limit instead of claiming visual verification.

- A hero or feature-card change renders during the production build and keeps
  navigation and reading order usable at mobile widths.
- A new Tailwind utility appears in compiled CSS and changes the intended
  element; neighboring documentation typography remains readable.
- A navbar change resolves its doc ID, and footer links and search still use
  the intended site paths.
- Client interaction does not cause a server-rendering failure or hydration
  mismatch, and keyboard users can reach actionable controls.
