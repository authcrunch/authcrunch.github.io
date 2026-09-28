# DocSearch maintenance

The public search client in `assets/search/client.json` is imported by
`docusaurus.config.ts` and the verification script. Its search-only
key reads the `authp` index in application `S074F3F45X`. Crawler configuration and
index settings live separately in the Algolia dashboard. A site build does not
update that hosted index.

`docsearch.crawler.js` is the maintained extraction configuration for
`https://docs.authcrunch.com`, targeting a new `authcrunch-docs` index. It follows the
[Docusaurus template](https://docsearch.algolia.com/docs/templates/#docusaurus-v2-and-later-template),
with topic grouping, aliases, code/table content, and explicit exclusions.
The placeholder API key must be replaced **in the dashboard only** with the
private crawler key. The site's public search key cannot write records.
If a private key has been exposed, revoke or rotate it in Algolia; never paste
its replacement into chat or repository files.

The crawler's display name does not set the index name. An `indexPrefix` is
prepended to each action's `indexName`: prefix `authcrunch` plus name
`authcrunch-docs` produces `authcrunchauthcrunch-docs`. The maintained configuration
sets an empty prefix so the target is exactly `authcrunch-docs`.
It preserves the supplied monthly schedule and 30% record-loss safety check,
and raises the initial 100-URL limit to Algolia's default of 1,000 URLs.
See [indexPrefix](https://www.algolia.com/doc/tools/crawler/apis/configuration/index-prefix/)
and [maxUrls](https://www.algolia.com/doc/tools/crawler/apis/configuration/max-urls/).

## Apply a crawler change

1. Save a copy of the existing dashboard configuration and index settings outside
   the repository. Retain the crawler's private credentials, schedule, and any
   account-specific settings. Review the maintained configuration against those
   settings; it cannot reconstruct settings that exist only in the dashboard.
2. Deploy the site revision containing the metadata and verify its HTML. A
   searchable document such as `/docs/start/first-app` must contain
   `docsearch:exclude=false`, a topic, aliases, and Docusaurus's language/version
   tags. Merge alone does not deploy this repository.
3. Update the crawler's URLs, extraction action, and index settings from
   `docsearch.crawler.js`. Confirm an empty Index Prefix and target name
   `authcrunch-docs`; remove obsolete `authp.github.io` URLs and actions. Keep
   the site's existing `authp` index available while preparing the new one.
4. `initialIndexSettings` applies when `authcrunch-docs` is first created.
   If that index already exists, update its Searchable Attributes and Facets
   in the dashboard as well. Preserve any additional required attributes.
   Include `aliases` in
   searchable attributes and keep `language`, `version`, and `docusaurus_tag`
   as facets so Docusaurus contextual search continues to work. Topic and kind
   facets are prepared for index inspection; the website's directory filters
   operate locally and do not depend on those facets.
5. Use the crawler's URL Tester on the first-app tutorial, Microsoft OAuth guide,
   token-verification reference, a blog article, and the refresh-token placeholder.
   Inspect generated records: current-domain URLs, working heading anchors,
   topic grouping, aliases, and complete directive text. The placeholder and
   `/docs/guides` should emit no records. Blog archives should emit no records.
6. Save and run a complete crawl. Inspect errors and record changes before
   accepting an index replacement. In particular, exclusions must remove old
   placeholder hits and obsolete-domain records must not remain. Do not delete
   the index to test the configuration.
7. Run `npm run check:search -- --index authcrunch-docs` before switching the
   website. This reads the new index without changing the live client.
8. Once the index passes, update `client.json` to use `authcrunch-docs`, build,
   and deploy that client change. Run `npm run check:search` and test the search
   dialog (keyboard open, query, result navigation, heading destination, Escape).

Algolia documents the [URL Tester](https://docsearch.algolia.com/docs/templates/#update-a-template)
and [initial index settings](https://www.algolia.com/doc/tools/crawler/apis/configuration/initial-index-settings/).
Local selector checks cannot reproduce the hosted `helpers.docsearch` service;
the URL Tester and completed crawl are required to validate generated records.

Do not delete the default crawler as part of an index migration. If it was
already deleted, ask Algolia to confirm or restore its DocSearch program
association; a replacement's successful test crawl does not establish that
association. See [Algolia's crawler guidance](https://docsearch.algolia.com/docs/crawler/#can-i-delete-my-crawler).

## Document metadata

Every current document must have `discovery` frontmatter. The build validates it
and creates the guide directory using Docusaurus's resolved URLs.

```yaml
description: Configure the domain and browser attributes of authentication cookies.
discovery:
  topic: sessions-and-cookies
  kind: reference
  aliases: [cookie domain, SameSite, subdomain]
```

The accepted topics and kinds are defined in `src/discovery/catalog.ts`. Use
`listed: false` for a useful page that should remain searchable but not appear in
the directory. Use `discovery: {exclude: true}` for unfinished placeholders or
duplicate directories. Drafts and unlisted documents are excluded automatically.
These flags do not remove a published URL or promise access control.

The metadata wrapper emits `docsearch:*` tags into static HTML. DocSearch
[extracts these tags into records](https://docsearch.algolia.com/docs/record-extractor/).
Aliases describe names readers use for existing content; they must not imply
coverage that the page does not have. Classification is not runtime validation
of an older configuration example.

## Read-only hosted verification

`npm run check:search` queries the hosted index with the public client key and
checks expected destinations, current-domain URLs, facets, and excluded routes
in returned records (including an unfiltered sample of up to 1,000 records).
It performs no writes. An optional `-- --output tmp/search-check.json` saves the
observed responses. To inspect another index before changing the client, use
`npm run check:search -- --index authcrunch-docs --output tmp/search-check.json`.
The report identifies the queried index. Checks fail if the index is missing or
stale; a passing local build does not make this check pass.

Queries cover only content that exists. Refresh-token lifecycle, JWKS, and Argon2id
guides remain content gaps; adding an alias is not a substitute for writing them.
