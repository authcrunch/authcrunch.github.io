(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1142],{3905:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>u,kt:()=>d});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),i=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=i(e.components);return r.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),p=i(n),d=a,g=p["".concat(s,".").concat(d)]||p[d]||m[d]||o;return n?r.createElement(g,l(l({ref:t},u),{},{components:n})):r.createElement(g,l({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=p;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:a,l[1]=c;for(var i=2;i<o;i++)l[i]=n[i];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},6114:(e,t,n)=>{"use strict";n.d(t,{Z:()=>u});var r=n(7294),a=n(5999),o=n(5281),l=n(7462),c=n(6010);const s="iconEdit_eYIM";function i(e){let{className:t,...n}=e;return r.createElement("svg",(0,l.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,c.Z)(s,t),"aria-hidden":"true"},n),r.createElement("g",null,r.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function u(e){let{editUrl:t}=e;return r.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:o.k.common.editThisPage},r.createElement(i,null),r.createElement(a.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}},2503:(e,t,n)=>{"use strict";n.d(t,{Z:()=>u});var r=n(7462),a=n(7294),o=n(6010),l=n(5999),c=n(6668);const s="anchorWithStickyNavbar_LWe7",i="anchorWithHideOnScrollNavbar_WYt5";function u(e){let{as:t,id:n,...u}=e;const{navbar:{hideOnScroll:m}}=(0,c.L)();return"h1"!==t&&n?a.createElement(t,(0,r.Z)({},u,{className:(0,o.Z)("anchor",m?i:s),id:n}),u.children,a.createElement("a",{className:"hash-link",href:"#"+n,title:(0,l.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):a.createElement(t,(0,r.Z)({},u,{id:void 0}))}},3548:(e,t,n)=>{"use strict";n.d(t,{Z:()=>ce});var r=n(7294),a=n(3905),o=n(7462),l=n(5742);var c=n(2389),s=n(6010),i=n(2949),u=n(6668);function m(){const{prism:e}=(0,u.L)(),{colorMode:t}=(0,i.I)(),n=e.theme,r=e.darkTheme||n;return"dark"===t?r:n}var p=n(7594),d=n.n(p);const g=/title=(?<quote>["'])(?<title>.*?)\1/,f=/\{(?<range>[\d,-]+)\}/,h={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},bash:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}};function y(e,t){const n=e.map((e=>{const{start:n,end:r}=h[e];return"(?:"+n+"\\s*("+t.flatMap((e=>{var t,n;return[e.line,null==(t=e.block)?void 0:t.start,null==(n=e.block)?void 0:n.end].filter(Boolean)})).join("|")+")\\s*"+r+")"})).join("|");return new RegExp("^\\s*(?:"+n+")\\s*$")}function b(e,t){let n=e.replace(/\n$/,"");const{language:r,magicComments:a,metastring:o}=t;if(o&&f.test(o)){const e=o.match(f).groups.range;if(0===a.length)throw new Error("A highlight range has been given in code block's metastring (``` "+o+"), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.");const t=a[0].className,r=d()(e).filter((e=>e>0)).map((e=>[e-1,[t]]));return{lineClassNames:Object.fromEntries(r),code:n}}if(void 0===r)return{lineClassNames:{},code:n};const l=function(e,t){switch(e){case"js":case"javascript":case"ts":case"typescript":return y(["js","jsBlock"],t);case"jsx":case"tsx":return y(["js","jsBlock","jsx"],t);case"html":return y(["js","jsBlock","html"],t);case"python":case"py":case"bash":return y(["bash"],t);case"markdown":case"md":return y(["html","jsx","bash"],t);default:return y(Object.keys(h),t)}}(r,a),c=n.split("\n"),s=Object.fromEntries(a.map((e=>[e.className,{start:0,range:""}]))),i=Object.fromEntries(a.filter((e=>e.line)).map((e=>{let{className:t,line:n}=e;return[n,t]}))),u=Object.fromEntries(a.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.start,t]}))),m=Object.fromEntries(a.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.end,t]})));for(let d=0;d<c.length;){const e=c[d].match(l);if(!e){d+=1;continue}const t=e.slice(1).find((e=>void 0!==e));i[t]?s[i[t]].range+=d+",":u[t]?s[u[t]].start=d:m[t]&&(s[m[t]].range+=s[m[t]].start+"-"+(d-1)+","),c.splice(d,1)}n=c.join("\n");const p={};return Object.entries(s).forEach((e=>{let[t,{range:n}]=e;d()(n).forEach((e=>{null!=p[e]||(p[e]=[]),p[e].push(t)}))})),{lineClassNames:p,code:n}}var v=n(5281);const k="codeBlockContainer_Ckt0";function E(e){let{as:t,...n}=e;const a=function(e){const t={color:"--prism-color",backgroundColor:"--prism-background-color"},n={};return Object.entries(e.plain).forEach((e=>{let[r,a]=e;const o=t[r];o&&"string"==typeof a&&(n[o]=a)})),n}(m());return r.createElement(t,(0,o.Z)({},n,{style:a,className:(0,s.Z)(n.className,k,v.k.common.codeBlock)}))}const N={codeBlockContent:"codeBlockContent_biex",codeBlockTitle:"codeBlockTitle_Ktv7",codeBlock:"codeBlock_bY9V",codeBlockStandalone:"codeBlockStandalone_MEMb",codeBlockLines:"codeBlockLines_e6Vv",codeBlockLinesWithNumbering:"codeBlockLinesWithNumbering_o6Pm",buttonGroup:"buttonGroup__atx"};function B(e){let{children:t,className:n}=e;return r.createElement(E,{as:"pre",tabIndex:0,className:(0,s.Z)(N.codeBlockStandalone,"thin-scrollbar",n)},r.createElement("code",{className:N.codeBlockLines},t))}const C={plain:{backgroundColor:"#2a2734",color:"#9a86fd"},styles:[{types:["comment","prolog","doctype","cdata","punctuation"],style:{color:"#6c6783"}},{types:["namespace"],style:{opacity:.7}},{types:["tag","operator","number"],style:{color:"#e09142"}},{types:["property","function"],style:{color:"#9a86fd"}},{types:["tag-id","selector","atrule-id"],style:{color:"#eeebff"}},{types:["attr-name"],style:{color:"#c4b9fe"}},{types:["boolean","string","entity","url","attr-value","keyword","control","directive","unit","statement","regex","atrule","placeholder","variable"],style:{color:"#ffcc99"}},{types:["deleted"],style:{textDecorationLine:"line-through"}},{types:["inserted"],style:{textDecorationLine:"underline"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["important","bold"],style:{fontWeight:"bold"}},{types:["important"],style:{color:"#c4b9fe"}}]};var Z={Prism:n(7410).Z,theme:C};function w(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function j(){return j=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},j.apply(this,arguments)}var T=/\r\n|\r|\n/,_=function(e){0===e.length?e.push({types:["plain"],content:"\n",empty:!0}):1===e.length&&""===e[0].content&&(e[0].content="\n",e[0].empty=!0)},O=function(e,t){var n=e.length;return n>0&&e[n-1]===t?e:e.concat(t)},L=function(e,t){var n=e.plain,r=Object.create(null),a=e.styles.reduce((function(e,n){var r=n.languages,a=n.style;return r&&!r.includes(t)||n.types.forEach((function(t){var n=j({},e[t],a);e[t]=n})),e}),r);return a.root=n,a.plain=j({},n,{backgroundColor:null}),a};function x(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&-1===t.indexOf(r)&&(n[r]=e[r]);return n}const S=function(e){function t(){for(var t=this,n=[],r=arguments.length;r--;)n[r]=arguments[r];e.apply(this,n),w(this,"getThemeDict",(function(e){if(void 0!==t.themeDict&&e.theme===t.prevTheme&&e.language===t.prevLanguage)return t.themeDict;t.prevTheme=e.theme,t.prevLanguage=e.language;var n=e.theme?L(e.theme,e.language):void 0;return t.themeDict=n})),w(this,"getLineProps",(function(e){var n=e.key,r=e.className,a=e.style,o=j({},x(e,["key","className","style","line"]),{className:"token-line",style:void 0,key:void 0}),l=t.getThemeDict(t.props);return void 0!==l&&(o.style=l.plain),void 0!==a&&(o.style=void 0!==o.style?j({},o.style,a):a),void 0!==n&&(o.key=n),r&&(o.className+=" "+r),o})),w(this,"getStyleForToken",(function(e){var n=e.types,r=e.empty,a=n.length,o=t.getThemeDict(t.props);if(void 0!==o){if(1===a&&"plain"===n[0])return r?{display:"inline-block"}:void 0;if(1===a&&!r)return o[n[0]];var l=r?{display:"inline-block"}:{},c=n.map((function(e){return o[e]}));return Object.assign.apply(Object,[l].concat(c))}})),w(this,"getTokenProps",(function(e){var n=e.key,r=e.className,a=e.style,o=e.token,l=j({},x(e,["key","className","style","token"]),{className:"token "+o.types.join(" "),children:o.content,style:t.getStyleForToken(o),key:void 0});return void 0!==a&&(l.style=void 0!==l.style?j({},l.style,a):a),void 0!==n&&(l.key=n),r&&(l.className+=" "+r),l})),w(this,"tokenize",(function(e,t,n,r){var a={code:t,grammar:n,language:r,tokens:[]};e.hooks.run("before-tokenize",a);var o=a.tokens=e.tokenize(a.code,a.grammar,a.language);return e.hooks.run("after-tokenize",a),o}))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.render=function(){var e=this.props,t=e.Prism,n=e.language,r=e.code,a=e.children,o=this.getThemeDict(this.props),l=t.languages[n];return a({tokens:function(e){for(var t=[[]],n=[e],r=[0],a=[e.length],o=0,l=0,c=[],s=[c];l>-1;){for(;(o=r[l]++)<a[l];){var i=void 0,u=t[l],m=n[l][o];if("string"==typeof m?(u=l>0?u:["plain"],i=m):(u=O(u,m.type),m.alias&&(u=O(u,m.alias)),i=m.content),"string"==typeof i){var p=i.split(T),d=p.length;c.push({types:u,content:p[0]});for(var g=1;g<d;g++)_(c),s.push(c=[]),c.push({types:u,content:p[g]})}else l++,t.push(u),n.push(i),r.push(0),a.push(i.length)}l--,t.pop(),n.pop(),r.pop(),a.pop()}return _(c),s}(void 0!==l?this.tokenize(t,r,l,n):[r]),className:"prism-code language-"+n,style:void 0!==o?o.root:{},getLineProps:this.getLineProps,getTokenProps:this.getTokenProps})},t}(r.Component),P="codeLine_lJS_",I="codeLineNumber_Tfdd",A="codeLineContent_feaV";function D(e){let{line:t,classNames:n,showLineNumbers:a,getLineProps:l,getTokenProps:c}=e;1===t.length&&"\n"===t[0].content&&(t[0].content="");const i=l({line:t,className:(0,s.Z)(n,a&&P)}),u=t.map(((e,t)=>r.createElement("span",(0,o.Z)({key:t},c({token:e,key:t})))));return r.createElement("span",i,a?r.createElement(r.Fragment,null,r.createElement("span",{className:I}),r.createElement("span",{className:A},u)):r.createElement(r.Fragment,null,u,r.createElement("br",null)))}var z=n(5999);const V={copyButtonCopied:"copyButtonCopied_obH4",copyButtonIcons:"copyButtonIcons_eSgA",copyButtonIcon:"copyButtonIcon_y97N",copyButtonSuccessIcon:"copyButtonSuccessIcon_LjdS"};function M(e){let{code:t,className:n}=e;const[a,o]=(0,r.useState)(!1),l=(0,r.useRef)(void 0),c=(0,r.useCallback)((()=>{!function(e,t){let{target:n=document.body}=void 0===t?{}:t;const r=document.createElement("textarea"),a=document.activeElement;r.value=e,r.setAttribute("readonly",""),r.style.contain="strict",r.style.position="absolute",r.style.left="-9999px",r.style.fontSize="12pt";const o=document.getSelection();let l=!1;o.rangeCount>0&&(l=o.getRangeAt(0)),n.append(r),r.select(),r.selectionStart=0,r.selectionEnd=e.length;let c=!1;try{c=document.execCommand("copy")}catch{}r.remove(),l&&(o.removeAllRanges(),o.addRange(l)),a&&a.focus()}(t),o(!0),l.current=window.setTimeout((()=>{o(!1)}),1e3)}),[t]);return(0,r.useEffect)((()=>()=>window.clearTimeout(l.current)),[]),r.createElement("button",{type:"button","aria-label":a?(0,z.I)({id:"theme.CodeBlock.copied",message:"Copied",description:"The copied button label on code blocks"}):(0,z.I)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),title:(0,z.I)({id:"theme.CodeBlock.copy",message:"Copy",description:"The copy button label on code blocks"}),className:(0,s.Z)("clean-btn",n,V.copyButton,a&&V.copyButtonCopied),onClick:c},r.createElement("span",{className:V.copyButtonIcons,"aria-hidden":"true"},r.createElement("svg",{className:V.copyButtonIcon,viewBox:"0 0 24 24"},r.createElement("path",{d:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"})),r.createElement("svg",{className:V.copyButtonSuccessIcon,viewBox:"0 0 24 24"},r.createElement("path",{d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}))))}const W="wordWrapButtonIcon_Bwma",H="wordWrapButtonEnabled_EoeP";function R(e){let{className:t,onClick:n,isEnabled:a}=e;const o=(0,z.I)({id:"theme.CodeBlock.wordWrapToggle",message:"Toggle word wrap",description:"The title attribute for toggle word wrapping button of code block lines"});return r.createElement("button",{type:"button",onClick:n,className:(0,s.Z)("clean-btn",t,a&&H),"aria-label":o,title:o},r.createElement("svg",{className:W,viewBox:"0 0 24 24","aria-hidden":"true"},r.createElement("path",{fill:"currentColor",d:"M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"})))}function F(e){var t;let{children:n,className:a="",metastring:l,title:c,showLineNumbers:i,language:p}=e;const{prism:{defaultLanguage:d,magicComments:f}}=(0,u.L)(),h=null!=(t=null!=p?p:function(e){const t=e.split(" ").find((e=>e.startsWith("language-")));return null==t?void 0:t.replace(/language-/,"")}(a))?t:d,y=m(),v=function(){const[e,t]=(0,r.useState)(!1),[n,a]=(0,r.useState)(!1),o=(0,r.useRef)(null),l=(0,r.useCallback)((()=>{const n=o.current.querySelector("code");e?n.removeAttribute("style"):n.style.whiteSpace="pre-wrap",t((e=>!e))}),[o,e]),c=(0,r.useCallback)((()=>{const{scrollWidth:e,clientWidth:t}=o.current,n=e>t||o.current.querySelector("code").hasAttribute("style");a(n)}),[o]);return(0,r.useEffect)((()=>{c()}),[e,c]),(0,r.useEffect)((()=>(window.addEventListener("resize",c,{passive:!0}),()=>{window.removeEventListener("resize",c)})),[c]),{codeBlockRef:o,isEnabled:e,isCodeScrollable:n,toggle:l}}(),k=function(e){var t,n;return null!=(t=null==e||null==(n=e.match(g))?void 0:n.groups.title)?t:""}(l)||c,{lineClassNames:B,code:C}=b(n,{metastring:l,language:h,magicComments:f}),w=null!=i?i:function(e){return Boolean(null==e?void 0:e.includes("showLineNumbers"))}(l);return r.createElement(E,{as:"div",className:(0,s.Z)(a,h&&!a.includes("language-"+h)&&"language-"+h)},k&&r.createElement("div",{className:N.codeBlockTitle},k),r.createElement("div",{className:N.codeBlockContent},r.createElement(S,(0,o.Z)({},Z,{theme:y,code:C,language:null!=h?h:"text"}),(e=>{let{className:t,tokens:n,getLineProps:a,getTokenProps:o}=e;return r.createElement("pre",{tabIndex:0,ref:v.codeBlockRef,className:(0,s.Z)(t,N.codeBlock,"thin-scrollbar")},r.createElement("code",{className:(0,s.Z)(N.codeBlockLines,w&&N.codeBlockLinesWithNumbering)},n.map(((e,t)=>r.createElement(D,{key:t,line:e,getLineProps:a,getTokenProps:o,classNames:B[t],showLineNumbers:w})))))})),r.createElement("div",{className:N.buttonGroup},(v.isEnabled||v.isCodeScrollable)&&r.createElement(R,{className:N.codeButton,onClick:()=>v.toggle(),isEnabled:v.isEnabled}),r.createElement(M,{className:N.codeButton,code:C}))))}function q(e){let{children:t,...n}=e;const a=(0,c.Z)(),l=function(e){return r.Children.toArray(e).some((e=>(0,r.isValidElement)(e)))?e:Array.isArray(e)?e.join(""):e}(t),s="string"==typeof l?F:B;return r.createElement(s,(0,o.Z)({key:String(a)},n),l)}var G=n(9960);var Y=n(6043);const $="details_lb9f",U="isBrowser_bmU9",X="collapsibleContent_i85q";function J(e){return!!e&&("SUMMARY"===e.tagName||J(e.parentElement))}function K(e,t){return!!e&&(e===t||K(e.parentElement,t))}function Q(e){let{summary:t,children:n,...a}=e;const l=(0,c.Z)(),i=(0,r.useRef)(null),{collapsed:u,setCollapsed:m}=(0,Y.u)({initialState:!a.open}),[p,d]=(0,r.useState)(a.open);return r.createElement("details",(0,o.Z)({},a,{ref:i,open:p,"data-collapsed":u,className:(0,s.Z)($,l&&U,a.className),onMouseDown:e=>{J(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;J(t)&&K(t,i.current)&&(e.preventDefault(),u?(m(!1),d(!0)):m(!0))}}),null!=t?t:r.createElement("summary",null,"Details"),r.createElement(Y.z,{lazy:!1,collapsed:u,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{m(e),d(!e)}},r.createElement("div",{className:X},n)))}const ee="details_b_Ee";function te(e){let{...t}=e;return r.createElement(Q,(0,o.Z)({},t,{className:(0,s.Z)("alert alert--info",ee,t.className)}))}var ne=n(2503);function re(e){return r.createElement(ne.Z,e)}const ae="containsTaskList_mC6p";const oe="img_ev3q";const le={head:function(e){const t=r.Children.map(e.children,(e=>r.isValidElement(e)?function(e){var t;if(null!=(t=e.props)&&t.mdxType&&e.props.originalType){const{mdxType:t,originalType:n,...a}=e.props;return r.createElement(e.props.originalType,a)}return e}(e):e));return r.createElement(l.Z,e,t)},code:function(e){const t=["a","b","big","i","span","em","strong","sup","sub","small"];return r.Children.toArray(e.children).every((e=>"string"==typeof e&&!e.includes("\n")||(0,r.isValidElement)(e)&&t.includes(e.props.mdxType)))?r.createElement("code",e):r.createElement(q,e)},a:function(e){return r.createElement(G.Z,e)},pre:function(e){var t;return r.createElement(q,(0,r.isValidElement)(e.children)&&"code"===(null==(t=e.children.props)?void 0:t.originalType)?e.children.props:{...e})},details:function(e){const t=r.Children.toArray(e.children),n=t.find((e=>{var t;return r.isValidElement(e)&&"summary"===(null==(t=e.props)?void 0:t.mdxType)})),a=r.createElement(r.Fragment,null,t.filter((e=>e!==n)));return r.createElement(te,(0,o.Z)({},e,{summary:n}),a)},ul:function(e){return r.createElement("ul",(0,o.Z)({},e,{className:(t=e.className,(0,s.Z)(t,(null==t?void 0:t.includes("contains-task-list"))&&ae))}));var t},img:function(e){return r.createElement("img",(0,o.Z)({loading:"lazy"},e,{className:(t=e.className,(0,s.Z)(t,oe))}));var t},h1:e=>r.createElement(re,(0,o.Z)({as:"h1"},e)),h2:e=>r.createElement(re,(0,o.Z)({as:"h2"},e)),h3:e=>r.createElement(re,(0,o.Z)({as:"h3"},e)),h4:e=>r.createElement(re,(0,o.Z)({as:"h4"},e)),h5:e=>r.createElement(re,(0,o.Z)({as:"h5"},e)),h6:e=>r.createElement(re,(0,o.Z)({as:"h6"},e))};function ce(e){let{children:t}=e;return r.createElement(a.Zo,{components:le},t)}},2244:(e,t,n)=>{"use strict";n.d(t,{Z:()=>l});var r=n(7294),a=n(6010),o=n(9960);function l(e){const{permalink:t,title:n,subLabel:l,isNext:c}=e;return r.createElement(o.Z,{className:(0,a.Z)("pagination-nav__link",c?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},l&&r.createElement("div",{className:"pagination-nav__sublabel"},l),r.createElement("div",{className:"pagination-nav__label"},n))}},3008:(e,t,n)=>{"use strict";n.d(t,{Z:()=>i});var r=n(7294),a=n(6010),o=n(9960);const l="tag_zVej",c="tagRegular_sFm0",s="tagWithCount_h2kH";function i(e){let{permalink:t,label:n,count:i}=e;return r.createElement(o.Z,{href:t,className:(0,a.Z)(l,i?s:c)},n,i&&r.createElement("span",null,i))}},1526:(e,t,n)=>{"use strict";n.d(t,{Z:()=>i});var r=n(7294),a=n(6010),o=n(5999),l=n(3008);const c="tags_jXut",s="tag_QGVx";function i(e){let{tags:t}=e;return r.createElement(r.Fragment,null,r.createElement("b",null,r.createElement(o.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),r.createElement("ul",{className:(0,a.Z)(c,"padding--none","margin-left--sm")},t.map((e=>{let{label:t,permalink:n}=e;return r.createElement("li",{key:n,className:s},r.createElement(l.Z,{label:t,permalink:n}))}))))}},7594:(e,t)=>{function n(e){let t,n=[];for(let r of e.split(",").map((e=>e.trim())))if(/^-?\d+$/.test(r))n.push(parseInt(r,10));else if(t=r.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){let[e,r,a,o]=t;if(r&&o){r=parseInt(r),o=parseInt(o);const e=r<o?1:-1;"-"!==a&&".."!==a&&"\u2025"!==a||(o+=e);for(let t=r;t!==o;t+=e)n.push(t)}}return n}t.default=n,e.exports=n}}]);