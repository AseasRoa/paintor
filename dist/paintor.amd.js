define(["require","exports"],function(V,p){"use strict";function z(i){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(i){for(const e in i)if(e!=="default"){const n=Object.getOwnPropertyDescriptor(i,e);Object.defineProperty(t,e,n.get?n:{enumerable:!0,get:()=>i[e]})}}return t.default=i,Object.freeze(t)}class j{elements=[];addElement(t){t&&this.elements.push(t)}addElements(t){for(let e of t)this.elements.push(e)}getElements(){return this.elements}importElements(t){const e=t.getElements();for(const n of e)this.addElement(n)}removeAllElements(){this.elements=[]}removeTheseElements(t){t.length>0&&(this.elements=this.elements.filter(e=>!t.includes(e)))}}const I=Symbol("symStateId"),$=Symbol("symArrayAccess"),x=Symbol("symObjectAccess");let m={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null};function F(i,t,e,n,s){m.element=i,m.propertyName=t,m.subPropertyName=e,m.bindFunction=n,m.statementRepaintFunction=s}function D(){m={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null}}class ht{#t=new Map;#n={};subscribe(t,e,n,s,r,l,o){(s==="-s-if"||s==="-s-forEach")&&(e=s),this.#t.has(e)||this.#t.set(e,[]);const a=this.#t.get(e)??[];for(const c of a)if(c.element===n&&c.propertyName===s&&c.subPropertyName===r&&c.bindFunction===l&&c.statementRepaintFunction===o)return;a.push({element:n,propertyName:s,subPropertyName:r,bindFunction:l,statementRepaintFunction:o}),Object.assign(n,{"--subscribed":!0})}unsubscribe(t){this.#t.forEach((e,n)=>{this.#t.set(n,e.filter(s=>s.element!==t))})}createProxy(t,e=""){const n=this.#o(),s=new Proxy(t,n);for(const r in s){if(!(s[r]instanceof Object))continue;const l=e===""?r:`${e}.${r}`;s[r]=this.createProxy(s[r],l)}return this.#n=s,s}#s(t){const e=this.#t.get("-s-forEach");e&&e.forEach(n=>{const{statementRepaintFunction:s}=n;s instanceof Function&&s(t)})}#c(t,e){const n=this.#t.get("-s-forEach");n&&n.forEach(s=>{const{statementRepaintFunction:r}=s;r instanceof Function&&r(t)})}#e(t,e){this.#c(t,e)}#a(t,e){this.#t.has(e)&&(this.#t.get(e)??[]).forEach(s=>{const{element:r,propertyName:l,subPropertyName:o,bindFunction:a,statementRepaintFunction:c}=s;if(Object.hasOwn(r,"--deleted")){this.unsubscribe(r);return}let h=a.call(r,r);l==="style"&&o?r.style[o]=Q(o,h):l==="--if"||l==="--for"?c instanceof Function&&c(h):(h instanceof Function&&(h=h()),_(r,l,h))})}#l(t,e){this.#c(t,e)}#o(){const t={};return t.get=(e,n,s)=>{if(Object.hasOwn(e,n)||n===x||n===$)m.element&&m.bindFunction&&this.subscribe(e,n,m.element,m.propertyName,m.subPropertyName,m.bindFunction,m.statementRepaintFunction);else if((e instanceof Map||e instanceof Set)&&e[n]instanceof Function){const r=e[n];return(...o)=>{const a=r.apply(e,o);return e instanceof Set?n==="add"?this.#e(s,n):n==="delete"&&this.#l(s,n):e instanceof Map&&(n==="set"?this.#e(s,n):n==="delete"&&this.#l(s,n)),a}}return e[n]},t.set=(e,n,s,r)=>(typeof n=="symbol"&&(n===$||n===x||n===I)?e[n]=s:e instanceof Array&&n==="length"?(e[n]=s,this.#s(r)):Object.hasOwn(e,n)?(e[n]=s,this.#a(r,n)):(e[n]=s,this.#e(r,n)),!0),t.deleteProperty=(e,n)=>(delete e[n],this.#l(e,n),!0),t}}let q=0;const K=function(t){if(!(t instanceof Object))throw new Error("createState() only accepts Object, Array, Set or Map as input value.");const n=new ht().createProxy(t);return q+=1,n[I]=q,n},Y=function(i){return i instanceof Object&&I in i};function ft(){return typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global||this}function W(i,...t){const e=/(%?)(%([ojdsif]))/g;if(t.length>0){const n=(s,r,l,o)=>{let a=t.shift(),c="";switch(o){case"o":Array.isArray(a)&&(c=JSON.stringify(a));break;case"s":c=""+a;break;case"d":c=""+Number(a);break;case"j":c=JSON.stringify(a);break;case"i":c=""+parseInt(""+a,10);break;case"f":c=""+parseFloat(""+a);break}return r?(t.unshift(c),s):c};i=i.replace(e,n)}return t.length>0&&(i+=" "+t.join(" ")),i=i.replace(/%{2,2}/g,"%"),""+i}function b(){if(b.isIt===void 0){const i=new Function("try {return this===window;}catch(e){ return false;}");b.isIt=i()}return b.isIt??!1}b.isIt=void 0;function S(i,t){return t.push(i),t}function ut(i,t){for(const e of i)t.push(e);return t}function X(i){return i.toLowerCase().indexOf("on")===0}function g(i){return i===" "||i==="	"||i==="\r"||i===`
`}function mt(i){return/^[a-z][a-z0-9-]+$/.test(i)&&i.includes("-")}function dt(i){if(i==="true")return!0;if(i==="false")return!1;const t=parseInt(i);return isNaN(t)?!!i:!!t}function Et(i,t,e){if(!(i instanceof window.Node)||typeof t!="string"||typeof e!="function"||X(t)===!1)return!1;const n=t.toLowerCase().substring(2);return i.addEventListener(n,e),!0}function pt(i,t){if(t.length===1)i.appendChild(t[0]);else if(t.length>1){const e=new DocumentFragment;for(const n of t)n&&e.append(n);i.appendChild(e)}}function gt(i,t){for(const e of t)e&&i.appendChild(e)}function P(i,t){i&&(b()&&i instanceof window.Node?pt(i,t):gt(i,t))}function J(i,t,e,n,s,r){if(!(t instanceof Object)&&!(t instanceof Array)&&!(t instanceof Map)&&!(t instanceof Set))throw new TypeError('"data" argument should be an Object or an Array');if(!(e instanceof Function))throw new TypeError('"handler" argument should be a Function');const l=i===2&&Y(t);if(t instanceof Map||t instanceof Set){l&&t[x];for(const[o,a]of t.entries()){if(s!==void 0&&s!==o)continue;let c=l?()=>a:a;n&&(c=n?.(c));const h=e(c,o);if(r?.(o),h===!1)break}}else if(t instanceof Array){l&&t[$];for(let o=0;o<t.length;o++){if(s!==void 0&&s!==o)continue;let a=l?()=>t[o]:t[o];n&&(a=n?.(a));const c=e(a,o);if(r?.(o),c===!1)break}}else if(t instanceof Object){l&&t[x];for(const o in t){if(s!==void 0&&s!==o)continue;let a=l?()=>t[o]:t[o];n&&(a=n?.(a));const c=e(a,o);if(r?.(o),c===!1)break}}return!0}function bt(i,t,e){if(typeof i!="number"||typeof t!="number")return new Error('"start" and "end" arguments should be numbers');if(!(e instanceof Function))return new Error('"handler" argument should be a Function');if(t>=i)for(let n=i;n<=t&&e(n)!==!1;n++);else for(let n=i;n>=t&&e(n)!==!1;n--);return!0}function yt(i,t){return i.filter(function(e,n){return n!==t})}function Nt(i,t){if(!t)return;const{nextSibling:e,parentNode:n}=t;n&&n.insertBefore(i,e)}function Tt(i,t){if(t instanceof Object)for(const e in t){const n=t[e].toString();i.setAttribute(`data-${e}`,n)}}function _(i,t,e){t in i?e instanceof Array?i[t]=W.apply(null,e):i[t]=e:"setAttribute"in i&&i.setAttribute(t,e)}function Q(i,t){let e=t;return(i==="visibility"||i==="backfaceVisibility")&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"visible":"hidden"),i==="display"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"":"none"),i==="flex"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?1:0),e}function wt(i,t){return i instanceof Map||i instanceof Set?i.has(t):t in i}const Ot=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];class H{tagName="-";parent=this;children=[];attributes={};newChild(t,e){const n=new H;return n.parent=t,n.attributes=e,this.children.push(n),n}}const R=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]);class Ct{#t="";#n="";#s="";#c={};#e;#a;#l=[];#o=this.#N;#u="";#f="";#g={};#h="";#m="";#E="";#d=new H;#r=this.#d;constructor(t,e){this.#l=this.#w(t,e),this.#C()}generate(t){if(this.#h||this.#m)throw new Error("Some HTML tag is not closed");return this.#p(t,this.#d)}#T(t,e){return typeof t=="function"?typeof e=="function"?e:t:typeof t=="string"&&(typeof e=="string"||typeof e=="number"||typeof e=="boolean")?t+e.toString():e}#p(t,e){const n=[];for(const s of e.children){let r=null;s.tagName==="if"?r=t.if(dt(s.attributes?.condition??""),()=>this.#p(t,s)):s.tagName==="for"?"iterations"in s.attributes?r=t.for(0,parseInt(s.attributes?.iterations??0)-1,(l,o)=>{this.#p(t,s)}):("from"in s.attributes||"to"in s.attributes)&&(r=t.for(parseInt(s.attributes?.from??0),parseInt(s.attributes?.to??0),(l,o)=>{this.#p(t,s)})):s.tagName==="forEach"?"object"in s.attributes&&(r=t.forEach(s.attributes?.object??{},(l,o)=>{this.#p(t,s)})):(r=t.createElement(s.tagName,s.attributes,this.#p(t,s)),n.push(r))}return n}#b(){const t=this.#r,e=this.#c;Object.keys(this.#g).length>0&&(e.style=this.#g);const n=this.#r.newChild(t,e);n.tagName=this.#h,this.#r=n}#w(t,e=[]){const n=[];for(let s=0;s<t.length;s++)t[s]&&n.push(t[s]),e[s]!==void 0&&n.push(e[s]);return n}#C(){for(let t=0;t<this.#l.length;t++)if(typeof this.#l[t]=="string")for(let e=0;e<this.#l[t].length;e++)this.#e=this.#l[t][e],this.#a=this.#l[t][e-1],this.#o();else this.#e=this.#l[t],this.#a=void 0,this.#o()}#S(t,e){t&&(this.#c[t]=typeof e=="string"?e.trim():e)}#i(t){t===this.#y&&(this.#t="",this.#s="",this.#n=""),this.#o=t}#O(t,e){t&&(this.#g[t]=typeof e=="string"?e.trim():e)}#y(){g(this.#e)||(this.#e==="/"?(R.includes(this.#h)&&this.#b(),this.#i(this.#M)):this.#e===">"?(this.#b(),this.#i(this.#N)):this.#e==="="?this.#i(this.#D):this.#t+=this.#e)}#D(){g(this.#e)||(this.#e==="'"||this.#e==='"'?(this.#n=this.#e,this.#i(this.#t==="style"?this.#x:this.#A)):(this.#n=" ",this.#s=this.#T(this.#s,this.#e),this.#i(this.#A)))}#A(){this.#e===">"&&this.#a!=="/"?(this.#n&&this.#t&&this.#s&&this.#S(this.#t,this.#s),this.#t="",this.#s="",this.#n="",this.#i(this.#N),this.#b()):this.#e===this.#n||this.#n===" "&&g(this.#e)?(this.#S(this.#t,this.#s),this.#i(this.#y)):this.#s+=this.#e}#N(){g(this.#e)||(this.#e==="<"?(this.#h="",this.#c={},this.#i(this.#F)):(this.#a===" "?this.#E=this.#a+this.#e:this.#E=this.#e,this.#h="",this.#c={},this.#b(),this.#i(this.#L)))}#x(){g(this.#e)||(this.#e===">"?this.#i(this.#N):this.#e===this.#n||this.#n===" "&&g(this.#e)?this.#i(this.#y):this.#e===":"?this.#i(this.#_):this.#u+=this.#e)}#_(){this.#e===">"?this.#i(this.#N):this.#e===";"?(this.#O(this.#u,this.#f),this.#u="",this.#f="",this.#i(this.#x)):this.#e===this.#n?(this.#O(this.#u,this.#f),this.#u="",this.#f="",this.#i(this.#y)):this.#f=this.#T(this.#f,this.#e)}#F(){if(g(this.#e))this.#h!==""&&this.#i(this.#y);else if(this.#e==="/"&&R.includes(this.#h))this.#r.tagName||(this.#r=this.#r.parent),this.#b(),this.#i(this.#M);else if(this.#e===">"){if(!this.#h)throw new Error("Expected tag name, found >");this.#r.tagName||(this.#r=this.#r.parent),this.#b(),this.#i(this.#N)}else this.#a==="<"&&this.#e==="/"?(this.#h,this.#m="",this.#i(this.#M)):this.#h+=this.#e}#M(){if(!g(this.#e))if(this.#e===">"){if(this.#r.tagName&&this.#r.tagName!=="-"&&!R.includes(this.#r.tagName)&&this.#r.tagName!==this.#m)throw new Error(`Expected ${this.#r.tagName} tag to be closed, but ${this.#m} found`);this.#h="",this.#m="",this.#r.tagName?this.#r=this.#r.parent:this.#r=this.#r.parent.parent,this.#i(this.#N)}else this.#m+=this.#e}#L(){this.#e==="<"?(this.#c={},this.#r.attributes.textContent=this.#E,this.#i(this.#F)):(this.#E=this.#T(this.#E,this.#e),this.#r.tagName||(this.#r.attributes.textContent=this.#E))}}class L{finalElements=[];#t=[new j];#n;#s;#c;#e=!0;#a=[];#l=[];#o;constructor(t,e,n,s=[]){this.#o=t,this.#s=t.document,this.#e=this.#s.baseURI==="",this.#n=e,this.#a=n,this.#l=s,this.#c=this.#s.createElement("template");for(const r of this.#a){const l=r(this);if(l&&typeof l=="string")this.html(l);else if(l instanceof y){const o=this.#e?l.getElementsSr():l.getElements();for(const a of o)this.#t[0].addElements(a)}else if(l instanceof Function)l(this);else if(l instanceof Array){let o=!0,a=!0;for(const c of l){if(!(c instanceof y)){o=!1;break}if(!(c instanceof Function)){a=!1;break}}if(o)for(const c of l){if(!(c instanceof y))break;const h=this.#e?c.getElementsSr():c.getElements();for(const f of h)this.#t[0].addElements(f)}else if(a)for(const c of l){if(!(c instanceof Function))break;c(this)}}}}createElement(t,...e){const n=t?this.#s.createElement(t):this.#s.createTextNode("");let s=[],r=0;for(const o of e)if(r+=1,typeof o=="string"){const a=this.#s.createTextNode(this.#i(o));s=S(a,s)}else if(typeof o=="number"){const a=this.#s.createTextNode(o.toString());s=S(a,s)}else if(o instanceof this.#o.Node)s=S(o,s);else if(o instanceof Array){if(o.length===0)continue;let a=!1;for(const c of o)if(c instanceof this.#o.Node){a=!0;break}if(a)s=ut(o,s);else{const c=this.#s.createTextNode(this.#g(o));s=S(c,s)}}else if(o instanceof Error)n.textContent=this.#i(o.message);else if(o instanceof y){const a=this.#e?o.getElementsSr():o.getElements();for(const c of a)for(const h of c)s.push(h)}else if(o instanceof Function)if(this.#e)n.innerHTML=`(${o.toString()})()`;else if(n instanceof HTMLScriptElement){const a=this.#s.createTextNode(`(${o.toString()})()`);n.appendChild(a)}else if("value"in n&&!(n instanceof HTMLLIElement))this.#p(n,{value:o});else{const a=this.#s.createTextNode("");this.#p(a,{textContent:o}),s=S(a,s)}else o instanceof Object&&!(o instanceof Function)&&r===1&&this.#p(n,o);P(n,s);const l=this.#t.length-1;return this.#t[l].removeTheseElements(s),this.#t[l].addElement(n),n}finalPaint(t){let e="";const n=this.getCreatedElements(),s=this.#n;if(s&&P(s,n),this.finalElements=n,this.#e){const r=s;r&&(e=r.paintChildren(t))}return e}for(t,e,n){const s=()=>{const r=bt(t,e,n);r instanceof Error&&console.error(r)};return this.#w("for",null,s)}forEach(t,e){return this.#m(1,t,e)}forState(t,e){return this.#m(2,t,e)}getCreatedElements(){const t=this.#t[0].getElements();return this.#t=[new j],t}html(t,...e){const n=e.length===0&&this.#l.length===0?this.#E(t instanceof Array?t[0]:t):this.#d(t instanceof Array?t:[t],...e);for(const s of n)s.tagName===""&&(s.textContent=this.#i(s.textContent));return n}if(t,e,n){const s=r=>{r?typeof e=="function"&&e():typeof n=="function"&&n()};return t instanceof Function?this.#C("if",t,s):this.#w("if",t,s)}#u({thisLevel:t,upperLevel:e}){const n=this.#t[t].getElements();return this.#t[e].importElements(this.#t[t]),this.#t[t].removeAllElements(),delete this.#t[t],this.#t.pop(),n}#f(t){return!!this.#l?t.map(n=>this.#i(n)):t}#g(t){return this.#i(W.apply(null,this.#f(t)))}#h(){const t=this.#t.length,e=t-1;return this.#t.push(new j),{thisLevel:t,upperLevel:e}}#m(t,e,n){const s=l=>this.#i(l);if(Y(e)){const l=(o,a,c)=>{const h=[];let f=a.getElements().length;return J(t,o,n,s,c,T=>{const M=a.getElements(),d=M.slice(f);h.push({key:T,elements:d}),f=M.length}),h};return this.#S("forEach",e,l)}const r=l=>{J(t,l,n,s)};return e instanceof Function?this.#C("forEach",e,r):this.#w("forEach",e,r)}#E(t){let e=[];if(this.#e){const s=this.#s.createElement("");s.innerHTML=t??"",e=[s]}else{const s=this.#c;s.innerHTML=t.trim()??"",e=Array.from(s.content.childNodes),s.innerHTML=""}const n=this.#t.length-1;return this.#t[n].addElements(e),e}#d(t,...e){return new Ct(t,e).generate(this)}#r(t,e){if(!this.#n?.contains(t))return!1;let n=t;for(const s of e)Nt(s,n),n=s;return!0}#T(t){if(t.nodeType!==8)return-1;const n=t.textContent;let s="";if(n)s=n.slice(0,-6)+"-end";else return-1;let r=t.nextSibling,l=0,o=0;for(;r!==null;){if(r.nodeType===8){const c=r.textContent;if(c===n)l+=1;else if(c===s&&(l-=1,l<0))break}const{nextSibling:a}=r;this.#y(r),r.remove(),o+=1,r=a}return o}#p(t,e){for(const n in e){let s=e[n];if(this.#e){if(X(n)&&s instanceof Function){_(t,n,s);continue}}else if(s instanceof Function&&Et(t,n,s))continue;if(s instanceof Function){const r=s;F(t,n,"",r,null);let l=r(t);l instanceof Function&&(l=l()),D(),l instanceof Array?l=this.#g(l):typeof l=="string"&&(l=this.#i(l)),_(t,n,l)}else t instanceof this.#o.HTMLElement&&n==="style"&&s instanceof Object?this.#b(t,s):t instanceof this.#o.HTMLElement&&n==="data"?s instanceof Object&&Tt(t,s):n==="textContent"?s instanceof Array?t[n]=this.#g(s):t[n]=this.#i(s):((n==="innerText"||n==="value"&&t.tagName==="INPUT"&&(t.getAttribute("type")??"").toLowerCase()==="button")&&(s=this.#i(s)),_(t,n,s))}}#b(t,e){for(const n in e){const s=e[n];let r="";if(s instanceof Function){const l="style",o=s;F(t,l,n,o,null),r=o(t),D()}else r=s;typeof n=="string"&&(t.style[n]=Q(n,r))}}#w(t,e,n){const{thisLevel:s,upperLevel:r}=this.#h();return n(e),this.#u({thisLevel:s,upperLevel:r})}#C(t,e,n){const{thisLevel:s,upperLevel:r}=this.#h();if(e instanceof Function){const o=this.#s.createComment(`${t}-begin`),a=this.#s.createComment(`${t}-end`);this.#t[s].addElement(o);const c=T=>{this.#t[0].removeAllElements(),this.#T(o),n(T),this.#r(o,this.#t[0].getElements())||console.error("Element ",o," does not exist anymore")},h=o,f=`--${t}`;F(h,f,"",e,c);const N=e();D(),n(N),this.#t[s].addElement(a)}else n(e);return this.#u({thisLevel:s,upperLevel:r})}#S(t,e,n){const{thisLevel:s,upperLevel:r}=this.#h(),l=this.#s.createComment(`${t}-begin`),o=this.#s.createComment(`${t}-end`);this.#t[s].addElement(l);const a=f=>{if(!(f instanceof Object))return;for(let d=o.renderedElementsMap.length-1;d>=0;d--){const A=o.renderedElementsMap[d];wt(f,A.key)||(A.elements.forEach(w=>{w.remove()}),o.renderedElementsMap=yt(o.renderedElementsMap,d))}let N=l;const T=[],M=f instanceof Map||f instanceof Set||f instanceof Array?f.keys():Object.keys(f);for(let d of M){if(!(d in f))continue;let A=!1;for(const w of o.renderedElementsMap)if(w.key===d){const{elements:C}=w;N=C.length>0?C[C.length-1]:N,T.push(w),A=!0;break}if(!A){const w=n(f,this.#t[0],d);for(const C of w)T.push(C),C.elements.forEach(at=>{N.after(at),N=at})}}o.renderedElementsMap=T},c=`-s-${t}`;return F(o,c,"",()=>e,a),o.renderedElementsMap=n(e,this.#t[s]),D(),this.#t[s].addElement(o),this.#u({thisLevel:s,upperLevel:r})}#i(t){if(typeof t=="string"){const e=this.#O(t,this.#l);if(typeof e=="string")return e;const n=ft(),s=this.#O(t,n?.paintorTranslations);if(typeof s=="string")return s}return t}#O(t,e){if(e instanceof Array&&e.length>0){for(const n of e)if(t in n)return n[t]}return!1}#y(t){Object.hasOwn(t,"--subscribed")&&Object.assign(t,{"--deleted":!0}),t.childNodes.forEach(e=>this.#y(e))}}function St(...i){const t=this;return function(...n){return t.call(this,...i,...n)}}const{prototype:U}=L;Object.assign(U.createElement,{bindArgs:St}),Ot.forEach(i=>{U[i]=U.createElement.bindArgs(i)});const Mt=Object.freeze(["async","autofocus","autoplay","checked","contenteditable","controls","default","defer","disabled","formNoValidate","frameborder","hidden","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","readonly","required","reversed","scoped","selected","typemustmatch"]),At=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]),u=Object.freeze({ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11});class v extends Error{constructor(t,e){super(t),this.name=e??"DOMException"}}class E{nextSibling=null;previousSibling=null;textContent="";#t=[];#n="";#s=1;#c=null;constructor(t,e){this.#s=t,this.#n=e}get baseURI(){return""}get childNodes(){return this.#t}get firstChild(){return this.#t[0]??null}get nodeName(){return this.#n}get nodeType(){return this.#s}get parentNode(){return this.#c}set parentNode(t){this.#c=t}appendChild(t){if(this.nodeType!==u.DOCUMENT_NODE&&this.nodeType!==u.DOCUMENT_FRAGMENT_NODE&&this.nodeType!==u.ELEMENT_NODE)throw new v("This node type does not support this method.");if(this.nodeType===u.DOCUMENT_NODE)throw new v("Failed to execute 'appendChild' on 'Node': Only one element on document allowed.");if(!(t instanceof E)){const n="Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.";throw new TypeError(n)}if(this.#t.includes(t))return;if(t===this)throw new v("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");this.#t.push(t),t.parentNode=this;const e=this.#t.length-2;e>=0&&(this.#t[e].nextSibling=t,t.previousSibling=this.#t[e]??null)}contains(){return!1}insertBefore(t,e){const n=[];for(const s of this.#t)s===e&&n.push(t),n.push(s);return this.#t=n,t}removeChild(t){if(!t)throw new Error("Failed to execute 'removeChild' on 'HTMLElement': parameter 1 is not of type 'HTMLElement'.");if(!this.#t.includes(t))throw new Error("Failed to execute 'removeChild' on 'HTMLElement': The node to be removed is not a child of this node.");return this.#t=this.#t.filter(e=>e!==t),t}paintChildren({indent:t=""}){let e="",n=0;for(const s of this.childNodes){n+=1;const r=n>1;e+=tt(s,t,"",r)}return e}}class B extends E{constructor(){super(u.COMMENT_NODE,"#comment")}}class G extends E{constructor(){super(u.TEXT_NODE,"#text")}}function Z(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,n=>{let s=n;return n in e&&(s=e[n]),s}),t}function xt(i){let t="";for(const e of i){const{name:n}=e;let{value:s}=e;Mt.includes(n)?s!==!1&&s!==0&&s!==void 0&&s!==null&&(t+=` ${n}`):(s instanceof Array?s=s.join(","):s===!0?s="true":s===!1?s="false":s===void 0?s="undefined":s===null?s="null":s instanceof Function?s=`return(${s.toString()}).call(this,window.event)`:s=s.toString(),s=s.replace(/\"/g,'\\"'),s=Z(s),t+=` ${n}="${s}"`)}return t}function Ft(i){let t="";return t=i.replace(/([A-Z])/g,(e,n)=>`-${n.toLowerCase()}`),t}function Dt(i){let t="";for(const e in i){const n=i[e];t+=`${Ft(e)}:${n};`}return t.trim()}function tt(i,t,e,n=!1){let s="",r="",l="";if(t&&(r=e,l=`
`),i instanceof B)s+=`${l}${r}<!--${i.textContent}-->`;else if(i instanceof G)s+=`${l}${r}${i.textContent}`;else if(i instanceof O){const o=At.includes(i.tagName),a=xt(i.attributes);let c="";Object.keys(i.style).length>0&&(c=` style="${Dt(i.style)}"`),n&&(s+=l),s+=r,i.tagName&&(s+=`<${i.tagName.toLowerCase()}${a}${c}`,s+=o?"":">"),s+=i.textContent;let h="";for(const f of i.childNodes)h+=tt(f,t,e+t,!0);h&&(s+=h+l+r),i.tagName!==""&&(s+=o?"/>":`</${i.tagName.toLowerCase()}>`)}return s}class k extends E{#t=[];#n="";constructor(t,e){super(t,e.toUpperCase()),this.#n=e.toUpperCase()}get attributes(){return this.#t}get children(){return this.childNodes.filter(t=>t instanceof k)}get className(){let t="";for(const e of this.#t)if(e.name==="class"){t=e.value;break}return t}set className(t){this.setAttribute("class",t)}get innerHTML(){return this.textContent}set innerHTML(t){this.textContent=t}get tagName(){return this.#n}append(t){t instanceof E?this.appendChild(t):this.textContent=Z(t.toString())}getAttribute(t){let e="";if(e=t.trim().toLowerCase(),!e)return null;const n=this.#t.findIndex(s=>s.name===e);return n===-1?null:this.#t[n].value}remove(){this.parentNode?.removeChild(this)}setAttribute(t,e){let n="";if(n=t.trim().toLowerCase(),!n)return;const s=e,r=this.#t.findIndex(l=>l.name===n);r===-1?this.#t.push({name:n,value:s}):this.#t[r]={name:n,value:s}}}function _t(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,n=>{let s=n;return n in e&&(s=e[n]),s}),t}function Lt(i){const t=i.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(e=>e[0].toUpperCase()+e.slice(1)).join("")}function vt(i){const t={};return i.split(";").forEach(e=>{const[n,s]=e.split(":");if(!n)return;const r=Lt(n.trim());t[r]=s.trim()}),t}let O=class extends k{#t={};constructor(t){super(u.ELEMENT_NODE,t)}get innerText(){return this.textContent}set innerText(t){this.textContent=_t(t.toString())}get style(){return this.#t}set style(t){if(typeof t=="string"){const e=vt(t);for(const n in e)this.#t[n]=e[n].toString()}}},et=class extends E{constructor(){super(u.DOCUMENT_FRAGMENT_NODE,"#document-fragment")}};class kt extends E{ELEMENT_NODE=u.ELEMENT_NODE;ATTRIBUTE_NODE=u.ATTRIBUTE_NODE;TEXT_NODE=u.TEXT_NODE;CDATA_SECTION_NODE=u.CDATA_SECTION_NODE;PROCESSING_INSTRUCTION_NODE=u.PROCESSING_INSTRUCTION_NODE;COMMENT_NODE=u.COMMENT_NODE;DOCUMENT_NODE=u.DOCUMENT_NODE;DOCUMENT_TYPE_NODE=u.DOCUMENT_TYPE_NODE;DOCUMENT_FRAGMENT_NODE=u.DOCUMENT_FRAGMENT_NODE;#t;#n=[];constructor(){super(9,"#document");const t=new O("html"),e=new O("head"),n=new O("body");t.appendChild(e),t.appendChild(n),this.#n.push(t),this.#t=n}get body(){return this.#t}get children(){return this.#n}get parentElement(){return null}createDocumentFragment(){return new et}createComment(t=""){const e=new B;return e.textContent=t,e}createElement(t){return new O(t)}createTextNode(t){const e=new G;return e.textContent=t,e}}class jt{Comment=B;DocumentFragment=et;Element=k;HTMLElement=O;Node=E;Text=G;DOMException=v;Error=Error;TypeError=TypeError;document;constructor(){this.document=new kt}}const nt=b(),It=new jt;class y{#t="";#n=[];#s=[];#c="";#e=!1;#a=[];#l=new Map;#o=[];appendTo(t){if(!nt)throw new Error("You can only do this in browser environment");this.#d(t,window,!1)}compose(...t){if(t instanceof Array)for(const e of t)e instanceof Array?this.#a=[...this.#a,()=>e]:this.#a.push(e);return this}getElements(){return this.#d(null,window,!0),this.#s}getHtml(t){if(this.#e)return this.getStaticHtml(t);const e=this.#f();return this.#d("",e,!0,t),this.#c}getStaticHtml(t){const e=this.#o[0]??null;if(!this.#l.has(e)){const n=this.#f();this.#d("",n,!0,t),this.#l.set(e,this.#c)}return this.#l.get(e)??""}getElementsSr(){const t=this.#f();return this.#d("",t,!0),this.#s}paint(t){if(!nt)throw new Error("You can only use this function in browser environment");if(!t)throw new Error("No container selected.");if(typeof t!="string"&&!(t instanceof HTMLElement)&&!(t instanceof NodeList)&&!(t instanceof Array)&&!(t instanceof HTMLCollection))throw new Error(`Wrong type for the container element. Expected <string> or <Node>, got <${typeof t}>`);this.#d(t,window,!0)}static(t=!0){return this.#e=t,this}useTranslations(...t){return this.#o=[],t.map(e=>{e instanceof Array?e.forEach(n=>{this.#o.includes(n)||(this.#o=[...this.#o,n])}):e instanceof Object&&(this.#o.includes(e)||(this.#o=[...this.#o,e]))}),this}#u(){if(this.#n&&Symbol.iterator in this.#n)for(const t of this.#n)for(;t?.firstChild;)t.removeChild(t.firstChild)}#f(){return It}#g(t,e,n,s){return this.#h(t,e),this.#E(n),this.#m(s),!0}#h(t,e){const n=e.document.baseURI==="";if(typeof t=="string"){if(mt(t))this.#t=t;else if(this.#n=n?[e.document.createElement("#container")]:e.document.querySelectorAll(t),!this.#n)throw new Error(`Could not find an element by the following query: ${t}`)}else if(t instanceof HTMLElement)this.#n=[t];else if(t instanceof NodeList||t instanceof HTMLCollection)this.#n=t;else if(t instanceof Array){for(const s of t)if(!(s instanceof HTMLElement))throw new Error("All elements in the input array must be DOM elements");this.#n=t}return!0}#m(t){for(let e of t)if(typeof e!="function")throw new Error("The template must be a function");return!0}#E(t){if(!(t instanceof Array))throw new Error("The argument 'translations' must be an Array");return this.#o=t,!0}#d(t,e,n=!0,s={}){this.#g(t,e,this.#o,this.#a),n&&this.#u();const r=this.#a,l=this.#o;if(!e)throw new Error("Missing window element");if(this.#t){const o=()=>class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){if(!this.shadowRoot)throw new Error("Missing shadow root");const c=new L(e,this.shadowRoot,r,l).getCreatedElements();P(this.shadowRoot,c)}};customElements.define(this.#t,o())}else{if(this.#n.length===0){const o=new L(e,null,r,l);this.#c=o.finalPaint(s),this.#s.push(o.finalElements)}if(this.#n&&Symbol.iterator in this.#n)for(const o of this.#n){const a=new L(e,o,r,l);this.#c=a.finalPaint(s),this.#s.push(a.finalElements)}}}}const $t="modulepreload",Pt=function(i){return"/"+i},st={},it=function(t,e,n){return t()},Ht=function(){let i="en";return b()&&(i=document.getElementById("html")?.getAttribute("lang")??i),i},Rt=async function(i,t){if(typeof i!="string")throw new Error("Translation path must be a string");let e=null;const n=i.match(/^(.*?)([^.\/\\]+)(.\w+)$/m);if(n===null)throw new TypeError(`Incorrect path: ${i}`);const s=n[1]+t+n[3];try{e=(await it(()=>new Promise((r,l)=>V([s],o=>r(z(o)),l)),void 0)).default}catch{s!==i&&(e=(await it(()=>new Promise((l,o)=>V([i],a=>l(z(a)),o)),void 0)).default)}if(!(e instanceof Object))throw new TypeError(`Translation at ${s} must export an object`);return e},rt=async function(...i){const t=Ht(),e=[];for(let n of i)e.push(Rt(n,t));return Promise.all(e)};function ot(...i){return new y().compose(...i)}function lt(i){return i}const ct={compose:ot,createState:K,createTemplate:lt,fetchTranslations:rt,Paintor:y};p.Paintor=y,p.compose=ot,p.createState=K,p.createTemplate=lt,p.default=ct,p.fetchTranslations=rt,p.paintor=ct,Object.defineProperties(p,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=paintor.amd.js.map
