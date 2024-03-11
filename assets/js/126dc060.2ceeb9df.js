"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3919],{6852:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>c,toc:()=>r});var s=t(4848),i=t(8453);const o={},a="AWS Cognito",c={id:"authenticate/oauth/backend-oauth2-0012-cognito",title:"AWS Cognito",description:"Find AWS Cognito integration example in the following Caddyfile",source:"@site/docs/authenticate/oauth/81-backend-oauth2-0012-cognito.md",sourceDirName:"authenticate/oauth",slug:"/authenticate/oauth/backend-oauth2-0012-cognito",permalink:"/docs/authenticate/oauth/backend-oauth2-0012-cognito",draft:!1,unlisted:!1,editUrl:"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authenticate/oauth/81-backend-oauth2-0012-cognito.md",tags:[],version:"current",sidebarPosition:81,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Keycloak",permalink:"/docs/authenticate/oauth/backend-oauth2-0011-keycloak"},next:{title:"Discord",permalink:"/docs/authenticate/oauth/backend-oauth2-0013-discord"}},d={},r=[{value:"Cognito User Pool",id:"cognito-user-pool",level:2},{value:"Cognito Client",id:"cognito-client",level:2},{value:"Cognito User",id:"cognito-user",level:2},{value:"User Login",id:"user-login",level:2}];function l(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"aws-cognito",children:"AWS Cognito"}),"\n",(0,s.jsxs)(n.p,{children:["Find AWS Cognito integration example in the following ",(0,s.jsx)(n.a,{href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/oauth/cognito/Caddyfile",children:(0,s.jsx)(n.code,{children:"Caddyfile"})}),"\nand associated ",(0,s.jsx)(n.a,{href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/oauth/cognito/caddy.env",children:"environment file"}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"cognito-user-pool",children:"Cognito User Pool"}),"\n",(0,s.jsx)(n.p,{children:"Follow the below screenshots to create new Cognito user pool."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(7708).A+"",width:"1186",height:"607"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(5815).A+"",width:"1170",height:"635"})}),"\n",(0,s.jsxs)(n.p,{children:["Here, add custom attribute ",(0,s.jsx)(n.code,{children:"roles"})," and ",(0,s.jsx)(n.code,{children:"timezone"}),".\nIt would help with role-based access."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(238).A+"",width:"861",height:"813"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(7953).A+"",width:"1169",height:"751"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(6824).A+"",width:"1141",height:"786"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(2579).A+"",width:"1170",height:"730"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(7370).A+"",width:"1183",height:"369"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(317).A+"",width:"1178",height:"363"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(7284).A+"",width:"1167",height:"677"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(6486).A+"",width:"1128",height:"719"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(5231).A+"",width:"1183",height:"479"})}),"\n",(0,s.jsx)(n.p,{children:"Review your selection."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(2772).A+"",width:"1163",height:"692"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(3901).A+"",width:"1143",height:"362"})}),"\n",(0,s.jsx)(n.p,{children:"Note the User Pool ID and update your environment file with it."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"export COGNITO_US_EAST_1_POOL_ID=us-east-1_UFeMzbuJe\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(1106).A+"",width:"1161",height:"328"})}),"\n",(0,s.jsx)(n.p,{children:'Next, browse to "App Integration", "App client settings". Enable Cognito User Pool\nand update relevant URL.'}),"\n",(0,s.jsx)(n.p,{children:"For example:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:['Set "Callback URL(s)" to ',(0,s.jsx)(n.code,{children:"https://auth.myfiosgateway.com:8443/oauth2/cognito-us-east-1/authorization-code-callback"})]}),"\n",(0,s.jsxs)(n.li,{children:['Set "Sign out URL(s)" to ',(0,s.jsx)(n.code,{children:"https://auth.myfiosgateway.com:8443/logout"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(4763).A+"",width:"1682",height:"807"})}),"\n",(0,s.jsx)(n.p,{children:"Next, create a random string for your Cognito domain and save it.\nThis step is mandatory for a working OAuth integration."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(9360).A+"",width:"1426",height:"651"})}),"\n",(0,s.jsx)(n.h2,{id:"cognito-client",children:"Cognito Client"}),"\n",(0,s.jsx)(n.p,{children:"During this step, you will extract Client ID and Secret and update environment file with:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"export COGNITO_US_EAST_1_CLIENT_ID=2jvuq8gkhfoh7u4fdfihiditj5\nexport COGNITO_US_EAST_1_CLIENT_SECRET=ldjkr0pn1jmo9lule3ge06ju13rhmsffda1vama1f80frlcvplf\n"})}),"\n",(0,s.jsx)(n.p,{children:'Note the "App client id" and click "Show Details".'}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(3921).A+"",width:"1164",height:"484"})}),"\n",(0,s.jsx)(n.p,{children:'Not the "App client secret".'}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(4938).A+"",width:"1148",height:"449"})}),"\n",(0,s.jsx)(n.h2,{id:"cognito-user",children:"Cognito User"}),"\n",(0,s.jsx)(n.p,{children:"During this step, you will create a user."}),"\n",(0,s.jsx)(n.p,{children:'Click "Create user".'}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(1581).A+"",width:"1161",height:"475"})}),"\n",(0,s.jsx)(n.p,{children:"Follow the selections below."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(374).A+"",width:"607",height:"502"})}),"\n",(0,s.jsxs)(n.p,{children:["After creating the user, the user will have ",(0,s.jsx)(n.code,{children:"FORCE_CHANGE_PASSWORD"})," status.\nWe will overwrite it via command-line."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(5567).A+"",width:"1335",height:"436"})}),"\n",(0,s.jsx)(n.p,{children:"Open AWS CloudShell."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(6544).A+"",width:"1328",height:"474"})}),"\n",(0,s.jsx)(n.p,{children:"Run the following commands in the terminal."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'export TARGET_POOL="us-east-1_UFeMzbuJe"\nexport TARGET_USER="jsmith"\nexport TARGET_USER_NAME="John Smith"\naws cognito-idp admin-set-user-password --user-pool-id ${TARGET_POOL} --username ${TARGET_USER} --password "The@Password" --permanent\naws cognito-idp admin-update-user-attributes --user-pool-id ${TARGET_POOL} --username ${TARGET_USER} \\\n  --user-attributes Name="name",Value="${TARGET_USER_NAME}" \\\n  --user-attributes Name="custom:roles",Value="authp/admin|authp/user" \\\n  --user-attributes Name="custom:timezone",Value="America/New_York"\naws cognito-idp admin-get-user --user-pool-id ${TARGET_POOL} --username ${TARGET_USER}\n'})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"roles"})," are being separated by ",(0,s.jsx)(n.code,{children:"|"})," (pipe)."]}),"\n",(0,s.jsx)(n.p,{children:"The above command set permanent user password (i.e. no need to do password change),\nset custom roles and timezone."}),"\n",(0,s.jsx)(n.p,{children:"Next, run the following command to review the created user:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"aws cognito-idp admin-get-user --user-pool-id ${TARGET_POOL} --username ${TARGET_USER}\n"})}),"\n",(0,s.jsx)(n.p,{children:"The output follows:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n    "Username": "jsmith",\n    "UserAttributes": [\n        {\n            "Name": "sub",\n            "Value": "55ddc31e-b818-4136-8fb8-84cfb31af537"\n        },\n        {\n            "Name": "custom:roles",\n            "Value": "authp/admin|authp/user"\n        },\n        {\n            "Name": "custom:timezone",\n            "Value": "America/New_York"\n        },\n        {\n            "Name": "email_verified",\n            "Value": "true"\n        },\n        {\n            "Name": "name",\n            "Value": "John Smith"\n        },\n        {\n            "Name": "email",\n            "Value": "jsmith@authcrunch.com"\n        }\n    ],\n    "UserCreateDate": "2022-04-23T17:12:05.282000+00:00",\n    "UserLastModifiedDate": "2022-04-23T17:30:43.896000+00:00",\n    "Enabled": true,\n    "UserStatus": "CONFIRMED"\n}\n'})}),"\n",(0,s.jsx)(n.h2,{id:"user-login",children:"User Login"}),"\n",(0,s.jsx)(n.p,{children:'Finally, start Caddy and browse to authentication portal.\nClick "AWS Cognito US" link to initiate authentication.'}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(3491).A+"",width:"455",height:"434"})}),"\n",(0,s.jsx)(n.p,{children:"You will be redirected to AWS Cognito for authentication."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(1864).A+"",width:"545",height:"520"})}),"\n",(0,s.jsx)(n.p,{children:'You will be redirected back to authentication portal after successful authentication.\nClick "My Identity" to see the contents of your user token.'}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(6081).A+"",width:"436",height:"450"})}),"\n",(0,s.jsx)(n.p,{children:"The token will contain your name email. However, the custom roles and timezone will not be there."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"AWS Cognito",src:t(5070).A+"",width:"652",height:"899"})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},3921:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_client_1-5b9938a17a3c8f5c8a386a1dd54735ce.png"},4938:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_client_2-af1a13910028660897d324a25f9fe92b.png"},1581:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_1-18c202118ad6101aa1890f0136c2838d.png"},374:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_2-dace5a7dd2abd999ba9a451e3c2afe5f.png"},5567:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_3-cc0ed0a1100e8517f65efb3202f9b958.png"},6544:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_4-5f7710600136beaa243b6ced02aaed45.png"},3491:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_login_1-aa374942942a3d845495750e730b6916.png"},1864:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_login_2-9ab8c6dfb69aef94dd14896f3e770881.png"},6081:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_login_3-76951b7c4744423fd7c7a2d96df814ba.png"},5070:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_login_4-cf6d313547f2d1eb8dcb407701913010.png"},7708:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_1-e34066845e96cd3a0393dbe0e6a5f107.png"},6486:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_10-e11fd21fe869749670ddfb78da272d08.png"},5231:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_11-fb5e2e274580facc4acdf71791045869.png"},2772:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_12-75cb2d75593880b6a030c4b5dd715f09.png"},3901:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_13-e355626e83275ff6964290b8b6444ada.png"},1106:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_14-9bf0c9f3a7d014ef54c03dc42c78efa8.png"},4763:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_15-6e2ec1095998c3c2b2fece1bc78c0fab.png"},9360:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_16-c7905bfcad1ef014efe168690b548453.png"},5815:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_2-a9df67aa03362e22212caba69fd41044.png"},238:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_3-8805efea31e7d4b7efa8e8841ed497a4.png"},7953:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_4-54c0d8d02b70f1ad0d69a15c28135bfa.png"},6824:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_5-adcb608915d346520d743dba907ef0f0.png"},2579:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_6-28e32deb1ce2192f4a7d025cdd8dab92.png"},7370:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_7-15c5091681ba03f7912fa7fbf9307b7e.png"},317:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_8-9b28b53132a3fd6ce4bf0d0d1976aca2.png"},7284:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cognito_user_pool_9-035155a8a9a5155ad3d7749fef66f765.png"},8453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>c});var s=t(6540);const i={},o=s.createContext(i);function a(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);