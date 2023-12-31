import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Authenticate',
    Svg: require('../../static/img/authenticate_screen.svg').default,
    description: (
      <>
        Implements Form-Based, Basic, Local, LDAP, OpenID Connect,
        OAuth 2.0, and SAML Authentication.
      </>
    ),
  },
  {
    title: 'Authorize',
    Svg: require('../../static/img/authorize_shield.svg').default,
    description: (
      <>
        Authorizes users and grants access to resources upon the discovery of
        valid JWT or PASETO authentication tokens.
      </>
    ),
  },
  {
    title: 'Multi-Factor Authentication',
    Svg: require('../../static/img/golang_logo.svg').default,
    description: (
      <>
        Take advantage of multi-factor authentication with software tokens
        in the form of mobile apps (e.g. Google Authenticator) and hardware
        tokens in the form of USB keys (e.g. YubiKey).
      </>
    ),
  },
  /*
  {
    title: 'User Interface (UI) Theming and Customization',
    Svg: require('../../static/img/golang_logo.svg').default,
    description: (
      <>
        TBD
      </>
    ),
  },
  {
    title: 'User Portal',
    Svg: require('../../static/img/golang_logo.svg').default,
    description: (
      <>
        TBD
      </>
    ),
  },
  {
    title: 'Connected Public Services',
    Svg: require('../../static/img/golang_logo.svg').default,
    description: (
      <>
        TBD
      </>
    ),
  },
  {
    title: 'Powered by Caddy',
    Svg: require('../../static/img/golang_logo.svg').default,
    description: (
      <>
        Integrates with a powerful, enterprise-ready, open source web
        server with automatic HTTPS written in Go.
      </>
    ),
  },
  */
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
