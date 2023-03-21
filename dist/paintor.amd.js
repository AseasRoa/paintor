define(["require","exports"],function(B,p){"use strict";function G(i){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(i){for(const e in i)if(e!=="default"){const n=Object.getOwnPropertyDescriptor(i,e);Object.defineProperty(t,e,n.get?n:{enumerable:!0,get:()=>i[e]})}}return t.default=i,Object.freeze(t)}class j{elements=[];addElement(t){t&&this.elements.push(t)}addElements(t){for(let e of t)this.elements.push(e)}getElements(){return this.elements}importElements(t){const e=t.getElements();for(const n of e)this.addElement(n)}removeAllElements(){this.elements=[]}removeTheseElements(t){t.length>0&&(this.elements=this.elements.filter(e=>!t.includes(e)))}}const V=Symbol("symStateId"),z=Symbol("symArrayAccess"),k=Symbol("symObjectAccess");let m={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null};function M(i,t,e,n,s){m.element=i,m.propertyName=t,m.subPropertyName=e,m.bindFunction=n,m.statementRepaintFunction=s}function A(){m={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null}}class at{#e=new Map;#s={};subscribe(t,e,n,s,r,l,o){(s==="-s-if"||s==="-s-forEach")&&(e=s),this.#e.has(e)||this.#e.set(e,[]);const a=this.#e.get(e)??[];for(const c of a)if(c.element===n&&c.propertyName===s&&c.subPropertyName===r&&c.bindFunction===l&&c.statementRepaintFunction===o)return;a.push({element:n,propertyName:s,subPropertyName:r,bindFunction:l,statementRepaintFunction:o}),Object.assign(n,{"--subscribed":!0})}unsubscribe(t){this.#e.forEach((e,n)=>{this.#e.set(n,e.filter(s=>s.element!==t))})}createProxy(t,e=""){const n=this.#l(),s=new Proxy(t,n);for(const r in s){if(!(s[r]instanceof Object))continue;const l=e===""?r:`${e}.${r}`;s[r]=this.createProxy(s[r],l)}return this.#s=s,s}#n(t){const e=this.#e.get("-s-forEach");e&&e.forEach(n=>{const{statementRepaintFunction:s}=n;s instanceof Function&&s(t)})}#c(t,e){const n=this.#e.get("-s-forEach");n&&n.forEach(s=>{const{statementRepaintFunction:r}=s;r instanceof Function&&r(t)})}#t(t,e){this.#c(t,e)}#a(t,e){this.#e.has(e)&&(this.#e.get(e)??[]).forEach(s=>{const{element:r,propertyName:l,subPropertyName:o,bindFunction:a,statementRepaintFunction:c}=s;if(Object.hasOwn(r,"--deleted")){this.unsubscribe(r);return}let h=a.call(r,r);l==="style"&&o?r.style[o]=Q(o,h):l==="--if"||l==="--for"?c instanceof Function&&c(h):(h instanceof Function&&(h=h()),F(r,l,h))})}#i(t,e){this.#c(t,e)}#l(){const t={};return t.get=(e,n,s)=>{if(Object.hasOwn(e,n)||n===k||n===z)m.element&&m.bindFunction&&this.subscribe(e,n,m.element,m.propertyName,m.subPropertyName,m.bindFunction,m.statementRepaintFunction);else if((e instanceof Map||e instanceof Set)&&e[n]instanceof Function){const r=e[n];return(...o)=>{const a=r.apply(e,o);return e instanceof Set?n==="add"?this.#t(e,n):n==="delete"&&this.#i(e,n):e instanceof Map&&(n==="set"?this.#t(e,n):n==="delete"&&this.#i(e,n)),a}}return e[n]},t.set=(e,n,s)=>(e instanceof Array&&n==="length"?(e[n]=s,this.#n(e)):Object.hasOwn(e,n)?(e[n]=s,this.#a(e,n)):(e[n]=s,this.#t(e,n)),!0),t.deleteProperty=(e,n)=>(delete e[n],this.#i(e,n),!0),t}}let q=0;const K=function(t){if(!(t instanceof Object))throw new Error("createState() only accepts Object, Array, Set or Map as input value.");const n=new at().createProxy(t);return q+=1,n[V]=q,n},Y=function(i){return i instanceof Object&&V in i};function ht(){return typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global||this}function W(i,...t){const e=/(%?)(%([ojdsif]))/g;if(t.length>0){const n=(s,r,l,o)=>{let a=t.shift(),c="";switch(o){case"o":Array.isArray(a)&&(c=JSON.stringify(a));break;case"s":c=""+a;break;case"d":c=""+Number(a);break;case"j":c=JSON.stringify(a);break;case"i":c=""+parseInt(""+a,10);break;case"f":c=""+parseFloat(""+a);break}return r?(t.unshift(c),s):c};i=i.replace(e,n)}return t.length>0&&(i+=" "+t.join(" ")),i=i.replace(/%{2,2}/g,"%"),""+i}function y(){if(y.isIt===void 0){const i=new Function("try {return this===window;}catch(e){ return false;}");y.isIt=i()}return y.isIt??!1}y.isIt=void 0;function x(i,t){return t.push(i),t}function ft(i,t){for(const e of i)t.push(e);return t}function X(i){return i.toLowerCase().indexOf("on")===0}function E(i){return i===" "||i==="	"||i==="\r"||i===`
`}function ut(i){return/^[a-z][a-z0-9-]+$/.test(i)&&i.includes("-")}function mt(i){if(i==="true")return!0;if(i==="false")return!1;const t=parseInt(i);return isNaN(t)?!!i:!!t}function dt(i,t,e){if(!(i instanceof window.Node)||typeof t!="string"||typeof e!="function"||X(t)===!1)return!1;const n=t.toLowerCase().substring(2);return i.addEventListener(n,e),!0}function pt(i,t){if(t.length===1)i.appendChild(t[0]);else if(t.length>1){const e=new DocumentFragment;for(const n of t)n&&e.append(n);i.appendChild(e)}}function Et(i,t){for(const e of t)e&&i.appendChild(e)}function I(i,t){i&&(y()&&i instanceof window.Node?pt(i,t):Et(i,t))}function J(i,t,e,n,s){if(!(i instanceof Object)&&!(i instanceof Array)&&!(i instanceof Map)&&!(i instanceof Set))throw new TypeError('"data" argument should be an Object or an Array');if(!(t instanceof Function))throw new TypeError('"handler" argument should be a Function');const r=Y(i);if(i instanceof Map||i instanceof Set){r&&i[k];for(const[l,o]of i.entries()){if(n!==void 0&&n!==l)continue;let a=r?()=>o:o;e&&(a=e?.(a));const c=t(a,l);if(s?.(l),c===!1)break}}else if(i instanceof Array){r&&i[z];for(let l=0;l<i.length;l++){if(n!==void 0&&n!==l)continue;let o=r?()=>i[l]:i[l];e&&(o=e?.(o));const a=t(o,l);if(s?.(l),a===!1)break}}else if(i instanceof Object){r&&i[k];for(const l in i){if(n!==void 0&&n!==l)continue;let o=r?()=>i[l]:i[l];e&&(o=e?.(o));const a=t(o,l);if(s?.(l),a===!1)break}}return!0}function gt(i,t,e){if(typeof i!="number"||typeof t!="number")return new Error('"start" and "end" arguments should be numbers');if(!(e instanceof Function))return new Error('"handler" argument should be a Function');if(t>=i)for(let n=i;n<=t&&e(n)!==!1;n++);else for(let n=i;n>=t&&e(n)!==!1;n--);return!0}function bt(i,t){return i.filter(function(e,n){return n!==t})}function yt(i,t){if(!t)return;const{nextSibling:e,parentNode:n}=t;n&&n.insertBefore(i,e)}function Nt(i,t){if(t instanceof Object)for(const e in t){const n=t[e].toString();i.setAttribute(`data-${e}`,n)}}function F(i,t,e){t in i?e instanceof Array?i[t]=W.apply(null,e):i[t]=e:i.setAttribute(t,e)}function Q(i,t){let e=t;return(i==="visibility"||i==="backfaceVisibility")&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"visible":"hidden"),i==="display"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"":"none"),i==="flex"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?1:0),e}function Tt(i,t){return i instanceof Map||i instanceof Set?i.has(t):t in i}const wt=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];class ${tagName="-";parent=this;children=[];attributes={};newChild(t,e){const n=new $;return n.parent=t,n.attributes=e,this.children.push(n),n}}const P=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]);class Ot{#e="";#s="";#n="";#c={};#t;#a;#i=[];#l=this.#N;#m="";#f="";#b={};#h="";#p="";#E="";#d=new $;#r=this.#d;constructor(t,e){this.#i=this.#C(t,e),this.#S()}generate(t){if(this.#h||this.#p)throw new Error("Some HTML tag is not closed");return this.#y(t,this.#d)}#T(t,e){return typeof t=="function"?typeof e=="function"?e:t:typeof t=="string"&&(typeof e=="string"||typeof e=="number"||typeof e=="boolean")?t+e.toString():e}#y(t,e){const n=[];for(const s of e.children){let r=null;s.tagName==="if"?r=t.if(mt(s.attributes?.condition??""),()=>this.#y(t,s)):s.tagName==="for"?"iterations"in s.attributes?r=t.for(0,parseInt(s.attributes?.iterations??0)-1,(l,o)=>{this.#y(t,s)}):("from"in s.attributes||"to"in s.attributes)&&(r=t.for(parseInt(s.attributes?.from??0),parseInt(s.attributes?.to??0),(l,o)=>{this.#y(t,s)})):s.tagName==="forEach"?"object"in s.attributes&&(r=t.forEach(s.attributes?.object??{},(l,o)=>{this.#y(t,s)})):(r=t.createElement(s.tagName,s.attributes,this.#y(t,s)),n.push(r))}return n}#g(){const t=this.#r,e=this.#c;Object.keys(this.#b).length>0&&(e.style=this.#b);const n=this.#r.newChild(t,e);n.tagName=this.#h,this.#r=n}#C(t,e=[]){const n=[];for(let s=0;s<t.length;s++)t[s]&&n.push(t[s]),e[s]!==void 0&&n.push(e[s]);return n}#S(){for(let t=0;t<this.#i.length;t++)if(typeof this.#i[t]=="string")for(let e=0;e<this.#i[t].length;e++)this.#t=this.#i[t][e],this.#a=this.#i[t][e-1],this.#l();else this.#t=this.#i[t],this.#a=void 0,this.#l()}#u(t,e){t&&(this.#c[t]=typeof e=="string"?e.trim():e)}#o(t){t===this.#O&&(this.#e="",this.#n="",this.#s=""),this.#l=t}#w(t,e){t&&(this.#b[t]=typeof e=="string"?e.trim():e)}#O(){E(this.#t)||(this.#t==="/"?(P.includes(this.#h)&&this.#g(),this.#o(this.#M)):this.#t===">"?(this.#g(),this.#o(this.#N)):this.#t==="="?this.#o(this.#D):this.#e+=this.#t)}#D(){E(this.#t)||(this.#t==="'"||this.#t==='"'?(this.#s=this.#t,this.#o(this.#e==="style"?this.#x:this.#A)):(this.#s=" ",this.#n=this.#T(this.#n,this.#t),this.#o(this.#A)))}#A(){this.#t===">"&&this.#a!=="/"?(this.#s&&this.#e&&this.#n&&this.#u(this.#e,this.#n),this.#e="",this.#n="",this.#s="",this.#o(this.#N),this.#g()):this.#t===this.#s||this.#s===" "&&E(this.#t)?(this.#u(this.#e,this.#n),this.#o(this.#O)):this.#n+=this.#t}#N(){E(this.#t)||(this.#t==="<"?(this.#h="",this.#c={},this.#o(this.#F)):(this.#a===" "?this.#E=this.#a+this.#t:this.#E=this.#t,this.#h="",this.#c={},this.#g(),this.#o(this.#v)))}#x(){E(this.#t)||(this.#t===">"?this.#o(this.#N):this.#t===this.#s||this.#s===" "&&E(this.#t)?this.#o(this.#O):this.#t===":"?this.#o(this.#_):this.#m+=this.#t)}#_(){this.#t===">"?this.#o(this.#N):this.#t===";"?(this.#w(this.#m,this.#f),this.#m="",this.#f="",this.#o(this.#x)):this.#t===this.#s?(this.#w(this.#m,this.#f),this.#m="",this.#f="",this.#o(this.#O)):this.#f=this.#T(this.#f,this.#t)}#F(){if(E(this.#t))this.#h!==""&&this.#o(this.#O);else if(this.#t==="/"&&P.includes(this.#h))this.#r.tagName||(this.#r=this.#r.parent),this.#g(),this.#o(this.#M);else if(this.#t===">"){if(!this.#h)throw new Error("Expected tag name, found >");this.#r.tagName||(this.#r=this.#r.parent),this.#g(),this.#o(this.#N)}else this.#a==="<"&&this.#t==="/"?(this.#h,this.#p="",this.#o(this.#M)):this.#h+=this.#t}#M(){if(!E(this.#t))if(this.#t===">"){if(this.#r.tagName&&this.#r.tagName!=="-"&&!P.includes(this.#r.tagName)&&this.#r.tagName!==this.#p)throw new Error(`Expected ${this.#r.tagName} tag to be closed, but ${this.#p} found`);this.#h="",this.#p="",this.#r.tagName?this.#r=this.#r.parent:this.#r=this.#r.parent.parent,this.#o(this.#N)}else this.#p+=this.#t}#v(){this.#t==="<"?(this.#c={},this.#r.attributes.textContent=this.#E,this.#o(this.#F)):(this.#E=this.#T(this.#E,this.#t),this.#r.tagName||(this.#r.attributes.textContent=this.#E))}}class D{finalElements=[];#e;#s=[];#n=[new j];#c;#t;#a;#i=!0;#l=[];constructor(t,e,n,s=[]){this.#a=t,this.#t=t.document,this.#i=this.#t.baseURI==="",this.#e=e,this.#l=n,this.#s=s,this.#c=this.#t.createElement("template");for(const r of this.#l){const l=r(this);if(l&&typeof l=="string")this.html(l);else if(l instanceof O){const o=this.#i?l.getElementsSr():l.getElements();for(const a of o)this.#n[0].addElements(a)}else if(l instanceof Function)l(this);else if(l instanceof Array){let o=!0,a=!0;for(const c of l){if(!(c instanceof O)){o=!1;break}if(!(c instanceof Function)){a=!1;break}}if(o)for(const c of l){if(!(c instanceof O))break;const h=this.#i?c.getElementsSr():c.getElements();for(const f of h)this.#n[0].addElements(f)}else if(a)for(const c of l){if(!(c instanceof Function))break;c(this)}}}}createElement(t,...e){const n=t?this.#t.createElement(t):this.#t.createTextNode("");let s=[],r=0;for(const o of e)if(r+=1,typeof o=="string"){const a=this.#t.createTextNode(this.#u(o));s=x(a,s)}else if(typeof o=="number"){const a=this.#t.createTextNode(o.toString());s=x(a,s)}else if(o instanceof this.#a.Node)s=x(o,s);else if(o instanceof Array){if(o.length===0)continue;let a=!1;for(const c of o)if(c instanceof this.#a.Node){a=!0;break}if(a)s=ft(o,s);else{const c=this.#t.createTextNode(this.#b(o));s=x(c,s)}}else if(o instanceof Error)n.textContent=this.#u(o.message);else if(o instanceof O){const a=this.#i?o.getElementsSr():o.getElements();for(const c of a)for(const h of c)s.push(h)}else if(o instanceof Function){if(this.#i)n.innerHTML=`(${o.toString()})()`;else if(n instanceof HTMLScriptElement){const a=this.#t.createTextNode(`(${o.toString()})()`);n.appendChild(a)}else if(r===1){const a="value"in n?{value:o}:{textContent:o};this.#T(n,a)}}else o instanceof Object&&!(o instanceof Function)&&r===1&&this.#T(n,o);I(n,s);const l=this.#n.length-1;return this.#n[l].removeTheseElements(s),this.#n[l].addElement(n),n}finalPaint(t){let e="";const n=this.getCreatedElements(),s=this.#e;if(s&&I(s,n),this.finalElements=n,this.#i){const r=s;r&&(e=r.paintChildren(t))}return e}for(t,e,n){const s=()=>{const r=gt(t,e,n);r instanceof Error&&console.error(r)};return this.#g("for",null,s)}forEach(t,e){const n=r=>this.#u(r);if(Y(t)){const r=(l,o,a)=>{const c=[];let h=o.getElements().length;return J(l,e,n,a,N=>{const g=o.getElements(),L=g.slice(h);c.push({key:N,elements:L}),h=g.length}),c};return this.#S("forEach",t,r)}const s=r=>{J(r,e,n)};return t instanceof Function?this.#C("forEach",t,s):this.#g("forEach",t,s)}getCreatedElements(){const t=this.#n[0].getElements();return this.#n=[new j],t}html(t,...e){const n=e.length===0&&this.#s.length===0?this.#p(t instanceof Array?t[0]:t):this.#E(t instanceof Array?t:[t],...e);for(const s of n)s.tagName===""&&(s.textContent=this.#u(s.textContent));return n}if(t,e,n){const s=r=>{r?typeof e=="function"&&e():typeof n=="function"&&n()};return t instanceof Function?this.#C("if",t,s):this.#g("if",t,s)}#m({thisLevel:t,upperLevel:e}){const n=this.#n[t].getElements();return this.#n[e].importElements(this.#n[t]),this.#n[t].removeAllElements(),delete this.#n[t],this.#n.pop(),n}#f(t){return!!this.#s?t.map(n=>this.#u(n)):t}#b(t){return this.#u(W.apply(null,this.#f(t)))}#h(){const t=this.#n.length,e=t-1;return this.#n.push(new j),{thisLevel:t,upperLevel:e}}#p(t){let e=[];if(this.#i){const s=this.#t.createElement("");s.innerHTML=t??"",e=[s]}else{const s=this.#c;s.innerHTML=t.trim()??"",e=Array.from(s.content.childNodes),s.innerHTML=""}const n=this.#n.length-1;return this.#n[n].addElements(e),e}#E(t,...e){return new Ot(t,e).generate(this)}#d(t,e){if(!this.#e?.contains(t))return!1;let n=t;for(const s of e)yt(s,n),n=s;return!0}#r(t){if(t.nodeType!==8)return-1;const n=t.textContent;let s="";if(n)s=n.slice(0,-6)+"-end";else return-1;let r=t.nextSibling,l=0,o=0;for(;r!==null;){if(r.nodeType===8){const c=r.textContent;if(c===n)l+=1;else if(c===s&&(l-=1,l<0))break}const{nextSibling:a}=r;this.#w(r),r.remove(),o+=1,r=a}return o}#T(t,e){for(const n in e){let s=e[n];if(this.#i){if(X(n)&&s instanceof Function){F(t,n,s);continue}}else if(s instanceof Function&&dt(t,n,s))continue;if(s instanceof Function){const r=s;M(t,n,"",r,null);let l=r(t);l instanceof Function&&(l=l()),A(),l instanceof Array?l=this.#b(l):typeof l=="string"&&(l=this.#u(l)),F(t,n,l)}else n==="style"&&s instanceof Object?this.#y(t,s):n==="data"?s instanceof Object&&Nt(t,s):n==="textContent"?s instanceof Array?t[n]=this.#b(s):t[n]=this.#u(s):F(t,n,this.#u(s))}}#y(t,e){for(const n in e){const s=e[n];let r="";if(s instanceof Function){const l="style",o=s;M(t,l,n,o,null),r=o(t),A()}else r=s;typeof n=="string"&&(t.style[n]=Q(n,r))}}#g(t,e,n){const{thisLevel:s,upperLevel:r}=this.#h();return n(e),this.#m({thisLevel:s,upperLevel:r})}#C(t,e,n){const{thisLevel:s,upperLevel:r}=this.#h();if(e instanceof Function){const o=this.#t.createComment(`${t}-begin`),a=this.#t.createComment(`${t}-end`);this.#n[s].addElement(o);const c=g=>{this.#n[0].removeAllElements(),this.#r(o),n(g),this.#d(o,this.#n[0].getElements())||console.error("Element ",o," does not exist anymore")},h=o,f=`--${t}`;M(h,f,"",e,c);const N=e();A(),n(N),this.#n[s].addElement(a)}else n(e);return this.#m({thisLevel:s,upperLevel:r})}#S(t,e,n){const{thisLevel:s,upperLevel:r}=this.#h(),l=this.#t.createComment(`${t}-begin`),o=this.#t.createComment(`${t}-end`);this.#n[s].addElement(l);const a=f=>{if(!(f instanceof Object))return;for(let b=o.renderedElementsMap.length-1;b>=0;b--){const S=o.renderedElementsMap[b];Tt(f,S.key)||(S.elements.forEach(T=>{T.remove()}),o.renderedElementsMap=bt(o.renderedElementsMap,b))}let N=l;const g=[],L=f instanceof Map||f instanceof Set||f instanceof Array?f.keys():Object.keys(f);for(let b of L){if(!(b in f))continue;let S=!1;for(const T of o.renderedElementsMap)if(T.key===b){const C=T.elements;N=C.length>0?C[C.length-1]:N,g.push(T),S=!0;break}if(!S){const T=n(f,this.#n[0],b);for(const C of T)g.push(C),C.elements.forEach(Ht=>{N.after(Ht)})}}o.renderedElementsMap=g},c=`-s-${t}`;return M(o,c,"",()=>e,a),o.renderedElementsMap=n(e,this.#n[s]),A(),this.#n[s].addElement(o),this.#m({thisLevel:s,upperLevel:r})}#u(t){if(typeof t=="string"){const e=this.#o(t,this.#s);if(typeof e=="string")return e;const n=ht(),s=this.#o(t,n?.paintorTranslations);if(typeof s=="string")return s}return t}#o(t,e){if(e instanceof Array&&e.length>0){for(const n of e)if(t in n)return n[t]}return!1}#w(t){Object.hasOwn(t,"--subscribed")&&Object.assign(t,{"--deleted":!0}),t.childNodes.forEach(e=>this.#w(e))}}function Ct(...i){const t=this;return function(...n){return t.call(this,...i,...n)}}const{prototype:R}=D;Object.assign(R.createElement,{bindArgs:Ct}),wt.forEach(i=>{R[i]=R.createElement.bindArgs(i)});const St=Object.freeze(["async","autofocus","autoplay","checked","contenteditable","controls","default","defer","disabled","formNoValidate","frameborder","hidden","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","readonly","required","reversed","scoped","selected","typemustmatch"]),Mt=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]),u=Object.freeze({ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11});class _ extends Error{constructor(t,e){super(t),this.name=e??"DOMException"}}class d{nextSibling=null;previousSibling=null;textContent="";#e=[];#s="";#n=1;#c=null;constructor(t,e){this.#n=t,this.#s=e}get baseURI(){return""}get childNodes(){return this.#e}get firstChild(){return this.#e[0]??null}get nodeName(){return this.#s}get nodeType(){return this.#n}get parentNode(){return this.#c}set parentNode(t){this.#c=t}appendChild(t){if(this.nodeType!==u.DOCUMENT_NODE&&this.nodeType!==u.DOCUMENT_FRAGMENT_NODE&&this.nodeType!==u.ELEMENT_NODE)throw new _("This node type does not support this method.");if(this.nodeType===u.DOCUMENT_NODE)throw new _("Failed to execute 'appendChild' on 'Node': Only one element on document allowed.");if(!(t instanceof d)){const n="Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.";throw new TypeError(n)}if(this.#e.includes(t))return;if(t===this)throw new _("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");this.#e.push(t),t.parentNode=this;const e=this.#e.length-2;e>=0&&(this.#e[e].nextSibling=t,t.previousSibling=this.#e[e]??null)}contains(){return!1}insertBefore(t,e){const n=[];for(const s of this.#e)s===e&&n.push(t),n.push(s);return this.#e=n,t}removeChild(t){if(!t)throw new Error("Failed to execute 'removeChild' on 'HTMLElement': parameter 1 is not of type 'HTMLElement'.");if(!this.#e.includes(t))throw new Error("Failed to execute 'removeChild' on 'HTMLElement': The node to be removed is not a child of this node.");return this.#e=this.#e.filter(e=>e!==t),t}paintChildren({indent:t=""}){let e="",n=0;for(const s of this.childNodes){n+=1;const r=n>1;e+=tt(s,t,"",r)}return e}}class H extends d{constructor(){super(u.COMMENT_NODE,"#comment")}}class U extends d{constructor(){super(u.TEXT_NODE,"#text")}}function Z(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,n=>{let s=n;return n in e&&(s=e[n]),s}),t}function At(i){let t="";for(const e of i){const{name:n}=e;let{value:s}=e;St.includes(n)?s!==!1&&s!==0&&s!==void 0&&s!==null&&(t+=` ${n}`):(s instanceof Array?s=s.join(","):s===!0?s="true":s===!1?s="false":s===void 0?s="undefined":s===null?s="null":s instanceof Function?s=`return(${s.toString()}).call(this,window.event)`:s=s.toString(),s=s.replace(/\"/g,'\\"'),s=Z(s),t+=` ${n}="${s}"`)}return t}function xt(i){let t="";return t=i.replace(/([A-Z])/g,(e,n)=>`-${n.toLowerCase()}`),t}function Ft(i){let t="";for(const e in i){const n=i[e];t+=`${xt(e)}:${n};`}return t.trim()}function tt(i,t,e,n=!1){let s="",r="",l="";if(t&&(r=e,l=`
`),i instanceof H)s+=`${l}${r}<!--${i.textContent}-->`;else if(i instanceof U)s+=`${l}${r}${i.textContent}`;else if(i instanceof w){const o=Mt.includes(i.tagName),a=At(i.attributes);let c="";Object.keys(i.style).length>0&&(c=` style="${Ft(i.style)}"`),n&&(s+=l),s+=r,i.tagName&&(s+=`<${i.tagName.toLowerCase()}${a}${c}`,s+=o?"":">"),s+=i.textContent;let h="";for(const f of i.childNodes)h+=tt(f,t,e+t,!0);h&&(s+=h+l+r),i.tagName!==""&&(s+=o?"/>":`</${i.tagName.toLowerCase()}>`)}return s}class v extends d{#e=[];#s="";constructor(t,e){super(t,e.toUpperCase()),this.#s=e.toUpperCase()}get attributes(){return this.#e}get children(){return this.childNodes.filter(t=>t instanceof v)}get className(){let t="";for(const e of this.#e)if(e.name==="class"){t=e.value;break}return t}set className(t){this.setAttribute("class",t)}get innerHTML(){return this.textContent}set innerHTML(t){this.textContent=t}get tagName(){return this.#s}append(t){t instanceof d?this.appendChild(t):this.textContent=Z(t.toString())}remove(){this.parentNode?.removeChild(this)}setAttribute(t,e){let n="";if(n=t.trim().toLowerCase(),!n)return;const s=e,r=this.#e.findIndex(l=>l.name===n);r===-1?this.#e.push({name:n,value:s}):this.#e[r]={name:n,value:s}}}function Dt(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,n=>{let s=n;return n in e&&(s=e[n]),s}),t}function _t(i){const t=i.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(e=>e[0].toUpperCase()+e.slice(1)).join("")}function vt(i){const t={};return i.split(";").forEach(e=>{const[n,s]=e.split(":");if(!n)return;const r=_t(n.trim());t[r]=s.trim()}),t}let w=class extends v{#e={};constructor(t){super(u.ELEMENT_NODE,t)}get innerText(){return this.textContent}set innerText(t){this.textContent=Dt(t.toString())}get style(){return this.#e}set style(t){if(typeof t=="string"){const e=vt(t);for(const n in e)this.#e[n]=e[n].toString()}}},et=class extends d{constructor(){super(u.DOCUMENT_FRAGMENT_NODE,"#document-fragment")}};class Lt extends d{ELEMENT_NODE=u.ELEMENT_NODE;ATTRIBUTE_NODE=u.ATTRIBUTE_NODE;TEXT_NODE=u.TEXT_NODE;CDATA_SECTION_NODE=u.CDATA_SECTION_NODE;PROCESSING_INSTRUCTION_NODE=u.PROCESSING_INSTRUCTION_NODE;COMMENT_NODE=u.COMMENT_NODE;DOCUMENT_NODE=u.DOCUMENT_NODE;DOCUMENT_TYPE_NODE=u.DOCUMENT_TYPE_NODE;DOCUMENT_FRAGMENT_NODE=u.DOCUMENT_FRAGMENT_NODE;#e;#s=[];constructor(){super(9,"#document");const t=new w("html"),e=new w("head"),n=new w("body");t.appendChild(e),t.appendChild(n),this.#s.push(t),this.#e=n}get body(){return this.#e}get children(){return this.#s}get parentElement(){return null}createDocumentFragment(){return new et}createComment(t=""){const e=new H;return e.textContent=t,e}createElement(t){return new w(t)}createTextNode(t){const e=new U;return e.textContent=t,e}}class jt{Comment=H;DocumentFragment=et;Element=v;HTMLElement=w;Node=d;Text=U;DOMException=_;Error=Error;TypeError=TypeError;document;constructor(){this.document=new Lt}}const nt=y(),kt=new jt;class O{#e="";#s=[];#n=[];#c="";#t=!1;#a=[];#i=new Map;#l=[];appendTo(t){if(!nt)throw new Error("You can only do this in browser environment");this.#d(t,window,!1)}compose(...t){if(t instanceof Array)for(const e of t)e instanceof Array?this.#a=[...this.#a,()=>e]:this.#a.push(e);return this}getElements(){return this.#d(null,window,!0),this.#n}getHtml(t){if(this.#t)return this.getStaticHtml(t);const e=this.#f();return this.#d("",e,!0,t),this.#c}getStaticHtml(t){const e=this.#l[0]??null;if(!this.#i.has(e)){const n=this.#f();this.#d("",n,!0,t),this.#i.set(e,this.#c)}return this.#i.get(e)??""}getElementsSr(){const t=this.#f();return this.#d("",t,!0),this.#n}paint(t){if(!nt)throw new Error("You can only use this function in browser environment");if(typeof t!="string"&&!(t instanceof HTMLElement)&&!(t instanceof NodeList)&&!(t instanceof Array))throw new Error(`Wrong type for the container element. Expected <string> or <Node>, got <${typeof t}>`);this.#d(t,window,!0)}static(t=!0){return this.#t=t,this}useTranslations(...t){return this.#l=[],t.map(e=>{e instanceof Array?e.forEach(n=>{this.#l.includes(n)||(this.#l=[...this.#l,n])}):e instanceof Object&&(this.#l.includes(e)||(this.#l=[...this.#l,e]))}),this}#m(){if(this.#s)for(const t of this.#s)for(;t?.firstChild;)t.removeChild(t.firstChild)}#f(){return kt}#b(t,e,n,s){return this.#h(t,e),this.#E(n),this.#p(s),!0}#h(t,e){const n=e.document.baseURI==="";if(typeof t=="string"){if(ut(t))this.#e=t;else if(this.#s=n?[e.document.createElement("#container")]:e.document.querySelectorAll(t),!this.#s)throw new Error(`Could not find an element by the following query: ${t}`)}else if(t instanceof HTMLElement)this.#s=[t];else if(t instanceof NodeList)this.#s=t;else if(t instanceof Array){for(const s of t)if(!(s instanceof HTMLElement))throw new Error("All elements in the input array must be DOM elements");this.#s=t}return!0}#p(t){for(let e of t)if(typeof e!="function")throw new Error("The template must be a function");return!0}#E(t){if(!(t instanceof Array))throw new Error("The argument 'translations' must be an Array");return this.#l=t,!0}#d(t,e,n=!0,s={}){this.#b(t,e,this.#l,this.#a),n&&this.#m();const r=this.#a,l=this.#l;if(!e)throw new Error("Missing window element");if(this.#e){const o=()=>class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){if(!this.shadowRoot)throw new Error("Missing shadow root");const c=new D(e,this.shadowRoot,r,l).getCreatedElements();I(this.shadowRoot,c)}};customElements.define(this.#e,o())}else{if(this.#s.length===0){const o=new D(e,null,r,l);this.#c=o.finalPaint(s),this.#n.push(o.finalElements)}for(const o of this.#s){const a=new D(e,o,r,l);this.#c=a.finalPaint(s),this.#n.push(a.finalElements)}}}}const It="modulepreload",$t=function(i){return"/"+i},st={},it=function(t,e,n){return t()},Pt=function(){let i="en";return y()&&(i=document.getElementById("html")?.getAttribute("lang")??i),i},Rt=async function(i,t){if(typeof i!="string")throw new Error("Translation path must be a string");let e=null;const n=i.match(/^(.*?)([^.\/\\]+)(.\w+)$/m);if(n===null)throw new TypeError(`Incorrect path: ${i}`);const s=n[1]+t+n[3];try{e=(await it(()=>new Promise((r,l)=>B([s],o=>r(G(o)),l)),void 0)).default}catch{s!==i&&(e=(await it(()=>new Promise((l,o)=>B([i],a=>l(G(a)),o)),void 0)).default)}if(!(e instanceof Object))throw new TypeError(`Translation at ${s} must export an object`);return e},rt=async function(...i){const t=Pt(),e=[];for(let r of i)e.push(Rt(r,t));let n={};return(await Promise.all(e)).forEach(r=>{n={...n,...r}}),n};function ot(...i){return new O().compose(...i)}function lt(i){return i}const ct={compose:ot,createState:K,createTemplate:lt,createTranslation:rt};p.Paintor=O,p.compose=ot,p.createState=K,p.createTemplate=lt,p.createTranslation=rt,p.default=ct,p.paintor=ct,Object.defineProperties(p,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=paintor.amd.js.map
