"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4078],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>h});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),l=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(u.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=l(r),h=a,f=d["".concat(u,".").concat(h)]||d[h]||s[h]||o;return r?n.createElement(f,i(i({ref:t},p),{},{components:r})):n.createElement(f,i({ref:t},p))}));function h(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var l=2;l<o;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},4514:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>s,frontMatter:()=>o,metadata:()=>c,toc:()=>l});var n=r(7462),a=(r(7294),r(3905));const o={},i="Generic Provider",c={unversionedId:"authenticate/oauth/backend-oauth2-0000-generic",id:"authenticate/oauth/backend-oauth2-0000-generic",title:"Generic Provider",description:"This Caddyfile",source:"@site/docs/authenticate/oauth/81-backend-oauth2-0000-generic.md",sourceDirName:"authenticate/oauth",slug:"/authenticate/oauth/backend-oauth2-0000-generic",permalink:"/docs/authenticate/oauth/backend-oauth2-0000-generic",draft:!1,editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/authenticate/oauth/81-backend-oauth2-0000-generic.md",tags:[],version:"current",sidebarPosition:81,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Overview",permalink:"/docs/authenticate/oauth/oauth2"},next:{title:"Okta",permalink:"/docs/authenticate/oauth/backend-oauth2-0001-okta"}},u={},l=[],p={toc:l};function s(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"generic-provider"},"Generic Provider"),(0,a.kt)("p",null,"This ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/oauth/generic/Caddyfile"},(0,a.kt)("inlineCode",{parentName:"a"},"Caddyfile")),"\nallows generic OAuth-based authentication."),(0,a.kt)("p",null,"When a user browses to login, the user will be redirected to the provider discovered via\n",(0,a.kt)("inlineCode",{parentName:"p"},"metadata_url")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"base_auth_url")," URLs."))}s.isMDXComponent=!0}}]);