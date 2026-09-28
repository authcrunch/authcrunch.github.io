import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import OriginalMetadata from '@theme-original/DocItem/Metadata';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {topicLabel, kindLabel, type DiscoveryMetadata} from '@site/src/discovery/catalog';

/** Server-rendered metadata consumed by the DocSearch crawler. */
export default function DocItemMetadata(): ReactNode {
  const {frontMatter, metadata} = useDoc();
  const discovery = (frontMatter as typeof frontMatter & {discovery?: DiscoveryMetadata}).discovery;
  const excluded = !discovery || 'exclude' in discovery || frontMatter.draft || metadata.unlisted;
  const searchable = !excluded && discovery && !('exclude' in discovery) ? discovery : undefined;
  return <>
    <OriginalMetadata />
    <Head>
      <meta name="docsearch:exclude" content={String(excluded)} />
      {searchable && <meta name="docsearch:topic" content={searchable.topic} />}
      {searchable && <meta name="docsearch:topic_label" content={topicLabel(searchable.topic)} />}
      {searchable && <meta name="docsearch:kind" content={kindLabel(searchable.kind)} />}
      {searchable && <meta name="docsearch:aliases" content={(searchable.aliases ?? []).join(', ')} />}
    </Head>
  </>;
}
