"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[737],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>m});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),u=p(n),m=r,h=u["".concat(s,".").concat(m)]||u[m]||c[m]||i;return n?a.createElement(h,o(o({ref:t},d),{},{components:n})):a.createElement(h,o({ref:t},d))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},1149:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>c,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var a=n(7462),r=(n(7294),n(3905));const i={},o="LDAP Configuration",l={unversionedId:"authenticate/ldap/ldap",id:"authenticate/ldap/ldap",title:"LDAP Configuration",description:"It is recommended reading the documentation for Local identity store, because",source:"@site/docs/authenticate/ldap/10-ldap.md",sourceDirName:"authenticate/ldap",slug:"/authenticate/ldap/ldap",permalink:"/docs/authenticate/ldap/ldap",draft:!1,editUrl:"https://github.com/authp/authp.github.io/edit/main/docs/authenticate/ldap/10-ldap.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"User Registration",permalink:"/docs/authenticate/local/user-registration"},next:{title:"LDAP Authentication Architecture",permalink:"/docs/authenticate/ldap/search"}},s={},p=[{value:"Configuration Examples",id:"configuration-examples",level:2},{value:"Microsoft AD Integration",id:"microsoft-ad-integration",level:2},{value:"POSIX Groups Integration",id:"posix-groups-integration",level:2}],d={toc:p};function c(e){let{components:t,...i}=e;return(0,r.kt)("wrapper",(0,a.Z)({},d,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"ldap-configuration"},"LDAP Configuration"),(0,r.kt)("p",null,"It is recommended reading the documentation for Local identity store, because\nit outlines important principles of operation of all identity stores."),(0,r.kt)("p",null,"Additionally, the LDAP identity store works in conjunction with Local identity store.\nAs you will see later, the two can be used together by introducing a\ndropdown in UI interface to choose local versus LDAP domain authentication."),(0,r.kt)("h2",{id:"configuration-examples"},"Configuration Examples"),(0,r.kt)("p",null,"The reference configuration for the identity store is in the following files:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/Caddyfile"},(0,r.kt)("inlineCode",{parentName:"a"},"assets/conf/ldap/Caddyfile")),":\nMicrosoft AD LDAP integration"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/posix/Caddyfile"},(0,r.kt)("inlineCode",{parentName:"a"},"assets/conf/ldap/posix/Caddyfile")),":\nLDAP integration with POSIX groups"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/glauth/Caddyfile"},(0,r.kt)("inlineCode",{parentName:"a"},"assets/conf/ldap/glauth/Caddyfile")),":\nLDAP integration with GLAuth")),(0,r.kt)("p",null,"The following Caddy endpoint at ",(0,r.kt)("inlineCode",{parentName:"p"},"/auth")," authentications users\nfrom ",(0,r.kt)("inlineCode",{parentName:"p"},"contoso.com")," domain."),(0,r.kt)("h2",{id:"microsoft-ad-integration"},"Microsoft AD Integration"),(0,r.kt)("p",null,"There is a single LDAP server associated with the domain: ",(0,r.kt)("inlineCode",{parentName:"p"},"ldaps://ldaps.contoso.com"),"."),(0,r.kt)("p",null,"The plugin DOES NOT ignore certificate errors when connecting to the servers.\nHowever, one may ignore the errors by appending ",(0,r.kt)("inlineCode",{parentName:"p"},"ignore_cert_errors")," to the\nldap server address."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"          servers {\n            ldaps://ldaps.contoso.com ignore_cert_errors\n          }\n")),(0,r.kt)("p",null,"As a better alternative to ignoring certificate errors, the plugin allows\nadding trusted certificate authorities via ",(0,r.kt)("inlineCode",{parentName:"p"},"trusted_authority")," Caddyfile directive:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"          servers {\n            ldaps://ldaps.contoso.com\n          }\n          trusted_authority /etc/gatekeeper/tls/trusted_authority/contoso_com_root1_ca_cert.pem\n          trusted_authority /etc/gatekeeper/tls/trusted_authority/contoso_com_root2_ca_cert.pem\n          trusted_authority /etc/gatekeeper/tls/trusted_authority/contoso_com_root3_ca_cert.pem\n")),(0,r.kt)("p",null,"The following commands allow you connecting LDAPS server, e.g. ",(0,r.kt)("inlineCode",{parentName:"p"},"ldaps.localhost.local:636")," and\ncollecting certificates for the ",(0,r.kt)("inlineCode",{parentName:"p"},"trusted_authority")," directive."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"mkdir -p certs && cd certs\nopenssl s_client -showcerts -verify 5 -connect ldaps.localhost.local:636 < /dev/null | \\\n    awk '/BEGIN/,/END/{ if(/BEGIN/){a++}; out=\"cert\"a\".crt\"; print >out}' && \\\n    for cert in *.crt; do \\\n        newname=$(openssl x509 -noout -subject -in $cert | sed -n 's/^.*CN=\\(.*\\)$/\\1/; s/[ ,.*]/_/g; s/__/_/g; s/^_//g;p').pem;\n        mv $cert $newname;\n    done\n")),(0,r.kt)("p",null,"The LDAP attribute mapping to JWT fields is as follows. This is a typical Microsoft AD mapping."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},(0,r.kt)("strong",{parentName:"th"},"JWT Token Field")),(0,r.kt)("th",{parentName:"tr",align:null},(0,r.kt)("strong",{parentName:"th"},"LDAP Attribute")))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"name")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"givenName"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"surname")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"sn"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"username")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"sAMAccountName"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"member_of")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"memberOf"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"email")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"mail"))))),(0,r.kt)("p",null,"The plugin uses ",(0,r.kt)("inlineCode",{parentName:"p"},"authzsvc")," domain user to perform LDAP bind."),(0,r.kt)("p",null,"The base search DN is ",(0,r.kt)("inlineCode",{parentName:"p"},"DC=CONTOSO,DC=COM"),"."),(0,r.kt)("p",null,"The plugin accepts username (",(0,r.kt)("inlineCode",{parentName:"p"},"sAMAccountName"),") or email address (",(0,r.kt)("inlineCode",{parentName:"p"},"mail"),")\nand uses the following search filter: ",(0,r.kt)("inlineCode",{parentName:"p"},"(&(|(sAMAccountName=%s)(mail=%s))(objectclass=user))"),"."),(0,r.kt)("p",null,"For example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'      {\n        "Name": "sAMAccountName",\n        "Values": [\n          "jsmith"\n        ]\n      },\n      {\n        "Name": "mail",\n        "Values": [\n          "jsmith@contoso.com"\n        ]\n      }\n')),(0,r.kt)("p",null,"Upon successful authentication, the plugin assign the following rules\nto a user, provided the user is a member of a group:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},(0,r.kt)("strong",{parentName:"th"},"JWT Role")),(0,r.kt)("th",{parentName:"tr",align:null},(0,r.kt)("strong",{parentName:"th"},"LDAP Group Membership")))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"admin")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"CN=Admins,OU=Security,OU=Groups,DC=CONTOSO,DC=COM"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"editor")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"CN=Editors,OU=Security,OU=Groups,DC=CONTOSO,DC=COM"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"viewer")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"CN=Viewers,OU=Security,OU=Groups,DC=CONTOSO,DC=COM"))))),(0,r.kt)("p",null,"The security of the ",(0,r.kt)("inlineCode",{parentName:"p"},"password")," could be improved by the following techniques:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"pass the password via environment variable ",(0,r.kt)("inlineCode",{parentName:"li"},"LDAP_USER_SECRET")),(0,r.kt)("li",{parentName:"ul"},"store the password in a file and pass the file inside the ",(0,r.kt)("inlineCode",{parentName:"li"},"password"),"\nfield with ",(0,r.kt)("inlineCode",{parentName:"li"},"file:")," prefix, e.g. ",(0,r.kt)("inlineCode",{parentName:"li"},"file:/path/to/password"),".")),(0,r.kt)("p",null,"This ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/Caddyfile"},(0,r.kt)("inlineCode",{parentName:"a"},"Caddyfile")),"\nsecures Prometheus/Alertmanager services. Users may access using local and LDAP credentials."),(0,r.kt)("h2",{id:"posix-groups-integration"},"POSIX Groups Integration"),(0,r.kt)("p",null,"The configuration in ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/posix/Caddyfile"},(0,r.kt)("inlineCode",{parentName:"a"},"assets/conf/ldap/posix/Caddyfile")),"\nis for the integration with ",(0,r.kt)("a",{parentName:"p",href:"https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/"},"Online LDAP Test Server"),"."),(0,r.kt)("p",null,"The key differences of the configuration follow:"),(0,r.kt)("p",null,"First, the ",(0,r.kt)("inlineCode",{parentName:"p"},"posix_groups")," directive at the LDAP server level instructs the\nplugin to make a secondary LDAP call to discover user memberships in groups."),(0,r.kt)("p",null,"The search similar to the command below:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'ldapsearch -x -h ldap.forumsys.com -D "cn=read-only-admin,dc=example,dc=com" -w password -b "dc=example,dc=com" \\\n "(&(uniqueMember=uid=riemann,dc=example,dc=com)(objectClass=groupOfUniqueNames))"\n')),(0,r.kt)("p",null,"Second, the ",(0,r.kt)("inlineCode",{parentName:"p"},"search_group_filter")," directive allows the modification of the\ndefault ",(0,r.kt)("inlineCode",{parentName:"p"},"(&(uniqueMember=uid=")," + USER_DN + ",(0,r.kt)("inlineCode",{parentName:"p"},")(objectClass=groupOfUniqueNames))"),"\ngroup search string."),(0,r.kt)("p",null,"Third, there are a number of attributes that would require modification."),(0,r.kt)("p",null,"The user object follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"# riemann, example.com\ndn: uid=riemann,dc=example,dc=com\nobjectClass: inetOrgPerson\nobjectClass: organizationalPerson\nobjectClass: person\nobjectClass: top\ncn: Bernhard Riemann\nsn: Riemann\nuid: riemann\nmail: riemann@ldap.forumsys.com\n")),(0,r.kt)("p",null,"The comments in the below snippet explain the changes."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"attributes {\n    # The name us mapped to cn attribute, i.e. Bernhard Riemann\n    name cn\n    # Although surname is being kept in sn attribute, there is no\n    # attribute for given name. Thus, it is useless in isolation.\n    # Therefore, changeing surname value to non-existing attribute foo.\n    surname foo\n    # The username is mapped to uid attribute, i.e. riemann\n    username uid\n    # The member_of is not being used.\n    member_of uniqueMember\n    email mail\n}\n")),(0,r.kt)("p",null,"The screenshots from the login, portal, and whoami pages follow."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"LDAP Sign In",src:n(9645).Z,width:"458",height:"445"})),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"LDAP Portal",src:n(7426).Z,width:"441",height:"414"})),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"LDAP Whoami",src:n(1780).Z,width:"649",height:"769"})))}c.isMDXComponent=!0},7426:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/ldap_demo_portal-061d4c581c801a87b3c6a54e0c1affde.png"},9645:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/ldap_demo_signin-3c44de07d5a60848561f325c322b9ea3.png"},1780:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/ldap_demo_whoami-0c5ff3aa046176962c30091b31d24de7.png"}}]);