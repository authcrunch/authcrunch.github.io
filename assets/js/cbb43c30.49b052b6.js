"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7773],{8453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>o});var s=t(6540);const r={},i=s.createContext(r);function a(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),s.createElement(i.Provider,{value:n},e.children)}},9429:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"credentials/intro","title":"Credentials Management","description":"The authenticate and authorize sub-systems require managing credentials,","source":"@site/docs/credentials/intro.md","sourceDirName":"credentials","slug":"/credentials/intro","permalink":"/docs/credentials/intro","draft":false,"unlisted":false,"editUrl":"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/credentials/intro.md","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar","previous":{"title":"Miscellaneous","permalink":"/docs/authorize/encryption"},"next":{"title":"Messaging Providers","permalink":"/docs/messaging/intro"}}');var r=t(4848),i=t(8453);const a={sidebar_position:1},o="Credentials Management",c={},d=[];function l(e){const n={code:"code",h1:"h1",header:"header",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"credentials-management",children:"Credentials Management"})}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"authenticate"})," and ",(0,r.jsx)(n.code,{children:"authorize"})," sub-systems require managing credentials,\ne.g. email credentials."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"{\n  security {\n    credentials smtp.outlook.com {\n      username {env.SMTP_USERNAME}\n      password {env.SMTP_PASSWORD}\n    }\n  }\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"This section is WIP."})]})}function u(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}}}]);