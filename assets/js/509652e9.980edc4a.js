"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6898],{9904:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>d});var s=a(4848),t=a(8453);const i={sidebar_position:42},r="User Transforms",o={id:"authenticate/user-transforms",title:"User Transforms",description:"A user transform allows performing the following once a user has passed",source:"@site/docs/authenticate/42-user-transforms.md",sourceDirName:"authenticate",slug:"/authenticate/user-transforms",permalink:"/docs/authenticate/user-transforms",draft:!1,unlisted:!1,editUrl:"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authenticate/42-user-transforms.md",tags:[],version:"current",sidebarPosition:42,frontMatter:{sidebar_position:42},sidebar:"tutorialSidebar",previous:{title:"Authorization Cookie",permalink:"/docs/authenticate/auth-cookie"},next:{title:"Usage Examples",permalink:"/docs/authenticate/usage-examples"}},c={},d=[{value:"Add Roles",id:"add-roles",level:2},{value:"Add UI Links",id:"add-ui-links",level:2},{value:"Force Multi-Factor Authentication",id:"force-multi-factor-authentication",level:2},{value:"Deny Access",id:"deny-access",level:2},{value:"Inject Custom Claims",id:"inject-custom-claims",level:2}];function l(e){const n={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"user-transforms",children:"User Transforms"}),"\n",(0,s.jsx)(n.p,{children:"A user transform allows performing the following once a user has passed\nauthentication:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"add/remove user roles"}),"\n",(0,s.jsx)(n.li,{children:"add link to UI portal page"}),"\n",(0,s.jsx)(n.li,{children:"require multi-factor authentication (MFA/2FA)"}),"\n",(0,s.jsx)(n.li,{children:"require accepting term and conditions"}),"\n",(0,s.jsx)(n.li,{children:"block/deny access (by not issuing a token)"}),"\n",(0,s.jsx)(n.li,{children:"injecting custom, arbitrary claims into a token"}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"add-roles",children:"Add Roles"}),"\n",(0,s.jsxs)(n.p,{children:["The following transform matches ",(0,s.jsx)(n.code,{children:"sub"})," field and grants ",(0,s.jsx)(n.code,{children:"authp/viewer"})," role:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"  transform user {\n    exact match sub github.com/greenpau\n    action add role authp/viewer\n  }\n"})}),"\n",(0,s.jsxs)(n.p,{children:["The following transform adds role ",(0,s.jsx)(n.code,{children:"verified"})," to Facebook-authenticated user\nwith id of ",(0,s.jsx)(n.code,{children:"123456789"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"  transform user {\n    exact match sub 123456789\n    exact match origin facebook\n    action add role verified\n  }\n"})}),"\n",(0,s.jsxs)(n.p,{children:["The following transform adds the role ",(0,s.jsx)(n.code,{children:"contoso_users"})," to users with an email\naddress from the contoso.com domain:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"  transform user {\n    suffix match email @contoso.com\n    add role contoso_users\n  }\n"})}),"\n",(0,s.jsx)(n.h2,{id:"add-ui-links",children:"Add UI Links"}),"\n",(0,s.jsx)(n.p,{children:"The following transform, in addition to the above adds a link to a user's\nportal page:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'  transform user {\n    exact match sub github.com/greenpau\n    action add role authp/viewer\n    ui link "Caddy Version" /version icon "las la-code-branch"\n  }\n'})}),"\n",(0,s.jsx)(n.h2,{id:"force-multi-factor-authentication",children:"Force Multi-Factor Authentication"}),"\n",(0,s.jsxs)(n.p,{children:["The following transform requires to pass multi-factor authentication when the\nauthenticated user's email is ",(0,s.jsx)(n.code,{children:"webadmin@localdomain.local"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"  transform user {\n    match email webadmin@localdomain.local\n    require mfa\n  }\n"})}),"\n",(0,s.jsx)(n.h2,{id:"deny-access",children:"Deny Access"}),"\n",(0,s.jsxs)(n.p,{children:["The following transform blocks a user with email ",(0,s.jsx)(n.code,{children:"anonymous@badactor.com"}),"\nfrom getting authenticated:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"  transform user {\n    match email anonymous@badactor.com\n    block\n  }\n"})}),"\n",(0,s.jsx)(n.h2,{id:"inject-custom-claims",children:"Inject Custom Claims"}),"\n",(0,s.jsx)(n.p,{children:"The syntax:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"action add <claim_name> <claim_value> as <string|list>\naction add nested [arg1 ... argN] with [arg1 ... argN] as <string|list>\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Here, if a user is authentication in ",(0,s.jsx)(n.code,{children:"local"})," realm and has email address\nof ",(0,s.jsx)(n.code,{children:"webadmin@localdomain.local"}),", then a number of custom claims will be\nadded to the token issued by the portal."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'  transform user {\n    match realm local\n    match email webadmin@localdomain.local\n    action add foo bar as string\n    action add nested "acl" "paths" "/*/users/**" as map\n    action add nested "acl" "paths" "/*/conversations/**" as map\n    action add nested "acl" "paths" "/*/sessions/**" as map\n    action add nested "acl" "paths" "/*/devices/**" as map\n    action add nested "metadata" "language" with "english" as string\n    action add nested "metadata" "interests" with "movies" "gaming" as list\n  }\n'})}),"\n",(0,s.jsx)(n.p,{children:"The outcome follows:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  "acl": {\n    "paths": {\n      "/*/conversations/**": {},\n      "/*/devices/**": {},\n      "/*/sessions/**": {},\n      "/*/users/**": {}\n    }\n  },\n  "metadata": {\n    "interests": [\n      "movies",\n      "gaming"\n    ],\n    "language": "english"\n  },\n  "foo": "bar"\n}\n'})}),"\n",(0,s.jsxs)(n.p,{children:["Alternatively, one can add ",(0,s.jsx)(n.code,{children:"name"})," and ",(0,s.jsx)(n.code,{children:"picture"})," (avatar) claims:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'  transform user {\n    match realm local\n    match email webadmin@localdomain.local\n    action add name "Paul Greenberg"\n    action add picture "https://avatars.githubusercontent.com/u/3826416?v=4" as string\n  }\n'})})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},8453:(e,n,a)=>{a.d(n,{R:()=>r,x:()=>o});var s=a(6540);const t={},i=s.createContext(t);function r(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);