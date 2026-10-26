import {createHash} from 'node:crypto';
import {glob, readFile} from 'node:fs/promises';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {LoadedContent as DocsContent} from '@docusaurus/plugin-content-docs';
import type {BlogContent} from '@docusaurus/plugin-content-blog';
import type {LoadedContent as PagesContent} from '@docusaurus/plugin-content-pages';
import {extractSearchContent} from '../../assets/search/extract.mjs';
import {topicLabel, type DiscoveryMetadata} from '../discovery/catalog';
import type {SearchPage} from '../search/engine.mjs';

/** The same canonical index is emitted as a lazy asset in production and dev. */
export default function localSearch({siteDir, siteConfig}: LoadContext): Plugin<string> {
  const patterns = ['docs/**/*.{md,mdx}', 'blog/**/*.{md,mdx}', 'src/pages/**/*.{md,mdx}', 'assets/conf/**/Caddyfile'];
  const resolveSource = (source: string) => path.resolve(siteDir, source.replace(/^@site\//, ''));
  return {
    name: 'authcrunch-local-search',
    getPathsToWatch: () => patterns.map(pattern => path.join(siteDir, pattern)),
    async loadContent() {
      const files = [];
      for await (const file of glob(patterns, {cwd: siteDir})) files.push(file);
      const hash = createHash('sha256');
      for (const file of files.sort()) hash.update(file).update(await readFile(path.join(siteDir, file)));
      return hash.digest('hex');
    },
    async allContentLoaded({allContent, actions}) {
      const docs = allContent['docusaurus-plugin-content-docs']?.default as DocsContent | undefined;
      const blog = allContent['docusaurus-plugin-content-blog']?.default as BlogContent | undefined;
      const pages = allContent['docusaurus-plugin-content-pages']?.default as PagesContent | undefined;
      const current = docs?.loadedVersions.find(version => version.versionName === 'current');
      if (!current) throw new Error('Local search requires current documentation.');
      const index: SearchPage[] = [];
      const addPage = async (source: string, page: Omit<SearchPage, 'text' | 'headings'>, aliases: string[] = []) => {
        const content = extractSearchContent(await readFile(resolveSource(source), 'utf8'));
        const imported = [];
        for (const specifier of content.rawImports) {
          const raw = specifier.replace(/\?raw$/, '');
          const resolved = raw.startsWith('@site/') ? resolveSource(raw) : path.resolve(path.dirname(resolveSource(source)), raw);
          if (!resolved.startsWith(siteDir + path.sep)) throw new Error(`Search import outside site: ${specifier}`);
          imported.push(await readFile(resolved, 'utf8'));
        }
        index.push({...page, headings: [content.headings, ...aliases].join(' '), text: [content.text, ...imported].join(' ')});
      };
      for (const doc of current.docs) {
        const meta = doc.frontMatter.discovery as DiscoveryMetadata | undefined;
        if (doc.draft || doc.unlisted || !meta || 'exclude' in meta) continue;
        await addPage(doc.source, {path: doc.permalink, title: doc.title, description: doc.description, category: topicLabel(meta.topic)}, meta.aliases);
      }
      for (const post of blog?.blogPosts ?? []) {
        const meta = post.metadata;
        if (meta.unlisted || meta.frontMatter.draft) continue;
        await addPage(meta.source, {path: meta.permalink, title: meta.title, description: meta.description, category: 'Blog'});
      }
      for (const page of pages ?? []) {
        if (page.type !== 'mdx' || page.unlisted || page.frontMatter.draft) continue;
        await addPage(page.source, {path: page.permalink, title: page.title ?? 'About these docs', description: page.description ?? '', category: 'Website'});
      }
      index.push({path: siteConfig.baseUrl, title: siteConfig.title, description: siteConfig.tagline, category: 'Website', headings: '', text: ''});
      index.sort((a, b) => a.path.localeCompare(b.path, 'en'));
      if (new Set(index.map(page => page.path)).size !== index.length) throw new Error('Duplicate local search route.');
      const json = JSON.stringify(index);
      const hash = createHash('sha256').update(json).digest('hex').slice(0, 16);
      await actions.createData(`search-index-${hash}.json`, json);
      await actions.createData('index-url.js', `export {default} from './search-index-${hash}.json?url';\n`);
    },
    configureWebpack(_config, isServer) {
      return {module: {rules: [{test: /search-index-[a-f0-9]{16}\.json$/, resourceQuery: /^\?url$/, type: 'asset/resource', generator: {filename: 'assets/search/[name][ext]', emit: !isServer}}]}};
    },
  };
}
