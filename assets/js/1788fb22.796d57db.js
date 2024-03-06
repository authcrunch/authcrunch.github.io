"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1495],{2143:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>o,toc:()=>l});var i=n(4848),r=n(8453);const s={},c="SAML Overview",o={id:"authenticate/saml/saml",title:"SAML Overview",description:"The plugin supports the following SAML identity providers (IdP):",source:"@site/docs/authenticate/saml/10-saml.md",sourceDirName:"authenticate/saml",slug:"/authenticate/saml/saml",permalink:"/docs/authenticate/saml/saml",draft:!1,unlisted:!1,editUrl:"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authenticate/saml/10-saml.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"LDAP Authentication Architecture",permalink:"/docs/authenticate/ldap/search"},next:{title:"Azure Active Directory",permalink:"/docs/authenticate/saml/azure"}},a={},l=[{value:"Time Synchronization",id:"time-synchronization",level:2},{value:"Configuration",id:"configuration",level:2}];function d(e){const t={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"saml-overview",children:"SAML Overview"}),"\n",(0,i.jsx)(t.p,{children:"The plugin supports the following SAML identity providers (IdP):"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Azure Active Directory (Office 365) Applications"}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"If you would like to see the support for the following identity providers,\nplease reach out:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Salesforce"}),"\n",(0,i.jsx)(t.li,{children:"Okta"}),"\n",(0,i.jsx)(t.li,{children:"Ping Identity"}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"time-synchronization",children:"Time Synchronization"}),"\n",(0,i.jsx)(t.p,{children:"Importantly, SAML assertion validation checks timestamps. It is\ncritical that the application validating the assertions maintains\naccurate clock. The out of sync time WILL result in failed\nauthentications."}),"\n",(0,i.jsx)(t.h2,{id:"configuration",children:"Configuration"}),"\n",(0,i.jsx)(t.p,{children:"The following configuration is common across variations of SAML identity provider:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:"      saml identity provider azure {\n        method saml\n        realm azure\n        driver azure\n      }\n"})}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{children:(0,i.jsx)(t.strong,{children:"Parameter Name"})}),(0,i.jsx)(t.th,{children:(0,i.jsx)(t.strong,{children:"Description"})})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.code,{children:"method"})}),(0,i.jsxs)(t.td,{children:["Must be set to ",(0,i.jsx)(t.code,{children:"saml"})]})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.code,{children:"realm"})}),(0,i.jsx)(t.td,{children:"The realm is used to distinguish between various SAML authentication providers"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.code,{children:"provider"})}),(0,i.jsxs)(t.td,{children:["It is either ",(0,i.jsx)(t.code,{children:"generic"})," or specific, e.g. ",(0,i.jsx)(t.code,{children:"azure"}),", ",(0,i.jsx)(t.code,{children:"okta"}),", etc."]})]})]})]}),"\n",(0,i.jsxs)(t.p,{children:["The URL for the SAML endpoint is: ",(0,i.jsx)(t.code,{children:"<AUTH_PORTAL_PATH>/saml/<REALM_NAME>"}),"."]}),"\n",(0,i.jsxs)(t.p,{children:["If you specify ",(0,i.jsx)(t.code,{children:"realm"})," as ",(0,i.jsx)(t.code,{children:"azure"})," and the portal is being served at\n",(0,i.jsx)(t.code,{children:"/auth"}),", then you could access the endpoint via ",(0,i.jsx)(t.code,{children:"/auth/saml/azure"}),"."]}),"\n",(0,i.jsxs)(t.p,{children:["The Reply URL could be ",(0,i.jsx)(t.code,{children:"https://localhost:8443/auth/saml/azure"}),"."]})]})}function h(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>c,x:()=>o});var i=n(6540);const r={},s=i.createContext(r);function c(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),i.createElement(s.Provider,{value:t},e.children)}}}]);