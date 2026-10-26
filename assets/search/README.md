# Local documentation search

The navbar search runs in the browser. Opening it downloads a static JSON index
from the same site, then caches the prepared index in memory. Queries are never
sent to a search service. No API key, crawler, external index, or account is
needed. The classic preset may still install its optional search theme as a
transitive package; it is not configured or included in this site's client.

The implementation adapts RapidKnot's `src/search.ts`,
`src/components/app/SiteSearch.tsx`, and `scripts/site_search.mjs`: a static
canonical-route index, lazy loading, weighted browser ranking, literal
highlighting, context excerpts, keyboard navigation, pagination, and retry.
Docusaurus supplies its own routes and MDX sources; the modal uses native
`dialog` focus containment and theme-aware CSS rather than RapidKnot's UI library.

## Index ownership

- `src/plugins/local-search.ts` reads the current documentation, blog posts, and
  Markdown pages from Docusaurus's loaded content. It uses their resolved
  permalinks, without guessing routes from filenames or crawling generated caches.
- `assets/search/extract.mjs` parses authored MDX without running its JavaScript.
  It indexes headings, prose, code, image alternatives, and diagram descriptions.
  Imports, expressions, scripts, navigation, hidden text, and search-ignored
  subtrees are omitted. Raw canonical Caddyfile imports contribute their actual
  configuration text. Inline markup preserves words such as `Share<span>Point</span>`.
- Document `discovery.aliases` contribute to heading-weight matches and its
  `topic` supplies the result category. `listed: false` remains searchable.
  Draft, unlisted, and `discovery: {exclude: true}` documents are omitted.
  Blog archives, tags, author lists, and the not-found page are not indexed.
  The React homepage contributes its site title and tagline.
- `src/search/engine.mjs` normalizes case/accents, requires every query term,
  matches word prefixes of at least two characters, and ranks titles above
  headings/aliases, descriptions, and body matches. Highlights are rendered as
  text and `mark` elements, never injected HTML.
- `src/theme/SearchBar/` owns the trigger and dialog. Cmd/Ctrl+K opens it;
  Arrow keys move between the field and results; Enter opens a result; Escape
  closes and restores focus. The dialog fits phones and uses native focus
  containment. Failed requests and invalid records can be retried. Without
  JavaScript, the navbar offers the guide directory.

The build emits `build/assets/search/search-index-<content-hash>.json`. The
client contains only its URL until search opens. Deploy the complete build so
the application and its index stay in sync. New content changes the hash.

`npm run dev` uses the same emitted asset and extractor. Changes to documentation,
blog/Markdown pages, or canonical Caddyfiles invalidate the index; reopen search
after the development reload. There is no separately maintained public JSON file
and no hosted crawl after deployment. `data-search-ignore` on a JSX element
excludes its subtree from search without removing it from the page.

## Validation

```sh
npm run test:search
npm run typecheck
npm run build
npm run check:search
```

`test:search` checks extraction, ranking, prefixes, all-term matching, excerpts,
literal highlighting, and record/path validation using Node's test runner.
`check:search` validates the completed local build: unique canonical pages,
existing result destinations, imported configuration, representative queries,
and archive/exclusion boundaries. It does not contact an external service.
An optional `-- --output tmp/search-check.json` saves its report; `--build` selects
another completed build directory. Run it again after a content change and build.

For UI changes, preview the production build and check both themes and mobile:
no index request before opening, one cached request across reopening/navigation,
search input focus, Cmd/Ctrl+K, single-press Escape with a nonempty query/focus
restoration, Tab/Shift+Tab wrapping, arrow
navigation, Enter/result navigation, highlighted excerpts, no matches, more
results, and recovery after HTTP failure or invalid JSON records. Verify queries
use no external search requests. Check development content invalidation when
changing the index plugin.
