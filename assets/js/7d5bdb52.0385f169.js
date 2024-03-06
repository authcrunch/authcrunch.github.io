"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2468],{5346:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>c});var n=t(4848),a=t(8453);const i={sidebar_position:1},r="Single Sign-On with SAML",o={id:"apps/sso_saml",title:"Single Sign-On with SAML",description:"AWS SSO",source:"@site/docs/apps/sso_saml.md",sourceDirName:"apps",slug:"/apps/sso_saml",permalink:"/docs/apps/sso_saml",draft:!1,unlisted:!1,editUrl:"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/apps/sso_saml.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Overview",permalink:"/docs/apps/intro"}},l={},c=[{value:"AWS SSO",id:"aws-sso",level:2},{value:"Configuration",id:"configuration",level:3}];function d(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.h1,{id:"single-sign-on-with-saml",children:"Single Sign-On with SAML"}),"\n",(0,n.jsx)(s.h2,{id:"aws-sso",children:"AWS SSO"}),"\n",(0,n.jsxs)(s.p,{children:["The ",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_federated-users.html",children:"Identity Federation with SAML 2.0"}),"\nallows creating trust between authentication portal as an Identity Provider (IdP)\nand AWS as the service provider."]}),"\n",(0,n.jsxs)(s.p,{children:["The authentication portal generates a SAML authentication response that includes assertions\nthat identify the user and include attributes about the user. You can also configure the portal\nto include a SAML assertion attribute called ",(0,n.jsx)(s.code,{children:"SessionDuration"})," that specifies how long\nthe console session is valid. You can also configure the portal to pass attributes as\nsession tags. The portal sends this response via the client browser to AWS SAML\nendpoint."]}),"\n",(0,n.jsxs)(s.p,{children:["The ",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_saml_assertions.html",children:"Configuring SAML assertions for the authentication response"}),"\ndescribes how the authentication portal crafts the XML request to AWS SAML endpoint, i.e. ",(0,n.jsx)(s.code,{children:"https://region-code.signin.aws.amazon.com/saml"}),"."]}),"\n",(0,n.jsxs)(s.p,{children:["For example, the ",(0,n.jsx)(s.code,{children:"Attributes/Role"}),":"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-xml",children:'<Attribute Name="https://aws.amazon.com/SAML/Attributes/Role">\n  <AttributeValue>arn:aws:iam::account-number:role/role-name1,arn:aws:iam::account-number:saml-provider/provider-name</AttributeValue>\n  <AttributeValue>arn:aws:iam::account-number:role/role-name2,arn:aws:iam::account-number:saml-provider/provider-name</AttributeValue>\n  <AttributeValue>arn:aws:iam::account-number:role/role-name3,arn:aws:iam::account-number:saml-provider/provider-name</AttributeValue>\n</Attribute>\n'})}),"\n",(0,n.jsxs)(s.p,{children:["The ",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_enable-console-saml.html",children:"Enabling SAML 2.0 federated users to access the AWS Management Console"}),"\noutlines the steps necessary to enable SSO on AWS side."]}),"\n",(0,n.jsxs)(s.p,{children:["The ",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_saml.html",children:"Creating a role for SAML 2.0 federation"}),"\ndescribes how to create an IAM role for use with SAML federation."]}),"\n",(0,n.jsx)(s.h3,{id:"configuration",children:"Configuration"}),"\n",(0,n.jsx)(s.p,{children:"The steps necessary to enable AWS SSO in the plugin follow:"}),"\n",(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["Generate a self-signed ceritficate (for ",(0,n.jsx)(s.code,{children:"metadata.xml"}),") and private key (for creating assertions)"]}),"\n",(0,n.jsx)(s.li,{children:"Add Caddyfile directives enabling AWS SSO"}),"\n",(0,n.jsx)(s.li,{children:"Add Caddyfile user transforms with AWS SSO roles"}),"\n",(0,n.jsx)(s.li,{children:"Download metadata file"}),"\n"]}),"\n",(0,n.jsx)(s.p,{children:"First, generate self-signed certificate:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-bash",children:'openssl req -x509 -nodes -sha256 -days 1095 -newkey rsa:4096 \\\n  -keyout authp_saml.key -out authp_saml.crt \\\n  -subj "/C=US/ST=New York/L=New York/O=AuthPortal/OU=AuthPortalSAMLIdP/CN=AuthPortalSAMLUser"\n'})}),"\n",(0,n.jsxs)(s.p,{children:["Second, create ",(0,n.jsx)(s.code,{children:"Caddyfile"})," config. Please see an example ",(0,n.jsx)(s.a,{href:"https://github.com/authcrunch/authcrunch.github.io/blob/main/assets/conf/apps/sso/aws/Caddyfile",children:"here"}),"."]}),"\n",(0,n.jsxs)(s.p,{children:["The name of the SSO provider is significant. Access SSO console via ",(0,n.jsx)(s.code,{children:"/apps/sso/<provider_name>"})," endpoint, e.g. ",(0,n.jsx)(s.code,{children:"/apps/sso/aws"}),".\nIf you want to fetch ",(0,n.jsx)(s.code,{children:"metadata.xml"}),", then the URL is ",(0,n.jsx)(s.code,{children:"/apps/sso/aws/metadata.xml"}),"."]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{children:"sso provider aws {\n  entity_id caddy-authp-idp\n  driver aws\n  private key {$HOME}/tmp/authp/awssso/authp_saml.key\n  cert {$HOME} ${HOME}/tmp/authp/awssso/authp_saml.crt\n  location https://auth.myfiosgateway.com:8443/apps/sso/aws\n}\n"})}),"\n",(0,n.jsx)(s.p,{children:"TBC."})]})}function h(e={}){const{wrapper:s}={...(0,a.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},8453:(e,s,t)=>{t.d(s,{R:()=>r,x:()=>o});var n=t(6540);const a={},i=n.createContext(a);function r(e){const s=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),n.createElement(i.Provider,{value:s},e.children)}}}]);