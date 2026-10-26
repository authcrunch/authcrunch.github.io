import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {ArrowRightIcon, ArrowUpRightIcon, CommandLineIcon, UserCircleIcon, ShieldCheckIcon, BeakerIcon} from '@heroicons/react/24/outline';
import AccessFlow from '@site/src/components/AccessFlow';
import GatewayIllustration from '@site/src/components/GatewayIllustration';
import RequestExplorer from '@site/src/components/RequestExplorer';
import TopicExplorer from '@site/src/components/TopicExplorer';
import styles from './index.module.css';

const steps = [
  {title: 'Get the right build', description: 'Install the ready-to-run Caddy distribution and verify its modules.', to: '/docs/start/install', icon:CommandLineIcon},
  {title: 'Make your first login', description: 'Run the local portal. Follow real screenshots through the login flow.', to: '/docs/start/first-app', icon:UserCircleIcon},
  {title: 'Connect identity to access', description: 'See how the portal, cookies, and application policy fit together.', to: '/docs/start/first-app#how-the-configuration-fits-together', icon:ShieldCheckIcon},
  {title: 'Prove your policy works', description: 'Check allowed access, denied access, and the next request after logout.', to: '/docs/start/verify-access', icon:BeakerIcon},
];

export default function Home(): ReactNode {
  return (
    <Layout title="Authentication and authorization for Caddy" description="Learn AuthCrunch step by step. Connect identity providers, protect applications with Caddy, and find guides for authentication, authorization and operations.">
      <main className={styles.main}>
        <div className={styles.heroBackdrop}><div className={`container ${styles.hero}`}>
          <header className={styles.heroIntro}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span className={styles.eyebrowLine} aria-hidden="true" /> Authentication + authorization for Caddy</p>
              <Heading as="h1">Who gets in?<br /><span>You write the rules.</span></Heading>
              <p className={styles.lead}>Connect identity, login, and access policies with AuthCrunch. Follow a request below, then build the same flow in Caddy.</p>
              <div className={styles.actions}>
                <Link className={`button button--primary ${styles.button}`} to="/docs/start/first-app">Build your first setup <ArrowRightIcon aria-hidden="true" /></Link>
                <Link className={`button button--outline button--secondary ${styles.button}`} to="#request-title">Follow a request</Link>
              </div>
            </div>
            <GatewayIllustration />
          </header>
        </div></div>
        <div className={`container ${styles.requestSection}`}><RequestExplorer /></div>
        <section className={styles.learning} aria-labelledby="learning-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <div><p className={styles.eyebrow}>Your first working setup</p><Heading as="h2" id="learning-title">Four steps. A working front door.</Heading></div>
              <Link to="/docs/intro" className={styles.textLink}>Start the learning path <ArrowRightIcon aria-hidden="true" /></Link>
            </div>
            <ol className={styles.steps}>
              {steps.map((step, index) => <li key={step.to}><Link to={step.to}><div className={styles.stepTop}><span className={styles.stepIcon}><step.icon aria-hidden="true" /></span><span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span></div><strong>{step.title}</strong><span>{step.description}</span><span className={styles.stepAction}>Open the guide <ArrowUpRightIcon aria-hidden="true" /></span></Link></li>)}
            </ol>
          </div>
        </section>
        <section className={`container ${styles.topics}`} aria-labelledby="topics-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Explore the moving parts</p><Heading as="h2" id="topics-title">What are you working on?</Heading><p className={styles.sectionLead}>Choose a part of the flow. Find the guides that move you forward.</p></div>
            <Link to="/docs/guides" className={styles.textLink}>Browse all guides <ArrowRightIcon aria-hidden="true" /></Link>
          </div>
          <TopicExplorer />
        </section>
        <section className={styles.models} aria-labelledby="models-title"><div className={`container ${styles.modelGrid}`}>
          <div><p className={styles.eyebrow}>Choose the right starting point</p><Heading as="h2" id="models-title">Different apps.<br />Different ways to sign in.</Heading><p className={styles.sectionLead}>A portal with profile pages and a policy that signs users in directly have different responsibilities. Compare the flows before choosing yours.</p><Link to="/docs/intro#choose-a-login-model" className={styles.textLink}>Understand the login models <ArrowRightIcon aria-hidden="true" /></Link><div className={styles.modelNote}><ShieldCheckIcon aria-hidden="true" /><p>Authentication establishes identity.<br /><strong>Your policy decides what that identity may access.</strong></p></div></div>
          <AccessFlow />
        </div></section>
        <section className={`container ${styles.help}`} aria-labelledby="help-title">
          <div><p className={styles.eyebrow}>Keep learning by doing</p><Heading as="h2" id="help-title">Start local. Follow the whole request.</Heading><p>One Caddyfile, two demo users, and an application you can protect.</p></div>
          <div className={styles.helpActions}><Link className={`button button--primary ${styles.button}`} to="/docs/start/install">Start the walkthrough <ArrowRightIcon aria-hidden="true" /></Link><Link to="/docs/troubleshoot">Something isn't working? Troubleshoot <ArrowUpRightIcon aria-hidden="true" /></Link></div>
        </section>
      </main>
    </Layout>
  );
}
