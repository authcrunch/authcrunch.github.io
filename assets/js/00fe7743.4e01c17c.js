"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1209],{1716:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>r,default:()=>h,frontMatter:()=>s,metadata:()=>c,toc:()=>l});var i=t(4848),a=t(8453);const s={},r="Azure Active Directory",c={id:"authenticate/saml/azure",title:"Azure Active Directory",description:"Azure Active Directory supports Office 365 Applications.",source:"@site/docs/authenticate/saml/20-azure.md",sourceDirName:"authenticate/saml",slug:"/authenticate/saml/azure",permalink:"/docs/authenticate/saml/azure",draft:!1,unlisted:!1,editUrl:"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authenticate/saml/20-azure.md",tags:[],version:"current",sidebarPosition:20,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"SAML Overview",permalink:"/docs/authenticate/saml/saml"},next:{title:"Jumpcloud SAML Integration",permalink:"/docs/authenticate/saml/jumpcloud"}},d={},l=[{value:"Azure AD SAML Configuration",id:"azure-ad-saml-configuration",level:2},{value:"Set Up Azure AD Application",id:"set-up-azure-ad-application",level:2},{value:"Configure SAML Authentication",id:"configure-saml-authentication",level:2},{value:"Azure AD IdP Metadata and Certificate",id:"azure-ad-idp-metadata-and-certificate",level:2},{value:"User Interface Options",id:"user-interface-options",level:2},{value:"Development Notes",id:"development-notes",level:2}];function o(e){const n={code:"code",h1:"h1",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"azure-active-directory",children:"Azure Active Directory"}),"\n",(0,i.jsx)(n.p,{children:"Azure Active Directory supports Office 365 Applications."}),"\n",(0,i.jsx)(n.h2,{id:"azure-ad-saml-configuration",children:"Azure AD SAML Configuration"}),"\n",(0,i.jsx)(n.p,{children:"The Azure SAML identity provider configuration:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'      saml identity provider azure {\n          realm azure\n          driver azure\n          idp_metadata_location /etc/gatekeeper/auth/idp/azure_ad_app_metadata.xml\n          idp_sign_cert_location /etc/gatekeeper/auth/idp/azure_ad_app_signing_cert.pem\n          tenant_id "1b9e886b-8ff2-4378-b6c8-6771259a5f51"\n          application_id "623cae7c-e6b2-43c5-853c-2059c9b2cb58"\n          application_name "My Gatekeeper"\n          entity_id "urn:caddy:mygatekeeper"\n          acs_url https://mygatekeeper/auth/saml/azure\n          acs_url https://mygatekeeper.local/auth/saml/azure\n          acs_url https://192.168.10.10:3443/auth/saml/azure\n          acs_url https://localhost:3443/auth/saml/azure\n      }\n'})}),"\n",(0,i.jsx)(n.p,{children:"The plugin supports the following parameters for Azure Active\nDirectory (Office 365) applications:"}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:(0,i.jsx)(n.strong,{children:"Parameter Name"})}),(0,i.jsx)(n.th,{children:(0,i.jsx)(n.strong,{children:"Description"})})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"idp_metadata_location"})}),(0,i.jsx)(n.td,{children:"The url or path to Azure IdP Metadata"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"idp_sign_cert_location"})}),(0,i.jsx)(n.td,{children:"The path to Azure IdP Signing Certificate"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"tenant_id"})}),(0,i.jsx)(n.td,{children:"Azure Tenant ID"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"application_id"})}),(0,i.jsx)(n.td,{children:"Azure Application ID"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"application_name"})}),(0,i.jsx)(n.td,{children:"Azure Application Name"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"entity_id"})}),(0,i.jsx)(n.td,{children:"Azure Application Identifier (Entity ID)"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"acs_url"})}),(0,i.jsx)(n.td,{children:"Assertion Consumer Service URLs"})]})]})]}),"\n",(0,i.jsxs)(n.p,{children:["Use the ",(0,i.jsx)(n.code,{children:"acs_url"})," directive to list all URLs the users of the application\ncan reach it at. One URL per line:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"  acs_url https://mygatekeeper/auth/saml/azure\n  acs_url https://mygatekeeper.local/auth/saml/azure\n  acs_url https://192.168.10.10:3443/auth/saml/azure\n  acs_url https://localhost:3443/auth/saml/azure\n"})}),"\n",(0,i.jsx)(n.h2,{id:"set-up-azure-ad-application",children:"Set Up Azure AD Application"}),"\n",(0,i.jsx)(n.p,{children:'In Azure AD, you will have an application, e.g. "My Gatekeeper".'}),"\n",(0,i.jsxs)(n.p,{children:["The application is a Caddy web server running on port 3443 on\n",(0,i.jsx)(n.code,{children:"localhost"}),'. This example meant to emphasize that the authorization\nis asynchronious. That is when a user clicks on "My Gatekeeper" icon\nin Office 365, the browser takes the user to a sign in page\nat URL ',(0,i.jsx)(n.code,{children:"https://localhost:3443/saml"}),"."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure AD App Registration - Overview",src:t(1905).A+"",width:"1423",height:"585"})}),"\n",(0,i.jsx)(n.p,{children:"The Application Identifiers are as follows:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Application (client) ID: ",(0,i.jsx)(n.code,{children:"623cae7c-e6b2-43c5-853c-2059c9b2cb58"})]}),"\n",(0,i.jsxs)(n.li,{children:["Directory (tenant) ID: ",(0,i.jsx)(n.code,{children:"1b9e886b-8ff2-4378-b6c8-6771259a5f51"})]}),"\n",(0,i.jsxs)(n.li,{children:["Object ID: ",(0,i.jsx)(n.code,{children:"515d2e8b-7548-413f-abee-a23ece1ea576"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:'The "Branding" page configures "Home Page URL".'}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure AD App Registration - Branding",src:t(9825).A+"",width:"963",height:"405"})}),"\n",(0,i.jsx)(n.p,{children:'For demostration purposes, we will create the following "Roles" in the application:'}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:(0,i.jsx)(n.strong,{children:"Azure Role Name"})}),(0,i.jsx)(n.th,{children:(0,i.jsx)(n.strong,{children:"Role Name in SAML Assertion"})})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"Viewer"}),(0,i.jsx)(n.td,{children:"AzureAD_Viewer"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"Editor"}),(0,i.jsx)(n.td,{children:"AzureAD_Editor"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"Administrator"}),(0,i.jsx)(n.td,{children:"AzureAD_Administrator"})]})]})]}),"\n",(0,i.jsxs)(n.p,{children:['Use "Manifest" tab to add roles in the manifest via ',(0,i.jsx)(n.code,{children:"appRoles"})," key:"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure AD App Registration - Manifest - User Roles",src:t(9391).A+"",width:"815",height:"856"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "allowedMemberTypes": [\n    "User"\n  ],\n  "description": "Administrator",\n  "displayName": "Administrator",\n  "id": "91287df2-7028-4d5f-b5ae-5d489ba217dd",\n  "isEnabled": true,\n  "lang": null,\n  "origin": "Application",\n  "value": "AzureAD_Administrator"\n},\n{\n  "allowedMemberTypes": [\n    "User"\n  ],\n  "description": "Editor",\n  "displayName": "Editor",\n  "id": "d482d827-1757-4f60-9bea-021c10037674",\n  "isEnabled": true,\n  "lang": null,\n  "origin": "Application",\n  "value": "AzureAD_Editor"\n},\n{\n  "allowedMemberTypes": [\n    "User"\n  ],\n  "description": "Viewer",\n  "displayName": "Viewer",\n  "id": "c69f7abd-0a88-401e-b515-92d74b6fff2f",\n  "isEnabled": true,\n  "lang": null,\n  "origin": "Application",\n  "value": "AzureAD_Viewer"\n}\n'})}),"\n",(0,i.jsx)(n.p,{children:"After, we added the roles, we could assign any of the roles to a user:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure AD App - Users and Groups - Add User",src:t(2837).A+"",width:"1092",height:"427"})}),"\n",(0,i.jsx)(n.p,{children:"The app is now available to the provisioned users in Office 365:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Office 365 - Access Application",src:t(7296).A+"",width:"1375",height:"390"})}),"\n",(0,i.jsx)(n.h2,{id:"configure-saml-authentication",children:"Configure SAML Authentication"}),"\n",(0,i.jsx)(n.p,{children:'Go to "Enterprise Application" and browse to "My Gatekeeper" application.'}),"\n",(0,i.jsx)(n.p,{children:'There, click "Single Sign-On" and select "SAML" as the authentication method.'}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure AD App - Enable SAML",src:t(2253).A+"",width:"1642",height:"595"})}),"\n",(0,i.jsx)(n.p,{children:'Next, in the "Set up Single Sign-On with SAML", provide the following\n"Basic SAML Configuration":'}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Identifier (Entity ID): ",(0,i.jsx)(n.code,{children:"urn:caddy:mygatekeeper"})]}),"\n",(0,i.jsxs)(n.li,{children:["Reply URL (Assertion Consumer Service URL): ",(0,i.jsx)(n.code,{children:"https://localhost:3443/auth/saml/azure"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure AD App - Basic SAML Configuration",src:t(8103).A+"",width:"1032",height:"591"})}),"\n",(0,i.jsx)(n.p,{children:'Under "User Attributes & Claims", add the following claims to the list of\ndefault claims:'}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:(0,i.jsx)(n.strong,{children:"Namespace"})}),(0,i.jsx)(n.th,{children:(0,i.jsx)(n.strong,{children:"Claim name"})}),(0,i.jsx)(n.th,{children:(0,i.jsx)(n.strong,{children:"Value"})})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"http://claims.contoso.com/SAML/Attributes"})}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"RoleSessionName"})}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"user.userprincipalname"})})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"http://claims.contoso.com/SAML/Attributes"})}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"Role"})}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"user.assignedroles"})})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"http://claims.contoso.com/SAML/Attributes"})}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"MaxSessionDuration"})}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"3600"})})]})]})]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure AD App - User Attributes and Claims",src:t(5707).A+"",width:"1588",height:"1056"})}),"\n",(0,i.jsx)(n.p,{children:"Next, record the following:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"App Federation Metadata Url"}),"\n",(0,i.jsx)(n.li,{children:"Login URL"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Further, download:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Federation Metadata XML"}),"\n",(0,i.jsx)(n.li,{children:"Certificate (Base64 and Raw)"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure AD App - SAML Signing Certificate",src:t(1976).A+"",width:"1286",height:"842"})}),"\n",(0,i.jsx)(n.h2,{id:"azure-ad-idp-metadata-and-certificate",children:"Azure AD IdP Metadata and Certificate"}),"\n",(0,i.jsxs)(n.p,{children:["The following command downloads IdP metadata file for Azure AD Tenant with\nID ",(0,i.jsx)(n.code,{children:"1b9e886b-8ff2-4378-b6c8-6771259a5f51"}),". Please note the ",(0,i.jsx)(n.code,{children:"xmllint"})," utility\nis a part of ",(0,i.jsx)(n.code,{children:"libxml2"})," library."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"mkdir -p /etc/gatekeeper/auth/saml/idp/\ncurl -s -L -o /tmp/federationmetadata.xml https://login.microsoftonline.com/1b9e886b-8ff2-4378-b6c8-6771259a5f51/federationmetadata/2007-06/federationmetadata.xml\nsudo mkdir -p /etc/gatekeeper/auth/saml/idp/\ncat /tmp/federationmetadata.xml | xmllint --format - | sudo tee /etc/gatekeeper/auth/saml/idp/azure_ad_app_metadata.xml\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"/etc/gatekeeper/auth/saml/idp/azure_ad_app_metadata.xml"})," contains IdP metadata.\nThis file contains the data necessary to verify the SAML claims received by this\nservice and signed by Azure AD. The ",(0,i.jsx)(n.code,{children:"idp_metadata"})," argument is being used to\npass the location of IdP metadata."]}),"\n",(0,i.jsxs)(n.p,{children:['Next, download the "Certificate (Base64)" and store it in\n',(0,i.jsx)(n.code,{children:"/etc/gatekeeper/auth/saml/idp/azure_ad_app_signing_cert.pem"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"user-interface-options",children:"User Interface Options"}),"\n",(0,i.jsxs)(n.p,{children:["First option is a login button on the login server web page. Once Azure AD has\nbeen enabled, the ",(0,i.jsx)(n.code,{children:"/auth/saml/azure"}),' page will have "Sign in with Office 365" button']}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure AD App - Login with Azure Button",src:t(6759).A+"",width:"914",height:"266"})}),"\n",(0,i.jsx)(n.p,{children:"Second option is Office 365 applications. When a user click on the\napplication's icon in Office 365, the user gets redirected to the web\nserver by Office 365."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Office 365 - Access Application",src:t(7296).A+"",width:"1375",height:"390"})}),"\n",(0,i.jsxs)(n.p,{children:["The URL is ",(0,i.jsx)(n.code,{children:"https://localhost:3443/auth/saml/azure"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"development-notes",children:"Development Notes"}),"\n",(0,i.jsxs)(n.p,{children:["The below are the headers of the redirected ",(0,i.jsx)(n.code,{children:"POST"}),' request that the user\'s\nbrowser makes upon clicking "My Gatekeeper" application:']}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"Method: POST\nURL: /auth/saml/azure\nProtocol: HTTP/2.0\nHost: localhost:3443\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\nAccept-Encoding: gzip, deflate, br\nAccept-Language: en-US,en;q=0.9,ru;q=0.8\nCache-Control: max-age=0\nContent-Length: 7561\nContent-Type: application/x-www-form-urlencoded\nOrigin: https://login.microsoftonline.com\nReferer: https://login.microsoftonline.com/\nSec-Fetch-Mode: navigate\nSec-Fetch-Site: cross-site\nUpgrade-Insecure-Requests: 1\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The above redirect contains ",(0,i.jsx)(n.code,{children:"login.microsoftonline.com"})," in the request's\n",(0,i.jsx)(n.code,{children:"Referer"})," header. It is the trigger to perform SAML-based authorization."]})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(o,{...e})}):o(e)}},2837:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure_app_add_user-1f19881fe6d6abf9ec23cf5061f0176c.png"},9825:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure_app_registration_branding-7c73477772c2491b2ec4f998c95db9f4.png"},1905:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure_app_registration_overview-35c34125b59dc508d1fb8554f38ccd28.png"},9391:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure_app_registration_user_roles-d088f32b06da193e5f4aeb06d993ee7f.png"},5707:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure_app_saml_claims-ad72d6d2af25a4497e4e6125829a09e4.png"},2253:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure_app_saml_enable-d0dfe13267af30178c1cef2324e34577.png"},8103:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure_app_saml_id-9a78bd4df4619e00f1ae2082e7d3f901.png"},1976:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure_app_saml_other-c41ed80342c9439cd637bc73da5d0e4a.png"},7296:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure_app_user_access-576cc284cb3f931f98c2a030031788fc.png"},6759:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/login_with_azure_button-f68dd5b807c8eee483bc68a75e12f11b.png"},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>c});var i=t(6540);const a={},s=i.createContext(a);function r(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);