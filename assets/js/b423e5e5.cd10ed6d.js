"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9769],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return h}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),s=l(n),h=a,f=s["".concat(c,".").concat(h)]||s[h]||d[h]||o;return n?r.createElement(f,i(i({ref:t},p),{},{components:n})):r.createElement(f,i({ref:t},p))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=s;var u={};for(var c in t)hasOwnProperty.call(t,c)&&(u[c]=t[c]);u.originalType=e,u.mdxType="string"==typeof e?e:a,i[1]=u;for(var l=2;l<o;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},494:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return p},default:function(){return s}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],u={},c="Advanced Features",l={unversionedId:"authenticate/oauth/backend-oauth2-endpoint",id:"authenticate/oauth/backend-oauth2-endpoint",isDocsHomePage:!1,title:"Advanced Features",description:"OAuth 2.0 Endpoint Delayed Start",source:"@site/docs/authenticate/oauth/82-backend-oauth2-endpoint.md",sourceDirName:"authenticate/oauth",slug:"/authenticate/oauth/backend-oauth2-endpoint",permalink:"/docs/authenticate/oauth/backend-oauth2-endpoint",editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/authenticate/oauth/82-backend-oauth2-endpoint.md",tags:[],version:"current",sidebarPosition:82,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Ping Identity",permalink:"/docs/authenticate/oauth/backend-oauth2-0010-pingid"},next:{title:"X.509 Configuration",permalink:"/docs/authenticate/x509/x509"}},p=[{value:"OAuth 2.0 Endpoint Delayed Start",id:"oauth-20-endpoint-delayed-start",children:[],level:2},{value:"OAuth 2.0 Endpoint Retry Attempts",id:"oauth-20-endpoint-retry-attempts",children:[],level:2}],d={toc:p};function s(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"advanced-features"},"Advanced Features"),(0,o.kt)("h2",{id:"oauth-20-endpoint-delayed-start"},"OAuth 2.0 Endpoint Delayed Start"),(0,o.kt)("p",null,"The following configuration allows delaying getting key material of upstream\nOAuth 2.0 server."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"      backends {\n        google_oauth2_backend {\n          method oauth2\n          ...\n          delay_start 5\n")),(0,o.kt)("p",null,"This would delay querying the upstream server for 5 seconds."),(0,o.kt)("h2",{id:"oauth-20-endpoint-retry-attempts"},"OAuth 2.0 Endpoint Retry Attempts"),(0,o.kt)("p",null,"The following configuration permits for retries when getting key material of\nupstream OAuth 2.0 server."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"      backends {\n        google_oauth2_backend {\n          method oauth2\n          ...\n          retry_attempts 3\n          retry_interval 10\n")),(0,o.kt)("p",null,"If unsuccessful at reaching a remote OAuth 2.0 server, the plugin would\ntry connecting 2 more times at 10 second intervals."))}s.isMDXComponent=!0}}]);