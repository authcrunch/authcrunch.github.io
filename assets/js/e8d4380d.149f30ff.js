"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2890],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},o=Object.keys(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=i.createContext({}),s=function(e){var t=i.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},p=function(e){var t=s(e.components);return i.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},d=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=s(n),h=a,m=d["".concat(c,".").concat(h)]||d[h]||u[h]||o;return n?i.createElement(m,r(r({ref:t},p),{},{components:n})):i.createElement(m,r({ref:t},p))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,r=new Array(o);r[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,r[1]=l;for(var s=2;s<o;s++)r[s]=n[s];return i.createElement.apply(null,r)}return i.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1368:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>s});var i=n(7462),a=(n(7294),n(3905));const o={},r="Miscellaneous",l={unversionedId:"authenticate/misc",id:"authenticate/misc",title:"Miscellaneous",description:"Binding to Privileged Ports",source:"@site/docs/authenticate/90-misc.md",sourceDirName:"authenticate",slug:"/authenticate/misc",permalink:"/docs/authenticate/misc",draft:!1,editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/authenticate/90-misc.md",tags:[],version:"current",sidebarPosition:90,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"X.509 Configuration",permalink:"/docs/authenticate/x509/"},next:{title:"Developer Notes",permalink:"/docs/authenticate/dev"}},c={},s=[{value:"Binding to Privileged Ports",id:"binding-to-privileged-ports",level:2},{value:"Recording Source IP Address in JWT Token",id:"recording-source-ip-address-in-jwt-token",level:2},{value:"Session ID Cache",id:"session-id-cache",level:2},{value:"Shortcuts",id:"shortcuts",level:2},{value:"Auto-Redirect URL",id:"auto-redirect-url",level:2},{value:"Basic Authentication",id:"basic-authentication",level:2},{value:"JSON API",id:"json-api",level:2},{value:"Authenticate",id:"authenticate",level:3},{value:"User Identity",id:"user-identity",level:3}],p={toc:s};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,i.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"miscellaneous"},"Miscellaneous"),(0,a.kt)("h2",{id:"binding-to-privileged-ports"},"Binding to Privileged Ports"),(0,a.kt)("p",null,"It may be necessary to bind Caddy to privileged port, e.g. 80 or 443.\nGrant the ",(0,a.kt)("inlineCode",{parentName:"p"},"cap_net_bind_service")," capability to the Caddy binary, e.g.:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"sudo systemctl stop gatekeeper\nsudo rm -rf /usr/local/bin/gatekeeper\nsudo cp bin/caddy /usr/local/bin/gatekeeper\nsudo setcap cap_net_bind_service=+ep /usr/local/bin/gatekeeper\nsudo systemctl start gatekeeper\n")),(0,a.kt)("h2",{id:"recording-source-ip-address-in-jwt-token"},"Recording Source IP Address in JWT Token"),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"enable source ip tracking")," Caddyfile directive instructs\nthe plugin to record the source IP address when issuing claims."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"{\n  security {\n    authentication portal myportal {\n      enable source ip tracking\n    }\n\n    authorization policy mypolicy {\n      validate source address\n    }\n  }\n}\n\nauth.myfiosgateway.com {\n  authenticate with myportal\n}\n\napp.myfiosgateway.com {\n  authorize with mypolicy\n}\n")),(0,a.kt)("p",null,"This could be useful to force re-authentication when the client IP\naddress changes."),(0,a.kt)("h2",{id:"session-id-cache"},"Session ID Cache"),(0,a.kt)("p",null,"When the plugin issues JWT tokens, it either passes ",(0,a.kt)("inlineCode",{parentName:"p"},"jti")," values\nfrom upstream providers or generates its own ",(0,a.kt)("inlineCode",{parentName:"p"},"jti")," values."),(0,a.kt)("p",null,"The plugin stores the mappings between ",(0,a.kt)("inlineCode",{parentName:"p"},"jti")," value and associated\ndata in a cache. The associated data contains claims and the\nmetadata from the identity stores/providers which authenticated a particular session."),(0,a.kt)("p",null,"This cache is used to assess whether a claim holder is able using\ncertain portal's capabilities, e.g. add public SSH/GPG key, configure\nMFA tokens, change password, etc."),(0,a.kt)("h2",{id:"shortcuts"},"Shortcuts"),(0,a.kt)("p",null,"The following Caddyfile shortcuts could be used to configure local, OAuth 2.0\nidentity stores and providers:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"{\n  security {\n    local identity store local <path>\n    oauth identity provider google <client_id> <client_secret>\n    oauth identity provider github <client_id> <client_secret>\n    oauth identity provider facebook <client_id> <client_secret>\n    }\n  }\n}\n\nauth.myfiosgateway.com {\n  authenticate with myportal\n}\n")),(0,a.kt)("h2",{id:"auto-redirect-url"},"Auto-Redirect URL"),(0,a.kt)("p",null,"Consider the following configuration snippet. When the JWT plugin detects\nunauthenticated user, it forwards the user to ",(0,a.kt)("inlineCode",{parentName:"p"},"https://auth.myfiosgateway.com"),".\nThe ",(0,a.kt)("inlineCode",{parentName:"p"},"redirect_url")," in URL query creates ",(0,a.kt)("inlineCode",{parentName:"p"},"AUTH_PORTAL_REDIRECT_URL")," cookie\nin the users session. Upon successful authentication, the portal\nclears the cookie and redirects the user to the path specified in\n",(0,a.kt)("inlineCode",{parentName:"p"},"AUTH_PORTAL_REDIRECT_URL")," cookie."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"{\n  security {\n    authentication portal myportal\n\n    authorization policy mypolicy {\n      set auth url https://auth.myfiosgateway.com/login?redirect_url=https://app.myfiosgateway.com\n    }\n  }\n}\n\nauth.myfiosgateway.com {\n  authenticate with myportal\n}\n\napp.myfiosgateway.com {\n  authorize with mypolicy\n}\n")),(0,a.kt)("h2",{id:"basic-authentication"},"Basic Authentication"),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"/basic/login/<realm>")," endpoint provides a way to trigger Basic HTTP authentication."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"curl -v --user 'webadmin:asd3kldkjld23HJh33jDnx!@1' https://auth.myfiosgateway.com:8443/basic/login/local\n")),(0,a.kt)("p",null,"The output follows. The token is in the ",(0,a.kt)("inlineCode",{parentName:"p"},"authorization")," header and ",(0,a.kt)("inlineCode",{parentName:"p"},"access_token")," cookie."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"< HTTP/2 303\n< authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3Mzc2NDUsImp0aSI6IktzRXFpdTRqVXFQajJxUHJRZjhuWlEwSlFSell1R015MmlqU1oiLCJpYXQiOjE2Mzg3MzQwNDUsImlzcyI6Imh0dHBzOi8vYXV0aC5teWZpb3NnYXRld2F5LmNvbTo4NDQzL2Jhc2ljL2xvZ2luL2xvY2FsIiwibmJmIjoxNjM4NzMzOTg1MDAwLCJzdWIiOiJ3ZWJhZG1pbiIsImVtYWlsIjoid2ViYWRtaW5AbG9jYWxkb21haW4ubG9jYWwiLCJyb2xlcyI6WyJhdXRocC9hZG1pbiJdLCJvcmlnaW4iOiJsb2NhbCIsImFkZHIiOiIxMC4wLjIuMiJ9.gJXu5Dzj1VsI-QAWOv1kOcfMI8v5luiri4hmIOI1fL1XVnscaCOUyixpZLGRbqXCMhd8v4XBsdJUCVeMJ3RMFw\n< cache-control: no-store\n< content-type: text/plain\n< location: https://auth.myfiosgateway.com:8443/portal\n< pragma: no-cache\n< server: Caddy\n< set-cookie: access_token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3Mzc2NDUsImp0aSI6IktzRXFpdTRqVXFQajJxUHJRZjhuWlEwSlFSell1R015MmlqU1oiLCJpYXQiOjE2Mzg3MzQwNDUsImlzcyI6Imh0dHBzOi8vYXV0aC5teWZpb3NnYXRld2F5LmNvbTo4NDQzL2Jhc2ljL2xvZ2luL2xvY2FsIiwibmJmIjoxNjM4NzMzOTg1MDAwLCJzdWIiOiJ3ZWJhZG1pbiIsImVtYWlsIjoid2ViYWRtaW5AbG9jYWxkb21haW4ubG9jYWwiLCJyb2xlcyI6WyJhdXRocC9hZG1pbiJdLCJvcmlnaW4iOiJsb2NhbCIsImFkZHIiOiIxMC4wLjIuMiJ9.gJXu5Dzj1VsI-QAWOv1kOcfMI8v5luiri4hmIOI1fL1XVnscaCOUyixpZLGRbqXCMhd8v4XBsdJUCVeMJ3RMFw; Domain=myfiosgateway.com; Path=/; Secure; HttpOnly;\n< set-cookie: AUTHP_SANDBOX_ID=delete; Domain=myfiosgateway.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;\n< content-length: 0\n< date: Sun, 05 Dec 2021 19:54:05 GMT\n<\n* Connection #0 to host auth.myfiosgateway.com left intact\n")),(0,a.kt)("h2",{id:"json-api"},"JSON API"),(0,a.kt)("h3",{id:"authenticate"},"Authenticate"),(0,a.kt)("p",null,"The following command provides a programmatic way to authenticate to ",(0,a.kt)("inlineCode",{parentName:"p"},"/login")," endpoint:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'curl -X POST https://auth.myfiosgateway.com:8443/login \\\n   -H \'Accept: application/json\' \\\n   -H \'Content-Type: application/json\' \\\n   -d \'{"username":"webadmin","password":"asd3kldkjld23HJh33jDnx!@1","realm":"local"}\'\n')),(0,a.kt)("p",null,"The output follows."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'{"token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3MzgyMjEsImp0aSI6IlN6d2JiOXI5eG5NeVlHUE5IbGZHeklQVlc5VHVLY1VlcndMbmNHR1BtIiwiaWF0IjoxNjM4NzM0NjIxLCJpc3MiOiJodHRwczovL2F1dGgubXlmaW9zZ2F0ZXdheS5jb206ODQ0My9sb2dpbiIsIm5iZiI6MTYzODczNDU2MTAwMCwic3ViIjoid2ViYWRtaW4iLCJlbWFpbCI6IndlYmFkbWluQGxvY2FsZG9tYWluLmxvY2FsIiwicm9sZXMiOlsiYXV0aHAvYWRtaW4iLCJhdXRocC91c2VyIl0sIm9yaWdpbiI6ImxvY2FsIiwiYWRkciI6IjEwLjAuMi4yIn0.QuSld2zKYtQX5gPIUlg7glRb7GXuieXm7ALxBTRd2dxCK4T-cZN-2KiK376Z1sxSFf3P3PA-ycrcazjdU5XETQ","token_name":"access_token"}\n')),(0,a.kt)("h3",{id:"user-identity"},"User Identity"),(0,a.kt)("p",null,"The following command provides a programmatic way to get information from ",(0,a.kt)("inlineCode",{parentName:"p"},"/whoami"),"\nendpoint using the previously acquired JWT token. This works well for the\ncreation of user badge."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"curl -X GET https://auth.myfiosgateway.com:8443/whoami \\\n   -H 'Accept: application/json' \\\n   -H 'Content-Type: application/json' \\\n   -H 'Authorization: Bearer: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3MzgyMjEsImp0aSI6IlN6d2JiOXI5eG5NeVlHUE5IbGZHeklQVlc5VHVLY1VlcndMbmNHR1BtIiwiaWF0IjoxNjM4NzM0NjIxLCJpc3MiOiJodHRwczovL2F1dGgubXlmaW9zZ2F0ZXdheS5jb206ODQ0My9sb2dpbiIsIm5iZiI6MTYzODczNDU2MTAwMCwic3ViIjoid2ViYWRtaW4iLCJlbWFpbCI6IndlYmFkbWluQGxvY2FsZG9tYWluLmxvY2FsIiwicm9sZXMiOlsiYXV0aHAvYWRtaW4iLCJhdXRocC91c2VyIl0sIm9yaWdpbiI6ImxvY2FsIiwiYWRkciI6IjEwLjAuMi4yIn0.QuSld2zKYtQX5gPIUlg7glRb7GXuieXm7ALxBTRd2dxCK4T-cZN-2KiK376Z1sxSFf3P3PA-ycrcazjdU5XETQ'\n")),(0,a.kt)("p",null,"The output contains basic user information:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "exp": 1638738221,\n  "jti": "Szwbb9r9xnMyYGPNHlfGzIPVW9TuKcUerwLncGGPm",\n  "iat": 1638734621,\n  "iss": "https://auth.myfiosgateway.com:8443/login",\n  "nbf": 1638734561000,\n  "sub": "webadmin",\n  "email": "webadmin@localdomain.local",\n  "roles": [\n    "authp/admin",\n    "authp/user"\n  ],\n  "origin": "local",\n  "addr": "10.0.2.2"\n}\n')))}u.isMDXComponent=!0}}]);