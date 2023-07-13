define(["require","exports"],function(se,_){"use strict";function ie(i){const e=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(i){for(const t in i)if(t!=="default"){const n=Object.getOwnPropertyDescriptor(i,t);Object.defineProperty(e,t,n.get?n:{enumerable:!0,get:()=>i[t]})}}return e.default=i,Object.freeze(e)}const d=Object.freeze({CREATE:1,READ:2,UPDATE:3,DELETE:4,ARRAY_SPLICE:5,ARRAY_SWAP:6,ARRAY_COPY_WITHIN:7,ARRAY_SORT:8,ARRAY_PUSH:9,ARRAY_LENGTH:10}),Ne=Object.freeze(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"]),O=Symbol("Subscriptions"),$=Symbol("Access"),H=Symbol("TemplateFunction"),L=Symbol("State");let N={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null};function Y(i,e,t,n,s){N.element=i,N.propertyName=e,N.subPropertyName=t,N.bindFunction=n,N.statementRepaintFunction=s}function I(){N.element=null,N.propertyName="",N.subPropertyName="",N.bindFunction=null,N.statementRepaintFunction=null}class we{#e={receiver:[],target:[],callback:()=>{}};callArrayFn(e,t,n,s){switch(this.#e.target=t,this.#e.receiver=n,this.#e.callback=s,e){case"push":return this.#s;case"copyWithin":return this.#n;case"reverse":return this.#r;case"shift":return this.#t;case"sort":return this.#c;case"splice":return this.#i;case"unshift":return this.#a;default:return t[e]}}#n=(...e)=>{const{target:t,receiver:n}=this.#e;let[s,r,c]=e;const{length:o}=t;if(s<0)s+=o;else if(s<-o)s=0;else{if(s>=o)return;s>r&&(c=o-1)}if(r<0)r+=o;else if(r<-o||r===void 0)r=0;else if(r>=o)return;if(c<0)c+=o;else if(c<-o)c=0;else if(c>=o||c===void 0)c=o;else if(c<=r)return;const l=t.copyWithin.apply(t,[s,r,c]);return this.#e.callback(d.ARRAY_COPY_WITHIN,n,[s,r,c]),l};#s=(...e)=>{const{target:t,receiver:n}=this.#e,s=t.push.apply(t,e);return this.#e.callback(d.ARRAY_PUSH,n,e),s};#r=()=>{const{target:e,receiver:t}=this.#e,n=e.reverse.apply(e);for(let s=0,r=e.length;s<r;s++){const c=r-1-s;if(s>=c)break;this.#e.callback(d.ARRAY_SWAP,t,[s,c])}return n};#t=()=>{const{target:e,receiver:t}=this.#e,n=e.shift.apply(e);return this.#e.callback(d.ARRAY_SPLICE,t,[0,1]),n};#c=(...e)=>{const{target:t,receiver:n}=this.#e,s=t.sort.apply(t,e);return this.#e.callback(d.ARRAY_SORT,n,e),s};#i=(...e)=>{const{target:t,receiver:n}=this.#e,s=t.splice.apply(t,e);return this.#e.callback(d.ARRAY_SPLICE,n,e),s};#a=(...e)=>{const{target:t,receiver:n}=this.#e,s=t.unshift.apply(t,e);return this.#e.callback(d.ARRAY_SPLICE,n,[0,0,...e]),s}}class Ce{#e=new Map;get subscriptions(){return this.#e}subscribe(e,t,n,s,r,c,o){(s==="-s-if"||s==="-s-forEach"||s==="-s-forState")&&(t=s),this.#e.has(t)||this.#e.set(t,new Map);const l=this.#e.get(t)??new Map;l.has(n)||l.set(n,[]);const a=l.get(n);for(const u of a)if(u.propertyName===s&&u.subPropertyName===r&&u.bindFunction===c&&u.statementRepaintFunction===o)return;const h={propertyName:s,subPropertyName:r,bindFunction:c,statementRepaintFunction:o,stateSubscription:this};a.push(h),n[O]??=[],n[O].push(h)}unsubscribe(e){if(O in e&&e[O]instanceof Array){const t=e[O];let n=t.length;for(;n--;)t[n].stateSubscription===this&&t.splice(n,1)}for(const[t,n]of this.#e)n.delete(e)}}function Ae(i){return Object.hasOwn(i,O)}function Oe(i,e,t,n){if(O in i&&i[O]instanceof Array){let s=i[O].length;for(;s--;){const r=i[O][s];if(t===void 0||t===r.bindFunction){if(n)for(const c in n)r[c]=n[c];e[O]??=[],e[O].push(r),i[O].splice(s,1)}}}}function q(i){const e=i[O];if(e===void 0)return;let t=e.length;for(;t--;)e[t]&&e[t].stateSubscription.unsubscribe(i);delete i[O]}class Se{#e;#n;constructor(){this.#e=new we,this.#n=new Ce}createProxy(e,t=""){if(!(e instanceof Object))throw new Error("Cannot create a Proxy on non-object");const n=this.#s(),s=new Proxy(e,n);for(const r in s){if(!(s[r]instanceof Object))continue;const c=t===""?r:`${t}.${r}`;s[r]=this.createProxy(s[r],c)}return e instanceof Object&&(L in s||(s[L]={target:e})),s}#s(){return{get:(t,n,s)=>{if(L in t&&(t=t[L].target),n===L)return t[n];if(Object.hasOwn(t,n)||n===$)N.element&&N.bindFunction&&this.#n.subscribe(t,n,N.element,N.propertyName,N.subPropertyName,N.bindFunction,N.statementRepaintFunction);else if((t instanceof Map||t instanceof Set)&&t[n]instanceof Function){const r=t[n];return(...o)=>{const l=r.apply(t,o);return t instanceof Set?n==="add"?this.#t(s,n):n==="delete"&&this.#i(s,n):t instanceof Map&&(n==="set"?this.#t(s,n):n==="delete"&&this.#i(s,n)),l}}else if(t instanceof Array&&t[n]instanceof Function&&typeof n=="string")return this.#e.callArrayFn(n,t,s,this.#r);return t[n]},set:(t,n,s,r)=>(n===L||n===$?t[n]=s:t instanceof Array&&n==="length"?(t[n]=s,this.#r(d.ARRAY_LENGTH,r,[s])):Object.hasOwn(t,n)?s instanceof Object?(t[n]=this.createProxy(s),this.#i(r,n),this.#t(r,n)):(t[n]=s,this.#a(r,n,s)):(s instanceof Object?t[n]=this.createProxy(s):t[n]=s,this.#t(r,n)),!0),deleteProperty:(t,n)=>(delete t[n],this.#i(t,n),!0)}}#r=(e,t,n)=>{const s=this.#n.subscriptions.get("-s-forState");if(s)for(const[r,c]of s)for(let o=0,l=c.length;o<l;o++){const{statementRepaintFunction:a}=c[o];a&&a(e,t,"",n)}};#t(e,t){this.#c(d.CREATE,e,t)}#c(e,t,n){const s=this.#n.subscriptions.get("-s-forState");if(s)for(const[r,c]of s)for(let o=0,l=c.length;o<l;o++){const{statementRepaintFunction:a}=c[o];a&&a(e,t,n)}}#i(e,t){this.#c(d.DELETE,e,t)}#a(e,t,n){if(this.#n.subscriptions.has(t)){const s=this.#n.subscriptions.get(t);if(s)for(const[r,c]of s)for(const o of c){const{propertyName:l,subPropertyName:a,bindFunction:h,statementRepaintFunction:u}=o;if(Object.hasOwn(r,"--deleted")){this.#n.unsubscribe(r);return}let g=h.call(r,r);l==="style"&&a?r.style[a]=ae(a,g):l==="--if"||l==="--for"||l==="--nest"?u&&u(g):(g instanceof Function&&(g=g()),B(r,l,g))}}}}const K=function(e){if(!(e instanceof Object))throw new Error("state() only accepts Object, Array, Set or Map as input value.");return new Se().createProxy(e)},X=function(i){return i instanceof Object&&L in i};function Me(){return typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global||this}function re(i,...e){const t=/(%?)(%([ojdsif]))/g;if(i=i??"",e.length>0){const n=(s,r,c,o)=>{let l=e.shift(),a="";switch(o){case"o":Array.isArray(l)&&(a=JSON.stringify(l));break;case"s":a=""+l;break;case"d":a=""+Number(l);break;case"j":a=JSON.stringify(l);break;case"i":a=""+parseInt(""+l,10);break;case"f":a=""+parseFloat(""+l);break}return r?(e.unshift(a),s):a};i=i.replace(t,n)}return e.length>0&&(i+=" "+e.join(" ")),i=i.replace(/%{2,2}/g,"%"),""+i}function k(){if(k.isIt===void 0){const i=new Function("try {return this===window;}catch(e){ return false;}");k.isIt=i()}return k.isIt??!1}k.isIt=void 0;function D(i,e){e.push(i)}function G(i,e){for(const t of i)e.push(t)}function oe(i){return i.toLowerCase().indexOf("on")===0}function v(i){return i===" "||i==="	"||i==="\r"||i===`
`}function xe(i){return/^[a-z][a-z0-9-]+$/.test(i)&&i.includes("-")}function Fe(i){return/#[a-z0-9-]+\s*$/.test(i)}function _e(i){if(i==="true")return!0;if(i==="false")return!1;const e=parseInt(i);return isNaN(e)?!!i:!!e}function Le(i,e,t){if(!(i instanceof window.Node)||typeof e!="string"||typeof t!="function"||oe(e)===!1)return!1;const n=e.toLowerCase().substring(2);return i.addEventListener(n,t),!0}function De(i,e){if(e.length===1)i.appendChild(e[0]);else if(e.length>1){const t=new DocumentFragment;for(const n of e)n&&t.append(n);i.appendChild(t)}}function Re(i,e){for(const t of e)t&&i.appendChild(t)}function le(i,e){i&&(k()&&i instanceof window.Node?De(i,e):Re(i,e))}function ce(i,e,t,n,s,r,c){if(!(t instanceof Function))throw new TypeError('"handler" argument should be a Function');const o=X(e)?e[L].target:e,l=i===2&&X(o);if(o instanceof Array){l&&e[$],r===void 0&&o.length===0&&n instanceof Function&&(n(),c?.(void 0));for(const a in o){if(r!==void 0&&r!==a)continue;let h=l&&o[a]instanceof Object?e[a]:o[a];s&&(h=s?.(h));const u=t(h,a);if(c?.(a),u===!1)break}}else if(o instanceof Map||o instanceof Set){l&&e[$],r===void 0&&o.size===0&&n instanceof Function&&(n(),c?.(void 0));for(const[a,h]of o.entries()){if(r!==void 0&&r!==a)continue;let u=h;s&&(u=s?.(u));const g=t(u,a);if(c?.(a),g===!1)break}}else if(o instanceof Object){l&&e[$],r===void 0&&Object.keys(o).length===0&&n instanceof Function&&(n(),c?.(void 0));for(const a in o){if(r!==void 0&&r!==a)continue;let h=l&&o[a]instanceof Object?e[a]:o[a];s&&(h=s?.(h));const u=t(h,a);if(c?.(a),u===!1)break}}else throw new TypeError('"data" argument should be an Object or an Array');return!0}function ve(i,e,t){if(typeof i!="number"||typeof e!="number")return new Error('"start" and "end" arguments should be numbers');if(!(t instanceof Function))return new Error('"handler" argument should be a Function');if(e>=i)for(let n=i;n<=e&&t(n)!==!1;n++);else for(let n=i;n>=e&&t(n)!==!1;n--);return!0}function ke(i,e){return i.splice(e,1),i}function Ie(i,e){if(!e)return;const{nextSibling:t,parentNode:n}=e;n&&n.insertBefore(i,t)}function Pe(i,e){if(e instanceof Object)for(const t in e){const n=e[t].toString();i.setAttribute(`data-${t}`,n)}}function B(i,e,t){e in i?t instanceof Array?i[e]=re.apply(null,t):i[e]=t??"":"setAttribute"in i&&i.setAttribute(e,t)}function ae(i,e){let t=e;return(i==="visibility"||i==="backfaceVisibility")&&(e===!0||e===!1||e===void 0||e===null)&&(t=e?"visible":"hidden"),i==="display"&&(e===!0||e===!1||e===void 0||e===null)&&(t=e?"":"none"),i==="flex"&&(e===!0||e===!1||e===void 0||e===null)&&(t=e?1:0),t}function je(i){return i instanceof Array?i.length:i instanceof Map||i instanceof Set?i.size:i instanceof Object?Object.keys(i).length:0}function $e(i,e,t){if(t>=i.length){let n=t-i.length+1;for(;n--;)i.push(void 0)}return i.splice(t,0,i.splice(e,1)[0]),i}const He=(...i)=>{const e=i.length;for(let t=1;t<e;t++)i[t-1].after(i[t])};class z{elements=[];addElement(e){e&&this.elements.push(e)}addElements(e){for(let t of e)this.elements.push(t)}getElements(){return this.elements}hasElement(e){return this.elements.indexOf(e)>-1}importElements(e){const t=e.getElements();for(const n of t)this.addElement(n)}moveElementAfterAnother(e,t){const n=this.elements.indexOf(e),s=this.elements.indexOf(t);if(n===-1||s===-1)throw new Error("Cannot move one element after another, because one element is missing");s-n!==1&&(this.elements=$e(this.elements,n,s+1))}removeAllElements(){this.elements.length=0}removeTheseElements(e){let t=e.length;for(;t--;){let n=this.elements.length;for(;n--;)if(e[t]===this.elements[n]){this.elements.splice(n,1);continue}}}replaceElements(e){this.elements=e}}class J{tagName="-";parent=this;children=[];attributes={};newChild(e,t){const n=new J;return n.parent=e,n.attributes=t,this.children.push(n),n}}const Q=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]);class Ue{#e="";#n="";#s="";#r={};#t;#c;#i=[];#a=this.#O;#u="";#d="";#f={};#h="";#m="";#y="";#w=new J;#o=this.#w;constructor(e,t){this.#i=this.#S(e,t),this.#p()}generate(e){if(this.#h||this.#m)throw new Error("Some HTML tag is not closed");return this.#T(e,this.#w)}#C(e,t){return typeof e=="function"?typeof t=="function"?t:e:typeof e=="string"&&(typeof t=="string"||typeof t=="number"||typeof t=="boolean")?e+t.toString():t}#T(e,t){const n=[];for(const s of t.children){let r=null;s.tagName==="if"?r=e.if(_e(s.attributes?.condition??""),()=>this.#T(e,s)):s.tagName==="for"?"iterations"in s.attributes?r=e.for(0,parseInt(s.attributes?.iterations??0)-1,(c,o)=>{this.#T(e,s)}):("from"in s.attributes||"to"in s.attributes)&&(r=e.for(parseInt(s.attributes?.from??0),parseInt(s.attributes?.to??0),(c,o)=>{this.#T(e,s)})):s.tagName==="forEach"?"object"in s.attributes&&(r=e.forEach(s.attributes?.object??{},(c,o)=>{this.#T(e,s)})):(r=e.createElement(s.tagName,s.attributes,this.#T(e,s)),n.push(r))}return n}#E(){const e=this.#o,t=this.#r;Object.keys(this.#f).length>0&&(t.style=this.#f);const n=this.#o.newChild(e,t);n.tagName=this.#h,this.#o=n}#S(e,t=[]){const n=[];for(let s=0;s<e.length;s++)e[s]&&n.push(e[s]),t[s]!==void 0&&n.push(t[s]);return n}#p(){for(let e=0;e<this.#i.length;e++)if(typeof this.#i[e]=="string")for(let t=0;t<this.#i[e].length;t++)this.#t=this.#i[e][t],this.#c=this.#i[e][t-1],this.#a();else this.#t=this.#i[e],this.#c=void 0,this.#a()}#g(e,t){e&&(this.#r[e]=typeof t=="string"?t.trim():t)}#l(e){e===this.#N&&(this.#e="",this.#s="",this.#n=""),this.#a=e}#b(e,t){e&&(this.#f[e]=typeof t=="string"?t.trim():t)}#N(){v(this.#t)||(this.#t==="/"?(Q.includes(this.#h)&&this.#E(),this.#l(this.#M)):this.#t===">"?(this.#E(),this.#l(this.#O)):this.#t==="="?this.#l(this.#A):this.#e+=this.#t)}#A(){v(this.#t)||(this.#t==="'"||this.#t==='"'?(this.#n=this.#t,this.#l(this.#e==="style"?this.#F:this.#x)):(this.#n=" ",this.#s=this.#C(this.#s,this.#t),this.#l(this.#x)))}#x(){this.#t===">"&&this.#c!=="/"?(this.#n&&this.#e&&this.#s&&this.#g(this.#e,this.#s),this.#e="",this.#s="",this.#n="",this.#l(this.#O),this.#E()):this.#t===this.#n||this.#n===" "&&v(this.#t)?(this.#g(this.#e,this.#s),this.#l(this.#N)):this.#t instanceof Object?this.#s=this.#t:this.#s+=this.#t}#O(){v(this.#t)||(this.#t==="<"?(this.#h="",this.#r={},this.#l(this.#_)):(this.#c===" "?this.#y=this.#c+this.#t:this.#y=this.#t,this.#h="",this.#r={},this.#E(),this.#l(this.#D)))}#F(){v(this.#t)||(this.#t===">"?this.#l(this.#O):this.#t===this.#n||this.#n===" "&&v(this.#t)?this.#l(this.#N):this.#t===":"?this.#l(this.#L):this.#u+=this.#t)}#L(){this.#t===">"?this.#l(this.#O):this.#t===";"?(this.#b(this.#u,this.#d),this.#u="",this.#d="",this.#l(this.#F)):this.#t===this.#n?(this.#b(this.#u,this.#d),this.#u="",this.#d="",this.#l(this.#N)):this.#d=this.#C(this.#d,this.#t)}#_(){if(v(this.#t))this.#h!==""&&this.#l(this.#N);else if(this.#t==="/"&&Q.includes(this.#h))this.#o.tagName||(this.#o=this.#o.parent),this.#E(),this.#l(this.#M);else if(this.#t===">"){if(!this.#h)throw new Error("Expected tag name, found >");this.#o.tagName||(this.#o=this.#o.parent),this.#E(),this.#l(this.#O)}else this.#c==="<"&&this.#t==="/"?(this.#h,this.#m="",this.#l(this.#M)):this.#h+=this.#t}#M(){if(!v(this.#t))if(this.#t===">"){if(this.#o.tagName&&this.#o.tagName!=="-"&&!Q.includes(this.#o.tagName)&&this.#o.tagName!==this.#m)throw new Error(`Expected ${this.#o.tagName} tag to be closed, but ${this.#m} found`);this.#h="",this.#m="",this.#o.tagName?this.#o=this.#o.parent:this.#o=this.#o.parent.parent,this.#l(this.#O)}else this.#m+=this.#t}#D(){this.#t==="<"?(this.#r={},this.#o.attributes.textContent=this.#y,this.#l(this.#_)):(this.#y=this.#C(this.#y,this.#t),this.#o.tagName||(this.#o.attributes.textContent=this.#y))}}class he{#e=[new z];#n;#s;#r=!0;#t=null;#c=[];#i=[];#a;constructor(e,t,n,s=[]){this.#a=e,this.#s=e.document,this.#r=this.#s.baseURI==="",this.#n=t,this.#c=n,this.#i=s}createElement(e,...t){const n=e?this.#s.createElement(e):this.#s.createTextNode("");let s=[],r=0;for(const o of t)if(r+=1,typeof o=="string"){const l=this.#s.createTextNode(this.#b(o));D(l,s)}else if(typeof o=="number"){const l=this.#s.createTextNode(o.toString());D(l,s)}else if(o instanceof this.#a.Node)D(o,s);else if(o instanceof Array){if(o.length===0)continue;let l=!1;for(const a of o)if(a instanceof this.#a.Node){l=!0;break}if(l)G(o,s);else{const a=this.#s.createTextNode(this.#h(o));D(a,s)}}else if(o instanceof Error)n.textContent=this.#b(o.message);else if(o instanceof S){const l=this.#r?o.useTranslations(this.#i).getElementsSr():o.useTranslations(this.#i).getElements(),{length:a}=l;if(a>0)for(const h of l[a-1])D(h,s)}else if(o instanceof Function)if(o[H]){const{thisLevel:l,upperLevel:a}=this.#m();o(this);const h=this.#e[l].getElements();G(h,s),this.#u({thisLevel:l,upperLevel:a})}else if(this.#r)n.innerHTML=`(${o.toString()})()`;else if(n instanceof HTMLScriptElement){const l=this.#s.createTextNode(`(${o.toString()})()`);n.appendChild(l)}else if("value"in n&&!(n instanceof HTMLLIElement))this.#E(n,{value:o});else{const l=()=>{this.#g("nest",o,!0,(a,h,u,g)=>{if(a instanceof Function||a instanceof S){if(a instanceof S){const x=this.#r?a.useTranslations(this.#i).getElementsSr():a.useTranslations(this.#i).getElements();h?(D(u,s),G(x[0],s),D(g,s)):this.#e[0].addElements(x[0])}else if(H in a)if(a(this),h){const x=this.#e.length-1,T=this.#e[x].getElements();D(u,s),G(T,s),D(g,s)}else s.length=0}else h&&u&&(this.#A(u),this.#E(n,{textContent:a}))})};this.#E(n,{textNode:o},l)}else o instanceof Object&&!(o instanceof Function)&&r===1&&this.#E(n,o);const c=this.#e.length-1;if(s.length>0){const o=this.#e[c].getElements(),l=o.indexOf(s[0]);l>-1&&s.length<o.length-l&&(s=o.slice(l))}return le(n,s),this.#e[c].removeTheseElements(s),this.#e[c].addElement(n),n}for(e,t,n){const s=()=>{const r=ve(e,t,n);r instanceof Error&&console.error(r)};return this.#p("for",null,s)}forEach(e,t){return this.#y(1,e,t)}forState(e,t,n){return this.#y(2,e,t,n)}getCreatedElements(){return this.#e[0].getElements()}getHtmlCode(e){let t="";if(this.#r){const n=this.#n;n&&(t=n.paintChildren(e))}return t}html(e,...t){const n=t.length===0&&this.#i.length===0?this.#w(e instanceof Array?e[0]:e):this.#o(e instanceof Array?e:[e],...t);for(const s of n)s.tagName===""&&(s.textContent=this.#b(s.textContent));return n}if(e,t,n){const s=r=>{if(r)if(t instanceof S){const c=this.#r?t.useTranslations(this.#i).getElementsSr():t.useTranslations(this.#i).getElements(),o=this.#e.length-1;this.#e[o].addElements(c[0])}else t instanceof Function&&t();else if(n instanceof S){const c=this.#r?n.useTranslations(this.#i).getElementsSr():n.useTranslations(this.#i).getElements(),o=this.#e.length-1;this.#e[o].addElements(c[0])}else n instanceof Function&&n()};return e instanceof Function?this.#g("if",e,!0,s):this.#p("if",e,s)}async render(){this.#e=[new z];for(const e of this.#c)if(e instanceof Function){let t=e(this);if(t instanceof Promise&&(t=await t),t&&typeof t=="string")this.html(t);else if(t instanceof S){const n=this.#r?t.useTranslations(this.#i).getElementsSr():t.useTranslations(this.#i).getElements();for(const s of n)this.#e[0].addElements(s)}else if(t instanceof Function)t(this);else if(t instanceof Array){let n=!0,s=!0;for(const r of t){if(!(r instanceof S)){n=!1;break}if(!(r instanceof Function)){s=!1;break}}if(n)for(const r of t){if(!(r instanceof S))break;const c=this.#r?r.useTranslations(this.#i).getElementsSr():r.useTranslations(this.#i).getElements();for(const o of c)this.#e[0].addElements(o)}else if(s)for(const r of t){if(!(r instanceof Function))break;r(this)}}}else if(e instanceof S){const t=this.#r?e.useTranslations(this.#i).getElementsSr():e.useTranslations(this.#i).getElements();for(const n of t)this.#e[0].addElements(n)}this.#d()}#u({thisLevel:e,upperLevel:t}){const n=this.#e[e].getElements();return this.#e[t].importElements(this.#e[e]),this.#e[e].replaceElements([]),delete this.#e[e],this.#e.pop(),n}#d(){const e=this.#n;e&&le(e,this.getCreatedElements())}#f(e){return!!this.#i?e.map(n=>this.#b(n)):e}#h(e){return this.#b(re.apply(null,this.#f(e)))}#m(){this.#e.push(new z);const e=this.#e.length-1,t=e-1;return{thisLevel:e,upperLevel:t}}#y(e,t,n,s){let r=null;const c=a=>this.#b(a);if(X(t)){const a=(h,u,g)=>{const x=[];let T=u.getElements().length;return ce(e,h,n,s,c,g,A=>{const F=u.getElements(),j=T===0?F:F.slice(T);if(A===void 0){if(r)return;r=j}else if(r){for(const m of r)this.#A(m),m.remove();r=null}x.push({key:A,elements:j}),T=F.length}),x};return this.#l("forState",t,a,s instanceof Function)}const o=a=>{ce(e,a,n,s,c)},l=e===1?"forEach":"forState";return t instanceof Function?this.#g(l,t,!0,o):this.#p(l,t,o)}#w(e){let t=[];if(this.#r){const s=this.#s.createElement("");s.innerHTML=e??"",t=[s]}else{this.#t||(this.#t=this.#s.createElement("template"));const s=this.#t;s.innerHTML=e.trim()??"",t=Array.from(s.content.childNodes),s.innerHTML=""}const n=this.#e.length-1;return this.#e[n].addElements(t),t}#o(e,...t){return new Ue(e,t).generate(this)}#C(e,t){if(!this.#n?.contains(e))return!1;let n=e;for(const s of t)Ie(s,n),n=s;return!0}#T(e){if(e.nodeType!==8)return-1;const n=e.textContent;let s="";if(n)s=n.slice(0,-6)+"-end";else return-1;let r=e.nextSibling,c=0,o=0;for(;r!==null;){if(r.nodeType===8){const a=r.textContent;if(a===n)c+=1;else if(a===s&&(c-=1,c<0))break}const{nextSibling:l}=r;this.#A(r),r.remove(),o+=1,r=l}return o}#E(e,t,n){for(let s in t){let r=t[s];if(this.#r){if(oe(s)&&r instanceof Function){B(e,s,r);continue}}else if(r instanceof Function&&Le(e,s,r))continue;if(r instanceof Function){const c=r;Y(e,s,"",c,null);let o=c(e);if(o instanceof Function&&Object.hasOwn(o,H)||o instanceof S){I(),n&&n();continue}else if(o instanceof Function)o=o();else if(s==="textNode"){I();const l=this.#s.createTextNode(o);e.appendChild(l),Oe(e,l,c,{propertyName:"textContent"});continue}I(),o instanceof Array?o=this.#h(o):typeof o=="string"&&(o=this.#b(o)),s&&B(e,s,o)}else e instanceof this.#a.HTMLElement&&s==="style"&&r instanceof Object?this.#S(e,r):e instanceof this.#a.HTMLElement&&s==="data"?r instanceof Object&&Pe(e,r):s==="textContent"?r instanceof Array?e[s]=this.#h(r):e[s]=this.#b(r):((s==="innerText"||s==="value"&&e.tagName==="INPUT"&&(e.getAttribute("type")??"").toLowerCase()==="button")&&(r=this.#b(r)),B(e,s,r))}}#S(e,t){for(const n in t){const s=t[n];let r="";if(s instanceof Function){const c="style",o=s;Y(e,c,n,o,null),r=o(e),I()}else r=s;typeof n=="string"&&(e.style[n]=ae(n,r))}}#p(e,t,n){const{thisLevel:s,upperLevel:r}=this.#m();return n(t),this.#u({thisLevel:s,upperLevel:r})}#g(e,t,n,s){const{thisLevel:r,upperLevel:c}=this.#m();if(t instanceof Function){const l=this.#s.createComment(`${e}-begin`),a=this.#s.createComment(`${e}-end`);n&&this.#e[r].addElement(l);const h=T=>{if(this.#r)return;const C=this.#e.length-1;this.#e[C].removeAllElements(),s(T,!1,null,null),this.#C(l,this.#e[C].getElements())||console.error("Element ",l," does not exist anymore")},u=l,g=`--${e}`;Y(u,g,"",t,h);const x=t();I(),s(x,!0,l,a),n&&this.#e[r].addElement(a)}else s(t,!1,null,null);return this.#u({thisLevel:r,upperLevel:c})}#l(e,t,n,s){const{thisLevel:r,upperLevel:c}=this.#m(),o=this.#s.createComment(`${e}-begin`),l=this.#s.createComment(`${e}-end`);this.#e[r].addElement(o);const a=(T,C,A,F)=>{let j=!1;o.parentElement&&(this.#e.push(new z),j=!0);const m=this.#e.length-1,f=n(T,this.#e[m],F),E=C instanceof Array;for(const b of f){F!==void 0&&(E?l.renderedElementsMap[F]=b:l.renderedElementsMap.push(b));for(const p of b.elements)m===0&&this.#e[m].moveElementAfterAnother(p,A),A.after(p),A=p}j&&this.#e.pop()},h=(T,C,A,F)=>{const m=C[L].target;if(m instanceof Object&&!this.#r){if(T===d.CREATE){let f=null;const E=m instanceof Map||m instanceof Set?m.keys():Object.keys(m);for(let p of E){if(p===A)break;f=p}let b=o;if(f!==null){for(const p of l.renderedElementsMap)if(p&&p.key===f){const{elements:M}=p;b=M.length>0?M[M.length-1]:b;break}}a(m,m,b,A)}else T===d.UPDATE&&(h(d.DELETE,C,A,void 0),h(d.CREATE,C,A,void 0));if(T===d.DELETE){let f=l.renderedElementsMap.length;for(;f--;){if(!l.renderedElementsMap[f])continue;const E=m instanceof Array;if(l.renderedElementsMap[f].key===A){for(const b of l.renderedElementsMap[f].elements)this.#A(b),b.remove();E?(l.renderedElementsMap[f].elements.length=0,delete l.renderedElementsMap[f]):l.renderedElementsMap=ke(l.renderedElementsMap,f);break}}}else if(T===d.ARRAY_SPLICE){if(m instanceof Array){let[f,E,...b]=F;if(E===1/0?E=m.length-f:E<0&&(E=0),E>0)for(let y=f,U=f+E;y<U;y++)h(d.DELETE,C,y.toString(),void 0),delete l.renderedElementsMap[y];const p=l.renderedElementsMap.length,M=m.length,ne=M-p;if(ne>0){l.renderedElementsMap.length=M;for(let y=M-1;y>=f+b.length;y--){const U=y-ne;if(U<0)break;l.renderedElementsMap[y]=l.renderedElementsMap[U],l.renderedElementsMap[y].key=y.toString(),delete l.renderedElementsMap[U]}}else if(ne<0){l.renderedElementsMap.splice(f,E);for(let y=M-1;y>=f+b.length;y--)l.renderedElementsMap[y].key=y.toString()}if(b.length>0)for(let y=f;y<f+b.length;y++)h(d.CREATE,C,y.toString(),void 0)}l.renderedElementsMap.length=m.length}else if(T===d.ARRAY_SWAP){const[f,E]=F,b=l.renderedElementsMap[E].elements;l.renderedElementsMap[E].elements=l.renderedElementsMap[f].elements,l.renderedElementsMap[f].elements=b;for(let p=1;p<l.renderedElementsMap.length;p++)He(...l.renderedElementsMap[p-1].elements,...l.renderedElementsMap[p].elements)}else if(T===d.ARRAY_COPY_WITHIN){let[f,E,b]=F;for(let p=E,M=f;p<b;p++,M++)h(d.DELETE,C,M.toString(),void 0),h(d.CREATE,C,M.toString(),void 0)}else if(T===d.ARRAY_SORT)for(let f=0,E=m.length;f<E;f++)h(d.DELETE,C,f.toString(),void 0),h(d.CREATE,C,f.toString(),void 0);else if(T===d.ARRAY_PUSH){const f=m.length;let E=l.renderedElementsMap.length,b=o;for(;E--;){const p=l.renderedElementsMap[E];if(!p)continue;const M=p.elements.length;if(M>0){b=p.elements[M-1];break}}A=(f-1).toString(),a(m,m,b,A)}else if(T===d.ARRAY_LENGTH){const f=F?.[0]??0;if(f<l.renderedElementsMap.length){let E=l.renderedElementsMap.length;for(;E--&&!(E<f);)l.renderedElementsMap[E]!==void 0&&h(d.DELETE,C,E.toString(),void 0)}m instanceof Array&&(l.renderedElementsMap.length=m.length)}s&&(!(m instanceof Array)||A==="")&&je(m)===0&&a(C,m,o,void 0)}},u=`-s-${e}`;Y(l,u,"",()=>t,h);const x=n(t,this.#e[r]);return x.length===1&&x[0].key===void 0&&x.splice(0,1),l.renderedElementsMap=x,I(),this.#e[r].addElement(l),this.#u({thisLevel:r,upperLevel:c})}#b(e){if(typeof e=="string"){const t=this.#N(e,this.#i);if(typeof t=="string")return t;const n=Me(),s=this.#N(e,n?.paintorTranslations);if(typeof s=="string")return s}return e}#N(e,t){if(t instanceof Array&&t.length>0){for(const n of t)if(e in n)return n[e]}return!1}#A(e){Ae(e)&&(Object.assign(e,{"--deleted":!0}),q(e));let t=e.childNodes.length;for(;t--;)this.#A(e.childNodes[t])}}function Ye(...i){const e=this;return function(...n){return e.call(this,...i,...n)}}const{prototype:Z}=he;Object.assign(Z.createElement,{bindArgs:Ye}),Ne.forEach(i=>{Z[i]=Z.createElement.bindArgs(i)});const Ge=Object.freeze(["async","autofocus","autoplay","checked","contenteditable","controls","default","defer","disabled","formNoValidate","frameborder","hidden","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","readonly","required","reversed","scoped","selected","typemustmatch"]),Be=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]),w=Object.freeze({ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11});class W extends Error{constructor(e,t){super(e),this.name=t??"DOMException"}}class R{nextSibling=null;previousSibling=null;textContent="";#e=[];#n="";#s=1;#r=null;constructor(e,t){this.#s=e,this.#n=t}get baseURI(){return""}get childNodes(){return this.#e}get firstChild(){return this.#e[0]??null}get nodeName(){return this.#n}get nodeType(){return this.#s}get parentNode(){return this.#r}set parentNode(e){this.#r=e}appendChild(e){if(this.nodeType!==w.DOCUMENT_NODE&&this.nodeType!==w.DOCUMENT_FRAGMENT_NODE&&this.nodeType!==w.ELEMENT_NODE)throw new W("This node type does not support this method.");if(this.nodeType===w.DOCUMENT_NODE)throw new W("Failed to execute 'appendChild' on 'Node': Only one element on document allowed.");if(!(e instanceof R)){const n="Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.";throw new TypeError(n)}if(this.#e.includes(e))return;if(e===this)throw new W("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");this.#e.push(e),e.parentNode=this;const t=this.#e.length-2;t>=0&&(this.#e[t].nextSibling=e,e.previousSibling=this.#e[t]??null)}contains(){return!1}insertBefore(e,t){const n=[];for(const s of this.#e)s===t&&n.push(e),n.push(s);return this.#e=n,e}removeChild(e){if(!e)throw new Error("Failed to execute 'removeChild' on 'HTMLElement': parameter 1 is not of type 'HTMLElement'.");if(!this.#e.includes(e))throw new Error("Failed to execute 'removeChild' on 'HTMLElement': The node to be removed is not a child of this node.");return this.#e=this.#e.filter(t=>t!==e),e}paintChildren({indent:e=""}){let t="",n=0;for(const s of this.childNodes){n+=1;const r=n>1;t+=ue(s,e,"",r)}return t}}class ee extends R{constructor(){super(w.COMMENT_NODE,"#comment")}}class te extends R{constructor(){super(w.TEXT_NODE,"#text")}}function fe(i){let e=i;const t={"&":"&amp;","<":"&lt;",">":"&gt;"};return e=e.replace(/[&<>"]/g,n=>{let s=n;return n in t&&(s=t[n]),s}),e}function ze(i){let e="";for(const t of i){const{name:n}=t;let{value:s}=t;Ge.includes(n)?s!==!1&&s!==0&&s!==void 0&&s!==null&&(e+=` ${n}`):(s instanceof Array?s=s.join(","):s===!0?s="true":s===!1?s="false":s===void 0?s="undefined":s===null?s="null":s instanceof Function?s=`return(${s.toString()}).call(this,window.event)`:s=s.toString(),s=s.replace(/\"/g,'\\"'),s=fe(s),e+=` ${n}="${s}"`)}return e}function We(i){let e="";return e=i.replace(/([A-Z])/g,(t,n)=>`-${n.toLowerCase()}`),e}function Ve(i){let e="";for(const t in i){const n=i[t];e+=`${We(t)}:${n};`}return e.trim()}function ue(i,e,t,n=!1){let s="",r="",c="";if(e&&(r=t,c=`
`),i instanceof ee)s+=`${c}${r}<!--${i.textContent}-->`;else if(i instanceof te)s+=`${c}${r}${i.textContent}`;else if(i instanceof P){const o=Be.includes(i.tagName),l=ze(i.attributes);let a="";Object.keys(i.style).length>0&&(a=` style="${Ve(i.style)}"`),n&&(s+=c),s+=r,i.tagName&&(s+=`<${i.tagName.toLowerCase()}${l}${a}`,s+=o?"":">"),s+=i.textContent;let h="";for(const u of i.childNodes)h+=ue(u,e,t+e,!0);h&&(s+=h+c+r),i.tagName!==""&&(s+=o?"/>":`</${i.tagName.toLowerCase()}>`)}return s}class V extends R{#e=[];#n="";constructor(e,t){super(e,t.toUpperCase()),this.#n=t.toUpperCase()}get attributes(){return this.#e}get children(){return this.childNodes.filter(e=>e instanceof V)}get className(){let e="";for(const t of this.#e)if(t.name==="class"){e=t.value;break}return e}set className(e){this.setAttribute("class",e)}get innerHTML(){return this.textContent}set innerHTML(e){this.textContent=e}get tagName(){return this.#n}append(e){e instanceof R?this.appendChild(e):this.textContent=fe(e.toString())}getAttribute(e){let t="";if(t=e.trim().toLowerCase(),!t)return null;const n=this.#e.findIndex(s=>s.name===t);return n===-1?null:this.#e[n].value}remove(){this.parentNode?.removeChild(this)}setAttribute(e,t){let n="";if(n=e.trim().toLowerCase(),!n)return;const s=t,r=this.#e.findIndex(c=>c.name===n);r===-1?this.#e.push({name:n,value:s}):this.#e[r]={name:n,value:s}}}function qe(i){let e=i;const t={"&":"&amp;","<":"&lt;",">":"&gt;"};return e=e.replace(/[&<>"]/g,n=>{let s=n;return n in t&&(s=t[n]),s}),e}function Ke(i){const e=i.split("-");return e.length===1?e[0]:e[0]+e.slice(1).map(t=>t[0].toUpperCase()+t.slice(1)).join("")}function Xe(i){const e={};return i.split(";").forEach(t=>{const[n,s]=t.split(":");if(!n)return;const r=Ke(n.trim());e[r]=s.trim()}),e}let P=class extends V{#e={};constructor(e){super(w.ELEMENT_NODE,e)}get innerText(){return this.textContent}set innerText(e){this.textContent=qe(e.toString())}get style(){return this.#e}set style(e){if(typeof e=="string"){const t=Xe(e);for(const n in t)this.#e[n]=t[n].toString()}}},de=class extends R{constructor(){super(w.DOCUMENT_FRAGMENT_NODE,"#document-fragment")}};class Je extends R{ELEMENT_NODE=w.ELEMENT_NODE;ATTRIBUTE_NODE=w.ATTRIBUTE_NODE;TEXT_NODE=w.TEXT_NODE;CDATA_SECTION_NODE=w.CDATA_SECTION_NODE;PROCESSING_INSTRUCTION_NODE=w.PROCESSING_INSTRUCTION_NODE;COMMENT_NODE=w.COMMENT_NODE;DOCUMENT_NODE=w.DOCUMENT_NODE;DOCUMENT_TYPE_NODE=w.DOCUMENT_TYPE_NODE;DOCUMENT_FRAGMENT_NODE=w.DOCUMENT_FRAGMENT_NODE;#e;#n=[];constructor(){super(9,"#document");const e=new P("html"),t=new P("head"),n=new P("body");e.appendChild(t),e.appendChild(n),this.#n.push(e),this.#e=n}get body(){return this.#e}get children(){return this.#n}get parentElement(){return null}createDocumentFragment(){return new de}createComment(e=""){const t=new ee;return t.textContent=e,t}createElement(e){return new P(e)}createTextNode(e){const t=new te;return t.textContent=e,t}}class Qe{Comment=ee;DocumentFragment=de;Element=V;HTMLElement=P;Node=R;Text=te;DOMException=W;Error=Error;TypeError=TypeError;document;constructor(){this.document=new Je}}const Ze=k(),et=new Qe;class S{state=null;#e=[];#n=[];#s="";#r=!1;#t=!1;#c="";#i="";#a=new Map;#u=new Map;#d=[];#f=[];#h=!1;clear(){for(const e of this.#n)for(const t of e)q(t),t.remove();this.#n.length=0,this.#s="",this.#a.clear(),this.#u.clear()}#m(e){let t=-1,n=-1;for(const s of this.#e)n++,e===s&&(t=n);if(t!==-1){delete this.#e[t];for(const s of this.#n[t])q(s),s.remove();delete this.#n[t],this.#s="";for(const[s,r]of this.#a)delete r[t];this.#u.clear()}}getElements(){return this.#r?this.#w(null):(this.#p(null,window,!0),this.#n)}getElementsSr(){if(this.#r)return this.#w("");const e=this.#o();return this.#p("",e,!0),this.#n}html(e){if(this.#r)return this.staticHtml(e);const t=this.#o();return this.#p("",t,!0,e),this.#s}paint(e){if(!Ze)throw new Error("You can only use this function in browser environment");if(!e)throw new Error("No container selected.");if(typeof e!="string"&&!(e instanceof HTMLElement)&&!(e instanceof NodeList)&&!(e instanceof Array)&&!(e instanceof HTMLCollection))throw new Error(`Wrong type for the container element. Expected <string> or <Node>, got <${typeof e}>`);this.#p(e,window,!0)}static(e=!0){return this.#r=e,this}staticHtml(e){const t=this.#f[0]??null;if(!this.#u.has(t)){const n=this.#o();this.#p("",n,!0,e),this.#u.set(t,this.#s)}return this.#u.get(t)??""}template(e){}useTemplates(...e){if(e instanceof Array)for(const t of e)if(t instanceof Array)for(const n of t)this.#d.push(n);else this.#d.push(t);return this}useTranslations(...e){return e.map(t=>{t instanceof Array?t.forEach(n=>{this.#f.includes(n)||(this.#f=[...this.#f,n])}):t instanceof Object&&(this.#f.includes(t)||(this.#f=[...this.#f,t]))}),this}#y(){if(this.#e)for(const e of this.#e)for(;e?.firstChild;)e.removeChild(e.firstChild)}#w(e){const t=this.#f[0]??null;if(!this.#a.has(t)){const n=this.#o();this.#p(e,n,!0),this.#a.set(t,this.#n)}return this.#a.get(t)??[]}#o(){return et}#C(e,t,n,s){this.#h||(this.#h=!0,this.#n.length=0,this.#s="",this.#T(e,t),this.#S(n),this.#E(s))}#T(e,t){const n=t.document.baseURI==="";if(typeof e=="string")if(this.#c=e,this.#t=!1,xe(e))this.#t=!0;else{Fe(e)||(this.#i=e);const s=n?[t.document.createElement("#container")]:t.document.querySelectorAll(e);if(this.#e=Array.from(s),!this.#e)throw new Error(`Could not find an element by the following query: ${e}`)}else if(e instanceof HTMLElement)this.#e=[e];else if(e instanceof NodeList||e instanceof HTMLCollection)this.#e=Array.from(e);else if(e instanceof Array){for(const s of e)if(!(s instanceof HTMLElement))throw new Error("All elements in the input array must be DOM elements");this.#e=e}return!0}#E(e){this.template instanceof Function&&(this.state=this.state?K(this.state):this.state,this.#d.push(this.template.bind(this)));for(let t of e)if(!(t instanceof Function)&&!(t instanceof S))throw new Error("The template must be a function");return!0}#S(e){if(!(e instanceof Array))throw new Error("The argument 'translations' must be an Array");return this.#f=e,!0}#p(e,t,n=!0,s={}){this.#C(e,t,this.#f,this.#d),n&&this.#y();const r=this.#d,c=this.#f;if(!t)throw new Error("Missing window element");if(this.#t){if(customElements.get(this.#c)){const l=document.getElementsByTagName(this.#c);for(const a of l)this.#g(t,a.shadowRoot,r,c,s);return}const o=l=>class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){if(!this.shadowRoot)throw new Error("Missing shadow root");l.#g(t,this.shadowRoot,r,c,s)}disconnectedCallback(){l.clear()}};customElements.define(this.#c,o(this))}else if(this.#i&&new MutationObserver(l=>{for(const a of l){const h=a.addedNodes;for(let g of h)g instanceof HTMLElement&&g.matches(this.#i)&&this.#g(t,g,r,c,s);const u=a.removedNodes;for(let g of u)this.#m(g)}}).observe(document.body,{attributes:!1,childList:!0,characterData:!1,subtree:!0}),this.#e.length===0)this.#g(t,null,r,c,s);else for(const o of this.#e)this.#g(t,o,r,c,s)}#g(e,t,n,s,r={}){const c=new he(e,t,n,s);c.render(),this.#s=c.getHtmlCode(r),this.#n.push(c.getCreatedElements())}}const tt="modulepreload",nt=function(i){return"/"+i},me={},Ee=function(e,t,n){return e()},st=function(){let i="en";return k()&&(i=document.getElementById("html")?.getAttribute("lang")??i),i},it=async function(i,e){if(typeof i!="string")throw new Error("Translation path must be a string");let t=null;const n=i.match(/^(.*?)([^.\/\\]+)(.\w+)$/m);if(n===null)throw new TypeError(`Incorrect path: ${i}`);const s=n[1]+e+n[3];try{t=(await Ee(()=>new Promise((r,c)=>se([s],o=>r(ie(o)),c)),void 0)).default}catch{s!==i&&(t=(await Ee(()=>new Promise((c,o)=>se([i],l=>c(ie(l)),o)),void 0)).default)}if(!(t instanceof Object))throw new TypeError(`Translation at ${s} must export an object`);return t},pe=async function(...i){const e=st(),t=[];for(let n of i)t.push(it(n,e));return Promise.all(t)};function ge(...i){return new S().useTemplates(...i)}function be(i){return i[H]=!0,i}function ye(i){return i instanceof Function&&H in i}const Te={component:ge,state:K,isTemplate:ye,template:be,fetchTranslations:pe,Component:S};_.Component=S,_.component=ge,_.default=Te,_.fetchTranslations=pe,_.isTemplate=ye,_.paintor=Te,_.state=K,_.template=be,Object.defineProperties(_,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=paintor.amd.js.map
