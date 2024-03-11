"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[416],{6188:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>s,default:()=>l,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var o=t(4848),i=t(8453);const r={sidebar_position:6},s="Token Discovery",c={id:"authorize/token-discovery",title:"Token Discovery",description:"The crypto key token name  indicates the name of the token to be",source:"@site/docs/authorize/token-discovery.md",sourceDirName:"authorize",slug:"/authorize/token-discovery",permalink:"/docs/authorize/token-discovery",draft:!1,unlisted:!1,editUrl:"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authorize/token-discovery.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Getting Started",permalink:"/docs/authorize/getting-started"},next:{title:"IP Address Filtering",permalink:"/docs/authorize/ip-filter"}},a={},d=[];function h(e){const n={code:"code",h1:"h1",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"token-discovery",children:"Token Discovery"}),"\n",(0,o.jsxs)(n.p,{children:["The ",(0,o.jsx)(n.code,{children:"crypto key token name <NAME>"})," indicates the name of the token to be\nsearched in the token sources. By default, it is set to ",(0,o.jsx)(n.code,{children:"jwt_access_token"}),"\nand ",(0,o.jsx)(n.code,{children:"access_token"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:["The ",(0,o.jsx)(n.code,{children:"set token sources"})," configures where the plugin looks for an authorization\ntoken. By default, it looks in Authorization header, cookies, and query\nparameters. The way to change the order of the lookup or to limit the\nsearch to a specific sources is using the following ",(0,o.jsx)(n.code,{children:"Caddyfile"})," directive."]}),"\n",(0,o.jsx)(n.p,{children:"Limits the search of JWT tokens in cookies only."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      set token sources cookie\n    }\n  }\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:"Limits the search of JWT tokens cookies and query parameters."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      set token sources cookie query\n    }\n  }\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:'Reorders the default priority of the search of JWT tokens from "cookie",\n"header", "query" to "header", "query", and "cookie".'}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      set token sources header query cookie\n    }\n  }\n}\n"})}),"\n",(0,o.jsxs)(n.p,{children:["Further, the following ",(0,o.jsx)(n.code,{children:"Caddyfile"})," directive instructs the plugin to\nsearch for ",(0,o.jsx)(n.code,{children:"Authorization: Bearer <JWT_TOKEN>"})," header and authorize\nthe found token:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      validate bearer header\n    }\n  }\n}\n"})}),"\n",(0,o.jsxs)(n.p,{children:["Test it with the following ",(0,o.jsx)(n.code,{children:"curl"})," command:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:'curl --insecure -H "Authorization: Bearer JWT_TOKEN" -v https://localhost:8443/myapp\n'})})]})}function l(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>c});var o=t(6540);const i={},r=o.createContext(i);function s(e){const n=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),o.createElement(r.Provider,{value:n},e.children)}}}]);