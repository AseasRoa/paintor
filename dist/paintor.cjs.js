"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const U=Symbol("symStateId"),R=Symbol("symArrayAccess"),I=Symbol("symObjectAccess"),_=Symbol("symTemplateFunction");let d={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null};function F(i,t,e,s,n){d.element=i,d.propertyName=t,d.subPropertyName=e,d.bindFunction=s,d.statementRepaintFunction=n}function D(){d={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null}}class ft{#t=new Map;#n={};subscribe(t,e,s,n,r,h,o){(n==="-s-if"||n==="-s-forEach")&&(e=n),this.#t.has(e)||this.#t.set(e,[]);const l=this.#t.get(e)??[];for(const c of l)if(c.element===s&&c.propertyName===n&&c.subPropertyName===r&&c.bindFunction===h&&c.statementRepaintFunction===o)return;l.push({element:s,propertyName:n,subPropertyName:r,bindFunction:h,statementRepaintFunction:o}),Object.assign(s,{"--subscribed":!0})}unsubscribe(t){this.#t.forEach((e,s)=>{this.#t.set(s,e.filter(n=>n.element!==t))})}createProxy(t,e=""){const s=this.#f(),n=new Proxy(t,s);for(const r in n){if(!(n[r]instanceof Object))continue;const h=e===""?r:`${e}.${r}`;n[r]=this.createProxy(n[r],h)}return this.#n=n,n}#s(t){const e=this.#t.get("-s-forEach");e&&e.forEach(s=>{const{statementRepaintFunction:n}=s;n instanceof Function&&n(t)})}#i(t,e){const s=this.#t.get("-s-forEach");s&&s.forEach(n=>{const{statementRepaintFunction:r}=n;r instanceof Function&&r(t)})}#e(t,e){this.#i(t,e)}#u(t,e){this.#t.has(e)&&(this.#t.get(e)??[]).forEach(n=>{const{element:r,propertyName:h,subPropertyName:o,bindFunction:l,statementRepaintFunction:c}=n;if(Object.hasOwn(r,"--deleted")){this.unsubscribe(r);return}let a=l.call(r,r);h==="style"&&o?r.style[o]=et(o,a):h==="--if"||h==="--for"||h==="--nest"?c instanceof Function&&c(a):(a instanceof Function&&(a=a()),v(r,h,a))})}#o(t,e){this.#i(t,e)}#f(){const t={};return t.get=(e,s,n)=>{if(Object.hasOwn(e,s)||s===I||s===R)d.element&&d.bindFunction&&this.subscribe(e,s,d.element,d.propertyName,d.subPropertyName,d.bindFunction,d.statementRepaintFunction);else if((e instanceof Map||e instanceof Set)&&e[s]instanceof Function){const r=e[s];return(...o)=>{const l=r.apply(e,o);return e instanceof Set?s==="add"?this.#e(n,s):s==="delete"&&this.#o(n,s):e instanceof Map&&(s==="set"?this.#e(n,s):s==="delete"&&this.#o(n,s)),l}}return e[s]},t.set=(e,s,n,r)=>(typeof s=="symbol"&&(s===R||s===I||s===U)||e instanceof Array&&s==="length"?e[s]=n:Object.hasOwn(e,s)?(e[s]=n,this.#u(r,s)):(e[s]=n,this.#e(r,s)),!0),t.deleteProperty=(e,s)=>(delete e[s],this.#o(e,s),!0),t}}let K=0;const B=function(t){if(!(t instanceof Object))throw new Error("state() only accepts Object, Array, Set or Map as input value.");const s=new ft().createProxy(t);return K+=1,s[U]=K,s},Q=function(i){return i instanceof Object&&U in i};function ut(){return typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global||this}function Z(i,...t){const e=/(%?)(%([ojdsif]))/g;if(t.length>0){const s=(n,r,h,o)=>{let l=t.shift(),c="";switch(o){case"o":Array.isArray(l)&&(c=JSON.stringify(l));break;case"s":c=""+l;break;case"d":c=""+Number(l);break;case"j":c=JSON.stringify(l);break;case"i":c=""+parseInt(""+l,10);break;case"f":c=""+parseFloat(""+l);break}return r?(t.unshift(c),n):c};i=i.replace(e,s)}return t.length>0&&(i+=" "+t.join(" ")),i=i.replace(/%{2,2}/g,"%"),""+i}function w(){if(w.isIt===void 0){const i=new Function("try {return this===window;}catch(e){ return false;}");w.isIt=i()}return w.isIt??!1}w.isIt=void 0;function g(i,t){return t.push(i),t}function x(i,t){for(const e of i)t.push(e);return t}function tt(i){return i.toLowerCase().indexOf("on")===0}function T(i){return i===" "||i==="	"||i==="\r"||i===`
`}function mt(i){return/^[a-z][a-z0-9-]+$/.test(i)&&i.includes("-")}function dt(i){return/#[a-z0-9-]+\s*$/.test(i)}function Et(i){if(i==="true")return!0;if(i==="false")return!1;const t=parseInt(i);return isNaN(t)?!!i:!!t}function pt(i,t,e){if(!(i instanceof window.Node)||typeof t!="string"||typeof e!="function"||tt(t)===!1)return!1;const s=t.toLowerCase().substring(2);return i.addEventListener(s,e),!0}function gt(i,t){if(t.length===1)i.appendChild(t[0]);else if(t.length>1){const e=new DocumentFragment;for(const s of t)s&&e.append(s);i.appendChild(e)}}function bt(i,t){for(const e of t)e&&i.appendChild(e)}function W(i,t){i&&(w()&&i instanceof window.Node?gt(i,t):bt(i,t))}function X(i,t,e,s,n,r){if(!(t instanceof Object)&&!(t instanceof Array)&&!(t instanceof Map)&&!(t instanceof Set))throw new TypeError('"data" argument should be an Object or an Array');if(!(e instanceof Function))throw new TypeError('"handler" argument should be a Function');const h=i===2&&Q(t);if(t instanceof Map||t instanceof Set){h&&t[I];for(const[o,l]of t.entries()){if(n!==void 0&&n!==o)continue;let c=h?()=>l:l;s&&(c=s?.(c));const a=e(c,o);if(r?.(o),a===!1)break}}else if(t instanceof Array){h&&t[R];for(let o=0;o<t.length;o++){if(n!==void 0&&n!==o)continue;let l=h?()=>t[o]:t[o];s&&(l=s?.(l));const c=e(l,o);if(r?.(o),c===!1)break}}else if(t instanceof Object){h&&t[I];for(const o in t){if(n!==void 0&&n!==o)continue;let l=h?()=>t[o]:t[o];s&&(l=s?.(l));const c=e(l,o);if(r?.(o),c===!1)break}}return!0}function yt(i,t,e){if(typeof i!="number"||typeof t!="number")return new Error('"start" and "end" arguments should be numbers');if(!(e instanceof Function))return new Error('"handler" argument should be a Function');if(t>=i)for(let s=i;s<=t&&e(s)!==!1;s++);else for(let s=i;s>=t&&e(s)!==!1;s--);return!0}function Tt(i,t){return i.filter(function(e,s){return s!==t})}function Nt(i,t){if(!t)return;const{nextSibling:e,parentNode:s}=t;s&&s.insertBefore(i,e)}function Ct(i,t){if(t instanceof Object)for(const e in t){const s=t[e].toString();i.setAttribute(`data-${e}`,s)}}function v(i,t,e){t in i?e instanceof Array?i[t]=Z.apply(null,e):i[t]=e:"setAttribute"in i&&i.setAttribute(t,e)}function et(i,t){let e=t;return(i==="visibility"||i==="backfaceVisibility")&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"visible":"hidden"),i==="display"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"":"none"),i==="flex"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?1:0),e}function wt(i,t){return i instanceof Map||i instanceof Set?i.has(t):t in i}function Ot(i,t,e){if(e>=i.length){let s=e-i.length+1;for(;s--;)i.push(void 0)}return i.splice(e,0,i.splice(t,1)[0]),i}class L{elements=[];addElement(t){t&&this.elements.push(t)}addElements(t){for(let e of t)this.elements.push(e)}getElements(){return this.elements}hasElement(t){return this.elements.indexOf(t)>-1}importElements(t){const e=t.getElements();for(const s of e)this.addElement(s)}moveElementAfterAnother(t,e){const s=this.elements.indexOf(t),n=this.elements.indexOf(e);if(s===-1||n===-1)throw new Error("Cannot move one element after another, because one element is missing");n-s!==1&&(this.elements=Ot(this.elements,s,n+1))}removeAllElements(){this.elements=[]}removeTheseElements(t){t.length>0&&(this.elements=this.elements.filter(e=>!t.includes(e)))}}const St=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];class G{tagName="-";parent=this;children=[];attributes={};newChild(t,e){const s=new G;return s.parent=t,s.attributes=e,this.children.push(s),s}}const H=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]);class xt{#t="";#n="";#s="";#i={};#e;#u;#o=[];#f=this.#N;#a="";#h="";#T={};#c="";#m="";#p="";#C=new G;#r=this.#C;constructor(t,e){this.#o=this.#x(t,e),this.#O()}generate(t){if(this.#c||this.#m)throw new Error("Some HTML tag is not closed");return this.#d(t,this.#C)}#g(t,e){return typeof t=="function"?typeof e=="function"?e:t:typeof t=="string"&&(typeof e=="string"||typeof e=="number"||typeof e=="boolean")?t+e.toString():e}#d(t,e){const s=[];for(const n of e.children){let r=null;n.tagName==="if"?r=t.if(Et(n.attributes?.condition??""),()=>this.#d(t,n)):n.tagName==="for"?"iterations"in n.attributes?r=t.for(0,parseInt(n.attributes?.iterations??0)-1,(h,o)=>{this.#d(t,n)}):("from"in n.attributes||"to"in n.attributes)&&(r=t.for(parseInt(n.attributes?.from??0),parseInt(n.attributes?.to??0),(h,o)=>{this.#d(t,n)})):n.tagName==="forEach"?"object"in n.attributes&&(r=t.forEach(n.attributes?.object??{},(h,o)=>{this.#d(t,n)})):(r=t.createElement(n.tagName,n.attributes,this.#d(t,n)),s.push(r))}return s}#b(){const t=this.#r,e=this.#i;Object.keys(this.#T).length>0&&(e.style=this.#T);const s=this.#r.newChild(t,e);s.tagName=this.#c,this.#r=s}#x(t,e=[]){const s=[];for(let n=0;n<t.length;n++)t[n]&&s.push(t[n]),e[n]!==void 0&&s.push(e[n]);return s}#O(){for(let t=0;t<this.#o.length;t++)if(typeof this.#o[t]=="string")for(let e=0;e<this.#o[t].length;e++)this.#e=this.#o[t][e],this.#u=this.#o[t][e-1],this.#f();else this.#e=this.#o[t],this.#u=void 0,this.#f()}#w(t,e){t&&(this.#i[t]=typeof e=="string"?e.trim():e)}#l(t){t===this.#y&&(this.#t="",this.#s="",this.#n=""),this.#f=t}#E(t,e){t&&(this.#T[t]=typeof e=="string"?e.trim():e)}#y(){T(this.#e)||(this.#e==="/"?(H.includes(this.#c)&&this.#b(),this.#l(this.#M)):this.#e===">"?(this.#b(),this.#l(this.#N)):this.#e==="="?this.#l(this.#S):this.#t+=this.#e)}#S(){T(this.#e)||(this.#e==="'"||this.#e==='"'?(this.#n=this.#e,this.#l(this.#t==="style"?this.#F:this.#A)):(this.#n=" ",this.#s=this.#g(this.#s,this.#e),this.#l(this.#A)))}#A(){this.#e===">"&&this.#u!=="/"?(this.#n&&this.#t&&this.#s&&this.#w(this.#t,this.#s),this.#t="",this.#s="",this.#n="",this.#l(this.#N),this.#b()):this.#e===this.#n||this.#n===" "&&T(this.#e)?(this.#w(this.#t,this.#s),this.#l(this.#y)):this.#s+=this.#e}#N(){T(this.#e)||(this.#e==="<"?(this.#c="",this.#i={},this.#l(this.#D)):(this.#u===" "?this.#p=this.#u+this.#e:this.#p=this.#e,this.#c="",this.#i={},this.#b(),this.#l(this.#_)))}#F(){T(this.#e)||(this.#e===">"?this.#l(this.#N):this.#e===this.#n||this.#n===" "&&T(this.#e)?this.#l(this.#y):this.#e===":"?this.#l(this.#L):this.#a+=this.#e)}#L(){this.#e===">"?this.#l(this.#N):this.#e===";"?(this.#E(this.#a,this.#h),this.#a="",this.#h="",this.#l(this.#F)):this.#e===this.#n?(this.#E(this.#a,this.#h),this.#a="",this.#h="",this.#l(this.#y)):this.#h=this.#g(this.#h,this.#e)}#D(){if(T(this.#e))this.#c!==""&&this.#l(this.#y);else if(this.#e==="/"&&H.includes(this.#c))this.#r.tagName||(this.#r=this.#r.parent),this.#b(),this.#l(this.#M);else if(this.#e===">"){if(!this.#c)throw new Error("Expected tag name, found >");this.#r.tagName||(this.#r=this.#r.parent),this.#b(),this.#l(this.#N)}else this.#u==="<"&&this.#e==="/"?(this.#c,this.#m="",this.#l(this.#M)):this.#c+=this.#e}#M(){if(!T(this.#e))if(this.#e===">"){if(this.#r.tagName&&this.#r.tagName!=="-"&&!H.includes(this.#r.tagName)&&this.#r.tagName!==this.#m)throw new Error(`Expected ${this.#r.tagName} tag to be closed, but ${this.#m} found`);this.#c="",this.#m="",this.#r.tagName?this.#r=this.#r.parent:this.#r=this.#r.parent.parent,this.#l(this.#N)}else this.#m+=this.#e}#_(){this.#e==="<"?(this.#i={},this.#r.attributes.textContent=this.#p,this.#l(this.#D)):(this.#p=this.#g(this.#p,this.#e),this.#r.tagName||(this.#r.attributes.textContent=this.#p))}}class st{#t=[new L];#n;#s;#i=!0;#e=null;#u=[];#o=[];#f;constructor(t,e,s,n=[]){this.#f=t,this.#s=t.document,this.#i=this.#s.baseURI==="",this.#n=e,this.#u=s,this.#o=n}createElement(t,...e){const s=t?this.#s.createElement(t):this.#s.createTextNode("");let n=[],r=0;for(const o of e)if(r+=1,typeof o=="string"){const l=this.#s.createTextNode(this.#E(o));n=g(l,n)}else if(typeof o=="number"){const l=this.#s.createTextNode(o.toString());n=g(l,n)}else if(o instanceof this.#f.Node)n=g(o,n);else if(o instanceof Array){if(o.length===0)continue;let l=!1;for(const c of o)if(c instanceof this.#f.Node){l=!0;break}if(l)n=x(o,n);else{const c=this.#s.createTextNode(this.#c(o));n=g(c,n)}}else if(o instanceof Error)s.textContent=this.#E(o.message);else if(o instanceof m){const l=this.#i?o.getElementsSr():o.getElements();for(const c of l)for(const a of c)n=g(a,n)}else if(o instanceof Function)if(o[_]){const{thisLevel:l,upperLevel:c}=this.#m();o(this);const a=this.#t[l].getElements();n=x(a,n),this.#a({thisLevel:l,upperLevel:c})}else if(this.#i)s.innerHTML=`(${o.toString()})()`;else if(s instanceof HTMLScriptElement){const l=this.#s.createTextNode(`(${o.toString()})()`);s.appendChild(l)}else"value"in s&&!(s instanceof HTMLLIElement)?this.#b(s,{value:o}):this.#w("nest",o,!1,(l,c,a,f)=>{if(l instanceof Function||l instanceof m){if(l instanceof m){const E=this.#i?l.getElementsSr():l.getElements();c?(g(a,n),n=x(E[0],n),g(f,n)):this.#t[0].addElements(E[0])}else if(_ in l)if(l(this),c){const E=this.#t.length-1,p=this.#t[E].getElements();g(a,n),x(p,n),g(f,n)}else n=[]}else c&&a&&(this.#S(a),this.#b(s,{textContent:o}))});else o instanceof Object&&!(o instanceof Function)&&r===1&&this.#b(s,o);const h=this.#t.length-1;if(n.length>0){const o=this.#t[h].getElements(),l=o.indexOf(n[0]);l>-1&&n.length<o.length-l&&(n=o.slice(l))}return W(s,n),this.#t[h].removeTheseElements(n),this.#t[h].addElement(s),s}for(t,e,s){const n=()=>{const r=yt(t,e,s);r instanceof Error&&console.error(r)};return this.#O("for",null,n)}forEach(t,e){return this.#p(1,t,e)}forState(t,e){return this.#p(2,t,e)}getCreatedElements(){return this.#t[0].getElements()}getHtmlCode(t){let e="";if(this.#i){const s=this.#n;s&&(e=s.paintChildren(t))}return e}html(t,...e){const s=e.length===0&&this.#o.length===0?this.#C(t instanceof Array?t[0]:t):this.#r(t instanceof Array?t:[t],...e);for(const n of s)n.tagName===""&&(n.textContent=this.#E(n.textContent));return s}if(t,e,s){const n=r=>{if(r)if(e instanceof m){const h=this.#i?e.getElementsSr():e.getElements(),o=this.#t.length-1;this.#t[o].addElements(h[0])}else e instanceof Function&&e();else if(s instanceof m){const h=this.#i?s.getElementsSr():s.getElements(),o=this.#t.length-1;this.#t[o].addElements(h[0])}else s instanceof Function&&s()};return t instanceof Function?this.#w("if",t,!0,n):this.#O("if",t,n)}async render(){this.#t=[new L];for(const t of this.#u)if(t instanceof Function){let e=t(this);if(e instanceof Promise&&(e=await e),e&&typeof e=="string")this.html(e);else if(e instanceof m){const s=this.#i?e.useTranslations(this.#o).getElementsSr():e.useTranslations(this.#o).getElements();for(const n of s)this.#t[0].addElements(n)}else if(e instanceof Function)e(this);else if(e instanceof Array){let s=!0,n=!0;for(const r of e){if(!(r instanceof m)){s=!1;break}if(!(r instanceof Function)){n=!1;break}}if(s)for(const r of e){if(!(r instanceof m))break;const h=this.#i?r.getElementsSr():r.getElements();for(const o of h)this.#t[0].addElements(o)}else if(n)for(const r of e){if(!(r instanceof Function))break;r(this)}}}else if(t instanceof m){const e=this.#i?t.useTranslations(this.#o).getElementsSr():t.useTranslations(this.#o).getElements();for(const s of e)this.#t[0].addElements(s)}this.#h()}#a({thisLevel:t,upperLevel:e}){const s=this.#t[t].getElements();return this.#t[e].importElements(this.#t[t]),this.#t[t].removeAllElements(),delete this.#t[t],this.#t.pop(),s}#h(){const t=this.#n;t&&W(t,this.getCreatedElements())}#T(t){return!!this.#o?t.map(s=>this.#E(s)):t}#c(t){return this.#E(Z.apply(null,this.#T(t)))}#m(){this.#t.push(new L);const t=this.#t.length-1,e=t-1;return{thisLevel:t,upperLevel:e}}#p(t,e,s){const n=h=>this.#E(h);if(Q(e)){const h=(o,l,c)=>{const a=[];let f=l.getElements().length;return X(t,o,s,n,c,p=>{const y=l.getElements(),O=y.slice(f);a.push({key:p,elements:O}),f=y.length}),a};return this.#l("forEach",e,h)}const r=h=>{X(t,h,s,n)};return e instanceof Function?this.#w("forEach",e,!0,r):this.#O("forEach",e,r)}#C(t){let e=[];if(this.#i){const n=this.#s.createElement("");n.innerHTML=t??"",e=[n]}else{this.#e||(this.#e=this.#s.createElement("template"));const n=this.#e;n.innerHTML=t.trim()??"",e=Array.from(n.content.childNodes),n.innerHTML=""}const s=this.#t.length-1;return this.#t[s].addElements(e),e}#r(t,...e){return new xt(t,e).generate(this)}#g(t,e){if(!this.#n?.contains(t))return!1;let s=t;for(const n of e)Nt(n,s),s=n;return!0}#d(t){if(t.nodeType!==8)return-1;const s=t.textContent;let n="";if(s)n=s.slice(0,-6)+"-end";else return-1;let r=t.nextSibling,h=0,o=0;for(;r!==null;){if(r.nodeType===8){const c=r.textContent;if(c===s)h+=1;else if(c===n&&(h-=1,h<0))break}const{nextSibling:l}=r;this.#S(r),r.remove(),o+=1,r=l}return o}#b(t,e,s){for(let n in e){let r=e[n];if(this.#i){if(tt(n)&&r instanceof Function){v(t,n,r);continue}}else if(r instanceof Function&&pt(t,n,r))continue;if(r instanceof Function){const h=r;F(t,n,"",h,null);let o=h(t);if(o instanceof m){const l=this.#i?o.getElementsSr():o.getElements();x(l[0],s??[]),n=""}else if(o instanceof Function&&o[_]){const{thisLevel:l,upperLevel:c}=this.#m();o(this);const a=this.#t[l].getElements();x(a,s??[]),this.#a({thisLevel:l,upperLevel:c}),n=""}else if(o instanceof Function)o=o();else{const l=this.#s.createTextNode((o??"").toString());t.appendChild(l)}D(),o instanceof Array?o=this.#c(o):typeof o=="string"&&(o=this.#E(o)),n&&v(t,n,o)}else t instanceof this.#f.HTMLElement&&n==="style"&&r instanceof Object?this.#x(t,r):t instanceof this.#f.HTMLElement&&n==="data"?r instanceof Object&&Ct(t,r):n==="textContent"?r instanceof Array?t[n]=this.#c(r):t[n]=this.#E(r):((n==="innerText"||n==="value"&&t.tagName==="INPUT"&&(t.getAttribute("type")??"").toLowerCase()==="button")&&(r=this.#E(r)),v(t,n,r))}}#x(t,e){for(const s in e){const n=e[s];let r="";if(n instanceof Function){const h="style",o=n;F(t,h,s,o,null),r=o(t),D()}else r=n;typeof s=="string"&&(t.style[s]=et(s,r))}}#O(t,e,s){const{thisLevel:n,upperLevel:r}=this.#m();return s(e),this.#a({thisLevel:n,upperLevel:r})}#w(t,e,s,n){const{thisLevel:r,upperLevel:h}=this.#m();if(e instanceof Function){const l=this.#s.createComment(`${t}-begin`),c=this.#s.createComment(`${t}-end`);s&&this.#t[r].addElement(l);const a=y=>{if(this.#i)return;const O=this.#t.length-1;this.#t[O].removeAllElements(),this.#d(l),n(y,!1,null,null),this.#g(l,this.#t[O].getElements())||console.error("Element ",l," does not exist anymore")},f=l,E=`--${t}`;F(f,E,"",e,a);const p=e();D(),n(p,!0,l,c),s&&this.#t[r].addElement(c)}else n(e,!1,null,null);return this.#a({thisLevel:r,upperLevel:h})}#l(t,e,s){const{thisLevel:n,upperLevel:r}=this.#m(),h=this.#s.createComment(`${t}-begin`),o=this.#s.createComment(`${t}-end`);this.#t[n].addElement(h);const l=f=>{if(!(f instanceof Object)||this.#i)return;let E=o.renderedElementsMap.length;for(;E--;){const N=o.renderedElementsMap[E];wt(f,N.key)||(N.elements.forEach(A=>{A.remove()}),o.renderedElementsMap=Tt(o.renderedElementsMap,E))}let p=h;const y=[],O=f instanceof Map||f instanceof Set||f instanceof Array?f.keys():Object.keys(f);for(let N of O){if(!(N in f))continue;let A=!1;for(const S of o.renderedElementsMap)if(S.key===N){const{elements:C}=S;p=C.length>0?C[C.length-1]:p,y.push(S),A=!0;break}if(!A){let S=!1;h.parentElement&&(this.#t.push(new L),S=!0);const C=this.#t.length-1,at=s(f,this.#t[C],N);for(const q of at)y.push(q),q.elements.forEach(j=>{C===0&&this.#t[C].moveElementAfterAnother(j,p),p.after(j),p=j});S&&this.#t.pop()}}o.renderedElementsMap=y},c=`-s-${t}`;return F(o,c,"",()=>e,l),o.renderedElementsMap=s(e,this.#t[n]),D(),this.#t[n].addElement(o),this.#a({thisLevel:n,upperLevel:r})}#E(t){if(typeof t=="string"){const e=this.#y(t,this.#o);if(typeof e=="string")return e;const s=ut(),n=this.#y(t,s?.paintorTranslations);if(typeof n=="string")return n}return t}#y(t,e){if(e instanceof Array&&e.length>0){for(const s of e)if(t in s)return s[t]}return!1}#S(t){Object.hasOwn(t,"--subscribed")&&Object.assign(t,{"--deleted":!0});let e=t.childNodes.length;for(;e--;)this.#S(t.childNodes[e])}}function Mt(...i){const t=this;return function(...s){return t.call(this,...i,...s)}}const{prototype:P}=st;Object.assign(P.createElement,{bindArgs:Mt});St.forEach(i=>{P[i]=P.createElement.bindArgs(i)});const At=Object.freeze(["async","autofocus","autoplay","checked","contenteditable","controls","default","defer","disabled","formNoValidate","frameborder","hidden","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","readonly","required","reversed","scoped","selected","typemustmatch"]),Ft=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]),u=Object.freeze({ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11});class k extends Error{constructor(t,e){super(t),this.name=e??"DOMException"}}class b{nextSibling=null;previousSibling=null;textContent="";#t=[];#n="";#s=1;#i=null;constructor(t,e){this.#s=t,this.#n=e}get baseURI(){return""}get childNodes(){return this.#t}get firstChild(){return this.#t[0]??null}get nodeName(){return this.#n}get nodeType(){return this.#s}get parentNode(){return this.#i}set parentNode(t){this.#i=t}appendChild(t){if(this.nodeType!==u.DOCUMENT_NODE&&this.nodeType!==u.DOCUMENT_FRAGMENT_NODE&&this.nodeType!==u.ELEMENT_NODE)throw new k("This node type does not support this method.");if(this.nodeType===u.DOCUMENT_NODE)throw new k("Failed to execute 'appendChild' on 'Node': Only one element on document allowed.");if(!(t instanceof b)){const s="Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.";throw new TypeError(s)}if(this.#t.includes(t))return;if(t===this)throw new k("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");this.#t.push(t),t.parentNode=this;const e=this.#t.length-2;e>=0&&(this.#t[e].nextSibling=t,t.previousSibling=this.#t[e]??null)}contains(){return!1}insertBefore(t,e){const s=[];for(const n of this.#t)n===e&&s.push(t),s.push(n);return this.#t=s,t}removeChild(t){if(!t)throw new Error("Failed to execute 'removeChild' on 'HTMLElement': parameter 1 is not of type 'HTMLElement'.");if(!this.#t.includes(t))throw new Error("Failed to execute 'removeChild' on 'HTMLElement': The node to be removed is not a child of this node.");return this.#t=this.#t.filter(e=>e!==t),t}paintChildren({indent:t=""}){let e="",s=0;for(const n of this.childNodes){s+=1;const r=s>1;e+=it(n,t,"",r)}return e}}class V extends b{constructor(){super(u.COMMENT_NODE,"#comment")}}class z extends b{constructor(){super(u.TEXT_NODE,"#text")}}function nt(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,s=>{let n=s;return s in e&&(n=e[s]),n}),t}function Dt(i){let t="";for(const e of i){const{name:s}=e;let{value:n}=e;At.includes(s)?n!==!1&&n!==0&&n!==void 0&&n!==null&&(t+=` ${s}`):(n instanceof Array?n=n.join(","):n===!0?n="true":n===!1?n="false":n===void 0?n="undefined":n===null?n="null":n instanceof Function?n=`return(${n.toString()}).call(this,window.event)`:n=n.toString(),n=n.replace(/\"/g,'\\"'),n=nt(n),t+=` ${s}="${n}"`)}return t}function Lt(i){let t="";return t=i.replace(/([A-Z])/g,(e,s)=>`-${s.toLowerCase()}`),t}function _t(i){let t="";for(const e in i){const s=i[e];t+=`${Lt(e)}:${s};`}return t.trim()}function it(i,t,e,s=!1){let n="",r="",h="";if(t&&(r=e,h=`
`),i instanceof V)n+=`${h}${r}<!--${i.textContent}-->`;else if(i instanceof z)n+=`${h}${r}${i.textContent}`;else if(i instanceof M){const o=Ft.includes(i.tagName),l=Dt(i.attributes);let c="";Object.keys(i.style).length>0&&(c=` style="${_t(i.style)}"`),s&&(n+=h),n+=r,i.tagName&&(n+=`<${i.tagName.toLowerCase()}${l}${c}`,n+=o?"":">"),n+=i.textContent;let a="";for(const f of i.childNodes)a+=it(f,t,e+t,!0);a&&(n+=a+h+r),i.tagName!==""&&(n+=o?"/>":`</${i.tagName.toLowerCase()}>`)}return n}class $ extends b{#t=[];#n="";constructor(t,e){super(t,e.toUpperCase()),this.#n=e.toUpperCase()}get attributes(){return this.#t}get children(){return this.childNodes.filter(t=>t instanceof $)}get className(){let t="";for(const e of this.#t)if(e.name==="class"){t=e.value;break}return t}set className(t){this.setAttribute("class",t)}get innerHTML(){return this.textContent}set innerHTML(t){this.textContent=t}get tagName(){return this.#n}append(t){t instanceof b?this.appendChild(t):this.textContent=nt(t.toString())}getAttribute(t){let e="";if(e=t.trim().toLowerCase(),!e)return null;const s=this.#t.findIndex(n=>n.name===e);return s===-1?null:this.#t[s].value}remove(){this.parentNode?.removeChild(this)}setAttribute(t,e){let s="";if(s=t.trim().toLowerCase(),!s)return;const n=e,r=this.#t.findIndex(h=>h.name===s);r===-1?this.#t.push({name:s,value:n}):this.#t[r]={name:s,value:n}}}function vt(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,s=>{let n=s;return s in e&&(n=e[s]),n}),t}function kt(i){const t=i.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(e=>e[0].toUpperCase()+e.slice(1)).join("")}function It(i){const t={};return i.split(";").forEach(e=>{const[s,n]=e.split(":");if(!s)return;const r=kt(s.trim());t[r]=n.trim()}),t}let M=class extends ${#t={};constructor(t){super(u.ELEMENT_NODE,t)}get innerText(){return this.textContent}set innerText(t){this.textContent=vt(t.toString())}get style(){return this.#t}set style(t){if(typeof t=="string"){const e=It(t);for(const s in e)this.#t[s]=e[s].toString()}}},rt=class extends b{constructor(){super(u.DOCUMENT_FRAGMENT_NODE,"#document-fragment")}};class $t extends b{ELEMENT_NODE=u.ELEMENT_NODE;ATTRIBUTE_NODE=u.ATTRIBUTE_NODE;TEXT_NODE=u.TEXT_NODE;CDATA_SECTION_NODE=u.CDATA_SECTION_NODE;PROCESSING_INSTRUCTION_NODE=u.PROCESSING_INSTRUCTION_NODE;COMMENT_NODE=u.COMMENT_NODE;DOCUMENT_NODE=u.DOCUMENT_NODE;DOCUMENT_TYPE_NODE=u.DOCUMENT_TYPE_NODE;DOCUMENT_FRAGMENT_NODE=u.DOCUMENT_FRAGMENT_NODE;#t;#n=[];constructor(){super(9,"#document");const t=new M("html"),e=new M("head"),s=new M("body");t.appendChild(e),t.appendChild(s),this.#n.push(t),this.#t=s}get body(){return this.#t}get children(){return this.#n}get parentElement(){return null}createDocumentFragment(){return new rt}createComment(t=""){const e=new V;return e.textContent=t,e}createElement(t){return new M(t)}createTextNode(t){const e=new z;return e.textContent=t,e}}class jt{Comment=V;DocumentFragment=rt;Element=$;HTMLElement=M;Node=b;Text=z;DOMException=k;Error=Error;TypeError=TypeError;document;constructor(){this.document=new $t}}const Ht=w(),Rt=new jt;class m{state=null;#t=[];#n=[];#s="";#i=!1;#e=!1;#u="";#o="";#f=new Map;#a=[];#h=[];getElements(){return this.#g(null,window,!0),this.#n}getElementsSr(){const t=this.#c();return this.#g("",t,!0),this.#n}html(t){if(this.#i)return this.staticHtml(t);const e=this.#c();return this.#g("",e,!0,t),this.#s}paint(t){if(!Ht)throw new Error("You can only use this function in browser environment");if(!t)throw new Error("No container selected.");if(typeof t!="string"&&!(t instanceof HTMLElement)&&!(t instanceof NodeList)&&!(t instanceof Array)&&!(t instanceof HTMLCollection))throw new Error(`Wrong type for the container element. Expected <string> or <Node>, got <${typeof t}>`);this.#g(t,window,!0)}static(t=!0){return this.#i=t,this}staticHtml(t){const e=this.#h[0]??null;if(!this.#f.has(e)){const s=this.#c();this.#g("",s,!0,t),this.#f.set(e,this.#s)}return this.#f.get(e)??""}template(t){}useTemplates(...t){if(t instanceof Array)for(const e of t)if(e instanceof Array)for(const s of e)this.#a.push(s);else this.#a.push(e);return this}useTranslations(...t){return t.map(e=>{e instanceof Array?e.forEach(s=>{this.#h.includes(s)||(this.#h=[...this.#h,s])}):e instanceof Object&&(this.#h.includes(e)||(this.#h=[...this.#h,e]))}),this}#T(){if(this.#t)for(const t of this.#t)for(;t?.firstChild;)t.removeChild(t.firstChild)}#c(){return Rt}#m(t,e,s,n){return this.#n=[],this.#s="",this.#p(t,e),this.#r(s),this.#C(n),!0}#p(t,e){const s=e.document.baseURI==="";if(typeof t=="string"){if(this.#u=t,this.#e=!1,mt(t))this.#e=!0;else if(dt(t)||(this.#o=t),this.#t=s?[e.document.createElement("#container")]:e.document.querySelectorAll(t),!this.#t)throw new Error(`Could not find an element by the following query: ${t}`)}else if(t instanceof HTMLElement)this.#t=[t];else if(t instanceof NodeList||t instanceof HTMLCollection)this.#t=t;else if(t instanceof Array){for(const n of t)if(!(n instanceof HTMLElement))throw new Error("All elements in the input array must be DOM elements");this.#t=t}return!0}#C(t){this.template instanceof Function&&(this.state=this.state?B(this.state):this.state,this.#a.push(this.template.bind(this)));for(let e of t)if(!(e instanceof Function)&&!(e instanceof m))throw new Error("The template must be a function");return!0}#r(t){if(!(t instanceof Array))throw new Error("The argument 'translations' must be an Array");return this.#h=t,!0}#g(t,e,s=!0,n={}){this.#m(t,e,this.#h,this.#a),s&&this.#T();const r=this.#a,h=this.#h;if(!e)throw new Error("Missing window element");if(this.#e){const o=l=>class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){if(!this.shadowRoot)throw new Error("Missing shadow root");l.#d(e,this.shadowRoot,r,h,n)}};customElements.define(this.#u,o(this))}else if(this.#o&&new MutationObserver(l=>{for(const c of l){const a=c.addedNodes;for(let f of a)f instanceof HTMLElement&&f.matches(this.#o)&&this.#d(e,f,r,h,n)}}).observe(document.body,{attributes:!1,childList:!0,characterData:!1,subtree:!0}),this.#t.length===0)this.#d(e,null,r,h,n);else for(const o of this.#t)this.#d(e,o,r,h,n)}#d(t,e,s,n,r={}){const h=new st(t,e,s,n);h.render(),this.#s=h.getHtmlCode(r),this.#n.push(h.getCreatedElements())}}const Pt="modulepreload",Ut=function(i){return"/"+i},Y={},J=function(t,e,s){return t()},Bt=function(){let i="en";return w()&&(i=document.getElementById("html")?.getAttribute("lang")??i),i},Gt=async function(i,t){if(typeof i!="string")throw new Error("Translation path must be a string");let e=null;const s=i.match(/^(.*?)([^.\/\\]+)(.\w+)$/m);if(s===null)throw new TypeError(`Incorrect path: ${i}`);const n=s[1]+t+s[3];try{e=(await J(()=>import(n),void 0)).default}catch{n!==i&&(e=(await J(()=>import(i),void 0)).default)}if(!(e instanceof Object))throw new TypeError(`Translation at ${n} must export an object`);return e},ot=async function(...i){const t=Bt(),e=[];for(let s of i)e.push(Gt(s,t));return Promise.all(e)};function lt(...i){return new m().useTemplates(...i)}function ht(i){return i[_]=!0,i}const ct={component:lt,state:B,template:ht,fetchTranslations:ot,Component:m};exports.Component=m;exports.component=lt;exports.default=ct;exports.fetchTranslations=ot;exports.paintor=ct;exports.state=B;exports.template=ht;
//# sourceMappingURL=paintor.cjs.js.map
