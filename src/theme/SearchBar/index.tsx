import {Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {ArrowRightIcon, MagnifyingGlassIcon, XMarkIcon} from '@heroicons/react/24/outline';
import indexUrl from '@generated/authcrunch-local-search/default/index-url';
import {highlightSearchText, normalizeSearchText, prepareSearchIndex, searchExcerpt, searchPages, validSearchPage, type SearchPage} from '@site/src/search/engine.mjs';
import styles from './styles.module.css';

type SearchIndex = ReturnType<typeof prepareSearchIndex>;
let cached: {url: string; request: Promise<SearchIndex>} | undefined;

function loadIndex(): Promise<SearchIndex> {
  if (!cached || cached.url !== indexUrl) {
    const request = fetch(indexUrl, {signal: AbortSignal.timeout(15000)}).then(async response => {
      if (!response.ok) throw new Error('Search index could not load');
      const pages: SearchPage[] = await response.json();
      if (!Array.isArray(pages) || pages.some(page => !validSearchPage(page)) || new Set(pages.map(page => page.path)).size !== pages.length) throw new Error('Invalid search index');
      return prepareSearchIndex(pages);
    }).catch(error => {if (cached?.request === request) cached = undefined; throw error;});
    cached = {url: indexUrl, request};
  }
  return cached.request;
}

function Highlight({text, query}: {text: string; query: string}): ReactNode {
  return <>{highlightSearchText(text, query).map((part, i) => part.match ? <mark key={i}>{part.text}</mark> : <Fragment key={i}>{part.text}</Fragment>)}</>;
}

function SearchDialog({onClose}: {onClose: () => void}): ReactNode {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchIndex>();
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [limit, setLimit] = useState(10);
  const hasQuery = normalizeSearchText(query).length >= 2;
  const results = useMemo(() => index && hasQuery ? searchPages(index, query) : [], [index, query, hasQuery]);

  useEffect(() => {
    const modal = dialog.current!;
    const returnTo = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    modal.showModal();
    input.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      modal.close();
      document.body.style.overflow = overflow;
      if (returnTo?.isConnected) returnTo.focus({preventScroll: true});
    };
  }, []);

  useEffect(() => {
    let active = true;
    loadIndex().then(value => {if (active) setIndex(value);}).catch(() => {if (active) setFailed(true);});
    return () => {active = false;};
  }, [retry]);

  const updateQuery = (value: string) => {setQuery(value); setLimit(10);};
  const links = () => Array.from(list.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
  const status = failed ? 'Search could not load. Please try again.' : !index ? 'Loading search…' : !hasQuery ? 'Type at least 2 characters to search.' : !results.length ? `No results for “${query}”. Try another word or a shorter phrase.` : `${results.length} ${results.length === 1 ? 'result' : 'results'}${results.length > limit ? `, showing ${limit}` : ''}`;

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="local-search-title" onCancel={event => {event.preventDefault(); onClose();}} onKeyDown={event => {
    if (event.key === 'Escape') {event.preventDefault(); onClose(); return;}
    if (event.key !== 'Tab') return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]')).filter(element => element.getClientRects().length);
    const target = event.shiftKey ? controls.at(-1) : controls[0];
    if (document.activeElement === (event.shiftKey ? controls[0] : controls.at(-1))) {event.preventDefault(); target?.focus();}
  }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
  }}>
    <div className={styles.header}><h2 id="local-search-title">Search AuthCrunch</h2><button type="button" onClick={onClose} aria-label="Close search"><XMarkIcon aria-hidden="true" /></button></div>
    <form role="search" className={styles.form} onSubmit={event => {event.preventDefault(); links()[0]?.click();}}>
      <label className={styles.srOnly} htmlFor="local-search-query">Search documentation</label>
      <div className={styles.inputRow}><MagnifyingGlassIcon aria-hidden="true" /><input ref={input} id="local-search-query" type="search" autoComplete="off" spellCheck={false} maxLength={160} value={query} onChange={event => updateQuery(event.target.value)} onKeyDown={event => {
        if (event.key === 'ArrowDown' && links().length) {event.preventDefault(); links()[0].focus();}
      }} placeholder="Search guides, directives, articles…" /></div>
    </form>
    <div className={styles.body}>
      <p role="status" className={styles.status}>{status}</p>
      {failed && <button type="button" className={styles.retry} onClick={() => {setFailed(false); setRetry(value => value + 1);}}>Try again</button>}
      {index && !hasQuery && <div className={styles.suggestions}>{['Getting started', 'Cookie domain', 'Access policy', 'Passkey'].map(suggestion => <button type="button" key={suggestion} onClick={() => {updateQuery(suggestion); input.current?.focus();}}>{suggestion}</button>)}</div>}
      {results.length > 0 && <ol ref={list} aria-label="Search results" className={styles.results} onKeyDown={event => {
        if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
        const items = links(), position = items.indexOf(document.activeElement as HTMLAnchorElement);
        if (position < 0) return;
        event.preventDefault();
        if (event.key === 'ArrowUp' && position === 0) input.current?.focus();
        else items[Math.min(items.length - 1, position + (event.key === 'ArrowDown' ? 1 : -1))]?.focus();
      }}>{results.slice(0, limit).map(({page}) => <li key={page.path}><Link to={page.path} onClick={onClose}>
        <span className={styles.category}>{page.category}</span>
        <div className={styles.resultTitle}><h3><Highlight text={page.title} query={query} /></h3><ArrowRightIcon aria-hidden="true" /></div>
        <p><Highlight text={searchExcerpt(page, query)} query={query} /></p>
      </Link></li>)}</ol>}
      {results.length > limit && <button type="button" className={styles.more} onClick={() => setLimit(value => value + 10)}>Show more results</button>}
    </div>
    <p className={styles.footer}>↑ ↓ to move · Enter to open · Esc to close</p>
  </dialog>;
}

export default function SearchBar(): ReactNode {
  const [openedAt, setOpenedAt] = useState<string>();
  const [ready, setReady] = useState(false);
  const [modifier, setModifier] = useState('Ctrl');
  const location = useLocation();
  const currentLocation = `${location.pathname}${location.search}${location.hash}`;
  const open = openedAt === currentLocation;
  const show = useCallback(() => setOpenedAt(currentLocation), [currentLocation]);
  const close = useCallback(() => setOpenedAt(undefined), []);
  useEffect(() => {setReady(true); setModifier(/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl');}, []);
  useEffect(() => {setOpenedAt(value => value === currentLocation ? value : undefined);}, [currentLocation]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.shiftKey || event.isComposing || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
      if (document.querySelector('dialog[open], [role="dialog"]') && !open) return;
      event.preventDefault(); show();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, show]);
  return <>
    <button type="button" className={styles.trigger} aria-label="Search documentation" aria-haspopup="dialog" disabled={!ready} onClick={show}><MagnifyingGlassIcon aria-hidden="true" /><span>Search</span><kbd>{modifier} K</kbd></button>
    <noscript><Link className={styles.fallback} to="/docs/guides">Browse guides</Link></noscript>
    {open && <SearchDialog onClose={close} />}
  </>;
}
