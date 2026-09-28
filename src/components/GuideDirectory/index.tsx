import type {ReactNode} from 'react';
import {useId} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {usePluginData} from '@docusaurus/useGlobalData';
import {useHistory, useLocation} from '@docusaurus/router';
import {filterGuides, kinds, kindLabel, topics, type Catalog} from '@site/src/discovery/catalog';
import styles from './styles.module.css';

/** A server-rendered directory enhanced with shareable, browser-local filters. */
export default function GuideDirectory(): ReactNode {
  const {guides} = usePluginData('authcrunch-discovery') as Catalog;
  const location = useLocation();
  const history = useHistory();
  const isBrowser = useIsBrowser();
  const id = useId();
  // Static HTML always contains every link, including when JavaScript is disabled.
  const params = new URLSearchParams(isBrowser ? location.search : '');
  const query = params.get('q') ?? '';
  const topic = topics.find(item => item.id === params.get('topic'))?.id ?? '';
  const kind = kinds.find(item => item.id === params.get('kind'))?.id ?? '';
  const matches = filterGuides(guides, query, topic, kind);
  const filtered = Boolean(query || topic || kind);

  function changeFilter(key: string, value: string, replace = false) {
    const next = new URLSearchParams(location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    const search = next.toString();
    history[replace ? 'replace' : 'push']({pathname: location.pathname, search: search ? `?${search}` : '', hash: ''});
  }

  function clearFilters() {
    const next = new URLSearchParams(location.search);
    ['q', 'topic', 'kind'].forEach(key => next.delete(key));
    history.push({pathname: location.pathname, search: next.toString() ? `?${next}` : '', hash: ''});
  }

  return <div className={styles.directory}>
    <fieldset className={styles.filters} disabled={!isBrowser}>
      <legend className={styles.legend}>Find a guide</legend>
      <div className={styles.fields}>
        <div className={styles.query}>
          <label htmlFor={`${id}-query`}>Filter guides</label>
          <input id={`${id}-query`} type="search" autoComplete="off" value={query}
            placeholder="Try Azure AD, cookies, or 403"
            aria-describedby={`${id}-hint`}
            onChange={event => changeFilter('q', event.target.value, true)} />
        </div>
        <div className={styles.kind}>
          <label htmlFor={`${id}-kind`}>Document type</label>
          <select id={`${id}-kind`} value={kind} onChange={event => changeFilter('kind', event.target.value)}>
            <option value="">All types</option>
            {kinds.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
      </div>
      <p id={`${id}-hint`} className={styles.hint}>Filter titles, summaries, and aliases. Use Search in the navigation bar to search page contents.</p>
      <div className={styles.topics} role="group" aria-label="Filter by topic">
        <button type="button" aria-pressed={!topic} onClick={() => changeFilter('topic', '')}>All topics</button>
        {topics.map(item => <button key={item.id} type="button" aria-pressed={topic === item.id}
          onClick={() => changeFilter('topic', item.id)}>{item.label}</button>)}
      </div>
      <div className={styles.status}>
        <span role="status" aria-live="polite" aria-atomic="true">{matches.length} of {guides.length} guides</span>
        <button type="button" className={styles.clear} disabled={!filtered} onClick={clearFilters}>Clear filters</button>
      </div>
    </fieldset>
    <noscript><p>All guides are listed below. Enable JavaScript to filter this directory.</p></noscript>
    {matches.length === 0 && <div className={styles.empty}>
      <Heading as="h2">No matching guides</Heading>
      <p>Try fewer words, a different document type, or another topic. Search in the navigation bar can also find text within a page.</p>
      <button type="button" className="button button--secondary button--outline" onClick={clearFilters}>Show all guides</button>
    </div>}
    {topics.map(item => {
      const entries = matches.filter(guide => guide.topic === item.id);
      if (!entries.length) return null;
      return <section key={item.id} aria-labelledby={item.id} className={styles.section}>
        <Heading as="h2" id={item.id}>{item.label}</Heading>
        <p className={styles.topicDescription}>{item.description}</p>
        <ul className={styles.list}>
          {entries.map(guide => <li key={guide.id} className={styles.entry}>
            <div className={styles.entryHeading}>
              <Link to={guide.permalink}>{guide.title}</Link>
              <span className={styles.badge}>{kindLabel(guide.kind)}</span>
            </div>
            <p>{guide.description}</p>
          </li>)}
        </ul>
      </section>;
    })}
  </div>;
}
