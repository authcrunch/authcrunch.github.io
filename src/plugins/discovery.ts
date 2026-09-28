import type {Plugin} from '@docusaurus/types';
import type {LoadedContent} from '@docusaurus/plugin-content-docs';
import {topics, kinds, type Guide} from '../discovery/catalog';

/** Derive the directory from Docusaurus's current documents and resolved URLs. */
export default function discovery(): Plugin {
  return {
    name: 'authcrunch-discovery',
    async allContentLoaded({allContent, actions}) {
      const docs = allContent['docusaurus-plugin-content-docs']?.default as LoadedContent | undefined;
      if (!docs) throw new Error('Discovery requires the default docs plugin.');
      const current = docs.loadedVersions.find(version => version.versionName === 'current');
      if (!current) throw new Error('Discovery requires current documentation.');
      const guides: Guide[] = [];
      for (const doc of current.docs) {
        if (doc.draft || doc.unlisted) continue;
        const value = doc.frontMatter.discovery;
        const fail = (message: string): never => {throw new Error(`${doc.source}: ${message}`);};
        if (!value || typeof value !== 'object' || Array.isArray(value)) fail('add discovery metadata or an explicit exclusion.');
        const meta = value as Record<string, unknown>;
        if (meta.exclude === true) {
          if (Object.keys(meta).length !== 1) fail('an excluded document should only set discovery.exclude: true.');
          continue;
        }
        const allowed = new Set(['topic', 'kind', 'aliases', 'listed']);
        if (Object.keys(meta).some(key => !allowed.has(key))) fail('unknown discovery field (use topic, kind, aliases, listed, or exclude: true).');
        if (!topics.some(topic => topic.id === meta.topic)) fail('invalid discovery.topic.');
        if (!kinds.some(kind => kind.id === meta.kind)) fail('invalid discovery.kind.');
        if (meta.listed !== undefined && typeof meta.listed !== 'boolean') fail('discovery.listed must be boolean.');
        if (meta.aliases !== undefined && (!Array.isArray(meta.aliases) || meta.aliases.some(alias => typeof alias !== 'string' || !alias.trim()))) fail('discovery.aliases must be nonempty strings.');
        if (typeof doc.frontMatter.description !== 'string' || !doc.frontMatter.description.trim()) fail('add an explicit description for discovery.');
        if (meta.listed === false) continue;
        guides.push({
          id: doc.id,
          title: doc.title,
          description: doc.description,
          permalink: doc.permalink,
          topic: meta.topic as Guide['topic'],
          kind: meta.kind as Guide['kind'],
          aliases: (meta.aliases ?? []) as string[],
        });
      }
      guides.sort((a, b) => a.title.localeCompare(b.title, 'en'));
      actions.setGlobalData({guides});
    },
  };
}
