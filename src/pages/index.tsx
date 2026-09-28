import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {ArrowRightIcon, ArrowUpRightIcon} from '@heroicons/react/20/solid';
import AccessFlow from '@site/src/components/AccessFlow';
import styles from './index.module.css';

const steps = [
  {title: 'Install & verify', description: 'Get the right Caddy build.', to: '/docs/start/install'},
  {title: 'Make your first login', description: 'Run a local portal.', to: '/docs/start/first-app'},
  {title: 'Protect an application', description: 'Connect identity to access.', to: '/docs/start/first-app#how-the-configuration-fits-together'},
  {title: 'Verify your policy', description: 'Check both allow and deny.', to: '/docs/start/verify-access'},
];
const topics = [
  {label: 'Identity', title: 'Connect an identity provider', description: 'Local users, GitHub, Google, Entra, LDAP and SAML.', anchor: 'identity-providers'},
  {label: 'Authentication', title: 'Shape the login experience', description: 'Passkeys, authenticator apps, challenge policies and portal UI.', anchor: 'login-and-mfa'},
  {label: 'Sessions', title: 'Manage sessions & tokens', description: 'Cookie scope, token verification, login expiry and logout.', anchor: 'sessions-and-cookies'},
  {label: 'Authorization', title: 'Decide who gets access', description: 'Roles, claims, request paths and identity headers.', anchor: 'authorization'},
  {label: 'Applications', title: 'Connect your applications', description: 'Understand app integration and single sign-on.', anchor: 'applications-and-sso'},
  {label: 'Operations', title: 'Run your deployment', description: 'Credentials, messaging, local users and configuration.', anchor: 'operations'},
];

export default function Home(): ReactNode {
  return (
    <Layout title="Authentication and authorization for Caddy" description="Learn AuthCrunch step by step. Connect identity providers, protect applications with Caddy, and find guides for authentication, authorization and operations.">
      <main className={styles.main}>
        <div className={`container ${styles.hero}`}>
          <header>
            <p className={styles.eyebrow}>Authentication & authorization for Caddy</p>
            <Heading as="h1">Protect your apps.<br /><span>Understand every step.</span></Heading>
            <p className={styles.lead}>Connect your identity provider, define who gets access, and put authentication in front of your applications.</p>
            <div className={styles.actions}>
              <Link className={`button button--primary ${styles.button}`} to="/docs/intro">Build your first setup <ArrowRightIcon aria-hidden="true" /></Link>
              <Link className={`button button--outline button--secondary ${styles.button}`} to="/docs/guides">Explore the guides</Link>
            </div>
            <p className={styles.detail}>New to AuthCrunch? Start with a local login.<br />Already using it? Find your next task below.</p>
          </header>
          <AccessFlow />
        </div>
        <section className={styles.learning} aria-labelledby="learning-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <div><p className={styles.eyebrow}>A clear first path</p><Heading as="h2" id="learning-title">From installation to a protected app.</Heading></div>
              <Link to="/docs/intro" className={styles.textLink}>Start the learning path <ArrowRightIcon aria-hidden="true" /></Link>
            </div>
            <ol className={styles.steps}>
              {steps.map((step, index) => <li key={step.to}><Link to={step.to}><span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span><strong>{step.title}</strong><span>{step.description}</span></Link></li>)}
            </ol>
          </div>
        </section>
        <section className={`container ${styles.topics}`} aria-labelledby="topics-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Find your next task</p><Heading as="h2" id="topics-title">Explore by topic.</Heading></div>
            <Link to="/docs/guides" className={styles.textLink}>Browse all guides <ArrowRightIcon aria-hidden="true" /></Link>
          </div>
          <div className={styles.topicGrid}>
            {topics.map((topic, index) => <Link key={topic.anchor} className={styles.topic} to={`/docs/guides#${topic.anchor}`}><span className={styles.topicLabel}>0{index + 1} / {topic.label}</span><Heading as="h3">{topic.title}<ArrowUpRightIcon aria-hidden="true" /></Heading><p>{topic.description}</p></Link>)}
          </div>
        </section>
        <section className={`container ${styles.help}`} aria-labelledby="help-title">
          <div><p className={styles.eyebrow}>When something doesn't work</p><Heading as="h2" id="help-title">Start with the symptom.</Heading><p>Follow the request from login to access, one check at a time.</p></div>
          <Link className={`button button--outline button--secondary ${styles.button}`} to="/docs/troubleshoot">Troubleshoot your setup <ArrowRightIcon aria-hidden="true" /></Link>
        </section>
      </main>
    </Layout>
  );
}
