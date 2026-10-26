import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import Heading from '@theme/Heading';
import {ArrowRightIcon, ArrowUpRightIcon, CheckIcon, LockClosedIcon, ShieldCheckIcon, Squares2X2Icon, UserCircleIcon} from '@heroicons/react/24/outline';
import styles from './styles.module.css';

const visitors = [
  {name: 'Alice', roles: ['authp/user', 'app/member']},
  {name: 'Bob', roles: ['authp/user']},
  {name: 'Signed out', roles: []},
];

export default function RequestExplorer(): ReactNode {
  useBrokenLinks().collectAnchor('request-title');
  const [selected, setSelected] = useState(0);
  const [membersOnly, setMembersOnly] = useState(false);
  const visitor = visitors[selected];
  const signedIn = visitor.roles.length > 0;
  const allowed = signedIn && (!membersOnly || visitor.roles.includes('app/member'));
  const outcome = !signedIn ? 'login' : allowed ? 'allowed' : 'denied';
  const status = !signedIn ? '302 Redirect' : allowed ? '200 OK' : '403 Forbidden';
  const title = !signedIn ? 'First, establish identity.' : allowed ? 'The app is yours to use.' : 'Signed in. Access denied.';
  const explanation = !signedIn
    ? 'The request goes to the sign-in portal. Try Alice or Bob to see what happens after login.'
    : allowed
      ? `${visitor.name} has ${membersOnly ? 'app/member' : 'authp/user'}. The policy allows the request to reach the app.`
      : 'Bob signed in successfully, but has no app/member role. The policy stops this request before the app.';

  return (
    <section className={styles.explorer} aria-labelledby="request-title" data-outcome={outcome}>
      <div className={styles.toolbar}>
        <h2 id="request-title">Follow a request <ArrowRightIcon aria-hidden="true" /></h2>
        <span>Change the visitor. Change the rule. See the decision.</span>
        <code>GET /</code>
      </div>
      <div className={styles.flow}>
        <div className={styles.visitor}>
          <p className={styles.label}>01 / The visitor</p>
          <div className={styles.visitors} role="group" aria-label="Request visitor">
            {visitors.map((item, index) => <button type="button" key={item.name} aria-pressed={selected === index} aria-controls="request-decision" onClick={() => setSelected(index)}><UserCircleIcon aria-hidden="true" />{item.name}</button>)}
          </div>
          <div className={styles.identity} aria-live="polite" aria-atomic="true">
            <span>{signedIn ? `${visitor.name}'s roles` : 'No active session'}</span>
            <div>{signedIn ? visitor.roles.map(role => <code key={role}>{role}</code>) : <span className={styles.noSession}>Identity is still unknown.</span>}</div>
          </div>
        </div>
        <div className={styles.gate}>
          <span className={styles.connector} aria-hidden="true"><ArrowRightIcon /></span>
          <p className={styles.label}>02 / Caddy + AuthCrunch</p>
          <div className={styles.gateTitle}><ShieldCheckIcon aria-hidden="true" /><span>Your access policy</span></div>
          <div className={styles.rules} role="group" aria-label="Access rule">
            <button type="button" aria-pressed={!membersOnly} aria-controls="request-decision" onClick={() => setMembersOnly(false)}>Signed-in users</button>
            <button type="button" aria-pressed={membersOnly} aria-controls="request-decision" onClick={() => setMembersOnly(true)}>App members</button>
          </div>
          <code className={styles.policy}>allow roles <span>{membersOnly ? 'app/member' : 'authp/admin authp/user'}</span></code>
        </div>
        <div className={styles.decision} id="request-decision" aria-live="polite" aria-atomic="true">
          <span className={styles.connector} aria-hidden="true"><ArrowRightIcon /></span>
          <p className={styles.label}>03 / The decision</p>
          <div className={styles.result}><span className={styles.resultIcon}>{!signedIn ? <LockClosedIcon aria-hidden="true" /> : allowed ? <Squares2X2Icon aria-hidden="true" /> : <ShieldCheckIcon aria-hidden="true" />}</span><strong>{status}</strong>{allowed && <CheckIcon className={styles.check} aria-hidden="true" />}</div>
          <Heading as="h3">{title}</Heading>
          <p className={styles.explanation}>{explanation}</p>
        </div>
      </div>
      <div className={styles.footnote}><span>An interactive illustration of the walkthrough’s access rules.</span><Link to="/docs/start/verify-access#check-denied-access">Run it yourself <ArrowUpRightIcon aria-hidden="true" /></Link></div>
      <noscript><p className={styles.fallback}>Alice is signed in and has authp/user, so this policy allows her request. Follow the walkthrough to test all three outcomes.</p></noscript>
    </section>
  );
}
