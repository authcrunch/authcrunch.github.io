"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[142],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>d});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function r(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,l=e.originalType,s=e.parentName,u=r(e,["components","mdxType","originalType","parentName"]),m=p(a),d=i,h=m["".concat(s,".").concat(d)]||m[d]||c[d]||l;return a?n.createElement(h,o(o({ref:t},u),{},{components:a})):n.createElement(h,o({ref:t},u))}));function d(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var l=a.length,o=new Array(l);o[0]=m;var r={};for(var s in t)hasOwnProperty.call(t,s)&&(r[s]=t[s]);r.originalType=e,r.mdxType="string"==typeof e?e:i,o[1]=r;for(var p=2;p<l;p++)o[p]=a[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},7593:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>c,frontMatter:()=>l,metadata:()=>r,toc:()=>p});var n=a(7462),i=(a(7294),a(3905));const l={},o="Jumpcloud SAML Integration",r={unversionedId:"authenticate/saml/jumpcloud",id:"authenticate/saml/jumpcloud",title:"Jumpcloud SAML Integration",description:"This Caddyfile",source:"@site/docs/authenticate/saml/30-jumpcloud.md",sourceDirName:"authenticate/saml",slug:"/authenticate/saml/jumpcloud",permalink:"/docs/authenticate/saml/jumpcloud",draft:!1,editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/authenticate/saml/30-jumpcloud.md",tags:[],version:"current",sidebarPosition:30,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Azure Active Directory",permalink:"/docs/authenticate/saml/azure"},next:{title:"Overview",permalink:"/docs/authenticate/oauth/oauth2"}},s={},p=[],u={toc:p};function c(e){let{components:t,...l}=e;return(0,i.kt)("wrapper",(0,n.Z)({},u,l,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"jumpcloud-saml-integration"},"Jumpcloud SAML Integration"),(0,i.kt)("p",null,"This ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/saml/jumpcloud/Caddyfile"},(0,i.kt)("inlineCode",{parentName:"a"},"Caddyfile")),"\ncontains the configuration for the SAML integration."),(0,i.kt)("p",null,'First, browse to "User Authentication | SSO" and create a new application.'),(0,i.kt)("p",null,'Select "Custom SAML App".'),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App Registration - New Application",src:a(731).Z,width:"733",height:"653"})),(0,i.kt)("p",null,"Confirm new SSO connector instance."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App Registration - SSO connector",src:a(5480).Z,width:"726",height:"384"})),(0,i.kt)("p",null,'Provide app name, e.g. "MyFIOS Auth Portal".'),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App Registration - App Name",src:a(3640).Z,width:"1104",height:"633"})),(0,i.kt)("p",null,"Next, provide IdP Entity ID and SP Entity ID values. Here, ",(0,i.kt)("inlineCode",{parentName:"p"},"urn:auth-portal"),"."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App Registration - SSO Configuration",src:a(9246).Z,width:"894",height:"573"})),(0,i.kt)("p",null,"Then, provide the following:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"ACS URL: ",(0,i.kt)("inlineCode",{parentName:"li"},"https://auth.myfiosgateway.com:8443/saml/jumpcloud")),(0,i.kt)("li",{parentName:"ul"},"SAMLSubject NameID: ",(0,i.kt)("inlineCode",{parentName:"li"},"email")),(0,i.kt)("li",{parentName:"ul"},"SAMLSubject NameID Format: ",(0,i.kt)("inlineCode",{parentName:"li"},"urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress")),(0,i.kt)("li",{parentName:"ul"},"Signature Algorithm: ",(0,i.kt)("inlineCode",{parentName:"li"},"RSA-SHA256")),(0,i.kt)("li",{parentName:"ul"},"Login URL: ",(0,i.kt)("inlineCode",{parentName:"li"},"https://auth.myfiosgateway.com:8443/"))),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App Registration - SSO Configuration",src:a(7588).Z,width:"748",height:"698"})),(0,i.kt)("p",null,"Next, provide IDP URL: ",(0,i.kt)("inlineCode",{parentName:"p"},"https://sso.jumpcloud.com/saml2/auth-portal-saml")),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App Registration - SSO Configuration",src:a(3216).Z,width:"741",height:"676"})),(0,i.kt)("p",null,"Finally, add User Attributes."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"),": ",(0,i.kt)("inlineCode",{parentName:"li"},"email")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/displayname"),": ",(0,i.kt)("inlineCode",{parentName:"li"},"fullname"))),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App Registration - User Attributes",src:a(2933).Z,width:"1057",height:"604"})),(0,i.kt)("p",null,'After saving the configuration, browse back to "User Authentication | SSO".'),(0,i.kt)("p",null,"Re-enter the application, browse to SSO and download JumpCloud Metadata.\nThis would be the ",(0,i.kt)("inlineCode",{parentName:"p"},"JumpCloud-saml2-metadata.xml")," file referenced in the config."),(0,i.kt)("p",null,'Additionally, while in the app, click "IDP Certificate Valid" and "Download certificate.\nThis would be the ',(0,i.kt)("inlineCode",{parentName:"p"},"certificate.pem")," file referenced in the config."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App Registration - IDP Certificate",src:a(5786).Z,width:"273",height:"398"})),(0,i.kt)("p",null,"The setup is now complete."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App Registration - Complete",src:a(3610).Z,width:"866",height:"309"})),(0,i.kt)("p",null,"When a user accesses Jumpcloud user portal, the user sees the new app in the\nlist of application."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Jumpcloud SAML App User Portal",src:a(5209).Z,width:"604",height:"356"})))}c.isMDXComponent=!0},731:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_00a-b2675c9931cf3662d58933b5da7d4c1c.png"},5480:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_00b-4d226986cbe27df39a99a0daedc650d8.png"},3640:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_01-0cc4d3740b996ffe71c2a6b7a9a78862.png"},9246:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_02-af52054c368ac0f5f4a304ceda31cf80.png"},7588:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_03-545df7302ba84dca66b38e6b1a4a2303.png"},3216:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_04-25e98341bd12b02c7ae33f48c48414c8.png"},2933:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_05-4716fabe425e13cf51814e4c119f1b81.png"},5786:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_05a-e7a852af7583e0f735141b1e69cf4f79.png"},3610:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_06-229dbaa84af84bf43dc127da8bdd2a8b.png"},5209:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jumpcloud_saml_sso_07-336695ed7649d7967e1679b0451630ad.png"}}]);