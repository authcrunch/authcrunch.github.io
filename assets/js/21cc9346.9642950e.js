"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3200],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>m});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=n.createContext({}),s=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},y=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),y=s(r),m=o,d=y["".concat(p,".").concat(m)]||y[m]||u[m]||i;return r?n.createElement(d,a(a({ref:t},l),{},{components:r})):n.createElement(d,a({ref:t},l))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=y;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var s=2;s<i;s++)a[s]=r[s];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}y.displayName="MDXCreateElement"},9266:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>a,default:()=>u,frontMatter:()=>i,metadata:()=>c,toc:()=>s});var n=r(7462),o=(r(7294),r(3905));const i={sidebar_position:14},a="Miscellaneous",c={unversionedId:"authorize/encryption",id:"authorize/encryption",title:"Miscellaneous",description:"Encryption Keys",source:"@site/docs/authorize/encryption.md",sourceDirName:"authorize",slug:"/authorize/encryption",permalink:"/docs/authorize/encryption",draft:!1,editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/authorize/encryption.md",tags:[],version:"current",sidebarPosition:14,frontMatter:{sidebar_position:14},sidebar:"tutorialSidebar",previous:{title:"Basic and API Key Authentication",permalink:"/docs/authorize/basic_api_key_auth"},next:{title:"Credentials Management",permalink:"/docs/credentials/intro"}},p={},s=[{value:"Encryption Keys",id:"encryption-keys",level:2}],l={toc:s};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"miscellaneous"},"Miscellaneous"),(0,o.kt)("h2",{id:"encryption-keys"},"Encryption Keys"),(0,o.kt)("p",null,"The following command generates ECDSA key with P-256 curve:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"openssl genpkey \\\n  -algorithm EC \\\n  -pkeyopt ec_param_enc:named_curve \\\n  -pkeyopt ec_paramgen_curve:P-256 | \\\n  openssl pkcs8 -topk8 -nocrypt -outform der > testdata/misckeys/test_4_es256_pri.pem\n")))}u.isMDXComponent=!0}}]);