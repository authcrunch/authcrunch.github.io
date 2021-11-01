"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2224],{3905:function(e,t,n){n.d(t,{kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),p=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,u=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=p(n),d=a,h=m["".concat(u,".").concat(d)]||m[d]||c[d]||i;return n?r.createElement(h,o(o({ref:t},s),{},{components:n})):r.createElement(h,o({ref:t},s))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=s;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},8008:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return u},metadata:function(){return p},toc:function(){return c},default:function(){return m}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],l={},u="SAML Overview",p={unversionedId:"authenticate/saml/saml",id:"authenticate/saml/saml",isDocsHomePage:!1,title:"SAML Overview",description:"The plugin supports the following SAML identity providers (IdP):",source:"@site/docs/authenticate/saml/10-saml.md",sourceDirName:"authenticate/saml",slug:"/authenticate/saml/saml",permalink:"/docs/authenticate/saml/saml",editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/authenticate/saml/10-saml.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"LDAP Authentication Architecture",permalink:"/docs/authenticate/ldap/search"},next:{title:"Azure Active Directory",permalink:"/docs/authenticate/saml/azure"}},c=[{value:"Time Synchronization",id:"time-synchronization",children:[],level:2},{value:"Configuration",id:"configuration",children:[],level:2}],s={toc:c};function m(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"saml-overview"},"SAML Overview"),(0,i.kt)("p",null,"The plugin supports the following SAML identity providers (IdP):"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Azure Active Directory (Office 365) Applications")),(0,i.kt)("p",null,"If you would like to see the support for the following identity providers,\nplease reach out:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Salesforce"),(0,i.kt)("li",{parentName:"ul"},"Okta"),(0,i.kt)("li",{parentName:"ul"},"Ping Identity")),(0,i.kt)("h2",{id:"time-synchronization"},"Time Synchronization"),(0,i.kt)("p",null,"Importantly, SAML assertion validation checks timestamps. It is\ncritical that the application validating the assertions maintains\naccurate clock. The out of sync time WILL result in failed\nauthentications."),(0,i.kt)("h2",{id:"configuration"},"Configuration"),(0,i.kt)("p",null,"The following configuration is common across variations of SAML backend:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"      backends {\n        azure_saml_backend {\n          method saml\n          realm azure\n          provider azure\n        }\n      }\n")),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"th"},"Parameter Name")),(0,i.kt)("th",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"th"},"Description")))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"method")),(0,i.kt)("td",{parentName:"tr",align:null},"Must be set to ",(0,i.kt)("inlineCode",{parentName:"td"},"saml"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"realm")),(0,i.kt)("td",{parentName:"tr",align:null},"The realm is used to distinguish between various SAML authentication providers")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"provider")),(0,i.kt)("td",{parentName:"tr",align:null},"It is either ",(0,i.kt)("inlineCode",{parentName:"td"},"generic")," or specific, e.g. ",(0,i.kt)("inlineCode",{parentName:"td"},"azure"),", ",(0,i.kt)("inlineCode",{parentName:"td"},"okta"),", etc.")))),(0,i.kt)("p",null,"The URL for the SAML endpoint is: ",(0,i.kt)("inlineCode",{parentName:"p"},"<AUTH_PORTAL_PATH>/saml/<REALM_NAME>"),"."),(0,i.kt)("p",null,"If you specify ",(0,i.kt)("inlineCode",{parentName:"p"},"realm")," as ",(0,i.kt)("inlineCode",{parentName:"p"},"azure")," and the portal is being served at\n",(0,i.kt)("inlineCode",{parentName:"p"},"/auth"),", then you could access the endpoint via ",(0,i.kt)("inlineCode",{parentName:"p"},"/auth/saml/azure"),"."),(0,i.kt)("p",null,"The Reply URL could be ",(0,i.kt)("inlineCode",{parentName:"p"},"https://localhost:8443/auth/saml/azure"),"."))}m.isMDXComponent=!0}}]);