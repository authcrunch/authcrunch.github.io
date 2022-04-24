"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[142],{3905:function(t,e,n){n.d(e,{Zo:function(){return s},kt:function(){return d}});var a=n(7294);function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function l(t,e){if(null==t)return{};var n,a,i=function(t,e){if(null==t)return{};var n,a,i={},r=Object.keys(t);for(a=0;a<r.length;a++)n=r[a],e.indexOf(n)>=0||(i[n]=t[n]);return i}(t,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);for(a=0;a<r.length;a++)n=r[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(i[n]=t[n])}return i}var u=a.createContext({}),p=function(t){var e=a.useContext(u),n=e;return t&&(n="function"==typeof t?t(e):o(o({},e),t)),n},s=function(t){var e=p(t.components);return a.createElement(u.Provider,{value:e},t.children)},c={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},m=a.forwardRef((function(t,e){var n=t.components,i=t.mdxType,r=t.originalType,u=t.parentName,s=l(t,["components","mdxType","originalType","parentName"]),m=p(n),d=i,f=m["".concat(u,".").concat(d)]||m[d]||c[d]||r;return n?a.createElement(f,o(o({ref:e},s),{},{components:n})):a.createElement(f,o({ref:e},s))}));function d(t,e){var n=arguments,i=e&&e.mdxType;if("string"==typeof t||i){var r=n.length,o=new Array(r);o[0]=m;var l={};for(var u in e)hasOwnProperty.call(e,u)&&(l[u]=e[u]);l.originalType=t,l.mdxType="string"==typeof t?t:i,o[1]=l;for(var p=2;p<r;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7593:function(t,e,n){n.r(e),n.d(e,{assets:function(){return s},contentTitle:function(){return u},default:function(){return d},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return c}});var a=n(3117),i=n(102),r=(n(7294),n(3905)),o=["components"],l={},u="Jumpcloud SAML Integration",p={unversionedId:"authenticate/saml/jumpcloud",id:"authenticate/saml/jumpcloud",title:"Jumpcloud SAML Integration",description:"This Caddyfile",source:"@site/docs/authenticate/saml/30-jumpcloud.md",sourceDirName:"authenticate/saml",slug:"/authenticate/saml/jumpcloud",permalink:"/docs/authenticate/saml/jumpcloud",editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/authenticate/saml/30-jumpcloud.md",tags:[],version:"current",sidebarPosition:30,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Azure Active Directory",permalink:"/docs/authenticate/saml/azure"},next:{title:"Overview",permalink:"/docs/authenticate/oauth/oauth2"}},s={},c=[],m={toc:c};function d(t){var e=t.components,l=(0,i.Z)(t,o);return(0,r.kt)("wrapper",(0,a.Z)({},m,l,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"jumpcloud-saml-integration"},"Jumpcloud SAML Integration"),(0,r.kt)("p",null,"This ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/saml/jumpcloud/Caddyfile"},(0,r.kt)("inlineCode",{parentName:"a"},"Caddyfile")),"\ncontains the configuration for the SAML integration."),(0,r.kt)("p",null,'First, browse to "User Authentication | SSO" and create a new application.'),(0,r.kt)("p",null,'Select "Custom SAML App".'),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App Registration - New Application",src:n(731).Z,width:"733",height:"653"})),(0,r.kt)("p",null,"Confirm new SSO connector instance."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App Registration - SSO connector",src:n(5480).Z,width:"726",height:"384"})),(0,r.kt)("p",null,'Provide app name, e.g. "MyFIOS Auth Portal".'),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App Registration - App Name",src:n(3640).Z,width:"1104",height:"633"})),(0,r.kt)("p",null,"Next, provide IdP Entity ID and SP Entity ID values. Here, ",(0,r.kt)("inlineCode",{parentName:"p"},"urn:auth-portal"),"."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App Registration - SSO Configuration",src:n(9246).Z,width:"894",height:"573"})),(0,r.kt)("p",null,"Then, provide the following:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"ACS URL: ",(0,r.kt)("inlineCode",{parentName:"li"},"https://auth.myfiosgateway.com:8443/saml/jumpcloud")),(0,r.kt)("li",{parentName:"ul"},"SAMLSubject NameID: ",(0,r.kt)("inlineCode",{parentName:"li"},"email")),(0,r.kt)("li",{parentName:"ul"},"SAMLSubject NameID Format: ",(0,r.kt)("inlineCode",{parentName:"li"},"urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress")),(0,r.kt)("li",{parentName:"ul"},"Signature Algorithm: ",(0,r.kt)("inlineCode",{parentName:"li"},"RSA-SHA256")),(0,r.kt)("li",{parentName:"ul"},"Login URL: ",(0,r.kt)("inlineCode",{parentName:"li"},"https://auth.myfiosgateway.com:8443/"))),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App Registration - SSO Configuration",src:n(7588).Z,width:"748",height:"698"})),(0,r.kt)("p",null,"Next, provide IDP URL: ",(0,r.kt)("inlineCode",{parentName:"p"},"https://sso.jumpcloud.com/saml2/auth-portal-saml")),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App Registration - SSO Configuration",src:n(3216).Z,width:"741",height:"676"})),(0,r.kt)("p",null,"Finally, add User Attributes."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"),": ",(0,r.kt)("inlineCode",{parentName:"li"},"email")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/displayname"),": ",(0,r.kt)("inlineCode",{parentName:"li"},"fullname"))),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App Registration - User Attributes",src:n(2933).Z,width:"1057",height:"604"})),(0,r.kt)("p",null,'After saving the configuration, browse back to "User Authentication | SSO".'),(0,r.kt)("p",null,"Re-enter the application, browse to SSO and download JumpCloud Metadata.\nThis would be the ",(0,r.kt)("inlineCode",{parentName:"p"},"JumpCloud-saml2-metadata.xml")," file referenced in the config."),(0,r.kt)("p",null,'Additionally, while in the app, click "IDP Certificate Valid" and "Download certificate.\nThis would be the ',(0,r.kt)("inlineCode",{parentName:"p"},"certificate.pem")," file referenced in the config."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App Registration - IDP Certificate",src:n(5786).Z,width:"273",height:"398"})),(0,r.kt)("p",null,"The setup is now complete."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App Registration - Complete",src:n(3610).Z,width:"866",height:"309"})),(0,r.kt)("p",null,"When a user accesses Jumpcloud user portal, the user sees the new app in the\nlist of application."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Jumpcloud SAML App User Portal",src:n(5209).Z,width:"604",height:"356"})))}d.isMDXComponent=!0},731:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_00a-b2675c9931cf3662d58933b5da7d4c1c.png"},5480:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_00b-4d226986cbe27df39a99a0daedc650d8.png"},3640:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_01-0cc4d3740b996ffe71c2a6b7a9a78862.png"},9246:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_02-af52054c368ac0f5f4a304ceda31cf80.png"},7588:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_03-545df7302ba84dca66b38e6b1a4a2303.png"},3216:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_04-25e98341bd12b02c7ae33f48c48414c8.png"},2933:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_05-4716fabe425e13cf51814e4c119f1b81.png"},5786:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_05a-e7a852af7583e0f735141b1e69cf4f79.png"},3610:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_06-229dbaa84af84bf43dc127da8bdd2a8b.png"},5209:function(t,e,n){e.Z=n.p+"assets/images/jumpcloud_saml_sso_07-336695ed7649d7967e1679b0451630ad.png"}}]);