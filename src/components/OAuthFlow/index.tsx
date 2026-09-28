import type {ReactNode} from 'react';
import styles from './styles.module.css';

const steps = [
  ['Browser → identity provider', 'Sign in and consent', 'The portal redirects the browser to the provider. The provider returns an authorization code to the portal’s callback.'],
  ['Portal → identity provider', 'Exchange the code', 'The portal exchanges the code for provider tokens and retrieves the user’s identity. The client secret stays on the server.'],
  ['Portal → browser', 'Issue the app session', 'User transforms assign roles. The portal signs an AuthCrunch token and sets its cookie in the browser.'],
  ['Browser → protected app', 'Check permission', 'The authorization policy verifies the AuthCrunch token and checks its roles before allowing the app to respond.'],
] as const;

export default function OAuthFlow(): ReactNode {
  return (
    <figure className={styles.flow} aria-label="External login through an AuthCrunch portal">
      <ol className={styles.steps} role="list">
        {steps.map(([connection, title, detail], index) => (
          <li key={title}>
            <span className={styles.number} aria-hidden="true">{index + 1}</span>
            <div>
              <span className={styles.connection}>{connection}</span>
              <strong>{title}</strong>
              <p>{detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption>Provider tokens retrieve identity. The AuthCrunch token carries claims to the app’s authorization policy.</figcaption>
    </figure>
  );
}
