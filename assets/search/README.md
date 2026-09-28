# DocSearch maintenance

The public search client in `assets/search/client.json` is imported by
`docusaurus.config.ts` and the verification script. Its search-only
key reads the `authp` index in application `S074F3F45X`. Crawler configuration and
index settings live separately in the Algolia dashboard. A site build does not
update that hosted index.

`docsearch.crawler.js` is the maintained extraction configuration for
`https://docs.authcrunch.com`. It follows the
[Docusaurus template](https://docsearch.algolia.com/docs/templates/#docusaurus-v2-and-later-template),
with topic grouping, aliases, code/table content, and explicit exclusions.
The placeholder API key must be replaced **in the dashboard only** with the
existing private crawler key. The site's public search key cannot write records.

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
   `docsearch.crawler.js`. Keep the index name `authp`; remove obsolete
   `authp.github.io` start URLs, sitemaps, discovery patterns, and actions.
4. For the **existing** index, update its Searchable Attributes and Facets in the
   dashboard as well: `initialIndexSettings` only applies when an index is first
   created. Preserve any additional required attributes. Include `aliases` in
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
7. Run `npm run check:search` and test the search dialog on the deployed site
   (keyboard open, query, result navigation, heading destination, Escape).

Algolia documents the [URL Tester](https://docsearch.algolia.com/docs/templates/#update-a-template)
and [initial index settings](https://www.algolia.com/doc/tools/crawler/apis/configuration/initial-index-settings/).
Local selector checks cannot reproduce the hosted `helpers.docsearch` service;
the URL Tester and completed crawl are required to validate generated records.

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
observed responses. It fails while the index is stale; a passing local build
does not make this check pass.

Queries cover only content that exists. Refresh-token lifecycle, JWKS, and Argon2id
guides remain content gaps; adding an alias is not a substitute for writing them.
