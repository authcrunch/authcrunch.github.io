"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2418],{8715:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>r,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var o=n(4848),i=n(8453);const a={},s="Google Identity Platform",c={id:"authenticate/oauth/backend-oauth2-0002-google",title:"Google Identity Platform",description:"References:",source:"@site/docs/authenticate/oauth/81-backend-oauth2-0002-google.md",sourceDirName:"authenticate/oauth",slug:"/authenticate/oauth/backend-oauth2-0002-google",permalink:"/docs/authenticate/oauth/backend-oauth2-0002-google",draft:!1,unlisted:!1,editUrl:"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authenticate/oauth/81-backend-oauth2-0002-google.md",tags:[],version:"current",sidebarPosition:81,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Okta",permalink:"/docs/authenticate/oauth/backend-oauth2-0001-okta"},next:{title:"LinkedIn",permalink:"/docs/authenticate/oauth/backend-oauth2-0003-linkedin"}},r={},l=[];function d(e){const t={a:"a",code:"code",h1:"h1",img:"img",li:"li",p:"p",ul:"ul",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"google-identity-platform",children:"Google Identity Platform"}),"\n",(0,o.jsx)(t.p,{children:"References:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:(0,o.jsx)(t.a,{href:"https://developers.google.com/identity/protocols/oauth2/web-server#httprest_2",children:"Google Identity Platform - Using OAuth 2.0 for Web Server Applications"})}),"\n",(0,o.jsx)(t.li,{children:(0,o.jsx)(t.a,{href:"https://developers.google.com/identity/protocols/oauth2/openid-connect",children:"Google Identity Platform - Identity Platform - OpenID Connect"})}),"\n"]}),"\n",(0,o.jsx)(t.p,{children:"The Caddyfile snippet for Google OAuth 2.0 OpenID identity provider is as follows."}),"\n",(0,o.jsxs)(t.p,{children:["The following ",(0,o.jsx)(t.a,{href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/oauth/google/Caddyfile",children:(0,o.jsx)(t.code,{children:"Caddyfile"})}),"\nallows Google-based authentication."]}),"\n",(0,o.jsx)(t.p,{children:'First, create new application, e.g. "My Gatekeeper".'}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Google Identity Platform - Identity Platform - New Application",src:n(4536).A+"",width:"853",height:"469"})}),"\n",(0,o.jsx)(t.p,{children:"After the creation of the app, you will land on Credentials page."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Google Identity Platform - Identity Platform - Credentials",src:n(1920).A+"",width:"1142",height:"605"})}),"\n",(0,o.jsx)(t.p,{children:'Click "Configure Consent Screen" and select an appropriate option, e.g. "External".'}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Google Identity Platform - Identity Platform - Consent Screen",src:n(2245).A+"",width:"940",height:"512"})}),"\n",(0,o.jsx)(t.p,{children:'Next, provide the name for the application, e.g. "My Gatekeeper" and select appropriate support email.'}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Google Identity Platform - Identity Platform - Consent Screen Configuration",src:n(7116).A+"",width:"842",height:"874"})}),"\n",(0,o.jsx)(t.p,{children:"After configuring the consent screen you will see the following."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Google Identity Platform - Identity Platform - Consent Screen Verification",src:n(43).A+"",width:"966",height:"688"})}),"\n",(0,o.jsx)(t.p,{children:'Next, browse to "Credentials" and click "Create Credentials". Then, choose "OAuth client ID":'}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Google Identity Platform - Identity Platform - New Credentials",src:n(2047).A+"",width:"933",height:"435"})}),"\n",(0,o.jsx)(t.p,{children:"First, choose the type of credentials:"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Google Identity Platform - Identity Platform - Consent Screen",src:n(7096).A+"",width:"921",height:"515"})}),"\n",(0,o.jsx)(t.p,{children:"Next, provide Redirect URL:"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Google Identity Platform - Identity Platform - Consent Screen",src:n(3592).A+"",width:"608",height:"628"})}),"\n",(0,o.jsx)(t.p,{children:"Login redirect URIs:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:(0,o.jsx)(t.code,{children:"https://localhost:8443/auth/oauth2/google/authorization-code-callback"})}),"\n"]}),"\n",(0,o.jsx)(t.p,{children:"Finally, you will get a confirmation. Store the Client ID and Client Secret securely."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Google Identity Platform - Identity Platform - Consent Screen",src:n(5418).A+"",width:"550",height:"472"})})]})}function h(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},2245:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/oauth2_google_consent_screen-801b27c607ceb34484b66233ab16fdad.png"},7116:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/oauth2_google_consent_screen_config-63685410c6bdde9b548fcf45dbb2ae05.png"},43:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/oauth2_google_consent_screen_verification-dcf701a80b369734a8cd45d6cfa890b3.png"},1920:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/oauth2_google_credentials-eef73706f5a51925283009f33ce59a66.png"},4536:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/oauth2_google_new_app-e2b928454fa79133dfa2f9b21169d78e.png"},2047:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/oauth2_google_new_credentials-454e9c2eb924a8c79f382d2fc9199e69.png"},5418:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/oauth2_google_new_credentials_confirm-9ebf9e67413bcff6a42c5b24ed3d1755.png"},7096:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/oauth2_google_new_credentials_type_choice-c129297e595c24dd5a4b81372ae5bc96.png"},3592:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/oauth2_google_new_credentials_uri_choice-99c19633ee0d637132620978b764013a.png"},8453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>c});var o=n(6540);const i={},a=o.createContext(i);function s(e){const t=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),o.createElement(a.Provider,{value:t},e.children)}}}]);