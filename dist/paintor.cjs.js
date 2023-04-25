"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const E=Object.freeze({CREATE:1,READ:2,UPDATE:3,DELETE:4,ARRAY_SPLICE:5,ARRAY_SWAP:6,ARRAY_COPY_WITHIN:7,ARRAY_SORT:8,ARRAY_PUSH:9,ARRAY_LENGTH:10}),be=Object.freeze(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"]),M=Symbol("Subscriptions"),$=Symbol("Access"),H=Symbol("TemplateFunction"),P=Symbol("State");let C={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null};function U(i,e,t,n,s){C.element=i,C.propertyName=e,C.subPropertyName=t,C.bindFunction=n,C.statementRepaintFunction=s}function v(){C.element=null,C.propertyName="",C.subPropertyName="",C.bindFunction=null,C.statementRepaintFunction=null}class ye{#e={receiver:[],target:[],callback:()=>{}};callArrayFn(e,t,n,s){switch(this.#e.target=t,this.#e.receiver=n,this.#e.callback=s,e){case"push":return this.#s;case"copyWithin":return this.#n;case"reverse":return this.#r;case"shift":return this.#t;case"sort":return this.#a;case"splice":return this.#i;case"unshift":return this.#h;default:return t[e]}}#n=(...e)=>{const{target:t,receiver:n}=this.#e;let[s,r,c]=e;const{length:o}=t;if(s<0)s+=o;else if(s<-o)s=0;else{if(s>=o)return;s>r&&(c=o-1)}if(r<0)r+=o;else if(r<-o||r===void 0)r=0;else if(r>=o)return;if(c<0)c+=o;else if(c<-o)c=0;else if(c>=o||c===void 0)c=o;else if(c<=r)return;const l=t.copyWithin.apply(t,[s,r,c]);return this.#e.callback(E.ARRAY_COPY_WITHIN,n,[s,r,c]),l};#s=(...e)=>{const{target:t,receiver:n}=this.#e,s=t.push.apply(t,e);return this.#e.callback(E.ARRAY_PUSH,n,e),s};#r=()=>{const{target:e,receiver:t}=this.#e,n=e.reverse.apply(e);for(let s=0,r=e.length;s<r;s++){const c=r-1-s;if(s>=c)break;this.#e.callback(E.ARRAY_SWAP,t,[s,c])}return n};#t=()=>{const{target:e,receiver:t}=this.#e,n=e.shift.apply(e);return this.#e.callback(E.ARRAY_SPLICE,t,[0,1]),n};#a=(...e)=>{const{target:t,receiver:n}=this.#e,s=t.sort.apply(t,e);return this.#e.callback(E.ARRAY_SORT,n,e),s};#i=(...e)=>{const{target:t,receiver:n}=this.#e,s=t.splice.apply(t,e);return this.#e.callback(E.ARRAY_SPLICE,n,e),s};#h=(...e)=>{const{target:t,receiver:n}=this.#e,s=t.unshift.apply(t,e);return this.#e.callback(E.ARRAY_SPLICE,n,[0,0,...e]),s}}class Te{#e=new Map;get subscriptions(){return this.#e}subscribe(e,t,n,s,r,c,o){(s==="-s-if"||s==="-s-forEach"||s==="-s-forState")&&(t=s),this.#e.has(t)||this.#e.set(t,new Map);const l=this.#e.get(t)??new Map;l.has(n)||l.set(n,[]);const a=l.get(n);for(const f of a)if(f.propertyName===s&&f.subPropertyName===r&&f.bindFunction===c&&f.statementRepaintFunction===o)return;const h={propertyName:s,subPropertyName:r,bindFunction:c,statementRepaintFunction:o,stateSubscription:this};a.push(h),n[M]??=[],n[M].push(h)}unsubscribe(e){if(M in e&&e[M]instanceof Array){const t=e[M];let n=t.length;for(;n--;)t[n].stateSubscription===this&&t.splice(n,1)}for(const[t,n]of this.#e)n.delete(e)}}function Ne(i){return Object.hasOwn(i,M)}function Ce(i,e,t,n){if(M in i&&i[M]instanceof Array){let s=i[M].length;for(;s--;){const r=i[M][s];if(t===void 0||t===r.bindFunction){if(n)for(const c in n)r[c]=n[c];e[M]??=[],e[M].push(r),i[M].splice(s,1)}}}}function we(i){const e=i[M];let t=e.length;for(;t--;)e[t]&&e[t].stateSubscription.unsubscribe(i);delete i[M]}class Ae{#e;#n;constructor(){this.#e=new ye,this.#n=new Te}createProxy(e,t=""){if(!(e instanceof Object))throw new Error("Cannot create a Proxy on non-object");const n=this.#s(),s=new Proxy(e,n);for(const r in s){if(!(s[r]instanceof Object))continue;const c=t===""?r:`${t}.${r}`;s[r]=this.createProxy(s[r],c)}return s}#s(){return{get:(t,n,s)=>{if(n===P)return t[n];if(Object.hasOwn(t,n)||n===$)C.element&&C.bindFunction&&this.#n.subscribe(t,n,C.element,C.propertyName,C.subPropertyName,C.bindFunction,C.statementRepaintFunction);else if((t instanceof Map||t instanceof Set)&&t[n]instanceof Function){const r=t[n];return(...o)=>{const l=r.apply(t,o);return t instanceof Set?n==="add"?this.#t(s,n):n==="delete"&&this.#i(s,n):t instanceof Map&&(n==="set"?this.#t(s,n):n==="delete"&&this.#i(s,n)),l}}else if(t instanceof Array&&t[n]instanceof Function&&typeof n=="string")return this.#e.callArrayFn(n,t,s,this.#r);return t[n]},set:(t,n,s,r)=>(n===P||n===$?t[n]=s:t instanceof Array&&n==="length"?(t[n]=s,this.#r(E.ARRAY_LENGTH,r,[s])):Object.hasOwn(t,n)?s instanceof Object?(t[n]=this.createProxy(s),this.#i(r,n),this.#t(r,n)):(t[n]=s,this.#h(r,n,s)):(s instanceof Object?t[n]=this.createProxy(s):t[n]=s,this.#t(r,n)),!0),deleteProperty:(t,n)=>(delete t[n],this.#i(t,n),!0)}}#r=(e,t,n)=>{const s=this.#n.subscriptions.get("-s-forState");if(s)for(const[r,c]of s)for(let o=0,l=c.length;o<l;o++){const{statementRepaintFunction:a}=c[o];a&&a(e,t,"",n)}};#t(e,t){this.#a(E.CREATE,e,t)}#a(e,t,n){const s=this.#n.subscriptions.get("-s-forState");if(s)for(const[r,c]of s)for(let o=0,l=c.length;o<l;o++){const{statementRepaintFunction:a}=c[o];a&&a(e,t,n)}}#i(e,t){this.#a(E.DELETE,e,t)}#h(e,t,n){if(this.#n.subscriptions.has(t)){const s=this.#n.subscriptions.get(t);if(s)for(const[r,c]of s)for(const o of c){const{propertyName:l,subPropertyName:a,bindFunction:h,statementRepaintFunction:f}=o;if(Object.hasOwn(r,"--deleted")){this.#n.unsubscribe(r);return}let w=h.call(r,r);l==="style"&&a?r.style[a]=ce(a,w):l==="--if"||l==="--for"||l==="--nest"?f&&f(w):(w instanceof Function&&(w=w()),B(r,l,w))}}}}let te=0;const J=function(e){if(!(e instanceof Object))throw new Error("state() only accepts Object, Array, Set or Map as input value.");const n=new Ae().createProxy(e);return te+=1,n[P]={id:te,target:e},n},K=function(i){return i instanceof Object&&P in i};function Se(){return typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global||this}function oe(i,...e){const t=/(%?)(%([ojdsif]))/g;if(e.length>0){const n=(s,r,c,o)=>{let l=e.shift(),a="";switch(o){case"o":Array.isArray(l)&&(a=JSON.stringify(l));break;case"s":a=""+l;break;case"d":a=""+Number(l);break;case"j":a=JSON.stringify(l);break;case"i":a=""+parseInt(""+l,10);break;case"f":a=""+parseFloat(""+l);break}return r?(e.unshift(a),s):a};i=i.replace(t,n)}return e.length>0&&(i+=" "+e.join(" ")),i=i.replace(/%{2,2}/g,"%"),""+i}function R(){if(R.isIt===void 0){const i=new Function("try {return this===window;}catch(e){ return false;}");R.isIt=i()}return R.isIt??!1}R.isIt=void 0;function _(i,e){e.push(i)}function Y(i,e){for(const t of i)e.push(t)}function le(i){return i.toLowerCase().indexOf("on")===0}function D(i){return i===" "||i==="	"||i==="\r"||i===`
`}function Oe(i){return/^[a-z][a-z0-9-]+$/.test(i)&&i.includes("-")}function Me(i){return/#[a-z0-9-]+\s*$/.test(i)}function xe(i){if(i==="true")return!0;if(i==="false")return!1;const e=parseInt(i);return isNaN(e)?!!i:!!e}function Fe(i,e,t){if(!(i instanceof window.Node)||typeof e!="string"||typeof t!="function"||le(e)===!1)return!1;const n=e.toLowerCase().substring(2);return i.addEventListener(n,t),!0}function _e(i,e){if(e.length===1)i.appendChild(e[0]);else if(e.length>1){const t=new DocumentFragment;for(const n of e)n&&t.append(n);i.appendChild(t)}}function Le(i,e){for(const t of e)t&&i.appendChild(t)}function ne(i,e){i&&(R()&&i instanceof window.Node?_e(i,e):Le(i,e))}function se(i,e,t,n,s,r,c){if(!(t instanceof Function))throw new TypeError('"handler" argument should be a Function');const o=K(e)?e[P].target:e,l=i===2&&K(o);if(o instanceof Array){l&&e[$],r===void 0&&o.length===0&&n instanceof Function&&(n(),c?.(void 0));for(const a in o){if(r!==void 0&&r!==a)continue;let h=l&&o[a]instanceof Object?e[a]:o[a];s&&(h=s?.(h));const f=t(h,a);if(c?.(a),f===!1)break}}else if(o instanceof Map||o instanceof Set){l&&e[$],r===void 0&&o.size===0&&n instanceof Function&&(n(),c?.(void 0));for(const[a,h]of o.entries()){if(r!==void 0&&r!==a)continue;let f=h;s&&(f=s?.(f));const w=t(f,a);if(c?.(a),w===!1)break}}else if(o instanceof Object){l&&e[$],r===void 0&&Object.keys(o).length===0&&n instanceof Function&&(n(),c?.(void 0));for(const a in o){if(r!==void 0&&r!==a)continue;let h=l&&o[a]instanceof Object?e[a]:o[a];s&&(h=s?.(h));const f=t(h,a);if(c?.(a),f===!1)break}}else throw new TypeError('"data" argument should be an Object or an Array');return!0}function De(i,e,t){if(typeof i!="number"||typeof e!="number")return new Error('"start" and "end" arguments should be numbers');if(!(t instanceof Function))return new Error('"handler" argument should be a Function');if(e>=i)for(let n=i;n<=e&&t(n)!==!1;n++);else for(let n=i;n>=e&&t(n)!==!1;n--);return!0}function Re(i,e){return i.splice(e,1),i}function ke(i,e){if(!e)return;const{nextSibling:t,parentNode:n}=e;n&&n.insertBefore(i,t)}function ve(i,e){if(e instanceof Object)for(const t in e){const n=e[t].toString();i.setAttribute(`data-${t}`,n)}}function B(i,e,t){e in i?t instanceof Array?i[e]=oe.apply(null,t):i[e]=t??"":"setAttribute"in i&&i.setAttribute(e,t)}function ce(i,e){let t=e;return(i==="visibility"||i==="backfaceVisibility")&&(e===!0||e===!1||e===void 0||e===null)&&(t=e?"visible":"hidden"),i==="display"&&(e===!0||e===!1||e===void 0||e===null)&&(t=e?"":"none"),i==="flex"&&(e===!0||e===!1||e===void 0||e===null)&&(t=e?1:0),t}function Ie(i){return i instanceof Array?i.length:i instanceof Map||i instanceof Set?i.size:i instanceof Object?Object.keys(i).length:0}function Pe(i,e,t){if(t>=i.length){let n=t-i.length+1;for(;n--;)i.push(void 0)}return i.splice(t,0,i.splice(e,1)[0]),i}const je=(...i)=>{const e=i.length;for(let t=1;t<e;t++)i[t-1].after(i[t])};class G{elements=[];addElement(e){e&&this.elements.push(e)}addElements(e){for(let t of e)this.elements.push(t)}getElements(){return this.elements}hasElement(e){return this.elements.indexOf(e)>-1}importElements(e){const t=e.getElements();for(const n of t)this.addElement(n)}moveElementAfterAnother(e,t){const n=this.elements.indexOf(e),s=this.elements.indexOf(t);if(n===-1||s===-1)throw new Error("Cannot move one element after another, because one element is missing");s-n!==1&&(this.elements=Pe(this.elements,n,s+1))}removeAllElements(){this.elements.length=0}removeTheseElements(e){let t=e.length;for(;t--;){let n=this.elements.length;for(;n--;)if(e[t]===this.elements[n]){this.elements.splice(n,1);continue}}}replaceElements(e){this.elements=e}}class Q{tagName="-";parent=this;children=[];attributes={};newChild(e,t){const n=new Q;return n.parent=e,n.attributes=t,this.children.push(n),n}}const q=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]);class $e{#e="";#n="";#s="";#r={};#t;#a;#i=[];#h=this.#w;#d="";#m="";#f={};#u="";#E="";#p="";#A=new Q;#o=this.#A;constructor(e,t){this.#i=this.#y(e,t),this.#O()}generate(e){if(this.#u||this.#E)throw new Error("Some HTML tag is not closed");return this.#b(e,this.#A)}#N(e,t){return typeof e=="function"?typeof t=="function"?t:e:typeof e=="string"&&(typeof t=="string"||typeof t=="number"||typeof t=="boolean")?e+t.toString():t}#b(e,t){const n=[];for(const s of t.children){let r=null;s.tagName==="if"?r=e.if(xe(s.attributes?.condition??""),()=>this.#b(e,s)):s.tagName==="for"?"iterations"in s.attributes?r=e.for(0,parseInt(s.attributes?.iterations??0)-1,(c,o)=>{this.#b(e,s)}):("from"in s.attributes||"to"in s.attributes)&&(r=e.for(parseInt(s.attributes?.from??0),parseInt(s.attributes?.to??0),(c,o)=>{this.#b(e,s)})):s.tagName==="forEach"?"object"in s.attributes&&(r=e.forEach(s.attributes?.object??{},(c,o)=>{this.#b(e,s)})):(r=e.createElement(s.tagName,s.attributes,this.#b(e,s)),n.push(r))}return n}#c(){const e=this.#o,t=this.#r;Object.keys(this.#f).length>0&&(t.style=this.#f);const n=this.#o.newChild(e,t);n.tagName=this.#u,this.#o=n}#y(e,t=[]){const n=[];for(let s=0;s<e.length;s++)e[s]&&n.push(e[s]),t[s]!==void 0&&n.push(t[s]);return n}#O(){for(let e=0;e<this.#i.length;e++)if(typeof this.#i[e]=="string")for(let t=0;t<this.#i[e].length;t++)this.#t=this.#i[e][t],this.#a=this.#i[e][t-1],this.#h();else this.#t=this.#i[e],this.#a=void 0,this.#h()}#S(e,t){e&&(this.#r[e]=typeof t=="string"?t.trim():t)}#l(e){e===this.#T&&(this.#e="",this.#s="",this.#n=""),this.#h=e}#g(e,t){e&&(this.#f[e]=typeof t=="string"?t.trim():t)}#T(){D(this.#t)||(this.#t==="/"?(q.includes(this.#u)&&this.#c(),this.#l(this.#M)):this.#t===">"?(this.#c(),this.#l(this.#w)):this.#t==="="?this.#l(this.#C):this.#e+=this.#t)}#C(){D(this.#t)||(this.#t==="'"||this.#t==='"'?(this.#n=this.#t,this.#l(this.#e==="style"?this.#F:this.#x)):(this.#n=" ",this.#s=this.#N(this.#s,this.#t),this.#l(this.#x)))}#x(){this.#t===">"&&this.#a!=="/"?(this.#n&&this.#e&&this.#s&&this.#S(this.#e,this.#s),this.#e="",this.#s="",this.#n="",this.#l(this.#w),this.#c()):this.#t===this.#n||this.#n===" "&&D(this.#t)?(this.#S(this.#e,this.#s),this.#l(this.#T)):this.#t instanceof Object?this.#s=this.#t:this.#s+=this.#t}#w(){D(this.#t)||(this.#t==="<"?(this.#u="",this.#r={},this.#l(this.#_)):(this.#a===" "?this.#p=this.#a+this.#t:this.#p=this.#t,this.#u="",this.#r={},this.#c(),this.#l(this.#D)))}#F(){D(this.#t)||(this.#t===">"?this.#l(this.#w):this.#t===this.#n||this.#n===" "&&D(this.#t)?this.#l(this.#T):this.#t===":"?this.#l(this.#L):this.#d+=this.#t)}#L(){this.#t===">"?this.#l(this.#w):this.#t===";"?(this.#g(this.#d,this.#m),this.#d="",this.#m="",this.#l(this.#F)):this.#t===this.#n?(this.#g(this.#d,this.#m),this.#d="",this.#m="",this.#l(this.#T)):this.#m=this.#N(this.#m,this.#t)}#_(){if(D(this.#t))this.#u!==""&&this.#l(this.#T);else if(this.#t==="/"&&q.includes(this.#u))this.#o.tagName||(this.#o=this.#o.parent),this.#c(),this.#l(this.#M);else if(this.#t===">"){if(!this.#u)throw new Error("Expected tag name, found >");this.#o.tagName||(this.#o=this.#o.parent),this.#c(),this.#l(this.#w)}else this.#a==="<"&&this.#t==="/"?(this.#u,this.#E="",this.#l(this.#M)):this.#u+=this.#t}#M(){if(!D(this.#t))if(this.#t===">"){if(this.#o.tagName&&this.#o.tagName!=="-"&&!q.includes(this.#o.tagName)&&this.#o.tagName!==this.#E)throw new Error(`Expected ${this.#o.tagName} tag to be closed, but ${this.#E} found`);this.#u="",this.#E="",this.#o.tagName?this.#o=this.#o.parent:this.#o=this.#o.parent.parent,this.#l(this.#w)}else this.#E+=this.#t}#D(){this.#t==="<"?(this.#r={},this.#o.attributes.textContent=this.#p,this.#l(this.#_)):(this.#p=this.#N(this.#p,this.#t),this.#o.tagName||(this.#o.attributes.textContent=this.#p))}}class ae{#e=[new G];#n;#s;#r=!0;#t=null;#a=[];#i=[];#h;constructor(e,t,n,s=[]){this.#h=e,this.#s=e.document,this.#r=this.#s.baseURI==="",this.#n=t,this.#a=n,this.#i=s}createElement(e,...t){const n=e?this.#s.createElement(e):this.#s.createTextNode("");let s=[],r=0;for(const o of t)if(r+=1,typeof o=="string"){const l=this.#s.createTextNode(this.#g(o));_(l,s)}else if(typeof o=="number"){const l=this.#s.createTextNode(o.toString());_(l,s)}else if(o instanceof this.#h.Node)_(o,s);else if(o instanceof Array){if(o.length===0)continue;let l=!1;for(const a of o)if(a instanceof this.#h.Node){l=!0;break}if(l)Y(o,s);else{const a=this.#s.createTextNode(this.#u(o));_(a,s)}}else if(o instanceof Error)n.textContent=this.#g(o.message);else if(o instanceof O){const l=this.#r?o.useTranslations(this.#i).getElementsSr():o.useTranslations(this.#i).getElements();for(const a of l)for(const h of a)_(h,s)}else if(o instanceof Function)if(o[H]){const{thisLevel:l,upperLevel:a}=this.#E();o(this);const h=this.#e[l].getElements();Y(h,s),this.#d({thisLevel:l,upperLevel:a})}else if(this.#r)n.innerHTML=`(${o.toString()})()`;else if(n instanceof HTMLScriptElement){const l=this.#s.createTextNode(`(${o.toString()})()`);n.appendChild(l)}else if("value"in n&&!(n instanceof HTMLLIElement))this.#c(n,{value:o});else{const l=()=>{this.#S("nest",o,!0,(a,h,f,w)=>{if(a instanceof Function||a instanceof O){if(a instanceof O){const x=this.#r?a.useTranslations(this.#i).getElementsSr():a.useTranslations(this.#i).getElements();h?(_(f,s),Y(x[0],s),_(w,s)):this.#e[0].addElements(x[0])}else if(H in a)if(a(this),h){const x=this.#e.length-1,y=this.#e[x].getElements();_(f,s),Y(y,s),_(w,s)}else s.length=0}else h&&f&&(this.#C(f),this.#c(n,{textContent:a}))})};this.#c(n,{textNode:o},l)}else o instanceof Object&&!(o instanceof Function)&&r===1&&this.#c(n,o);const c=this.#e.length-1;if(s.length>0){const o=this.#e[c].getElements(),l=o.indexOf(s[0]);l>-1&&s.length<o.length-l&&(s=o.slice(l))}return ne(n,s),this.#e[c].removeTheseElements(s),this.#e[c].addElement(n),n}for(e,t,n){const s=()=>{const r=De(e,t,n);r instanceof Error&&console.error(r)};return this.#O("for",null,s)}forEach(e,t){return this.#p(1,e,t)}forState(e,t,n){return this.#p(2,e,t,n)}getCreatedElements(){return this.#e[0].getElements()}getHtmlCode(e){let t="";if(this.#r){const n=this.#n;n&&(t=n.paintChildren(e))}return t}html(e,...t){const n=t.length===0&&this.#i.length===0?this.#A(e instanceof Array?e[0]:e):this.#o(e instanceof Array?e:[e],...t);for(const s of n)s.tagName===""&&(s.textContent=this.#g(s.textContent));return n}if(e,t,n){const s=r=>{if(r)if(t instanceof O){const c=this.#r?t.useTranslations(this.#i).getElementsSr():t.useTranslations(this.#i).getElements(),o=this.#e.length-1;this.#e[o].addElements(c[0])}else t instanceof Function&&t();else if(n instanceof O){const c=this.#r?n.useTranslations(this.#i).getElementsSr():n.useTranslations(this.#i).getElements(),o=this.#e.length-1;this.#e[o].addElements(c[0])}else n instanceof Function&&n()};return e instanceof Function?this.#S("if",e,!0,s):this.#O("if",e,s)}async render(){this.#e=[new G];for(const e of this.#a)if(e instanceof Function){let t=e(this);if(t instanceof Promise&&(t=await t),t&&typeof t=="string")this.html(t);else if(t instanceof O){const n=this.#r?t.useTranslations(this.#i).getElementsSr():t.useTranslations(this.#i).getElements();for(const s of n)this.#e[0].addElements(s)}else if(t instanceof Function)t(this);else if(t instanceof Array){let n=!0,s=!0;for(const r of t){if(!(r instanceof O)){n=!1;break}if(!(r instanceof Function)){s=!1;break}}if(n)for(const r of t){if(!(r instanceof O))break;const c=this.#r?r.useTranslations(this.#i).getElementsSr():r.useTranslations(this.#i).getElements();for(const o of c)this.#e[0].addElements(o)}else if(s)for(const r of t){if(!(r instanceof Function))break;r(this)}}}else if(e instanceof O){const t=this.#r?e.useTranslations(this.#i).getElementsSr():e.useTranslations(this.#i).getElements();for(const n of t)this.#e[0].addElements(n)}this.#m()}#d({thisLevel:e,upperLevel:t}){const n=this.#e[e].getElements();return this.#e[t].importElements(this.#e[e]),this.#e[e].replaceElements([]),delete this.#e[e],this.#e.pop(),n}#m(){const e=this.#n;e&&ne(e,this.getCreatedElements())}#f(e){return!!this.#i?e.map(n=>this.#g(n)):e}#u(e){return this.#g(oe.apply(null,this.#f(e)))}#E(){this.#e.push(new G);const e=this.#e.length-1,t=e-1;return{thisLevel:e,upperLevel:t}}#p(e,t,n,s){let r=null;const c=a=>this.#g(a);if(K(t)){const a=(h,f,w)=>{const x=[];let y=f.getElements().length;return se(e,h,n,s,c,w,A=>{const F=f.getElements(),k=y===0?F:F.slice(y);if(A===void 0){if(r)return;r=k}else if(r){for(const d of r)this.#C(d),d.remove();r=null}x.push({key:A,elements:k}),y=F.length}),x};return this.#l("forState",t,a,s instanceof Function)}const o=a=>{se(e,a,n,s,c)},l=e===1?"forEach":"forState";return t instanceof Function?this.#S(l,t,!0,o):this.#O(l,t,o)}#A(e){let t=[];if(this.#r){const s=this.#s.createElement("");s.innerHTML=e??"",t=[s]}else{this.#t||(this.#t=this.#s.createElement("template"));const s=this.#t;s.innerHTML=e.trim()??"",t=Array.from(s.content.childNodes),s.innerHTML=""}const n=this.#e.length-1;return this.#e[n].addElements(t),t}#o(e,...t){return new $e(e,t).generate(this)}#N(e,t){if(!this.#n?.contains(e))return!1;let n=e;for(const s of t)ke(s,n),n=s;return!0}#b(e){if(e.nodeType!==8)return-1;const n=e.textContent;let s="";if(n)s=n.slice(0,-6)+"-end";else return-1;let r=e.nextSibling,c=0,o=0;for(;r!==null;){if(r.nodeType===8){const a=r.textContent;if(a===n)c+=1;else if(a===s&&(c-=1,c<0))break}const{nextSibling:l}=r;this.#C(r),r.remove(),o+=1,r=l}return o}#c(e,t,n){for(let s in t){let r=t[s];if(this.#r){if(le(s)&&r instanceof Function){B(e,s,r);continue}}else if(r instanceof Function&&Fe(e,s,r))continue;if(r instanceof Function){const c=r;U(e,s,"",c,null);let o=c(e);if(o instanceof Function&&Object.hasOwn(o,H)||o instanceof O){v(),n&&n();continue}else if(o instanceof Function)o=o();else if(s==="textNode"){v();const l=this.#s.createTextNode(o);e.appendChild(l),Ce(e,l,c,{propertyName:"textContent"});continue}v(),o instanceof Array?o=this.#u(o):typeof o=="string"&&(o=this.#g(o)),s&&B(e,s,o)}else e instanceof this.#h.HTMLElement&&s==="style"&&r instanceof Object?this.#y(e,r):e instanceof this.#h.HTMLElement&&s==="data"?r instanceof Object&&ve(e,r):s==="textContent"?r instanceof Array?e[s]=this.#u(r):e[s]=this.#g(r):((s==="innerText"||s==="value"&&e.tagName==="INPUT"&&(e.getAttribute("type")??"").toLowerCase()==="button")&&(r=this.#g(r)),B(e,s,r))}}#y(e,t){for(const n in t){const s=t[n];let r="";if(s instanceof Function){const c="style",o=s;U(e,c,n,o,null),r=o(e),v()}else r=s;typeof n=="string"&&(e.style[n]=ce(n,r))}}#O(e,t,n){const{thisLevel:s,upperLevel:r}=this.#E();return n(t),this.#d({thisLevel:s,upperLevel:r})}#S(e,t,n,s){const{thisLevel:r,upperLevel:c}=this.#E();if(t instanceof Function){const l=this.#s.createComment(`${e}-begin`),a=this.#s.createComment(`${e}-end`);n&&this.#e[r].addElement(l);const h=y=>{if(this.#r)return;const T=this.#e.length-1;this.#e[T].removeAllElements(),s(y,!1,null,null),this.#N(l,this.#e[T].getElements())||console.error("Element ",l," does not exist anymore")},f=l,w=`--${e}`;U(f,w,"",t,h);const x=t();v(),s(x,!0,l,a),n&&this.#e[r].addElement(a)}else s(t,!1,null,null);return this.#d({thisLevel:r,upperLevel:c})}#l(e,t,n,s){const{thisLevel:r,upperLevel:c}=this.#E(),o=this.#s.createComment(`${e}-begin`),l=this.#s.createComment(`${e}-end`);this.#e[r].addElement(o);const a=(y,T,A,F)=>{let k=!1;o.parentElement&&(this.#e.push(new G),k=!0);const d=this.#e.length-1,u=n(y,this.#e[d],F),m=T instanceof Array;for(const g of u){F!==void 0&&(m?l.renderedElementsMap[F]=g:l.renderedElementsMap.push(g));for(const p of g.elements)d===0&&this.#e[d].moveElementAfterAnother(p,A),A.after(p),A=p}k&&this.#e.pop()},h=(y,T,A,F)=>{const d=T[P].target;if(d instanceof Object&&!this.#r){if(y===E.CREATE){let u=null;const m=d instanceof Map||d instanceof Set?d.keys():Object.keys(d);for(let p of m){if(p===A)break;u=p}let g=o;if(u!==null){for(const p of l.renderedElementsMap)if(p&&p.key===u){const{elements:S}=p;g=S.length>0?S[S.length-1]:g;break}}a(d,d,g,A)}else y===E.UPDATE&&(h(E.DELETE,T,A,void 0),h(E.CREATE,T,A,void 0));if(y===E.DELETE){let u=l.renderedElementsMap.length;for(;u--;){if(!l.renderedElementsMap[u])continue;const m=d instanceof Array;if(l.renderedElementsMap[u].key===A){for(const g of l.renderedElementsMap[u].elements)this.#C(g),g.remove();m?(l.renderedElementsMap[u].elements.length=0,delete l.renderedElementsMap[u]):l.renderedElementsMap=Re(l.renderedElementsMap,u);break}}}else if(y===E.ARRAY_SPLICE){if(d instanceof Array){let[u,m,...g]=F;if(m===1/0?m=d.length-u:m<0&&(m=0),m>0)for(let b=u,j=u+m;b<j;b++)h(E.DELETE,T,b.toString(),void 0),delete l.renderedElementsMap[b];const p=l.renderedElementsMap.length,S=d.length,V=S-p;if(V>0){l.renderedElementsMap.length=S;for(let b=S-1;b>=u+g.length;b--){const j=b-V;if(j<0)break;l.renderedElementsMap[b]=l.renderedElementsMap[j],l.renderedElementsMap[b].key=b.toString(),delete l.renderedElementsMap[j]}}else if(V<0){l.renderedElementsMap.splice(u,m);for(let b=S-1;b>=u+g.length;b--)l.renderedElementsMap[b].key=b.toString()}if(g.length>0)for(let b=u;b<u+g.length;b++)h(E.CREATE,T,b.toString(),void 0)}l.renderedElementsMap.length=d.length}else if(y===E.ARRAY_SWAP){const[u,m]=F,g=l.renderedElementsMap[m].elements;l.renderedElementsMap[m].elements=l.renderedElementsMap[u].elements,l.renderedElementsMap[u].elements=g;for(let p=1;p<l.renderedElementsMap.length;p++)je(...l.renderedElementsMap[p-1].elements,...l.renderedElementsMap[p].elements)}else if(y===E.ARRAY_COPY_WITHIN){let[u,m,g]=F;for(let p=m,S=u;p<g;p++,S++)h(E.DELETE,T,S.toString(),void 0),h(E.CREATE,T,S.toString(),void 0)}else if(y===E.ARRAY_SORT)for(let u=0,m=d.length;u<m;u++)h(E.DELETE,T,u.toString(),void 0),h(E.CREATE,T,u.toString(),void 0);else if(y===E.ARRAY_PUSH){const u=d.length;let m=l.renderedElementsMap.length,g=o;for(;m--;){const p=l.renderedElementsMap[m];if(!p)continue;const S=p.elements.length;if(S>0){g=p.elements[S-1];break}}A=(u-1).toString(),a(d,d,g,A)}else if(y===E.ARRAY_LENGTH){const u=F?.[0]??0;if(u<l.renderedElementsMap.length){let m=l.renderedElementsMap.length;for(;m--&&!(m<u);)l.renderedElementsMap[m]!==void 0&&h(E.DELETE,T,m.toString(),void 0)}d instanceof Array&&(l.renderedElementsMap.length=d.length)}s&&(!(d instanceof Array)||A==="")&&Ie(d)===0&&a(T,d,o,void 0)}},f=`-s-${e}`;U(l,f,"",()=>t,h);const x=n(t,this.#e[r]);return x.length===1&&x[0].key===void 0&&x.splice(0,1),l.renderedElementsMap=x,v(),this.#e[r].addElement(l),this.#d({thisLevel:r,upperLevel:c})}#g(e){if(typeof e=="string"){const t=this.#T(e,this.#i);if(typeof t=="string")return t;const n=Se(),s=this.#T(e,n?.paintorTranslations);if(typeof s=="string")return s}return e}#T(e,t){if(t instanceof Array&&t.length>0){for(const n of t)if(e in n)return n[e]}return!1}#C(e){Ne(e)&&(Object.assign(e,{"--deleted":!0}),we(e));let t=e.childNodes.length;for(;t--;)this.#C(e.childNodes[t])}}function He(...i){const e=this;return function(...n){return e.call(this,...i,...n)}}const{prototype:X}=ae;Object.assign(X.createElement,{bindArgs:He});be.forEach(i=>{X[i]=X.createElement.bindArgs(i)});const Ue=Object.freeze(["async","autofocus","autoplay","checked","contenteditable","controls","default","defer","disabled","formNoValidate","frameborder","hidden","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","readonly","required","reversed","scoped","selected","typemustmatch"]),Ye=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]),N=Object.freeze({ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11});class z extends Error{constructor(e,t){super(e),this.name=t??"DOMException"}}class L{nextSibling=null;previousSibling=null;textContent="";#e=[];#n="";#s=1;#r=null;constructor(e,t){this.#s=e,this.#n=t}get baseURI(){return""}get childNodes(){return this.#e}get firstChild(){return this.#e[0]??null}get nodeName(){return this.#n}get nodeType(){return this.#s}get parentNode(){return this.#r}set parentNode(e){this.#r=e}appendChild(e){if(this.nodeType!==N.DOCUMENT_NODE&&this.nodeType!==N.DOCUMENT_FRAGMENT_NODE&&this.nodeType!==N.ELEMENT_NODE)throw new z("This node type does not support this method.");if(this.nodeType===N.DOCUMENT_NODE)throw new z("Failed to execute 'appendChild' on 'Node': Only one element on document allowed.");if(!(e instanceof L)){const n="Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.";throw new TypeError(n)}if(this.#e.includes(e))return;if(e===this)throw new z("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");this.#e.push(e),e.parentNode=this;const t=this.#e.length-2;t>=0&&(this.#e[t].nextSibling=e,e.previousSibling=this.#e[t]??null)}contains(){return!1}insertBefore(e,t){const n=[];for(const s of this.#e)s===t&&n.push(e),n.push(s);return this.#e=n,e}removeChild(e){if(!e)throw new Error("Failed to execute 'removeChild' on 'HTMLElement': parameter 1 is not of type 'HTMLElement'.");if(!this.#e.includes(e))throw new Error("Failed to execute 'removeChild' on 'HTMLElement': The node to be removed is not a child of this node.");return this.#e=this.#e.filter(t=>t!==e),e}paintChildren({indent:e=""}){let t="",n=0;for(const s of this.childNodes){n+=1;const r=n>1;t+=fe(s,e,"",r)}return t}}class Z extends L{constructor(){super(N.COMMENT_NODE,"#comment")}}class ee extends L{constructor(){super(N.TEXT_NODE,"#text")}}function he(i){let e=i;const t={"&":"&amp;","<":"&lt;",">":"&gt;"};return e=e.replace(/[&<>"]/g,n=>{let s=n;return n in t&&(s=t[n]),s}),e}function Ge(i){let e="";for(const t of i){const{name:n}=t;let{value:s}=t;Ue.includes(n)?s!==!1&&s!==0&&s!==void 0&&s!==null&&(e+=` ${n}`):(s instanceof Array?s=s.join(","):s===!0?s="true":s===!1?s="false":s===void 0?s="undefined":s===null?s="null":s instanceof Function?s=`return(${s.toString()}).call(this,window.event)`:s=s.toString(),s=s.replace(/\"/g,'\\"'),s=he(s),e+=` ${n}="${s}"`)}return e}function Be(i){let e="";return e=i.replace(/([A-Z])/g,(t,n)=>`-${n.toLowerCase()}`),e}function ze(i){let e="";for(const t in i){const n=i[t];e+=`${Be(t)}:${n};`}return e.trim()}function fe(i,e,t,n=!1){let s="",r="",c="";if(e&&(r=t,c=`
`),i instanceof Z)s+=`${c}${r}<!--${i.textContent}-->`;else if(i instanceof ee)s+=`${c}${r}${i.textContent}`;else if(i instanceof I){const o=Ye.includes(i.tagName),l=Ge(i.attributes);let a="";Object.keys(i.style).length>0&&(a=` style="${ze(i.style)}"`),n&&(s+=c),s+=r,i.tagName&&(s+=`<${i.tagName.toLowerCase()}${l}${a}`,s+=o?"":">"),s+=i.textContent;let h="";for(const f of i.childNodes)h+=fe(f,e,t+e,!0);h&&(s+=h+c+r),i.tagName!==""&&(s+=o?"/>":`</${i.tagName.toLowerCase()}>`)}return s}class W extends L{#e=[];#n="";constructor(e,t){super(e,t.toUpperCase()),this.#n=t.toUpperCase()}get attributes(){return this.#e}get children(){return this.childNodes.filter(e=>e instanceof W)}get className(){let e="";for(const t of this.#e)if(t.name==="class"){e=t.value;break}return e}set className(e){this.setAttribute("class",e)}get innerHTML(){return this.textContent}set innerHTML(e){this.textContent=e}get tagName(){return this.#n}append(e){e instanceof L?this.appendChild(e):this.textContent=he(e.toString())}getAttribute(e){let t="";if(t=e.trim().toLowerCase(),!t)return null;const n=this.#e.findIndex(s=>s.name===t);return n===-1?null:this.#e[n].value}remove(){this.parentNode?.removeChild(this)}setAttribute(e,t){let n="";if(n=e.trim().toLowerCase(),!n)return;const s=t,r=this.#e.findIndex(c=>c.name===n);r===-1?this.#e.push({name:n,value:s}):this.#e[r]={name:n,value:s}}}function We(i){let e=i;const t={"&":"&amp;","<":"&lt;",">":"&gt;"};return e=e.replace(/[&<>"]/g,n=>{let s=n;return n in t&&(s=t[n]),s}),e}function Ve(i){const e=i.split("-");return e.length===1?e[0]:e[0]+e.slice(1).map(t=>t[0].toUpperCase()+t.slice(1)).join("")}function qe(i){const e={};return i.split(";").forEach(t=>{const[n,s]=t.split(":");if(!n)return;const r=Ve(n.trim());e[r]=s.trim()}),e}let I=class extends W{#e={};constructor(e){super(N.ELEMENT_NODE,e)}get innerText(){return this.textContent}set innerText(e){this.textContent=We(e.toString())}get style(){return this.#e}set style(e){if(typeof e=="string"){const t=qe(e);for(const n in t)this.#e[n]=t[n].toString()}}},ue=class extends L{constructor(){super(N.DOCUMENT_FRAGMENT_NODE,"#document-fragment")}};class Ke extends L{ELEMENT_NODE=N.ELEMENT_NODE;ATTRIBUTE_NODE=N.ATTRIBUTE_NODE;TEXT_NODE=N.TEXT_NODE;CDATA_SECTION_NODE=N.CDATA_SECTION_NODE;PROCESSING_INSTRUCTION_NODE=N.PROCESSING_INSTRUCTION_NODE;COMMENT_NODE=N.COMMENT_NODE;DOCUMENT_NODE=N.DOCUMENT_NODE;DOCUMENT_TYPE_NODE=N.DOCUMENT_TYPE_NODE;DOCUMENT_FRAGMENT_NODE=N.DOCUMENT_FRAGMENT_NODE;#e;#n=[];constructor(){super(9,"#document");const e=new I("html"),t=new I("head"),n=new I("body");e.appendChild(t),e.appendChild(n),this.#n.push(e),this.#e=n}get body(){return this.#e}get children(){return this.#n}get parentElement(){return null}createDocumentFragment(){return new ue}createComment(e=""){const t=new Z;return t.textContent=e,t}createElement(e){return new I(e)}createTextNode(e){const t=new ee;return t.textContent=e,t}}class Xe{Comment=Z;DocumentFragment=ue;Element=W;HTMLElement=I;Node=L;Text=ee;DOMException=z;Error=Error;TypeError=TypeError;document;constructor(){this.document=new Ke}}const Je=R(),Qe=new Xe;class O{state=null;#e=[];#n=[];#s="";#r=!1;#t=!1;#a="";#i="";#h=new Map;#d=new Map;#m=[];#f=[];getElements(){return this.#r?this.#E(null):(this.#c(null,window,!0),this.#n)}getElementsSr(){if(this.#r)return this.#E("");const e=this.#p();return this.#c("",e,!0),this.#n}html(e){if(this.#r)return this.staticHtml(e);const t=this.#p();return this.#c("",t,!0,e),this.#s}paint(e){if(!Je)throw new Error("You can only use this function in browser environment");if(!e)throw new Error("No container selected.");if(typeof e!="string"&&!(e instanceof HTMLElement)&&!(e instanceof NodeList)&&!(e instanceof Array)&&!(e instanceof HTMLCollection))throw new Error(`Wrong type for the container element. Expected <string> or <Node>, got <${typeof e}>`);this.#c(e,window,!0)}static(e=!0){return this.#r=e,this}staticHtml(e){const t=this.#f[0]??null;if(!this.#d.has(t)){const n=this.#p();this.#c("",n,!0,e),this.#d.set(t,this.#s)}return this.#d.get(t)??""}template(e){}useTemplates(...e){if(e instanceof Array)for(const t of e)if(t instanceof Array)for(const n of t)this.#m.push(n);else this.#m.push(t);return this}useTranslations(...e){return e.map(t=>{t instanceof Array?t.forEach(n=>{this.#f.includes(n)||(this.#f=[...this.#f,n])}):t instanceof Object&&(this.#f.includes(t)||(this.#f=[...this.#f,t]))}),this}#u(){if(this.#e)for(const e of this.#e)for(;e?.firstChild;)e.removeChild(e.firstChild)}#E(e){const t=this.#f[0]??null;if(!this.#h.has(t)){const n=this.#p();this.#c(e,n,!0),this.#h.set(t,this.#n)}return this.#h.get(t)??[]}#p(){return Qe}#A(e,t,n,s){return this.#n.length=0,this.#s="",this.#o(e,t),this.#b(n),this.#N(s),!0}#o(e,t){const n=t.document.baseURI==="";if(typeof e=="string"){if(this.#a=e,this.#t=!1,Oe(e))this.#t=!0;else if(Me(e)||(this.#i=e),this.#e=n?[t.document.createElement("#container")]:t.document.querySelectorAll(e),!this.#e)throw new Error(`Could not find an element by the following query: ${e}`)}else if(e instanceof HTMLElement)this.#e=[e];else if(e instanceof NodeList||e instanceof HTMLCollection)this.#e=e;else if(e instanceof Array){for(const s of e)if(!(s instanceof HTMLElement))throw new Error("All elements in the input array must be DOM elements");this.#e=e}return!0}#N(e){this.template instanceof Function&&(this.state=this.state?J(this.state):this.state,this.#m.push(this.template.bind(this)));for(let t of e)if(!(t instanceof Function)&&!(t instanceof O))throw new Error("The template must be a function");return!0}#b(e){if(!(e instanceof Array))throw new Error("The argument 'translations' must be an Array");return this.#f=e,!0}#c(e,t,n=!0,s={}){this.#A(e,t,this.#f,this.#m),n&&this.#u();const r=this.#m,c=this.#f;if(!t)throw new Error("Missing window element");if(this.#t){const o=l=>class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){if(!this.shadowRoot)throw new Error("Missing shadow root");l.#y(t,this.shadowRoot,r,c,s)}};customElements.define(this.#a,o(this))}else if(this.#i&&new MutationObserver(l=>{for(const a of l){const h=a.addedNodes;for(let f of h)f instanceof HTMLElement&&f.matches(this.#i)&&this.#y(t,f,r,c,s)}}).observe(document.body,{attributes:!1,childList:!0,characterData:!1,subtree:!0}),this.#e.length===0)this.#y(t,null,r,c,s);else for(const o of this.#e)this.#y(t,o,r,c,s)}#y(e,t,n,s,r={}){const c=new ae(e,t,n,s);c.render(),this.#s=c.getHtmlCode(r),this.#n.push(c.getCreatedElements())}}const Ze="modulepreload",et=function(i){return"/"+i},ie={},re=function(e,t,n){return e()},tt=function(){let i="en";return R()&&(i=document.getElementById("html")?.getAttribute("lang")??i),i},nt=async function(i,e){if(typeof i!="string")throw new Error("Translation path must be a string");let t=null;const n=i.match(/^(.*?)([^.\/\\]+)(.\w+)$/m);if(n===null)throw new TypeError(`Incorrect path: ${i}`);const s=n[1]+e+n[3];try{t=(await re(()=>import(s),void 0)).default}catch{s!==i&&(t=(await re(()=>import(i),void 0)).default)}if(!(t instanceof Object))throw new TypeError(`Translation at ${s} must export an object`);return t},de=async function(...i){const e=tt(),t=[];for(let n of i)t.push(nt(n,e));return Promise.all(t)};function me(...i){return new O().useTemplates(...i)}function Ee(i){return i[H]=!0,i}function pe(i){return i instanceof Function&&H in i}const ge={component:me,state:J,isTemplate:pe,template:Ee,fetchTranslations:de,Component:O};exports.Component=O;exports.component=me;exports.default=ge;exports.fetchTranslations=de;exports.isTemplate=pe;exports.paintor=ge;exports.state=J;exports.template=Ee;
//# sourceMappingURL=paintor.cjs.js.map
