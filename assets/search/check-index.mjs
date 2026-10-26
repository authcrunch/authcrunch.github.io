import assert from 'node:assert/strict';
import {readdir, readFile, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {prepareSearchIndex, searchPages, validSearchPage} from '../../src/search/engine.mjs';

const {values} = parseArgs({options: {build: {type: 'string', default: 'build'}, output: {type: 'string'}}});
const root = path.resolve(values.build);
const assets = (await readdir(path.join(root, 'assets/search'))).filter(file => /^search-index-[a-f0-9]{16}\.json$/.test(file));
assert.equal(assets.length, 1, 'Build must contain exactly one current search index; run npm run build.');
const pages = JSON.parse(await readFile(path.join(root, 'assets/search', assets[0]), 'utf8'));
assert.ok(Array.isArray(pages) && pages.length > 0 && pages.every(validSearchPage));
assert.equal(new Set(pages.map(page => page.path)).size, pages.length);
for (const page of pages) {
  const route = decodeURIComponent(page.path).replace(/^\/|\/$/g, '');
  const candidates = [path.join(root, route, 'index.html'), path.join(root, route + '.html')];
  assert.ok((await Promise.all(candidates.map(file => stat(file).then(value => value.isFile()).catch(() => false)))).some(Boolean), `Missing canonical result: ${page.path}`);
  assert.ok(page.title && page.category, `Missing result metadata: ${page.path}`);
  assert.ok(!/\/(?:tags|authors)\//.test(page.path) && !['/404', '/docs/guides'].includes(page.path), `Duplicate/excluded route: ${page.path}`);
}
const firstApp = pages.find(page => page.path === '/docs/start/first-app');
assert.match(firstApp.text, /AUTHTEST_SESSION_ID/, 'Index the imported canonical configuration.');
assert.ok(pages.some(page => page.category === 'Blog'));
const index = prepareSearchIndex(pages);
const cases = [
  ['getting started', ['/docs/intro', '/docs/start/first-app']],
  ['reverse proxy', ['/docs/start/next-steps', '/docs/authenticate/usage-examples', '/docs/authorize/headers']],
  ['GitHub organization', ['/docs/authenticate/oauth/backend-oauth2-0007-github']],
  ['Azure AD', ['/docs/authenticate/oauth/backend-oauth2-0006-microsoft', '/docs/authenticate/saml/azure']],
  ['passkey', ['/docs/authenticate/authentication-challenges']],
  ['cookie domain', ['/docs/authenticate/auth-cookie']],
  ['RSA', ['/docs/authorize/token-verification']],
  ['403', ['/docs/start/verify-access', '/docs/troubleshoot']],
  ['OIDC provider', ['/docs/intro', '/docs/authenticate/oauth/oauth2', '/docs/apps/oidc-provider']],
  ['Caddyfile', ['/docs/start/first-app', '/docs/authorize/syntax', '/docs/reference']],
  ['restart', ['/docs/troubleshoot', '/docs/start/next-steps']],
  ['AUTHTEST_SESSION_ID', ['/docs/start/first-app']],
];
const queries = cases.map(([query, expected]) => {
  const paths = searchPages(index, query).slice(0, 5).map(result => result.page.path);
  return {query, paths, passed: paths.some(result => expected.includes(result))};
});
const report = {index: assets[0], pages: pages.length, bytes: (await stat(path.join(root, 'assets/search', assets[0]))).size, queries};
if (values.output) await writeFile(values.output, JSON.stringify(report, null, 2) + '\n');
console.log(`Checked ${pages.length} canonical pages in ${assets[0]}`);
for (const query of queries) console.log(`${query.passed ? 'PASS' : 'FAIL'} ${query.query}: ${query.paths.join(', ')}`);
assert.ok(queries.every(query => query.passed), 'Search relevance checks failed.');
