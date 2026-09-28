import {readFile, writeFile} from 'node:fs/promises';
import {parseArgs} from 'node:util';

// Read-only acceptance checks against the same client used by the site.
const client = JSON.parse(await readFile(new URL('./client.json', import.meta.url), 'utf8'));
const {values} = parseArgs({options: {output: {type: 'string'}}});
const origin = 'https://docs.authcrunch.com';
const cases = [
  {query: 'getting started', paths: ['/docs/intro', '/docs/start/first-app']},
  {query: 'reverse proxy', paths: ['/docs/start/next-steps', '/docs/authenticate/usage-examples', '/docs/authorize/headers']},
  {query: 'GitHub organization', paths: ['/docs/authenticate/oauth/backend-oauth2-0007-github']},
  {query: 'Azure AD', paths: ['/docs/authenticate/oauth/backend-oauth2-0006-microsoft', '/docs/authenticate/saml/azure']},
  {query: 'passkey', paths: ['/docs/authenticate/authentication-challenges']},
  {query: 'cookie domain', paths: ['/docs/authenticate/auth-cookie']},
  {query: 'RSA', paths: ['/docs/authorize/token-verification']},
  {query: '403', paths: ['/docs/start/verify-access', '/docs/troubleshoot']},
  {query: 'OIDC provider', paths: ['/docs/intro', '/docs/authenticate/oauth/oauth2']},
  {query: 'Caddyfile', paths: ['/docs/start/first-app', '/docs/authorize/syntax', '/docs/reference']},
  {query: 'restart', paths: ['/docs/troubleshoot', '/docs/start/next-steps']},
];
const excluded = new Set([
  '/docs/guides', '/docs/apps/intro', '/docs/authenticate/auth-portal',
  '/docs/authenticate/refresh-token', '/docs/authenticate/api/profile-api',
  '/docs/authenticate/oauth/backend-oauth2-0004-auth0',
  '/docs/authenticate/oauth/backend-oauth2-0005-onelogin', '/docs/authenticate/x509',
]);
const facetFilters = ['language:en', ['docusaurus_tag:docs-default-current', 'docusaurus_tag:default']];
const requests = cases.map(({query}) => ({indexName: client.indexName, params: {
  query, hitsPerPage: 30, facetFilters,
  attributesToRetrieve: ['url', 'hierarchy', 'topic', 'kind'],
}}));
// An unfiltered sample also catches stale domains and placeholders hidden by
// contextual search. Large indices require a dashboard audit beyond this sample.
requests.push({indexName: client.indexName, params: {
  query: '', hitsPerPage: 1000, distinct: false,
  attributesToRetrieve: ['url', 'hierarchy', 'topic', 'kind'],
  facets: ['language', 'docusaurus_tag', 'topic', 'kind'],
}});

const failures = [];
let report;
try {
  const response = await fetch(`https://${client.appId.toLowerCase()}-dsn.algolia.net/1/indexes/*/queries`, {
    method: 'POST',
    headers: {'content-type': 'application/json', 'x-algolia-application-id': client.appId, 'x-algolia-api-key': client.apiKey},
    body: JSON.stringify({requests: requests.map(request => ({
      ...request,
      params: new URLSearchParams(Object.entries(request.params).map(([key, value]) => [
        key, typeof value === 'string' ? value : JSON.stringify(value),
      ])).toString(),
    }))}),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Algolia returned HTTP ${response.status}: ${await response.text()}`);
  const {results} = await response.json();
  if (!Array.isArray(results) || results.length !== requests.length) throw new Error('Unexpected Algolia batch response.');
  const queries = cases.map((test, i) => {
    const result = results[i];
    if (result.error) failures.push(`${test.query}: ${result.error}`);
    const paths = [...new Set((result.hits ?? []).map(hit => new URL(hit.url).pathname.replace(/\/$/, '')))];
    const passed = paths.slice(0, 5).some(path => test.paths.includes(path));
    if (!passed) failures.push(`${test.query}: expected destination missing from the first five distinct pages.`);
    return {...test, passed, pages: paths.slice(0, 5), hits: result.hits ?? []};
  });
  const sample = results.at(-1);
  if (sample.error) failures.push(`Index sample: ${sample.error}`);
  const badUrls = new Set();
  const missingMetadata = new Set();
  for (const hit of results.flatMap(result => result.hits ?? [])) {
    const url = new URL(hit.url);
    if (url.origin !== origin || excluded.has(url.pathname.replace(/\/$/, ''))) badUrls.add(hit.url);
    if (url.pathname.startsWith('/docs/') && (!hit.hierarchy?.lvl1 || !hit.topic || !hit.kind)) missingMetadata.add(hit.url);
  }
  if (badUrls.size) failures.push(`${badUrls.size} obsolete-domain or excluded URLs in returned records.`);
  if (missingMetadata.size) failures.push(`${missingMetadata.size} document URLs lack title, topic, or kind metadata.`);
  for (const [facet, value] of [['language', 'en'], ['docusaurus_tag', 'docs-default-current'], ['topic', 'authorization'], ['kind', 'Tutorial']]) {
    if (!sample.facets?.[facet]?.[value]) failures.push(`Missing expected facet: ${facet}:${value}`);
  }
  report = {checkedAt: new Date().toISOString(), index: client.indexName, queries, sample: {
    returned: sample.hits?.length ?? 0, total: sample.nbHits, facets: sample.facets,
    badUrls: [...badUrls], missingMetadata: [...missingMetadata],
  }, failures};
} catch (error) {
  failures.push(error.message);
  report = {checkedAt: new Date().toISOString(), failures};
}
if (values.output) await writeFile(values.output, JSON.stringify(report, null, 2) + '\n');
for (const query of report.queries ?? []) console.log(`${query.passed ? 'PASS' : 'FAIL'} ${query.query}`);
for (const failure of failures) console.error(failure);
if (report.sample) console.log(`Inspected ${report.sample.returned} unfiltered records of ${report.sample.total}. Review the full crawl in Algolia.`);
console.log(failures.length ? 'Hosted search is not ready.' : 'Hosted search acceptance checks passed.');
process.exitCode = failures.length ? 1 : 0;
