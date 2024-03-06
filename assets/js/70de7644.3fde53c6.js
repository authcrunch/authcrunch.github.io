"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9240],{6615:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>c,toc:()=>r});var i=t(4848),a=t(8453);const o={},l="Local Configuration",c={id:"authenticate/local/local",title:"Local Configuration",description:"The following directive instructs the plugin to use the local",source:"@site/docs/authenticate/local/10-local.md",sourceDirName:"authenticate/local",slug:"/authenticate/local/local",permalink:"/docs/authenticate/local/local",draft:!1,unlisted:!1,editUrl:"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authenticate/local/10-local.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Customizing the User Interface (UI)",permalink:"/docs/authenticate/ui-features"},next:{title:"Identity Store",permalink:"/docs/authenticate/local/identity-store"}},s={},r=[];function d(e){const n={a:"a",code:"code",h1:"h1",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"local-configuration",children:"Local Configuration"}),"\n",(0,i.jsxs)(n.p,{children:["The following directive instructs the plugin to use the local\n",(0,i.jsx)(n.code,{children:"$HOME/.local/caddy/users.json"})," file for authentication."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"{\n  security {\n    local identity store localdb {\n      realm local\n      path {$HOME}/.local/caddy/users.json\n    }\n\n    authentication portal myportal {\n      enable identity store localdb\n    }\n  }\n}\n\napp.contoso.com {\n  authenticate with myportal\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:"Please browse the following configuration files for examples:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/local/Caddyfile",children:"Local auth only"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/local/registration/Caddyfile",children:"Local auth with registration"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["The plugin creates local authentication file (i.e. ",(0,i.jsx)(n.code,{children:"users.json"}),") if it does\nnot exist already."]}),"\n",(0,i.jsxs)(n.p,{children:["After starting the server, and find the following following log entries with\n",(0,i.jsx)(n.code,{children:"user_name"})," and ",(0,i.jsx)(n.code,{children:"user_secret"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{"level":"info","ts":1588704471.5784082,"logger":"http.authentication.providers.portal","msg":"created new user","user_id":"cd5f647a-cc04-4ae2-9d0a-2d5e9b95cf98","user_name":"webadmin","user_email":"webadmin@localdomain.local","user_claims":{"roles":"superadmin"}}\n{"level":"info","ts":1588704471.5784378,"logger":"http.authentication.providers.portal","msg":"created default superadmin user for the database","user_name":"webadmin","user_secret":"d87e7749-0dd8-482b-91a2-ada370263293"}\n'})}),"\n",(0,i.jsx)(n.p,{children:"Alternatively, use the following environment variables to instruct the plugin which username, email and password to use."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"AUTHP_ADMIN_USER"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"AUTHP_ADMIN_EMAIL"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"AUTHP_ADMIN_SECRET"})}),"\n"]})]})}function u(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>l,x:()=>c});var i=t(6540);const a={},o=i.createContext(a);function l(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:l(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);