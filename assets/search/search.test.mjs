import assert from 'node:assert/strict';
import {test} from 'node:test';
import {extractSearchContent} from './extract.mjs';
import {highlightSearchText, prepareSearchIndex, searchExcerpt, searchPages, validSearchPage} from '../../src/search/engine.mjs';

const page = (title, text = '', headings = '') => ({path: '/docs/example', title, text, headings, description: 'A guide.', category: 'Documentation'});
test('rank exact titles over body matches, require every word, and match prefixes and accents', () => {
  const index = prepareSearchIndex([page('Cookie domain'), page('Other', 'Cookie domain configuration'), page('Café review', 'Résumé evidence'), page('Mail integration')]);
  assert.equal(searchPages(index, 'cookie domain')[0].page.title, 'Cookie domain');
  assert.equal(searchPages(index, 'CAFÉ resume')[0].page.title, 'Café review');
  assert.equal(searchPages(index, 'cookie dom').length, 2);
  assert.equal(searchPages(index, 'cookie absent').length, 0);
  assert.equal(searchPages(index, 'ai').length, 0);
  assert.equal(searchPages(index, '…[]').length, 0);
});
test('body-only matches have readable excerpts, and highlighting preserves literal text', () => {
  const document = page('Incident', `${'General context. '.repeat(50)}Unusual rollback dependency needs review.`);
  assert.equal(searchPages(prepareSearchIndex([document]), 'rollback dependency').length, 1);
  const excerpt = searchExcerpt(document, 'rollback');
  assert.ok(excerpt.startsWith('…'));assert.match(excerpt, /rollback dependency/);assert.ok(excerpt.length <= 212);
  const text = '<script>Café & AI</script>';
  const parts = highlightSearchText(text, 'cafe [AI]+');
  assert.deepEqual(parts.filter(part => part.match).map(part => part.text), ['Café', 'AI']);
  assert.equal(parts.map(part => part.text).join(''), text);
});
test('extract prose, inline words, code and headings without executing MDX or indexing chrome', () => {
  const source = `---\ntitle: Metadata noise\n---\nimport config from '@site/assets/conf/demo/Caddyfile?raw';
\n# Share<span>Point</span> &amp; AI\n\nEvidence\n\n<nav>Navigation noise</nav>\n<script>secretCode()</script>\n<svg><text>Decorative noise</text></svg>\n<p hidden>Hidden noise</p>\n<p aria-hidden="true">Hidden noise</p>\n<div data-search-ignore>Ignore noise</div>\n<span className="sr-only">Accessible noise</span>\n\n\`\`\`text\nallow roles app/member\n\`\`\`\n\n{dangerousExpression()}\n`;
  const content = extractSearchContent(source);
  assert.match(content.headings, /SharePoint & AI/);
  assert.match(content.text, /Evidence/);assert.match(content.text, /allow roles app\/member/);
  assert.doesNotMatch(content.text, /noise|secretCode|dangerousExpression/);
  assert.deepEqual(content.rawImports, ['@site/assets/conf/demo/Caddyfile?raw']);
});
test('diagram descriptions are searchable without Mermaid implementation syntax', () => {
  const content = extractSearchContent('```mermaid\nsequenceDiagram\naccTitle: Identity and policy\naccDescr: A request reaches its allowed application.\nA->>B: noisyImplementation\n```');
  assert.match(content.text, /allowed application/);assert.doesNotMatch(content.text, /sequenceDiagram|noisyImplementation/);
});
test('only same-origin canonical paths and complete records are accepted', () => {
  assert.ok(validSearchPage(page('Local')));
  for (const target of ['javascript:alert(1)', '//evil.example', '/\\evil.example', '/docs/a#x', '/docs/a?q=x']) assert.equal(validSearchPage({...page('Unsafe'), path: target}), false);
  assert.equal(validSearchPage({path: '/docs/only'}), false);
});
