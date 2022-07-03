"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[559],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>y});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var u=r.createContext({}),c=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=c(e.components);return r.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,u=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),f=c(n),y=i,d=f["".concat(u,".").concat(y)]||f[y]||p[y]||a;return n?r.createElement(d,o(o({ref:t},s),{},{components:n})):r.createElement(d,o({ref:t},s))}));function y(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=f;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},6768:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>o,default:()=>p,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var r=n(7462),i=(n(7294),n(3905));const a={sidebar_position:4},o="Plugin Syntax",l={unversionedId:"authorize/syntax",id:"authorize/syntax",title:"Plugin Syntax",description:"",source:"@site/docs/authorize/syntax.md",sourceDirName:"authorize",slug:"/authorize/syntax",permalink:"/docs/authorize/syntax",draft:!1,editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/authorize/syntax.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Authorize Plugin Overview",permalink:"/docs/authorize/intro"},next:{title:"Getting Started",permalink:"/docs/authorize/getting-started"}},u={},c=[],s={toc:c};function p(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"plugin-syntax"},"Plugin Syntax"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"{\n  security {\n    authorization policy <policy_name> {\n      crypto default token name <TOKEN_NAME>\n      crypto default token lifetime <SECONDS>\n\n      crypto key token name <TOKEN_NAME>\n      crypto key <ID> token name <TOKEN_NAME>\n\n      crypto key <verify|sign|sign-verify|auto> <SHARED_SECRET>\n      crypto key <verify|sign|sign-verify|auto> from env <ENV_VAR_WITH_KEY>\n\n      crypto key <ID> <verify|sign|sign-verify|auto> <SHARED_SECRET>\n      crypto key <ID> <verify|sign|sign-verify|auto> from <directory|file> <PATH>\n\n      crypto key <ID> <verify|sign|sign-verify|auto> from env <ENV_VAR_WITH_KEY>\n      crypto key <ID> <verify|sign|sign-verify|auto> from env <ENV_VAR_NAME> as <directory|file>\n\n      set auth url <path>\n      set forbidden url <path>\n      set token sources <value...>\n      set user identity <claim_field>\n      set redirect query parameter <value>\n      set redirect status <3xx>\n\n      disable auth redirect query\n      disable auth redirect\n\n      allow <field> <value...>\n      allow <field> <value...> with <get|post|put|patch|delete> to <uri>\n      allow <field> <value...> with <get|post|put|patch|delete>\n      allow <field> <value...> to <uri>\n      default <allow|deny>\n\n      acl rule {\n        comment <value>\n        [no] [exact|partial|prefix|suffix|regex] match <field> <value> ... <valueN>\n        [no] [exact|partial|prefix|suffix|regex] match method <http_method_name>\n        [no] [exact|partial|prefix|suffix|regex] match path <http_path_uri>\n        <allow|deny> [stop] [counter] [log <error|warn|info|debug>]\n        field <field> [not] exists\n      }\n\n      validate path acl\n      validate source address\n      validate bearer header\n\n      enable js redirect\n      enable strip token\n      \n      enable login hint\n      enable login hint with <email|phone|alphanumeric>\n\n      inject headers with claims\n    }\n  }\n}\n")))}p.isMDXComponent=!0}}]);