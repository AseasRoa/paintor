define(["require","exports"],function(z,g){"use strict";function q(i){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(i){for(const e in i)if(e!=="default"){const n=Object.getOwnPropertyDescriptor(i,e);Object.defineProperty(t,e,n.get?n:{enumerable:!0,get:()=>i[e]})}}return t.default=i,Object.freeze(t)}const j=Symbol("symStateId"),$=Symbol("symArrayAccess"),A=Symbol("symObjectAccess");let d={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null};function x(i,t,e,n,s){d.element=i,d.propertyName=t,d.subPropertyName=e,d.bindFunction=n,d.statementRepaintFunction=s}function F(){d={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null}}class ut{#t=new Map;#r={};subscribe(t,e,n,s,r,l,o){(s==="-s-if"||s==="-s-forEach")&&(e=s),this.#t.has(e)||this.#t.set(e,[]);const c=this.#t.get(e)??[];for(const h of c)if(h.element===n&&h.propertyName===s&&h.subPropertyName===r&&h.bindFunction===l&&h.statementRepaintFunction===o)return;c.push({element:n,propertyName:s,subPropertyName:r,bindFunction:l,statementRepaintFunction:o}),Object.assign(n,{"--subscribed":!0})}unsubscribe(t){this.#t.forEach((e,n)=>{this.#t.set(n,e.filter(s=>s.element!==t))})}createProxy(t,e=""){const n=this.#f(),s=new Proxy(t,n);for(const r in s){if(!(s[r]instanceof Object))continue;const l=e===""?r:`${e}.${r}`;s[r]=this.createProxy(s[r],l)}return this.#r=s,s}#s(t){const e=this.#t.get("-s-forEach");e&&e.forEach(n=>{const{statementRepaintFunction:s}=n;s instanceof Function&&s(t)})}#n(t,e){const n=this.#t.get("-s-forEach");n&&n.forEach(s=>{const{statementRepaintFunction:r}=s;r instanceof Function&&r(t)})}#e(t,e){this.#n(t,e)}#a(t,e){this.#t.has(e)&&(this.#t.get(e)??[]).forEach(s=>{const{element:r,propertyName:l,subPropertyName:o,bindFunction:c,statementRepaintFunction:h}=s;if(Object.hasOwn(r,"--deleted")){this.unsubscribe(r);return}let a=c.call(r,r);if(l==="style"&&o)r.style[o]=Z(o,a);else if(l==="--if"||l==="--for")h instanceof Function&&h(a);else{if(a instanceof m){r.innerHTML="";const f=a.getElements();D(r,f[0]);return}else a instanceof Function&&(a=a());L(r,l,a)}})}#l(t,e){this.#n(t,e)}#f(){const t={};return t.get=(e,n,s)=>{if(Object.hasOwn(e,n)||n===A||n===$)d.element&&d.bindFunction&&this.subscribe(e,n,d.element,d.propertyName,d.subPropertyName,d.bindFunction,d.statementRepaintFunction);else if((e instanceof Map||e instanceof Set)&&e[n]instanceof Function){const r=e[n];return(...o)=>{const c=r.apply(e,o);return e instanceof Set?n==="add"?this.#e(s,n):n==="delete"&&this.#l(s,n):e instanceof Map&&(n==="set"?this.#e(s,n):n==="delete"&&this.#l(s,n)),c}}return e[n]},t.set=(e,n,s,r)=>(typeof n=="symbol"&&(n===$||n===A||n===j)||e instanceof Array&&n==="length"?e[n]=s:Object.hasOwn(e,n)?(e[n]=s,this.#a(r,n)):(e[n]=s,this.#e(r,n)),!0),t.deleteProperty=(e,n)=>(delete e[n],this.#l(e,n),!0),t}}let K=0;const W=function(t){if(!(t instanceof Object))throw new Error("createState() only accepts Object, Array, Set or Map as input value.");const n=new ut().createProxy(t);return K+=1,n[j]=K,n},Y=function(i){return i instanceof Object&&j in i};function mt(){return typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global||this}function X(i,...t){const e=/(%?)(%([ojdsif]))/g;if(t.length>0){const n=(s,r,l,o)=>{let c=t.shift(),h="";switch(o){case"o":Array.isArray(c)&&(h=JSON.stringify(c));break;case"s":h=""+c;break;case"d":h=""+Number(c);break;case"j":h=JSON.stringify(c);break;case"i":h=""+parseInt(""+c,10);break;case"f":h=""+parseFloat(""+c);break}return r?(t.unshift(h),s):h};i=i.replace(e,n)}return t.length>0&&(i+=" "+t.join(" ")),i=i.replace(/%{2,2}/g,"%"),""+i}function y(){if(y.isIt===void 0){const i=new Function("try {return this===window;}catch(e){ return false;}");y.isIt=i()}return y.isIt??!1}y.isIt=void 0;function M(i,t){return t.push(i),t}function dt(i,t){for(const e of i)t.push(e);return t}function J(i){return i.toLowerCase().indexOf("on")===0}function b(i){return i===" "||i==="	"||i==="\r"||i===`
`}function Et(i){return/^[a-z][a-z0-9-]+$/.test(i)&&i.includes("-")}function pt(i){return/#[a-z0-9-]+\s*$/.test(i)}function gt(i){if(i==="true")return!0;if(i==="false")return!1;const t=parseInt(i);return isNaN(t)?!!i:!!t}function bt(i,t,e){if(!(i instanceof window.Node)||typeof t!="string"||typeof e!="function"||J(t)===!1)return!1;const n=t.toLowerCase().substring(2);return i.addEventListener(n,e),!0}function yt(i,t){if(t.length===1)i.appendChild(t[0]);else if(t.length>1){const e=new DocumentFragment;for(const n of t)n&&e.append(n);i.appendChild(e)}}function Tt(i,t){for(const e of t)e&&i.appendChild(e)}function D(i,t){i&&(y()&&i instanceof window.Node?yt(i,t):Tt(i,t))}function Q(i,t,e,n,s,r){if(!(t instanceof Object)&&!(t instanceof Array)&&!(t instanceof Map)&&!(t instanceof Set))throw new TypeError('"data" argument should be an Object or an Array');if(!(e instanceof Function))throw new TypeError('"handler" argument should be a Function');const l=i===2&&Y(t);if(t instanceof Map||t instanceof Set){l&&t[A];for(const[o,c]of t.entries()){if(s!==void 0&&s!==o)continue;let h=l?()=>c:c;n&&(h=n?.(h));const a=e(h,o);if(r?.(o),a===!1)break}}else if(t instanceof Array){l&&t[$];for(let o=0;o<t.length;o++){if(s!==void 0&&s!==o)continue;let c=l?()=>t[o]:t[o];n&&(c=n?.(c));const h=e(c,o);if(r?.(o),h===!1)break}}else if(t instanceof Object){l&&t[A];for(const o in t){if(s!==void 0&&s!==o)continue;let c=l?()=>t[o]:t[o];n&&(c=n?.(c));const h=e(c,o);if(r?.(o),h===!1)break}}return!0}function Nt(i,t,e){if(typeof i!="number"||typeof t!="number")return new Error('"start" and "end" arguments should be numbers');if(!(e instanceof Function))return new Error('"handler" argument should be a Function');if(t>=i)for(let n=i;n<=t&&e(n)!==!1;n++);else for(let n=i;n>=t&&e(n)!==!1;n--);return!0}function Ct(i,t){return i.filter(function(e,n){return n!==t})}function wt(i,t){if(!t)return;const{nextSibling:e,parentNode:n}=t;n&&n.insertBefore(i,e)}function Ot(i,t){if(t instanceof Object)for(const e in t){const n=t[e].toString();i.setAttribute(`data-${e}`,n)}}function L(i,t,e){t in i?e instanceof Array?i[t]=X.apply(null,e):i[t]=e:"setAttribute"in i&&i.setAttribute(t,e)}function Z(i,t){let e=t;return(i==="visibility"||i==="backfaceVisibility")&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"visible":"hidden"),i==="display"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"":"none"),i==="flex"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?1:0),e}function St(i,t){return i instanceof Map||i instanceof Set?i.has(t):t in i}function Mt(i,t,e){if(e>=i.length){let n=e-i.length+1;for(;n--;)i.push(void 0)}return i.splice(e,0,i.splice(t,1)[0]),i}class _{elements=[];addElement(t){t&&this.elements.push(t)}addElements(t){for(let e of t)this.elements.push(e)}getElements(){return this.elements}importElements(t){const e=t.getElements();for(const n of e)this.addElement(n)}removeAllElements(){this.elements=[]}removeTheseElements(t){t.length>0&&(this.elements=this.elements.filter(e=>!t.includes(e)))}moveElementAfterAnother(t,e){const n=this.elements.indexOf(t),s=this.elements.indexOf(e);if(n===-1||s===-1)throw new Error("Cannot move one element after another, because one element is missing");s-n!==1&&(this.elements=Mt(this.elements,n,s+1))}}const At=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];class H{tagName="-";parent=this;children=[];attributes={};newChild(t,e){const n=new H;return n.parent=t,n.attributes=e,this.children.push(n),n}}const R=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]);class xt{#t="";#r="";#s="";#n={};#e;#a;#l=[];#f=this.#T;#m="";#c="";#g={};#h="";#E="";#p="";#N=new H;#o=this.#N;constructor(t,e){this.#l=this.#C(t,e),this.#O()}generate(t){if(this.#h||this.#E)throw new Error("Some HTML tag is not closed");return this.#u(t,this.#N)}#d(t,e){return typeof t=="function"?typeof e=="function"?e:t:typeof t=="string"&&(typeof e=="string"||typeof e=="number"||typeof e=="boolean")?t+e.toString():e}#u(t,e){const n=[];for(const s of e.children){let r=null;s.tagName==="if"?r=t.if(gt(s.attributes?.condition??""),()=>this.#u(t,s)):s.tagName==="for"?"iterations"in s.attributes?r=t.for(0,parseInt(s.attributes?.iterations??0)-1,(l,o)=>{this.#u(t,s)}):("from"in s.attributes||"to"in s.attributes)&&(r=t.for(parseInt(s.attributes?.from??0),parseInt(s.attributes?.to??0),(l,o)=>{this.#u(t,s)})):s.tagName==="forEach"?"object"in s.attributes&&(r=t.forEach(s.attributes?.object??{},(l,o)=>{this.#u(t,s)})):(r=t.createElement(s.tagName,s.attributes,this.#u(t,s)),n.push(r))}return n}#b(){const t=this.#o,e=this.#n;Object.keys(this.#g).length>0&&(e.style=this.#g);const n=this.#o.newChild(t,e);n.tagName=this.#h,this.#o=n}#C(t,e=[]){const n=[];for(let s=0;s<t.length;s++)t[s]&&n.push(t[s]),e[s]!==void 0&&n.push(e[s]);return n}#O(){for(let t=0;t<this.#l.length;t++)if(typeof this.#l[t]=="string")for(let e=0;e<this.#l[t].length;e++)this.#e=this.#l[t][e],this.#a=this.#l[t][e-1],this.#f();else this.#e=this.#l[t],this.#a=void 0,this.#f()}#S(t,e){t&&(this.#n[t]=typeof e=="string"?e.trim():e)}#i(t){t===this.#y&&(this.#t="",this.#s="",this.#r=""),this.#f=t}#w(t,e){t&&(this.#g[t]=typeof e=="string"?e.trim():e)}#y(){b(this.#e)||(this.#e==="/"?(R.includes(this.#h)&&this.#b(),this.#i(this.#M)):this.#e===">"?(this.#b(),this.#i(this.#T)):this.#e==="="?this.#i(this.#D):this.#t+=this.#e)}#D(){b(this.#e)||(this.#e==="'"||this.#e==='"'?(this.#r=this.#e,this.#i(this.#t==="style"?this.#x:this.#A)):(this.#r=" ",this.#s=this.#d(this.#s,this.#e),this.#i(this.#A)))}#A(){this.#e===">"&&this.#a!=="/"?(this.#r&&this.#t&&this.#s&&this.#S(this.#t,this.#s),this.#t="",this.#s="",this.#r="",this.#i(this.#T),this.#b()):this.#e===this.#r||this.#r===" "&&b(this.#e)?(this.#S(this.#t,this.#s),this.#i(this.#y)):this.#s+=this.#e}#T(){b(this.#e)||(this.#e==="<"?(this.#h="",this.#n={},this.#i(this.#F)):(this.#a===" "?this.#p=this.#a+this.#e:this.#p=this.#e,this.#h="",this.#n={},this.#b(),this.#i(this.#_)))}#x(){b(this.#e)||(this.#e===">"?this.#i(this.#T):this.#e===this.#r||this.#r===" "&&b(this.#e)?this.#i(this.#y):this.#e===":"?this.#i(this.#L):this.#m+=this.#e)}#L(){this.#e===">"?this.#i(this.#T):this.#e===";"?(this.#w(this.#m,this.#c),this.#m="",this.#c="",this.#i(this.#x)):this.#e===this.#r?(this.#w(this.#m,this.#c),this.#m="",this.#c="",this.#i(this.#y)):this.#c=this.#d(this.#c,this.#e)}#F(){if(b(this.#e))this.#h!==""&&this.#i(this.#y);else if(this.#e==="/"&&R.includes(this.#h))this.#o.tagName||(this.#o=this.#o.parent),this.#b(),this.#i(this.#M);else if(this.#e===">"){if(!this.#h)throw new Error("Expected tag name, found >");this.#o.tagName||(this.#o=this.#o.parent),this.#b(),this.#i(this.#T)}else this.#a==="<"&&this.#e==="/"?(this.#h,this.#E="",this.#i(this.#M)):this.#h+=this.#e}#M(){if(!b(this.#e))if(this.#e===">"){if(this.#o.tagName&&this.#o.tagName!=="-"&&!R.includes(this.#o.tagName)&&this.#o.tagName!==this.#E)throw new Error(`Expected ${this.#o.tagName} tag to be closed, but ${this.#E} found`);this.#h="",this.#E="",this.#o.tagName?this.#o=this.#o.parent:this.#o=this.#o.parent.parent,this.#i(this.#T)}else this.#E+=this.#e}#_(){this.#e==="<"?(this.#n={},this.#o.attributes.textContent=this.#p,this.#i(this.#F)):(this.#p=this.#d(this.#p,this.#e),this.#o.tagName||(this.#o.attributes.textContent=this.#p))}}class tt{#t=[new _];#r;#s;#n=!0;#e=null;#a=[];#l=[];#f;constructor(t,e,n,s=[]){this.#f=t,this.#s=t.document,this.#n=this.#s.baseURI==="",this.#r=e,this.#a=n,this.#l=s}appendChildrenToContainer(){const t=this.#r;t&&D(t,this.getCreatedElements())}createElement(t,...e){const n=t?this.#s.createElement(t):this.#s.createTextNode("");let s=[],r=0;for(const o of e)if(r+=1,typeof o=="string"){const c=this.#s.createTextNode(this.#i(o));s=M(c,s)}else if(typeof o=="number"){const c=this.#s.createTextNode(o.toString());s=M(c,s)}else if(o instanceof this.#f.Node)s=M(o,s);else if(o instanceof Array){if(o.length===0)continue;let c=!1;for(const h of o)if(h instanceof this.#f.Node){c=!0;break}if(c)s=dt(o,s);else{const h=this.#s.createTextNode(this.#g(o));s=M(h,s)}}else if(o instanceof Error)n.textContent=this.#i(o.message);else if(o instanceof m){const c=this.#n?o.getElementsSr():o.getElements();for(const h of c)for(const a of h)s=M(a,s)}else if(o instanceof Function)if(this.#n)n.innerHTML=`(${o.toString()})()`;else if(n instanceof HTMLScriptElement){const c=this.#s.createTextNode(`(${o.toString()})()`);n.appendChild(c)}else"value"in n&&!(n instanceof HTMLLIElement)?this.#u(n,{value:o}):this.#u(n,{textContent:o});else o instanceof Object&&!(o instanceof Function)&&r===1&&this.#u(n,o);D(n,s);const l=this.#t.length-1;return this.#t[l].removeTheseElements(s),this.#t[l].addElement(n),n}for(t,e,n){const s=()=>{const r=Nt(t,e,n);r instanceof Error&&console.error(r)};return this.#C("for",null,s)}forEach(t,e){return this.#E(1,t,e)}forState(t,e){return this.#E(2,t,e)}getCreatedElements(){return this.#t[0].getElements()}getHtmlCode(t){let e="";if(this.#n){const n=this.#r;n&&(e=n.paintChildren(t))}return e}html(t,...e){const n=e.length===0&&this.#l.length===0?this.#p(t instanceof Array?t[0]:t):this.#N(t instanceof Array?t:[t],...e);for(const s of n)s.tagName===""&&(s.textContent=this.#i(s.textContent));return n}if(t,e,n){const s=r=>{if(r)if(e instanceof m){const l=this.#n?e.getElementsSr():e.getElements(),o=this.#t.length-1;this.#t[o].addElements(l[0])}else e instanceof Function&&e();else if(n instanceof m){const l=this.#n?n.getElementsSr():n.getElements(),o=this.#t.length-1;this.#t[o].addElements(l[0])}else n instanceof Function&&n()};return t instanceof Function?this.#O("if",t,s):this.#C("if",t,s)}render(){this.#t=[new _];for(const t of this.#a)if(t instanceof Function){const e=t(this);if(e&&typeof e=="string")this.html(e);else if(e instanceof m){const n=this.#n?e.useTranslations(this.#l).getElementsSr():e.useTranslations(this.#l).getElements();for(const s of n)this.#t[0].addElements(s)}else if(e instanceof Function)e(this);else if(e instanceof Array){let n=!0,s=!0;for(const r of e){if(!(r instanceof m)){n=!1;break}if(!(r instanceof Function)){s=!1;break}}if(n)for(const r of e){if(!(r instanceof m))break;const l=this.#n?r.getElementsSr():r.getElements();for(const o of l)this.#t[0].addElements(o)}else if(s)for(const r of e){if(!(r instanceof Function))break;r(this)}}}else if(t instanceof m){const e=this.#n?t.useTranslations(this.#l).getElementsSr():t.useTranslations(this.#l).getElements();for(const n of e)this.#t[0].addElements(n)}this.appendChildrenToContainer()}#m({thisLevel:t,upperLevel:e}){const n=this.#t[t].getElements();return this.#t[e].importElements(this.#t[t]),this.#t[t].removeAllElements(),delete this.#t[t],this.#t.pop(),n}#c(t){return!!this.#l?t.map(n=>this.#i(n)):t}#g(t){return this.#i(X.apply(null,this.#c(t)))}#h(){this.#t.push(new _);const t=this.#t.length-1,e=t-1;return{thisLevel:t,upperLevel:e}}#E(t,e,n){const s=l=>this.#i(l);if(Y(e)){const l=(o,c,h)=>{const a=[];let f=c.getElements().length;return Q(t,o,n,s,h,p=>{const T=c.getElements(),G=T.slice(f);a.push({key:p,elements:G}),f=T.length}),a};return this.#S("forEach",e,l)}const r=l=>{Q(t,l,n,s)};return e instanceof Function?this.#O("forEach",e,r):this.#C("forEach",e,r)}#p(t){let e=[];if(this.#n){const s=this.#s.createElement("");s.innerHTML=t??"",e=[s]}else{this.#e||(this.#e=this.#s.createElement("template"));const s=this.#e;s.innerHTML=t.trim()??"",e=Array.from(s.content.childNodes),s.innerHTML=""}const n=this.#t.length-1;return this.#t[n].addElements(e),e}#N(t,...e){return new xt(t,e).generate(this)}#o(t,e){if(!this.#r?.contains(t))return!1;let n=t;for(const s of e)wt(s,n),n=s;return!0}#d(t){if(t.nodeType!==8)return-1;const n=t.textContent;let s="";if(n)s=n.slice(0,-6)+"-end";else return-1;let r=t.nextSibling,l=0,o=0;for(;r!==null;){if(r.nodeType===8){const h=r.textContent;if(h===n)l+=1;else if(h===s&&(l-=1,l<0))break}const{nextSibling:c}=r;this.#y(r),r.remove(),o+=1,r=c}return o}#u(t,e){for(let n in e){let s=e[n];if(this.#n){if(J(n)&&s instanceof Function){L(t,n,s);continue}}else if(s instanceof Function&&bt(t,n,s))continue;if(s instanceof Function){const r=s;x(t,n,"",r,null);let l=r(t);if(l instanceof m){const o=this.#n?l.getElementsSr():l.getElements();D(t,o[0]),n=""}else if(l instanceof Function)l=l();else{const o=this.#s.createTextNode(l.toString());t.appendChild(o)}F(),l instanceof Array?l=this.#g(l):typeof l=="string"&&(l=this.#i(l)),n&&L(t,n,l)}else t instanceof this.#f.HTMLElement&&n==="style"&&s instanceof Object?this.#b(t,s):t instanceof this.#f.HTMLElement&&n==="data"?s instanceof Object&&Ot(t,s):n==="textContent"?s instanceof Array?t[n]=this.#g(s):t[n]=this.#i(s):((n==="innerText"||n==="value"&&t.tagName==="INPUT"&&(t.getAttribute("type")??"").toLowerCase()==="button")&&(s=this.#i(s)),L(t,n,s))}}#b(t,e){for(const n in e){const s=e[n];let r="";if(s instanceof Function){const l="style",o=s;x(t,l,n,o,null),r=o(t),F()}else r=s;typeof n=="string"&&(t.style[n]=Z(n,r))}}#C(t,e,n){const{thisLevel:s,upperLevel:r}=this.#h();return n(e),this.#m({thisLevel:s,upperLevel:r})}#O(t,e,n){const{thisLevel:s,upperLevel:r}=this.#h();if(e instanceof Function){const o=this.#s.createComment(`${t}-begin`),c=this.#s.createComment(`${t}-end`);this.#t[s].addElement(o);const h=p=>{if(this.#n)return;this.#t[0].removeAllElements(),this.#d(o),n(p),this.#o(o,this.#t[0].getElements())||console.error("Element ",o," does not exist anymore")},a=o,f=`--${t}`;x(a,f,"",e,h);const w=e();F(),n(w),this.#t[s].addElement(c)}else n(e);return this.#m({thisLevel:s,upperLevel:r})}#S(t,e,n){const{thisLevel:s,upperLevel:r}=this.#h(),l=this.#s.createComment(`${t}-begin`),o=this.#s.createComment(`${t}-end`);this.#t[s].addElement(l);const c=f=>{if(!(f instanceof Object)||this.#n)return;let w=o.renderedElementsMap.length;for(;w--;){const O=o.renderedElementsMap[w];St(f,O.key)||(O.elements.forEach(I=>{I.remove()}),o.renderedElementsMap=Ct(o.renderedElementsMap,w))}let p=l;const T=[],G=f instanceof Map||f instanceof Set||f instanceof Array?f.keys():Object.keys(f);for(let O of G){if(!(O in f))continue;let I=!1;for(const S of o.renderedElementsMap)if(S.key===O){const{elements:N}=S;p=N.length>0?N[N.length-1]:p,T.push(S),I=!0;break}if(!I){let S=!1;l.parentElement&&(this.#t.push(new _),S=!0);const N=this.#t.length-1,zt=n(f,this.#t[N],O);for(const ft of zt)T.push(ft),ft.elements.forEach(V=>{N===0&&this.#t[N].moveElementAfterAnother(V,p),p.after(V),p=V});S&&this.#t.pop()}}o.renderedElementsMap=T},h=`-s-${t}`;return x(o,h,"",()=>e,c),o.renderedElementsMap=n(e,this.#t[s]),F(),this.#t[s].addElement(o),this.#m({thisLevel:s,upperLevel:r})}#i(t){if(typeof t=="string"){const e=this.#w(t,this.#l);if(typeof e=="string")return e;const n=mt(),s=this.#w(t,n?.paintorTranslations);if(typeof s=="string")return s}return t}#w(t,e){if(e instanceof Array&&e.length>0){for(const n of e)if(t in n)return n[t]}return!1}#y(t){Object.hasOwn(t,"--subscribed")&&Object.assign(t,{"--deleted":!0});let e=t.childNodes.length;for(;e--;)this.#y(t.childNodes[e])}}function Ft(...i){const t=this;return function(...n){return t.call(this,...i,...n)}}const{prototype:P}=tt;Object.assign(P.createElement,{bindArgs:Ft}),At.forEach(i=>{P[i]=P.createElement.bindArgs(i)});const Dt=Object.freeze(["async","autofocus","autoplay","checked","contenteditable","controls","default","defer","disabled","formNoValidate","frameborder","hidden","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","readonly","required","reversed","scoped","selected","typemustmatch"]),Lt=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]),u=Object.freeze({ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11});class v extends Error{constructor(t,e){super(t),this.name=e??"DOMException"}}class E{nextSibling=null;previousSibling=null;textContent="";#t=[];#r="";#s=1;#n=null;constructor(t,e){this.#s=t,this.#r=e}get baseURI(){return""}get childNodes(){return this.#t}get firstChild(){return this.#t[0]??null}get nodeName(){return this.#r}get nodeType(){return this.#s}get parentNode(){return this.#n}set parentNode(t){this.#n=t}appendChild(t){if(this.nodeType!==u.DOCUMENT_NODE&&this.nodeType!==u.DOCUMENT_FRAGMENT_NODE&&this.nodeType!==u.ELEMENT_NODE)throw new v("This node type does not support this method.");if(this.nodeType===u.DOCUMENT_NODE)throw new v("Failed to execute 'appendChild' on 'Node': Only one element on document allowed.");if(!(t instanceof E)){const n="Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.";throw new TypeError(n)}if(this.#t.includes(t))return;if(t===this)throw new v("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");this.#t.push(t),t.parentNode=this;const e=this.#t.length-2;e>=0&&(this.#t[e].nextSibling=t,t.previousSibling=this.#t[e]??null)}contains(){return!1}insertBefore(t,e){const n=[];for(const s of this.#t)s===e&&n.push(t),n.push(s);return this.#t=n,t}removeChild(t){if(!t)throw new Error("Failed to execute 'removeChild' on 'HTMLElement': parameter 1 is not of type 'HTMLElement'.");if(!this.#t.includes(t))throw new Error("Failed to execute 'removeChild' on 'HTMLElement': The node to be removed is not a child of this node.");return this.#t=this.#t.filter(e=>e!==t),t}paintChildren({indent:t=""}){let e="",n=0;for(const s of this.childNodes){n+=1;const r=n>1;e+=nt(s,t,"",r)}return e}}class U extends E{constructor(){super(u.COMMENT_NODE,"#comment")}}class B extends E{constructor(){super(u.TEXT_NODE,"#text")}}function et(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,n=>{let s=n;return n in e&&(s=e[n]),s}),t}function _t(i){let t="";for(const e of i){const{name:n}=e;let{value:s}=e;Dt.includes(n)?s!==!1&&s!==0&&s!==void 0&&s!==null&&(t+=` ${n}`):(s instanceof Array?s=s.join(","):s===!0?s="true":s===!1?s="false":s===void 0?s="undefined":s===null?s="null":s instanceof Function?s=`return(${s.toString()}).call(this,window.event)`:s=s.toString(),s=s.replace(/\"/g,'\\"'),s=et(s),t+=` ${n}="${s}"`)}return t}function vt(i){let t="";return t=i.replace(/([A-Z])/g,(e,n)=>`-${n.toLowerCase()}`),t}function kt(i){let t="";for(const e in i){const n=i[e];t+=`${vt(e)}:${n};`}return t.trim()}function nt(i,t,e,n=!1){let s="",r="",l="";if(t&&(r=e,l=`
`),i instanceof U)s+=`${l}${r}<!--${i.textContent}-->`;else if(i instanceof B)s+=`${l}${r}${i.textContent}`;else if(i instanceof C){const o=Lt.includes(i.tagName),c=_t(i.attributes);let h="";Object.keys(i.style).length>0&&(h=` style="${kt(i.style)}"`),n&&(s+=l),s+=r,i.tagName&&(s+=`<${i.tagName.toLowerCase()}${c}${h}`,s+=o?"":">"),s+=i.textContent;let a="";for(const f of i.childNodes)a+=nt(f,t,e+t,!0);a&&(s+=a+l+r),i.tagName!==""&&(s+=o?"/>":`</${i.tagName.toLowerCase()}>`)}return s}class k extends E{#t=[];#r="";constructor(t,e){super(t,e.toUpperCase()),this.#r=e.toUpperCase()}get attributes(){return this.#t}get children(){return this.childNodes.filter(t=>t instanceof k)}get className(){let t="";for(const e of this.#t)if(e.name==="class"){t=e.value;break}return t}set className(t){this.setAttribute("class",t)}get innerHTML(){return this.textContent}set innerHTML(t){this.textContent=t}get tagName(){return this.#r}append(t){t instanceof E?this.appendChild(t):this.textContent=et(t.toString())}getAttribute(t){let e="";if(e=t.trim().toLowerCase(),!e)return null;const n=this.#t.findIndex(s=>s.name===e);return n===-1?null:this.#t[n].value}remove(){this.parentNode?.removeChild(this)}setAttribute(t,e){let n="";if(n=t.trim().toLowerCase(),!n)return;const s=e,r=this.#t.findIndex(l=>l.name===n);r===-1?this.#t.push({name:n,value:s}):this.#t[r]={name:n,value:s}}}function It(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,n=>{let s=n;return n in e&&(s=e[n]),s}),t}function jt(i){const t=i.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(e=>e[0].toUpperCase()+e.slice(1)).join("")}function $t(i){const t={};return i.split(";").forEach(e=>{const[n,s]=e.split(":");if(!n)return;const r=jt(n.trim());t[r]=s.trim()}),t}let C=class extends k{#t={};constructor(t){super(u.ELEMENT_NODE,t)}get innerText(){return this.textContent}set innerText(t){this.textContent=It(t.toString())}get style(){return this.#t}set style(t){if(typeof t=="string"){const e=$t(t);for(const n in e)this.#t[n]=e[n].toString()}}},st=class extends E{constructor(){super(u.DOCUMENT_FRAGMENT_NODE,"#document-fragment")}};class Ht extends E{ELEMENT_NODE=u.ELEMENT_NODE;ATTRIBUTE_NODE=u.ATTRIBUTE_NODE;TEXT_NODE=u.TEXT_NODE;CDATA_SECTION_NODE=u.CDATA_SECTION_NODE;PROCESSING_INSTRUCTION_NODE=u.PROCESSING_INSTRUCTION_NODE;COMMENT_NODE=u.COMMENT_NODE;DOCUMENT_NODE=u.DOCUMENT_NODE;DOCUMENT_TYPE_NODE=u.DOCUMENT_TYPE_NODE;DOCUMENT_FRAGMENT_NODE=u.DOCUMENT_FRAGMENT_NODE;#t;#r=[];constructor(){super(9,"#document");const t=new C("html"),e=new C("head"),n=new C("body");t.appendChild(e),t.appendChild(n),this.#r.push(t),this.#t=n}get body(){return this.#t}get children(){return this.#r}get parentElement(){return null}createDocumentFragment(){return new st}createComment(t=""){const e=new U;return e.textContent=t,e}createElement(t){return new C(t)}createTextNode(t){const e=new B;return e.textContent=t,e}}class Rt{Comment=U;DocumentFragment=st;Element=k;HTMLElement=C;Node=E;Text=B;DOMException=v;Error=Error;TypeError=TypeError;document;constructor(){this.document=new Ht}}const it=y(),Pt=new Rt;class m{#t=!1;#r="";#s="";#n=[];#e=[];#a="";#l=!1;#f=[];#m=new Map;#c=[];appendTo(t){if(!it)throw new Error("You can only do this in browser environment");this.#d(t,window,!1)}compose(...t){if(t instanceof Array)for(const e of t)if(e instanceof Array)for(const n of e)this.#f.push(n);else this.#f.push(e);return this}getElements(){return this.#d(null,window,!0),this.#e}getHtml(t){if(this.#l)return this.getStaticHtml(t);const e=this.#h();return this.#d("",e,!0,t),this.#a}getStaticHtml(t){const e=this.#c[0]??null;if(!this.#m.has(e)){const n=this.#h();this.#d("",n,!0,t),this.#m.set(e,this.#a)}return this.#m.get(e)??""}getElementsSr(){const t=this.#h();return this.#d("",t,!0),this.#e}paint(t){if(!it)throw new Error("You can only use this function in browser environment");if(!t)throw new Error("No container selected.");if(typeof t!="string"&&!(t instanceof HTMLElement)&&!(t instanceof NodeList)&&!(t instanceof Array)&&!(t instanceof HTMLCollection))throw new Error(`Wrong type for the container element. Expected <string> or <Node>, got <${typeof t}>`);this.#d(t,window,!0)}static(t=!0){return this.#l=t,this}useTranslations(...t){return t.map(e=>{e instanceof Array?e.forEach(n=>{this.#c.includes(n)||(this.#c=[...this.#c,n])}):e instanceof Object&&(this.#c.includes(e)||(this.#c=[...this.#c,e]))}),this}#g(){if(this.#n)for(const t of this.#n)for(;t?.firstChild;)t.removeChild(t.firstChild)}#h(){return Pt}#E(t,e,n,s){return this.#e=[],this.#a="",this.#p(t,e),this.#o(n),this.#N(s),!0}#p(t,e){const n=e.document.baseURI==="";if(typeof t=="string"){if(this.#s=t,this.#t=!1,Et(t))this.#t=!0;else if(pt(t)||(this.#r=t),this.#n=n?[e.document.createElement("#container")]:e.document.querySelectorAll(t),!this.#n)throw new Error(`Could not find an element by the following query: ${t}`)}else if(t instanceof HTMLElement)this.#n=[t];else if(t instanceof NodeList||t instanceof HTMLCollection)this.#n=t;else if(t instanceof Array){for(const s of t)if(!(s instanceof HTMLElement))throw new Error("All elements in the input array must be DOM elements");this.#n=t}return!0}#N(t){for(let e of t)if(!(e instanceof Function)&&!(e instanceof m))throw new Error("The template must be a function");return!0}#o(t){if(!(t instanceof Array))throw new Error("The argument 'translations' must be an Array");return this.#c=t,!0}#d(t,e,n=!0,s={}){this.#E(t,e,this.#c,this.#f),n&&this.#g();const r=this.#f,l=this.#c;if(!e)throw new Error("Missing window element");if(this.#t){const o=c=>class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){if(!this.shadowRoot)throw new Error("Missing shadow root");c.#u(e,this.shadowRoot,r,l,s)}};customElements.define(this.#s,o(this))}else if(this.#r&&new MutationObserver(c=>{for(const h of c){const a=h.addedNodes;for(let f of a)f instanceof HTMLElement&&f.matches(this.#r)&&this.#u(e,f,r,l,s)}}).observe(document.body,{attributes:!1,childList:!0,characterData:!1,subtree:!0}),this.#n.length===0)this.#u(e,null,r,l,s);else for(const o of this.#n)this.#u(e,o,r,l,s)}#u(t,e,n,s,r={}){const l=new tt(t,e,n,s);l.render(),this.#a=l.getHtmlCode(r),this.#e.push(l.getCreatedElements())}}const Ut="modulepreload",Bt=function(i){return"/"+i},rt={},ot=function(t,e,n){return t()},Gt=function(){let i="en";return y()&&(i=document.getElementById("html")?.getAttribute("lang")??i),i},Vt=async function(i,t){if(typeof i!="string")throw new Error("Translation path must be a string");let e=null;const n=i.match(/^(.*?)([^.\/\\]+)(.\w+)$/m);if(n===null)throw new TypeError(`Incorrect path: ${i}`);const s=n[1]+t+n[3];try{e=(await ot(()=>new Promise((r,l)=>z([s],o=>r(q(o)),l)),void 0)).default}catch{s!==i&&(e=(await ot(()=>new Promise((l,o)=>z([i],c=>l(q(c)),o)),void 0)).default)}if(!(e instanceof Object))throw new TypeError(`Translation at ${s} must export an object`);return e},lt=async function(...i){const t=Gt(),e=[];for(let n of i)e.push(Vt(n,t));return Promise.all(e)};function ct(...i){return new m().compose(...i)}function ht(i){return i}const at={compose:ct,createState:W,createTemplate:ht,fetchTranslations:lt,Component:m};g.Component=m,g.compose=ct,g.createState=W,g.createTemplate=ht,g.default=at,g.fetchTranslations=lt,g.paintor=at,Object.defineProperties(g,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=paintor.amd.js.map
