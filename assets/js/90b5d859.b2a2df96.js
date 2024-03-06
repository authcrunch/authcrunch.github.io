"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9013],{1832:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>c,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>d});var i=t(4848),r=t(8453);const o={sidebar_position:8},c="Auto-Redirect URL",a={id:"authorize/auto-redirect-url",title:"Auto-Redirect URL",description:"HTTP Redirect",source:"@site/docs/authorize/auto-redirect-url.md",sourceDirName:"authorize",slug:"/authorize/auto-redirect-url",permalink:"/docs/authorize/auto-redirect-url",draft:!1,unlisted:!1,editUrl:"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authorize/auto-redirect-url.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"tutorialSidebar",previous:{title:"Token Verification",permalink:"/docs/authorize/token-verification"},next:{title:"Access Lists and Role-based Access Control (RBAC)",permalink:"/docs/authorize/acl-rbac"}},s={},d=[{value:"HTTP Redirect",id:"http-redirect",level:2},{value:"Javascript Redirect",id:"javascript-redirect",level:2},{value:"Login Hint",id:"login-hint",level:2},{value:"Configuration Example",id:"configuration-example",level:3},{value:"Additional scopes",id:"additional-scopes",level:2},{value:"Configuration Example",id:"configuration-example-1",level:3}];function l(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"auto-redirect-url",children:"Auto-Redirect URL"}),"\n",(0,i.jsx)(n.h2,{id:"http-redirect",children:"HTTP Redirect"}),"\n",(0,i.jsxs)(n.p,{children:["Consider the following configuration snippet. When the JWT plugin detects\nunauthenticated user, it forwards the user to ",(0,i.jsx)(n.code,{children:"https://auth.example.com"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      set auth url https://auth.example.com/auth\n    }\n  }\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["By default, the plugin adds the ",(0,i.jsx)(n.code,{children:"redirect_url"})," parameter in URL query\npointing back to the page where the plugin detected unauthenticated user.\nIt signals an authenticator to redirect where to redirect the user upon\nsuccessful authentication."]}),"\n",(0,i.jsxs)(n.p,{children:["If you would like to disable the addition of ",(0,i.jsx)(n.code,{children:"redirect_url"}),", please\nadd ",(0,i.jsx)(n.code,{children:"disable auth redirect query"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      set auth url https://auth.example.com/auth\n      disable auth redirect query\n    }\n  }\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["If you would like to change the parameter name, e.g. from ",(0,i.jsx)(n.code,{children:"redirect_url"}),"\nto ",(0,i.jsx)(n.code,{children:"referer_url"}),", use the ",(0,i.jsx)(n.code,{children:"set redirect query parameter"})," Caddyfile directive."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      set redirect query parameter referer_url\n    }\n  }\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The following Caddyfile directive changes the status code (default: ",(0,i.jsx)(n.code,{children:"302"}),") for\nthe redirects."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      set redirect status 307\n    }\n  }\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["If ",(0,i.jsx)(n.code,{children:"authorize"})," configuration contains the following directive, then the redirect\nis disabled and the request is refused with a HTTP ",(0,i.jsx)(n.code,{children:"401 Unauthorized"})," error."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      disable auth redirect\n    }\n  }\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Importantly, if the plugin finds expired token, it attempts to extract the\ntoken's issuer value. Then, it checks whether the value starts with ",(0,i.jsx)(n.code,{children:"http"}),".\nIf it is, then the ",(0,i.jsx)(n.code,{children:"set auth url"})," will be overwritten with the issuer's\nweb address."]}),"\n",(0,i.jsx)(n.h2,{id:"javascript-redirect",children:"Javascript Redirect"}),"\n",(0,i.jsxs)(n.p,{children:["The following directive enables Javascript-based redirect. This is useful when\nthe URI path contains pound (",(0,i.jsx)(n.code,{children:"#"}),") sign."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"{\n  security {\n    authorization policy mypolicy {\n      enable js redirect\n    }\n  }\n}\n"})}),"\n",(0,i.jsx)(n.h2,{id:"login-hint",children:"Login Hint"}),"\n",(0,i.jsxs)(n.p,{children:["Login hints are part of the\n",(0,i.jsx)(n.a,{href:"https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1",children:"OpenID Connect specification"}),"\nand can be used to notify an Authorization Server about the login identifier\nused by a user (e.g. to pre-fill fields in the login form)."]}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"enable login hint"})," command can be used to forward a login hint to the auth URL by passing it to a protected\nroute as a query parameter. In case the auth URL belongs to a portal defined in the ",(0,i.jsx)(n.code,{children:"authenticate"})," configuration,\nit will be automatically forwarded to the identity provider."]}),"\n",(0,i.jsxs)(n.p,{children:["By default, the ",(0,i.jsx)(n.code,{children:"enable login hint"})," accepts email addresses, phone numbers and alphanumeric characters. Using the\n",(0,i.jsx)(n.code,{children:"with"})," keyword in combination with one or more of the validator names ",(0,i.jsx)(n.code,{children:"email"}),", ",(0,i.jsx)(n.code,{children:"phone"})," and ",(0,i.jsx)(n.code,{children:"alphanumeric"}),", they can be\ntoggled individually. For example, the command ",(0,i.jsx)(n.code,{children:"enable login hint with email alphanumeric"})," would only forward email\naddresses and alphanumeric strings to the auth URL, but no phone numbers."]}),"\n",(0,i.jsx)(n.h3,{id:"configuration-example",children:"Configuration Example"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'{\n  security {\n    authorization policy mypolicy {\n      set auth url https://auth.example.com/auth\n      enable login hint\n    }\n  }\n}\n\n\nmyapp.com {\n        route /protected* {\n                authorize with mypolicy\n                respond "myapp is running"\n        }\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Given the above configuration, when a user visits ",(0,i.jsx)(n.code,{children:"https://myapp.com/protected?login_hint=myusername"}),",\nthe login hint will be forwarded to the auth URL and therefore the user will be forwarded to the\nfollowing URL:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"https://auth.example.com/auth?login_hint=myusername&redirect_url=https://myapp.com/protected\n"})}),"\n",(0,i.jsx)(n.h2,{id:"additional-scopes",children:"Additional scopes"}),"\n",(0,i.jsx)(n.p,{children:"Sometimes it is required to have a basic authorization block configure with the ability to inject scopes, into the OAUTH identity provider, that comes from the client. This would be useful to ask the user different scopes depending on your business logic."}),"\n",(0,i.jsxs)(n.p,{children:["This will indicate to the authenticator that will fetch from the request a query parameter ",(0,i.jsx)(n.code,{children:"additional_scopes"}),", and merge the conetnt into the OAUTH identity provider block."]}),"\n",(0,i.jsx)(n.p,{children:"If this is enable, the client can make a call like:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"myapp.com?additional_scopes=scopeA scope_B\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The previous example will then merge ",(0,i.jsx)(n.code,{children:"scopeA scope_B"})," into the current scopes configure in the OAUTH block."]}),"\n",(0,i.jsx)(n.h3,{id:"configuration-example-1",children:"Configuration Example"}),"\n",(0,i.jsx)(n.p,{children:"The syntax to enable client scopes to be injected into the identity provider follows:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'{\n  security {\n    oauth identity provider customer {\n      realm customerRealm\n      driver generic\n      client_id <THE CLIENT ID>\n      client_secret <THE CLIENT SECRET>\n      base_auth_url <THE BASE AUTHENTICATION URL>\n      scopes openid profile\n    }\n\n    authorization policy mypolicy {\n      set auth url /auth/oauth2/customerRealm\n      enable additional scopes\n    }\n  }\n}\n\nmyapp.com {\n        route /protected* {\n                authorize with mypolicy\n                respond "myapp is running"\n        }\n}\n'})})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>c,x:()=>a});var i=t(6540);const r={},o=i.createContext(r);function c(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);