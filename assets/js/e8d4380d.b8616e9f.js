"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4325],{1468:(e,i,t)=>{t.r(i),t.d(i,{assets:()=>r,contentTitle:()=>c,default:()=>h,frontMatter:()=>a,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"authenticate/misc","title":"Miscellaneous","description":"Binding to Privileged Ports","source":"@site/docs/authenticate/90-misc.md","sourceDirName":"authenticate","slug":"/authenticate/misc","permalink":"/docs/authenticate/misc","draft":false,"unlisted":false,"editUrl":"https://github.com/authcrunch/authcrunch.github.io/edit/main/docs/authenticate/90-misc.md","tags":[],"version":"current","sidebarPosition":90,"frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"X.509","permalink":"/docs/authenticate/x509/"},"next":{"title":"Developer Notes","permalink":"/docs/authenticate/dev"}}');var o=t(4848),s=t(8453);const a={},c="Miscellaneous",r={},l=[{value:"Binding to Privileged Ports",id:"binding-to-privileged-ports",level:2},{value:"Recording Source IP Address in JWT Token",id:"recording-source-ip-address-in-jwt-token",level:2},{value:"Session ID Cache",id:"session-id-cache",level:2},{value:"Shortcuts",id:"shortcuts",level:2},{value:"Auto-Redirect URL",id:"auto-redirect-url",level:2},{value:"Basic Authentication",id:"basic-authentication",level:2},{value:"JSON API",id:"json-api",level:2},{value:"Authenticate",id:"authenticate",level:3},{value:"User Identity",id:"user-identity",level:3},{value:"Logout",id:"logout",level:2},{value:"Logout with Redirect URL Query Parameter",id:"logout-with-redirect-url-query-parameter",level:3},{value:"External Endpoint Logout",id:"external-endpoint-logout",level:3}];function d(e){const i={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i.header,{children:(0,o.jsx)(i.h1,{id:"miscellaneous",children:"Miscellaneous"})}),"\n",(0,o.jsx)(i.h2,{id:"binding-to-privileged-ports",children:"Binding to Privileged Ports"}),"\n",(0,o.jsxs)(i.p,{children:["It may be necessary to bind Caddy to privileged port, e.g. 80 or 443.\nGrant the ",(0,o.jsx)(i.code,{children:"cap_net_bind_service"})," capability to the Caddy binary, e.g.:"]}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{className:"language-bash",children:"sudo systemctl stop gatekeeper\nsudo rm -rf /usr/local/bin/gatekeeper\nsudo cp bin/caddy /usr/local/bin/gatekeeper\nsudo setcap cap_net_bind_service=+ep /usr/local/bin/gatekeeper\nsudo systemctl start gatekeeper\n"})}),"\n",(0,o.jsx)(i.h2,{id:"recording-source-ip-address-in-jwt-token",children:"Recording Source IP Address in JWT Token"}),"\n",(0,o.jsxs)(i.p,{children:["The ",(0,o.jsx)(i.code,{children:"enable source ip tracking"})," Caddyfile directive instructs\nthe plugin to record the source IP address when issuing claims."]}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{children:"{\n  security {\n    authentication portal myportal {\n      enable source ip tracking\n    }\n\n    authorization policy mypolicy {\n      validate source address\n    }\n  }\n}\n\nauth.myfiosgateway.com {\n  authenticate with myportal\n}\n\napp.myfiosgateway.com {\n  authorize with mypolicy\n}\n"})}),"\n",(0,o.jsx)(i.p,{children:"This could be useful to force re-authentication when the client IP\naddress changes."}),"\n",(0,o.jsx)(i.h2,{id:"session-id-cache",children:"Session ID Cache"}),"\n",(0,o.jsxs)(i.p,{children:["When the plugin issues JWT tokens, it either passes ",(0,o.jsx)(i.code,{children:"jti"})," values\nfrom upstream providers or generates its own ",(0,o.jsx)(i.code,{children:"jti"})," values."]}),"\n",(0,o.jsxs)(i.p,{children:["The plugin stores the mappings between ",(0,o.jsx)(i.code,{children:"jti"})," value and associated\ndata in a cache. The associated data contains claims and the\nmetadata from the identity stores/providers which authenticated a particular session."]}),"\n",(0,o.jsx)(i.p,{children:"This cache is used to assess whether a claim holder is able using\ncertain portal's capabilities, e.g. add public SSH/GPG key, configure\nMFA tokens, change password, etc."}),"\n",(0,o.jsx)(i.h2,{id:"shortcuts",children:"Shortcuts"}),"\n",(0,o.jsx)(i.p,{children:"The following Caddyfile shortcuts could be used to configure local, OAuth 2.0\nidentity stores and providers:"}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{children:"{\n  security {\n    local identity store local <path>\n    oauth identity provider google <client_id> <client_secret>\n    oauth identity provider github <client_id> <client_secret>\n    oauth identity provider facebook <client_id> <client_secret>\n    }\n  }\n}\n\nauth.myfiosgateway.com {\n  authenticate with myportal\n}\n"})}),"\n",(0,o.jsx)(i.h2,{id:"auto-redirect-url",children:"Auto-Redirect URL"}),"\n",(0,o.jsxs)(i.p,{children:["Consider the following configuration snippet. When the JWT plugin detects\nunauthenticated user, it forwards the user to ",(0,o.jsx)(i.code,{children:"https://auth.myfiosgateway.com"}),".\nThe ",(0,o.jsx)(i.code,{children:"redirect_url"})," in URL query creates ",(0,o.jsx)(i.code,{children:"AUTH_PORTAL_REDIRECT_URL"})," cookie\nin the users session. Upon successful authentication, the portal\nclears the cookie and redirects the user to the path specified in\n",(0,o.jsx)(i.code,{children:"AUTH_PORTAL_REDIRECT_URL"})," cookie."]}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{children:"{\n  security {\n    authentication portal myportal\n\n    authorization policy mypolicy {\n      set auth url https://auth.myfiosgateway.com/login?redirect_url=https://app.myfiosgateway.com\n    }\n  }\n}\n\nauth.myfiosgateway.com {\n  authenticate with myportal\n}\n\napp.myfiosgateway.com {\n  authorize with mypolicy\n}\n"})}),"\n",(0,o.jsx)(i.h2,{id:"basic-authentication",children:"Basic Authentication"}),"\n",(0,o.jsxs)(i.p,{children:["The ",(0,o.jsx)(i.code,{children:"/basic/login/<realm>"})," endpoint provides a way to trigger Basic HTTP authentication."]}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{className:"language-bash",children:"curl -v --user 'webadmin:asd3kldkjld23HJh33jDnx!@1' https://auth.myfiosgateway.com:8443/basic/login/local\n"})}),"\n",(0,o.jsxs)(i.p,{children:["The output follows. The token is in the ",(0,o.jsx)(i.code,{children:"authorization"})," header and ",(0,o.jsx)(i.code,{children:"access_token"})," cookie."]}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{children:"< HTTP/2 303\n< authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3Mzc2NDUsImp0aSI6IktzRXFpdTRqVXFQajJxUHJRZjhuWlEwSlFSell1R015MmlqU1oiLCJpYXQiOjE2Mzg3MzQwNDUsImlzcyI6Imh0dHBzOi8vYXV0aC5teWZpb3NnYXRld2F5LmNvbTo4NDQzL2Jhc2ljL2xvZ2luL2xvY2FsIiwibmJmIjoxNjM4NzMzOTg1MDAwLCJzdWIiOiJ3ZWJhZG1pbiIsImVtYWlsIjoid2ViYWRtaW5AbG9jYWxkb21haW4ubG9jYWwiLCJyb2xlcyI6WyJhdXRocC9hZG1pbiJdLCJvcmlnaW4iOiJsb2NhbCIsImFkZHIiOiIxMC4wLjIuMiJ9.gJXu5Dzj1VsI-QAWOv1kOcfMI8v5luiri4hmIOI1fL1XVnscaCOUyixpZLGRbqXCMhd8v4XBsdJUCVeMJ3RMFw\n< cache-control: no-store\n< content-type: text/plain\n< location: https://auth.myfiosgateway.com:8443/portal\n< pragma: no-cache\n< server: Caddy\n< set-cookie: access_token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3Mzc2NDUsImp0aSI6IktzRXFpdTRqVXFQajJxUHJRZjhuWlEwSlFSell1R015MmlqU1oiLCJpYXQiOjE2Mzg3MzQwNDUsImlzcyI6Imh0dHBzOi8vYXV0aC5teWZpb3NnYXRld2F5LmNvbTo4NDQzL2Jhc2ljL2xvZ2luL2xvY2FsIiwibmJmIjoxNjM4NzMzOTg1MDAwLCJzdWIiOiJ3ZWJhZG1pbiIsImVtYWlsIjoid2ViYWRtaW5AbG9jYWxkb21haW4ubG9jYWwiLCJyb2xlcyI6WyJhdXRocC9hZG1pbiJdLCJvcmlnaW4iOiJsb2NhbCIsImFkZHIiOiIxMC4wLjIuMiJ9.gJXu5Dzj1VsI-QAWOv1kOcfMI8v5luiri4hmIOI1fL1XVnscaCOUyixpZLGRbqXCMhd8v4XBsdJUCVeMJ3RMFw; Domain=myfiosgateway.com; Path=/; Secure; HttpOnly;\n< set-cookie: AUTHP_SANDBOX_ID=delete; Domain=myfiosgateway.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;\n< content-length: 0\n< date: Sun, 05 Dec 2021 19:54:05 GMT\n<\n* Connection #0 to host auth.myfiosgateway.com left intact\n"})}),"\n",(0,o.jsx)(i.h2,{id:"json-api",children:"JSON API"}),"\n",(0,o.jsx)(i.h3,{id:"authenticate",children:"Authenticate"}),"\n",(0,o.jsxs)(i.p,{children:["The following command provides a programmatic way to authenticate to ",(0,o.jsx)(i.code,{children:"/login"})," endpoint:"]}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{className:"language-bash",children:'curl -X POST https://auth.myfiosgateway.com:8443/login \\\n   -H \'Accept: application/json\' \\\n   -H \'Content-Type: application/json\' \\\n   -d \'{"username":"webadmin","password":"asd3kldkjld23HJh33jDnx!@1","realm":"local"}\'\n'})}),"\n",(0,o.jsx)(i.p,{children:"The output follows."}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{children:'{"token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3MzgyMjEsImp0aSI6IlN6d2JiOXI5eG5NeVlHUE5IbGZHeklQVlc5VHVLY1VlcndMbmNHR1BtIiwiaWF0IjoxNjM4NzM0NjIxLCJpc3MiOiJodHRwczovL2F1dGgubXlmaW9zZ2F0ZXdheS5jb206ODQ0My9sb2dpbiIsIm5iZiI6MTYzODczNDU2MTAwMCwic3ViIjoid2ViYWRtaW4iLCJlbWFpbCI6IndlYmFkbWluQGxvY2FsZG9tYWluLmxvY2FsIiwicm9sZXMiOlsiYXV0aHAvYWRtaW4iLCJhdXRocC91c2VyIl0sIm9yaWdpbiI6ImxvY2FsIiwiYWRkciI6IjEwLjAuMi4yIn0.QuSld2zKYtQX5gPIUlg7glRb7GXuieXm7ALxBTRd2dxCK4T-cZN-2KiK376Z1sxSFf3P3PA-ycrcazjdU5XETQ","token_name":"access_token"}\n'})}),"\n",(0,o.jsx)(i.h3,{id:"user-identity",children:"User Identity"}),"\n",(0,o.jsxs)(i.p,{children:["The following command provides a programmatic way to get information from ",(0,o.jsx)(i.code,{children:"/whoami"}),"\nendpoint using the previously acquired JWT token. This works well for the\ncreation of user badge."]}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{children:"curl -X GET https://auth.myfiosgateway.com:8443/whoami \\\n   -H 'Accept: application/json' \\\n   -H 'Content-Type: application/json' \\\n   -H 'Authorization: Bearer: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzg3MzgyMjEsImp0aSI6IlN6d2JiOXI5eG5NeVlHUE5IbGZHeklQVlc5VHVLY1VlcndMbmNHR1BtIiwiaWF0IjoxNjM4NzM0NjIxLCJpc3MiOiJodHRwczovL2F1dGgubXlmaW9zZ2F0ZXdheS5jb206ODQ0My9sb2dpbiIsIm5iZiI6MTYzODczNDU2MTAwMCwic3ViIjoid2ViYWRtaW4iLCJlbWFpbCI6IndlYmFkbWluQGxvY2FsZG9tYWluLmxvY2FsIiwicm9sZXMiOlsiYXV0aHAvYWRtaW4iLCJhdXRocC91c2VyIl0sIm9yaWdpbiI6ImxvY2FsIiwiYWRkciI6IjEwLjAuMi4yIn0.QuSld2zKYtQX5gPIUlg7glRb7GXuieXm7ALxBTRd2dxCK4T-cZN-2KiK376Z1sxSFf3P3PA-ycrcazjdU5XETQ'\n"})}),"\n",(0,o.jsx)(i.p,{children:"The output contains basic user information:"}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{className:"language-json",children:'{\n  "exp": 1638738221,\n  "jti": "Szwbb9r9xnMyYGPNHlfGzIPVW9TuKcUerwLncGGPm",\n  "iat": 1638734621,\n  "iss": "https://auth.myfiosgateway.com:8443/login",\n  "nbf": 1638734561000,\n  "sub": "webadmin",\n  "email": "webadmin@localdomain.local",\n  "roles": [\n    "authp/admin",\n    "authp/user"\n  ],\n  "origin": "local",\n  "addr": "10.0.2.2"\n}\n'})}),"\n",(0,o.jsx)(i.h2,{id:"logout",children:"Logout"}),"\n",(0,o.jsxs)(i.p,{children:["All authentication endpoints have a dedicated logout path, typically accessed through ",(0,o.jsx)(i.code,{children:"/logout"}),"."]}),"\n",(0,o.jsxs)(i.p,{children:["Upon reaching this path, users are usually redirected to the login page (",(0,o.jsx)(i.code,{children:"/login"}),"),\nwith some exceptions as detailed below."]}),"\n",(0,o.jsx)(i.h3,{id:"logout-with-redirect-url-query-parameter",children:"Logout with Redirect URL Query Parameter"}),"\n",(0,o.jsxs)(i.p,{children:["If a ",(0,o.jsx)(i.code,{children:"redirect_uri"})," parameter is included in the query string, the portal will redirect\nthe user to the specified link, but only if the URI is trusted."]}),"\n",(0,o.jsxs)(i.p,{children:["Here, the ",(0,o.jsx)(i.code,{children:"redirect_uri"})," is present and points to ",(0,o.jsx)(i.code,{children:"https://google.com/"})]}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{children:"https://localhost:8443/auth/logout?redirect_uri=https://google.com/\n"})}),"\n",(0,o.jsxs)(i.p,{children:["The trust is being established via ",(0,o.jsx)(i.code,{children:"trust logout redirect uri"})," directive.\nIf there is a match of ",(0,o.jsx)(i.code,{children:"domain"})," and ",(0,o.jsx)(i.code,{children:"path"}),", then the redirect occurs.\nOtherwise, there is no redirect."]}),"\n",(0,o.jsx)(i.p,{children:"The syntax follows:"}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{children:"authentication portal <name> {\n  trust logout redirect uri domain [exact|partial|prefix|suffix|regex] <domain_name> path [exact|partial|prefix|suffix|regex] <path>\n}\n"})}),"\n",(0,o.jsx)(i.p,{children:"Examples follow:"}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{children:"authentication portal my portal {\n  trust logout redirect uri domain authcrunch.com path /foo/bar\n  trust logout redirect uri domain exact google.com path suffix /foo\n}\n"})}),"\n",(0,o.jsx)(i.h3,{id:"external-endpoint-logout",children:"External Endpoint Logout"}),"\n",(0,o.jsx)(i.p,{children:"The external endpoint logout applies to OAuth 2.0 and SAML authentication."}),"\n",(0,o.jsx)(i.p,{children:'Here, the same login applies as with "Logout with Redirect URL Query Parameter" above.'}),"\n",(0,o.jsxs)(i.p,{children:["However, there is an additional way to cause external endpoint logout\nwith ",(0,o.jsx)(i.code,{children:"enable logout"})," directive."]}),"\n",(0,o.jsx)(i.p,{children:"At the moment this directive works only with Cognito OAuth 2.0 identity provider."})]})}function h(e={}){const{wrapper:i}={...(0,s.R)(),...e.components};return i?(0,o.jsx)(i,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},8453:(e,i,t)=>{t.d(i,{R:()=>a,x:()=>c});var n=t(6540);const o={},s=n.createContext(o);function a(e){const i=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function c(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),n.createElement(s.Provider,{value:i},e.children)}}}]);