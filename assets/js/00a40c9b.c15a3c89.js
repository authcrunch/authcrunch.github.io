"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8181],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=p(n),m=a,h=d["".concat(l,".").concat(m)]||d[m]||c[m]||o;return n?r.createElement(h,s(s({ref:t},u),{},{components:n})):r.createElement(h,s({ref:t},u))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var p=2;p<o;p++)s[p]=n[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4349:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>c,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:1},s="Single Sign-On with SAML",i={unversionedId:"apps/sso",id:"apps/sso",title:"Single Sign-On with SAML",description:"AWS SSO",source:"@site/docs/apps/sso.md",sourceDirName:"apps",slug:"/apps/sso",permalink:"/docs/apps/sso",draft:!1,editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/apps/sso.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Messaging Providers",permalink:"/docs/messaging/intro"}},l={},p=[{value:"AWS SSO",id:"aws-sso",level:2},{value:"Configuration",id:"configuration",level:3}],u={toc:p};function c(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"single-sign-on-with-saml"},"Single Sign-On with SAML"),(0,a.kt)("h2",{id:"aws-sso"},"AWS SSO"),(0,a.kt)("p",null,"The ",(0,a.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_federated-users.html"},"Identity Federation with SAML 2.0"),"\nallows creating trust between authentication portal as an Identity Provider (IdP)\nand AWS as the service provider."),(0,a.kt)("p",null,"The authentication portal generates a SAML authentication response that includes assertions\nthat identify the user and include attributes about the user. You can also configure the portal\nto include a SAML assertion attribute called ",(0,a.kt)("inlineCode",{parentName:"p"},"SessionDuration")," that specifies how long\nthe console session is valid. You can also configure the portal to pass attributes as\nsession tags. The portal sends this response via the client browser to AWS SAML\nendpoint."),(0,a.kt)("p",null,"The ",(0,a.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_saml_assertions.html"},"Configuring SAML assertions for the authentication response"),"\ndescribes how the authentication portal crafts the XML request to AWS SAML endpoint, i.e. ",(0,a.kt)("inlineCode",{parentName:"p"},"https://region-code.signin.aws.amazon.com/saml"),"."),(0,a.kt)("p",null,"For example, the ",(0,a.kt)("inlineCode",{parentName:"p"},"Attributes/Role"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-xml"},'<Attribute Name="https://aws.amazon.com/SAML/Attributes/Role">\n  <AttributeValue>arn:aws:iam::account-number:role/role-name1,arn:aws:iam::account-number:saml-provider/provider-name</AttributeValue>\n  <AttributeValue>arn:aws:iam::account-number:role/role-name2,arn:aws:iam::account-number:saml-provider/provider-name</AttributeValue>\n  <AttributeValue>arn:aws:iam::account-number:role/role-name3,arn:aws:iam::account-number:saml-provider/provider-name</AttributeValue>\n</Attribute>\n')),(0,a.kt)("p",null,"The ",(0,a.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_enable-console-saml.html"},"Enabling SAML 2.0 federated users to access the AWS Management Console"),"\noutlines the steps necessary to enable SSO on AWS side."),(0,a.kt)("p",null,"The ",(0,a.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_saml.html"},"Creating a role for SAML 2.0 federation"),"\ndescribes how to create an IAM role for use with SAML federation."),(0,a.kt)("h3",{id:"configuration"},"Configuration"),(0,a.kt)("p",null,"The steps necessary to enable AWS SSO in the plugin follow:"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Generate Self-Signed ceritficate and private key"),(0,a.kt)("li",{parentName:"ol"},"Add Caddyfile directives enabling AWS SSO"),(0,a.kt)("li",{parentName:"ol"},"Add Caddyfile user transforms with AWS SSO roles"),(0,a.kt)("li",{parentName:"ol"},"Download metadata file")),(0,a.kt)("p",null,"First, generate self-signed certificate:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'openssl req -x509 -nodes -sha256 -days 1095 -newkey rsa:4096 \\\n  -keyout authp_saml.key -out authp_saml.crt \\\n  -subj "/C=US/ST=New York/L=New York/O=AuthPortal/OU=AuthPortalSAMLIdP/CN=AuthPortalSAMLUser"\n')),(0,a.kt)("p",null,"TBD."))}c.isMDXComponent=!0}}]);