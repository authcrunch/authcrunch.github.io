import {useEffect, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {ArrowUpRightIcon, HeartIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {DISMISSED_ATTRIBUTE, STORAGE_KEY, dismissalRemaining} from './dismissal.mjs';
import styles from './styles.module.css';

export default function CommunityBanner(): ReactNode {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [companyOpened, setCompanyOpened] = useState(false);
  const [followed, setFollowed] = useState(false);
  const canDismiss = ready && companyOpened && followed;
  const artwork = useBaseUrl('/img/rapidkt/expertise-to-skills.webp');
  const applyDismissal = useRef<(value: string | null) => void>(undefined);

  useEffect(() => {
    let current: string | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function apply(value: string | null) {
      current = value;
      clearTimeout(timer);
      const remaining = dismissalRemaining(value);
      document.documentElement.setAttribute(DISMISSED_ATTRIBUTE, String(remaining > 0));
      setVisible(remaining === 0);
      if (remaining > 0) {
        setCompanyOpened(false);
        setFollowed(false);
        timer = setTimeout(() => apply(current), remaining);
      } else if (value !== null) {
        current = null;
        try {
          if (localStorage.getItem(STORAGE_KEY) === value) localStorage.removeItem(STORAGE_KEY);
        } catch { /* Storage may be unavailable; the announcement still works. */ }
      }
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) apply(event.newValue);
    };
    const checkTime = () => {if (!document.hidden) apply(current);};
    applyDismissal.current = apply;
    try {current = localStorage.getItem(STORAGE_KEY);} catch { /* Show without storage. */ }
    apply(current);
    setReady(true);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', checkTime);
    document.addEventListener('visibilitychange', checkTime);
    return () => {
      clearTimeout(timer);
      applyDismissal.current = undefined;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', checkTime);
      document.removeEventListener('visibilitychange', checkTime);
    };
  }, []);

  function dismiss() {
    if (!canDismiss) return;
    const value = String(Date.now());
    try {localStorage.setItem(STORAGE_KEY, value);} catch { /* Keep dismissal in memory. */ }
    applyDismissal.current?.(value);
  }

  if (!visible) return null;
  return <aside className={styles.banner} aria-labelledby="community-banner-title" data-search-ignore>
    <div className={styles.artwork} aria-hidden="true"><img src={artwork} width="1672" height="941" alt="" fetchPriority="high" /></div>
    <div className={styles.inner}>
      <div className={styles.message}>
        <div className={styles.copy}>
          <p className={styles.byline} id="community-banner-title">A note from Paul · Creator of AuthCrunch</p>
          <p className={styles.title}>I’m building a startup. <strong>Meet RapidKT.</strong></p>
          <p className={styles.description}>Working on <strong>AI skills</strong> or <strong>harness engineering</strong> at your company?{' '}
            <Link href="https://www.linkedin.com/in/greenpau/" target="_blank" rel="noopener noreferrer">Let’s connect on LinkedIn <ArrowUpRightIcon aria-hidden="true" /><span className={styles.srOnly}> (opens in a new tab)</span></Link>
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        <Link className={styles.visit} href="https://www.linkedin.com/company/rapidkt/" target="_blank" rel="noopener noreferrer" onClick={() => setCompanyOpened(true)} onAuxClick={event => {if (event.button === 1) setCompanyOpened(true);}}>Follow RapidKT on LinkedIn <ArrowUpRightIcon aria-hidden="true" /><span className={styles.srOnly}> (opens in a new tab)</span></Link>
        <p className={styles.followHint} id="rapidkt-follow-hint">Follow the company, then return here to confirm.</p>
        <label className={styles.confirmation}>
          <input type="checkbox" checked={followed} disabled={!ready || !companyOpened} onChange={event => setFollowed(event.target.checked)} aria-describedby="rapidkt-follow-hint" />
          <span>I followed the company on LinkedIn.</span>
        </label>
        <button type="button" className={styles.dismiss} disabled={!canDismiss} onClick={dismiss}>Hide</button>
        <Link className={styles.explore} href="https://rapidkt.com/" target="_blank" rel="noopener noreferrer">Explore RapidKT <ArrowUpRightIcon aria-hidden="true" /><span className={styles.srOnly}> (opens in a new tab)</span></Link>
      </div>
      <p className={styles.adopters}><HeartIcon aria-hidden="true" /><span>Using AuthCrunch? I’d love to hear about it.{' '}
        <Link href="https://github.com/authcrunch/authcrunch/pulls" target="_blank" rel="noopener noreferrer">Open a PR to add yourself or your company to <strong>ADOPTERS.md</strong> <ArrowUpRightIcon aria-hidden="true" /><span className={styles.srOnly}> (opens in a new tab)</span></Link>
      </span></p>
    </div>
    <button type="button" className={styles.close} disabled={!canDismiss} onClick={dismiss} aria-label="Hide announcement" title="Hide"><XMarkIcon aria-hidden="true" /></button>
  </aside>;
}
