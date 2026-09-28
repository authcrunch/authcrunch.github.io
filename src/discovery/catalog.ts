/** Shared vocabulary for document metadata, the directory, and search facets. */
export const topics = [
  {id: 'identity-providers', label: 'Identity providers', description: 'Connect local users, directories, and external identity providers.'},
  {id: 'login-and-mfa', label: 'Login and MFA', description: 'Configure the portal, authentication challenges, and account enrollment.'},
  {id: 'sessions-and-cookies', label: 'Sessions and cookies', description: 'Understand tokens, browser cookies, redirects, and logout.'},
  {id: 'authorization', label: 'Authorization', description: 'Decide who may access each application and pass identity to it.'},
  {id: 'applications-and-sso', label: 'Applications and SSO', description: 'Integrate applications with AuthCrunch and identity protocols.'},
  {id: 'operations', label: 'Operations', description: 'Install, manage credentials and messaging, and diagnose your setup.'},
] as const;

export const kinds = [
  {id: 'tutorial', label: 'Tutorial'},
  {id: 'guide', label: 'Guide'},
  {id: 'concept', label: 'Concept'},
  {id: 'reference', label: 'Reference'},
  {id: 'troubleshooting', label: 'Troubleshooting'},
] as const;

export type TopicId = typeof topics[number]['id'];
export type KindId = typeof kinds[number]['id'];
export type DiscoveryMetadata = {exclude: true} | {
  topic: TopicId;
  kind: KindId;
  aliases?: string[];
  listed?: boolean;
};
export type Guide = {
  id: string;
  title: string;
  description: string;
  permalink: string;
  topic: TopicId;
  kind: KindId;
  aliases: string[];
};
export type Catalog = {guides: Guide[]};

export function topicLabel(id: TopicId): string {
  return topics.find(topic => topic.id === id)!.label;
}

export function kindLabel(id: KindId): string {
  return kinds.find(kind => kind.id === id)!.label;
}

/** Match all typed words; technical names and aliases are included verbatim. */
export function filterGuides(guides: Guide[], query: string, topic = '', kind = ''): Guide[] {
  const terms = query.toLocaleLowerCase('en').trim().split(/\s+/).filter(Boolean);
  return guides.filter(guide => {
    if (topic && guide.topic !== topic) return false;
    if (kind && guide.kind !== kind) return false;
    const text = [guide.title, guide.description, ...guide.aliases].join(' ').toLocaleLowerCase('en');
    return terms.every(term => text.includes(term));
  });
}
