"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const x=Symbol("Subscriptions"),$=Symbol("Access"),B=Symbol("TemplateFunction"),j=Symbol("State"),d=Object.freeze({CREATE:1,READ:2,UPDATE:3,DELETE:4,SPLICE:5,SWAP:6,COPY_WIHTIN:7,SORT:8});let y={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null};function P(i,e,t,n,s){y.element=i,y.propertyName=e,y.subPropertyName=t,y.bindFunction=n,y.statementRepaintFunction=s}function k(){y.element=null,y.propertyName="",y.subPropertyName="",y.bindFunction=null,y.statementRepaintFunction=null}function pe(i,e,t,n){if(x in i){let s=i[x].length;for(;s--;){const r=i[x][s];if(t===void 0||t===r.bindFunction){if(r.element=e,n)for(const l in n)r[l]=n[l];e[x]??=[],e[x].push(r),i[x].splice(s,1)}}}}function ge(i){return Object.hasOwn(i,x)}class be{#e={};#n=new Map;createProxy(e,t=""){const n=this.#s(),s=new Proxy(e,n);for(const r in s){if(!(s[r]instanceof Object))continue;const l=t===""?r:`${t}.${r}`;s[r]=this.createProxy(s[r],l)}return this.#e=s,s}subscribe(e,t,n,s,r,l,o){(s==="-s-if"||s==="-s-forEach")&&(t=s),this.#n.has(t)||this.#n.set(t,[]);const h=this.#n.get(t)??[];for(const f of h)if(f.element===n&&f.propertyName===s&&f.subPropertyName===r&&f.bindFunction===l&&f.statementRepaintFunction===o)return;const c={element:n,propertyName:s,subPropertyName:r,bindFunction:l,statementRepaintFunction:o,stateSubscription:this};h.push(c),n[x]??=[],n[x].push(c)}unsubscribe(e){if(x in e){const t=e[x];let n=t.length;for(;n--;)t[n].stateSubscription===this&&t.splice(n,1)}this.#n.forEach((t,n)=>{this.#n.set(n,t.filter(s=>s.element!==e))})}#s(){return{get:(t,n,s)=>{if(n===j)return t[n];if(Object.hasOwn(t,n)||n===$)y.element&&y.bindFunction&&this.subscribe(t,n,y.element,y.propertyName,y.subPropertyName,y.bindFunction,y.statementRepaintFunction);else if((t instanceof Map||t instanceof Set)&&t[n]instanceof Function){const r=t[n];return(...o)=>{const h=r.apply(t,o);return t instanceof Set?n==="add"?this.#u(s,n):n==="delete"&&this.#f(s,n):t instanceof Map&&(n==="set"?this.#u(s,n):n==="delete"&&this.#f(s,n)),h}}else if(t instanceof Array&&t[n]instanceof Function&&typeof n=="string")return this.#i(t,s,n);return t[n]},set:(t,n,s,r)=>(n===j||n===$||t instanceof Array&&n==="length"?t[n]=s:Object.hasOwn(t,n)?s instanceof Object?(t[n]=this.createProxy(s),this.#f(r,n),this.#u(r,n)):(t[n]=s,this.#a(r,n,s)):(s instanceof Object?t[n]=this.createProxy(s):t[n]=s,this.#u(r,n)),!0),deleteProperty:(t,n)=>(delete t[n],this.#f(t,n),!0)}}#i(e,t,n){switch(n){case"copyWithin":return(...s)=>{let[r,l,o]=s;const{length:h}=e;if(r<0)r+=h;else if(r<-h)r=0;else{if(r>=h)return;r>l&&(o=h-1)}if(l<0)l+=h;else if(l<-h||l===void 0)l=0;else if(l>=h)return;if(o<0)o+=h;else if(o<-h)o=0;else if(o>=h||o===void 0)o=h;else if(o<=l)return;const c=e[n].apply(e,[r,l,o]);return this.#t(d.COPY_WIHTIN,t,[r,l,o]),c};case"reverse":return()=>{const s=e[n].apply(e);for(let r=0,l=e.length;r<l;r++){const o=l-1-r;if(r>=o)break;this.#t(d.SWAP,t,[r,o])}return s};case"shift":return()=>{const s=e[n].apply(e);return this.#t(d.SPLICE,t,[0,1]),s};case"sort":return(...s)=>{const r=e[n].apply(e,s);return this.#t(d.SORT,t,s),r};case"splice":return(...s)=>{const r=e[n].apply(e,s);return this.#t(d.SPLICE,t,s),r};case"unshift":return(...s)=>{const r=e[n].apply(e,s);return this.#t(d.SPLICE,t,[0,0,...s]),r};default:return e[n]}}#t(e,t,n){const s=this.#n.get("-s-forEach");if(s)for(let r=0,l=s.length;r<l;r++){const{statementRepaintFunction:o}=s[r];o&&o(e,t,"",n)}}#u(e,t){this.#o(d.CREATE,e,t)}#o(e,t,n){const s=this.#n.get("-s-forEach");if(s)for(let r=0,l=s.length;r<l;r++){const{statementRepaintFunction:o}=s[r];o&&o(e,t,n)}}#f(e,t){this.#o(d.DELETE,e,t)}#a(e,t,n){if(this.#n.has(t)){const s=this.#n.get(t)??[];for(const r of s){const{element:l,propertyName:o,subPropertyName:h,bindFunction:c,statementRepaintFunction:f}=r;if(Object.hasOwn(l,"--deleted")){this.unsubscribe(l);return}let a=c.call(l,l);o==="style"&&h?l.style[h]=le(h,a):o==="--if"||o==="--for"||o==="--nest"?f&&f(a):(a instanceof Function&&(a=a()),G(l,o,a))}}}}let ee=0;const X=function(e){if(!(e instanceof Object))throw new Error("state() only accepts Object, Array, Set or Map as input value.");const n=new be().createProxy(e);return ee+=1,n[j]={id:ee,target:e},n},q=function(i){return i instanceof Object&&j in i};function ye(){return typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global||this}function re(i,...e){const t=/(%?)(%([ojdsif]))/g;if(e.length>0){const n=(s,r,l,o)=>{let h=e.shift(),c="";switch(o){case"o":Array.isArray(h)&&(c=JSON.stringify(h));break;case"s":c=""+h;break;case"d":c=""+Number(h);break;case"j":c=JSON.stringify(h);break;case"i":c=""+parseInt(""+h,10);break;case"f":c=""+parseFloat(""+h);break}return r?(e.unshift(c),s):c};i=i.replace(t,n)}return e.length>0&&(i+=" "+e.join(" ")),i=i.replace(/%{2,2}/g,"%"),""+i}function I(){if(I.isIt===void 0){const i=new Function("try {return this===window;}catch(e){ return false;}");I.isIt=i()}return I.isIt??!1}I.isIt=void 0;function A(i,e){e.push(i)}function H(i,e){for(const t of i)e.push(t)}function oe(i){return i.toLowerCase().indexOf("on")===0}function L(i){return i===" "||i==="	"||i==="\r"||i===`
`}function Te(i){return/^[a-z][a-z0-9-]+$/.test(i)&&i.includes("-")}function Ne(i){return/#[a-z0-9-]+\s*$/.test(i)}function Ce(i){if(i==="true")return!0;if(i==="false")return!1;const e=parseInt(i);return isNaN(e)?!!i:!!e}function Oe(i,e,t){if(!(i instanceof window.Node)||typeof e!="string"||typeof t!="function"||oe(e)===!1)return!1;const n=e.toLowerCase().substring(2);return i.addEventListener(n,t),!0}function we(i,e){if(e.length===1)i.appendChild(e[0]);else if(e.length>1){const t=new DocumentFragment;for(const n of e)n&&t.append(n);i.appendChild(t)}}function Se(i,e){for(const t of e)t&&i.appendChild(t)}function te(i,e){i&&(I()&&i instanceof window.Node?we(i,e):Se(i,e))}function ne(i,e,t,n,s,r){if(!(t instanceof Function))throw new TypeError('"handler" argument should be a Function');const l=q(e)?e[j].target:e,o=i===2&&q(l);if(l instanceof Array){o&&e[$];for(const h in l){if(s!==void 0&&s!==h)continue;let c=o&&l[h]instanceof Object?e[h]:l[h];n&&(c=n?.(c));const f=t(c,h);if(r?.(h),f===!1)break}}else if(l instanceof Map||l instanceof Set){o&&e[$];for(const[h,c]of l.entries()){if(s!==void 0&&s!==h)continue;let f=c;n&&(f=n?.(f));const a=t(f,h);if(r?.(h),a===!1)break}}else if(l instanceof Object){o&&e[$];for(const h in l){if(s!==void 0&&s!==h)continue;let c=o&&l[h]instanceof Object?e[h]:l[h];n&&(c=n?.(c));const f=t(c,h);if(r?.(h),f===!1)break}}else throw new TypeError('"data" argument should be an Object or an Array');return!0}function xe(i,e,t){if(typeof i!="number"||typeof e!="number")return new Error('"start" and "end" arguments should be numbers');if(!(t instanceof Function))return new Error('"handler" argument should be a Function');if(e>=i)for(let n=i;n<=e&&t(n)!==!1;n++);else for(let n=i;n>=e&&t(n)!==!1;n--);return!0}function Me(i,e){return i.splice(e,1),i}function Ae(i,e){if(!e)return;const{nextSibling:t,parentNode:n}=e;n&&n.insertBefore(i,t)}function De(i,e){if(e instanceof Object)for(const t in e){const n=e[t].toString();i.setAttribute(`data-${t}`,n)}}function G(i,e,t){e in i?t instanceof Array?i[e]=re.apply(null,t):i[e]=t??"":"setAttribute"in i&&i.setAttribute(e,t)}function le(i,e){let t=e;return(i==="visibility"||i==="backfaceVisibility")&&(e===!0||e===!1||e===void 0||e===null)&&(t=e?"visible":"hidden"),i==="display"&&(e===!0||e===!1||e===void 0||e===null)&&(t=e?"":"none"),i==="flex"&&(e===!0||e===!1||e===void 0||e===null)&&(t=e?1:0),t}function Fe(i,e,t){if(t>=i.length){let n=t-i.length+1;for(;n--;)i.push(void 0)}return i.splice(t,0,i.splice(e,1)[0]),i}const Le=(...i)=>{const e=i.length;for(let t=1;t<e;t++)i[t-1].after(i[t])};class U{elements=[];addElement(e){e&&this.elements.push(e)}addElements(e){for(let t of e)this.elements.push(t)}getElements(){return this.elements}hasElement(e){return this.elements.indexOf(e)>-1}importElements(e){const t=e.getElements();for(const n of t)this.addElement(n)}moveElementAfterAnother(e,t){const n=this.elements.indexOf(e),s=this.elements.indexOf(t);if(n===-1||s===-1)throw new Error("Cannot move one element after another, because one element is missing");s-n!==1&&(this.elements=Fe(this.elements,n,s+1))}removeAllElements(){this.elements.length=0}removeTheseElements(e){let t=e.length;for(;t--;){let n=this.elements.length;for(;n--;)if(e[t]===this.elements[n]){this.elements.splice(n,1);continue}}}}const _e=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];class J{tagName="-";parent=this;children=[];attributes={};newChild(e,t){const n=new J;return n.parent=e,n.attributes=t,this.children.push(n),n}}const Y=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]);class Ie{#e="";#n="";#s="";#i={};#t;#u;#o=[];#f=this.#N;#a="";#h="";#T={};#c="";#d="";#p="";#C=new J;#r=this.#C;constructor(e,t){this.#o=this.#x(e,t),this.#w()}generate(e){if(this.#c||this.#d)throw new Error("Some HTML tag is not closed");return this.#m(e,this.#C)}#g(e,t){return typeof e=="function"?typeof t=="function"?t:e:typeof e=="string"&&(typeof t=="string"||typeof t=="number"||typeof t=="boolean")?e+t.toString():t}#m(e,t){const n=[];for(const s of t.children){let r=null;s.tagName==="if"?r=e.if(Ce(s.attributes?.condition??""),()=>this.#m(e,s)):s.tagName==="for"?"iterations"in s.attributes?r=e.for(0,parseInt(s.attributes?.iterations??0)-1,(l,o)=>{this.#m(e,s)}):("from"in s.attributes||"to"in s.attributes)&&(r=e.for(parseInt(s.attributes?.from??0),parseInt(s.attributes?.to??0),(l,o)=>{this.#m(e,s)})):s.tagName==="forEach"?"object"in s.attributes&&(r=e.forEach(s.attributes?.object??{},(l,o)=>{this.#m(e,s)})):(r=e.createElement(s.tagName,s.attributes,this.#m(e,s)),n.push(r))}return n}#b(){const e=this.#r,t=this.#i;Object.keys(this.#T).length>0&&(t.style=this.#T);const n=this.#r.newChild(e,t);n.tagName=this.#c,this.#r=n}#x(e,t=[]){const n=[];for(let s=0;s<e.length;s++)e[s]&&n.push(e[s]),t[s]!==void 0&&n.push(t[s]);return n}#w(){for(let e=0;e<this.#o.length;e++)if(typeof this.#o[e]=="string")for(let t=0;t<this.#o[e].length;t++)this.#t=this.#o[e][t],this.#u=this.#o[e][t-1],this.#f();else this.#t=this.#o[e],this.#u=void 0,this.#f()}#O(e,t){e&&(this.#i[e]=typeof t=="string"?t.trim():t)}#l(e){e===this.#y&&(this.#e="",this.#s="",this.#n=""),this.#f=e}#E(e,t){e&&(this.#T[e]=typeof t=="string"?t.trim():t)}#y(){L(this.#t)||(this.#t==="/"?(Y.includes(this.#c)&&this.#b(),this.#l(this.#M)):this.#t===">"?(this.#b(),this.#l(this.#N)):this.#t==="="?this.#l(this.#S):this.#e+=this.#t)}#S(){L(this.#t)||(this.#t==="'"||this.#t==='"'?(this.#n=this.#t,this.#l(this.#e==="style"?this.#D:this.#A)):(this.#n=" ",this.#s=this.#g(this.#s,this.#t),this.#l(this.#A)))}#A(){this.#t===">"&&this.#u!=="/"?(this.#n&&this.#e&&this.#s&&this.#O(this.#e,this.#s),this.#e="",this.#s="",this.#n="",this.#l(this.#N),this.#b()):this.#t===this.#n||this.#n===" "&&L(this.#t)?(this.#O(this.#e,this.#s),this.#l(this.#y)):this.#t instanceof Object?this.#s=this.#t:this.#s+=this.#t}#N(){L(this.#t)||(this.#t==="<"?(this.#c="",this.#i={},this.#l(this.#F)):(this.#u===" "?this.#p=this.#u+this.#t:this.#p=this.#t,this.#c="",this.#i={},this.#b(),this.#l(this.#_)))}#D(){L(this.#t)||(this.#t===">"?this.#l(this.#N):this.#t===this.#n||this.#n===" "&&L(this.#t)?this.#l(this.#y):this.#t===":"?this.#l(this.#L):this.#a+=this.#t)}#L(){this.#t===">"?this.#l(this.#N):this.#t===";"?(this.#E(this.#a,this.#h),this.#a="",this.#h="",this.#l(this.#D)):this.#t===this.#n?(this.#E(this.#a,this.#h),this.#a="",this.#h="",this.#l(this.#y)):this.#h=this.#g(this.#h,this.#t)}#F(){if(L(this.#t))this.#c!==""&&this.#l(this.#y);else if(this.#t==="/"&&Y.includes(this.#c))this.#r.tagName||(this.#r=this.#r.parent),this.#b(),this.#l(this.#M);else if(this.#t===">"){if(!this.#c)throw new Error("Expected tag name, found >");this.#r.tagName||(this.#r=this.#r.parent),this.#b(),this.#l(this.#N)}else this.#u==="<"&&this.#t==="/"?(this.#c,this.#d="",this.#l(this.#M)):this.#c+=this.#t}#M(){if(!L(this.#t))if(this.#t===">"){if(this.#r.tagName&&this.#r.tagName!=="-"&&!Y.includes(this.#r.tagName)&&this.#r.tagName!==this.#d)throw new Error(`Expected ${this.#r.tagName} tag to be closed, but ${this.#d} found`);this.#c="",this.#d="",this.#r.tagName?this.#r=this.#r.parent:this.#r=this.#r.parent.parent,this.#l(this.#N)}else this.#d+=this.#t}#_(){this.#t==="<"?(this.#i={},this.#r.attributes.textContent=this.#p,this.#l(this.#F)):(this.#p=this.#g(this.#p,this.#t),this.#r.tagName||(this.#r.attributes.textContent=this.#p))}}class he{#e=[new U];#n;#s;#i=!0;#t=null;#u=[];#o=[];#f;constructor(e,t,n,s=[]){this.#f=e,this.#s=e.document,this.#i=this.#s.baseURI==="",this.#n=t,this.#u=n,this.#o=s}createElement(e,...t){const n=e?this.#s.createElement(e):this.#s.createTextNode("");let s=[],r=0;for(const o of t)if(r+=1,typeof o=="string"){const h=this.#s.createTextNode(this.#E(o));A(h,s)}else if(typeof o=="number"){const h=this.#s.createTextNode(o.toString());A(h,s)}else if(o instanceof this.#f.Node)A(o,s);else if(o instanceof Array){if(o.length===0)continue;let h=!1;for(const c of o)if(c instanceof this.#f.Node){h=!0;break}if(h)H(o,s);else{const c=this.#s.createTextNode(this.#c(o));A(c,s)}}else if(o instanceof Error)n.textContent=this.#E(o.message);else if(o instanceof O){const h=this.#i?o.getElementsSr():o.getElements();for(const c of h)for(const f of c)A(f,s)}else if(o instanceof Function)if(o[B]){const{thisLevel:h,upperLevel:c}=this.#d();o(this);const f=this.#e[h].getElements();H(f,s),this.#a({thisLevel:h,upperLevel:c})}else if(this.#i)n.innerHTML=`(${o.toString()})()`;else if(n instanceof HTMLScriptElement){const h=this.#s.createTextNode(`(${o.toString()})()`);n.appendChild(h)}else if("value"in n&&!(n instanceof HTMLLIElement))this.#b(n,{value:o});else{const h=()=>{this.#O("nest",o,!0,(c,f,a,w)=>{if(c instanceof Function||c instanceof O){if(c instanceof O){const p=this.#i?c.getElementsSr():c.getElements();f?(A(a,s),H(p[0],s),A(w,s)):this.#e[0].addElements(p[0])}else if(B in c)if(c(this),f){const p=this.#e.length-1,S=this.#e[p].getElements();A(a,s),H(S,s),A(w,s)}else s.length=0}else f&&a&&(this.#S(a),this.#b(n,{textContent:c}))})};this.#b(n,{textNode:o},h)}else o instanceof Object&&!(o instanceof Function)&&r===1&&this.#b(n,o);const l=this.#e.length-1;if(s.length>0){const o=this.#e[l].getElements(),h=o.indexOf(s[0]);h>-1&&s.length<o.length-h&&(s=o.slice(h))}return te(n,s),this.#e[l].removeTheseElements(s),this.#e[l].addElement(n),n}for(e,t,n){const s=()=>{const r=xe(e,t,n);r instanceof Error&&console.error(r)};return this.#w("for",null,s)}forEach(e,t){return this.#p(1,e,t)}forState(e,t){return this.#p(2,e,t)}getCreatedElements(){return this.#e[0].getElements()}getHtmlCode(e){let t="";if(this.#i){const n=this.#n;n&&(t=n.paintChildren(e))}return t}html(e,...t){const n=t.length===0&&this.#o.length===0?this.#C(e instanceof Array?e[0]:e):this.#r(e instanceof Array?e:[e],...t);for(const s of n)s.tagName===""&&(s.textContent=this.#E(s.textContent));return n}if(e,t,n){const s=r=>{if(r)if(t instanceof O){const l=this.#i?t.getElementsSr():t.getElements(),o=this.#e.length-1;this.#e[o].addElements(l[0])}else t instanceof Function&&t();else if(n instanceof O){const l=this.#i?n.getElementsSr():n.getElements(),o=this.#e.length-1;this.#e[o].addElements(l[0])}else n instanceof Function&&n()};return e instanceof Function?this.#O("if",e,!0,s):this.#w("if",e,s)}async render(){this.#e=[new U];for(const e of this.#u)if(e instanceof Function){let t=e(this);if(t instanceof Promise&&(t=await t),t&&typeof t=="string")this.html(t);else if(t instanceof O){const n=this.#i?t.useTranslations(this.#o).getElementsSr():t.useTranslations(this.#o).getElements();for(const s of n)this.#e[0].addElements(s)}else if(t instanceof Function)t(this);else if(t instanceof Array){let n=!0,s=!0;for(const r of t){if(!(r instanceof O)){n=!1;break}if(!(r instanceof Function)){s=!1;break}}if(n)for(const r of t){if(!(r instanceof O))break;const l=this.#i?r.getElementsSr():r.getElements();for(const o of l)this.#e[0].addElements(o)}else if(s)for(const r of t){if(!(r instanceof Function))break;r(this)}}}else if(e instanceof O){const t=this.#i?e.useTranslations(this.#o).getElementsSr():e.useTranslations(this.#o).getElements();for(const n of t)this.#e[0].addElements(n)}this.#h()}#a({thisLevel:e,upperLevel:t}){const n=this.#e[e].getElements();return this.#e[t].importElements(this.#e[e]),this.#e[e].removeAllElements(),delete this.#e[e],this.#e.pop(),n}#h(){const e=this.#n;e&&te(e,this.getCreatedElements())}#T(e){return!!this.#o?e.map(n=>this.#E(n)):e}#c(e){return this.#E(re.apply(null,this.#T(e)))}#d(){this.#e.push(new U);const e=this.#e.length-1,t=e-1;return{thisLevel:e,upperLevel:t}}#p(e,t,n){const s=l=>this.#E(l);if(q(t)){const l=(o,h,c)=>{const f=[];let a=h.getElements().length;function w(p){const S=h.getElements(),F=a===0?S:S.slice(a);f.push({key:p,elements:F}),a=S.length}return ne(e,o,n,s,c,w),f};return this.#l("forEach",t,l)}const r=l=>{ne(e,l,n,s)};return t instanceof Function?this.#O("forEach",t,!0,r):this.#w("forEach",t,r)}#C(e){let t=[];if(this.#i){const s=this.#s.createElement("");s.innerHTML=e??"",t=[s]}else{this.#t||(this.#t=this.#s.createElement("template"));const s=this.#t;s.innerHTML=e.trim()??"",t=Array.from(s.content.childNodes),s.innerHTML=""}const n=this.#e.length-1;return this.#e[n].addElements(t),t}#r(e,...t){return new Ie(e,t).generate(this)}#g(e,t){if(!this.#n?.contains(e))return!1;let n=e;for(const s of t)Ae(s,n),n=s;return!0}#m(e){if(e.nodeType!==8)return-1;const n=e.textContent;let s="";if(n)s=n.slice(0,-6)+"-end";else return-1;let r=e.nextSibling,l=0,o=0;for(;r!==null;){if(r.nodeType===8){const c=r.textContent;if(c===n)l+=1;else if(c===s&&(l-=1,l<0))break}const{nextSibling:h}=r;this.#S(r),r.remove(),o+=1,r=h}return o}#b(e,t,n){for(let s in t){let r=t[s];if(this.#i){if(oe(s)&&r instanceof Function){G(e,s,r);continue}}else if(r instanceof Function&&Oe(e,s,r))continue;if(r instanceof Function){const l=r;P(e,s,"",l,null);let o=l(e);if(o instanceof Function&&Object.hasOwn(o,B)||o instanceof O){k(),n&&n();continue}else if(o instanceof Function)o=o();else if(s==="textNode"){k();const h=this.#s.createTextNode(o);e.appendChild(h),pe(e,h,l,{propertyName:"textContent"});continue}k(),o instanceof Array?o=this.#c(o):typeof o=="string"&&(o=this.#E(o)),s&&G(e,s,o)}else e instanceof this.#f.HTMLElement&&s==="style"&&r instanceof Object?this.#x(e,r):e instanceof this.#f.HTMLElement&&s==="data"?r instanceof Object&&De(e,r):s==="textContent"?r instanceof Array?e[s]=this.#c(r):e[s]=this.#E(r):((s==="innerText"||s==="value"&&e.tagName==="INPUT"&&(e.getAttribute("type")??"").toLowerCase()==="button")&&(r=this.#E(r)),G(e,s,r))}}#x(e,t){for(const n in t){const s=t[n];let r="";if(s instanceof Function){const l="style",o=s;P(e,l,n,o,null),r=o(e),k()}else r=s;typeof n=="string"&&(e.style[n]=le(n,r))}}#w(e,t,n){const{thisLevel:s,upperLevel:r}=this.#d();return n(t),this.#a({thisLevel:s,upperLevel:r})}#O(e,t,n,s){const{thisLevel:r,upperLevel:l}=this.#d();if(t instanceof Function){const h=this.#s.createComment(`${e}-begin`),c=this.#s.createComment(`${e}-end`);n&&this.#e[r].addElement(h);const f=S=>{if(this.#i)return;const F=this.#e.length-1;this.#e[F].removeAllElements(),s(S,!1,null,null),this.#g(h,this.#e[F].getElements())||console.error("Element ",h," does not exist anymore")},a=h,w=`--${e}`;P(a,w,"",t,f);const p=t();k(),s(p,!0,h,c),n&&this.#e[r].addElement(c)}else s(t,!1,null,null);return this.#a({thisLevel:r,upperLevel:l})}#l(e,t,n){const{thisLevel:s,upperLevel:r}=this.#d(),l=this.#s.createComment(`${e}-begin`),o=this.#s.createComment(`${e}-end`);this.#e[s].addElement(l);const h=(w,p,S,F)=>{const z=p[j],M=z.target;if(z.subs,M instanceof Object&&!this.#i)if(w===d.DELETE){let u=o.renderedElementsMap.length;for(;u--;){if(!o.renderedElementsMap[u])continue;const g=M instanceof Array;if(o.renderedElementsMap[u].key===S){for(const E of o.renderedElementsMap[u].elements){if(x in E){const T=E[x];let N=T.length;for(;N--;)T[N]&&T[N].stateSubscription.unsubscribe(E);delete E[x]}E.remove()}g?(o.renderedElementsMap[u].elements.length=0,delete o.renderedElementsMap[u]):o.renderedElementsMap=Me(o.renderedElementsMap,u);break}}}else if(w===d.CREATE){let u=null;const g=M instanceof Map||M instanceof Set?M.keys():Object.keys(M);for(let C of g){if(C===S)break;u=C}let E=l;if(u!==null){for(const C of o.renderedElementsMap)if(C&&C.key===u){const{elements:_}=C;E=_.length>0?_[_.length-1]:E;break}}let T=!1;l.parentElement&&(this.#e.push(new U),T=!0);const N=this.#e.length-1,R=n(p,this.#e[N],S),m=M instanceof Array;for(const C of R){m?o.renderedElementsMap[S]=C:o.renderedElementsMap.push(C);for(const _ of C.elements)N===0&&this.#e[N].moveElementAfterAnother(_,E),E.after(_),E=_}T&&this.#e.pop()}else if(w===d.SPLICE){if(M instanceof Array){let[u,g,...E]=F;if(g===1/0?g=M.length-u:g<0&&(g=0),g>0)for(let m=u,C=u+g;m<C;m++)h(d.DELETE,p,m.toString(),void 0),delete o.renderedElementsMap[m];const T=o.renderedElementsMap.length,N=M.length,R=N-T;if(R>0){o.renderedElementsMap.length=N;for(let m=N-1;m>=u+E.length;m--){const C=m-R;if(C<0)break;o.renderedElementsMap[m]=o.renderedElementsMap[C],o.renderedElementsMap[m].key=m.toString(),delete o.renderedElementsMap[C]}}else if(R<0){o.renderedElementsMap.splice(u,g);for(let m=N-1;m>=u+E.length;m--)o.renderedElementsMap[m].key=m.toString()}if(E.length>0)for(let m=u;m<u+E.length;m++)h(d.CREATE,p,m.toString(),void 0)}o.renderedElementsMap.length=M.length}else if(w===d.SWAP){const[u,g]=F,E=o.renderedElementsMap[g].elements;o.renderedElementsMap[g].elements=o.renderedElementsMap[u].elements,o.renderedElementsMap[u].elements=E;for(let T=1;T<o.renderedElementsMap.length;T++)Le(...o.renderedElementsMap[T-1].elements,...o.renderedElementsMap[T].elements)}else if(w===d.COPY_WIHTIN){let[u,g,E]=F;for(let T=g,N=u;T<E;T++,N++)h(d.DELETE,p,N.toString(),void 0),h(d.CREATE,p,N.toString(),void 0)}else if(w===d.SORT)for(let u=0,g=M.length;u<g;u++)h(d.DELETE,p,u.toString(),void 0),h(d.CREATE,p,u.toString(),void 0);else w===d.UPDATE&&(h(d.DELETE,p,S,void 0),h(d.CREATE,p,S,void 0))},c=`-s-${e}`;P(o,c,"",()=>t,h);const a=n(t,this.#e[s]);return o.renderedElementsMap=a,k(),this.#e[s].addElement(o),this.#a({thisLevel:s,upperLevel:r})}#E(e){if(typeof e=="string"){const t=this.#y(e,this.#o);if(typeof t=="string")return t;const n=ye(),s=this.#y(e,n?.paintorTranslations);if(typeof s=="string")return s}return e}#y(e,t){if(t instanceof Array&&t.length>0){for(const n of t)if(e in n)return n[e]}return!1}#S(e){ge(e)&&Object.assign(e,{"--deleted":!0});let t=e.childNodes.length;for(;t--;)this.#S(e.childNodes[t])}}function ke(...i){const e=this;return function(...n){return e.call(this,...i,...n)}}const{prototype:K}=he;Object.assign(K.createElement,{bindArgs:ke});_e.forEach(i=>{K[i]=K.createElement.bindArgs(i)});const ve=Object.freeze(["async","autofocus","autoplay","checked","contenteditable","controls","default","defer","disabled","formNoValidate","frameborder","hidden","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","readonly","required","reversed","scoped","selected","typemustmatch"]),je=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]),b=Object.freeze({ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11});class V extends Error{constructor(e,t){super(e),this.name=t??"DOMException"}}class D{nextSibling=null;previousSibling=null;textContent="";#e=[];#n="";#s=1;#i=null;constructor(e,t){this.#s=e,this.#n=t}get baseURI(){return""}get childNodes(){return this.#e}get firstChild(){return this.#e[0]??null}get nodeName(){return this.#n}get nodeType(){return this.#s}get parentNode(){return this.#i}set parentNode(e){this.#i=e}appendChild(e){if(this.nodeType!==b.DOCUMENT_NODE&&this.nodeType!==b.DOCUMENT_FRAGMENT_NODE&&this.nodeType!==b.ELEMENT_NODE)throw new V("This node type does not support this method.");if(this.nodeType===b.DOCUMENT_NODE)throw new V("Failed to execute 'appendChild' on 'Node': Only one element on document allowed.");if(!(e instanceof D)){const n="Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.";throw new TypeError(n)}if(this.#e.includes(e))return;if(e===this)throw new V("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");this.#e.push(e),e.parentNode=this;const t=this.#e.length-2;t>=0&&(this.#e[t].nextSibling=e,e.previousSibling=this.#e[t]??null)}contains(){return!1}insertBefore(e,t){const n=[];for(const s of this.#e)s===t&&n.push(e),n.push(s);return this.#e=n,e}removeChild(e){if(!e)throw new Error("Failed to execute 'removeChild' on 'HTMLElement': parameter 1 is not of type 'HTMLElement'.");if(!this.#e.includes(e))throw new Error("Failed to execute 'removeChild' on 'HTMLElement': The node to be removed is not a child of this node.");return this.#e=this.#e.filter(t=>t!==e),e}paintChildren({indent:e=""}){let t="",n=0;for(const s of this.childNodes){n+=1;const r=n>1;t+=fe(s,e,"",r)}return t}}class Q extends D{constructor(){super(b.COMMENT_NODE,"#comment")}}class Z extends D{constructor(){super(b.TEXT_NODE,"#text")}}function ce(i){let e=i;const t={"&":"&amp;","<":"&lt;",">":"&gt;"};return e=e.replace(/[&<>"]/g,n=>{let s=n;return n in t&&(s=t[n]),s}),e}function Re(i){let e="";for(const t of i){const{name:n}=t;let{value:s}=t;ve.includes(n)?s!==!1&&s!==0&&s!==void 0&&s!==null&&(e+=` ${n}`):(s instanceof Array?s=s.join(","):s===!0?s="true":s===!1?s="false":s===void 0?s="undefined":s===null?s="null":s instanceof Function?s=`return(${s.toString()}).call(this,window.event)`:s=s.toString(),s=s.replace(/\"/g,'\\"'),s=ce(s),e+=` ${n}="${s}"`)}return e}function $e(i){let e="";return e=i.replace(/([A-Z])/g,(t,n)=>`-${n.toLowerCase()}`),e}function Pe(i){let e="";for(const t in i){const n=i[t];e+=`${$e(t)}:${n};`}return e.trim()}function fe(i,e,t,n=!1){let s="",r="",l="";if(e&&(r=t,l=`
`),i instanceof Q)s+=`${l}${r}<!--${i.textContent}-->`;else if(i instanceof Z)s+=`${l}${r}${i.textContent}`;else if(i instanceof v){const o=je.includes(i.tagName),h=Re(i.attributes);let c="";Object.keys(i.style).length>0&&(c=` style="${Pe(i.style)}"`),n&&(s+=l),s+=r,i.tagName&&(s+=`<${i.tagName.toLowerCase()}${h}${c}`,s+=o?"":">"),s+=i.textContent;let f="";for(const a of i.childNodes)f+=fe(a,e,t+e,!0);f&&(s+=f+l+r),i.tagName!==""&&(s+=o?"/>":`</${i.tagName.toLowerCase()}>`)}return s}class W extends D{#e=[];#n="";constructor(e,t){super(e,t.toUpperCase()),this.#n=t.toUpperCase()}get attributes(){return this.#e}get children(){return this.childNodes.filter(e=>e instanceof W)}get className(){let e="";for(const t of this.#e)if(t.name==="class"){e=t.value;break}return e}set className(e){this.setAttribute("class",e)}get innerHTML(){return this.textContent}set innerHTML(e){this.textContent=e}get tagName(){return this.#n}append(e){e instanceof D?this.appendChild(e):this.textContent=ce(e.toString())}getAttribute(e){let t="";if(t=e.trim().toLowerCase(),!t)return null;const n=this.#e.findIndex(s=>s.name===t);return n===-1?null:this.#e[n].value}remove(){this.parentNode?.removeChild(this)}setAttribute(e,t){let n="";if(n=e.trim().toLowerCase(),!n)return;const s=t,r=this.#e.findIndex(l=>l.name===n);r===-1?this.#e.push({name:n,value:s}):this.#e[r]={name:n,value:s}}}function He(i){let e=i;const t={"&":"&amp;","<":"&lt;",">":"&gt;"};return e=e.replace(/[&<>"]/g,n=>{let s=n;return n in t&&(s=t[n]),s}),e}function Ue(i){const e=i.split("-");return e.length===1?e[0]:e[0]+e.slice(1).map(t=>t[0].toUpperCase()+t.slice(1)).join("")}function Be(i){const e={};return i.split(";").forEach(t=>{const[n,s]=t.split(":");if(!n)return;const r=Ue(n.trim());e[r]=s.trim()}),e}let v=class extends W{#e={};constructor(e){super(b.ELEMENT_NODE,e)}get innerText(){return this.textContent}set innerText(e){this.textContent=He(e.toString())}get style(){return this.#e}set style(e){if(typeof e=="string"){const t=Be(e);for(const n in t)this.#e[n]=t[n].toString()}}},ae=class extends D{constructor(){super(b.DOCUMENT_FRAGMENT_NODE,"#document-fragment")}};class Ge extends D{ELEMENT_NODE=b.ELEMENT_NODE;ATTRIBUTE_NODE=b.ATTRIBUTE_NODE;TEXT_NODE=b.TEXT_NODE;CDATA_SECTION_NODE=b.CDATA_SECTION_NODE;PROCESSING_INSTRUCTION_NODE=b.PROCESSING_INSTRUCTION_NODE;COMMENT_NODE=b.COMMENT_NODE;DOCUMENT_NODE=b.DOCUMENT_NODE;DOCUMENT_TYPE_NODE=b.DOCUMENT_TYPE_NODE;DOCUMENT_FRAGMENT_NODE=b.DOCUMENT_FRAGMENT_NODE;#e;#n=[];constructor(){super(9,"#document");const e=new v("html"),t=new v("head"),n=new v("body");e.appendChild(t),e.appendChild(n),this.#n.push(e),this.#e=n}get body(){return this.#e}get children(){return this.#n}get parentElement(){return null}createDocumentFragment(){return new ae}createComment(e=""){const t=new Q;return t.textContent=e,t}createElement(e){return new v(e)}createTextNode(e){const t=new Z;return t.textContent=e,t}}class Ve{Comment=Q;DocumentFragment=ae;Element=W;HTMLElement=v;Node=D;Text=Z;DOMException=V;Error=Error;TypeError=TypeError;document;constructor(){this.document=new Ge}}const We=I(),ze=new Ve;class O{state=null;#e=[];#n=[];#s="";#i=!1;#t=!1;#u="";#o="";#f=new Map;#a=[];#h=[];getElements(){return this.#g(null,window,!0),this.#n}getElementsSr(){const e=this.#c();return this.#g("",e,!0),this.#n}html(e){if(this.#i)return this.staticHtml(e);const t=this.#c();return this.#g("",t,!0,e),this.#s}paint(e){if(!We)throw new Error("You can only use this function in browser environment");if(!e)throw new Error("No container selected.");if(typeof e!="string"&&!(e instanceof HTMLElement)&&!(e instanceof NodeList)&&!(e instanceof Array)&&!(e instanceof HTMLCollection))throw new Error(`Wrong type for the container element. Expected <string> or <Node>, got <${typeof e}>`);this.#g(e,window,!0)}static(e=!0){return this.#i=e,this}staticHtml(e){const t=this.#h[0]??null;if(!this.#f.has(t)){const n=this.#c();this.#g("",n,!0,e),this.#f.set(t,this.#s)}return this.#f.get(t)??""}template(e){}useTemplates(...e){if(e instanceof Array)for(const t of e)if(t instanceof Array)for(const n of t)this.#a.push(n);else this.#a.push(t);return this}useTranslations(...e){return e.map(t=>{t instanceof Array?t.forEach(n=>{this.#h.includes(n)||(this.#h=[...this.#h,n])}):t instanceof Object&&(this.#h.includes(t)||(this.#h=[...this.#h,t]))}),this}#T(){if(this.#e)for(const e of this.#e)for(;e?.firstChild;)e.removeChild(e.firstChild)}#c(){return ze}#d(e,t,n,s){return this.#n.length=0,this.#s="",this.#p(e,t),this.#r(n),this.#C(s),!0}#p(e,t){const n=t.document.baseURI==="";if(typeof e=="string"){if(this.#u=e,this.#t=!1,Te(e))this.#t=!0;else if(Ne(e)||(this.#o=e),this.#e=n?[t.document.createElement("#container")]:t.document.querySelectorAll(e),!this.#e)throw new Error(`Could not find an element by the following query: ${e}`)}else if(e instanceof HTMLElement)this.#e=[e];else if(e instanceof NodeList||e instanceof HTMLCollection)this.#e=e;else if(e instanceof Array){for(const s of e)if(!(s instanceof HTMLElement))throw new Error("All elements in the input array must be DOM elements");this.#e=e}return!0}#C(e){this.template instanceof Function&&(this.state=this.state?X(this.state):this.state,this.#a.push(this.template.bind(this)));for(let t of e)if(!(t instanceof Function)&&!(t instanceof O))throw new Error("The template must be a function");return!0}#r(e){if(!(e instanceof Array))throw new Error("The argument 'translations' must be an Array");return this.#h=e,!0}#g(e,t,n=!0,s={}){this.#d(e,t,this.#h,this.#a),n&&this.#T();const r=this.#a,l=this.#h;if(!t)throw new Error("Missing window element");if(this.#t){const o=h=>class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){if(!this.shadowRoot)throw new Error("Missing shadow root");h.#m(t,this.shadowRoot,r,l,s)}};customElements.define(this.#u,o(this))}else if(this.#o&&new MutationObserver(h=>{for(const c of h){const f=c.addedNodes;for(let a of f)a instanceof HTMLElement&&a.matches(this.#o)&&this.#m(t,a,r,l,s)}}).observe(document.body,{attributes:!1,childList:!0,characterData:!1,subtree:!0}),this.#e.length===0)this.#m(t,null,r,l,s);else for(const o of this.#e)this.#m(t,o,r,l,s)}#m(e,t,n,s,r={}){const l=new he(e,t,n,s);l.render(),this.#s=l.getHtmlCode(r),this.#n.push(l.getCreatedElements())}}const Ye="modulepreload",qe=function(i){return"/"+i},se={},ie=function(e,t,n){return e()},Ke=function(){let i="en";return I()&&(i=document.getElementById("html")?.getAttribute("lang")??i),i},Xe=async function(i,e){if(typeof i!="string")throw new Error("Translation path must be a string");let t=null;const n=i.match(/^(.*?)([^.\/\\]+)(.\w+)$/m);if(n===null)throw new TypeError(`Incorrect path: ${i}`);const s=n[1]+e+n[3];try{t=(await ie(()=>import(s),void 0)).default}catch{s!==i&&(t=(await ie(()=>import(i),void 0)).default)}if(!(t instanceof Object))throw new TypeError(`Translation at ${s} must export an object`);return t},ue=async function(...i){const e=Ke(),t=[];for(let n of i)t.push(Xe(n,e));return Promise.all(t)};function de(...i){return new O().useTemplates(...i)}function me(i){return i[B]=!0,i}const Ee={component:de,state:X,template:me,fetchTranslations:ue,Component:O};exports.Component=O;exports.component=de;exports.default=Ee;exports.fetchTranslations=ue;exports.paintor=Ee;exports.state=X;exports.template=me;
//# sourceMappingURL=paintor.cjs.js.map
