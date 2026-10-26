import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {ArrowRightIcon, ArrowUpRightIcon, FingerPrintIcon, ShieldCheckIcon, KeyIcon, Squares2X2Icon, ServerStackIcon, UserGroupIcon} from '@heroicons/react/24/outline';
import styles from './styles.module.css';

const topics = [
  {label:'Identity', icon:UserGroupIcon, title:'Start with the people signing in.', description:'Connect local users or an external identity provider. Understand which claims arrive before you grant access.', anchor:'identity-providers', links:[['Local identity stores','/docs/authenticate/local/identity-store'],['OAuth and OpenID Connect','/docs/authenticate/oauth/oauth2'],['SAML identity providers','/docs/authenticate/saml/saml']]},
  {label:'Authentication', icon:FingerPrintIcon, title:'Make each login prove enough.', description:'Add factors, choose the challenges a user must complete, and shape the portal experience.', anchor:'login-and-mfa', links:[['Multi-factor authentication','/docs/authenticate/mfa'],['Authentication challenges','/docs/authenticate/authentication-challenges'],['User transforms','/docs/authenticate/user-transforms']]},
  {label:'Sessions', icon:KeyIcon, title:'Know what keeps a user signed in.', description:'Follow cookies, access tokens, renewal, and logout. Choose explicitly what should survive expiry or a restart.', anchor:'sessions-and-cookies', links:[['Authentication cookies','/docs/authenticate/auth-cookie'],['Refresh sessions','/docs/authenticate/refresh-token'],['Trusted login and logout redirects','/docs/authenticate/trust-login-logout']]},
  {label:'Authorization', icon:ShieldCheckIcon, title:'A login is the start of the decision.', description:'Check roles, claims, and request paths before the application receives a request. Verify both allowed and denied access.', anchor:'authorization', links:[['Authorization policies','/docs/authorize/intro'],['Role-based access rules','/docs/authorize/acl-rbac'],['Path-based access rules','/docs/authorize/path-acl']]},
  {label:'Applications', icon:Squares2X2Icon, title:'Connect access to your application.', description:'Choose the right integration model, put the policy in the request path, and pass identity only across a trusted boundary.', anchor:'applications-and-sso', links:[['Choose a login model','/docs/intro#choose-a-login-model'],['AuthCrunch as an OIDC provider','/docs/apps/oidc-provider'],['Identity headers for your app','/docs/authorize/headers']]},
  {label:'Operations', icon:ServerStackIcon, title:'Keep the working setup working.', description:'Understand module choices, storage ownership, and useful diagnostics before taking the next deployment step.', anchor:'operations', links:[['Plugins and backend choices','/docs/operations/backends'],['Persistent runtime state','/docs/operations/runtime-state'],['Authentication logging','/docs/operations/logging']]},
];
const paths = ['M100 75 Q175 75 320 225','M540 75 Q465 75 320 225','M100 225 H320','M540 225 H320','M100 375 Q175 375 320 225','M540 375 Q465 375 320 225'];

export default function TopicExplorer(): ReactNode {
  const [selected,setSelected] = useState(0);
  const topic=topics[selected];
  const logo=useBaseUrl('/img/brand/logo.svg');
  return (<>
    <div className={styles.explorer}>
      <div className={styles.map} role="group" aria-label="Choose a documentation topic">
        <svg className={styles.connections} viewBox="0 0 640 450" preserveAspectRatio="none" aria-hidden="true">{paths.map((d,index)=><path key={d} d={d} className={selected===index ? styles.activePath : undefined} />)}</svg>
        {topics.map((item,index)=><button type="button" key={item.label} className={`${styles.node} ${styles[`node${index}`]}`} aria-pressed={selected===index} aria-controls="topic-explorer-detail" onClick={()=>setSelected(index)}><item.icon aria-hidden="true" /><span>{item.label}</span><span className={styles.nodeNumber} aria-hidden="true">0{index+1}</span></button>)}
        <div className={styles.core} aria-hidden="true"><img src={logo} alt="" width="60" height="60" /><span>AuthCrunch</span><small>Your access flow</small></div>
      </div>
      <div className={styles.detail} id="topic-explorer-detail" aria-live="polite" aria-atomic="true">
        <p className={styles.eyebrow}>0{selected+1} / {topic.label}</p><Heading as="h3">{topic.title}</Heading><p>{topic.description}</p>
        <ul>{topic.links.map(([title,to])=><li key={to}><Link to={to}>{title}<ArrowUpRightIcon aria-hidden="true" /></Link></li>)}</ul>
        <Link className={styles.more} to={`/docs/guides#${topic.anchor}`}>Explore {topic.label.toLowerCase()} guides <ArrowRightIcon aria-hidden="true" /></Link>
      </div>
    </div>
    <noscript><nav className={styles.fallback} aria-label="All documentation topics">{topics.map(item=><Link key={item.anchor} to={`/docs/guides#${item.anchor}`}>{item.label}</Link>)}</nav></noscript>
    </>
  );
}
