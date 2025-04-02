"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7124],{8453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>d});var o=n(6540);const r={},i=o.createContext(r);function a(e){const t=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),o.createElement(i.Provider,{value:t},e.children)}},9671:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>d,default:()=>h,frontMatter:()=>a,metadata:()=>o,toc:()=>u});const o=JSON.parse('{"id":"authenticate/oauth/backend-oauth2-endpoint","title":"Advanced Features","description":"OAuth 2.0 Endpoint Delayed Start","source":"@site/docs/authenticate/oauth/82-backend-oauth2-endpoint.md","sourceDirName":"authenticate/oauth","slug":"/authenticate/oauth/backend-oauth2-endpoint","permalink":"/docs/authenticate/oauth/backend-oauth2-endpoint","draft":false,"unlisted":false,"editUrl":"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authenticate/oauth/82-backend-oauth2-endpoint.md","tags":[],"version":"current","sidebarPosition":82,"frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Discord","permalink":"/docs/authenticate/oauth/backend-oauth2-0013-discord"},"next":{"title":"X.509","permalink":"/docs/authenticate/x509/"}}');var r=n(4848),i=n(8453);const a={},d="Advanced Features",s={},u=[{value:"OAuth 2.0 Endpoint Delayed Start",id:"oauth-20-endpoint-delayed-start",level:2},{value:"OAuth 2.0 Endpoint Retry Attempts",id:"oauth-20-endpoint-retry-attempts",level:2},{value:"OAuth 2.0 Logout",id:"oauth-20-logout",level:2}];function c(e){const t={code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"advanced-features",children:"Advanced Features"})}),"\n",(0,r.jsx)(t.h2,{id:"oauth-20-endpoint-delayed-start",children:"OAuth 2.0 Endpoint Delayed Start"}),"\n",(0,r.jsx)(t.p,{children:"The following configuration allows delaying getting key material of upstream\nOAuth 2.0 server."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"      oauth identity provider google {\n          ...\n          delay_start 5\n"})}),"\n",(0,r.jsx)(t.p,{children:"This would delay querying the upstream server for 5 seconds."}),"\n",(0,r.jsx)(t.h2,{id:"oauth-20-endpoint-retry-attempts",children:"OAuth 2.0 Endpoint Retry Attempts"}),"\n",(0,r.jsx)(t.p,{children:"The following configuration permits for retries when getting key material of\nupstream OAuth 2.0 server."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"      oauth identity provider google {\n          ...\n          retry_attempts 3\n          retry_interval 10\n"})}),"\n",(0,r.jsx)(t.p,{children:"If unsuccessful at reaching a remote OAuth 2.0 server, the plugin would\ntry connecting 2 more times at 10 second intervals."}),"\n",(0,r.jsx)(t.h2,{id:"oauth-20-logout",children:"OAuth 2.0 Logout"}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(t.code,{children:"enable logout"})," directive instructs the plugin to redirect a user to OAuth provider's\nlogout URL. When, the plugin fetches identity provider metadata, it discovers logout URL\nvia ",(0,r.jsx)(t.code,{children:"end_session_endpoint"}),"."]}),"\n",(0,r.jsx)(t.p,{children:"Note: At the moment, this feature only works with Cognito. If you have a need for this,\nplease reach out."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"      oauth identity provider cognito-us-east-1 {\n          ...\n          enable logout\n"})})]})}function h(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}}}]);