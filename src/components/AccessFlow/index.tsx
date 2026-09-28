import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {ArrowUpRightIcon} from '@heroicons/react/20/solid';
import styles from './styles.module.css';

const flows = {
  portal: {
    label: 'Portal + tokens',
    steps: [
      ['Sign in through the portal', 'Local users or an identity provider'],
      ['Receive an access token', "The portal records the user's claims"],
      ['Check access to the app', 'Your policy evaluates those claims'],
    ],
    description: 'Use a portal for login, local MFA and profile pages. Attach an authorization policy to the protected app.',
  },
  oauth: {
    label: 'Direct OAuth',
    steps: [
      ['Open the protected app', 'Its policy starts the sign-in flow'],
      ['Sign in with your provider', 'Return to the configured callback'],
      ['Use a policy session', 'Access rules apply to each request'],
    ],
    description: 'Use an external provider directly. This mode has no portal profile pages or user transforms; sessions have a fixed lifetime.',
  },
} as const;

export default function AccessFlow(): ReactNode {
  const [model, setModel] = useState<keyof typeof flows>('portal');
  const flow = flows[model];
  return (
    <section className={styles.panel} aria-label="Two ways to protect an app">
      <p className={styles.eyebrow}>Two ways to protect an app</p>
      <div className={styles.controls} role="group" aria-label="Authentication model">
        {(Object.keys(flows) as (keyof typeof flows)[]).map((key) => (
          <button key={key} type="button" aria-pressed={model === key} onClick={() => setModel(key)}>{flows[key].label}</button>
        ))}
      </div>
      <div aria-live="polite" aria-atomic="true">
        <ol className={styles.steps}>
          {flow.steps.map(([title, description], index) => (
            <li key={title}><span className={styles.number} aria-hidden="true">{index + 1}</span><div><strong>{title}</strong><span>{description}</span></div></li>
          ))}
        </ol>
        <p className={styles.description}>{flow.description}</p>
      </div>
      <Link className={styles.link} to="/docs/intro#choose-a-login-model">Understand the moving parts <ArrowUpRightIcon aria-hidden="true" /></Link>
    </section>
  );
}
