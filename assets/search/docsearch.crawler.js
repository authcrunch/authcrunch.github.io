// Algolia dashboard configuration. This is not loaded by the website.
// Set the private API key in the dashboard only. See README.md for migration.
// The site's public client stays on its existing index until this one is ready.
new Crawler({
  appId: 'S074F3F45X',
  apiKey: 'SET_PRIVATE_CRAWLER_KEY_IN_DASHBOARD',
  indexPrefix: '',
  rateLimit: 8,
  maxDepth: 10,
  maxUrls: 1000,
  schedule: 'on the 14 day of the month',
  startUrls: ['https://docs.authcrunch.com/'],
  sitemaps: ['https://docs.authcrunch.com/sitemap.xml'],
  renderJavaScript: false,
  ignoreCanonicalTo: false,
  discoveryPatterns: ['https://docs.authcrunch.com/**'],
  actions: [{
    indexName: 'authcrunch-docs',
    pathsToMatch: ['https://docs.authcrunch.com/docs/**', 'https://docs.authcrunch.com/blog/**'],
    recordExtractor: ({$, helpers}) => {
      const isDoc = $('.theme-doc-markdown').length > 0;
      const excluded = $('meta[name="docsearch:exclude"]').attr('content');
      if (isDoc && excluded !== 'true' && excluded !== 'false') {
        throw new Error('Deploy the document discovery metadata before crawling this site.');
      }
      if (excluded === 'true') return [];
      // Blog archives, tags, and author listings must not duplicate article hits.
      if ($('article h1').length !== 1) return [];
      $('.hash-link, article button, article .pagination-nav').remove();
      const topic = $('meta[name="docsearch:topic_label"]').attr('content');
      return helpers.docsearch({
        recordProps: {
          lvl0: {selectors: '', defaultValue: topic || 'Articles'},
          lvl1: 'article h1',
          lvl2: 'article .markdown h2',
          lvl3: 'article .markdown h3',
          lvl4: 'article .markdown h4',
          lvl5: 'article .markdown h5',
          lvl6: 'article .markdown h6',
          // Include directive names and tables, without indexing copy buttons,
          // navigation, or individual syntax-highlighting spans as separate hits.
          content: 'article .markdown p, article .markdown li:not(:has(p)):not(:has(li)), article .markdown pre, article .markdown tr',
        },
        indexHeadings: true,
        aggregateContent: true,
        recordVersion: 'v3',
      });
    },
  }],
  safetyChecks: {beforeIndexPublishing: {maxLostRecordsPercentage: 30}},
  // These settings initialize NEW indices. Apply the corresponding settings
  // explicitly if the target index already exists, as described in README.md.
  initialIndexSettings: {
    'authcrunch-docs': {
      attributesForFaceting: ['type', 'lang', 'language', 'version', 'docusaurus_tag', 'topic', 'kind'],
      attributesToRetrieve: ['hierarchy', 'content', 'anchor', 'url', 'url_without_anchor', 'type', 'topic', 'kind'],
      attributesToHighlight: ['hierarchy', 'content'],
      attributesToSnippet: ['content:10'],
      camelCaseAttributes: ['hierarchy', 'content', 'aliases'],
      searchableAttributes: [
        'unordered(hierarchy.lvl1)',
        'unordered(hierarchy.lvl2)',
        'unordered(hierarchy.lvl3)',
        'unordered(hierarchy.lvl4)',
        'unordered(hierarchy.lvl5)',
        'unordered(hierarchy.lvl6)',
        'unordered(aliases)',
        'content',
        'unordered(hierarchy.lvl0)',
      ],
      distinct: true,
      attributeForDistinct: 'url',
      customRanking: ['desc(weight.pageRank)', 'desc(weight.level)', 'asc(weight.position)'],
      ranking: ['words', 'filters', 'typo', 'attribute', 'proximity', 'exact', 'custom'],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: '</span>',
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: 'none',
      separatorsToIndex: '_',
    },
  },
});
